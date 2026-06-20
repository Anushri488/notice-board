# Notice Board

A small CRUD application for posting institutional notices (Exam / Event / General), built using the Next.js Pages Router, Prisma, and a hosted MySQL-compatible database (TiDB Cloud).

### Live Demo

https://notice-board-ashy-psi.vercel.app

### GitHub Repository

https://github.com/Anushri488/notice-board

---

## Tech Stack

| Layer     | Technology                    |
| --------- | ----------------------------- |
| Framework | Next.js 14 (Pages Router)     |
| Database  | TiDB Cloud (MySQL-compatible) |
| ORM       | Prisma                        |
| Styling   | CSS Modules                   |
| Hosting   | Vercel                        |
| Language  | JavaScript                    |

---

## Features

* Create notices
* Edit existing notices
* Delete notices with confirmation dialog
* Urgent notices displayed first
* Server-side validation
* Responsive UI
* Server-side rendering using `getServerSideProps`
* REST API routes for CRUD operations

---

## Running Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Add your TiDB connection string:

```env
DATABASE_URL="your_database_url"
```

### 3. Apply migrations

```bash
npx prisma migrate dev --name init
```

### 4. Run the application

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Deployment

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Add the `DATABASE_URL` environment variable.
4. Deploy the project.

The Prisma client is generated automatically during build.

---

## Design Decisions

### Server-Side Rendering

The notice list and edit pages use `getServerSideProps`, allowing data to be fetched directly through Prisma without unnecessary API requests.

### Urgent-First Ordering

Notices are sorted using:

```javascript
orderBy: [
  { priority: "desc" },
  { publishDate: "desc" }
]
```

This ensures:

* Urgent notices appear first.
* Newer notices appear before older ones.

### Validation

`lib/validateNotice.js` acts as the single source of truth for both create and update operations. Validation includes:

* Required title and body.
* Valid category values.
* Valid priority values.
* Proper date validation.

### Delete Confirmation

A custom confirmation modal is used instead of the browser's `confirm()` dialog to provide a better user experience and improved accessibility.

---

## Challenges Faced

### Date Serialization Issue

Prisma `DateTime` fields (`createdAt`, `updatedAt`) cannot be directly serialized by Next.js.

This was resolved by converting them using:

```javascript
date.toISOString()
```

before passing them through `getServerSideProps`.

### Deployment Protection Issue

The initial Vercel deployment returned a 401 error because Deployment Protection was enabled. Updating the project settings made the production deployment publicly accessible.

---

## Future Improvements

* Image upload support using Vercel Blob or Cloudinary.
* Search and filtering functionality.
* Pagination for large numbers of notices.
* Authentication and role-based access.
* Notice categories with colored badges.
* Rich text editor for notice content.

---

## Development Process

This project was designed, implemented, tested, and deployed entirely by me.

The work included:

* Designing the database schema.
* Building API routes.
* Creating React components.
* Writing CSS modules.
* Implementing server-side validation.
* Configuring Prisma and TiDB Cloud.
* Running migrations.
* Testing CRUD functionality.
* Debugging serialization issues.
* Deploying and configuring the application on Vercel.

AI tools were used only for occasional documentation reference and concept clarification during development. The application code, debugging, testing, and deployment were completed independently.

---

## Folder Structure

```text
pages/
  index.js
  notices/new.js
  notices/[id]/edit.js
  api/notices/index.js
  api/notices/[id].js

components/
  Layout.js
  NoticeCard.js
  NoticeForm.js
  ConfirmDialog.js

lib/
  prisma.js
  validateNotice.js

prisma/
  schema.prisma

styles/
  globals.css
  Index.module.css
  FormPage.module.css
```