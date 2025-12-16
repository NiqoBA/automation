# NorthPeak Digital - Landing Page

A top 1% landing page for a Digital Transformation & AI Automation agency built with Next.js 14+ (App Router), TypeScript, and TailwindCSS.

## Features

- **Modern Stack**: Next.js 14+ App Router, TypeScript, TailwindCSS
- **Performance**: Optimized for speed with minimal dependencies
- **Responsive**: Perfect on mobile, tablet, and desktop
- **Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation
- **SEO Optimized**: Complete metadata, OpenGraph, and semantic HTML
- **Animations**: Subtle Framer Motion animations for smooth UX
- **Conversion Focused**: Clear CTAs, social proof, and trust indicators

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles
├── components/
│   ├── Navbar.tsx          # Sticky navigation
│   ├── Hero.tsx            # Hero section with CTAs
│   ├── SocialProof.tsx     # Client logos and stats
│   ├── Services.tsx        # What we do section
│   ├── UseCasesCarousel.tsx # Use cases carousel
│   ├── Process.tsx         # How it works timeline
│   ├── Integrations.tsx    # Integration grid
│   ├── Results.tsx         # Case highlights
│   ├── Pricing.tsx         # Pricing plans
│   ├── FAQ.tsx             # FAQ accordion
│   ├── CTA.tsx             # Final CTA section
│   ├── Footer.tsx          # Footer
│   └── ContactModal.tsx    # Contact form modal
└── package.json
```

## Customization

### Branding
- Update brand name in `components/Navbar.tsx`
- Modify colors in `tailwind.config.ts`
- Change fonts in `app/layout.tsx`

### Content
All content is editable directly in the component files. No CMS required.

### Styling
TailwindCSS is configured with custom colors. Modify `tailwind.config.ts` to adjust the design system.

## Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## License

MIT


