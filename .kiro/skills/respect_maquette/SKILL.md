# Skill: Respecter la Maquette DevAs

## Objectif

Implémenter fidèlement les designs de la maquette HTML (`docs/maquette/index.html`) en utilisant les classes CSS et couleurs du design system DevAs. Assurer la cohérence visuelle et fonctionnelle avec le design établi.

## Principes Fondamentaux

### 1. Utiliser les Classes du Design System

**✅ À FAIRE**:
```tsx
<section className="s">
  <div className="wrap">
    <div className="card">
      <p className="mute">Texte secondaire</p>
    </div>
  </div>
</section>
```

**❌ À ÉVITER**:
```tsx
<section style={{ padding: '64px' }}>
  <div style={{ maxWidth: '1180px' }}>
    <div style={{ border: '1px solid #E2E5E9' }}>
      <p style={{ color: '#5B6573' }}>Texte secondaire</p>
    </div>
  </div>
</section>
```

### 2. Palette de Couleurs

| Classe | Couleur | Usage |
|--------|---------|-------|
| `text-green` | #039846 | Primary, buttons, headings |
| `text-green-dark` | #026b30 | Hover, active states |
| `bg-green-pale` | #DDF4E5 | Badge/backgrounds |
| `text-orange` | #E56001 | Action buttons, accents |
| `bg-orange-pale` | #FFF0E2 | Light orange backgrounds |
| `text-ink` | #1F2937 | Primary text |
| `text-mute` | #5B6573 | Secondary text |
| `bg-soft` | #F3F4F6 | Light backgrounds |
| `border-line` | #E2E5E9 | Borders |

### 3. Classes Principales du Design System

```
Layout:
  .s           → Section padding 64px top/bottom
  .s.alt       → Section avec soft background
  .wrap        → Container max-width 1180px
  .stack       → flex-column, gap 16px
  .row         → flex row, gap 12px
  .grid.c2/3/4 → Responsive grids

Components:
  .card        → Card avec border + shadow
  .card.soft   → Card soft background
  .btn.btn-p   → Primary button (vert)
  .btn.btn-o   → Outline button (bordé)
  .btn.btn-a   → Action button (orange)
  .bd          → Badge
  .ico         → Icon circle
  .nav         → Navigation links

Text:
  .mute        → Secondary color
  .sm          → Small font
  .xs          → Extra small
  .eyebrow     → Uppercase label
```

## Processus d'Implémentation

### Étape 1: Analyser la Maquette

1. Ouvrir `docs/maquette/index.html` dans navigateur
2. Identifier les sections et leurs classes CSS
3. Noter les couleurs, espacements, typographies
4. Vérifier les responsive breakpoints

**Exemple - Navbar**:
```
Classe utilisée: .pub-h
Position: sticky
Background: white
Border bottom: .line
```

### Étape 2: Traduire en Composant React

Mapper les classes maquette → className React:

```tsx
// Maquette: <header class="pub-h">
export function Header() {
  return (
    <header className="pub-h">
      <div className="wrap">
        <nav className="nav">
          {/* nav items */}
        </nav>
      </div>
    </header>
  );
}
```

### Étape 3: Vérifier le Design System

Avant de coder, vérifier que:

- [ ] Toutes les couleurs utilisées existent dans `tailwind.config.ts`
- [ ] Classes CSS définies dans `app/globals.css`
- [ ] Pas de inline styles (`style={{}}`)
- [ ] Responsive breakpoints corrects (md: 768px, lg: 1024px)
- [ ] Accessibilité respectée (focus-visible, semantic HTML)

### Étape 4: Implémenter et Tester

1. Créer le composant avec les classes du design system
2. Comparer visuel avec `docs/maquette/index.html`
3. Tester responsive (mobile, tablet, desktop)
4. Vérifier accessibilité (Tab, Screen reader, Color contrast)

## Checklist: Respecter la Maquette

### Visual Fidelity
- [ ] Couleurs correspondent exactement (pas de gris génériques)
- [ ] Espacements: gap 16px, padding 20px, section 64px
- [ ] Typographies: Montserrat/Inter avec bons poids
- [ ] Bordures: color line (#E2E5E9), radius 10-12px

### Composants
- [ ] Buttons: variants corrects (.btn-p, .btn-o, .btn-a)
- [ ] Badges: classes .bd avec bons variants
- [ ] Cards: .card ou .card.soft selon contexte
- [ ] Grids: .grid .cX (c2, c3, c4) responsive

### Layout
- [ ] Section: .s avec padding 64px
- [ ] Container: .wrap avec max-width 1180px
- [ ] Responsive: Breakpoints md: 768px, lg: 1024px
- [ ] Mobile first: Classes responsive (hidden md:block)

### Code Quality
- [ ] Pas d'inline styles
- [ ] Pas de couleurs hex (#FF0000) - utiliser classes
- [ ] Pas de width/height hardcodé - utiliser Tailwind
- [ ] TypeScript: types propres, pas de `any`

### Accessibility
- [ ] Focus-visible: outline 3px vert avec offset 2px
- [ ] Labels: tous les inputs ont un label htmlFor
- [ ] Alt text: toutes les images ont alt significatif
- [ ] Semantic HTML: h1-h6, button, a, label corrects

## Commandes de Vérification

### Build et Test
```bash
# Compiler sans erreurs TypeScript
npm run build

# Linter les styles
npm run lint

# Vérifier responsive
# Ouvrir DevTools (F12) → Device Toolbar (Ctrl+Shift+M)
```

### Comparaison Visuelle
```bash
# Ouvrir dans navigateur
# Maquette: file:///path/to/docs/maquette/index.html
# Votre code: http://localhost:3000
# Comparer côte-à-côte
```

### Accessibilité
```bash
# Lighthouse audit (DevTools → Lighthouse)
# Test keyboard: Tab, Shift+Tab
# Test color contrast: WebAIM Contrast Checker
```

## Patterns Courants

### Pattern 1: Section avec Heading

```tsx
<section className="s">
  <div className="wrap">
    <div className="sh">
      <h1>Titre</h1>
      <p className="mute">Description</p>
    </div>
  </div>
</section>
```

### Pattern 2: Card Grid

```tsx
<div className="grid c3">
  {items.map(item => (
    <div key={item.id} className="card">
      <h3>{item.title}</h3>
    </div>
  ))}
</div>
```

### Pattern 3: Buttons avec CTA

```tsx
<div className="row">
  <button className="btn btn-p">Primary</button>
  <button className="btn btn-o">Outline</button>
</div>
```

### Pattern 4: Badge + Status

```tsx
<span className="bd ok">Qualifié</span>
<span className="bd no">Éliminé</span>
<span className="bd wait">En attente</span>
<span className="bd gold">Champion</span>
```

## Ressources

- **Maquette HTML**: `docs/maquette/index.html` (source de vérité)
- **Tailwind Config**: `tailwind.config.ts` (couleurs, fonts)
- **Global CSS**: `app/globals.css` (classes design system)
- **Steering Guide**: `.kiro/steering/DESIGN_SYSTEM_MOCKUP.md`

## Aide au Débogage

### Problème: Couleurs incorrectes
→ Vérifier que `tailwind.config.ts` a les bonnes couleurs
→ Ne pas utiliser `text-gray-900`, utiliser `text-ink`

### Problème: Spacing inconsistent
→ Utiliser gap: 16px pour sections
→ Padding: 20px pour cards
→ Section: 64px top/bottom

### Problème: Buttons mal stylisés
→ Vérifier que Button component utilise variants: .btn-p, .btn-o, etc.
→ Pas d'inline styles sur boutons

### Problème: Layout pas responsive
→ Vérifier breakpoints: md: 768px, lg: 1024px
→ Utiliser .grid .cX avec min-width pour auto-fit
→ Mobile first: classes cachées sur desktop (.md:block)

### Problème: Accessibilité échoue
→ Ajouter focus-visible outline: 3px vert
→ Vérifier labels htmlFor sur inputs
→ Alt text sur images

## Exemples: Avant/Après

### ❌ Avant (Générique)
```tsx
<div style={{ backgroundColor: '#F5F5F5', padding: '2rem' }}>
  <h2 style={{ color: '#333', fontSize: '24px' }}>Titre</h2>
  <button style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px' }}>
    Click me
  </button>
</div>
```

### ✅ Après (Design System)
```tsx
<section className="s alt">
  <div className="wrap">
    <h2>Titre</h2>
    <button className="btn btn-p">Click me</button>
  </div>
</section>
```

---

**Objectif Ultime**: Visiter `docs/maquette/index.html`, puis comparer votre composant → Ils doivent être visuellement identiques en couleur, spacing, typographie et responsive.

