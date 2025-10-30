# Life Automation

An AI-powered full-stack application that generates personalized daily plans including exercises, meals, and routines. The system learns from your historical patterns and preferences to create intelligent, context-aware recommendations using Google's Gemini AI.

## Features

- **AI-Generated Daily Plans**: Get personalized exercise routines, meal plans, and daily routines
- **Historical Pattern Learning**: AI analyzes your past habits to create relevant recommendations
- **Cross-Platform**: iOS, Android, and Web support via React Native + Expo
- **Per-User Data Isolation**: Each user gets a dedicated Firestore database
- **Real-time Sync**: Changes sync across all devices using Firebase
- **Customizable Prompts**: Fine-tune AI generation per collection (exercises, meals, routines)

## Architecture

- **Backend**: FastAPI (Python) with Google Cloud Firestore
- **Frontend**: React Native + Expo (cross-platform)
- **AI**: Google Vertex AI (Gemini models)
- **Authentication**: Firebase Auth
- **Database**: Firestore with per-user isolation
- **Deployment**: Google Cloud Run (backend), Expo (frontend)

## Project Structure

```
life-automation/
├── backend/              # FastAPI server
│   ├── api.py           # REST API endpoints
│   ├── models/          # Pydantic models with AI integration
│   ├── clients/         # Vertex AI client wrapper
│   └── migrations/      # Database migrations
├── frontend/            # React Native + Expo app
│   ├── components/      # UI components
│   ├── models/          # TypeScript models
│   ├── services/        # Firebase and API client
│   └── e2e-tests/       # Playwright E2E tests
└── aiapps/              # Marketing website (React)
```

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 16+
- Firebase project with Auth and Firestore enabled
- Google Cloud project with Vertex AI enabled

### Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Set up environment variables
# Create .env file with:
# - GOOGLE_APPLICATION_CREDENTIALS
# - Firebase configuration

# Run locally
uvicorn api:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install

# Run on your preferred platform
npm start          # Start Expo dev server
npm run android    # Android
npm run ios        # iOS
npm run web        # Web browser
```

### Marketing Site

```bash
cd aiapps
npm install
npm start          # http://localhost:3000
```

## Development

### Backend

**API Endpoints:**
- `GET /unique/{collection}` - Get unique items across dates
- `GET /{collection}/{document}` - Retrieve specific document
- `POST /{collection}/{document}` - Create/update document
- `POST /build-with-ai/{collection}/{id}` - Generate with AI

**Collections:** `exercises`, `meals`, `routines`, `settings`

**Deploy to Cloud Run:**
```bash
cd backend
./deploy.bat  # Windows
```

### Frontend

**Run E2E Tests:**
```bash
cd frontend
npm test                    # All Playwright tests
npm run test:ui             # Playwright UI mode
npm run test:headed exercise.spec.ts  # Specific test
```

**Format Code:**
```bash
npm run format              # Auto-format all files
npm run format:check        # Check formatting
```

## Authentication Flow

1. User signs in via Firebase Auth
2. Frontend sends Firebase token in Authorization header
3. Backend validates token and creates user-specific Firestore database
4. Database naming: `{initials}-{user_id}`
5. All requests use user's isolated database

## AI Generation

The system uses a base `FirestoreDoc` class that provides:

1. **Historical Context**: Fetches past data for pattern recognition
2. **Structured Output**: Uses Pydantic schemas for validation
3. **Customizable Prompts**: Per-collection AI prompts stored in Firestore
4. **Debug Logging**: All AI interactions saved to `backend/outputs/`

**Example Flow:**
```
POST /build-with-ai/exercises/2025-01-15
→ Fetch historical exercises
→ Combine with user notes + system prompt
→ Call Gemini with Pydantic schema
→ Validate and save to Firestore
→ Return ExercisesList
```

## Environment Variables

### Backend
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to service account JSON
- `PORT`: Server port (default: 8000)
- `LOCALDEV`: Force local URLs even with PORT set

### Frontend
- Firebase config in `frontend/services/Firebase.ts`
- API base URL auto-detected (local vs production)

## Tech Stack

### Backend
- FastAPI - Web framework
- Pydantic - Data validation
- Firebase Admin - Authentication
- Google Cloud Firestore - Database
- Google Vertex AI - Gemini integration

### Frontend
- Expo - Cross-platform framework
- React Native - Mobile framework
- React Native Paper - Material Design UI
- Redux Toolkit - State management
- Axios - HTTP client
- Playwright - E2E testing

## License

[Your License Here]

## Contributing

[Your Contributing Guidelines Here]
