# Draftbox AI - Backend Server

A lightweight API server for AI-powered image generation. Built with Hono and integrated with Google Gemini 2.5 Flash Image API to generate images from text descriptions.

## 🎯 Overview

The Draftbox AI server is a RESTful API that handles image generation requests from the web application. It processes text prompts with optional styling parameters and returns generated images as base64-encoded data URLs.

## 🏗️ Architecture

### Tech Stack

- **Hono** - Fast, lightweight web framework
- **Node.js** - Runtime environment
- **TypeScript** - Type safety
- **@google/genai** - Google Gemini AI SDK
- **@hono/node-server** - Node.js adapter for Hono
- **dotenv** - Environment variable management

### Project Structure

```
src/
├── index.ts    # Main server file with routes and logic
└── env.ts      # Environment variable validation (optional)
```

## 🔑 API Endpoints

### `GET /health`
Health check endpoint.

**Response**: `200 OK`
```
ok
```

### `GET /`
Basic welcome endpoint.

**Response**: `200 OK`
```
Hello from Hono 👋
```

### `POST /api/generate`
Main image generation endpoint.

**Request Body**:
```typescript
{
  prompt: string;                    // Required: Text description of desired image
  style?: string;                     // Optional: Style (photorealistic, anime, etc.)
  palette?: string;                   // Optional: Color palette (default, pastel, etc.)
  format?: 'square' | 'landscape' |  // Optional: Image aspect ratio
           'portrait' | 'widescreen';
  n?: number;                        // Optional: Number of variations (1-4, default: 1)
}
```

**Success Response**: `200 OK`
```typescript
{
  dataUrls: string[];  // Array of base64 data URLs (e.g., "data:image/png;base64,...")
}
```

**Error Responses**:
- `400 Bad Request` - Missing or invalid prompt
  ```json
  { "error": "Missing prompt" }
  ```
- `500 Internal Server Error` - Generation failed
  ```json
  { "error": "Generation failed" }
  ```
- `502 Bad Gateway` - Model returned no image
  ```json
  { "error": "Model returned no image" }
  ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in `apps/server/` directory:

```env
# Server Configuration
PORT=3001                    # Server port (default: 3001)

# AI Configuration
GEMINI_API_KEY=your_api_key  # Required: Google Gemini API key

# Development Mode
MOCK=0                       # Set to "1" to enable mock mode (bypasses AI API)
```

### Mock Mode

When `MOCK=1`, the server returns placeholder SVG images instead of calling the AI API. This is useful for:
- Development without API credentials
- Testing the frontend
- Reducing API costs during development

Mock images include:
- Variation number (1/n)
- Truncated prompt text
- Format ratio information

## 🚀 Development

### Prerequisites
- Node.js 18+
- pnpm 10.20.0+
- Google Gemini API key (or use MOCK mode)

### Running Development Server

```bash
cd apps/server
pnpm dev
```

The server will start at `http://localhost:3001` (or the port specified in `PORT` env var).

### Building for Production

```bash
pnpm build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Running Production Build

```bash
pnpm start
```

### Type Checking

```bash
pnpm typecheck
```

## 🔄 Request Flow

1. **Client Request** → POST to `/api/generate` with prompt and options
2. **Validation** → Server validates prompt presence and parses parameters
3. **Prompt Construction** → Combines base prompt with style/palette instructions
4. **Generation Loop** → Calls AI API `n` times (1-4) for variations
5. **Image Extraction** → Extracts base64 data from API response
6. **Format Conversion** → Converts to data URLs with appropriate MIME type
7. **Response** → Returns array of data URLs to client

## 🎨 Prompt Processing

The server intelligently constructs the final prompt sent to the AI model:

1. **Base Prompt**: User's text description
2. **Style**: Appended as `"Style: {style}."` if provided
3. **Color Palette**: Appended as `"Color palette: {palette}."` if provided and not "default"
4. **Final Prompt**: All parts joined with spaces, empty parts filtered out

**Example**:
```
Input:
{
  prompt: "a cat",
  style: "anime",
  palette: "neon"
}

Final Prompt: "a cat Style: anime. Color palette: neon."
```

## 📐 Format Mapping

The server maps format options to aspect ratios for the AI model:

| Format     | Aspect Ratio | Model Parameter |
|------------|--------------|-----------------|
| square     | 1:1          | `1:1`           |
| landscape  | 4:3          | `4:3`           |
| portrait   | 3:4          | `3:4`           |
| widescreen | 16:9         | `16:9`          |

## 🤖 AI Integration

### Google Gemini 2.5 Flash Image

The server uses Google's Gemini 2.5 Flash Image model for generation:

- **Model**: `gemini-2.5-flash-image`
- **Response Modality**: Image only
- **Aspect Ratio**: Configurable based on format parameter
- **Response Format**: Inline base64-encoded image data

### Error Handling

The server handles various error scenarios:

- **Missing Images**: If an iteration fails to return an image, it logs a warning and continues
- **No Results**: If all iterations fail, returns 502 error
- **API Errors**: Catches exceptions and returns 500 error with generic message
- **Validation Errors**: Returns 400 for missing or invalid prompts

## 📊 Logging

The server includes comprehensive logging for debugging:

- `[server] Received request: n=X, parsed n=Y` - Request validation
- `[server] Starting generation loop: n=X` - Generation start
- `[server] Generating image X/Y` - Per-iteration progress
- `[server] Warning: No image part found for iteration X` - Missing image warning
- `[server] Successfully added image X, total results: Y` - Success per image
- `[server] Generation complete: X images generated (requested Y)` - Completion summary
- `[generate] error: ...` - Error logging

## 🔒 Security Considerations

### CORS

CORS is enabled for all routes to allow the frontend to make requests:
```typescript
app.use('*', cors());
```

### Input Validation

- Prompt is required and trimmed
- Variation count (`n`) is clamped to 1-4 range
- Empty strings are filtered from prompt construction
- Format defaults to 'square' if invalid

### API Key Security

- API key is read from environment variables only
- Never logged or exposed in responses
- Mock mode allows development without real API key

## 🧪 Testing with Mock Mode

To test without API credentials:

1. Set `MOCK=1` in `.env` file
2. Restart the server
3. All requests will return placeholder SVG images

Mock images are deterministic and include:
- Variation index
- Truncated prompt text
- Format ratio
- SVG format for universal compatibility

## 🔄 Multiple Variations

When `n > 1`, the server:

1. Loops `n` times (up to 4)
2. Makes separate API calls for each variation
3. Each call uses the same prompt but may produce different results
4. Collects all successful results
5. Returns array of all generated images

**Note**: Each variation is a separate API call, so generation time scales with `n`.

## 📝 Code Structure

### Main Server File (`index.ts`)

```typescript
// Configuration
const PORT = Number(process.env.PORT || 3001);
const MOCK = process.env.MOCK === '1';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Format mapping
const FORMAT_TO_RATIO: Record<string, string> = { ... };

// Hono app setup
const app = new Hono();
app.use('*', cors());

// Routes
app.get('/health', ...);
app.get('/', ...);
app.post('/api/generate', ...);

// Server start
serve({ fetch: app.fetch, port: PORT }, ...);
```

### Key Functions

1. **Request Parsing**: Safely parses JSON body with fallback
2. **Prompt Construction**: Combines user prompt with style/palette
3. **Generation Loop**: Iterates `n` times, collecting results
4. **Image Extraction**: Finds and extracts base64 data from API response
5. **Error Handling**: Catches and formats errors appropriately

## 🛠️ Development Guidelines

### Adding New Features

1. **New Routes**: Add to Hono app with appropriate method
2. **New Parameters**: Extend `GenBody` type and validation
3. **New Formats**: Add to `FORMAT_TO_RATIO` mapping
4. **Error Handling**: Always return JSON with error message

### Type Safety

- All request/response types are defined
- TypeScript ensures type correctness
- Runtime validation for critical parameters

### Environment Variables

- Always provide defaults for optional vars
- Validate required vars on startup
- Use `dotenv/config` for automatic loading

## 📦 Dependencies

### Production
- **hono**: Web framework
- **@hono/node-server**: Node.js server adapter
- **@google/genai**: Google Gemini AI SDK
- **dotenv**: Environment variable loader

### Development
- **typescript**: Type checking and compilation
- **ts-node**: TypeScript execution for development
- **@types/node**: Node.js type definitions

## 🔗 Related Documentation

- Root README: `/README.md` - Project overview
- Web README: `/apps/web/README.md` - Frontend documentation
- [Hono Documentation](https://hono.dev/)
- [Google Gemini API](https://ai.google.dev/)

## 📋 Notes

- Default port is 3001 (configurable via `PORT` env var)
- Maximum 4 variations per request (`n` is clamped)
- Images are returned as base64 data URLs (not file uploads)
- Mock mode is useful for development and testing
- All routes have CORS enabled for frontend access
- Server logs are useful for debugging generation issues

