# EaseMyTrip Planner

A modern AI-powered trip planning application built with React, TypeScript, and Tailwind CSS.

## Project info

**URL**: https://lovable.dev/projects/de15928a-b8e9-4942-b070-ea1636d6de6c

## Features

- 🎯 **Landing Page** - Hero section with CTA
- 📝 **5-Step Onboarding** - Dates, Budget, Themes, Constraints, Departure City
- 💬 **AI Chat Assistant** - Interactive trip planning chat
- 📅 **Itinerary Planner** - Split-pane interface with real-time updates
- 🌤️ **Weather Forecasts** - Per-day weather information
- 💰 **Cost Breakdown** - Detailed budget tracking
- 🗺️ **Map Integration** - Visual trip planning (placeholder)
- 🛒 **Checkout Flow** - Complete booking experience
- 🔗 **Share & Download** - Share trips and export to PDF (placeholder)
- 🌐 **Multi-language** - Support for EN, HI, TE

## Quick Start

### Installation

```bash
# Install dependencies
npm install
# or
pnpm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
# or
pnpm dev
```

The app will be available at `http://localhost:8080`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── AppBar.tsx      # Top navigation
│   ├── ChatDock.tsx    # Chat interface
│   ├── TripProgress.tsx
│   └── ...
├── pages/              # Route pages
│   ├── Landing.tsx
│   ├── Onboarding.tsx
│   ├── Planner.tsx
│   ├── ItineraryDetail.tsx
│   ├── Checkout.tsx
│   └── Share.tsx
├── store/              # Zustand state management
│   └── itinerary.store.ts
├── lib/                # Utilities
│   ├── api.ts
│   ├── featureFlags.ts
│   └── canvasDelta.ts
├── theme/              # Design tokens
│   └── tokens.ts
└── index.css           # Global styles & design system
```

## Environment Variables

- `VITE_API_BASE` - API endpoint (default: http://localhost:3000/api)
- `VITE_FLAG_USE_MOCKS` - Enable mock data (default: true)
- `VITE_DEFAULT_LOCALE` - Default language (default: en)

## How can I edit this code?

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/de15928a-b8e9-4942-b070-ea1636d6de6c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Vercel Deployment (Recommended)

This project is already configured for Vercel with `vercel.json`. Deploy in 3 steps:

1. **Go to [vercel.com](https://vercel.com)** and sign up/login with GitHub
2. **Click "New Project"** → Import your GitHub repository
3. **Click "Deploy"** - That's it! 🚀

Your app will be live at: `your-app-name.vercel.app`

**Via Vercel CLI:**
```bash
npm i -g vercel
vercel
```

**Environment Variables** (set in Vercel dashboard → Settings → Environment Variables):
- `VITE_API_BASE` - Your backend API URL
- `VITE_FLAG_USE_MOCKS` - Set to `true` for mock data

**Alternative:** Use [Lovable](https://lovable.dev/projects/de15928a-b8e9-4942-b070-ea1636d6de6c) and click Share → Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
