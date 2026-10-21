# Alpha Contacts — Table & Board Prototype

A standalone React + TypeScript contact-management prototype built for Alpha’s Frontend Design Engineer exercise. It uses fictional contact data and client-side React state only. There is no backend, authentication, API, or database.

## Run locally

### Requirements

- Node.js 18 or newer
- npm

### Install and start

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal (usually `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

`npm run build` runs the TypeScript project build and creates the production bundle in `dist/`. `npm run preview` serves that built bundle locally.

## Features

- **Two views, one dataset:** switch between a spreadsheet-style Table and a stage-based Board.
- **10 fictional contacts:** records include Name, Email, Company, Role, Owner, Labels, Stage, and Notes.
- **Shared details panel:** open a contact from either view to inspect and edit its fields.
- **Save and Cancel:** panel edits are kept in a draft until saved; Cancel or Escape closes the panel without committing draft changes.
- **Stage updates:** stage changes from the table and board update the shared contact collection, so the record appears in the corresponding board column.
- **Search and stage filtering:** search across contact details and labels, or filter by stage.
- **Missing and empty states:** optional fields can be blank, empty search results are handled, and all four board groups render even when a group has no contacts.
- **Additional utilities:** create a contact, export the contact list as CSV, and use keyboard focus indicators and Escape to close the details panel.
- **Responsive layout:** the interface adapts to narrower desktop widths; board columns can be scrolled horizontally when needed.

## Design decisions

### 1. A single source of truth

All contacts live in one React state array. The table and board derive their displayed records from that array instead of maintaining separate copies. This keeps stage changes and edits consistent when switching views.

### 2. Draft-based editing in the details panel

Opening a record creates an editable draft. The Save action commits the draft to the shared collection; Cancel and Escape discard it. This makes the difference between an in-progress edit and a saved record explicit.

### 3. Different density for different tasks

The table prioritizes scanning across fields such as name, email, company, role, owner, labels, and stage. Board cards prioritize identity, company/role, labels, notes, and owner so records can be compared within a stage. The details panel is the place for editing the complete record.

### 4. Preserve context

The selected Table or Board view and current search/filter settings remain in place when the details panel is opened and closed. Focus is returned to the initiating control when possible, helping users continue where they left off.

### 5. Mock data, deliberately

Names and companies are fictional sample data. Changes live in memory and reset on refresh, matching the exercise’s requirement for a standalone prototype without persistence or backend services.

## Trade-offs and scope

- Drag-and-drop, persistence, multi-select, and advanced property customization were left out to prioritize the core view-switching and editing flow within the suggested 3–4 hour scope.
- Stage filtering and search are intentionally lightweight and run locally against the in-memory dataset.
- Quick stage actions update immediately, while edits made in the details panel require an explicit Save.
- The prototype has basic keyboard support and visible focus styles, but it is not a fully audited accessibility implementation. For example, a production-grade modal would need a robust focus trap and more comprehensive screen-reader announcements.
- There is no automated test suite included in this prototype.

## What I would improve next

1. Add unit and interaction tests for repeated edits, cancel behavior, stage changes, and switching views.
2. Complete accessibility hardening: modal focus trapping, Escape and focus-return tests, screen-reader announcements, and a full keyboard-only pass.
3. Add persistence through an API and clear loading, error, and optimistic-update states.
4. Improve contact and label management, including validation and duplicate handling.
5. Add drag-and-drop between board columns if it improves the workflow after usability testing.

## Tech stack

- React 18
- TypeScript
- Vite
- Tailwind CSS configuration and custom CSS for the interface styling
- Lucide React icons

---

Built as a fictional-data frontend evaluation prototype. No real customer or personal data is included.
