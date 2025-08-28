# RidePilot - Transportation Management System

A comprehensive web-based transportation scheduling and management system designed for small to medium-sized transportation agencies. RidePilot provides trip scheduling, driver management, customer tracking, and financial reporting capabilities through an intuitive interface.

## 🚀 Features

### Core Functionality
- **Trip Management**: Schedule, edit, and track transportation trips
- **Driver Portal**: Dedicated dashboard for drivers with PIN authentication
- **Company Management**: Multi-company support with custom branding
- **Vehicle Types**: Configurable car types with capacity settings
- **Financial Tracking**: Payment status, driver fees, and revenue reporting
- **Customer Management**: Client information and booking tracking
- **Voucher Generation**: Printable/shareable trip vouchers
- **Analytics**: Comprehensive reporting and statistics

### Enhanced UI
- **Multiple View Modes**: Grid, list, and analytics views
- **Date-Organized List View**: Projects grouped by date with expand/collapse functionality
- **Interactive Maps**: Location analytics with heatmap visualization
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Real-time Updates**: Live data synchronization

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with custom design system
- **Framer Motion** for smooth animations
- **Chart.js** for data visualization
- **Leaflet** for interactive maps
- **Shadcn/ui** components with Radix UI primitives

### Backend
- **Node.js 20** with Express.js
- **TypeScript** with ES modules
- **Supabase** for authentication and database
- **PostgreSQL** for data storage
- **RESTful API** design

### Development Tools
- **Drizzle ORM** for type-safe database operations
- **React Query** for server state management
- **React Router** for client-side navigation
- **ESLint & Prettier** for code quality

## 🚦 Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn package manager
- Supabase account (for authentication and database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ridepilot-transport-management.git
   cd ridepilot-transport-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Database Configuration (if using separate PostgreSQL)
   DATABASE_URL=your_postgresql_connection_string
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## 📁 Project Structure

```
ridepilot-transport-management/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── enhanced/   # Enhanced UI components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── driver/     # Driver portal components
│   │   │   └── settings/   # Settings pages
│   │   ├── contexts/       # React Context providers
│   │   ├── lib/           # Utility libraries
│   │   └── main.tsx       # Application entry point
├── server/                # Backend Express server
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage interface
│   ├── db.ts             # Database configuration
│   └── index.ts          # Server entry point
├── shared/               # Shared TypeScript definitions
│   └── schema.ts         # Database schema and types
└── supabase/            # Supabase migrations and functions
    └── migrations/       # Database migration files
```

## 🎯 Usage

### For Transportation Companies
1. **Set up your company profile** in the settings
2. **Add drivers** with their credentials and vehicle assignments
3. **Configure vehicle types** with capacity and specifications
4. **Create transportation projects** with client and route details
5. **Monitor real-time status** of active trips
6. **Generate financial reports** for accounting

### For Drivers
1. **Access the driver portal** at `/driver`
2. **Log in using multiple options:**
   - Direct access links (no login required)
   - QR code scanning for mobile access
   - Traditional login with Driver ID and PIN
3. **View assigned trips** organized by date with smart notifications
4. **Update trip status** as you complete routes
5. **Access trip details** and client contact information

### For Administrators
1. **Dashboard overview** of all operations
2. **Analytics and reporting** tools
3. **User and driver management**
4. **Financial tracking and payment processing**
5. **Location analytics** with interactive maps

## 🔧 Configuration

### Company Theming
The system supports custom company branding with predefined color themes:
- RideConnect (Red theme)
- VIATOR (Green theme)
- BOOKING (Purple theme)
- Custom color themes for other companies

### Database Setup
The application uses Supabase for authentication and PostgreSQL for data storage. Database migrations are included in the `supabase/migrations/` directory.

### Environment Variables
Required environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `DATABASE_URL`: PostgreSQL connection string (if using separate database)

## 🚀 Deployment

### Replit Deployment (Recommended)
The application is optimized for Replit deployment:
1. Import the repository to Replit
2. Configure environment variables in Replit secrets
3. Run `npm run dev` to start the application
4. Deploy using Replit's built-in deployment features

### Manual Deployment
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your hosting provider** of choice
3. **Configure environment variables** on your hosting platform
4. **Set up PostgreSQL database** and run migrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/ridepilot-transport-management/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- Built with modern web technologies for optimal performance
- Designed for transportation industry requirements
- Community-driven development and feature requests

---

**RidePilot** - Making transportation management simple and efficient.