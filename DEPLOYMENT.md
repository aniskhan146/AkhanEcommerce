# 🚀 Render Deployment Guide

## Quick Setup

### 1. **GitHub Repository**
Make sure your code is pushed to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. **Render Dashboard Setup**

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `aniskhan146/AkhanEcommerce`

### 3. **Build & Deploy Settings**

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

**Environment Variables:**
```
NODE_ENV=production
DATABASE_URL=[Your PostgreSQL URL from Render]
SESSION_SECRET=[Random secure string]
PORT=5000
```

### 4. **Database Setup**

1. Create PostgreSQL database on Render
2. Copy the **Internal Database URL**
3. Add it as `DATABASE_URL` environment variable
4. Run migration: `npm run db:push` (manually via Render shell)

### 5. **Post-Deployment**

After successful deployment:
- Admin Panel: `https://your-app.onrender.com/admin`
- User Login: `https://your-app.onrender.com/profile`
- Main App: `https://your-app.onrender.com`

## Default Credentials

**Admin Access:**
- Username: `admin`
- Password: `admin123`

**User Registration:**
- Users can register with email/password
- Separate from admin system

## Notes

- Free tier may have cold starts (app sleeps after inactivity)
- Database migrations run automatically on first deployment
- Static files served from `/dist/public` directory
- API routes available at `/api/*`

## Troubleshooting

**Build Issues:**
```bash
# Check build locally
npm run build

# Check if dist folder is created
ls -la dist/
```

**Database Issues:**
```bash
# Run migrations manually
npm run db:push

# Check database connection
echo $DATABASE_URL
```

**Environment Issues:**
- Ensure all environment variables are set
- Check Render logs for specific errors
- Verify PostgreSQL connection string format