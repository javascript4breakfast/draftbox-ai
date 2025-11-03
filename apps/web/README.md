# Draftbox AI - Web Application

A modern React application for AI-powered image generation. Users can create images from text descriptions with customizable styles, color palettes, formats, and variations.

## 🎯 Overview

Draftbox AI Web is the frontend application that provides an intuitive interface for generating AI images. It connects to a backend API server that handles the actual image generation using AI models (currently Google Gemini 2.5 Flash Image).

## 🏗️ Architecture

### Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Adobe React Spectrum** - UI component library
- **CSS Modules** - Scoped styling

### Project Structure

```
src/
├── components/          # React components
│   ├── ErrorBox/       # Error message display
│   ├── GenerateImagesForm/  # Main form for image generation
│   ├── ImageCard/      # Individual image display card
│   ├── ImageHistory/   # History of generated images
│   ├── NavHeader/      # Navigation header with theme toggle
│   └── Spinner/        # Loading spinner component
├── constants/          # Application constants
│   └── imageOptions.ts # Style, palette, and format options
├── context/            # React Context providers
│   └── ThemeContext.tsx # Theme management (light/dark)
├── hooks/              # Custom React hooks
│   └── useImageGen.ts  # Image generation state management
├── lib/                # Utility libraries
│   └── api.ts          # API client for backend communication
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🔑 Key Features

### 1. Image Generation
- **Text-to-Image**: Generate images from text prompts
- **Multiple Variations**: Generate 1-4 variations per request
- **Customizable Options**:
  - **Styles**: Photorealistic, anime, watercolor, low-poly, isometric, pixel art, 3D render, oil painting
  - **Color Palettes**: Default, pastel, neon, monochrome, earth tones, duotone, vibrant
  - **Formats**: Square (1:1), Landscape (4:3), Portrait (3:4), Widescreen (16:9)

### 2. Image Management
- **History Tracking**: All generated images are stored in browser memory
- **Regeneration**: Re-run the same prompt/options to get new variations
- **Refinement**: Edit prompts or options from existing generations
- **Variation Updates**: Replace existing images with new variations (maintains item ID)

### 3. User Experience
- **Dark/Light Theme**: Toggleable theme with localStorage persistence
- **Responsive Design**: Adapts to different screen sizes
- **Loading States**: Visual feedback during generation
- **Error Handling**: Clear error messages for failed requests
- **Auto-reset Form**: Prompt field clears after successful generation

## 📦 Core Components

### `App.tsx`
Main application component that:
- Manages form state (prompt, style, palette, format, count)
- Handles form submission logic
- Orchestrates child components
- Tracks generation success for form reset
- Provides theme context via React Spectrum Provider

### `GenerateImagesForm`
Form component for inputting generation parameters:
- Text area for prompt input
- Pickers for style, palette, and format selection
- Number field for variation count (1-4)
- Refinement mode indicator
- Submit button with loading state

### `ImageHistory`
Displays all generated images in a scrollable history:
- Shows prompt, metadata, and timestamp for each item
- Grid layout for multiple variations
- Action buttons: Regenerate, Refine, Make 4 variations
- Large image display (400px+ minimum width)

### `useImageGen` Hook
Custom hook managing image generation state:
- **State**: `loading`, `error`, `history`
- **Actions**:
  - `submit()` - Create new generation
  - `regenerate()` - Re-run existing item
  - `refine()` - Generate with edited options
  - `updateItemImages()` - Replace images in existing item

## 🔌 API Integration

### API Client (`lib/api.ts`)

The application communicates with the backend via REST API:

**Endpoint**: `POST /api/generate`

**Request Payload**:
```typescript
{
  prompt: string;
  style?: string;
  palette?: string;
  format?: 'square' | 'landscape' | 'portrait' | 'widescreen';
  n?: number;  // Number of variations (1-4)
}
```

**Response**:
```typescript
{
  dataUrls?: string[];  // Array of base64 data URLs
  error?: string;       // Error message if failed
}
```

The API client:
- Handles request/response serialization
- Manages error states
- Normalizes response format
- Includes debug logging

## 🎨 Styling Architecture

### CSS Modules
Each component has its own CSS module file for scoped styling:
- `*.module.css` - Component-specific styles
- Prevents style conflicts
- Enables CSS variables for theming

### Global Styles
- `index.css` - Base styles and reset
- Ensures full-height layout (html, body, #root)
- CSS custom properties for theming

### Theme System
- React Spectrum Provider handles theme application
- Theme context manages light/dark mode
- Persists theme preference in localStorage

## 🪝 State Management

### Local State (`useState`)
- Form inputs (prompt, style, palette, format, count)
- Refining item tracking
- Component-specific UI state

### Custom Hooks
- **`useImageGen`**: Centralized image generation state
  - History management
  - Loading/error states
  - Generation actions

### Context API
- **`ThemeContext`**: Theme state and toggle function
  - Persists to localStorage
  - Accessible via `useTheme()` hook

## 🚀 Development

### Prerequisites
- Node.js 18+
- pnpm 10.20.0+

### Running Development Server
```bash
pnpm dev
```

The app will be available at `http://localhost:5173` (default Vite port).

### Building for Production
```bash
pnpm build
```

### Preview Production Build
```bash
pnpm preview
```

### Linting
```bash
pnpm lint
```

## 🔄 Data Flow

1. **User Input** → Form state updated in `App.tsx`
2. **Form Submit** → `onSubmit` handler called
3. **API Call** → `useImageGen.submit()` → `api.generateImage()`
4. **Backend Request** → POST to `/api/generate`
5. **Response Processing** → Images extracted from response
6. **State Update** → New item added to history
7. **UI Update** → Components re-render with new data
8. **Form Reset** → Prompt cleared if successful (non-refinement)

## 🎯 Key Workflows

### New Image Generation
1. User enters prompt and selects options
2. Clicks "Generate"
3. Loading state activated
4. API request sent to backend
5. Response received with image data URLs
6. New history item created
7. Form prompt cleared
8. Images displayed in history

### Regeneration
1. User clicks "Regenerate" on existing item
2. Same prompt/options used
3. New images generated
4. New history item created (preserves original)

### Refinement
1. User clicks "Refine" on existing item
2. Form pre-filled with item's values
3. User edits prompt/options
4. Clicks "Refine & Generate"
5. New generation with updated values
6. Form prompt preserved (for further refinement)

### Make 4 Variations
1. User clicks "Make 4 variations" on existing item
2. Same prompt/options used
3. 4 new images generated
4. **Existing item's images replaced** (maintains same ID)
5. No duplicate history entry created

## 🧪 Development Guidelines

### Component Structure
- Each component in its own directory
- `index.tsx` for component implementation
- `*.module.css` for component styles
- TypeScript types defined inline or imported

### Type Safety
- All props are typed
- API responses are typed
- State is typed with TypeScript

### Code Organization
- Constants extracted to `constants/` directory
- Shared types in hooks or lib files
- Context providers in `context/` directory
- Utility functions in `lib/` directory

## 📝 Notes

- History is stored in browser memory (not persisted)
- Images are base64 data URLs (not uploaded to server)
- Theme preference persists across sessions
- Form automatically resets prompt after successful generation (not during refinement)
- Maximum 4 variations per request

## 🔗 Related Documentation

- Root README: `/README.md` - Project overview and setup
- Server README: `/apps/server/README.md` - Backend API documentation
