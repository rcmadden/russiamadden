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

## Learning Resources
- Bootstrap 5 utilities: https://getbootstrap.com/docs/5.1/utilities/
- SVG coordinate system: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial
- Git workflow: Feature branches → PR → master

---

**Last Updated**: September 22, 2025
**Project Version**: 0.0.5

## popMATICS Domain Vocabulary

This project visualizes a music curriculum called **popMATICS** (Tony's framework). Reference-chart.html and units.html render its concepts as overlays on piano keyboard SVGs. Use this vocabulary — do not substitute conventional music theory terms unless asked.

**Fixed landmarks** (same physical keys in every chart, never move with the key):
- **Borders 🚩** — first & last white key of each Unit (Unit 1: C, E — red; Unit 2: F, B — blue). Rendered as SVG flags, not emoji. Grey/ghost (white fill, grey outline) when the key is not in the current Landscape's Path.
- **Center Stage ⭐** — center key of each Unit (Unit 1: D; Unit 2: A♭). Rendered as a green star, matching Tony's hand drawings. Only two of these exist.

**Landscape-relative markers** (calculated from whichever key/Camp the chart is currently showing):
- **Camp ⛺ / Fire 🔥** — scale degrees 1 and 3.
- **Suspension ⏸️** — degree 4, resolves down to Fire (3).
- **Leading Tone 🎤** — degree 7, resolves up to Camp (1).
- Suspension and Leading Tone each render only their own role marker. Camp and Fire are shown only when their separate toggle is selected.
- Resolution arrows are optional (toggle: "Show resolution arrows") — turning them off keeps the role marker but hides the arrow.

**Off-Landscape marker**:
- **Middle Key 🔑** — the ♭5, tritone from Camp. By definition, it is not on the Landscape.

**Characters** (chromatic scale degrees, relative to Camp):
- Architect ♭2, Author ♭3, Magician ♯4, King/Queen ♭6 (one marker — King and Queen are the same piano key, enharmonically ♭6/♯5), Traveler ♭7.

## Track Colors (Tony's palette — not the old pink/blue)

```
--track-red:  #E02424   /* Red Track dots, Unit 1 border flags */
--track-blue: #1E90FF   /* Blue Track dots, Unit 2 border flags */
--track-grey: #C4C4C4   /* ghost/inactive border flags, off-Path landmarks */
```
The old scheme (`#ff69b4` pink) is deprecated. If you find pink anywhere, it's stale — replace with `--track-red`.

**Track ≠ Unit — do not conflate these.** Unit border-flag color and physical key Track membership are two separate systems: Unit 1 has red border flags, but its black keys run on **Blue** Track. Unit 2 has blue border flags, but its black keys run on **Red** Track. This has been a repeated source of bugs — double-check which system a given piece of logic is actually keying off of.

## Landmark & Character Rendering System (reference-chart.html)

Landmarks are defined once in the `LANDMARK_MARKERS` array and rendered by `addMarkersToChart()`. To add a new landmark or Character:

1. Add an entry to `LANDMARK_MARKERS` with `id`, `type` (`"fixed"` or `"relative"`), and `points`.
   - `type: "fixed"` points use `{note, emoji}` or `{note, shape}` — same key in every chart.
   - `type: "relative"` points use `{semis, emoji}` or `{semis, shape}` — semitones above Camp, recalculated per key via `noteFromCamp(key, semis)`.
   - Optional `arrow: {fromSemis, toSemis, color}` draws a resolution arrow between two relative points (gated behind the `showArrows` toggle).
2. Add a matching checkbox in `#landmarks-menu`, grouped under the right `.lm-group` (Fixed Landmarks / On the Landscape / Off the Landscape / Characters).
3. Musical symbols in labels must be literal Unicode (♭ ♯), not HTML entities — matches the existing `displayName()` convention.
4. Shapes (`"flag"`, `"star"`) are hand-drawn SVG, not emoji — use this for anything that needs Tony's-drawing-accurate rendering (colors, ghosting) rather than a Unicode glyph.

Markers dedupe per key (e.g., if Camp is reached via two different selected landmarks, it only renders once) and stack vertically when multiple markers land on the same key.

## Known Gaps / Not Yet Ported to units.html

The Landmarks & Characters dropdown currently exists only in reference-chart.html. Per the "Consistency" rule above, this should eventually be ported to units.html — flagged here so it isn't lost track of, not yet scheduled.
