# Library Management System (Frontend)

A modern, responsive frontend for a Library Management System built with **Vue 3**, **Vite**, and **Pinia**. The application supports two distinct user roles—Admin and Member—with a premium dark-mode glassmorphism design.

## Features

- **Role-Based Authentication**: Secure login and registration with distinct workflows and navigation guards for Admins and Members.
- **Admin Dashboard**:
  - Manage the library catalog (Add and Delete books).
  - Manage users (Register new members/admins).
  - View all registered members and their roles.
- **Member Dashboard**:
  - Browse and search the library's catalog.
  - Borrow available books.
  - Return borrowed books (intelligently restricted to the user who borrowed them).
- **Modern UI/UX**:
  - Glassmorphism design elements (`main.css`).
  - Dynamic page transitions and hover animations.
  - Fully responsive CSS Grid layouts.
- **State Management**: Robust local state handling using `Pinia` (mocking a database/backend temporarily).

## Tech Stack

- **Framework:** [Vue 3](https://vuejs.org/) (Composition API)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Routing:** [Vue Router 4](https://router.vuejs.org/)
- **Styling:** Vanilla CSS (CSS Variables, Flexbox, CSS Grid)
- **HTTP Client:** [Axios](https://axios-http.com/) (configured in `src/services/api.js`)

## Project Structure

```text
src/
├── assets/
│   └── main.css           # Global design system & glassmorphism utilities
├── components/
│   ├── Navbar.vue         # Dynamic navigation bar based on auth state
│   └── BookCard.vue       # Reusable component for displaying book info
├── router/
│   └── index.js           # Route definitions and Navigation Guards
├── services/
│   └── api.js             # Axios configuration base
├── store/
│   ├── auth.js            # Pinia store for users, login, and registration
│   └── books.js           # Pinia store for catalog, borrowing, and returning
├── views/
│   ├── Login.vue          # User authentication entry point
│   ├── Register.vue       # Account creation
│   ├── AdminDashboard.vue # Management portal for books and members
│   └── MemberDashboard.vue# Browse and borrow portal for members
├── App.vue                # Root component and layout wrapper
└── main.js                # Application entry point (Vue, Router, Pinia)
```

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory:
   ```bash
   cd library_system
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the Vite development server:

```bash
npm run dev
```

Open your browser and navigate to the local server URL provided in the terminal (usually `http://localhost:5173/`).

### Mock Backend Note
This frontend currently operates with **mock data** initialized in the Pinia stores (`src/store/auth.js` and `src/store/books.js`). It catches failed Axios requests and falls back to updating local state so the UI remains fully functional. 

To connect a real backend, simply remove the mock logic/fallbacks in the Pinia stores and ensure your backend handles the API endpoints defined in the application.
