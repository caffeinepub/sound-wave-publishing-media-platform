# Sound Wave Publishing & Media

## Current State

The platform already has:
- Artist profiles with multi-media galleries (music, image, video, text media types)
- Copyright registration and trademark management
- Score sheet upload/download and sales
- Lightscribe Design & Labeling Suite
- ElasticStage integration (Phases 1 & 2)
- Event registration with Stripe checkout
- Share/equity system (Founder, Preferred, Common) with certificates, marketplace, and earnings dashboard
- Admin bookkeeping (invoices, payouts, membership fees)
- Access control with user/admin/guest roles
- MediaType enum: `#music | #image | #video | #text`
- MediaMetadata with title, description, mediaType, copyrightInfo, licensingOptions, fileReference

## Requested Changes (Diff)

### Add

**Backend:**
- Extended `ArtworkCategory` variant type to tag media with fine-grained art categories:
  - `#narrativeArts` — written narrative works, short stories, novellas
  - `#poetry` — poems and verse
  - `#photography` — photographic works
  - `#artDesigns` — digital and graphic art designs
  - `#artsAndCrafts` — handcrafted and mixed-media works
  - `#cinemaCreation` — films, short films, video art
  - `#musicalWorks` — musical compositions
  - `#scoreSheets` — sheet music and musical scores
- Extended `MediaMetadata` to include optional `artworkCategory: ?ArtworkCategory` and optional `saleFormats: [SaleFormat]` fields
- `SaleFormat` type: `{ formatType: Text; price: Nat; description: Text }` covering prints, originals, digital downloads
- New query: `getMediaByCategory(category: ArtworkCategory): [MediaMetadata]`
- New query: `getAllGalleryMedia(): [MediaMetadata]` (returns all media for public gallery browsing)
- New query: `getArtistWorksByCategory(artistId: Text, category: ArtworkCategory): [MediaMetadata]`
- New update: `uploadArtwork(metadata: MediaMetadata): ()` (alias for uploadMedia, accepts extended metadata)

**Frontend pages:**
- `/galleries` — Public gallery landing page listing all 8 art categories with preview cards
- `/galleries/:category` — Category gallery page (grid of works, filter by artist, sort by date/price)
- `/galleries/:category/:mediaId` — Individual artwork detail page (purchase, license, copyright info)
- Updated artist profile page (`/artist/:artistId`) — show category tabs for each art type the artist has works in
- Updated artist dashboard (`/dashboard`) — upload wizard with category selection, sale format options, and copyright registration

**Homepage updates:**
- Hero tagline updated to: *"Changing the view of a starving artist."*
- New "Explore Our Galleries" section with visual cards for each art category
- Updated features section to reflect all art disciplines

### Modify

- `MediaMetadata` backend type: add `artworkCategory` optional field and `saleFormats` array
- `ArtistProfilePage`: add category tabs and per-category work grids
- `ArtistDashboard`: extend upload form with category selector and sale format inputs
- `HomePage`: update hero headline/tagline and add gallery discovery section
- `Header`: add "Galleries" nav link with dropdown for category navigation

### Remove

- Nothing removed; all existing features preserved

## Implementation Plan

1. **Backend (Motoko)**: Add `ArtworkCategory` and `SaleFormat` types; extend `MediaMetadata`; add `getMediaByCategory`, `getAllGalleryMedia`, `getArtistWorksByCategory` queries
2. **Generate hero image**: Dark premium gallery aesthetic for homepage banner
3. **Generate art category images**: Atmospheric thumbnails for each of the 8 categories
4. **Frontend - Gallery pages**: `/galleries`, `/galleries/$category`, individual artwork detail
5. **Frontend - Homepage**: Update hero with new tagline, add gallery cards section
6. **Frontend - Artist pages**: Add category tabs to profile, extend dashboard upload form
7. **Frontend - Header**: Add Galleries nav link/dropdown
