---
name: Graphic Pulse
colors:
  surface: '#f8f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f6'
  surface-container: '#edeef0'
  surface-container-high: '#e7e8ea'
  surface-container-highest: '#e1e2e4'
  on-surface: '#191c1e'
  on-surface-variant: '#4d4632'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f3'
  outline: '#7f7660'
  outline-variant: '#d1c6ab'
  surface-tint: '#735c00'
  primary: '#735c00'
  on-primary: '#ffffff'
  primary-container: '#facc15'
  on-primary-container: '#6c5700'
  inverse-primary: '#eec200'
  secondary: '#00687a'
  on-secondary: '#ffffff'
  secondary-container: '#57dffe'
  on-secondary-container: '#006172'
  tertiary: '#b4136d'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffbfd6'
  on-tertiary-container: '#ad0768'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe083'
  primary-fixed-dim: '#eec200'
  on-primary-fixed: '#231b00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#ffd9e4'
  tertiary-fixed-dim: '#ffb0cd'
  on-tertiary-fixed: '#3e0022'
  on-tertiary-fixed-variant: '#8c0053'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e1e2e4'
typography:
  display-xl:
    fontFamily: Anybody
    fontSize: 64px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Anybody
    fontSize: 40px
    fontWeight: '900'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Anybody
    fontSize: 32px
    fontWeight: '900'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Anybody
    fontSize: 24px
    fontWeight: '800'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  border-width: 4px
  shadow-offset: 5px
---

## Brand & Style
This design system draws inspiration from mid-century pop art and contemporary Neo-Brutalism. It is designed to feel high-energy, tactile, and unapologetically bold. The aesthetic prioritizes high-contrast "ink" strokes and vibrant color blocks to create a UI that feels like a living comic book. It targets a creator-centric audience that values personality over corporate neutrality. The emotional response should be one of excitement, urgency, and playfulness, utilizing physical metaphors like hard shadows and movement to simulate a printed, tangible medium.

## Colors
The palette is built on high-saturation "CMYK" inspired tones. 
- **Primary (Comic Yellow):** Used for main action areas and hero callouts.
- **Secondary (Cyan Splash):** Used for supporting information and secondary actions.
- **Accent (Comic Pink):** Reserved for "BOOM" moments, alerts, and badges.
- **Neutral:** A light gray background prevents the white-space from feeling clinical, maintaining the "cheap newsprint" vibe.
- **Ink:** Every element is defined by pure black (#000000) for borders, shadows, and text.

## Typography
We use **Anybody** (Black/900 weight) for all headings to mimic the impactful, hand-lettered feel of comic titles. All headings must be set in uppercase. **Inter** is used for body copy to ensure maximum legibility against the chaotic brand elements. 

For display text, apply a `-2deg` or `+2deg` rotation occasionally to break the grid and add to the "cut-and-paste" zine aesthetic.

## Layout & Spacing
The layout follows a strict **Fluid Grid** but ignores traditional "soft" padding. Spacing is aggressive and rhythmic, based on an 8px scale. 

- **Containers:** Max-width of 1280px for desktop.
- **Borders:** A universal 4px black border is applied to all structural containers.
- **Hard Grids:** Use 24px gutters. Elements should feel "locked" into their black outlines. 
- **The "Offset" Rule:** Elements should never feel perfectly centered; slight intentional misalignments (1-2px) enhance the brutalist feel.

## Elevation & Depth
This design system rejects z-axis depth and gaussian blurs. Depth is achieved through **Hard Shadows**:
- **Shadow Style:** Solid #000000 with 0px blur.
- **Default Elevation:** 5px offset (bottom-right).
- **Pressed State:** 2px offset (bottom-right).
- **Flat State:** No offset, used for background decorative elements only.
All cards and buttons must appear to sit "above" the page, supported by these rigid black blocks.

## Shapes
Shapes are strictly **Sharp (0px)**. No border radii are permitted, as rounded corners dilute the aggressive, high-contrast impact of the 4px black borders. All buttons, inputs, and cards are perfect rectangles. 

**Exceptions:** 
- **Starbursts:** Hand-drawn vector paths for badges (e.g., 8-12 point polygons).
- **Speech Bubbles:** Rectangular bubbles with a sharp triangular tail pointing to the source.

## Components

### Buttons
- **Base:** 4px black border, Primary Yellow or Secondary Cyan background. 
- **Text:** Uppercase Bold Label.
- **Shadow:** 5px black hard shadow.
- **Hover/Active:** On hover, the button moves 2px down and 2px right (transform: translate(2px, 2px)) and the shadow shrinks to 3px to simulate a physical click.

### Inputs
- **Base:** White background, 4px black border. 
- **Focus:** Background changes to a very pale yellow, shadow increases to 8px.
- **Placeholder Text:** Medium gray, Inter font.

### Cards
- **Base:** Neutral gray or White background, 4px black border.
- **Header:** Often topped with a 4px black horizontal rule separating the title from content.
- **Shadow:** Permanent 5px hard black shadow.

### Starburst Badges
- Used for "NEW!", "SALE!", or "BOOM!" callouts. 
- **Color:** Comic Pink (#EC4899).
- **Border:** 4px black.
- **Shadow:** 5px offset.

### Checkboxes & Radios
- **Checkbox:** Square (0px radius), 4px black border. On check, fill with Comic Pink and a black "X".
- **Radio:** Square (0px radius), 4px black border. On check, fill with a smaller black square.