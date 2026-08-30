import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client lazily or safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not found in environment. Gemini features will return smart local fallback.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// -------------------------------------------------------------
// 1. API: AI Bike Mechanic & Part Compatibility Diagnoser
// -------------------------------------------------------------
app.post('/api/gemini/diagnose-bike', async (req, res) => {
  try {
    const { bikeModel, issueDescription, currentMods, targetGoal } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      // High-quality local fallback for Moto diagnostic
      return res.json({
        diagnosis: `Analysis for ${bikeModel || 'Street Motorcycle'}: Based on your description ("${issueDescription || 'Power tuning'}"), the primary factor is drivetrain / fuel-air delivery matching.`,
        recommendations: [
          `Inspect CVT roller weights (for Scooters like Click 125, test 9g/11g combo for Marilaque uphill power; for Underbone like XRM 125, check 14T-36T 415 sprocket ratio).`,
          `Check carburetor jetting (Main 115 / Slow 38 for 28mm PWK) or clean fuel injector nozzles.`,
          `Ensure exhaust backpressure is balanced with a high-flow header pipe like Daeng Sai4 or JVT system.`
        ],
        compatiblePartSuggestions: [
          'JVT Performance High-Torque Pulley Set & Drive Face',
          'TDR Racing Ball Weight Roller Set (9g/11g)',
          'Keihin PWK 28mm Black Edition Carburetor'
        ],
        safetyTips: 'Always torque cylinder head bolts to factory specifications and inspect brake pads before high-speed testing.'
      });
    }

    const systemInstruction = `You are "MotoMech AI", an expert Filipino motorcycle mechanic, street bike tuner, and parts specialist specializing in Southeast Asian underbones (Honda XRM 110/125, Wave 125, Suzuki Raider 150, Smash 115) and automatic scooters (Honda Click 125i/160, Beat Fi, Yamaha Mio Sporty/i125, Aerox 155, NMAX 155). 
Provide practical, spot-on mechanical advice, CVT flyball tuning combinations, sprocket gear ratios (415/428), bore-up guidelines (59mm/63mm), carburetor jetting, and troubleshooting tips. Write in an approachable, knowledgeable Filipino-English (Taglish/English) tone with clear formatting.`;

    const prompt = `Bike Model: ${bikeModel || 'General Underbone/Scooter'}
Current Issue / Symptom: ${issueDescription || 'Looking for best upgrade parts'}
Current Modifications: ${currentMods || 'Stock Engine'}
Target Goal: ${targetGoal || 'Better acceleration, hill climbing power, and high-speed reliability'}

Please provide:
1. Diagnosis / Mechanical Explanation
2. Step-by-step tuning & parts recommendation (specify flyball weights or sprocket teeth if applicable)
3. 3 specific recommended parts
4. Important maintenance/safety tip`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return res.json({
      text: response.text || 'Diagnostic completed. Please review recommended parts below.'
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/diagnose-bike:', error);
    return res.status(500).json({
      error: 'Failed to process AI diagnostic.',
      details: error.message
    });
  }
});

// -------------------------------------------------------------
// 2. API: AI General Motorcycle Chat Assistant
// -------------------------------------------------------------
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, chatHistory } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        reply: `Salamat sa tanong! For street bikes like Honda XRM 125, Click 125, Raider 150, at Mio: Karaniwang solusyon sa dragging ay pag-linis ng CVT bell at pag-tono ng bola (flyballs). For underbones, check chain slack and spark plug electrode gap. May specific part ka bang hinahanap?`
      });
    }

    const systemInstruction = `You are MotoStreet PH's official AI Parts Expert & Mechanic Assistant. You assist customers looking to buy motorcycle parts for scooters (Honda Click 125i/160, Beat, Aerox 155, NMAX) and underbones (Honda XRM 125, Wave 125, Raider 150, Sniper 155). You guide them on PayMongo GCash payments, order tracking, seller registration, and compatibility questions. Friendly, concise, helpful, and technically accurate.`;

    const contents = [];
    if (Array.isArray(chatHistory)) {
      for (const msg of chatHistory.slice(-6)) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message || 'Hello' }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: contents as any,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return res.json({
      reply: response.text || 'Pano kita matutulungan sa pyesa ng motor mo?'
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/chat:', error);
    return res.status(500).json({
      error: 'Failed to generate chat response',
      details: error.message
    });
  }
});

// -------------------------------------------------------------
// 3. API: PayMongo Payment Intent & Source Creation (GCash / Card)
// -------------------------------------------------------------
app.post('/api/paymongo/create-source', async (req, res) => {
  try {
    const { amount, paymentMethod, trackingNumber, customerInfo } = req.body;
    const paymongoKey = process.env.PAYMONGO_SECRET_KEY;

    // If live PayMongo secret key exists, communicate directly with PayMongo API
    if (paymongoKey && !paymongoKey.includes('sk_test_...')) {
      const authHeader = 'Basic ' + Buffer.from(paymongoKey + ':').toString('base64');
      const response = await fetch('https://api.paymongo.com/v1/sources', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          data: {
            attributes: {
              amount: Math.round(Number(amount) * 100), // In centavos
              currency: 'PHP',
              type: paymentMethod === 'gcash' ? 'gcash' : 'grab_pay',
              redirect: {
                success: `${process.env.APP_URL || 'http://localhost:3000'}/?status=success&tracking=${trackingNumber}`,
                failed: `${process.env.APP_URL || 'http://localhost:3000'}/?status=failed`
              }
            }
          }
        })
      });

      const data = await response.json();
      return res.json(data);
    }

    // Interactive & fully functional simulation response for instant sandbox testing
    const simulatedSourceId = 'src_' + Math.random().toString(36).substring(2, 12);
    const checkoutUrl = `https://test-paymongo.gcash.sim/checkout?source=${simulatedSourceId}&amount=${amount}&ref=${trackingNumber}`;

    return res.json({
      status: 'success',
      simulated: true,
      data: {
        id: simulatedSourceId,
        type: 'source',
        attributes: {
          amount: Math.round(Number(amount) * 100),
          currency: 'PHP',
          status: 'chargeable',
          type: paymentMethod || 'gcash',
          redirect: {
            checkout_url: checkoutUrl,
            success: `/?status=success&tracking=${trackingNumber}`,
            failed: `/?status=failed`
          }
        }
      },
      message: 'PayMongo test environment transaction registered successfully.'
    });
  } catch (error: any) {
    console.error('Error in /api/paymongo/create-source:', error);
    return res.status(500).json({ error: 'PayMongo gateway error', details: error.message });
  }
});

// PayMongo Webhook Handler
app.post('/api/paymongo/webhook', (req, res) => {
  const event = req.body?.data;
  console.log('PayMongo Webhook Event Received:', event?.attributes?.type);
  // In production, update Supabase order status to 'paid'
  res.json({ received: true });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'MotoStreet PH Parts & PayMongo Backend',
    timestamp: new Date().toISOString()
  });
});

// -------------------------------------------------------------
// Vite Middleware / Static Server
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏍️ MotoStreet PH Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
