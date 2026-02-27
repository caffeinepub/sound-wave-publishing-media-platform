# Specification

## Summary
**Goal:** Build a full-stack Sound Waves Publishing and Media application with artist share ownership, event registration, Stripe payments, and an admin dashboard — all with a premium music-industry visual theme.

**Planned changes:**

### Backend (Motoko)
- Create a single Motoko actor storing artist profiles (name, email, principal, submitted pieces count, eligibility flag), share ownership records, event registrations, payment transactions, and accounting entries
- Initialize 10,000,000 total shares: 7,000,000 pre-allocated to founder Mr. Robin T. Harding Smith (immutable), 3,000,000 available for artist purchase at $1.00 each
- Implement eligibility logic: artists must submit 15 musical pieces to unlock share purchasing
- Implement share purchase logic: 1–7 shares lifetime cap per artist; first 100 eligible artists receive 1 free share automatically; remaining shares go through Stripe
- Integrate Stripe: admin-configurable secret key, PaymentIntents for ticket and share purchases, webhook endpoint to confirm payments and finalize ownership/registration records
- Admin-only functions: query shareholders, event registrations, and full accounting log; CSV export for each dataset; access restricted to authorized principals

### Frontend
- **Home page**: Hero section with "Sound Waves Publishing and Media" heading, founder credit "Mr. Robin T. Harding Smith, Founder & Creator", and navigation to Event Registration and Artist Portal
- **Event Registration page**: Form for name, email, ticket quantity; order summary; embedded Stripe Elements card input; success and failure states
- **Artist Portal page**: Internet Identity login; profile view with piece submission and progress indicator (X/15); eligibility status; share ownership display; share purchase form (eligible artists only); free share notice for first 100 qualifiers; Stripe payment flow for paid shares
- **Admin Dashboard page**: Admin-only access; three tabs — Shareholders, Event Registrations, Accounting Log — each with a CSV download button; non-admins shown access denied
- **Visual theme**: Dark/near-black background, gold/amber accents, elegant serif/display headings, consistent responsive layout across all pages

**User-visible outcome:** Visitors can register for events and pay via Stripe; artists can log in, build their profile, track submission progress, and purchase company shares once eligible; admins can view and export all shareholder, registration, and accounting data from a protected dashboard.
