# Sound Wave Publishing & Media

## Current State
The platform has Stripe integration (`createCheckoutSession`), membership fee record storage (`createMembershipFeeRecord`, `MembershipFeeRecord`), and an admin bookkeeping dashboard. There is no self-service membership signup page for users.

## Requested Changes (Diff)

### Add
- `/membership` page with two subscription tiers:
  - **Monthly Artist Membership** — $10.00/month
  - **Annual Artist Membership** — $100.00/year (~$8.33/month, save $20)
- Stripe Checkout flow initiated from this page using `createCheckoutSession`
- Success/failure redirect pages for membership checkout (`/membership/success`, `/membership/failure`)
- Membership page linked from Header navigation
- On success, automatically call `createMembershipFeeRecord` to log the payment in admin bookkeeping

### Modify
- Header: add "Membership" link in navigation
- Admin Bookkeeping page: membership fee records already display; no structural change needed

### Remove
- Nothing

## Implementation Plan
1. Create `src/frontend/src/pages/MembershipPage.tsx` — two pricing cards (Monthly $10, Annual $100), each with a "Subscribe" button that calls `createCheckoutSession` with the appropriate Stripe line item and redirects to Stripe Checkout
2. Create `src/frontend/src/pages/MembershipSuccessPage.tsx` — confirmation page; calls `createMembershipFeeRecord` to log the fee
3. Create `src/frontend/src/pages/MembershipFailurePage.tsx` — error/cancelled page with a retry link
4. Wire routes in `App.tsx`: `/membership`, `/membership/success`, `/membership/failure`
5. Add "Membership" nav link in `Header.tsx`
