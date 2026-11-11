# Implementation Tasks: Navbar & Hero Section

## Overview

This task list breaks down the navbar and hero section implementation into discrete, actionable coding steps. Each task builds incrementally with clear objectives and wiring integration. Follow the tasks in order to ensure all components are properly integrated.

**Estimated Duration**: 2-3 hours
**Language**: TypeScript/TSX (React)
**Framework**: Next.js 16+ with React 19

---

## Tasks

### 1. Update Existing Header Component

- [x] 1.1 Update Header component with design system classes
  - Replace generic Tailwind classes with design system classes (.pub-h, .wrap, .nav, .btn-p, .btn-a)
  - Update navbar styling to use design system colors (green, orange, line, soft)
  - Replace inline button styles with Button component using variant props (.btn-p, .btn-a)
  - Update navigation links to use .nav a classes with proper hover states
  - Ensure hamburger menu button uses proper styling
  - Add aria-label and aria-expanded attributes to hamburger button for accessibility
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.1, 3.2, 9.1, 9.2, 9.6, 10.1, 10.2, 10.3_

- [ ]* 1.2 Write unit tests for Header component
  - Test logo renders and links to /
  - Test navigation links display for public role
  - Test hamburger menu visibility on mobile/desktop breakpoints
  - Test active link highlighting
  - Test authentication buttons display
  - Test keyboard navigation and focus visibility
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.1, 10.1, 10.2_

### 2. Create Hero Section Component

- [x] 2.1 Create HeroSection component file (src/components/home/hero-section.tsx)
  - Create new Server Component with hero section structure
  - Implement two-column layout using CSS Grid (.hero .wrap with grid-template-columns: 1.1fr 0.9fr)
  - Add responsive single-column layout for mobile (max-width: 900px)
  - Include badge with "Grande compétition de culture générale" text using .bd class
  - Add h1 heading with "Question pour un DevAs" text in green color
  - Add subheading paragraph with descriptive text in muted color
  - Add two CTA buttons: "Découvrir la compétition" (.btn-p) and "Voir les éditions" (.btn-o)
  - Both buttons link to /editions route
  - Add Next.js Image for hero image (public/hero1.png) with proper alt text
  - Use .wrap container for max-width and padding
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 8.1, 8.5, 9.1, 9.2, 9.6, 9.7_

- [ ]* 2.2 Write unit tests for HeroSection component
  - Test all text content renders (badge, heading, subheading)
  - Test CTA buttons link to correct routes
  - Test hero image renders with correct alt text
  - Test layout is responsive (single column on mobile, two column on desktop)
  - Test heading uses proper HTML structure (h1)
  - _Requirements: 4.1, 4.7, 5.1, 6.1, 6.6, 8.1, 8.5_

### 3. Create Feature Card Component

- [x] 3.1 Create FeatureCard component file (src/components/home/feature-card.tsx)
  - Create Server Component with icon, title, and optional description props
  - Render .card.soft styling for white background with soft border
  - Use .ico class for icon circle with green-pale background
  - Display emoji/icon within icon circle
  - Render h3 heading with card title
  - Add optional description paragraph below title
  - Ensure proper spacing and typography hierarchy
  - _Requirements: 7.3, 7.4, 7.5, 7.6, 9.1, 9.2, 9.5, 10.8_

- [ ]* 3.2 Write unit tests for FeatureCard component
  - Test icon renders as emoji
  - Test title displays correctly
  - Test card styling applies (soft background)
  - Test optional description renders when provided
  - Test icon circle styling is correct
  - _Requirements: 7.3, 7.4, 7.5, 7.6_

### 4. Create Feature Cards Grid in Hero Section

- [x] 4.1 Add feature cards grid below hero content
  - Create array of feature cards with 4 items:
    - icon: '🏆', title: 'Une compétition prestigieuse'
    - icon: '💻', title: 'Une aventure tech'
    - icon: '📊', title: 'Un classement officiel'
    - icon: '🎯', title: 'Des éditions mémorables'
  - Render using .grid .c4 classes for 4-column responsive layout
  - Import and use FeatureCard component for each item
  - Add spacing below hero section (gap-16)
  - Test responsive layout (1 column mobile, 2 column tablet, 4 column desktop)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 8.2, 8.3, 8.4, 8.6_

- [ ]* 4.2 Write integration tests for feature cards grid
  - Test all 4 feature cards render
  - Test grid layout is responsive across breakpoints
  - Test responsive classes apply correctly
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 8.2, 8.3, 8.4, 8.6_

### 5. Update Home Page to Use Hero Section

- [x] 5.1 Replace existing hero section in app/page.tsx with HeroSection component
  - Remove inline hero section code (old styled div)
  - Import HeroSection component from src/components/home/hero-section
  - Add HeroSection component between Header and remaining sections
  - Ensure page structure flows correctly (Header → HeroSection → Stats → etc)
  - Verify all existing page sections remain intact
  - Test that page renders without errors
  - _Requirements: 4.1, 4.7, 5.1, 6.1, 7.1, 9.1, 11.2_

- [ ]* 5.2 Write integration tests for HomePage
  - Test Header component renders
  - Test HeroSection component renders
  - Test feature cards appear below hero section
  - Test layout is responsive
  - Test no layout shift (CLS = 0) during page load
  - _Requirements: 4.1, 4.7, 5.1, 6.1, 7.1, 11.1, 11.2_

### 6. Apply Design System Classes to All Components

- [~] 6.1 Verify all components use design system classes (not inline styles)
  - Header component: .pub-h, .wrap, .nav, .btn-p, .btn-a
  - HeroSection: .hero, .wrap, .sh, .bd, .btn-p, .btn-o, .grid, .c4
  - FeatureCard: .card, .card.soft, .ico
  - Remove all inline style props (no style={{ }} attributes)
  - Replace with Tailwind classes via className prop
  - Verify colors use design system tokens (green, orange, line, soft, ink, mute)
  - Test that styling matches mockup at docs/maquette/index.html
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

### 7. Implement Responsive Design for All Breakpoints

- [~] 7.1 Verify responsive design for mobile (< 640px)
  - Header: hamburger menu visible, horizontal nav hidden
  - HeroSection: single column layout, image below text
  - Feature cards: 1 column layout
  - Test on mobile device or with browser dev tools
  - Verify text is readable, buttons are tappable (minimum 44x44px)
  - _Requirements: 8.1, 8.2, 8.3, 8.7, 8.8_

- [~] 7.2 Verify responsive design for tablet (640px-1024px)
  - Header: horizontal nav visible (at 768px breakpoint)
  - HeroSection: transitions from single to two column
  - Feature cards: 2-3 column layout
  - Test on tablet device or with browser dev tools
  - _Requirements: 8.1, 8.4, 8.8_

- [~] 7.3 Verify responsive design for desktop (> 1024px)
  - Header: all navigation and buttons visible
  - HeroSection: full two-column layout
  - Feature cards: 4-column layout
  - Test layout matches mockup design
  - _Requirements: 8.5, 8.6, 8.8_

### 8. Implement Accessibility Features

- [~] 8.1 Add keyboard navigation and focus indicators
  - Verify Tab order is logical (left to right in navbar)
  - Test all interactive elements (links, buttons) receive focus
  - Verify focus visible outline appears on keyboard navigation (design system outline)
  - Add aria-label to hamburger menu button
  - Add aria-expanded to hamburger menu button, update on toggle
  - Test with keyboard only (no mouse)
  - _Requirements: 10.1, 10.2, 10.3_

- [~] 8.2 Add semantic HTML and accessibility attributes
  - Verify h1 heading in hero section
  - Verify h3 headings in feature cards
  - Add meaningful alt text to hero image
  - Add alt text to any emojis/icons (or verify screen reader reads them)
  - Test with screen reader (NVDA, JAWS, or browser built-in)
  - Verify heading hierarchy is correct
  - _Requirements: 10.4, 10.5, 10.6, 10.7, 10.8_

- [~] 8.3 Verify color contrast and accessibility
  - Check green text on white background: ratio >= 4.5:1
  - Check orange text on white background: ratio >= 4.5:1
  - Check all text meets WCAG AA standard (4.5:1 minimum)
  - Test with accessibility checker (Axe DevTools, Lighthouse)
  - _Requirements: 9.1, 10.2_

### 9. Optimize Images and Performance

- [~] 9.1 Optimize hero image with Next.js Image component
  - Verify Image component is used for /hero1.png
  - Set width and height props for proper aspect ratio
  - Add priority prop (priority={true}) for above-fold image
  - Verify image loads correctly on all breakpoints
  - Test image optimization (check DevTools Network tab)
  - _Requirements: 11.3, 11.6_

- [~] 9.2 Verify performance metrics
  - Check LCP (Largest Contentful Paint) < 2.5s
  - Check FID (First Input Delay) < 100ms
  - Check CLS (Cumulative Layout Shift) = 0.0
  - Run Lighthouse audit (target: 90+)
  - Test on slow 4G connection (DevTools throttling)
  - _Requirements: 11.1, 11.2, 11.3_

### 10. Code Quality and Testing

- [~] 10.1 Ensure TypeScript strict mode compliance
  - No any types in Header, HeroSection, FeatureCard components
  - All props properly typed with interfaces
  - All event handlers properly typed (e.g., onClick: () => void)
  - Test TypeScript compilation: npm run build
  - Fix any type errors before proceeding
  - _Requirements: 11.4, 11.7_

- [ ]* 10.2 Run complete test suite
  - Ensure all unit tests pass
  - Ensure all integration tests pass
  - Run accessibility tests and fix any issues
  - Verify no console errors or warnings
  - _Requirements: 11.7_

### 11. Checkpoint - Verify All Components

- [~] 11.1 Final verification
  - Visual comparison with mockup (docs/maquette/index.html)
  - Test on multiple browsers (Chrome, Firefox, Safari, Edge)
  - Test responsive design on real devices or emulators
  - Verify all links work correctly
  - Check for any layout shifts or visual issues
  - Ensure page loads quickly (< 2.5s LCP)

### 12. Documentation and Cleanup

- [~] 12.1 Create component documentation
  - Create README.md in src/components/home/ with usage examples
  - Document HeroSection props and usage
  - Document FeatureCard props and usage
  - Add JSDoc comments to component functions
  - _Requirements: 11.7_

- [~] 12.2 Code review and cleanup
  - Remove any console.log() statements
  - Verify no unnecessary dependencies
  - Check for unused imports
  - Format code consistently (Prettier)
  - Ensure ESLint passes
  - _Requirements: 11.4, 11.5, 11.7_

---

## Notes

### Optional Tasks

Tasks marked with `*` are **optional testing/documentation tasks**. They validate implementation but are not strictly required for functionality.

### Implementation Order

Follow tasks in sequence (1 → 12). Each task builds on previous work:
1. **Tasks 1-4**: Component implementation
2. **Tasks 5**: Integration into homepage
3. **Tasks 6-8**: Design system compliance & accessibility
4. **Tasks 9-12**: Performance, testing, cleanup

### Component Dependencies

```
Header (modified)
  ↓
HeroSection (new)
  ↓
FeatureCard (new)
  ↓
HomePage (modified to use both)
```

### Testing Approach

- **Unit tests**: Test individual components in isolation
- **Integration tests**: Test components working together (HomePage with Header + HeroSection)
- **Accessibility tests**: Test keyboard nav, screen reader, color contrast
- **Performance tests**: Verify LCP < 2.5s, CLS = 0, mobile menu smooth

### Key Implementation Details

1. **No inline styles**: Use className + Tailwind + design system classes only
2. **Next.js Image**: Always use for images (/hero1.png)
3. **Server Components**: HeroSection and FeatureCard should be Server Components
4. **Client Component**: Header must be Client Component for mobile menu state
5. **Design system**: All classes must come from docs/maquette/index.html or tailwind.config.ts
6. **Accessibility**: All interactive elements must be keyboard accessible with visible focus

### Common Pitfalls to Avoid

❌ Using inline styles (style={{}} props)
❌ Using generic `<img>` instead of Next.js Image
❌ Missing alt text on images
❌ No focus visible indicators
❌ Hard-coded colors instead of design system tokens
❌ Missing aria-labels on interactive elements
❌ Not testing on mobile devices
❌ Not verifying responsive breakpoints

### Browser DevTools Tips

- **Mobile simulation**: DevTools → Device Toolbar (Ctrl+Shift+M)
- **Responsive design**: DevTools → Device Mode → Select breakpoints
- **Performance**: DevTools → Lighthouse (Run audit)
- **Accessibility**: DevTools → Lighthouse (Accessibility score)
- **Network throttling**: DevTools → Network → Throttle for slow 4G

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1", "3.1"] },
    { "id": 1, "tasks": ["1.2", "2.2", "3.2", "4.1"] },
    { "id": 2, "tasks": ["4.2", "5.1"] },
    { "id": 3, "tasks": ["5.2", "6.1"] },
    { "id": 4, "tasks": ["7.1", "7.2", "7.3"] },
    { "id": 5, "tasks": ["8.1", "8.2", "8.3"] },
    { "id": 6, "tasks": ["9.1", "9.2", "10.1"] },
    { "id": 7, "tasks": ["10.2"] },
    { "id": 8, "tasks": ["12.1", "12.2"] }
  ]
}
```

**Wave Explanation**:
- **Wave 0**: Create all three component files in parallel
- **Wave 1**: Write unit tests and feature cards grid (depends on components)
- **Wave 2**: Write feature cards tests and update homepage (depends on all components)
- **Wave 3**: Homepage tests and design system verification (depends on homepage update)
- **Wave 4**: Responsive design verification (independent, can run in parallel)
- **Wave 5**: Accessibility implementation (independent)
- **Wave 6**: Performance and TypeScript verification (independent)
- **Wave 7**: Run full test suite (depends on all above)
- **Wave 8**: Documentation and cleanup (final)

---

## Success Criteria

✅ All tasks completed
✅ All components use design system classes (no inline styles)
✅ Responsive design works on mobile, tablet, desktop
✅ All interactive elements are keyboard accessible
✅ All images optimized with Next.js Image
✅ No TypeScript errors (npm run build passes)
✅ Lighthouse performance score > 90
✅ Lighthouse accessibility score > 95
✅ Visual comparison matches mockup
✅ Unit and integration tests pass
