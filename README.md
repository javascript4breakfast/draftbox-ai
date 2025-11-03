# Draftbox AI

A web-based AI Design Agent that generates images from text descriptions using Google Gemini 2.5 Flash Image. Create multiple variations, refine results, and iterate on designs with customizable styles, color palettes, and formats.

## 🚀 Features

- **Text-to-Image Generation**: Generate images from natural language descriptions
- **Multiple Variations**: Create 1-4 variations per request
- **Customizable Output**: Control style (photorealistic, anime, watercolor, etc.), color palette, and format (square, landscape, portrait, widescreen)
- **Iterative Design**: Regenerate, refine, or create variations from existing images
- **History Management**: View and manage all generated images in a scrollable history
- **Dark/Light Theme**: Toggleable theme with persistent preferences

## 📋 Prerequisites

- **Node.js** v18 or higher
- **pnpm** v10.20.0 or higher
- **Google Gemini API Key** (get one at [Google AI Studio](https://aistudio.google.com/))

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd draftbox-ai
pnpm install
```

### 2. Configure Backend API Key

Create a `.env` file in the `apps/server/` directory:

```bash
cd apps/server
touch .env
```

Add your Google Gemini API key to the `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

**Getting an API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and paste it into your `.env` file

### 3. Run Development Servers

From the root directory, start both frontend and backend:

```bash
pnpm dev
```

This will start:
- **Backend Server** at `http://localhost:3001`
- **Frontend App** at `http://localhost:5173`

### Alternative: Mock Mode (No API Key Required)

For development or testing without an API key, enable mock mode:

```env
# In apps/server/.env
MOCK=1
```

This returns placeholder images instead of calling the AI API.

### Individual App Commands

**Backend:**
```bash
cd apps/server
pnpm dev        # Development server
pnpm build      # Build for production
pnpm start      # Run production build
pnpm typecheck  # Type check
```

**Frontend:**
```bash
cd apps/web
pnpm dev        # Development server
pnpm build      # Build for production
pnpm preview    # Preview production build
pnpm lint       # Run linter
```

## 📖 Usage Guide

### Generating Your First Image

1. **Open the app** at `http://localhost:5173`
2. **Enter a prompt** in the text area (e.g., "a modern website layout for a taco truck")
3. **Customize options** (optional):
   - **Style**: Choose from photorealistic, anime, watercolor, pixel art, etc.
   - **Color Palette**: Select pastel, neon, monochrome, earth tones, etc.
   - **Format**: Choose square, landscape, portrait, or widescreen
   - **Variations**: Select 1-4 variations to generate
4. **Click "Generate"** and wait for the images to appear
5. **View results** in the history section below the form

### Working with Generated Images

**Regenerate**: Click "Regenerate" on any history item to create new variations with the same prompt and settings.

**Refine**: Click "Refine" to:
- Pre-fill the form with the item's values
- Edit the prompt or change style/palette/format
- Generate a new version with your changes

**Make 4 Variations**: Click "Make 4 variations" to replace the existing images with 4 new variations (maintains the same history item, no duplicates).

**Download**: Click "Download" on any image to save it to your device.

**Theme Toggle**: Use the theme toggle in the navigation header to switch between light and dark modes.

## 🏗️ Architecture

### Project Structure

```
draftbox-ai/
├── apps/
│   ├── server/              # Backend API (Hono + Node.js)
│   │   └── src/
│   │       ├── index.ts     # Main server entry point
│   │       ├── env.ts       # Environment validation
│   │       └── routes/      # API route handlers
│   │           └── generate.ts  # Image generation endpoint
│   └── web/                 # Frontend (React + Vite)
│       └── src/
│           ├── components/  # React components
│           ├── hooks/       # Custom hooks (useImageGen)
│           ├── lib/         # API client
│           ├── context/     # Theme context
│           └── constants/  # App constants
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

### Core Components

**Backend (`apps/server`):**
- **Hono Framework**: Lightweight web framework
- **API Endpoint**: `POST /api/generate` - Main image generation endpoint
- **Google Gemini Integration**: Calls Gemini 2.5 Flash Image API
- **Mock Mode**: Development mode that returns placeholder images

**Frontend (`apps/web`):**
- **App.tsx**: Main application orchestrator, manages form state
- **GenerateImagesForm**: Input form with prompt, style, palette, format selectors
- **ImageHistory**: Displays generated images in scrollable history
- **useImageGen Hook**: Manages generation state, history, and API calls
- **ThemeContext**: Manages light/dark theme with localStorage persistence

### Data Flow

1. **User Input** → Form state in `App.tsx`
2. **Form Submit** → `useImageGen.submit()` called
3. **API Request** → `POST /api/generate` with prompt and options
4. **Backend Processing**:
   - Validates prompt
   - Constructs enhanced prompt (adds style/palette instructions)
   - Calls Google Gemini API `n` times (for variations)
   - Extracts base64 image data
   - Returns array of data URLs
5. **Frontend Processing**:
   - Receives data URLs
   - Creates new history item
   - Updates UI with new images
   - Clears form prompt (on success)

### Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Adobe React Spectrum
- **Backend**: Hono, Node.js, TypeScript, Google Gemini SDK
- **Build**: Turbo, pnpm workspaces
- **Styling**: CSS Modules, React Spectrum themes

## 🎯 Focus & Trade-offs

### Where I Invested Effort

**Backend Reliability & Image Quality**
- Spent significant effort building a robust backend that generates relevant, high-quality images
- Implemented comprehensive error handling for API failures and edge cases
- Built intelligent prompt construction that combines user prompts with style/palette instructions
- Added detailed logging for debugging generation issues
- Created a reliable variation system that can generate 1-4 images per request
- Ensured proper aspect ratio handling for different formats

**User Experience**
- Focused on making image generation intuitive with clear form controls
- Built an iterative workflow (regenerate, refine, variations) for design iteration
- Implemented automatic form reset after successful generation
- Added theme support for better user experience
- Created responsive layouts that work on different screen sizes

### Trade-offs Made

- **No Persistence**: History is stored in browser memory only (lost on refresh)
- **No Authentication**: Currently open for anyone to use
- **Limited Frontend Features**: Focused on core generation workflow over advanced UI features
- **No Payment System**: No way to monetize or limit usage

### What's Next

**Frontend Enhancements**
- Build out more frontend features for a richer user experience
- Add image editing capabilities (crop, filters, adjustments)
- Implement image collections/favorites
- Add sharing functionality
- Create gallery views and better organization

**Authentication & Monetization**
- Implement user authentication system
- Add user accounts with persistent history
- Build subscription/paywall service
  - Free tier with limited generations
  - Paid tiers with higher generation limits
  - Usage tracking and billing integration
- Add user profiles and preferences

**Additional Features**
- Image storage (currently uses data URLs)
- Batch processing
- Advanced prompt templates
- Image-to-image generation
- Integration with design tools

## 📚 Documentation

- **[Backend Documentation](./apps/server/README.md)** - Detailed API documentation and server architecture
- **[Frontend Documentation](./apps/web/README.md)** - Component structure and frontend architecture

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Run all apps
pnpm dev

# Build all apps
pnpm build

# Type check
pnpm typecheck

# Lint
pnpm lint
```

## 📝 License

ISC
