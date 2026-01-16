# IPAP Agent Technical Documentation

Technical documentation for developers working with IPAP's agent functionality.

---

## Table of Contents

1. [Overview](#overview)
2. [Agent Types](#agent-types)
3. [Authentication Flow](#authentication-flow)
4. [Agent Dashboard](#agent-dashboard)
5. [Customer Management](#customer-management)
6. [Quote Requests (Standard Agents Only)](#quote-requests-standard-agents-only)
7. [Finding Policies (Company Agents)](#finding-policies-company-agents)
8. [Premium Payments](#premium-payments)
9. [Technical Implementation](#technical-implementation)
10. [File Structure Reference](#file-structure-reference)

---

## Overview

IPAP supports two distinct types of agents with different capabilities and access levels.

### Standard/Independent Agents

Full platform access including:
- Register and manage customers
- Create insurance quotes (Motor & Non-Motor)
- Process premium payments
- Access marketplace, bundles, referrals
- Work with multiple insurance companies

### Insurance Company Agents

Created by insurance companies with restricted access:
- Register and manage customers
- Find existing policies by Policy ID (from their company only)
- Process premium payments
- **Cannot** create quotes, access marketplace, bundles, or referrals

---

## Agent Types

### User Type Identifier

Both agent types use the same `userType`:

```javascript
USER_TYPES.AGENT = "Sysagent"
```

### Distinguishing Between Agent Types

The `companyID` field on the agent record determines the type:

```javascript
// In useAgent hook
const { isCompanyCreatedAgent } = useAgent();
// Returns true if agent.companyID !== null
```

### Access Control

Navigation filtering based on agent type:

```javascript
// src/lib/utils.ts
export function getNavigation(userType: UserType, hasCompanyID?: boolean): NavSection[] {
  if (userType === USER_TYPES.AGENT && hasCompanyID) {
    // Filter out restricted items for company agents
    return navigation.filter(/* remove: Request Quote, Bundles, Marketplace, etc. */);
  }
  return navigation; // Full access for standard agents
}
```

---

## Authentication Flow

### Standard Agent Flow

```
1. Sign In → /sign-in
       ↓
2. Ghana Card Verification → /verify-id (if not verified)
       ↓
3. Dashboard → /dashboard/home
```

### Company Agent Flow

```
1. Account Created by Insurance Company
   (Company uploads all documents during creation)
       ↓
2. Agent receives login credentials
       ↓
3. Sign In → /sign-in
       ↓
4. Ghana Card Verification → /verify-id (if not verified)
       ↓
5. Dashboard → /dashboard/home
```

### Company Agent Account Creation

Insurance companies create agents through `/company/agents`:

**Required Data:**
- Full Name, Email, Phone, Date of Birth
- Years of Experience
- Guarantor Passport Picture
- Agent Passport Picture
- Guarantor ID Card
- Agent ID Card
- Education Qualification Certificate

**Key Implementation:** `src/app/(dashboard)/company/agents/`

### Middleware Routing

```javascript
// src/middleware.ts
if (userTypeCookie === USER_TYPES.AGENT) {
  if (agentCookie) {
    // Has agent profile → go to dashboard
    return NextResponse.redirect(ROUTES.AGENT.HOME);
  } else {
    // No agent profile → go to setup (standard agents only)
    return NextResponse.redirect(ROUTES.AGENT.SETUP);
  }
}
```

### Ghana Card Verification

```javascript
// Verification check
const isGhanaVerified =
  userData?.GhcardNo != null &&
  userData?.GhcardNo !== "" &&
  userData?.verified === true;

// If not verified, redirect to /verify-id
if (!isGhanaVerified && pathname !== ROUTES.VERIFY_ID) {
  return NextResponse.redirect(ROUTES.VERIFY_ID);
}
```

**Key Implementation:** `src/app/(auth)/(common)/verify-id/page.tsx`

---

## Agent Dashboard

### Home View

**Route:** `/dashboard/home`

**Components:**
- Quick Action Cards (Find Policy, Manage Customers)
- Recent Transactions Table
- Support Widget

**Key Implementation:** `src/components/dashboard/agent-home-view.tsx`

### Navigation (Standard Agent)

| Menu Item | Route |
|-----------|-------|
| Home | `/dashboard/home` |
| Request Quote | `/dashboard/policies/motor`, `/dashboard/policies/non-motor` |
| Agent Customers | `/dashboard/customers` |
| My Quote Requests | `/dashboard/policies` |
| My Purchased Policies | `/dashboard/policies/purchases` |
| Financial Logs | `/company/finances` |
| My Claims | `/dashboard/policies/claims` |
| Bundles | `/dashboard/bundles` |
| Insurance Companies | `/dashboard/companies` |
| Marketplace | `/dashboard/marketplace` |
| Referrals | `/dashboard/referrals` |
| My Rewards | `/dashboard/rewards` |

### Navigation (Company Agent)

| Menu Item | Route |
|-----------|-------|
| Home | `/dashboard/home` |
| Find Policy | `/dashboard/find-policy` |
| Agent Customers | `/dashboard/customers` |
| My Purchased Policies | `/dashboard/policies/purchases` |
| Financial Logs | `/company/finances` |

**Key Implementation:** `src/lib/constants/sidebar.ts`

---

## Customer Management

### Viewing Customers

**Route:** `/dashboard/customers`

```javascript
const { agent } = useAgent();
const { data: customers } = useAgentCustomers(agent?.id || null);
```

**Key Implementation:** `src/app/(dashboard)/(user)/dashboard/(agent)/customers/page.tsx`

### Adding Customers

```javascript
const { createCustomer } = useAgent();

const customerData = {
  fullname: data.fullname,
  email: data.email,
  phone: data.phone,
  dob: data.dob,
  address: data.address,
  registeredByAgentID: agent.id,
};

await createCustomer.mutateAsync(customerData);
```

### Handling Existing Users

If user already exists, API returns error with user ID. Agent can then register the existing user under their agency:

```javascript
await updateCustomer.mutateAsync({
  userId: existingUserId,
  userData: {
    ...customerData,
    registeredByAgentID: agent.id,
  },
});
```

**Key Implementation:** `src/components/modals/customer-modal.tsx`

### Customer Details

**Route:** `/dashboard/customers/[id]`

```javascript
const { getSingleCustomer, getCustomerQuotePayments, getCustomerClaims } =
  useSingleCustomer(customerId);
```

**Key Implementation:** `src/app/(dashboard)/(user)/dashboard/(agent)/customers/[id]/page.tsx`

---

## Quote Requests (Standard Agents Only)

> **Note:** This functionality is only available to Standard Agents. Company Agents cannot create quotes.

### Motor Policy Requests

**Route:** `/dashboard/policies/motor`

```javascript
// Third Party submission
const thirdPartyData = {
  ...vehicleData,
  userID: selectedCustomer.id,
  thirdpartyCovertype: THIRD_PARTY_COVER_TYPE.id,
  userAgentID: agent?.id,
};
await sendThirdPartyQuoteRequestWithUID.mutateAsync(thirdPartyData);

// Comprehensive submission
const comprehensiveData = {
  ...vehicleData,
  valueofVehicle: Number(data.valueofVehicle),
  userID: selectedCustomer.id,
  comprehensiveCover: COMPREHENSIVE_COVER_TYPE.id,
  userAgentID: agent?.id,
};
await sendComprehensiveQuoteRequestWithUID.mutateAsync(comprehensiveData);
```

**Key Implementation:** `src/app/(dashboard)/(user)/dashboard/policies/(new)/motor/page.tsx`

### Non-Motor Policy Requests

**Route:** `/dashboard/policies/non-motor`

```javascript
const policyData = {
  risk_type_id: selectedRiskType,
  sum_insured: parseFloat(data.sumInsured),
  userID: selectedCustomer.id,
  userAgentID: agent?.id,
  // ... other fields
};
await sendNonMotorPolicyRequest.mutateAsync(policyData);
```

**Key Implementation:** `src/app/(dashboard)/(user)/dashboard/policies/(new)/non-motor/page.tsx`

### Customer Selection Component

```javascript
// src/components/dashboard/agent-user-selector.tsx
<AgentUserSelector
  onUserSelect={(customer) => setSelectedCustomerId(customer.id)}
  initialUserId={existingUserId}
/>
```

---

## Finding Policies (Company Agents)

> **This is the primary workflow for Company Agents.**

**Route:** `/dashboard/find-policy`

### Fetching Policy Info

```javascript
const { policyInfo, fetchPolicyInfo, isLoading, error } = usePolicyInfo();

await fetchPolicyInfo({
  policyId: Number(policyId),
  userAgentID: agent.id,
});
```

### Response Structure

```javascript
{
  model: {
    // Policy data object
    userID: string,
    companyID: string,
    entityid: string,
    // ... other fields
  },
  loyaltyPolicy: {
    policyType: string,
    quoteType: string,
    // ... other metadata
  }
}
```

### Payment Navigation

```javascript
const productType = transformQuoteTypeToProductType(loyaltyPolicy?.quoteType);
const paymentUrl = `/dashboard/policies/purchases/pay-direct?` +
  `productType=${productType}&` +
  `companyId=${companyId}&` +
  `requestId=${requestId}&` +
  `cId=${customerId}&` +
  `type=premium-financing`;
```

**Key Implementation:** `src/components/dashboard/find-policy/loyalty-fetch-policy-details.tsx`

---

## Premium Payments

### Payment Types

| Type | Description |
|------|-------------|
| `one-time` | Full premium paid at once |
| `premium-financing` | Installment payments (Pay Small Small) |

### Payment Flow

**Route:** `/dashboard/policies/purchases/pay-direct`

**URL Parameters:**
- `productType` - comprehensive, thirdparty, fire, etc.
- `companyId` - Insurance company ID
- `requestId` - Quote/policy entity ID
- `cId` - Customer ID
- `type` - one-time or premium-financing
- `isInstallment` - true for installment payments

### Steps (Premium Financing)

1. **Ghana Card Verification**
2. **Loan Calculation**
3. **Declaration**
4. **Payment Details**
5. **Verify Payment**

### Payment Submission (Agent)

```javascript
const paymentRequest: QuotePaymentRequest = {
  premiumAmount: effectivePremiumAmount,
  method: paymentData.method,
  accountNumber: paymentData.accountNumber,
  accountName: paymentData.accountName,
  methodCode: paymentData.methodCode,
  methodName: paymentData.methodName,
  
  // Customer ID (from cId param)
  userID: customerId,
  
  // Agent ID
  userAgentID: agent?.id,
  
  // Policy details
  companyID: selectedCompanyId,
  quoteType: quoteType,
  entityid: selectedQuoteId,
  
  // Rewards
  useReward: rewards.useReward,
  rewardType: rewards.rewardType,
  rewardValue: rewards.rewardValue,
  
  // Signature
  signature: signature,
};

await makeQuotePayment.mutateAsync(paymentRequest);
```

**Key Implementation:** `src/hooks/use-submit-quote-payment.ts`

---

## Technical Implementation

### Key Constants

```javascript
// src/lib/constants/index.ts
export const USER_TYPES = {
  CUSTOMER: "customer",
  INSURANCE_COMPANY: "insuranceCompany",
  AGENT: "Sysagent",
  SYSTEM_ADMIN: "systemAdmin",
};

export const COOKIE_KEYS = {
  user: "__ipap_user__",
  agent: "__ipap_agent__",
  userType: "__ipap_user_type__",
  accessToken: "__ipap_access_token__",
};

export const ROUTES = {
  AGENT: {
    HOME: "/dashboard/home",
    SETUP: "/setup/agent",
    CUSTOMERS: "/dashboard/customers",
    FIND_POLICY: "/dashboard/find-policy",
  },
};
```

### Key Hooks

| Hook | Purpose |
|------|---------|
| `useAgent()` | Access current agent data and operations |
| `useAgentCustomers(agentId)` | Fetch customers for agent |
| `useCreateCustomer()` | Create new customer |
| `useUpdateAgentCustomer()` | Update customer details |
| `useDeleteCustomer()` | Delete customer |
| `useSingleCustomer(customerId)` | Get customer with history |
| `usePolicyInfo()` | Fetch policy details (Company agents) |

### Agent Data Structure

```typescript
interface Agent {
  id: string;
  userID: string;
  companyID?: string;           // Null for standard agents
  yearsofExperience: string;
  pasportpicGuarantor?: string;
  passportpicAgent?: string;
  guarantoridCard?: string;
  agentidCard?: string;
  educationQualification?: string;
  user?: User;
}
```

### Payment Request Structure

```typescript
interface QuotePaymentRequest {
  premiumAmount: number;
  method: string;
  accountNumber: string;
  accountName: string;
  methodCode: string;
  methodName: string;
  userID: string;           // Customer ID
  userAgentID?: string;     // Agent ID (for agents)
  companyID: string;
  quoteType: string;
  entityid: string;
  useReward: "Yes" | "No";
  rewardType: string;
  rewardValue: number;
  signature?: File | string;
}
```

---

## File Structure Reference

```
src/
├── app/
│   ├── (auth)/
│   │   └── (common)/
│   │       ├── sign-in/page.tsx          # Agent sign in
│   │       └── verify-id/page.tsx        # Ghana Card verification
│   └── (dashboard)/(user)/dashboard/
│       ├── (agent)/
│       │   ├── customers/page.tsx        # Customer list
│       │   ├── customers/[id]/page.tsx   # Customer details
│       │   └── find-policy/page.tsx      # Find policy (Company agents)
│       ├── home/page.tsx                 # Dashboard home
│       └── policies/
│           ├── (new)/
│           │   ├── motor/page.tsx        # Motor quotes (Standard agents)
│           │   └── non-motor/page.tsx    # Non-motor quotes (Standard agents)
│           └── purchases/
│               └── pay-direct/page.tsx   # Payment flow
├── components/
│   ├── dashboard/
│   │   ├── agent-home-view.tsx           # Agent home view
│   │   ├── agent-user-selector.tsx       # Customer dropdown (Standard agents)
│   │   ├── find-policy/
│   │   │   ├── index.tsx                 # Find policy router
│   │   │   └── loyalty-fetch-policy-details.tsx
│   │   └── payment/                      # Payment flow components
│   └── modals/
│       └── customer-modal.tsx            # Add/Edit customer
├── hooks/
│   ├── use-agent.ts                      # Agent operations
│   ├── use-auth.ts                       # Authentication
│   └── use-submit-quote-payment.ts       # Payment submission
└── lib/
    ├── constants/
    │   ├── index.ts                      # Routes, user types
    │   └── sidebar.ts                    # Navigation config
    ├── utils.ts                          # getNavigation, transformers
    └── middleware.ts                     # Route protection
```

---

## Quick Reference

### Standard Agent Workflow

```
Sign In → Ghana Card Verification → Dashboard
    ↓
Manage Customers → Create Quotes → View Quote Requests
    ↓
Select Insurance Company → Process Payment → Complete
```

### Company Agent Workflow

```
Sign In → Ghana Card Verification → Dashboard
    ↓
Manage Customers → Find Policy by ID → View Policy Details
    ↓
Process Payment → Complete
```

---

_Last Updated: January 2026_

