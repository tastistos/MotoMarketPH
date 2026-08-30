export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- MotoStreet PH - PostgreSQL / Supabase Complete Database Schema & DDL
-- For Motorcycle Parts Marketplace (Underbone & Scooter Tuning)
-- Includes: Users, Sellers (with GCash), Products, Orders, Reviews, Payouts
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS for order & payment statuses
CREATE TYPE order_status_enum AS ENUM ('placed', 'processing', 'shipped', 'in_transit', 'delivered', 'cancelled');
CREATE TYPE payment_status_enum AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE payment_method_enum AS ENUM ('gcash', 'paymongo_card', 'maya', 'qrph', 'cod');
CREATE TYPE bike_type_enum AS ENUM ('underbone', 'scooter', 'universal');
CREATE TYPE product_condition_enum AS ENUM ('Brand New', 'Performance Tuned', 'Mint 2nd Hand');

-- 3. PROFILES / USERS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(30),
    gcash_number VARCHAR(30), -- GCash mobile number for buyers/sellers
    delivery_address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    avatar_url TEXT,
    saved_bike_model VARCHAR(100) DEFAULT 'Honda Click 125i',
    is_seller BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SELLERS TABLE (Linked to GCash Payouts)
CREATE TABLE IF NOT EXISTS public.sellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    store_name VARCHAR(150) NOT NULL,
    owner_name VARCHAR(150) NOT NULL,
    gcash_account_number VARCHAR(30) NOT NULL, -- Payouts sent here
    gcash_account_name VARCHAR(150) NOT NULL,
    store_location VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3,2) DEFAULT 5.00,
    total_sales_count INT DEFAULT 0,
    total_earnings_php NUMERIC(12,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. PRODUCTS TABLE (Underbone & Scooter Motorcycle Parts)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES public.sellers(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    category VARCHAR(80) NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10,2),
    stock_quantity INT NOT NULL DEFAULT 1 CHECK (stock_quantity >= 0),
    condition product_condition_enum DEFAULT 'Brand New',
    compatible_bikes TEXT[] NOT NULL DEFAULT '{}', -- e.g. ARRAY['Honda XRM 125', 'Honda Click 125i']
    image_url TEXT NOT NULL,
    additional_images TEXT[] DEFAULT '{}',
    description TEXT NOT NULL,
    specifications JSONB DEFAULT '{}'::jsonb,
    rating NUMERIC(3,2) DEFAULT 5.00,
    review_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    customer_gcash_number VARCHAR(30),
    shipping_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    courier_name VARCHAR(100) DEFAULT 'J&T Express Moto',
    subtotal NUMERIC(10,2) NOT NULL,
    shipping_fee NUMERIC(10,2) NOT NULL DEFAULT 120.00,
    discount_amount NUMERIC(10,2) DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_method payment_method_enum NOT NULL,
    payment_status payment_status_enum DEFAULT 'pending',
    paymongo_payment_intent_id VARCHAR(120),
    order_status order_status_enum DEFAULT 'placed',
    estimated_delivery_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    seller_id UUID REFERENCES public.sellers(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(10,2) NOT NULL,
    product_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. PRODUCT REVIEWS & STAR RATINGS TABLE
CREATE TABLE IF NOT EXISTS public.product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name VARCHAR(150) NOT NULL,
    user_avatar TEXT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    bike_model VARCHAR(100),
    is_verified_purchase BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. GCASH SELLER PAYOUTS TABLE
CREATE TABLE IF NOT EXISTS public.gcash_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    gcash_reference_no VARCHAR(100),
    payout_status VARCHAR(50) DEFAULT 'COMPLETED',
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. INDEXES FOR HIGH-SPEED PRODUCT SEARCH & FITMENT QUERIES
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_compatible_bikes ON public.products USING GIN(compatible_bikes);
CREATE INDEX IF NOT EXISTS idx_orders_tracking ON public.orders(tracking_number);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.product_reviews(product_id);

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

-- Allow public read of products & reviews
CREATE POLICY "Public products are viewable by everyone" 
ON public.products FOR SELECT USING (true);

CREATE POLICY "Public reviews are viewable by everyone" 
ON public.product_reviews FOR SELECT USING (true);

CREATE POLICY "Anyone can create product reviews" 
ON public.product_reviews FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can place orders" 
ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view active sellers" 
ON public.sellers FOR SELECT USING (true);
`;

export const VERCEL_DEPLOYMENT_GUIDE = `### 🚀 Step-by-Step Vercel Deployment Instructions

Follow these steps to host MotoStreet PH on **Vercel** with full backend and serverless support:

#### Step 1: Push your Code to GitHub
\`\`\`bash
# 1. Initialize git (if not done)
git init
git add .
git commit -m "Initial MotoStreet PH Underbone & Scooter Marketplace commit"

# 2. Add remote GitHub repo and push
git branch -M main
git remote add origin https://github.com/your-username/motostreet-ph.git
git push -u origin main
\`\`\`

#### Step 2: Import into Vercel Dashboard
1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard) and sign in.
2. Click **"Add New..."** > **"Project"**.
3. Select your repository (\`motostreet-ph\`) and click **"Import"**.

#### Step 3: Configure Project Build Settings
- **Framework Preset**: \`Vite\`
- **Root Directory**: \`./\`
- **Build Command**: \`npm run build\`
- **Output Directory**: \`dist\`
- **Install Command**: \`npm install\`

#### Step 4: Add Environment Variables in Vercel
In the Vercel project configuration, expand the **Environment Variables** section and add:
- \`GEMINI_API_KEY\` = Your Google AI Studio Gemini API Key
- \`PAYMONGO_SECRET_KEY\` = \`sk_test_...\` (From PayMongo dashboard)
- \`PAYMONGO_PUBLIC_KEY\` = \`pk_test_...\` (From PayMongo dashboard)
- \`SUPABASE_URL\` = \`https://your-project.supabase.co\`
- \`SUPABASE_ANON_KEY\` = \`eyJhbGciOiJIUzI1Ni... (Supabase Project Anon Key)\`

#### Step 5: Deploy & Custom Domain
1. Click **"Deploy"**. Vercel will build your static bundle and provision the edge routes.
2. In **Settings > Domains**, you can bind your custom domain (e.g. \`motostreet.ph\`).
`;

export const PAYMONGO_SETUP_GUIDE = `### 💳 PayMongo Gateway Configuration & GCash Integration Guide

MotoStreet PH uses **PayMongo** to accept Philippine payments: **GCash**, **Maya**, **Cards (Visa/Mastercard)**, and **QR PH (BPI, UnionBank, RCBC, GCash QR)**.

#### Step 1: Register for a PayMongo Merchant Account
1. Visit [https://dashboard.paymongo.com/signup](https://dashboard.paymongo.com/signup) and complete merchant onboarding.
2. For testing, toggle the switch to **"Test Mode"** at the top right of the PayMongo dashboard.

#### Step 2: Retrieve API Keys
1. In the PayMongo Dashboard, go to **Developers** > **API Keys**.
2. Copy your **Public Key** (\`pk_test_...\`) and **Secret Key** (\`sk_test_...\`).
3. Store \`PAYMONGO_SECRET_KEY\` in your \`.env\` or Vercel Environment Variables.

#### Step 3: Create Payment Intent & Payment Source
PayMongo handles GCash checkout via the Payment Intent & Sources API:
\`\`\`ts
// Server-side Payment Intent creation
const response = await fetch('https://api.paymongo.com/v1/sources', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64')
  },
  body: JSON.stringify({
    data: {
      attributes: {
        amount: Math.round(orderTotalInPHP * 100), // in Centavos (e.g., PHP 1850.00 = 185000)
        currency: 'PHP',
        type: 'gcash',
        redirect: {
          success: \`\${process.env.APP_URL}/checkout/success?tracking=\${trackingNumber}\`,
          failed: \`\${process.env.APP_URL}/checkout/failed\`
        }
      }
    }
  })
});
\`\`\`

#### Step 4: Webhook Configuration for Automatic Order Fulfillment
1. In PayMongo Dashboard, go to **Developers** > **Webhooks**.
2. Click **"Add Webhook"** and enter your server URL: \`https://your-domain.com/api/paymongo/webhook\`.
3. Select listening events: \`source.chargeable\`, \`payment.paid\`, \`payment.failed\`.
4. When a customer confirms GCash OTP on their phone, PayMongo pings your webhook and automatically marks the order as **PAID** and updates seller GCash balances.
`;

export const VOICEFLOW_SETUP_GUIDE = `### 🤖 Voiceflow AI Motorcycle Support Assistant Integration

To embed Voiceflow interactive AI assistant widget into MotoStreet PH:

1. Create a project in [Voiceflow Creator](https://creator.voiceflow.com/).
2. Train the assistant with motorcycle parts specs (XRM 125 bore specs, Click 125 flyball weight charts, carburetor jetting rules).
3. In Voiceflow, click **Publish** > **Web Chat** and copy your **Project ID**.
4. The widget integrates with Voiceflow snippet in \`index.html\` or directly through our built-in Gemini Moto Mechanic dialog.
`;

export const TECH_GUIDES: Record<string, {
  title: string;
  description: string;
  language: string;
  snippet: string;
  steps: string[];
}> = {
  github: {
    title: 'GitHub Repository Setup & Upload',
    description: 'Commands to initialize and push your clean MotoStreet PH project to your GitHub account.',
    language: 'bash',
    snippet: `# 1. Initialize git in the root folder
git init
git add .
git commit -m "feat: MotoStreet PH Underbone & Scooter Marketplace complete release"

# 2. Link your GitHub remote
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/motostreet-ph.git

# 3. Push to GitHub
git push -u origin main`,
    steps: [
      'Create a new GitHub repository at https://github.com/new named "motostreet-ph"',
      'Run the git commands above to push all source code, models, and server routes',
      'Ensure .env is gitignored and .env.example is provided for collaborators'
    ]
  },
  vercel: {
    title: 'Vercel Serverless Hosting Configuration',
    description: 'Deploy the full stack React SPA + Express / Serverless API routes on Vercel.',
    language: 'json',
    snippet: `{
  "version": 2,
  "name": "motostreet-ph",
  "builds": [
    { "src": "package.json", "use": "@vercel/static-build" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}`,
    steps: [
      'Login to Vercel (https://vercel.com) and click "Add New Project"',
      'Import the GitHub repository you created in the previous step',
      'Set the Build Command to "npm run build" and Output Directory to "dist"',
      'Add your GEMINI_API_KEY and PAYMONGO_SECRET_KEY in Vercel Settings > Environment Variables',
      'Click Deploy and receive your live production URL (e.g. motostreet.vercel.app)'
    ]
  },
  supabase: {
    title: 'Supabase PostgreSQL Schema & RLS',
    description: 'Full database DDL for Products, Orders, Profiles, GCash Payouts, and Product Reviews.',
    language: 'sql',
    snippet: SUPABASE_SQL_SCHEMA,
    steps: [
      'Open your Supabase Project Dashboard (https://supabase.com/dashboard)',
      'Navigate to the SQL Editor tab on the left sidebar',
      'Click "New query", paste the SQL schema above, and click "RUN"',
      'Verify that profiles, sellers, products, orders, order_items, and product_reviews tables are created with RLS enabled',
      'Copy your Supabase Project URL and Anon API Key into your environment'
    ]
  },
  paymongo: {
    title: 'PayMongo & GCash Payment Gateway',
    description: 'Accept GCash, Maya, Cards, and QR PH with automated webhook verification and seller payouts.',
    language: 'typescript',
    snippet: PAYMONGO_SETUP_GUIDE,
    steps: [
      'Sign up at https://dashboard.paymongo.com and toggle Test Mode',
      'Retrieve your Secret API Key (sk_test_...) and Public Key (pk_test_...) from the Developers tab',
      'Add PAYMONGO_SECRET_KEY to your server environment variables',
      'Configure the PayMongo Webhook pointing to /api/paymongo/webhook to listen for source.chargeable and payment.paid'
    ]
  },
  voiceflow: {
    title: 'Voiceflow AI Motorcycle Assistant',
    description: 'Embed conversational AI assistant trained on motorcycle tuning, parts fitment, and order support.',
    language: 'javascript',
    snippet: VOICEFLOW_SETUP_GUIDE,
    steps: [
      'Create a free project on https://creator.voiceflow.com',
      'Add dialogue flows for "CVT Tuning", "Bore Kit Fitment", "Order Tracking", and "GCash FAQs"',
      'Publish to Production and copy your Voiceflow Web Chat Project ID',
      'Paste the Voiceflow script into index.html or toggle the Voiceflow engine in the chat modal'
    ]
  },
  gemini: {
    title: 'Gemini AI Live Tuning Diagnostics API',
    description: 'Server-side Express router utilizing @google/genai SDK for real-time mechanical advice.',
    language: 'typescript',
    snippet: `import { GoogleGenAI } from '@google/genai';
import express from 'express';

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/api/gemini/chat', async (req, res) => {
  const { message } = req.body;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: message,
    config: {
      systemInstruction: "You are MotoStreet PH's AI Master Mechanic. You specialize in underbone and scooter motorcycle tuning (Honda XRM 125, Click 125/160, Raider 150, Wave 125, Aerox, NMAX). Give direct, technically accurate tuning advice."
    }
  });
  res.json({ reply: response.text });
});`,
    steps: [
      'Obtain a Gemini API key from Google AI Studio (https://aistudio.google.com)',
      'Store GEMINI_API_KEY securely in server-side environment variables',
      'The Express server routes /api/gemini/chat and /api/gemini/diagnostics automatically power the chatbot and rider matcher'
    ]
  }
};

