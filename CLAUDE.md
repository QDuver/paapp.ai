# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Life Automation is a full-stack application for personalized daily planning using AI. It generates and tracks daily exercises, meals, and routines based on historical data and user preferences. The system uses Google's Gemini AI to create intelligent, context-aware recommendations.

**Architecture:**
- **Backend:** FastAPI (Python) with Google Cloud Firestore
- **Frontend:** React Native + Expo (cross-platform: iOS, Android, Web)
- **AI Integration:** Google Vertex AI (Gemini models)
- **Authentication:** Firebase Auth
- **Database:** Firestore (per-user isolated databases)

## Repository Structure

```
life-automation/
├── backend/              # FastAPI server
│   ├── api.py           # Main API endpoints
│   ├── main.py          # Entry point for local testing
│   ├── config.py        # Environment and Firestore configuration
│   ├── models/          # Pydantic models for data structures
│   │   ├── abstracts.py # Base FirestoreDoc class with AI integration
│   │   ├── exercises.py
│   │   ├── meals.py
│   │   ├── routines.py
│   │   ├── settings.py
│   │   └── users.py
│   ├── clients/
│   │   └── vertex.py    # Gemini AI client wrapper
│   ├── migrations/      # Database migration scripts
│   └── Dockerfile       # Docker config for Cloud Run
├── frontend/            # React Native + Expo app
│   ├── App.js           # Main entry point
│   ├── components/      # UI components (auth, cards, settings)
│   ├── models/          # TypeScript models mirroring backend
│   ├── services/        # Firebase and API client
│   ├── contexts/        # React Context providers
│   └── e2e-tests/       # Playwright E2E tests
└── aiapps/              # Marketing website (React)
```

## Development Commands

### Backend

**Setup:**
```bash
cd backend
pip install -r requirements.txt
```

**Run locally:**
```bash
cd backend
uvicorn api:app --reload --port 8000
```

**Deploy to Cloud Run:**
```bash
cd backend
./deploy.bat  # Windows deployment script
```

**Test endpoints with auth:**
- Set Authorization header: `Bearer <firebase_token>`
- Example in main.py:712-28 shows manual testing with curl

### Frontend

**Setup:**
```bash
cd frontend
npm install
```

**Run development server:**
```bash
cd frontend
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web browser
```

**Run E2E tests:**
```bash
cd frontend
npm test                    # Run all Playwright tests
npm run test:ui             # Run with Playwright UI
npm run test:headed exercise.spec.ts  # Run specific test in headed mode
npm run test:debug          # Run in debug mode
```

**Code formatting:**
```bash
cd frontend
npm run format              # Format all files
npm run format:check        # Check formatting
```

### Marketing Website (aiapps)

**Setup and run:**
```bash
cd aiapps
npm install
npm start          # Development server at http://localhost:3000
npm run build      # Production build
npm test           # Run tests
```

## Core Architecture Patterns

### Backend: Model-Driven AI Generation

The backend uses an abstract `FirestoreDoc` base class (backend/models/abstracts.py:14-84) that provides:

1. **Historical Context:** `historics()` method retrieves past data for AI context
2. **AI Generation:** `build_with_ai()` method generates new content using:
   - Historical data patterns
   - User-provided notes
   - Collection-specific prompts from Firestore settings
   - Pydantic schemas for structured output
3. **Per-User Isolation:** Each user gets a dedicated Firestore database (backend/config.py:66-79)

**Example: Exercise Generation Flow**
```python
# Client calls: POST /build-with-ai/exercises/{date}
# 1. Fetches historical exercises before date
# 2. Combines with user notes and system prompt
# 3. Calls Gemini with Pydantic schema for validation
# 4. Saves generated exercises to Firestore
# 5. Returns structured ExercisesList
```

### Backend: API Structure

All CRUD operations follow RESTful patterns in backend/api.py:

- `GET /unique/{collection}` - Get unique items across all dates
- `GET /{collection}/{document}` - Retrieve specific document
- `POST /{collection}/{document}` - Create/update document
- `POST /build-with-ai/{collection}/{id}` - Generate with AI

Collections: `exercises`, `meals`, `routines`, `settings`

### Frontend: Multi-Platform Architecture

The frontend uses React Native with Expo for cross-platform compatibility:

- **Entry Point:** frontend/App.js initializes Firebase and wraps app with providers
- **Main Shell:** frontend/components/MainApp.tsx manages bottom navigation (Routines, Exercises, Meals)
- **Model Pattern:** TypeScript models (frontend/models/) mirror backend Pydantic models
- **Context API:** AppContext manages data fetching/state; DialogContext handles modals
- **Card-Based UI:** CardList.tsx displays items, EditDialog.tsx handles editing

### Authentication Flow

1. User signs in via Firebase Auth (frontend/components/auth/LoginScreen.tsx)
2. Token sent in Authorization header to backend
3. Backend validates token (backend/models/users.py:50-54)
4. User object created with `fs_name` computed property (initials + user_id)
5. Config sets user-specific Firestore database (backend/config.py:66-79)
6. Database auto-created if doesn't exist (backend/config.py:72-77)

### AI Integration: Vertex AI Client

The `Agent` class (backend/clients/vertex.py) wraps Google Gemini:

- Supports text and image contexts
- Enforces JSON output with Pydantic schema validation
- Auto-saves all LLM interactions to backend/outputs/ for debugging
- Configurable models per collection (e.g., gemini-2.5-pro for exercises)

## Important Implementation Notes

### Firestore Per-User Isolation
- Each user has a unique database: `{initials}-{user_id}` (backend/models/users.py:42-47)
- CONFIG.USER_FS is set per request (backend/config.py:66-79)
- Database creation happens lazily on first access

### Historical Data Pattern
- Documents are keyed by date (YYYY-MM-DD format)
- AI generation uses `historics()` to fetch past patterns (backend/models/abstracts.py:38-49)
- Ensures consistency in data structure across time

### Model Validation
- Backend uses Pydantic for request/response validation
- Frontend TypeScript models should match backend structure
- AI outputs are validated against Pydantic schemas before saving

### Environment Detection
- Backend detects local vs Cloud Run via environment variables (backend/config.py:26-50)
- Different base URLs for local development vs production
- LOCALDEV environment variable forces local URL even with PORT set

### Testing Strategy
- Frontend uses Playwright for E2E tests (frontend/e2e-tests/)
- Tests focus on web platform
- Backend testing done manually via main.py with real auth tokens

## Key Files Reference

**Backend:**
- `backend/api.py` - All API endpoints
- `backend/models/abstracts.py:14-84` - Base class with AI generation
- `backend/clients/vertex.py:10-68` - Gemini AI wrapper
- `backend/config.py:53-81` - Configuration and per-user DB setup
- `backend/models/users.py:27-54` - User model with Firebase auth

**Frontend:**
- `frontend/App.js` - Application entry point and Firebase initialization
- `frontend/components/MainApp.tsx` - Main navigation shell
- `frontend/models/Abstracts.ts` - Base model class with API integration
- `frontend/services/Firebase.ts` - Firebase configuration
- `frontend/utils/apiClient.ts` - Backend API client
- `frontend/contexts/AppContext.tsx` - Global state management

## Coding Preferences

### ❌ Don't Do This

- Don't add unnecessary complexity or over-engineer solutions. Keep the architecture simple and maintainable.
- Don't add comments.

### ✅ Do This

<!-- Add preferred practices here -->

## Dependencies

**Backend Python packages:**
- fastapi, uvicorn - Web framework and server
- pydantic - Data validation
- firebase-admin - Firebase authentication
- google-cloud-firestore - Database
- google-genai - Vertex AI integration

**Frontend npm packages:**
- expo - Cross-platform framework
- react-native - Mobile framework
- react-native-paper - Material Design UI
- @reduxjs/toolkit - State management
- firebase - Authentication and backend
- axios - HTTP client
- @playwright/test - E2E testing
