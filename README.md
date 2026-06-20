# Notice Board

A small CRUD app for posting institutional notices (Exam / Event / General),
built with the Next.js **Pages Router**, **Prisma**, and a hosted
MySQL-compatible database (TiDB Cloud).

Live app: _add your Vercel URL here before submitting_
Repo: _add your GitHub URL here before submitting_

## Tech stack

| Layer      | Choice                                   |
|------------|-------------------------------------------|
| Framework  | Next.js 14, Pages Router (`pages/`)       |
| Database   | TiDB Cloud (MySQL-compatible, free tier)  |
| ORM        | Prisma                                    |
| Styling    | Plain CSS (CSS Modules, no framework)     |
| Hosting    | Vercel (Hobby tier)                       |

## Running it locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up a database.** Create a free [TiDB Cloud](https://tidbcloud.com)
   Serverless cluster, then copy its connection string from the "Connect"
   panel.

3. **Configure environment variables.**

   ```bash
   cp .env.example .env
   ```

   Paste your connection string into `.env` as `DATABASE_URL`. Make sure
   special characters in the password are URL-encoded.

4. **Create the database schema.**

   ```bash
   npx prisma migrate dev --name init
   ```

   This creates the `Notice` table and generates the Prisma client.

5. **Run the dev server.**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deploying

1. Push this repo to GitHub.
2. Import it on [Vercel](https://vercel.com) (Hobby/free tier).
3. Add `DATABASE_URL` as an environment variable in the Vercel project
   settings (same value as your local `.env`).
4. Deploy. Vercel runs `prisma generate` automatically via the
   `postinstall` script, and `npm run build` runs `prisma generate` again
   before `next build` as a safeguard.
5. The schema is created with `npx prisma migrate dev` locally against the
   same hosted database, so no migration step is needed on Vercel itself —
   it's already applied to the shared TiDB Cloud instance.

## Design notes / decisions

A few things in the brief were intentionally left open. Here's what I chose
and why:

- **Read vs. the other three operations.** The brief requires create,
  update, and delete to go through API routes — it doesn't require that of
  read. The notice list (`pages/index.js`) and the edit page's pre-fill both
  use `getServerSideProps` to query Prisma directly, which is the
  idiomatic Pages Router pattern and avoids an unnecessary HTTP round-trip
  on the server. A `GET /api/notices` and `GET /api/notices/[id]` route
  still exist for API completeness and are what create/update/delete sit
  alongside.
- **Urgent-first ordering.** The `Priority` enum is declared as
  `Normal` then `Urgent` in `schema.prisma`. MySQL enums sort by their
  declaration order, so `orderBy: [{ priority: "desc" }, { publishDate: "desc" }]`
  reliably puts every `Urgent` notice above every `Normal` one, with newest
  first inside each group. This happens in the Prisma query, not in the
  browser.
- **Ordering of Normal notices.** Chosen order is most-recent `publishDate`
  first within each priority tier — a reasonable default for a notice
  board where people care most about what's new.
- **Delete confirmation.** A small custom modal (`ConfirmDialog`) rather
  than a native `confirm()`, so it matches the rest of the UI and is
  keyboard/focus accessible.
- **Server-side validation.** `lib/validateNotice.js` is the single source
  of truth, used by both the create and update API routes. It checks that
  `title`/`body` are non-empty strings, `category`/`priority` are one of
  the allowed values, and `publishDate` parses to a valid date — independent
  of whatever the browser already checked.
- **Image upload** was left out of this submission (marked as a bonus in
  the brief) to keep the core CRUD flow solid within the time available.

## One thing I'd improve with more time

Add the optional image upload: a Vercel Blob (or Cloudinary free tier) field
on the form, an `imageUrl` column on `Notice`, and a thumbnail on each card.
The schema and form are already structured so that's an additive change
rather than a rework.

## Where and how AI was used

I used Claude (Anthropic) as an AI pair-programmer for this assignment:

- Scaffolding the project structure (pages, API routes, components) from
  the written brief.
- Writing the Prisma schema and the server-side validation helper.
- Writing the bulk of the React components and CSS.
- Drafting this README.

I reviewed and adjusted the generated code myself — in particular the
Urgent-first ordering approach (confirming how MySQL enum ordering behaves)
and the split between what goes through `getServerSideProps` vs. API
routes, both described above. I did not use AI to write content unrelated
to this assignment (e.g., no copied boilerplate from unrelated repos).

## Folder structure

```
pages/
  index.js                  # Notice list (SSR via Prisma, Urgent-first)
  notices/new.js            # Create form
  notices/[id]/edit.js      # Edit form (SSR pre-fill via Prisma)
  api/notices/index.js      # GET list, POST create
  api/notices/[id].js       # GET one, PUT update, DELETE
components/
  Layout.js, NoticeCard.js, NoticeForm.js, ConfirmDialog.js
lib/
  prisma.js                 # Prisma client singleton
  validateNotice.js         # Shared server-side validation
prisma/
  schema.prisma
styles/
  globals.css, Index.module.css, FormPage.module.css
```
