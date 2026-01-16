# IPAP - Insurance Products Aggregation Portal

> An all-in-one insurance infrastructure platform that enables innovators to quickly design, launch, and scale inclusive insurance solutions. Delivers tailored insurance bundles directly to underserved individuals and informal workers.

**IPAP** (Insurance Products Aggregation Portal) by **Resolut** is a comprehensive web application that streamlines the insurance ecosystem, connecting customers, agents, and insurance companies through a unified platform.

## 🚀 Features

### For Customers

- **Policy Management**: Request and manage motor and non-motor insurance policies
- **Quote Requests**: Get instant quotes for various insurance products
- **Payment Processing**: Secure payment processing with multiple payment methods (Mobile Money, etc.)
- **Premium Financing**: Flexible payment schedules and premium financing options
- **Claims Management**: Submit and track insurance claims
- **Insurance Bundles**: Create and purchase custom insurance bundles
- **Referral Program**: Earn rewards through referrals
- **Marketplace**: Browse and compare insurance products from multiple providers

### For Insurance Companies

- **Quote Management**: Receive and manage quote requests from customers
- **Policy Administration**: Track and manage all purchased policies
- **Claims Processing**: Review and process customer claims
- **Financial Logs**: Comprehensive financial tracking and reporting
- **Customer Management**: View and manage customer relationships
- **Risk Type Configuration**: Configure and manage insurance risk types

### For Agents

- **Customer Management**: Manage customer relationships and policies
- **Quote Assistance**: Help customers with quote requests
- **Commission Tracking**: Track earnings and commissions

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.2.4](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **State Management**:
  - [TanStack Query](https://tanstack.com/query) (Server state)
  - [Jotai](https://jotai.org/) (Client state)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **PWA Support**: Progressive Web App capabilities

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **pnpm** (recommended) or npm/yarn/bun
- A backend API server running (see environment variables)

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ipap-v2
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:5174](http://localhost:5174)

## 🌍 Environment Variables

| Variable                   | Description                  | Required |
| -------------------------- | ---------------------------- | -------- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for the backend API | Yes      |

## 📁 Project Structure

```
ipap-v2/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Authentication routes
│   │   ├── (dashboard)/         # Dashboard routes
│   │   │   ├── (user)/          # Customer/User dashboard
│   │   │   └── company/         # Insurance company dashboard
│   │   └── (common)/            # Public/common routes
│   ├── components/             # React components
│   │   ├── dashboard/           # Dashboard-specific components
│   │   ├── quote-payments/     # Payment-related components
│   │   ├── quote-request/      # Quote request components
│   │   ├── landing/            # Landing page components
│   │   └── ui/                 # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities and configurations
│   │   ├── services/           # API service functions
│   │   ├── interfaces/         # TypeScript interfaces
│   │   ├── constants/          # Application constants
│   │   └── schemas/            # Zod validation schemas
│   ├── layouts/                # Layout components
│   └── middleware.ts           # Next.js middleware
├── public/                     # Static assets
├── next.config.ts              # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## 🎯 Key Features Breakdown

### Insurance Types Supported

- **Motor Insurance**: Comprehensive and Third-Party coverage
- **Non-Motor Insurance**:
  - Fire Insurance
  - Funeral Insurance
  - Loyalty Insurance
  - And more...

### Payment Methods

- Mobile Money (MTN, Vodafone, AirtelTigo)
- Bank transfers
- Other payment gateways

### User Roles

- **Customer**: End users purchasing insurance
- **Agent**: Insurance agents managing customers
- **Insurance Company**: Insurance providers managing policies and quotes
- **Admin**: System administrators

## 🚀 Available Scripts

| Script         | Description                                          |
| -------------- | ---------------------------------------------------- |
| `pnpm dev`     | Start development server with Turbopack on port 5174 |
| `pnpm dev:pwa` | Start development server with PWA support (HTTPS)    |
| `pnpm build`   | Build the application for production                 |
| `pnpm start`   | Start the production server                          |
| `pnpm lint`    | Run ESLint to check code quality                     |

## 🔐 Security Features

- Token-based authentication with refresh tokens
- Secure cookie storage
- Content Security Policy headers
- XSS protection
- CSRF protection
- Secure API communication

## 📱 Progressive Web App (PWA)

The application is configured as a PWA with:

- Offline support
- Install prompt
- App-like experience
- Service worker integration

## 🧩 Development Guidelines

### Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Consistent component structure
- Custom hooks for reusable logic

### Component Structure

- Use functional components with hooks
- TypeScript interfaces for props
- Radix UI for accessible components
- Tailwind CSS for styling

### API Integration

- Centralized API client (`src/lib/api.ts`)
- Service functions in `src/lib/services/`
- React Query for data fetching
- Error handling and token refresh

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all tests pass and linting is clean
4. Submit a pull request

## 📄 License

This project is proprietary software developed by Resolut.

## 📞 Support

For support, please contact the development team or visit the support page in the application.

## 🔗 Related Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)

---

**Built with ❤️ by the Resolut team**
