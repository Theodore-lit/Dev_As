# Design System - Classes et Styles de la Maquette

## Architecture des styles

La maquette dans `docs/maquette/index.html` définit un design system complet. Les composants Next.js doivent utiliser ces classes CSS et couleurs.

## Classes Principales

### Sections
```
<section class="s">...</section>          // Section padding 64px top/bottom
<section class="s alt">...</section>      // Section avec background soft
```

### Containers
```
<div class="wrap">...</div>                // Container max-width 1180px avec padding safe-area
```

### Layouts
```
<div class="stack">...</div>               // flex column, gap 16px
<div class="row">...</div>                 // flex row, gap 12px, center items
<div class="grid c2">...</div>             // grid 2 colonnes responsive
<div class="grid c3">...</div>             // grid 3 colonnes responsive  
<div class="grid c4">...</div>             // grid 4 colonnes responsive
```

### Text Utilities
```
<p class="mute">...</p>                    // Color: #5B6573 (secondary text)
<span class="sm">...</span>                // Font-size: 0.86rem
<span class="xs">...</span>                // Font-size: 0.78rem
<span class="eyebrow">...</span>           // Uppercase label style
```

## Couleurs (via Tailwind)

### Brand Colors
- `text-green` = #039846 (primary)
- `text-green-dark` = #026b30 (hover/dark)
- `bg-green-pale` = #DDF4E5 (background)
- `text-orange` = #E56001 (accent)
- `bg-orange-pale` = #FFF0E2 (background)

### Status Colors (Badges)
```
<span class="bd ok">Qualifié</span>        // bg-green-pale, text-green-dark
<span class="bd no">Éliminé</span>         // bg-red-pale, text-red
<span class="bd wait">En attente</span>    // bg-orange-pale, text-orange-dark
<span class="bd gold">Champion</span>      // bg-gold-pale, text-gold
<span class="bd live">Live</span>          // bg-green-pale avec pulse animation
```

### Buttons
```
<button class="btn btn-p">Primary</button>              // bg-green
<button class="btn btn-o">Outline</button>              // border-green, white bg
<button class="btn btn-a">Action/Orange</button>        // bg-orange
<button class="btn btn-r">Danger/Red</button>           // border-red, white bg
<button class="btn btn-g">Ghost</button>                // bg-soft
<button class="btn sm">Petit</button>                   // h-8 (34px)
<button class="btn">Normal</button>                     // h-11 (42px) [default]
```

### Cards
```
<div class="card">...</div>                // border line, shadow, bg-white
<div class="card soft">...</div>           // bg-soft, no border
```

### Tables
```
<div class="tw">                           // Table wrapper
  <table>...</table>
</div>
```

### Components Spécialisés
```
<div class="ico">📊</div>                  // Circle badge green-pale
<div class="ico o">📊</div>                // Circle badge orange-pale
<div class="who">
  <span class="av">AZ</span>               // Avatar
  <b>Name</b>
</div>
```

## Migration des pages

### AVANT (générique):
```jsx
<div className="min-h-screen bg-white">
  <div className="max-w-6xl mx-auto px-4 py-12">
    <h1 className="text-4xl font-bold text-gray-900">
```

### APRÈS (design system):
```jsx
<section className="s">
  <div className="wrap">
    <div className="sh">
      <h1>Titre</h1>
      <p className="mute">Description</p>
    </div>
```

## Classements de priorité

1. **Utiliser les classes de la maquette** (`.wrap`, `.stack`, `.grid`, etc.)
2. **Utiliser les couleurs du design system** (`text-green-dark`, `bg-soft`, etc.)
3. **Utiliser Tailwind pour l'ajustement fin** (margin, padding additionnels)
4. **Éviter les couleurs génériques** (`text-gray-900`, `bg-gray-100`, etc.)

## Fichiers à mettre à jour

Pages principales:
- [ ] `app/editions/page.tsx` - Section avec grid c3
- [ ] `app/participants/page.tsx` - Section avec grid
- [ ] `app/palmares/page.tsx` - Podium section
- [ ] `app/matchs/page.tsx` - Section avec grid c2
- [ ] `app/candidater/page.tsx` - Formulaire carte
- [ ] `app/(public)/connexion/page.tsx` - Login card
- [ ] `app/admin/page.tsx` - Admin layout
- [ ] `app/participant/page.tsx` - Participant dashboard

Composants:
- [ ] `edition-card.tsx` - Utiliser `.card`
- [ ] `participant-card.tsx` - Utiliser `.card`
- [ ] `match-card.tsx` - Utiliser `.card`
- [ ] Tableaux admin - Utiliser `.tw` wrapper

