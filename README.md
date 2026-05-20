# Product Management Dashboard
A comprehensive frontend web application for managing products, built with modern web technologies. This dashboard provides a seamless user experience for authenticating users and managing product inventories.
## Features
- **User Authentication**: Secure Login and Signup functionality with protected routes.
- **Product Management**: View, add, edit, and delete products from a centralized dashboard.
- **Interactive UI**: Custom components including Modals, Select dropdowns, and Product Cards.
- **Responsive Design**: Built with Tailwind CSS for a seamless experience across all devices.
## Tech Stack
- **Frontend Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM
- **State Management**: React Context API (`AuthContext`, `ProductContext`)
- **HTTP Client**: Axios
- **Icons**: Lucide React
## Getting Started
### Prerequisites
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)
### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   cd product-management-dashboard
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
### Scripts
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run preview`: Locally previews the production build.
## Project Structure
```text
src/
├── assets/         # Static assets and global resources
├── components/     # Reusable UI components (Login, Signup, Modal, ProductCard, etc.)
├── config/         # Configuration files (Axios setup)
├── contexts/       # React Context providers for global state
├── pages/          # Application pages (Dashboard)
├── App.jsx         # Main application component and routing setup
└── main.jsx        # Application entry point
```
