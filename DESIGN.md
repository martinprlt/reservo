# Design System Specification: The Serene Professional

This document defines the visual language and structural logic for a high-end service management platform. Our goal is to move beyond the "utilitarian SaaS" aesthetic, instead creating a digital environment that feels like a premium concierge service: calm, authoritative, and impeccably organized.

---

## 1. Overview & Creative North Star: "The Digital Curator"

The Creative North Star for this design system is **The Digital Curator**. 

In the wellness and beauty space, the experience begins the moment a client interacts with the brand. This system rejects the rigid, boxy layouts of traditional software. Instead, it utilizes **Intentional Asymmetry** and **Tonal Depth** to guide the eye. We break the "template" look by using exaggerated whitespace (the 16 and 24 spacing tokens) and overlapping elements that suggest layers of fine paper or frosted glass rather than flat pixels.

---

## 2. Colors & Surface Logic

Our palette is anchored in a sophisticated "Deep Teal" (`primary: #00464b`) and a "Midnight Indigo" (`tertiary: #133a87`), balanced by a breathable, cool-toned background (`surface: #f7f9ff`).

### The "No-Line" Rule
To maintain a premium, editorial feel, **1px solid borders are prohibited for sectioning.** We do not use lines to separate content. Instead, boundaries are defined through:
*   **Background Shifts:** Moving from `surface` to `surface-container-low`.
*   **Negative Space:** Using the `8` (2rem) or `10` (2.5rem) spacing tokens to create mental groupings.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials. 
*   **Base:** `surface` (#f7f9ff)
*   **Sections:** `surface-container-low` (#f1f4fa)
*   **Actionable Cards:** `surface-container-lowest` (#ffffff)
*   **Navigation/Overlays:** `surface-container-high` (#e5e8ee)

### The "Glass & Gradient" Rule
Standard flat colors feel static. To inject "soul" into the UI:
*   **Primary CTAs:** Use a subtle linear gradient from `primary` (#00464b) to `primary_container` (#006066) at a 135-degree angle.
*   **Floating Navigation:** Apply `surface_container_low` with a 60% opacity and a `backdrop-blur` of 20px to create a "frosted glass" effect, allowing the wellness brand's imagery to bleed through softly.

---

## 3. Typography: Editorial Authority

We use a dual-typeface system to balance character with high-performance readability.

*   **Display & Headlines (Manrope):** Used for "The Hook." Manrope’s geometric yet warm curves convey modern luxury. 
    *   *Usage:* Use `display-md` for dashboard greetings and `headline-sm` for section headers.
*   **Interface & Body (Inter):** Used for "The Work." Inter is optimized for mobile readability and high-density scheduling data.
    *   *Usage:* Use `body-md` for all client notes and `label-md` for status badges.

**Hierarchy Tip:** Always pair a `headline-sm` in `on_surface` with a `label-md` in `on_surface_variant` to create immediate typographic contrast without using bold weights.

---

## 4. Elevation & Depth

We achieve hierarchy through **Tonal Layering** rather than traditional structural shadows.

*   **The Layering Principle:** Place a `surface-container-lowest` card (Pure White) on top of a `surface-container-low` background. This creates a "Natural Lift" that feels cleaner than a drop shadow.
*   **Ambient Shadows:** For floating elements like modals or date pickers, use a diffused shadow: 
    *   `box-shadow: 0 12px 32px -4px rgba(0, 70, 75, 0.08);` 
    *   Note the use of a tinted shadow (using the `primary` color) rather than pure black.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., in high-contrast mode), use `outline-variant` at **15% opacity**. Never 100%.

---

## 5. Components

### Buttons
*   **Primary:** Rounded `md` (0.75rem). Gradient fill (`primary` to `primary_container`). White text.
*   **Secondary:** Ghost style. `outline` token at 20% opacity. `primary` text.
*   **Tertiary:** Text-only. `tertiary` color, weight 600.

### Input Fields
*   **Styling:** Forbid the 4-sided box. Use a `surface-container-highest` background with a `DEFAULT` (0.5rem) rounded top and a 2px bottom-stroke using the `primary` token only on `:focus`.
*   **Validation:** Use `error` (#ba1a1a) for helper text, paired with `error_container` as a soft background highlight for the field.

### Scheduling Cards & Lists
*   **The Rule:** No dividers. Separate appointment slots using `surface-container-low` blocks with `8px` of vertical spacing between them.
*   **Interaction:** On hover, transition the card background from `surface-container-lowest` to `primary_fixed` (#a1eff7) at 10% opacity.

### Context-Specific Components
*   **The "Moment" Chip:** A high-contrast pill using `tertiary_container` for confirmed appointments.
*   **Status Indicators:** Use the `primary_fixed_dim` color for "In-Progress" states—it’s softer than the primary teal and signals "calm activity."

---

## 6. Do's and Don'ts

### Do
*   **DO** use "Overlapping Content": Let a card bleed over the edge of a background container by 24px to create depth.
*   **DO** use `inverse_surface` for dark-mode-style tooltips to provide immediate contrast against the light UI.
*   **DO** prioritize the `20` (5rem) spacing token for top-level page margins to ensure the interface "breathes."

### Don't
*   **DON'T** use 100% black text. Always use `on_surface` (#181c20) for better optical comfort.
*   **DON'T** use "Hard" corners. Even for small elements like checkboxes, use the `sm` (0.25rem) radius.
*   **DON'T** use standard grey dividers. If you must separate content horizontally, use a 4px height bar in `surface-container-highest` with a width of only 32px (the "Signature Notch").

---

## 7. Accessibility
All color pairings (e.g., `on_primary` on `primary`) have been calculated to exceed WCAG 2.1 Level AA standards. When using `tertiary` (Indigo), ensure it is only paired with `tertiary_fixed` or `surface` to maintain a contrast ratio above 7:1.