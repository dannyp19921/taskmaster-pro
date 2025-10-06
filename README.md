# TaskMaster Pro

A modern task management application built with React Native and Expo, featuring cross-platform support for web, iOS, and Android.

## Features

- User authentication (login/register)
- Create, edit, and delete tasks
- Task categorization and prioritization
- Filter and search functionality
- Dashboard with statistics
- Dark/Light theme support
- Cross-platform (Web, iOS, Android)
- Over-the-air (OTA) updates via EAS

## Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Hooks & Context API
- **Navigation**: React Navigation
- **Deployment**: EAS Build & EAS Update
- **UI**: Custom component library with theming

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- EAS CLI (`npm install -g eas-cli`)
- Expo Go app (for mobile testing)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd taskmaster-pro
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npx expo start
```

5. Run on your preferred platform:
- Press `w` for web
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app for physical device

## Building for Production

### Android APK (Preview Build)

```bash
eas build --platform android --profile preview
```

This creates an installable APK for testing on Android devices.

### Publishing Updates (OTA)

After building your initial APK, you can push code updates instantly:

```bash
eas update --branch preview --message "Description of changes"
```

Users will receive updates automatically on next app launch.

## Project Structure

```
taskmaster-pro/
├── src/
│   ├── core/                # Core infrastructure
│   │   ├── api/            # API clients (Supabase)
│   │   ├── theme/          # Theme provider and styling
│   │   └── config/         # App configuration (reserved for future use)
│   ├── navigation/         # Navigation setup (React Navigation)
│   ├── features/           # Feature modules (business logic)
│   │   └── tasks/
│   │       ├── components/ # Feature-specific UI components
│   │       ├── hooks/      # Custom hooks (useTasks, useTaskFilters)
│   │       └── types/      # TypeScript type definitions
│   ├── screens/            # Screen components
│   ├── components/         # Shared/reusable UI components
│   └── shared/             # Shared utilities
│       └── utils/          # Helper functions (validation, alerts, etc.)
├── App.tsx                 # Root component
├── .env                    # Environment variables (not in git)
├── .env.example            # Environment template (commit this)
└── eas.json               # EAS Build & Update configuration
```

## Architecture

The application follows a **feature-based architecture** with clear separation of concerns:

### Core Infrastructure (`src/core/`)
- **API Layer** (`core/api/`): Supabase client configuration with environment validation
- **Theme System** (`core/theme/`): Centralized theming with dark/light mode support
- **Configuration** (`core/config/`): Reserved for app constants and feature flags

### Navigation (`src/navigation/`)
- Clean separation of routing logic from screens
- React Navigation setup with authentication flow
- Type-safe navigation parameters

### Features (`src/features/`)
- **Feature-based organization**: Related code grouped together
- **Business logic in hooks**: Separation from UI components
- **Co-location principle**: Components, hooks, and types live together

### Screens vs Components
- **Screens** (`src/screens/`): Container components that orchestrate features
- **Feature Components** (`src/features/*/components/`): Feature-specific presentational components
- **Shared Components** (`src/components/`): Reusable UI components used across features

### Architecture Benefits
- **Scalability**: Easy to add new features without affecting existing code
- **Maintainability**: Clear structure makes code easy to find and modify
- **Testability**: Isolated business logic in hooks
- **Cross-platform**: Shared logic works identically on web, iOS, and Android

## Database Schema

The application uses Supabase with the following main table:

**tasks**
- id (uuid, primary key)
- title (text, required)
- description (text, optional)
- due_date (date, required)
- priority (enum: Low, Medium, High)
- category (text, optional)
- status (enum: open, completed)
- user_id (uuid, foreign key to auth.users)
- created_at (timestamp with time zone)

**Note**: Row Level Security (RLS) is enabled to ensure users can only access their own tasks.

## Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web

### Code Style

- TypeScript for type safety
- Functional components with React Hooks
- Custom hooks for business logic
- Separation of concerns (UI, business logic, services)
- Theme-based styling for dark/light mode support

## Security

- Environment variables for sensitive credentials
- Supabase anon key is safe for client-side use (designed to be public)
- Row Level Security (RLS) enabled on all database tables
- User authentication required for all task operations
- Type-safe queries prevent SQL injection

## Testing

The application has been tested on:
- Web browsers (Chrome, Firefox, Safari)
- Android devices (via EAS Build APK)
- Expo Go (development testing)

## Deployment

### Web
Deploy the web build to any static hosting service (Vercel, Netlify, etc.)

### Mobile
- Use EAS Build for creating production APKs/IPAs
- Distribute Android APK directly or via Google Play Store
- iOS requires Apple Developer Program ($99/year) for distribution

## Future Improvements

- iOS build and TestFlight distribution
- Push notifications for task reminders
- Calendar integration
- Task sharing and collaboration
- Recurring tasks
- Data export functionality
- Offline mode with sync

## License

This project is for portfolio purposes.

## Author

Created as a portfolio project demonstrating full-stack development skills with React Native, TypeScript, Supabase, and modern mobile development practices.