# Aari - AI Travel Assistant for Kodaikanal

## Overview

Aari is an AI-powered travel assistant web application focused on Kodaikanal tourism. The platform enables users to plan trips, explore tours, and book cab services through an interactive AI chat interface. The application features a modern landing page with comprehensive sections showcasing trip planning capabilities, cab booking, personalized user profiles, and testimonials.

**Primary Purpose**: Provide travelers with an intelligent, conversational assistant for planning and booking Kodaikanal trips, combining tour recommendations with transportation services in a seamless user experience.

**Tech Stack**: React + TypeScript frontend with Express.js backend, using Vite for build tooling and Tailwind CSS with shadcn/ui components for styling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server with HMR (Hot Module Replacement)
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query (React Query)** for server state management and data fetching

**UI Component System**
- **shadcn/ui** components built on Radix UI primitives for accessible, customizable UI elements
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Framer Motion** for animations and transitions throughout the landing page
- **CSS Variables** for theming with a purple color scheme ("Aari Purple Theme")

**Design System**
- Custom typography using Plus Jakarta Sans and Inter fonts
- Consistent spacing primitives based on Tailwind's scale (4, 6, 8, 12, 16, 20, 24, 32)
- Component variants using class-variance-authority for systematic styling
- Purple primary color theme (270° hue) with carefully crafted light mode palette

**State Management Pattern**
- Local component state with React hooks for UI interactions
- React Query for server data caching and synchronization
- No global state management library (Redux/Zustand) - keeping state local where possible

**Routing Strategy**
- Simple routing with Wouter (lightweight alternative to React Router)
- Currently implements only landing page and 404 routes
- Designed for easy expansion to additional pages

### Backend Architecture

**Server Framework**
- **Express.js** with TypeScript for the REST API server
- HTTP server created with Node's native `http` module
- Custom logging middleware for request/response tracking

**Application Structure**
- **Modular route registration** pattern via `registerRoutes()` function
- **Storage interface abstraction** (`IStorage`) allowing swappable implementations
- **In-memory storage** (`MemStorage`) currently implemented for user data
- Static file serving for production build artifacts

**Development vs Production**
- Development: Vite middleware integration for HMR and asset serving
- Production: Compiled static assets served from `dist/public`
- Build process bundles server code with esbuild, selectively bundling dependencies to reduce syscalls

**API Design Philosophy**
- RESTful endpoints with `/api` prefix
- Placeholder structure ready for CRUD operations
- Storage interface pattern enables easy migration to database implementation

### Data Storage

**Current Implementation**
- **In-memory storage** using JavaScript Maps for user data
- Implements `IStorage` interface with methods: `getUser`, `getUserByUsername`, `createUser`
- UUID-based user IDs using Node's crypto module

**Database Schema (Prepared but Not Active)**
- **Drizzle ORM** configured for PostgreSQL with schema definitions
- User table schema defined in `shared/schema.ts` with username/password fields
- **Neon Database** client (`@neondatabase/serverless`) included in dependencies
- Migration system configured via `drizzle-kit` pointing to `./migrations`

**Design Decision**: The application is architected for easy database integration. The storage interface abstraction allows switching from in-memory to PostgreSQL by implementing `IStorage` with Drizzle ORM queries without changing consuming code.

### Component Architecture

**Page Structure**
- Single-page application with modular section components
- Landing page composed of distinct sections: Hero, Popular Trips, Trip Planning Demo, Cab Booking, Profile Builder, Feature Highlights, Testimonials, How It Works, Final CTA, Footer

**Reusable Components**
- **AariLogo**: SVG-based animated logo component
- **Hint**: Interactive tooltip component with hover/click functionality
- Comprehensive shadcn/ui component library (40+ components) for buttons, cards, dialogs, forms, etc.

**Mock Data Pattern**
- Components currently use mock data (trips, vehicles, testimonials) marked with `// todo: remove mock functionality`
- Designed for easy replacement with API calls when backend endpoints are implemented

### Authentication & Authorization

**Prepared Infrastructure**
- User schema with username/password fields defined
- Zod validation schemas (`insertUserSchema`) for input validation
- Dependencies included: `passport`, `passport-local`, `jsonwebtoken`, `express-session`
- **Not currently implemented** - authentication routes and middleware need to be added

### Build & Deployment Strategy

**Build Process**
1. Client build: Vite compiles React app to `dist/public`
2. Server build: esbuild bundles Express server to `dist/index.cjs`
3. Selective dependency bundling: Common dependencies bundled, others externalized

**Bundle Optimization**
- Allowlist of dependencies to bundle reduces filesystem syscalls
- Improves cold start performance in serverless/container environments
- Includes: database clients, authentication libraries, common utilities

**Environment Configuration**
- Development: `NODE_ENV=development` with Vite middleware
- Production: `NODE_ENV=production` serving static files
- Database URL expected via `DATABASE_URL` environment variable

## External Dependencies

### Core Dependencies

**Frontend Runtime**
- `react` & `react-dom`: UI framework
- `@tanstack/react-query`: Server state management
- `wouter`: Client-side routing
- `framer-motion`: Animation library

**UI Component Libraries**
- `@radix-ui/*` (20+ packages): Accessible component primitives
- `tailwindcss`: Utility-first CSS framework
- `class-variance-authority`: Component variant styling
- `lucide-react`: Icon library
- `react-icons`: Additional icon sets (social media icons)

**Form Handling**
- `react-hook-form`: Form state management
- `@hookform/resolvers`: Form validation integration
- `zod`: Schema validation
- `drizzle-zod`: Database schema to Zod conversion

**Database & ORM**
- `drizzle-orm`: TypeScript ORM
- `drizzle-kit`: Migration tooling
- `@neondatabase/serverless`: Neon PostgreSQL client (prepared for future use)

**Backend Framework**
- `express`: Web server framework
- `cors`: CORS middleware
- `express-session`: Session management
- `connect-pg-simple`: PostgreSQL session store

**Authentication (Prepared)**
- `passport` & `passport-local`: Authentication middleware
- `jsonwebtoken`: JWT token generation
- `bcryptjs`: Password hashing (implied by auth setup)

**Build Tools**
- `vite`: Build tool and dev server
- `esbuild`: Server-side bundler
- `typescript` & `tsx`: TypeScript execution
- `@vitejs/plugin-react`: React support for Vite

**Development Tools**
- `@replit/vite-plugin-runtime-error-modal`: Error overlay
- `@replit/vite-plugin-cartographer`: Code mapping (Replit-specific)
- `@replit/vite-plugin-dev-banner`: Development banner (Replit-specific)

### Third-Party Services (Prepared but Not Integrated)

**Payment Processing**
- `stripe`: Payment gateway for cab bookings

**AI/ML Services**
- `openai`: OpenAI API client
- `@google/generative-ai`: Google Generative AI (Gemini)

**Communication**
- `nodemailer`: Email sending
- `ws`: WebSocket support for real-time features

**Utilities**
- `date-fns`: Date manipulation
- `nanoid` & `uuid`: Unique ID generation
- `axios`: HTTP client
- `multer`: File upload handling
- `xlsx`: Excel file processing

### Design Assets

**Fonts** (Google Fonts CDN)
- Plus Jakarta Sans: Primary heading font
- DM Sans: Body text font
- Fira Code & Geist Mono: Monospace fonts
- Architects Daughter: Display font

**Images**
- Unsplash CDN for stock travel imagery
- Generated avatar images for testimonials stored in `attached_assets/generated_images/`
- Hero image: Santorini sunset (`santorini_sunset_hero_image.png`)

### Configuration Files

- `components.json`: shadcn/ui configuration (New York style, neutral base color)
- `tailwind.config.ts`: Tailwind customization with design tokens
- `tsconfig.json`: TypeScript configuration with path aliases
- `vite.config.ts`: Vite build configuration with plugin setup
- `drizzle.config.ts`: Database migration configuration
- `postcss.config.js`: PostCSS with Tailwind and Autoprefixer