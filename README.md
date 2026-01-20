# IPAP Insurance Agent Portal

> Agent-facing portal for IPAP that lets insurance agents (especially company agents) find policies, manage customers, and collect premiums (including premium financing “Pay Small Small” flows).

This repository is the **Insurance Agent** frontend for **IPAP** by **Resolut**.  
It is a focused dashboard used by agents and insurance companies’ staff to:

- Look up and manage customer policies
- Process premium payments (one‑time and premium financing)
- View financing schedules and repayment status
- Work with existing policies issued by partner insurers

## 🛠️ Tech Stack (Agent App)

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

## 📁 Project Structure (High Level)

```
ipap-insurance-agent/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Authentication routes
│   │   ├── (dashboard)/        # Agent dashboard routes
│   │   │   ├── (agent)/        # Agent-specific dashboard (this app)
│   │   │   └── (user)/         # (Legacy / shared) user-facing routes
│   │   └── (common)/            # Public/common routes
│   ├── components/             # React components
│   │   ├── dashboard/           # Dashboard-specific components
│   │   ├── quote-payments/     # Payment-related components
│   │   ├── quote-request/      # Quote request components
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

## 🎯 Agent Portal Features

### Agent Workflows

- **Find Existing Policies**

  - Search by Policy ID (loyalty and non‑motor policies)
  - View core policy and loyalty details
  - Start payment flows directly from the policy (Pay Small Small, one‑time)

- **Premium Financing (Pay Small Small)**

  - Configure loan terms: duration and payment frequency
  - Auto‑calculate financing summary via backend (loan amount, total repayment, installments)
  - Preview repayment schedule (agent side and customer self‑service link)
  - Process repayments, including next‑installment flows

- **Customer Self‑Verification**

  - Generate remote links for customers to:
    - Preview financing details
    - Verify Ghana Card
    - Accept declaration & sign
    - Complete premium‑financing payment

- **Payments**
  - One‑time and premium‑financing payments
  - Ghana Card verification requirements enforced in middleware
  - Payment schedule view for financed policies

### Technical Behaviour (Agent App)

- **Agent‑only access**

  - Middleware enforces:
    - `userType === AGENT`
    - Agent has a valid `companyID`
    - Ghana Card verified (`GhcardNo` + `verified === true`) before accessing protected flows

- **State & Storage**
  - Payment flow state stored in **sessionStorage** via Jotai (`paymentVerificationAtom`)
  - State:
    - Persists across refreshes on the same payment route
    - Is reset:
      - After successful payment
      - When starting a new Pay Small Small flow from Find Policy

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
- React Query (TanStack Query) for data fetching/caching
- Token refresh and auth handled in `src/hooks/use-auth.ts`

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
