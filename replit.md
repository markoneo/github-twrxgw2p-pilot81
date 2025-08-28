# RidePilot - Transportation Management System

## Overview

RidePilot is a comprehensive web-based transportation scheduling and management system designed for small to medium-sized transportation agencies. The application provides trip scheduling, driver management, customer tracking, and financial reporting capabilities through an intuitive interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API for global state
- **Routing**: React Router for client-side navigation
- **Charts & Visualization**: Chart.js with react-chartjs-2
- **Animations**: Framer Motion for smooth UI transitions
- **Maps**: Leaflet with react-leaflet for location services

### Backend Architecture
- **Runtime**: Node.js 20 with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL 16 (configured for Neon serverless)
- **Authentication**: Supabase Auth for user management
- **API**: RESTful API with Express routes

### Development Environment
- **Platform**: Replit with auto-scaling deployment
- **Module System**: ES modules throughout
- **TypeScript**: Strict type checking enabled
- **Hot Reload**: Vite HMR for development

## Key Components

### Core Features
1. **Trip Management**: Schedule, edit, and track transportation trips
2. **Driver Portal**: Dedicated dashboard for drivers to view assignments
3. **Company Management**: Multi-company support with custom branding
4. **Vehicle Types**: Configurable car types with capacity settings
5. **Financial Tracking**: Payment status, driver fees, and revenue reporting
6. **Customer Management**: Client information and booking tracking
7. **Voucher Generation**: Printable/shareable trip vouchers
8. **Analytics**: Comprehensive reporting and statistics

### Database Schema
- **Users**: Authentication and user management
- **Companies**: Transportation company records
- **Drivers**: Driver information with PIN authentication
- **Car Types**: Vehicle categories and specifications
- **Projects**: Trip/booking records with status tracking
- **Payments**: Financial transaction tracking

### UI Components
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Component Library**: Reusable UI components with consistent styling
- **Theme System**: Company-specific color themes and branding
- **Error Boundaries**: Graceful error handling and user feedback
- **Progressive Enhancement**: Works across different device capabilities

## Data Flow

1. **Authentication**: Users authenticate via Supabase Auth
2. **Data Context**: React Context provides centralized state management
3. **Real-time Updates**: Context refreshes data on auth state changes
4. **API Communication**: Frontend communicates with Express backend
5. **Database Operations**: Drizzle ORM handles PostgreSQL interactions
6. **State Synchronization**: UI updates reactively to data changes

## External Dependencies

### Core Libraries
- **@supabase/supabase-js**: Authentication and real-time features
- **@neondatabase/serverless**: PostgreSQL connection for serverless
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **react-router-dom**: Client-side routing
- **framer-motion**: Animation library

### UI Libraries
- **@radix-ui/***: Primitive UI components
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **chart.js**: Data visualization
- **leaflet**: Interactive maps

### Development Tools
- **typescript**: Type safety
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution
- **esbuild**: Fast JavaScript bundler

## Deployment Strategy

### Development
- **Command**: `npm run dev`
- **Server**: Vite dev server with HMR
- **Port**: 5000 (mapped to external port 80)
- **Environment**: NODE_ENV=development

### Production Build
- **Frontend Build**: `vite build` outputs to `dist/public`
- **Backend Build**: `esbuild` bundles server to `dist/index.js`
- **Deployment**: Auto-scaling on Replit
- **Environment**: NODE_ENV=production

### Database
- **Migrations**: Drizzle migrations in `/migrations` directory
- **Schema**: Shared schema definitions in `shared/schema.ts`
- **Connection**: Environment variable `DATABASE_URL` required

## Changelog

- June 27, 2025: Enhanced button usability improvements
  - Made project card action buttons larger with text labels and detailed explanations
  - Enhanced voucher generator controls with bigger icons and clear purpose descriptions
  - Improved user experience with self-explanatory button interfaces
  - Added comprehensive tooltips for all interactive elements
  - Implemented proper trip workflow: Start Trip → Complete Trip → History status progression
  - Added completion badges for finished trips
- June 26, 2025: Migration from Bolt to Replit completed
  - Installed all required dependencies (React Router, charts, leaflet maps, Supabase client)
  - Configured Supabase connection with user credentials
  - Created enhanced list view component with expand/collapse functionality
  - Added view toggle between grid, list, and analytics modes
  - Preserved existing Supabase data connection as requested
- June 26, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.