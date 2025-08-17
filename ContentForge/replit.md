# AI Marketing Content Platform

## Overview

This is a single-page web application built with React that serves as a multilingual marketing content generation platform. The application leverages Google's Gemini AI models to create both compelling marketing content and professional marketing images. Users can select their target language, content type, tone, and provide a content idea to generate professional marketing materials such as social media posts, ad copy, poster headlines, and email newsletters. The platform now includes AI-powered image generation using Gemini's image generation model to create marketing-oriented visuals that complement the text content.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using functional components and hooks
- **Styling**: Tailwind CSS with shadcn/ui component library for modern, responsive design
- **State Management**: React hooks (useState) for local state and TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form validation
- **UI Components**: Comprehensive set of accessible components built with Radix UI primitives

### Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **API Design**: RESTful API with `/api/generate-content` endpoint supporting both text and image generation
- **Request Validation**: Zod schemas for runtime type checking and validation
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes
- **File Serving**: Static file serving for generated marketing images
- **Development Tools**: Vite for development server and hot module replacement

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless database connection
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **In-Memory Storage**: Temporary user storage implementation for development

### Authentication and Authorization
- **User Management**: Basic user schema with username/password authentication
- **Session Management**: Express sessions with PostgreSQL storage backend
- **Data Validation**: Zod schemas for user input validation and type safety

### External Dependencies

#### AI Services
- **Google Gemini AI**: Primary AI service using the `@google/genai` package with multiple models:
  - gemini-2.5-flash-preview-05-20 for text content generation
  - gemini-2.0-flash-preview-image-generation for marketing image creation
- **API Configuration**: Environment-based API key management with fallback options
- **Image Generation**: Marketing-focused image creation with content-type and tone-specific visual guidelines

#### Database Services
- **Neon Database**: Serverless PostgreSQL database service via `@neondatabase/serverless`
- **Connection Management**: Database URL configuration through environment variables

#### Development and Build Tools
- **Vite**: Modern build tool and development server with React plugin
- **ESBuild**: Fast JavaScript bundler for production builds
- **TypeScript**: Type checking and compilation
- **Replit Integration**: Custom Vite plugins for Replit development environment

#### UI and Styling Libraries
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for creating variant-based component APIs

#### Utility Libraries
- **Date-fns**: Date manipulation and formatting
- **clsx/twMerge**: Conditional className utilities
- **Nanoid**: Unique ID generation
- **Zod**: Runtime type validation and schema definition