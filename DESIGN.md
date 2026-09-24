---
name: Foncier Intelligent
description: Vérifiez un terrain avant de payer. Verdict de parcelle sur imagerie satellite réelle, dans l'ADN innovation.gouv.bj modernisé.
colors:
  navy: "#093e73"
  navy-deep: "#06111f"
  navy-ink: "#0a2d52"
  navy-line: "#1d5189"
  sky: "#eef3fb"
  sky-line: "#d6e2f2"
  signal: "#ffd400"
  signal-hover: "#ffe033"
  signal-ink: "#1a1400"
  flag-green: "#008751"
  flag-yellow: "#fcd116"
  flag-red: "#e8112d"
  risk-danger: "#b3122b"
  risk-danger-soft: "#fde8eb"
  risk-caution: "#a15c00"
  risk-caution-soft: "#fff1d6"
  risk-clear: "#00703f"
  risk-clear-soft: "#dff3e8"
  background: "#ffffff"
  foreground: "#0d1b2a"
  muted-foreground: "#4a5a6e"
  input-line: "#c3d2e6"
  ring: "#2258a6"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 6.2vw, 4.75rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 112"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.4vw, 3.4rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 112"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.4
    fontVariation: "'wdth' 112"
  data:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    letterSpacing: "0.04em"
    fontFeature: "'tnum'"
    fontVariation: "'wdth' 112"
  body-lead:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
    fontFeature: "'ss01', 'cv11'"
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "'ss01', 'cv11'"
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "3.6px"
  md: "4.8px"
  lg: "6px"
  full: "9999px"
spacing:
  gutter-mobile: "16px"
  gutter-tablet: "24px"
  gutter-desktop: "32px"
  section: "80px"
  section-lg: "112px"
  card-inset: "24px"
components:
  button-signal:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.signal-ink}"
    rounded: "{rounded.md}"
    padding: "0 28px"
    height: "56px"
  button-signal-hover:
    backgroundColor: "{colors.signal-hover}"
    textColor: "{colors.signal-ink}"
  button-navy:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.background}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "48px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "48px"
  input-nup:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.data}"
    rounded: "{rounded.md}"
    height: "56px"
  card-verdict:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card-inset}"
  verdict-band-danger:
    backgroundColor: "{colors.risk-danger}"
    textColor: "{colors.background}"
  verdict-band-caution:
    backgroundColor: "{colors.risk-caution-soft}"
    textColor: "{colors.risk-caution}"
  verdict-band-clear:
    backgroundColor: "{colors.risk-clear-soft}"
    textColor: "{colors.risk-clear}"
  badge:
    backgroundColor: "{colors.sky}"
    textColor: "{colors.navy}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
---

# Design System: Foncier Intelligent

## Overview

**Creative North Star: "Le Registre à ciel ouvert"**

Foncier Intelligent carries the visual DNA of innovation.gouv.bj (the navy field, the flag yellow, the tricolor, the tight corners) and modernizes it into a working instrument. The page does not introduce the service before offering it: a navy field owns the top of the screen, a white verdict card sits on it, and the land itself, seen by Sentinel-2, is the only photograph. The authority comes from real data shown plainly, not from ornament.

The rhythm alternates fields: navy, deep navy, white, sky, white, sky, white, navy. Each band holds one idea, set in wide, heavy Archivo headlines over calm Figtree text. Numbers (NUP, areas, fees, delays, years) are always tabular and usually set in the display face, because in this product the number is the evidence.

The system is written in French and obeys French typography. It rejects the government-portal news carousel and the SaaS hero followed by a grid of feature cards.

**Key Characteristics:**
- Navy field (#093e73) owns the first viewport; white cards float on it with one soft shadow.
- Signal yellow is the button a citizen should press next, and nothing else.
- Risk is spoken in three colors only: danger, caution, clear.
- Archivo at wdth 112, weight 800, for headlines; Figtree for reading; tabular numerals everywhere data appears.
- Tight corners (6px at most on surfaces), a 4px tricolor filet at the top of header and footer.
- Sentinel-2 imagery is the only photographic material, always credited.

## Colors

A civic navy-and-sky palette with one hot signal color and a strictly semantic risk triad.

### Primary
- **Marine Bénin** (navy): the field. Header, hero, closing band, primary shadcn `primary` token, headline color on light fields, pressed toggle state, table header text.
- **Nuit Profonde** (navy-deep): the second field, used for the imagery band and the footer; also the year chip behind satellite images (at 80% opacity).
- **Encre Marine** (navy-ink): placeholder backdrop behind imagery while it loads.
- **Filet Marine** (navy-line): divider tone reserved for lines on navy.

### Secondary
- **Jaune Signal** (signal): the primary action (Vérifier, Poser une question, Mon espace in the mobile sheet), the parcel footprint outline and centroid on imagery, the scan line, text selection, focus rings on navy, and link hover in the footer. Hover lifts to **Jaune Signal clair** (signal-hover). Text on yellow is always **Encre Signal** (signal-ink), never white.

### Tertiary
- **Drapeau** (flag-green, flag-yellow, flag-red): only inside the tricolor filet and as chart series 4 and 5. Never used as UI state colors.
- **Risque** (risk-danger / -soft, risk-caution / -soft, risk-clear / -soft): the verdict language. Danger is a solid band with white text (the "cannot be sold to you" verdict must shout); caution and clear are soft tints with deep text. `destructive` maps to risk-danger.

### Neutral
- **Ciel** (sky): alternate section field, secondary / muted / accent surfaces, table header, assistant answer bubble, badge background.
- **Ligne Ciel** (sky-line): borders and dividers on white and sky.
- **Bleu Nuit Texte** (foreground #0d1b2a): body text on white.
- **Ardoise** (muted-foreground): supporting text, captions, labels.
- **Trait de champ** (input-line): input borders.
- **Anneau** (ring): focus ring on light fields.

### Named Rules
**The Signal Rule.** Yellow marks the one action a citizen should take next, at most one yellow button per band. Secondary actions are navy or outline. Yellow is never a background field, a heading color, or decoration.

**The Three Verdicts Rule.** Risk is expressed only with the danger / caution / clear pairs, always with an icon and a written verdict. Flag red and flag green never stand in for risk.

**The Field Alternation Rule.** Sections alternate navy, deep navy, white and sky; two adjacent bands never share a field.

## Typography

**Display Font:** Archivo, variable width axis set to wdth 112 (with system-ui fallback)
**Body Font:** Figtree (with system-ui fallback), stylistic sets ss01 and cv11 on
**Label/Mono Font:** none distinct; data uses Archivo with tabular numerals

**Character:** A wide, heavy grotesque with an official, poster-like stance, paired with a friendly, open text face that stays readable on a phone in full daylight.

### Hierarchy
- **Display** (800, clamp(2.6rem, 6.2vw, 4.75rem), 0.98): the single hero h1 on navy.
- **Headline** (800, clamp(2rem, 4.4vw, 3.4rem), 1.02): section h2; smaller bands use clamp(2rem, 4vw, 3rem) at 1.04. Navy on light fields, white on navy. `text-wrap: balance`.
- **Title** (700, 1.125rem): list item titles, verdict headline, step names. Sub-section h3 labels are Archivo 700 at 1rem in navy with normal tracking.
- **Data** (800, 1.5rem, +0.04em, tabular): NUP numbers, fee totals (up to clamp(2.2rem, 5vw, 3.2rem)), years, delays. NUP input text is Archivo 1.125rem at +0.06em.
- **Body lead** (400, 1.125rem, 1.625): section leads, max about 42rem.
- **Body** (400, 1rem, 1.5): running text, verdict reasons at 0.875rem.
- **Label** (500, 0.875rem): field labels; captions and sources at 0.75rem or 0.7rem in muted-foreground.

### Named Rules
**The Tabular Rule.** Every number that a citizen might compare (NUP, m², ha, FCFA, days, years) uses tabular numerals, and identifiers get positive tracking.

**The French Typography Rule.** A non-breaking space precedes « ? », « ! », « : » and « ; », including in JSX (`&nbsp;:`). Numbers are grouped with `Intl.NumberFormat("fr-FR")`; dates are written out in French.

## Layout

Content sits in a 1280px container with 16px / 24px / 32px side gutters (mobile / tablet / desktop). Sections breathe at 80px vertical padding, 112px from the large breakpoint. On desktop, bands use a 12-column grid: a 5-column headline with the lead or content starting at column 7, or the hero's 6 / 6 split (headline, NUP field and sample NUPs left; verdict card right). On mobile everything stacks, the verdict band moves to the top of the card, and horizontal lists (sample NUPs, satellite years) become snap-scrolling rows that bleed to the screen edge. Wide tables collapse into shadcn Item lists below the md breakpoint.

## Elevation & Depth

Depth is mostly tonal: bands of navy, deep navy, sky and white. The only shadow in the system is a soft, downward offset shadow that lifts a white card off a colored field. It is tuned to its field: darker over navy, lighter over sky.

### Shadow Vocabulary
- **Carte sur marine** (`box-shadow: 0 24px 60px -20px rgba(2,12,27,0.65)`): white verdict card and missing-parcel card on the navy hero.
- **Carte sur ciel** (`box-shadow: 0 18px 40px -24px rgba(9,62,115,0.45)`): white fee calculator on the sky band.

### Named Rules
**The One Lift Rule.** Only a white card sitting on a navy or sky field gets a shadow, and only this soft offset. Everything else (items, tables, badges, buttons) is flat, separated by borders or tint.

## Shapes

Corners stay tight, in line with the square-cornered government lineage: 6px (`--radius: 0.375rem`) for cards, tables and outline buttons, 4.8px for inputs and signal buttons, 3.6px for badges and chips. Full circles appear only for numbered step markers. Chat bubbles use 6px with one 3.6px corner pointing to the speaker.

The recurring signature is the **tricolor filet**: a 4px band of flag green, yellow and red in equal thirds, placed at the very top of the header and the footer, and nowhere else.

## Components

All UI is built from shadcn/ui (base-nova style on Base UI). When a shadcn component exists, it is used. Links that look like buttons use `buttonVariants()` on `next/link`, never a custom anchor style.

### Buttons
- **Shape:** tight corners (4.8px for signal, 6px otherwise).
- **Signal (primary action):** yellow, signal-ink text, bold 1rem, 56px tall next to the NUP field, trailing arrow icon. Hover to signal-hover.
- **Navy:** shadcn default variant, 48px tall in content bands, for secondary actions on light fields.
- **Outline:** shadcn outline variant; on navy it becomes white/30 border, transparent fill, hover white fill with navy text.
- **Focus:** 3px ring, ring/50 on light fields, signal/60 on navy.

### Chips (sample NUPs)
- **Style:** 4.8px corners, white/20 border on navy, NUP in Archivo bold tabular, place in 0.75rem below.
- **State:** pressed state has a white border and white/10 fill (`aria-pressed`).

### Cards / Containers
- **Corner Style:** 6px.
- **Background:** white.
- **Shadow Strategy:** see The One Lift Rule.
- **Border:** none on lifted cards; list items and tables use sky-line borders.
- **Internal Padding:** 20px mobile, 24px desktop (32px for the fee calculator).

### Inputs / Fields
- **Style:** shadcn InputGroup, 56px tall, white fill, leading search icon in navy/60, value in Archivo tabular with wide tracking, placeholder in Figtree.
- **Focus:** signal ring on navy, standard ring on light fields.
- **Error:** FieldError text in signal on navy.

### Navigation
- **Header:** navy, tricolor filet on top, 64px bar, logo left, links in white/80 at 0.95rem with white/10 hover fill, outline "Mon espace" button. Below lg, a shadcn Sheet on navy with a signal account button.
- **Footer:** deep navy, tricolor filet on top, white/70 links hovering to signal.

### Verdict Card (signature)
White card on navy: NUP header in data type, a Sentinel-2 image cropped around the parcel with a dashed signal footprint and centroid, a year chip, a shadcn ToggleGroup of years (pressed = navy), a facts grid, a full-bleed verdict band in the risk color with a shield icon and an Accordion "Pourquoi ce verdict ?", and a source line. Changing the parcel replays a signal scan line (1.1s) and a "develop" blur-in of the image (700ms, cubic-bezier(0.16,1,0.3,1)); both are cut under reduced motion.

### Imagery
Sentinel-2 cloudless (EOX, 2016 to 2024) is the only photographic material. Every image carries a visible credit: « Sentinel-2 cloudless © EOX IT Services (CC BY-NC-SA 4.0), données Copernicus modifiées ». No stock photography, no illustrations of people.

## Do's and Don'ts

### Do:
- **Do** open every product surface on a navy field with the task itself, not a presentation of it.
- **Do** keep signal yellow (#ffd400) for the single next action per band, with signal-ink text.
- **Do** express risk with the danger / caution / clear pairs, each with an icon and a written verdict.
- **Do** set every number in tabular numerals, identifiers in Archivo with positive tracking.
- **Do** put a non-breaking space before « ? », « ! », « : » and « ; ».
- **Do** use shadcn components, and `buttonVariants()` for links styled as buttons.
- **Do** credit every Sentinel-2 image where it appears.
- **Do** lift white cards off colored fields with the one soft offset shadow and nothing heavier.

### Don't:
- **Don't** add eyebrow kickers or small uppercase labels above headings.
- **Don't** use colored side stripes on cards, list items or alerts.
- **Don't** put decorative icons next to headings; icons carry meaning (risk level, action direction, search) or are absent.
- **Don't** use flag colors outside the tricolor filet and charts.
- **Don't** use stock photography or any imagery other than credited satellite imagery.
- **Don't** round surfaces beyond 6px or use pill-shaped buttons.
- **Don't** use hard offset shadows or glows.
