# Anvaya Collective: Dance App Recreation Plan

This document outlines the plan for recreating the Anvaya Collective dance app using Svelte 5, Tailwind CSS, and Drizzle ORM.

## 1. Folder Structure

We will adhere to a standard SvelteKit project structure, with some additions for API routes, database management, and UI components.

```
anvaya-collective/
├── .svelte-kit/
├── src/
│   ├── app.d.ts
│   ├── app.html
│   ├── hooks.server.ts           # Server-side hooks (e.g., Better Auth integration)
│   ├── lib/
│   │   ├── assets/                # Static assets (images, fonts, etc.)
│   │   ├── components/            # Reusable Svelte components
│   │   │   ├── ui/                # UI components (buttons, input fields, etc.)
│   │   │   └── Card.svelte
│   │   ├── server/
│   │   │   ├── db/
│   │   │   │   ├── auth.schema.ts     # Drizzle schema for authentication
│   │   │   │   ├── index.ts           # Drizzle client initialization
│   │   │   │   └── schema.ts          # Drizzle schema for application data (inquiries)
│   │   │   └── auth.ts                # Better Auth configuration
│   │   └── utils/                 # Utility functions
│   ├── routes/
│   │   ├── +layout.svelte         # Main layout for the entire app
│   │   ├── +error.svelte          # Custom error page
│   │   ├── +page.svelte           # Landing page
│   │   ├── gallery/
│   │   │   └── +page.svelte       # Gallery page
│   │   ├── inquire/
│   │   │   ├── +page.server.ts    # Server-side logic for inquiry form submission
│   │   │   └── +page.svelte       # Inquiry (Registration) page
│   │   ├── api/                   # API routes for data interaction
│   │   │   └── inquiries/
│   │   │       └── +server.ts     # API endpoint for inquiry submissions
│   └── static/
│       └── favicon.png
├── drizzle.config.ts              # Drizzle ORM configuration
├── local.db                       # Local SQLite database file
├── package.json
├── svelte.config.js
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json
└── vite.config.ts
```

## 2. Database Schema for Dancer Inquiries

We will extend the existing Drizzle schema (`src/lib/server/db/schema.ts`) to include a table for dancer inquiries.

```typescript
// src/lib/server/db/schema.ts

import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const inquiry = sqliteTable('inquiry', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    dancerName: text('dancer_name').notNull(),
    email: text('email').notNull(),
    phoneNumber: text('phone_number'), // Optional
    danceStyle: text('dance_style').notNull(),
    message: text('message'), // Optional message from the dancer
    status: text('status').notNull().default('new'), // e.g., 'new', 'contacted', 'archived'
    createdAt: integer('created_at', { mode: 'timestamp' })
        .notNull()
        .default(sql`(strftime('%s', 'now'))`)
});

// Existing task table (if keeping)
export const task = sqliteTable('task', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    title: text('title').notNull(),
    priority: integer('priority').notNull().default(1)
});

export * from './auth.schema';
```

**Explanation of `inquiry` table fields:**

*   `id`: Unique identifier for each inquiry.
*   `dancerName`: The name of the dancer submitting the inquiry.
*   `email`: The dancer's contact email.
*   `phoneNumber`: Optional phone number.
*   `danceStyle`: The dance style the dancer is interested in (e.g., "Bharatanatyam", "Kathak", "Contemporary").
*   `message`: An optional message or question from the dancer.
*   `status`: To track the progress of the inquiry (e.g., `new`, `contacted`, `archived`). Defaults to `new`.
*   `createdAt`: Timestamp of when the inquiry was submitted.

## 3. Main Pages

### 3.1. Landing Page (`src/routes/+page.svelte`)

*   **Purpose:** To introduce Anvaya Collective, showcase its vision, and encourage visitors to explore further or register.
*   **Content:**
    *   Hero section with a captivating image/video and a strong tagline.
    *   Brief "About Us" section highlighting the collective's mission and values.
    *   Showcase of different dance styles offered (could be cards linking to more info).
    *   Call-to-action (CTA) buttons: "Register Now" (links to `/inquire`) and "View Gallery" (links to `/gallery`).
    *   Testimonials or featured performances.
    *   Footer with contact information and social media links.
*   **Styling:** Responsive design using Tailwind CSS.

### 3.2. Registration (Inquiry) Page (`src/routes/inquire/+page.svelte`)

*   **Purpose:** To allow prospective dancers to submit an inquiry to join or learn more.
*   **Content:**
    *   A form with the following fields:
        *   Dancer Name (text input)
        *   Email (email input)
        *   Phone Number (optional text input)
        *   Preferred Dance Style (dropdown/select with options like "Bharatanatyam", "Kathak", "Contemporary", "Other")
        *   Message (optional textarea)
    *   Submit button.
    *   Success/Error messages after form submission.
*   **Functionality:**
    *   Client-side validation of form fields.
    *   Submits data to a server-side endpoint (`src/routes/api/inquiries/+server.ts`).
    *   Uses `+page.server.ts` for server-side form handling and database interaction.
*   **Styling:** Clean and user-friendly form layout with Tailwind CSS.

### 3.3. Gallery Page (`src/routes/gallery/+page.svelte`)

*   **Purpose:** To visually showcase performances, practices, and the vibrant community of Anvaya Collective.
*   **Content:**
    *   A grid or carousel of high-quality images and/or videos.
    *   Categorization or filtering options (e.g., by event, dance style).
    *   Brief descriptions for each gallery item.
*   **Functionality:**
    *   Could potentially fetch gallery data from a CMS or a server-side endpoint in the future. For now, static content is acceptable.
*   **Styling:** Visually appealing and responsive image gallery using Tailwind CSS.

## Next Steps

Once this plan is approved, I will proceed with generating the necessary files and code, starting with the database schema and then the main pages.