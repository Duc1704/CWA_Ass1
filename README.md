# Tabs Generator (Next.js)

A simple, accessible Next.js app that lets you create custom tabs, edit their content, and generate shareable code. It includes a responsive layout, dark/light theme toggle, a hamburger menu, and an About page with profile images and a demo video.

## Tech Stack
- Next.js App Router (TypeScript)
- Tailwind utility classes
- Client components + custom hooks

## Getting Started

1) Install dependencies:
```bash
npm install
```

2) Start the dev server:
```bash
npm run dev
```
Visit `http://localhost:3000`.

## Available Scripts
```bash
npm run dev       # start development server
npm run build     # build for production
npm run start     # start production server (after build)
```

## Project Structure
```
app/
  components/
    navigation/            # Tab navigation bar
    overViewTabButton/     # Buttons and UI for the Tabs page
    Header.tsx             # App header (title, theme toggle, menu)
    Footer.tsx             # App footer
    Tabs.tsx               # Tabs root component for pages
    ThemeToggle.tsx        # Light/Dark toggle
  hooks/                   # Custom hooks used across the app
  tabs/
    OverviewTab.tsx        # Create/manage custom tabs, generate code
    PrelabTab.tsx          # Placeholder page
    EscapeRoomTab.tsx      # Placeholder page
    CodingRacesTab.tsx     # Placeholder page
    AboutTab.tsx           # Profile/info + demo video
  page.tsx                 # Home composition (Header + Tabs + Footer)
  layout.tsx               # Root layout & global styles
  globals.css              # Tailwind import + global variables
public/
  images/                  # Place profile images here (see below)
  videos/                  # Place demo video here (see below)
```

## Features
- Responsive layout using flex and small utility classes
- Theme toggle (light/dark) via CSS variables
- Tabs page to create custom tabs, rename, delete, and generate code
- About page that shows profile images and a demo video

## Configuration
Edit `app/constants.ts` to set your identity:
```ts
export const STUDENT_NAME = "Your Name";
export const STUDENT_NUMBER = "YourStudentNumber";

// Optionally list image file names located under /public/images
export const PROFILE_IMAGES: string[] = ["profile.png"]; // e.g. ["me.jpg", "avatar.png"]
```

If `PROFILE_IMAGES` is provided, the About page will use those exact filenames. If omitted, it will try a few standard names.

## Media (Images & Videos)

### Images
- Put images under `public/images/`.
- Reference them by filename in `PROFILE_IMAGES` (e.g., `"photo.jpg"`).
- The About page attempts to preload and only renders images that resolve.

Example layout on the About page:
- Left: images (stacked)
- Right: name and student number

### Video
- Put your demo at `public/videos/demo.mp4` (recommended format: MP4/H.264 + AAC).
- The About page displays a centered section with the title "Demo video", the video, and a brief description.
- Replace the file name in `AboutTab.tsx` if you want to use a different name/path.

## How to Use
1) Open the app and navigate to the "Tabs" page (default).
2) Click "Create New Tab" to add a custom tab and start editing.
3) Use the buttons to rename, delete, or generate code.
4) Visit the "About" page to see your profile info and demo video.

## Notes
- Static files must live in `public/` (e.g., images in `public/images`, videos in `public/videos`).
- For best compatibility, use `*.mp4` for videos.

## License
This project is for coursework and personal learning. Adapt as needed.
