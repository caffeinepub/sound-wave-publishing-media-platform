# Sound Wave Publishing & Media — Stripe Admin Settings

## Current State
- `StripeConfiguration` in Motoko only stores `secretKey` and `allowedCountries`
- `setStripeConfiguration` / `isStripeConfigured` exist but there is no publishableKey, webhookSecret, or testMode field
- Admin dashboard at `/admin/dashboard` has tabs for Shareholders, Registrations, Accounting, and potentially others
- No dedicated admin settings page or tab for Stripe key management
- Membership subscription records tracked via `MembershipFeeRecord`

## Requested Changes (Diff)

### Add
- `AdminStripeSettings` type in main.mo: `{ publishableKey: Text; secretKey: Text; webhookSecret: Text; testMode: Bool; allowedCountries: [Text] }`
- `setAdminStripeSettings(settings)` — admin-only
- `getAdminStripeSettings()` — admin-only, returns optional settings
- `getSubscriptionStats()` — returns `{ activeSubscribers: Nat; monthlyRevenue: Float; totalRevenue: Float }` derived from membership fee records
- New `AdminSettingsPage` at `/admin/settings` with:
  - Stripe Publishable Key field (password input, masked)
  - Stripe Secret Key field (password input, masked)
  - Webhook Secret Key field (password input, masked)
  - Test/Live mode toggle switch
  - "Save Settings" button
  - "Test Connection" button (calls `isStripeConfigured` and verifies keys are non-empty)
  - Active subscriber count card
  - Monthly & total revenue summary cards
  - Warning banner about key storage security
- New "Settings" tab added to `AdminDashboardPage`
- Link to `/admin/settings` from admin nav

### Modify
- `setStripeConfiguration` updated to use keys from `AdminStripeSettings` when creating checkout sessions
- `AdminDashboardPage` — add a Settings tab
- `App.tsx` — add route for `/admin/settings`

### Remove
- Nothing removed

## Implementation Plan
1. Add `AdminStripeSettings` type, stable var, and get/set/stats functions to main.mo
2. Regenerate or manually extend backend.d.ts with new function signatures
3. Build `AdminSettingsPage.tsx` with all fields, toggle, test connection, and stats cards
4. Add `/admin/settings` route in App.tsx
5. Add Settings tab to AdminDashboardPage
6. Validate (typecheck + build)
