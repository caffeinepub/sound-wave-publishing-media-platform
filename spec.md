# Sound Wave Publishing & Media

## Current State
The live homepage is displaying raw translation keys like "home.hero", "home.hero.tagline" as visible text, making the site look unprofessional. The `.old/` source has a corrected `HomePage.tsx` that uses hardcoded professional text (no hero section, no raw translation keys rendered on screen), but the issue persists in the live view due to a stale deployment.

The current `HomePage.tsx` correctly shows:
- Company name as a plain heading
- Mission statement: "Empowering original artists to showcase, protect, and profit from their creative work."
- Brand tagline: "Where Music and Art Meet Legacy" in small caps
- Stats bar, galleries section, features, ownership structure, and CTA — all working

## Requested Changes (Diff)

### Add
- Nothing new to add

### Modify
- Ensure `HomePage.tsx` has NO references to `t("home.hero.*")` anywhere — all hero-related translation calls must be replaced with hardcoded professional text
- Ensure the homepage intro section is clean, professional, and plain — no hero banner, no nav, no login button
- The intro section must display:
  1. Company name: "Sound Wave Publishing & Media" as a plain `<h1>`
  2. Mission statement: "Empowering original artists to showcase, protect, and profit from their creative work."
  3. Brand tagline: "Where Music and Art Meet Legacy" styled in small caps as a secondary brand identifier
- Remove any leftover hero section code, hero badges, hero buttons, or hero image backgrounds from the homepage
- Verify the Header component does not show navigation links (only logo + language switcher + user menu when logged in)

### Remove
- Any hero section remnants from the homepage
- Any `t("home.hero.*")` calls from the homepage

## Implementation Plan
1. Review `HomePage.tsx` and confirm all hero-related code is removed and the intro section is plain and professional
2. Review `Header.tsx` and confirm no top-level navigation links are shown (only logo, language switcher, user dropdown)
3. Validate the build passes
4. Deploy
