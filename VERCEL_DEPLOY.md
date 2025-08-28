# 🚀 Vercel Deployment Guide (100% Free)

## 📋 Step-by-Step Instructions:

### 1. **GitHub Repository Ready**
- Make sure your code is pushed to GitHub
- Repository URL: `aniskhan146/AkhanEcommerce`

### 2. **Go to Vercel**
1. Visit: https://vercel.com
2. Click **"Sign Up"** with GitHub
3. Connect your GitHub account

### 3. **Import Project**
1. Click **"New Project"**
2. Search and select: `aniskhan146/AkhanEcommerce`
3. Click **"Import"**

### 4. **Configure Project Settings**

**Framework Preset:** 
```
Other (Keep as default)
```

**Build Command:**
```
vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
```

**Output Directory:**
```
dist
```

**Install Command:**
```
npm install
```

### 5. **Environment Variables**
Click **"Environment Variables"** and add:

```
DATABASE_URL = postgresql://username:password@host:port/database
SESSION_SECRET = AkhanEcommerce2024VercelSecret!@#$%^&*
NODE_ENV = production
```

### 6. **Database Setup (Vercel Postgres)**
1. Go to your Vercel Dashboard
2. Click **"Storage"** tab
3. Click **"Create Database"** → **"Postgres"**
4. Database name: `akhan-ecommerce-db`
5. Region: `Washington, D.C.` (closest to users)
6. Copy the **DATABASE_URL** and paste in Environment Variables

### 7. **Deploy**
1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. Your app will be live!

### 8. **Your Live URLs**
```
Main App: https://akhan-ecommerce.vercel.app
Admin Panel: https://akhan-ecommerce.vercel.app/admin
User Login: https://akhan-ecommerce.vercel.app/profile
```

## ✅ **Default Login Credentials**

**Admin Access:**
- Username: `admin`
- Password: `admin123`

**Users:** Register with email/password

## 🔧 **If Build Fails**

Add these to **Environment Variables**:
```
NPM_CONFIG_LEGACY_PEER_DEPS = true
VERCEL_IGNORE_BUILD_ERRORS = 1
```

## 💰 **Cost: 100% FREE**
- Vercel: Free forever
- Postgres: 60 hours free monthly (enough for development)
- No credit card required for basic usage