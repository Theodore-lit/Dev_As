# Requirements: Navbar & Hero Section

## Introduction

This specification defines the requirements for implementing a professional, responsive public header and hero section for the "Question pour un DevAs" competition website. The navbar provides primary navigation and authentication actions, while the hero section introduces the competition with compelling messaging, a call-to-action, and feature highlights. The design follows the established design system mockup with DevAs brand colors (green #039846 and orange #E56001).

## Glossary

- **System**: The public-facing web application frontend
- **Navbar**: The sticky header component containing logo, navigation links, and authentication buttons
- **Hero_Section**: The primary landing area containing heading, subheading, CTA buttons, hero image, and feature cards
- **Badge**: A small pill-shaped component for highlighting (e.g., "Grande compétition...")
- **CTA_Button**: Call-to-Action button (primary action in green)
- **Secondary_Button**: Button with outlined style (secondary action)
- **Feature_Card**: Small card highlighting a competition aspect (e.g., "Une compétition prestigieuse")
- **Design_System**: CSS classes and color palette defined in docs/maquette/index.html and tailwind.config.ts
- **Responsive**: Layout adapts correctly to mobile (< 640px), tablet (640px-1024px), and desktop (> 1024px) viewports
- **Sticky**: Navbar remains visible at top of viewport when scrolling

## Requirements

### Requirement 1: Public Navbar Structure and Navigation

**User Story:** As a visitor, I want to see a professional navbar with logo and navigation links, so that I can easily access different sections of the competition website.

#### Acceptance Criteria

1. THE Navbar SHALL have a sticky position that remains at the top of the viewport during scrolling
2. THE Navbar SHALL contain the DevAs logo on the left side linking to the home page (/)
3. WHEN the viewport is desktop (> 1024px), THE Navbar SHALL display horizontal navigation links: "Accueil", "À propos", "Éditions", "Classement", "Actualités", "FAQ"
4. WHEN the viewport is mobile (< 640px), THE Navbar SHALL hide the horizontal navigation links and display a hamburger menu icon
5. THE Navbar navigation links SHALL use the design system (.nav a styling) with hover state showing soft background color
6. WHEN a navigation link corresponds to the current page, THE Navbar SHALL highlight it with green color and bottom indicator line
7. THE Navbar SHALL have a white background with bottom border using the design system line color (#E2E5E9)
8. THE Navbar SHALL use .pub-h and .wrap classes from the design system

### Requirement 2: Public Navbar Authentication Section

**User Story:** As an unauthenticated visitor, I want to see login and signup buttons in the navbar, so that I can access the application with my account.

#### Acceptance Criteria

1. THE Navbar authentication section SHALL display two buttons on the right side for unauthenticated users
2. THE first button SHALL be "Se connecter" (login) using the primary button style (.btn-p: green background)
3. THE second button SHALL be "S'inscrire" (signup) using the action button style (.btn-a: orange background)
4. BOTH authentication buttons SHALL link to appropriate routes: /connexion for login and /candidater for signup
5. WHEN a user is authenticated, THE authentication buttons SHALL be replaced with the username and a logout button
6. THE authentication buttons SHALL use design system button classes (.btn with .btn-p and .btn-a variants)

### Requirement 3: Mobile Navigation Menu

**User Story:** As a mobile visitor, I want to access navigation links through a hamburger menu, so that the navbar remains clean and uncluttered on small screens.

#### Acceptance Criteria

1. WHEN the viewport is mobile (< 640px), THE hamburger menu button SHALL appear on the right side of the navbar
2. WHEN the hamburger menu is clicked, THE navigation menu SHALL expand to show all links vertically
3. THE mobile menu SHALL display with white background and proper padding, matching the design system spacing
4. THE mobile menu links SHALL have the same styling and hover states as desktop links
5. WHEN a menu link is clicked on mobile, THE menu SHALL close and the link destination SHALL be navigated to
6. THE hamburger menu state SHALL toggle between open and closed when clicked

### Requirement 4: Hero Section Layout and Structure

**User Story:** As a first-time visitor, I want to see an engaging hero section that introduces the competition, so that I understand what "Question pour un DevAs" is about.

#### Acceptance Criteria

1. THE Hero_Section SHALL use the .hero class with section padding (64px top/bottom per .s class)
2. THE Hero_Section layout SHALL be two-column on desktop (left: text, right: image) using CSS Grid
3. WHEN the viewport is mobile or tablet (< 900px), THE Hero_Section layout SHALL collapse to single-column with image below text
4. THE Hero_Section left column SHALL contain badge, heading, subheading, two CTA buttons, and spacing matching the mockup
5. THE Hero_Section right column SHALL display the hero image (public/hero1.png) with responsive sizing
6. THE Hero_Section background SHALL be white with white text on soft green background optional
7. THE Hero_Section SHALL use the .wrap container for consistent max-width and padding

### Requirement 5: Hero Section Text Content

**User Story:** As a visitor reading the hero section, I want clear, compelling messaging about the competition, so that I'm motivated to participate.

#### Acceptance Criteria

1. THE Hero_Section badge SHALL display "Grande compétition de culture générale" text using badge styling (.bd class)
2. THE Hero_Section heading SHALL display "Question pour un DevAs" in large bold text (h1, green color #039846)
3. THE Hero_Section subheading SHALL display "Le rendez-vous incontournable des développeurs passionnés de savoir et d'innovation." as paragraph text with muted color
4. THE badge color SHALL match the design system orange-pale background with orange-dark text
5. THE heading text SHALL use the Montserrat font (heading font) with appropriate sizing per design system
6. THE subheading text SHALL use the Inter font (body font) with muted color and max-width constraint

### Requirement 6: Hero Section Call-to-Action Buttons

**User Story:** As a visitor interested in participating, I want clear buttons to take action, so that I can easily discover the competition or start the application process.

#### Acceptance Criteria

1. THE Hero_Section SHALL display two CTA buttons below the subheading
2. THE first button SHALL be "Découvrir la compétition" using primary button style (.btn-p: green background)
3. THE second button SHALL be "Voir les éditions" using outlined button style (.btn-o: white background with green border)
4. THE first button SHALL link to the /editions route
5. THE second button SHALL link to the /editions route as well
6. BOTH buttons SHALL use design system button classes (.btn with variants .btn-p and .btn-o)
7. BOTH buttons SHALL display with proper spacing (gap 16px) and responsive sizing

### Requirement 7: Hero Section Feature Cards

**User Story:** As a visitor scrolling the hero section, I want to see compelling features about the competition, so that I understand its value proposition.

#### Acceptance Criteria

1. THE Hero_Section feature cards SHALL appear below the hero image/text in a grid layout
2. THE feature cards grid SHALL display 4 cards in a responsive layout (2-4 columns depending on viewport)
3. THE feature cards SHALL include these titles:
   - "Une compétition prestigieuse"
   - "Une aventure tech"
   - "Un classement officiel"
   - "Des éditions mémorables"
4. EACH feature card SHALL have an icon using an emoji or icon circle (.ico class)
5. EACH feature card SHALL use the .card and .card.soft styling from the design system
6. THE feature cards SHALL have appropriate spacing and visual hierarchy matching the mockup
7. THE feature cards layout SHALL use .grid .c4 for 4-column responsive grid (or .c3 for 3-column fallback)

### Requirement 8: Hero Section Responsive Design

**User Story:** As a visitor on any device, I want the hero section to display correctly and be easy to read, so that my experience is consistent across mobile, tablet, and desktop.

#### Acceptance Criteria

1. WHEN the viewport is mobile (< 640px), THE Hero_Section two-column layout SHALL stack to single column
2. WHEN the viewport is mobile (< 640px), THE hero image SHALL be placed below the text content
3. WHEN the viewport is mobile (< 640px), THE feature cards SHALL display in 1-column layout
4. WHEN the viewport is tablet (640px-1024px), THE feature cards SHALL display in 2-column layout
5. WHEN the viewport is desktop (> 1024px), THE hero layout SHALL show two columns with text on left and image on right
6. WHEN the viewport is desktop (> 1024px), THE feature cards SHALL display in 4-column layout
7. THE Hero_Section text sizing SHALL use responsive typography (clamp() for fluid scaling)
8. THE Hero_Section spacing and gaps SHALL scale proportionally across all viewport sizes

### Requirement 9: Color and Styling Consistency

**User Story:** As a developer maintaining the code, I want all navbar and hero components to follow the established design system, so that the implementation is consistent and maintainable.

#### Acceptance Criteria

1. THE Navbar and Hero_Section SHALL use colors from the design system: green (#039846), green-dark (#026b30), orange (#E56001), soft (#F3F4F6), line (#E2E5E9)
2. ALL buttons SHALL use design system classes (.btn, .btn-p, .btn-o, .btn-a, .btn-g, .btn-r)
3. ALL text elements SHALL use design system font families: Montserrat for headings, Inter for body
4. ALL badges SHALL use .bd classes from the design system with appropriate color variants
5. ALL cards SHALL use .card and .card.soft classes from the design system
6. THE Navbar and Hero_Section SHALL use .wrap for container max-width (1180px)
7. WHEN styling is applied, THE implementation SHALL NOT use inline styles but instead use Tailwind classes or design system classes

### Requirement 10: Accessibility and Keyboard Navigation

**User Story:** As a user with accessibility needs, I want to navigate the website using keyboard and screen readers, so that I can access all content and functionality.

#### Acceptance Criteria

1. THE Navbar links SHALL be keyboard navigable with logical tab order (left to right)
2. WHEN a keyboard user presses Tab, ALL interactive elements (links, buttons, menu) SHALL receive visible focus indicator per design system (.focus-visible outline)
3. THE hamburger menu button SHALL have proper aria-label and aria-expanded attributes for screen readers
4. WHEN the hamburger menu is expanded, THE navigation menu items SHALL be within document tab order
5. ALL buttons SHALL have descriptive text or aria-label attributes
6. THE Hero_Section heading (h1) SHALL have proper semantic HTML structure
7. ALL images SHALL have meaningful alt text describing the image content
8. THE feature card titles SHALL use proper heading hierarchy (h3 elements)

### Requirement 11: Performance and Code Quality

**User Story:** As a developer deploying the application, I want the navbar and hero implementation to be performant and maintainable, so that the application loads quickly and is easy to update.

#### Acceptance Criteria

1. THE Navbar component SHALL be a client component (marked with 'use client') only if interactivity is required (mobile menu)
2. THE Hero_Section component SHALL render on the server side (Server Component) for better performance
3. THE implementation SHALL use Next.js Image component for the hero image with proper optimization
4. THE implementation SHALL NOT load heavy libraries - use only Tailwind CSS and design system classes
5. THE styling SHALL use Tailwind classes combined with design system CSS from globals.css
6. THE component code SHALL be well-organized and follow the existing component structure in src/components/
7. WHEN the page loads, THE critical above-fold content (navbar and hero heading) SHALL render within 1.5 seconds

---

## Summary

This specification defines 11 comprehensive requirements covering:
- Navigation structure and authentication (Requirements 1-2)
- Mobile menu functionality (Requirement 3)
- Hero section layout and responsiveness (Requirements 4, 8)
- Hero content and messaging (Requirement 5)
- Call-to-action buttons (Requirement 6)
- Feature cards display (Requirement 7)
- Design system compliance (Requirement 9)
- Accessibility standards (Requirement 10)
- Performance and code quality (Requirement 11)

All requirements align with the design mockup provided in docs/maquette/index.html and the DevAs design system colors and typography.
