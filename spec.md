# Sound Wave Publishing & Media

## Current State
The app has three shares pages:
- `/shares/certificates` — ShareCertificatesPage: gallery of Founder, Preferred, and Common share certificates with tier details and a modal view.
- `/shares/marketplace` — ShareMarketplacePage: tier comparison table, buy/sell interface for Common shares via Stripe, price history.
- `/shares/earnings` — EarningsDashboardPage: dividend stats, claimable balance, payout history, dividend rate reference.

None of these pages currently display the proposed stock ticker symbol **SWPM** for Sound Waves Publishing & Media.

There is no Investor Relations page in the app.

## Requested Changes (Diff)

### Add
- **SWPM ticker badge/label** displayed prominently on all three shares pages (certificates, marketplace, earnings dashboard):
  - Shown in the page header area as a styled ticker chip (e.g., "SWPM · $1.00 · Privately Held")
  - Also shown in the Share Structure Overview table header on the certificates page
  - Also shown in the marketplace page header
- **Investor Relations page** at `/shares/investor-relations`:
  - Company overview: Sound Waves Publishing & Media, proposed ticker SWPM, parent company RTS Enterprises, founder Mr. Robin T. Harding Smith
  - Share structure summary (10M total shares, 70/20/10% ownership breakdown including ESBT and 508(c)(1)(A) faith-based org)
  - Dividend rates by tier
  - Disclaimer section: shares are privately held and not yet listed on a public exchange; pursuing future listing; investors should consult a securities attorney
  - Contact / IR inquiry section
- **Route** for the new Investor Relations page added to App.tsx
- **Navigation link** to `/shares/investor-relations` added to the Shares dropdown in the Header

### Modify
- ShareCertificatesPage: add SWPM ticker chip in page header
- ShareMarketplacePage: add SWPM ticker chip in page header
- EarningsDashboardPage: add SWPM ticker chip in page header
- Header: add "Investor Relations" link under the Shares menu dropdown

### Remove
- Nothing removed

## Implementation Plan
1. Create `InvestorRelationsPage.tsx` at `src/frontend/src/pages/InvestorRelationsPage.tsx` with company overview, share structure, dividend rates, disclaimer, and contact section.
2. Add SWPM ticker chip component (inline, reusable styled span/badge) and place it in the header area of ShareCertificatesPage, ShareMarketplacePage, and EarningsDashboardPage.
3. Register `/shares/investor-relations` route in App.tsx and import InvestorRelationsPage.
4. Add "Investor Relations" link to the Shares dropdown in Header.tsx.
