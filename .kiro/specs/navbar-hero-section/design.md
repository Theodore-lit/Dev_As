# Design Document: Navbar & Hero Section

## Overview

This design document specifies the implementation approach for the public-facing navbar and hero section of the "Question pour un DevAs" competition website. The navbar provides sticky header navigation and authentication actions, while the hero section serves as the landing area with compelling messaging, calls-to-action, and feature highlights. The design strictly adheres to the established design system mockup (docs/maquette/index.html) using CSS classes, Tailwind utilities, and responsive design patterns.

The implementation separates concerns into:
1. **Header Component** (src/components/common/header.tsx) - Enhanced navbar
2. **HeroSection Component** (new) - Hero section with cards
3. **HomePage** (app/page.tsx) - Updated to use new components

## Architecture

### Component Hierarchy

```
HomePage (Server Component)
├── Header (Client Component - for mobile menu interactivity)
│   ├── BrandLogo
│   ├── DesktopNav (hidden on mobile)
│   ├── AuthButtons
│   ├── HamburgerMenu (mobile only)
│   └── MobileNav (mobile menu)
├── HeroSection (Server Component)
│   ├── Badge
│   ├── Heading + Subheading
│   ├── CTA Buttons
│   ├── HeroImage (Next.js Image)
│   └── FeatureCards (grid of 4)
└── ... other sections
```

### File Structure

**Files to create/modify**:
- `src/components/common/header.tsx` - Enhanced existing header with design system classes
- `src/components/home/hero-section.tsx` - New hero section component
- `src/components/home/feature-card.tsx` - Feature card component
- `app/page.tsx` - Updated homepage to use new HeroSection

**No external dependencies**: Implementation uses existing UI components (Button, card classes) and design system CSS from globals.css

## Components and Interfaces

### 1. Header Component (Enhanced)

**Location**: `src/components/common/header.tsx`

**Type**: Client Component (`'use client'` - required for mobile menu state)

**Props Interface**:
```typescript
interface HeaderProps {
  role?: 'public' | 'participant' | 'admin';  // Navigation context
  userName?: string;                           // Authenticated user display
  onLogout?: () => void;                       // Logout callback
}
```

**Responsibilities**:
- Render sticky navbar at top of viewport
- Display DevAs logo linking to home
- Show/hide navigation based on device type (desktop vs mobile)
- Render hamburger menu on mobile
- Display authentication buttons or user info
- Provide navigation link highlighting

**Key Implementation Details**:
- Use `.pub-h` class for sticky header styling (position sticky, z-index 50)
- Use `.wrap` class for container max-width and padding
- Use `.nav` class for navigation list with flex layout
- Desktop nav: `hidden md:flex` for responsive visibility
- Mobile menu: Toggle state with `useState` hook
- Navigation links use `.nav a` classes with hover state (soft background)
- Active link styling: green color (.nav a.on) with bottom indicator

**Design System Classes Used**:
- `.pub-h`: Sticky header container
- `.wrap`: Container with max-width 1180px and safe-area padding
- `.logo`: Logo styling (height 46px)
- `.nav`: Navigation list with flex layout and gap
- `.nav a`: Link styling with hover state
- `.nav a.on`: Active link highlighting
- `.burger`: Hamburger menu button (mobile only)
- `.btn`, `.btn-p`, `.btn-a`: Button variants

---

### 2. HeroSection Component (New)

**Location**: `src/components/home/hero-section.tsx`

**Type**: Server Component (no interactive state)

**Props Interface**:
```typescript
interface HeroSectionProps {
  // No props needed - displays static content from design
}
```

**Responsibilities**:
- Render hero section with two-column layout (desktop) or single-column (mobile)
- Display badge, heading, subheading, and CTA buttons
- Render hero image (public/hero1.png) with Next.js Image optimization
- Render feature cards grid below hero content
- Apply responsive design patterns

**Key Implementation Details**:
- Use `.hero` class for section styling
- Use `.wrap` for container and max-width
- Use CSS Grid: `grid-template-columns: 1.1fr 0.9fr` for desktop layout
- Mobile breakpoint: `max-width: 900px` changes to single column
- Text left column: badge, h1, p.lead, buttons with flex spacing
- Image right column: responsive sizing with next/image
- Feature cards below: 4-column grid with .grid .c4 classes

**Design System Classes Used**:
- `.hero`: Hero section styling
- `.wrap`: Container
- `.sh`: Section header with badge and heading
- `.bd`: Badge styling (.bd class with no variant = default gray)
- `.btn`, `.btn-p`, `.btn-o`: Button variants
- `.grid`, `.c4`: Feature cards grid (4 columns responsive)
- `.card`, `.card.soft`: Card styling for feature cards
- `.ico`: Icon circle for feature card icons

---

### 3. FeatureCard Component (New)

**Location**: `src/components/home/feature-card.tsx`

**Type**: Server Component

**Props Interface**:
```typescript
interface FeatureCardProps {
  icon: string;        // Emoji icon to display
  title: string;       // Card title
  description?: string; // Optional description
}
```

**Responsibilities**:
- Render individual feature card with icon, title, and optional description
- Apply consistent styling from design system

**Key Implementation Details**:
- Use `.card.soft` for white card with soft background fallback
- Use `.ico` class for icon circle background (green pale by default)
- Icon displayed as emoji or text
- Title as h3 element
- Optional description text

**Design System Classes Used**:
- `.card`, `.card.soft`: Card styling
- `.ico`: Icon circle with green-pale background and green-dark text
- `h3`: Heading styling

---

## Data Models

No data models required - all content is static and embedded in components. Future enhancements could fetch dynamic data from Supabase (e.g., competition statistics, feature list).

**Static Content Defined in HeroSection**:
```typescript
const featureCards = [
  { icon: '🏆', title: 'Une compétition prestigieuse' },
  { icon: '💻', title: 'Une aventure tech' },
  { icon: '📊', title: 'Un classement officiel' },
  { icon: '🎯', title: 'Des éditions mémorables' }
];
```

## Responsive Design Strategy

### Breakpoints Used

Following Tailwind CSS convention:
- `sm`: 640px (small tablets)
- `md`: 768px (tablets and small desktops) - **PRIMARY breakpoint for nav visibility**
- `lg`: 1024px (large desktops)
- `xl`: 1280px (extra large)
- **Custom**: `max-width: 900px` for hero layout (per mockup)

### Layout Changes

**Navbar**:
- **Mobile (< 768px)**: Hide horizontal nav, show hamburger menu
- **Desktop (≥ 768px)**: Show horizontal nav, hide hamburger menu

**Hero Section**:
- **Mobile (< 900px)**: Single column layout (text above image)
- **Desktop (≥ 900px)**: Two column layout (text left, image right)

**Feature Cards**:
- **Mobile (< 640px)**: Single column (.c3 at min-width 260px will stack to 1 column)
- **Tablet (640-900px)**: Two columns (.c3 = 3 columns but displays as 2 on tablet)
- **Desktop (≥ 900px)**: Four columns (.c4 = 4 columns)

### Typography Scaling

Using Tailwind `text-` scale with responsive sizes:
- `text-4xl`: Hero h1 (scales down on mobile)
- `text-2xl`: Feature card titles
- `text-base`: Body text
- `text-sm`: Badge text

### Spacing Consistency

All spacing uses Tailwind gaps and margins aligned with design system:
- Section padding: `py-16` or `py-20` (64px per .s class)
- Internal gaps: `gap-8`, `gap-6`, `gap-4`
- Card padding: `p-5` (20px per .card class)

## Error Handling

**Navbar**:
- Missing BrandLogo: Falls back to text link (already handled in existing component)
- Missing navigation links: Renders empty nav (safe, no error)

**HeroSection**:
- Missing image: Next.js Image component handles gracefully with alt text
- Missing feature card data: Renders empty grid (safe, no error)

**Mobile Menu**:
- Click outside menu: Menu stays open (can be enhanced later with blur detection)
- Tab navigation: Proper focus management with visible focus indicators per design system

## Testing Strategy

### Unit Tests

**Header Component**:
- [ ] Logo renders and links to /
- [ ] Navigation links display correctly for given role
- [ ] Hamburger menu shows/hides on mobile breakpoint
- [ ] Active link highlighting applies correctly
- [ ] Authentication buttons display for unauthenticated users
- [ ] User info displays when authenticated
- [ ] Focus visible outlines appear on keyboard navigation

**HeroSection Component**:
- [ ] All text content renders (badge, heading, subheading)
- [ ] CTA buttons link to correct routes
- [ ] Hero image renders with correct alt text
- [ ] Feature cards render with correct titles and icons
- [ ] Layout is single column on mobile, two column on desktop
- [ ] Feature cards grid is responsive

**FeatureCard Component**:
- [ ] Icon renders as emoji
- [ ] Title displays correctly
- [ ] Card styling applies (soft background, border)
- [ ] Optional description renders when provided

### Integration Tests

- [ ] Header navigation works with Next.js Link routing
- [ ] Mobile menu toggle doesn't break on fast clicks
- [ ] Hero section image loads and displays correctly
- [ ] Entire homepage loads without layout shift (CLS = 0)
- [ ] Responsive breakpoints trigger layout changes correctly

### Accessibility Tests

- [ ] Navbar links are keyboard navigable (Tab order: left to right)
- [ ] Focus indicators are visible on all interactive elements
- [ ] Hamburger menu has aria-label and aria-expanded attributes
- [ ] H1 and H3 headings have proper semantic structure
- [ ] Images have meaningful alt text
- [ ] Color contrast meets WCAG AA standards (4.5:1 minimum)
- [ ] Touch targets are minimum 44x44px on mobile

### Performance Tests

- [ ] Hero image loads with Next.js Image optimization
- [ ] No layout shift (CLS) during hero section render
- [ ] Navbar renders without blocking main thread
- [ ] Mobile menu toggle is smooth (16ms frame budget)

## Implementation Notes

### Design System Compliance

All styling must use established design system classes and Tailwind utilities:

**Color Palette** (from tailwind.config.ts):
- Green: `#039846` (primary)
- Green-dark: `#026b30` (hover, titles)
- Green-pale: `#DDF4E5` (backgrounds)
- Orange: `#E56001` (secondary/action)
- Orange-pale: `#FFF0E2` (backgrounds)
- Soft: `#F3F4F6` (secondary backgrounds)
- Line: `#E2E5E9` (borders)
- Ink: `#1F2937` (primary text)
- Mute: `#5B6573` (secondary text)

**Typography**:
- Headings: Montserrat font (600-800 weight)
- Body: Inter font (400-600 weight)
- Line height: 1.2 for headings, 1.55 for body

**Component Classes** (from docs/maquette/index.html):
- `.pub-h`: Sticky header container
- `.wrap`: Max-width container
- `.hero`: Hero section
- `.nav`: Navigation list
- `.btn`, `.btn-p`, `.btn-o`, `.btn-a`: Buttons
- `.bd`: Badges
- `.card`, `.card.soft`: Cards
- `.grid`, `.c4`, `.c3`: Grid layouts
- `.ico`: Icon circles

### No Inline Styles

Implementation must NOT use inline `style` props. All styling must use:
1. Tailwind CSS classes (via `className`)
2. Design system CSS classes
3. CSS modules (if component-specific styling needed)

### Image Optimization

Hero image must use Next.js Image component:
```typescript
import Image from 'next/image';

<Image
  src="/hero1.png"
  alt="Participants à la compétition Question pour un DevAs"
  width={600}
  height={400}
  priority
  className="w-full h-auto"
/>
```

### Mobile Menu Implementation

Use React `useState` for mobile menu visibility:
```typescript
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// Close menu on link click
const handleNavClick = () => setMobileMenuOpen(false);
```

### Accessibility Attributes

Mobile menu button must include:
```typescript
<button
  aria-label="Toggle navigation menu"
  aria-expanded={mobileMenuOpen}
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
>
  {/* hamburger icon */}
</button>
```

All interactive elements must have visible focus states using design system focus outline:
```
focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-green
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

All CSS features used are widely supported:
- CSS Grid: 100% support
- Flexbox: 100% support
- CSS Variables (custom properties): 98% support
- Focus-visible pseudo-class: 94% support (fallback not critical)

## Performance Targets

- **LCP** (Largest Contentful Paint): < 2.5s
  - Hero image optimized with Next.js Image
  - Critical above-fold content prioritized
- **FID** (First Input Delay): < 100ms
  - Minimal JavaScript (mobile menu only)
  - No heavy computations in Header component
- **CLS** (Cumulative Layout Shift): 0.0
  - Fixed layout, no unexpected shifts
  - Hero image dimensions known upfront

## Maintenance Considerations

### Future Enhancements

1. **Dynamic Navigation Links**: Fetch from CMS or database
2. **A/B Testing**: Test different hero messages or CTA text
3. **Analytics**: Track navbar clicks and CTA conversions
4. **Dark Mode**: Add CSS custom properties for theme support
5. **Internationalization**: Support multiple languages

### Code Organization

- Keep Header component in `src/components/common/header.tsx`
- Create `src/components/home/` folder for HeroSection and FeatureCard
- Add component README.md files with usage examples
- Maintain consistent file naming conventions

### Dependency Management

- No new npm dependencies required
- Use existing UI components (Button from src/components/ui)
- Leverage Next.js built-in Image component for optimization
- Follow existing Tailwind + design system approach

---

## Summary

This design provides:
- ✅ Sticky navbar with responsive navigation and authentication
- ✅ Mobile hamburger menu with proper accessibility
- ✅ Two-column hero section with responsive collapse
- ✅ Compelling content with badge, heading, subheading, CTAs
- ✅ Feature cards grid with responsive layout
- ✅ Full design system compliance (colors, typography, spacing)
- ✅ Accessibility standards (keyboard nav, focus visible, semantic HTML)
- ✅ Performance optimization (Next.js Image, Server Components)
- ✅ No external dependencies beyond existing setup

Ready for implementation following the task list.
