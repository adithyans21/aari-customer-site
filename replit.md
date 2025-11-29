# WanderWisdom - AI Travel Assistant for Kodaikanal

## Overview

WanderWisdom (branded as "Aari") is an AI-powered travel planning web application focused on Kodaikanal tourism. The platform provides an interactive landing page showcasing AI-driven trip planning capabilities, tour recommendations, cab booking features, and personalized travel profiles. Currently in landing page phase with mock data and demo interactions.

**Primary Purpose**: Market and demonstrate an intelligent travel assistant concept through an engaging, visually-rich landing page that communicates the value proposition of AI-powered travel planning for Kodaikanal.

**Tech Stack**: React 18 + TypeScript frontend with Express.js backend foundation, Vite build tooling, Tailwind CSS with shadcn/ui components, Framer Motion animations, and PostgreSQL database schema (currently using in-memory storage).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as build tool with HMR (Hot Module Replacement) for fast development iteration
- **Wouter** for lightweight client-side routing (currently only landing page and 404 routes)
- Path aliases configured for clean imports: `@/` for client code, `@shared/` for shared types, `@assets/` for static assets

**UI Component System**
- **shadcn/ui** component library built on Radix UI primitives providing accessible, unstyled base components
- **Tailwind CSS** utility-first styling with extensive customization via CSS variables
- **Framer Motion** for scroll-based animations, page transitions, and interactive effects throughout landing page
- Design system follows "new-york" shadcn style variant with custom purple theme (270° hue)

**State Management Strategy**
- **TanStack Query (React Query)** for server state management and data fetching with aggressive caching (`staleTime: Infinity`)
- Local component state via React hooks for UI interactions
- No global state library - state kept local and lifted only when necessary
- Custom query client configured with credential inclusion for future authentication

**Styling & Theming**
- Purple primary color scheme (270° hue) branded as "Aari Purple Theme"
- Light mode only with carefully crafted color palette using HSL values
- CSS custom properties for all theme colors enabling easy theming
- Typography system using Plus Jakarta Sans and Inter fonts from Google Fonts
- Consistent spacing scale based on Tailwind primitives (4, 6, 8, 12, 16, 20, 24, 32)
- Custom shadow system with multiple elevation levels
- Border radius tokens: lg (9px), md (6px), sm (3px)

**Component Architecture**
- Landing page split into discrete section components: Hero, PopularTrips, TripPlanningDemo, CabBookingSection, ProfileBuilder, FeatureHighlights, Testimonials, HowItWorks, FinalCTA, Footer
- Reusable Hint component providing contextual tooltips with hover delay
- AariLogo component for consistent branding across the application
- Shared UI components from shadcn/ui library in `components/ui/` directory

**Tour Card Specification (Standard Size)**
- **Dimensions**: w-72 h-56 (288px × 224px)
- **Image Height**: h-32 (128px)
- **Used in**: Popular Trips middle column, left/right columns (third row), and hero section animated cards
- **Content**: Image, category badge, title, location, rating, price
- This is the canonical tour card size - use for consistency across all trip/tour displays

**Animation & Interaction Design**
- Scroll-progress-driven animations in hero section using Framer Motion's `useScroll` and `useSpring`
- Staggered entrance animations for content sections using `whileInView` viewport detection
- Hover and tap effects on interactive elements
- Smooth transitions between states with careful timing (typically 0.6s duration)

### Backend Architecture

**Server Framework**
- **Express.js** with TypeScript providing REST API foundation
- HTTP server created using Node's `http` module for potential WebSocket upgrade path
- Middleware stack: JSON body parsing with raw body preservation for webhook verification, URL-encoded form data support
- Custom logging middleware tracking request duration and response status

**Development vs Production Setup**
- **Development**: Vite dev server integrated as Express middleware with HMR over custom path `/vite-hmr`
- **Production**: Static file serving from `dist/public` with SPA fallback to `index.html`
- Replit-specific plugins for error overlay, cartographer, and dev banner in development mode

**Storage Layer**
- Interface-based storage pattern (`IStorage`) enabling multiple implementations
- Current implementation: In-memory storage (`MemStorage`) with Map-based user storage
- Prepared for database migration with Drizzle ORM integration configured
- User schema defined with UUID primary keys, username/password fields

**Routing Pattern**
- Routes registered in `server/routes.ts` with `/api` prefix convention
- Currently minimal backend routes - application is primarily frontend landing page
- HTTP server and Express app separation allows for future WebSocket integration

**Build Process**
- Custom build script using esbuild for server bundling with selective dependency bundling
- Allowlist approach: bundles specific dependencies (e.g., `@neondatabase/serverless`, `drizzle-orm`) while externalizing others
- Reduces cold start time by minimizing `openat(2)` syscalls
- Parallel client (Vite) and server (esbuild) builds

### Data Layer

**Database Configuration**
- **Drizzle ORM** configured for PostgreSQL dialect
- Schema defined in `shared/schema.ts` for type sharing between client and server
- Users table with UUID primary key, unique username constraint
- Zod schemas generated from Drizzle schemas for runtime validation (`createInsertSchema`)
- Migration output directory: `./migrations`
- Database URL from environment variable `DATABASE_URL`

**Current Data Strategy**
- Mock data for trips, testimonials, and UI demonstrations defined in shared types
- Trip data structure includes: tours with itineraries, pricing, ratings, images, video URLs, categories, difficulty levels
- In-memory storage active - database connection not yet implemented
- Data types shared between frontend and backend via `shared/` directory

### External Dependencies

**Core UI & Interaction Libraries**
- **Radix UI**: Comprehensive set of accessible, unstyled component primitives (accordion, alert-dialog, avatar, checkbox, collapsible, context-menu, dialog, dropdown-menu, hover-card, label, menubar, navigation-menu, popover, progress, radio-group, scroll-area, select, separator, slider, switch, tabs, toast, toggle, tooltip)
- **Framer Motion**: Animation library for scroll-based effects, page transitions, and micro-interactions
- **Embla Carousel**: Carousel/slider functionality for image galleries
- **cmdk**: Command palette component for potential future search interface
- **class-variance-authority**: Utility for creating component variants with Tailwind
- **clsx** and **tailwind-merge**: Conditional class name composition

**Form & Validation**
- **React Hook Form**: Form state management (via `@hookform/resolvers`)
- **Zod**: Schema validation library with Drizzle integration (`drizzle-zod`)
- **zod-validation-error**: Human-readable validation error messages

**Database & Backend**
- **@neondatabase/serverless**: Neon serverless PostgreSQL driver
- **Drizzle ORM**: Type-safe SQL query builder and schema manager
- **connect-pg-simple**: PostgreSQL session store for Express sessions (prepared but not active)

**Date & Time**
- **date-fns**: Date manipulation and formatting library

**Development Tools**
- **Vite Plugins**: @replit/vite-plugin-runtime-error-modal, @replit/vite-plugin-cartographer, @replit/vite-plugin-dev-banner (Replit-specific development enhancements)
- **PostCSS** with Tailwind CSS and Autoprefixer

**Typography**
- **Google Fonts**: Plus Jakarta Sans (primary), Inter (secondary), Architects Daughter, DM Sans, Fira Code, Geist Mono, Libre Baskerville, Poppins, Urbanist

**Icons**
- **Lucide React**: Icon library for UI elements
- **React Icons**: Additional icon set (specifically using Simple Icons for social media logos)

**Future Integrations** (dependencies installed but not implemented)
- **Stripe**: Payment processing
- **OpenAI** / **@google/generative-ai**: AI chat integration
- **Passport** with **passport-local**: Authentication
- **express-session** with session stores: Session management
- **express-rate-limit**: API rate limiting
- **jsonwebtoken**: JWT token handling
- **nodemailer**: Email sending
- **multer**: File upload handling
- **ws**: WebSocket support
- **xlsx**: Spreadsheet processing
- **nanoid**: Unique ID generation
- **axios**: HTTP client
- **cors**: Cross-origin resource sharing