# Claude Code Guidelines - Red Track/Blue Track Chart Maker

## Project Overview
Interactive music theory web application with piano keyboard visualizations for learning red track/blue track patterns across different keys. Two main pages: Units (interactive single chart) and Reference Chart (12-key comparison grid).

## Development Philosophy
- **Minimize changes**: Always prefer editing existing files over creating new ones
- **Bootstrap-first**: Use Bootstrap utilities before writing custom CSS
- **Consistency**: Keep styling and behavior identical between units.html and reference-chart.html
- **Mobile-first**: Optimize for mobile without breaking desktop experience
- **Universal code**: Use portable solutions (Unicode vs HTML entities) for future iOS/Python development

## Tech Stack
- **Framework**: Vanilla JavaScript (no build tools)
- **Styling**: Bootstrap 5 + custom CSS in helper.css
- **Graphics**: SVG for piano keyboard visualization
- **Hosting**: GitHub Pages

## File Structure
```
/Users/russiam/_Dev/russiamadden/
├── units.html              # Main interactive chart maker
├── reference-chart.html    # 12-key comparison grid
├── helper.css             # Shared styles (page-agnostic)
├── style.css              # Homepage-specific styles
├── projects.html          # Portfolio page
├── releases.html          # Release notes
└── assets/img/           # Project screenshots
```

## Key Architecture Patterns

### SVG Coordinate System
- **Units page**: Hard-coded coordinates (more reliable)
  - White keys: `x="0"`, width=`80px`
  - Black keys: `x="55"`, width=`50px` (centered between white keys)
- **Reference chart**: Calculated with GEOM constants
  - Black keys: `x="${GEOM.whiteW - 14}"` (adjusted for centering)
  - Dots: `cx="${GEOM.whiteW - 14 + 25}"` (centered on black keys)

### Note Display System
```javascript
// Internal storage: always flats
const SHARP_TO_FLAT = {"C#":"Db", "D#":"Eb", ...};
const toFlat = n => SHARP_TO_FLAT[n] || n;

// Display: depends on key signature
const prefersSharps = key => ["G","D","A","E","B","F#","C#"].includes(key);
function displayName(norm, preferSharpsFlag){
  if (!preferSharpsFlag)
    return norm.replace('#', '♯').replace('b', '♭');
  const FLAT_TO_SHARP = {"Db":"C#", "Eb":"D#", ...};
  let result = FLAT_TO_SHARP[norm] || norm;
  result = result.replace('#', '♯').replace('b', '♭');
  return result;
}
```

### Musical Symbols
- **Always use Unicode**: `♯` `♭` (not HTML entities)
- **Portable across**: Web, Python, iOS Swift, databases
- **Font-dependent**: Ensure system fonts support musical symbols

## CSS Guidelines

### Bootstrap Utilities Over Custom CSS
```css
/* ❌ Avoid */
.header-row-1 {
  padding: 12px 16px;
  display: flex;
  align-items: center;
}

/* ✅ Prefer */
<div class="header-row-1 d-flex align-items-center px-3 py-2">
```

### Responsive Design Pattern
```css
/* Mobile-first with Bootstrap responsive classes */
<div class="flex-column flex-md-row align-items-start align-items-md-center">

/* Or media queries in helper.css for shared components */
@media (max-width: 768px) {
  .chart-grid.two-column {
    grid-template-columns: 1fr 1fr;
    gap: 3px;
  }
}
```

### Edge-to-Edge Backgrounds
```html
<!-- Use mx-n3 to extend background, px-3 for internal padding -->
<body class="px-3" style="background: #f5f5f5;">
  <header class="bg-white mx-n3 px-3">
    <!-- Content with proper padding -->
  </header>
</body>
```

## Git Workflow

### Branch Strategy
- **Main branch**: `master`
- **Feature branches**: `responsive-updates`, `feature-name`
- **Always create feature branches from updated master**

### Commit Messages
Follow conventional commits:
```bash
fix: center header controls with Bootstrap padding
feat: add musical symbols for sharps and flats
refactor: consolidate mobile spacing in helper.css
```

### Before Committing
1. Run lint/typecheck commands if available
2. Test on both desktop and mobile
3. Verify changes work on both units.html and reference-chart.html
4. Clear browser cache to test (Cmd+Shift+R)

## Common Issues & Solutions

### Cache Problems
- **Hard refresh**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- **DevTools**: Application → Storage → Clear storage
- **Incognito mode**: Test without cache

### SVG Positioning Issues
1. **Use colored borders for debugging**:
   ```css
   .chart-container { border: 3px solid red !important; }
   .key-chart { border: 2px solid blue !important; }
   svg { border: 1px solid green !important; }
   ```
2. **Check DevTools box model** (orange padding/margin indicators)
3. **Compare working code** between units.html and reference-chart.html

### Mobile Layout Debugging
- **Chrome DevTools**: Device toolbar (360×740 for mobile)
- **Check overflow**: `max-width: 100%; overflow-x: hidden;`
- **Grid issues**: Ensure `grid-template-columns: 1fr 1fr;` on mobile

## Testing Checklist
- [ ] Works on mobile (360px width)
- [ ] Works on desktop (1920px width)
- [ ] Both units.html and reference-chart.html behave identically
- [ ] Musical symbols display correctly (♯ ♭)
- [ ] No horizontal scroll on mobile
- [ ] Controls are accessible and don't overlap
- [ ] Hard refresh shows all changes (no cache issues)

## Future Development Notes
- **iOS/Python compatibility**: Use Unicode symbols, avoid HTML-specific code
- **Scaling**: GEOM constants in reference-chart.html for dynamic sizing
- **Enharmonic support**: Cb/Fb mapping already implemented in SHARP_TO_FLAT
- **Mobile optimization**: Continue reducing spacing, currently ~5px padding on cards

### Code Refactoring Plan (Post-Feature Freeze)
**Current Issue**: Duplicate logic in units.html and reference-chart.html creates maintenance overhead

**Solution**: Extract shared code to `keyboard-renderer.js`
1. Create `keyboard-renderer.js` with shared:
   - GEOM calculation logic (proportional scaling)
   - Note label positioning functions
   - Enharmonic/display name utilities
   - SVG generation helpers

2. Benefits:
   - Single source of truth for keyboard rendering
   - Easier to add new features (marks, annotations)
   - Guaranteed identical behavior across pages
   - Reduced code duplication (~300 lines shared)

3. Implementation steps:
   - Extract working code from reference-chart.html (proven stable)
   - Create module with GEOM factory (takes scale factor)
   - Test reference-chart.html with shared module
   - Migrate units.html to shared module
   - Keep page-specific logic (interactivity, scale selection) in HTML files

**Timing**: After current feature work complete and both pages stable

**Critical**: Maintain `noteLabelWithUnitBelowOffset: 28` for proper spacing (verified Sep 2025)

## Landmarks & Characters Architecture

### Module Separation of Concerns
**CRITICAL**: Never duplicate music theory logic. Always use existing functions.

**File Structure:**
```
/assets/js/
├── scales.js              # Music theory (SINGLE SOURCE OF TRUTH)
│   ├── normalize()/toFlat()     # Enharmonic normalization
│   ├── prefersSharps()          # Key signature logic
│   ├── displayName()            # Unicode display
│   └── degreeToNote()           # Scale degree → note mapping
├── landmarks-config.js    # Declarative config (what exists)
└── landmarks.js          # Rendering logic (how to display)
```

**Design Principles:**
1. **Don't break working code** - Copy first, extract later
2. **Use existing patterns** - Mirror mode already exists for dots, reuse it
3. **No duplicate logic** - If it's in scales.js, import it
4. **Modular & extensible** - Add landmarks in config only

**Current Implementation:**
- Landmarks use `<select>` dropdowns (consistent with existing UI)
- Mirror mode defaults ON (matches dot behavior)
- Single octave mode available when mirror toggled OFF
- HTML overlays positioned absolutely over SVG keys

**When Adding Features:**
- Check existing code for similar patterns
- Reuse, don't rewrite
- Test that nothing breaks before adding new functionality

## Learning Resources
- Bootstrap 5 utilities: https://getbootstrap.com/docs/5.1/utilities/
- SVG coordinate system: https://developer.mozilla.org/en-docs/Web/SVG/Tutorial
- Git workflow: Feature branches → PR → master

---

**Last Updated**: September 23, 2025
**Project Version**: 0.0.5