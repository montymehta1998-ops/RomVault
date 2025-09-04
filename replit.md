# Overview

This is a RetroROMs application - a classic video game ROM archive platform that allows users to browse, search, and discover retro gaming content. The application serves as a comprehensive library for classic gaming ROMs across various vintage console platforms like NES, SNES, Game Boy, Sega Genesis, PlayStation, and Nintendo 64. Users can explore games by category, view detailed game information, and access download functionality for ROM files.

The application also includes custom blog content with 7 articles in the `/articles/` category and 2 articles in the `/roms/` category, providing additional gaming-related content and entertainment information.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui design system and Tailwind CSS for styling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Theme System**: Custom theme provider with dark/light mode support using CSS variables

## Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Development**: Hot module replacement via Vite in development mode
- **API Structure**: RESTful API endpoints for ROM data, categories, and games
- **Data Storage**: File-based storage using JSON for static game data with in-memory caching
- **Session Management**: PostgreSQL session store with connect-pg-simple

## Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Type-safe schema definitions for users, categories, and games tables
- **Validation**: Zod integration for runtime type validation
- **Migrations**: Drizzle Kit for database schema management

## Component Architecture
- **Design System**: Comprehensive UI component library based on Radix primitives
- **Layout**: Responsive design with header, footer, and main content areas
- **Game Components**: Specialized components for game cards, category displays, and search functionality
- **Reusable Components**: Modular UI components for buttons, forms, dialogs, and navigation

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL database hosting (@neondatabase/serverless)
- **PostgreSQL**: Primary database for user data, game metadata, and session storage

## UI and Styling
- **Radix UI**: Complete suite of accessible UI primitives for React
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Font Awesome**: Icon library for consistent iconography
- **Google Fonts**: Web fonts including DM Sans, Fira Code, and Geist Mono

## Development Tools
- **Replit Integration**: Development environment integration with runtime error overlay and cartographer plugin
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer for cross-browser compatibility

## Data Management
- **TanStack Query**: Server state synchronization and caching
- **React Hook Form**: Form state management with validation
- **Date-fns**: Date manipulation and formatting utilities

## Validation and Type Safety
- **Zod**: Runtime schema validation
- **TypeScript**: Static type checking throughout the application
- **Drizzle-Zod**: Integration between Drizzle ORM and Zod validation