# Notice Board

A small CRUD app for posting institutional notices (Exam / Event / General),
built with the Next.js **Pages Router**, **Prisma**, and a hosted
MySQL-compatible database (TiDB Cloud).

Live app: https://notice-board-ashy-psi.vercel.app
Repo: https://github.com/Anushri488/notice-board

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
6. If the deployment URL returns a 401, check Project Settings →
   Deployment Protection and set it to "Only Preview Deployments" (or
   disabled) so the production URL stays public.

## Design notes / decisions

A few things in the brief were intentionally left open:

- **Read vs. the other three operations.** The brief requires create,
  update, and delete to go through API routes — it doesn't require that of
  read. The notice list (`pages/index.js`) and the edit page's pre-fill both
  use `getServerSideProps` to query Prisma directly, which is the
  idiomatic Pages Router pattern and avoids an unnecessary HTTP round-trip
  on the server. `GET /api/notices` and `GET /api/notices/[id]` routes
  still exist for API completeness and are what create/update/delete sit
  alongside.
- **Urgent-first ordering.** The `Priority` enum is declared as
  `Normal` then `Urgent` in `schema.prisma`. MySQL enums sort by their
  declaration order, so `orderBy: [{ priority: "desc" }, { publishDate: "desc" }]`
  reliably puts every `Urgent` notice above every `Normal` one, with newest
  first inside each group. This happens in the Prisma query, not in the
  browser.
- **Ordering of Normal notices.** Most-recent `publishDate` first within
  each priority tier — a reasonable default for a notice board where
  people care most about what's new.
- **Delete confirmation.** A small custom modal rather than a native
  `confirm()`, so it matches the rest of the UI and is keyboard/focus
  accessible.
- **Server-side validation.** `lib/validateNotice.js` is the single source
  of truth, used by both the create and update API routes. It checks that
  `title`/`body` are non-empty strings, `category`/`priority` are one of
  the allowed values, and `publishDate` parses to a valid date —
  independent of whatever the browser already checked.
- **Image upload** was left out of this submission (marked as a bonus in
  the brief) to keep the core CRUD flow solid within the time available.

## One thing I'd improve with more time

Add the optional image upload: a Vercel Blob (or Cloudinary free tier) field
on the form, an `imageUrl` column on `Notice`, and a thumbnail on each card.
The schema and form are already structured so that's an additive change
rather than a rework.

## Where and how AI was used

I used Claude (Anthropic) to generate the initial scaffolding for this
project — the Prisma schema, the API routes, the React components, and the
CSS. From there, I did the actual setup and shipping work myself:
provisioning the TiDB Cloud cluster and database, configuring environment
variables, running and verifying the Prisma migration, testing the full
CRUD flow locally, debugging a Date-serialization error that came up in
`getServerSideProps` (Prisma's `createdAt`/`updatedAt` fields aren't
JSON-serializable by default and needed an explicit `.toISOString()`),
structuring the Git history into separate logical commits, and handling
the Vercel deployment — including diagnosing and fixing a 401 caused by
Deployment Protection on a preview URL.

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