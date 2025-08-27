# Electronics E-commerce Application

## Overview

This is a modern e-commerce application built for selling electronics, featuring a React frontend with Express.js backend. The application provides a complete shopping experience with product browsing, cart management, and checkout functionality. It's designed as a full-stack TypeScript application with a focus on modern UI components and responsive design.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with pages for Home, Products, Product Detail, Cart, and Checkout
- **UI Components**: Shadcn/UI component library with Radix UI primitives providing a comprehensive design system
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: 
  - React Context API for cart state management
  - TanStack Query (React Query) for server state management and caching
- **Forms**: React Hook Form with Zod schema validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API structure with dedicated routes for categories, products, and cart operations
- **Storage Pattern**: Interface-based storage abstraction (IStorage) with in-memory implementation for development
- **Development**: Hot reloading with Vite middleware integration for seamless development experience

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Shared schema definitions between frontend and backend using Drizzle and Zod
- **Tables**: Categories, Products, and Cart Items with proper foreign key relationships
- **Development Storage**: In-memory storage implementation with sample data for rapid prototyping

### Authentication and Authorization
- **Session Management**: Session-based cart tracking using browser localStorage for anonymous users
- **Cart Persistence**: Session IDs stored in localStorage to maintain cart state across browser sessions
- **Security**: Express middleware for request logging and error handling

## External Dependencies

### Frontend Libraries
- **UI Framework**: React with Wouter for routing
- **Component Library**: Radix UI primitives with Shadcn/UI wrapper components
- **Styling**: Tailwind CSS with PostCSS for processing
- **State Management**: TanStack Query for server state, React Context for client state
- **Form Handling**: React Hook Form with Hookform Resolvers for Zod integration
- **Validation**: Zod for schema validation and type inference
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date formatting and manipulation

### Backend Dependencies
- **Database**: Neon Database (@neondatabase/serverless) for PostgreSQL hosting
- **ORM**: Drizzle ORM with PostgreSQL dialect for database operations
- **Session Storage**: connect-pg-simple for PostgreSQL session storage
- **Validation**: Zod for request/response validation
- **Development**: tsx for TypeScript execution, ESBuild for production builds

### Development Tools
- **Build System**: Vite with React plugin and runtime error overlay
- **TypeScript**: Full TypeScript support with strict configuration
- **Development Plugins**: Replit-specific plugins for enhanced development experience
- **Package Management**: npm with lockfile for consistent dependencies

### Database Configuration
- **Provider**: Neon Database (serverless PostgreSQL)
- **Migrations**: Drizzle Kit for database schema migrations
- **Connection**: Environment variable-based database URL configuration
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`