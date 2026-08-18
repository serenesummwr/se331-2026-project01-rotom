# The CA?T Passport

This project was developed for the SE331 Component-Based Software Development.

## Submission

| Item | Link |
| --- | --- |
| GitHub repository | https://github.com/serenesummwr/se331-2026-project01-rotom |
| Deployed website | https://se331-2026-project01-rotom.vercel.app |
| Demo video (2–3 minutes) | https://vimeo.com/1219147018?share=copy&fl=sv&fe=ci |

## Group Information

**Group name:** `rotom`

| Student ID | Name | GitHub username |
| --- | --- | --- |
| `672115010` | `Natanon Somboon` | `Natanon00` |
| `672115011` | `Natthapoom Saengkaew` | `serenesummwr` |
| `672115025` | `Tunsirivut Thossarost` | `Tun2zidi` |

## Demo Accounts

The application accepts any password for the required demonstration accounts.

| Username | Role | Initial level |
| --- | --- | --- |
| `admin` | Administrator | Level 4 |
| `user1` | Member | Level 1 |
| `user2` | Member | Level 2 |

## Features

### Public pages

- Responsive landing page
- Login with role-based redirection
- Member registration
- Catch-all 404 page

### Member features

- View the current level, benefits, and available services
- View and edit personal information
- View exam history and earned badges
- Study eLearning content matching the current level
- Take a multiple-choice upgrade examination
- Submit the exam only after answering every question
- View the score, result, date, and time of each attempt
- Upgrade immediately after passing an exam
- Automatically update benefits, services, and eLearning content after an upgrade

### Administrator features

- View the member directory
- Filter members by name, level, and province
- Navigate member pages using URL-based pagination
- View member information and exam history
- Edit member information
- Activate and deactivate member accounts
- View all four service levels
- View benefits, services, questions, and pass criteria for each level
- Edit level information and pass criteria
- Create, edit, and remove examination questions

## Mock Data

All initial mock data is stored in the root-level [`db.json`](./db.json).

The database contains:

- 34 users, including 33 members and 1 administrator
- 4 service levels
- 16 benefits
- 14 services
- 18 examination questions
- 79 exam-history records
- 8 eLearning items
- 4 badges

### Why load `db.json` as a Vite asset?

The project does not require a real backend. Vite publishes `db.json` as a versioned static asset, and Axios loads it before hydrating the Pinia stores. This keeps all mock collections consistent, avoids dependence on an external mock API, and works reliably on Vercel. Data changes remain session-only and reset on refresh, as permitted by the requirements.

## Technology Stack

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Axios
- Tailwind CSS
- Lucide Icons
- Oxlint
- ESLint
- Oxfmt
- Vercel

## Running the Project Locally

### Requirements

- Node.js
- npm

### Installation

```bash
git clone https://github.com/serenesummwr/se331-2026-project01-rotom.git
cd se331-2026-project01-rotom
npm install
```

### Development server

```bash
npm run dev
```

### Production build

```bash
npm run build
npm run preview
```

## Code Quality Commands

```bash
npm run format
npm run type-check
npm run lint
npm run build
```

## Main Routes

| Route | Description |
| --- | --- |
| `/` | Landing page |
| `/login` | Login page |
| `/register` | Registration page |
| `/app` | Member dashboard |
| `/app/profile` | Member profile |
| `/app/elearning` | eLearning content |
| `/app/exam` | Upgrade examination |
| `/admin` | Administrator dashboard |
| `/admin/users` | Member directory |
| `/admin/levels` | Level and examination management |

The application includes a Vercel SPA rewrite, allowing routes such as `/admin/users` to be opened or refreshed directly without returning a 404 response.

## Deployment

The production website is deployed automatically from the `main` branch using Vercel:

https://se331-2026-project01-rotom.vercel.app

Development changes are reviewed through pull requests into `dev`. Completed releases are merged from `dev` into `main` using merge commits.
