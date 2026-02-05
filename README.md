# IPAP Insurance Agent Portal

> Agent-facing portal for IPAP that lets insurance agents (especially company agents) find policies, manage customers, and collect premiums (including premium financing “Pay Small Small” flows).

This repository is the **Insurance Agent** frontend for **IPAP** by **Resolut**.  
It is a focused dashboard used by agents and insurance companies’ staff to:

- Look up and manage customer policies
- Process premium payments (one‑time and premium financing)
- View financing schedules and repayment status
- Work with existing policies issued by partner insurers

## 🛠️ Tech Stack (Agent App)

- **Framework**: [Next.js 15.2.6](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **State Management**:
  - [TanStack Query](https://tanstack.com/query) (Server state)
  - [Jotai](https://jotai.org/) (Client state)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Charts & dashboards**: [Recharts](https://recharts.org/), [Tremor](https://www.tremor.so/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Other**: [cmdk](https://cmdk.paco.me/) (command palette), [Sonner](https://sonner.emilkowal.ski/) (toasts), [Lucide React](https://lucide.dev/) + [React Icons](https://react-icons.github.io/react-icons/), PDF generation (Puppeteer)
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
   cd ipap-insurance-agent
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
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Sign-in, forgot-password, verify-id
│   │   ├── (common)/               # Public/shared (e.g. customer self-verification)
│   │   ├── (dashboard)/            # Dashboard shell
│   │   │   ├── (agent)/            # Agent dashboard routes
│   │   │   │   └── dashboard/      # home, customers, find-policy, policies, finances, profile, remote-premium-financing
│   │   │   └── layout.tsx
│   │   ├── (previews)/             # Preview pages (premium-financing, quote-payment, repayment-schedule)
│   │   ├── api/                    # API routes (e.g. generate-pdf)
│   │   └── layout.tsx, manifest.ts
│   ├── components/
│   │   ├── dashboard/              # Agent home, find-policy, payment flow, declaration
│   │   ├── ghana/                  # Ghana Card verification shared UI
│   │   ├── modals/                 # Confirm modals, export, finance log sheet
│   │   ├── preview/                # Contract/letterhead for PDF
│   │   ├── profile/                # Agent profile sections
│   │   ├── quote-payments/         # Duration, frequency, summary components
│   │   └── ui/                     # Reusable UI (Radix-based)
│   ├── hooks/                      # use-auth, use-agent, use-premium-financing, use-payment-verification, etc.
│   ├── lib/
│   │   ├── api.ts                  # Centralized Axios API client
│   │   ├── constants/               # Routes, cookies, user types, session, sidebar
│   │   ├── interfaces/             # TypeScript types
│   │   ├── providers/              # Query provider, app providers
│   │   ├── schemas/                # Zod validation schemas
│   │   ├── services/               # API services (auth, agent, customers, finance, policy-info, premium-financing, quote-requests, etc.)
│   │   ├── store/                  # Jotai store (payment verification, payment storage)
│   │   └── utils/                  # API error, download, export, file utils, PDF browser instance
│   ├── layouts/                    # main-layout, analytics-layout
│   └── middleware.ts               # Auth, agent access, Ghana Card verification
├── public/                         # Static assets, PWA icons, docs
├── next.config.ts
├── tsconfig.json
└── package.json
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
  - Remote premium financing flow with customer verification link

- **Customer Self‑Verification**
  - Generate remote links for customers to:
    - Preview financing details
    - Verify Ghana Card
    - Accept declaration & sign
    - Complete premium‑financing payment

- **Payments**
  - One‑time and premium‑financing payments (including pay-direct)
  - Ghana Card verification requirements enforced in middleware
  - Payment schedule view for financed policies

- **Dashboard**
  - Home, customers, find policy, policies/purchases, financial logs, profile

### Technical Behaviour (Agent App)

- **Agent‑only access**
  - Middleware enforces:
    - `userType === AGENT` (Sysagent)
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
