# Alpha Contacts — Table & Board Prototype

A standalone React + TypeScript contact-management prototype built for the Alpha Frontend Design Engineer exercise. It uses fictional records and local React state only—no backend, login, API, or database.

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To verify a production build:

```bash
npm run build
npm run preview
```

## Included

- 10 fictional contacts shared by the Table and Board views.
- Table and Kanban-style Board switch with the same underlying contact collection.
- Details side panel with editable contact fields, Stage, Notes, labels, and owner.
- Explicit Save changes and Cancel behavior. Cancel discards the draft; save updates the shared record and therefore both views.
- Quick stage changes from the table and board, with immediate shared-state updates.
- Search and stage filtering shared across views.
- Empty board groups, missing email/company/role/notes, and empty search results.
- Add-contact flow, CSV export, keyboard Escape to close the details panel, visible focus styles, responsive narrower-desktop layout, and reduced-motion support.

## Design choices

- **One source of truth:** contacts are held in a single React state array. Both views derive their rows/cards from that array, avoiding duplicate or stale view-specific records.
- **Draft editing:** opening the details panel copies the selected record into a draft. Only Save commits it; Cancel and Escape close the panel without mutating the collection.
- **Preserve context:** the current view and search/filter state stay mounted while the side panel opens. Closing the panel returns focus to the triggering control when it is still available.
- **Scannable hierarchy:** the table prioritizes identity and business fields; board cards emphasize name, company/role, labels, notes, and owner. Full details remain in the panel.
- **Mocked data:** all names and companies are fictional placeholders for evaluation. State resets on page refresh by design.

## Trade-offs and next improvements

- Drag-and-drop, persistence, multi-select, and advanced property customization are intentionally out of scope for the suggested 3–4 hour exercise.
- Search and stage filtering are local and intentionally lightweight.
- For a production version, I would add automated tests for repeated edit/cancel/view-switch sequences, improve modal focus trapping and screen-reader announcements, persist changes through an API, and add a proper contact/label creation workflow.
