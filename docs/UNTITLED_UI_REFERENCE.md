# Untitled UI Reference (RelayKit fit)
### Last updated: April 27, 2026

> **What this is:** A design-system reference for `/prototype` — the Tailwind v4.1 semantic token tables actually wired into `prototype/app/globals.css`, plus the Untitled UI conventions RelayKit follows (kebab-case filenames, no raw Tailwind colors, icon library, `Aria*` aliasing rule for any future `react-aria-components` imports). Component-level upstream Untitled UI documentation is preserved in this file but explicitly marked as **upstream-not-wired** — `/prototype` does not import any upstream `@untitledui/...` base components today and uses plain Tailwind + the semantic-token CSS variables instead. For RelayKit's actual screen-level component specs (top-nav, wizard-layout, catalog-card, custom-message-card, sign-in-modal, etc.), see `PROTOTYPE_SPEC.md`.

---

## Project Overview (RelayKit `/prototype`)

The prototype lives at `/prototype` in the repo and runs on:

- **Next.js ^15** (App Router) — `next dev -p 3001` (port 3001, not Vite's 5173)
- **React 19**
- **TypeScript 5.7+**
- **Tailwind CSS v4.1** — design tokens defined in `prototype/app/globals.css` via the `@theme` block (Tailwind v4 in-CSS theme syntax; no `tailwind.config.ts`)
- **`@untitledui/icons`** — free 1,100+ icon set (no Pro, no file-icons)
- **Tiptap v3** — message editor (`prototype/lib/editor/`)
- **`react-aria-components`** — **not currently a dependency.** If/when added, all imports must be aliased with `Aria*` prefix per the convention below.

`/prototype` is the UI source of truth. Production code ports from `/prototype` to `/api` + future surfaces once screens stabilize. Per CLAUDE.md, prototype code is production-quality in everything except backend.

## Key Architecture Principles

### Import Naming Convention (forward-looking rule for `react-aria-components`)

**CRITICAL**: If `react-aria-components` is ever imported, all imports must be prefixed with `Aria*` for clarity and consistency:

```typescript
// ✅ Correct
import { Button as AriaButton, TextField as AriaTextField } from "react-aria-components";
// ❌ Incorrect
import { Button, TextField } from "react-aria-components";
```

This convention:

- Prevents naming conflicts with RelayKit's domain components
- Makes it clear when using base React Aria components
- Maintains consistency across the codebase when `react-aria-components` lands

### File Naming Convention

**IMPORTANT**: All files must be named in **kebab-case** for consistency:

```
✅ Correct:
- date-picker.tsx
- user-profile.tsx
- api-client.ts
- auth-context.tsx

❌ Incorrect:
- DatePicker.tsx
- userProfile.tsx
- apiClient.ts
- AuthContext.tsx
```

This applies to all file types: component files (`.tsx`), TypeScript files (`.ts`), style files (`.css`), test files (`.test.ts`).

### Icon gotcha — `ShieldCheck` does not exist

`@untitledui/icons` does **not** export `ShieldCheck`. Use `ShieldTick` instead. (Recurring trap because `ShieldCheck` exists in many other icon libraries — but not this one.)

## Development Commands

```bash
# From /prototype
npm run dev              # Start Next.js dev server on http://localhost:3001 (NOT 5173)
npm run build            # Build for production
```

## Project Structure (`/prototype`)

```
prototype/
├── app/                  # Next.js App Router routes + globals.css
│   ├── globals.css       # Tailwind v4 @theme block — semantic-token source of truth
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home (marketing)
│   ├── apps/[appId]/     # Workspace (post-signup)
│   ├── start/            # Wizard
│   ├── sms/[category]/   # Marketing category landing
│   └── ...
├── components/           # Domain components (24 files; not upstream UI primitives)
│   ├── catalog/          # catalog-card, custom-message-card, catalog-opt-in, ...
│   ├── plan-builder/     # consent-preview, preview-as-input
│   ├── registration/     # business-details-form, review-confirm
│   ├── wizard-layout.tsx
│   ├── dashboard-layout.tsx
│   ├── top-nav.tsx
│   ├── footer.tsx
│   └── ... (sign-in-modal, ein-inline-verify, etc.)
├── lib/                  # Utilities + Tiptap editor
│   ├── editor/           # Tiptap message-editor, variable-node, template-serde (D-350/D-353)
│   ├── intake/           # Intake helpers
│   ├── slug.ts, variable-scope.ts, variable-token.ts, wizard-storage.ts, catalog-helpers.ts
├── context/              # React context providers
├── data/                 # Mock data (verticals, messages, etc.)
├── hooks/
├── images/, public/
├── middleware.ts
└── next.config.ts
```

**No `src/`-rooted layout.** No `components/base/`, `components/application/`, `components/foundations/`. Domain components are flat in `components/` with topical subfolders. Screen-level component specs (what each component does, how each screen uses them) live in `PROTOTYPE_SPEC.md`, not here.

### Styling Architecture (Tailwind v4)

- All semantic colors (`text-primary`, `bg-secondary`, `border-brand`, `fg-error-primary`, etc.) come from `prototype/app/globals.css` `@theme` block — see the Colors tables at the bottom of this doc.
- **Never use raw Tailwind color classes** (`text-gray-900`, `bg-blue-700`). Always use the semantic tokens. Per CLAUDE.md design-system rules.
- Tailwind v4 is in-CSS theme via `@theme {...}` (no `tailwind.config.ts` file).

### Component Props Pattern (forward-looking)

When new generic components are added that need to mirror Untitled UI conventions, follow this pattern:

```typescript
interface CommonProps {
    size?: "sm" | "md" | "lg";
    isDisabled?: boolean;
    isLoading?: boolean;
    // ... other common props
}

interface ButtonProps extends CommonProps, HTMLButtonElement {
    color?: "primary" | "secondary" | "tertiary";
    iconLeading?: FC | ReactNode;
    iconTrailing?: FC | ReactNode;
}
```

## Styling Guidelines

### Tailwind CSS v4.1

- Tailwind v4.1 in-CSS theme — token definitions live in `prototype/app/globals.css` inside an `@theme {...}` block.
- Consistent spacing, colors, and typography scales.

### Brand Color Customization

To change the main brand color across the application:

1. **Edit `prototype/app/globals.css`** (`@theme` block, `BRAND` section) and modify the `--color-brand-*` variables.
2. **Maintain Color Scale**: Provide the complete scale from 25 to 950 with proper contrast ratios.
3. **Current scale (verbatim from `globals.css`):**
    ```css
    --color-brand-25:  rgb(252 250 255); /* Lightest tint */
    --color-brand-50:  rgb(249 245 255);
    --color-brand-100: rgb(244 235 255);
    --color-brand-200: rgb(233 215 254);
    --color-brand-300: rgb(214 187 251);
    --color-brand-400: rgb(182 146 246);
    --color-brand-500: rgb(158 119 237); /* Base brand color (focus ring) */
    --color-brand-600: rgb(127 86 217);  /* Primary interactive color */
    --color-brand-700: rgb(105 65 198);
    --color-brand-800: rgb(83 56 158);
    --color-brand-900: rgb(66 48 125);
    --color-brand-950: rgb(44 28 95);    /* Darkest shade */
    ```

**Dark mode is not currently wired in `/prototype`.** Several semantic-token variants documented below (`_alt`, `_on-brand`) are designed to switch values in dark mode and are **not** yet present in `globals.css` — they're upstream-reference for if/when dark mode lands.

### Style Organization (upstream pattern, for new components)

If/when generic UI components are introduced that warrant a `sortCx`-style style object, follow this Untitled UI pattern:

```typescript
export const styles = sortCx({
    common: {
        root: "base-classes-here",
        icon: "icon-classes-here",
    },
    sizes: {
        sm: { root: "small-size-classes" },
        md: { root: "medium-size-classes" },
    },
    colors: {
        primary: { root: "primary-color-classes" },
        secondary: { root: "secondary-color-classes" },
    },
});
```

**Note:** the `sortCx` and `cx` utilities are upstream Untitled UI helpers — **not currently present in `/prototype`** (no `prototype/lib/cx.ts` or similar). The prototype uses string-concatenated `className` strings and template literals directly. If multi-variant component patterns become necessary, port `sortCx` then.

### Utility Functions (upstream — not currently wired)

- `cx()` - Class name utility — **upstream, not in `/prototype`**
- `sortCx()` - Organized style objects — **upstream, not in `/prototype`**
- `isReactComponent()` - Component type checking — **upstream, not in `/prototype`**

## Icon Usage

### RelayKit-licensed library

- `@untitledui/icons` (^0.0.21) — 1,100+ line-style icons, free. **The only icon library wired into `/prototype`.**

### Upstream-only libraries (not currently licensed/used by RelayKit)

- `@untitledui/file-icons` - File type icons. **Not in prototype dependencies.**
- `@untitledui-pro/icons` - 4,600+ icons in 4 styles (line/duocolor/duotone/solid). **Requires PRO license; not in prototype dependencies.** Do not import — would fail to resolve.

### Import & Usage

```typescript
// Recommended: Named imports (tree-shakeable)
import { Home01, Settings01, ChevronDown } from "@untitledui/icons";

// Component props — pass as reference
<Button iconLeading={ChevronDown}>Options</Button>

// Standalone usage (use a semantic token, not a raw color class)
<Home01 className="size-5 text-tertiary" />

// As JSX element — MUST include data-icon when used as element
<Button iconLeading={<ChevronDown data-icon className="size-4" />}>Options</Button>
```

### Styling

```typescript
// Size: use size-4 (16px), size-5 (20px), size-6 (24px)
<Home01 className="size-5" />

// Color: use semantic foreground/text tokens (not raw Tailwind colors)
<Home01 className="size-5 text-fg-brand-primary" />

// Stroke width (line icons only)
<Home01 className="size-5" strokeWidth={2} />

// Accessibility: decorative icons need aria-hidden
<Home01 className="size-5" aria-hidden="true" />
```

### Common gotcha

**`ShieldCheck` does not exist in `@untitledui/icons`.** Use `ShieldTick` instead. (`ShieldCheck` exists in many other icon libraries — e.g., Lucide — but not this one. The TypeScript error is helpful but cryptic; remember the rename.)

## Form Handling

> **Upstream — not wired in `/prototype`.** The named components below (`Input`, `Select`, `Checkbox`, `Radio`, `Textarea`, `Form`) come from the upstream Untitled UI library. `/prototype` builds form controls from plain `<input>` / `<select>` / `<textarea>` plus semantic tokens. If RelayKit later adopts the Untitled UI form primitives, they'll come in via the `@untitledui-pro/*` packages (not currently licensed) or as locally implemented `react-aria-components` wrappers.

### Form Components (upstream)

- `Input` - Text inputs with validation
- `Select` - Dropdown selections
- `Checkbox`, `Radio` - Selection controls
- `Textarea` - Multi-line text input
- `Form` - Form wrapper with validation

## Animation and Interactions

### CSS Transitions (RelayKit convention)

For default small transition actions (hover states, color changes, etc.), use:

```typescript
className = "transition duration-100 ease-linear";
```

This provides a snappy 100ms linear transition that feels responsive without being jarring. Plain Tailwind utilities — works in `/prototype` today.

`/prototype` also defines named keyframe animations in `globals.css` for wizard-specific transitions: `wizardFadeIn`, `einCardFade`, `testSentFade`.

### Animation Libraries (upstream — not wired in `/prototype`)

- `motion` (Framer Motion) for complex animations — not a `/prototype` dependency.
- `tailwindcss-animate` for utility-based animations — not a `/prototype` dependency.
- For complex animations in RelayKit today, prefer keyframe animations declared in `globals.css` and applied via `animate-*` utilities.

### Loading States (upstream pattern)

- Upstream Untitled UI components support an `isLoading` prop with built-in spinners and disabled states. Not applicable in `/prototype` since those components aren't wired. Implement loading affordances manually with semantic tokens (`bg-disabled`, `text-disabled`) and the existing wizard fade animations.

## Common Patterns (upstream — not wired in `/prototype`)

> The compound-component and conditional-rendering snippets below reference upstream primitives (`SelectComponent`, `SelectItem`, `ComboBox`, `Label`, `HintText`) that don't exist in `/prototype`. Kept as forward-looking reference for if/when those primitives are adopted.

### Compound Components (upstream)

```typescript
const Select = SelectComponent as typeof SelectComponent & {
    Item: typeof SelectItem;
    ComboBox: typeof ComboBox;
};
Select.Item = SelectItem;
Select.ComboBox = ComboBox;
```

### Conditional Rendering (upstream)

```typescript
{label && <Label isRequired={isRequired}>{label}</Label>}
{hint && <HintText isInvalid={isInvalid}>{hint}</HintText>}
```

## State Management

### Component State

- Local React state (`useState`, `useReducer`) for component-specific data.
- React context for shared state (sessionStorage-backed wizard state, top-level prototype context, etc.).
- **Note:** "React Aria's built-in state management" referenced in upstream docs is not applicable to `/prototype` until `react-aria-components` is added.

### Global State (RelayKit `/prototype`)

- Wizard state — `sessionStorage` key `relaykit_wizard` (read in `useEffect`, not `useState` initializer; SSR hydration). Storage helper at `prototype/lib/wizard-storage.ts`.
- Other shared state — React contexts in `prototype/context/`.
- No theme provider (single light-mode theme; dark mode not wired). No router provider (Next.js App Router handles routing natively).

## Key Files and Utilities (`/prototype`)

### Style Configuration

- `prototype/app/globals.css` — Tailwind v4 `@theme` block (semantic tokens) + wizard animations (`wizardFadeIn`, `einCardFade`, `testSentFade`).
- No separate `theme.css` or `typography.css` — Tailwind v4's in-CSS theme + utility classes cover both.

### Domain libraries

- `prototype/lib/editor/` — Tiptap editor (D-350, D-353, D-354): `message-editor.tsx`, `variable-node.ts`, `variable-node-view.tsx`, `template-serde.ts`.
- `prototype/lib/intake/` — Intake helpers + templates.
- `prototype/lib/wizard-storage.ts` — `sessionStorage` wrapper for wizard state (key `relaykit_wizard`).
- `prototype/lib/variable-token.ts` — shared color-only class for variable rendering across editor + previews.
- `prototype/lib/variable-scope.ts` — per-message variable scope helper (D-353).
- `prototype/lib/slug.ts` — kebab-case slug generator with collision handling.
- `prototype/lib/catalog-helpers.ts` — catalog-specific helpers.

### Upstream utilities — not currently in `/prototype`

- `cx()` (class-name utility) — **upstream, not wired.** Prototype uses string-concatenated `className`s.
- `is-react-component.ts` — **upstream, not wired.**
- `sortCx()` — **upstream, not wired.** See Style Organization section above.

## Best Practices for AI Assistance

### When Adding New Components in `/prototype`

1. Follow the existing flat-with-topical-subfolder structure (`prototype/components/<topic>/<name>.tsx` or top-level `prototype/components/<name>.tsx`).
2. Use semantic tokens for all colors. Never raw Tailwind color classes.
3. Implement proper TypeScript types.
4. Use kebab-case filenames.
5. Use `@untitledui/icons` for icons (the only licensed library).
6. Domain components live in `/prototype/components/`; spec them in `PROTOTYPE_SPEC.md`, not in this design-system reference.
7. **Don't** assume `react-aria-components` is available — it isn't. If accessibility primitives are needed, they need to be added as a dependency first, with the `Aria*` aliasing convention applied at import time.

### Domain components in `/prototype`

The 24 domain component files in `prototype/components/` (top-nav, footer, dashboard-layout, wizard-layout, sign-in-modal, catalog-card, custom-message-card, ein-inline-verify, ask-claude-panel, plan-builder/, registration/, etc.) are RelayKit-specific and **specced in `PROTOTYPE_SPEC.md`**, not here. This reference is for design-system primitives (tokens + icon library + naming conventions), not for screen-level domain components.

---

# Upstream Untitled UI Reference (not currently wired into `/prototype`)

> **The component sections below are preserved from the upstream Untitled UI design-system reference.** None of these components are currently imported in `/prototype` — there is no `@/components/base/...` directory tree, and the prototype uses plain Tailwind + the semantic-token CSS variables instead. This section is kept as forward-looking reference for if/when RelayKit adopts upstream Untitled UI primitives. The import paths shown (`@/components/base/buttons/button`, etc.) **will fail to resolve in `/prototype` today** — they describe the upstream library structure, not RelayKit's actual layout.

## Most Used Components Reference

### Button

The Button component is the most frequently used interactive element across the library.

**Import:**

```typescript
import { Button } from "@/components/base/buttons/button";
```

**Common Props:**

- `size`: `"sm" | "md" | "lg" | "xl"` - Button size (default: `"sm"`)
- `color`: `"primary" | "secondary" | "tertiary" | "link-gray" | "link-color" | "primary-destructive" | "secondary-destructive" | "tertiary-destructive" | "link-destructive"` - Button color variant (default: `"primary"`)
- `iconLeading`: `FC | ReactNode` - Icon or component to display before text
- `iconTrailing`: `FC | ReactNode` - Icon or component to display after text
- `isDisabled`: `boolean` - Disabled state
- `isLoading`: `boolean` - Loading state with spinner
- `showTextWhileLoading`: `boolean` - Keep text visible during loading
- `children`: `ReactNode` - Button content

**Examples:**

```typescript
// Basic button
<Button size="md">Save</Button>

// With leading icon
<Button iconLeading={Check} color="primary">Save</Button>

// Loading state
<Button isLoading showTextWhileLoading>Submitting...</Button>

// Destructive action
<Button color="primary-destructive" iconLeading={Trash02}>Delete</Button>
```

### Input

Text input component with extensive customization options.

**Import:**

```typescript
import { Input } from "@/components/base/input/input";
import { InputGroup } from "@/components/base/input/input-group";
```

**Common Props:**

- `size`: `"sm" | "md"` - Input size (default: `"sm"`)
- `label`: `string` - Field label
- `placeholder`: `string` - Placeholder text
- `hint`: `string` - Helper text below input
- `tooltip`: `string` - Tooltip text for help icon
- `icon`: `FC` - Leading icon component
- `isRequired`: `boolean` - Required field indicator
- `isDisabled`: `boolean` - Disabled state
- `isInvalid`: `boolean` - Error state

**Examples:**

```typescript
// Basic input with label
<Input label="Email" placeholder="olivia@untitledui.com" />

// With icon and validation
<Input
  icon={Mail01}
  label="Email"
  isRequired
  isInvalid
  hint="Please enter a valid email"
/>

// Input group with button
<InputGroup label="Website" trailingAddon={<Button>Copy</Button>}>
  <InputBase placeholder="www.untitledui.com" />
</InputGroup>
```

### Select

Dropdown selection component with search and multi-select capabilities.

**Import:**

```typescript
import { MultiSelect } from "@/components/base/select/multi-select";
import { Select } from "@/components/base/select/select";
```

**Common Props:**

- `size`: `"sm" | "md"` - Select size (default: `"sm"`)
- `label`: `string` - Field label
- `placeholder`: `string` - Placeholder text
- `hint`: `string` - Helper text
- `tooltip`: `string` - Tooltip text
- `items`: `Array` - Data items to display
- `isRequired`: `boolean` - Required field
- `isDisabled`: `boolean` - Disabled state
- `placeholderIcon`: `FC | ReactNode` - Icon for placeholder

**Item Props:**

- `id`: `string` - Unique identifier
- `supportingText`: `string` - Secondary text
- `icon`: `FC | ReactNode` - Leading icon
- `avatarUrl`: `string` - Avatar image URL
- `isDisabled`: `boolean` - Disabled item

**Examples:**

```typescript
// Basic select
<Select label="Team member" placeholder="Select member" items={users}>
  {(item) => (
    <Select.Item id={item.id} supportingText={item.email}>
      {item.name}
    </Select.Item>
  )}
</Select>

// With search (ComboBox)
<Select.ComboBox label="Search" placeholder="Search users" items={users}>
  {(item) => <Select.Item id={item.id}>{item.name}</Select.Item>}
</Select.ComboBox>

// With avatars
<Select items={users} placeholderIcon={User01}>
  {(item) => (
    <Select.Item avatarUrl={item.avatar} supportingText={item.role}>
      {item.name}
    </Select.Item>
  )}
</Select>
```

### Checkbox

Checkbox component for boolean selections.

**Import:**

```typescript
import { Checkbox } from "@/components/base/checkbox/checkbox";
```

**Common Props:**

- `size`: `"sm" | "md"` - Checkbox size (default: `"sm"`)
- `label`: `string` - Checkbox label
- `hint`: `string` - Helper text below label
- `isSelected`: `boolean` - Checked state
- `isDisabled`: `boolean` - Disabled state
- `isIndeterminate`: `boolean` - Indeterminate state

**Examples:**

```typescript
// Basic checkbox
<Checkbox label="Remember me" />

// With hint text
<Checkbox
  label="Remember me"
  hint="Save my login details for next time"
/>

// Controlled state
<Checkbox isSelected={checked} onChange={setChecked} />
```

### Badge

Badge components for status indicators and labels.

**Import:**

```typescript
import { Badge, BadgeWithDot, BadgeWithIcon } from "@/components/base/badges/badges";
```

**Common Props:**

- `size`: `"sm" | "md" | "lg"` - Badge size
- `color`: `"gray" | "brand" | "error" | "warning" | "success" | "blue-gray" | "blue-light" | "blue" | "indigo" | "purple" | "pink" | "rose" | "orange"` - Color theme
- `type`: `"pill-color" | "color" | "modern"` - Badge style variant

**Examples:**

```typescript
// Basic badge
<Badge color="brand" size="md">New</Badge>

// With dot indicator
<BadgeWithDot color="success" type="pill-color">Active</BadgeWithDot>

// With icon
<BadgeWithIcon iconLeading={ArrowUp} color="success">12%</BadgeWithIcon>
```

### Avatar

Avatar component for user profile images.

**Import:**

```typescript
import { Avatar } from "@/components/base/avatar/avatar";
import { AvatarLabelGroup } from "@/components/base/avatar/avatar-label-group";
```

**Common Props:**

- `size`: `"xs" | "sm" | "md" | "lg" | "xl" | "2xl"` - Avatar size
- `src`: `string` - Image URL
- `alt`: `string` - Alt text for accessibility
- `initials`: `string` - Text initials when no image
- `placeholderIcon`: `FC` - Icon when no image
- `status`: `"online" | "offline"` - Status indicator
- `verified`: `boolean` - Verification badge
- `badge`: `ReactNode` - Custom badge element

**Examples:**

```typescript
// Basic avatar
<Avatar src="/avatar.jpg" alt="User Name" size="md" />

// With status
<Avatar src="/avatar.jpg" status="online" />

// With initials fallback
<Avatar initials="OR" size="lg" />

// Label group
<AvatarLabelGroup
  src="/avatar.jpg"
  title="Olivia Rhye"
  subtitle="olivia@untitledui.com"
  size="md"
/>
```

### FeaturedIcon

Decorative icon component with themed backgrounds for emphasis and visual hierarchy.

**Import:**

```typescript
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
```

**Common Props:**

- `icon`: `FC` - Icon component to display (required)
- `size`: `"sm" | "md" | "lg" | "xl"` - Icon container size
- `color`: `"brand" | "gray" | "error" | "warning" | "success"` - Color scheme
- `theme`: `"light" | "gradient" | "dark" | "modern" | "modern-neue" | "outline"` - Visual theme style

**Theme Styles:**

- `light`: Subtle background with colored icon
- `gradient`: Gradient background effect
- `dark`: Solid colored background with white icon
- `modern`: Contemporary gray styling (gray color only)
- `modern-neue`: Alternative modern style (gray color only)
- `outline`: Border style with transparent background

**Examples:**

```typescript
// Basic featured icon
<FeaturedIcon icon={CheckCircle} color="success" theme="light" size="lg" />

// With gradient theme
<FeaturedIcon icon={AlertCircle} color="warning" theme="gradient" size="xl" />

// Dark theme for emphasis
<FeaturedIcon icon={XCircle} color="error" theme="dark" size="md" />

// Outline style
<FeaturedIcon icon={InfoCircle} color="brand" theme="outline" size="lg" />

// Modern styles (IMPORTANT: gray only)
<FeaturedIcon icon={Settings} color="gray" theme="modern" size="lg" />
```

### Link

**Note**: There is no dedicated Link component. Instead, use the Button component with an `href` prop and link-specific color variants.

**Import:**

```typescript
import { Button } from "@/components/base/buttons/button";
```

**Link Colors:**

- `link-gray` - Gray link styling
- `link-color` - Brand color link styling
- `link-destructive` - Destructive link styling

**Examples:**

```typescript
// Basic link
<Button href="/dashboard" color="link-color">View Dashboard</Button>

// With icon
<Button href="/settings" color="link-gray" iconLeading={Settings01}>
  Settings
</Button>

// Destructive link
<Button href="/delete" color="link-destructive" iconLeading={Trash02}>
  Delete Account
</Button>

// External link
<Button href="https://example.com" color="link-color" iconTrailing={ExternalLink01}>
  Visit Site
</Button>
```

### Common Component Patterns

1. **Size Variants**: Most components support `sm`, `md`, `lg` sizes
2. **State Props**: `isDisabled`, `isLoading`, `isInvalid`, `isRequired` are common
3. **Icon Support**: Components accept icons as both components (`Icon`) or elements (`<Icon />`)
4. **Compound Components**: Complex components use dot notation (e.g., `Select.Item`, `Select.ComboBox`)
5. **Accessibility**: All components include proper ARIA attributes and keyboard support

### Icon Usage

When passing icons to components:

```typescript
// As component reference (preferred)
<Button iconLeading={ChevronDown}>Options</Button>

// As element (must include data-icon)
<Button iconLeading={<ChevronDown data-icon className="size-4" />}>Options</Button>
```

---

# Token Reference (mostly applicable to `/prototype`)

> **Scope.** The tables below come from the upstream Untitled UI documentation but the **token names themselves are universal** — most are wired in `/prototype`'s `globals.css` and are the canonical color system for RelayKit. Rows marked **⚠ Upstream-only** are documented in the upstream system but **not currently defined in `/prototype/app/globals.css`** — using them in RelayKit code today will fall back to whatever Tailwind does with an undefined custom variable. If you need one of those tokens, define it in `globals.css` first.
>
> **Wired-but-undocumented tokens** (defined in `/prototype` but not in the upstream tables below) are listed in the "RelayKit-only token additions" section at the end.

## COLORS

MUST use color classes to style elements.

Bad:

- text-gray-900
- text-gray-600
- bg-blue-700

Good:

- text-primary
- text-secondary
- bg-primary

### Upstream-only tokens (not in `/prototype/app/globals.css`)

The tables below contain a mix of wired and upstream-only tokens. These names appear in the tables but are **not** wired in `/prototype` — define them in `globals.css` before using:

- **Text:** `text-primary_on-brand`, `text-secondary_on-brand`, `text-tertiary_on-brand`, `text-quaternary_on-brand`, `text-brand-secondary_hover`, `text-brand-tertiary_alt`
- **Border:** `border-secondary_alt`, `border-disabled_subtle`, `border-brand_alt`, `border-error_subtle`
- **Foreground:** `fg-secondary_hover`, `fg-tertiary_hover`, `fg-white`, `fg-disabled_subtle`, `fg-brand-primary_alt`, `fg-brand-secondary_alt`
- **Background:** `bg-primary_alt`, `bg-secondary_alt`, `bg-secondary_subtle`, `bg-brand-primary_alt`, `bg-brand-section`, `bg-brand-section_subtle`, `bg-error-solid_hover`

Everything else listed in the four tables that follow **is** wired in `/prototype`.

### Text Color

Use text color variables to manage all text fill colors in your designs across light and dark modes.

| Name                       | Usage                                                                                                                                                                |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| text-primary               | Primary text such as page headings.                                                                                                                                  |
| text-primary_on-brand      | Primary text when used on solid brand color backgrounds. Commonly used for brand theme website sections (e.g. CTA sections).                                         |
| text-secondary             | Secondary text such as labels and section headings.                                                                                                                  |
| text-secondary_hover       | Secondary text when in hover state.                                                                                                                                  |
| text-secondary_on-brand    | Secondary text when used on solid brand color backgrounds. Commonly used for brand theme website sections (e.g. CTA sections).                                       |
| text-tertiary              | Tertiary text such as supporting text and paragraph text.                                                                                                            |
| text-tertiary_hover        | Tertiary text when in hover state.                                                                                                                                   |
| text-tertiary_on-brand     | Tertiary text when used on solid brand color backgrounds. Commonly used for brand theme website sections (e.g. CTA sections).                                        |
| text-quaternary            | Quaternary text for more subtle and lower-contrast text, such as footer column headings.                                                                             |
| text-quaternary_on-brand   | Quaternary text when used on solid brand color backgrounds. Commonly used for brand theme website sections (e.g. footers).                                           |
| text-white                 | Text that is always white, regardless of the mode.                                                                                                                   |
| text-disabled              | Default color for disabled text such as disabled input fields or buttons. This can be changed to gray-400, but gray-500 is higher contrast and more accessible.      |
| text-placeholder           | Default color for placeholder text such as input field placeholders. This can be changed to gray-400, but gray-500 is more accessible because it is higher contrast. |
| text-placeholder_subtle    | A more subtle (lower contrast) alternative placeholder text. Useful for components such as verification code input fields.                                           |
| text-brand-primary         | Primary brand text useful for headings (e.g. cards in pricing page headers).                                                                                         |
| text-brand-secondary       | Secondary brand text for brand buttons, as well as accented text, highlights, and subheadings (e.g. subheadings in blog post cards).                                 |
| text-brand-secondary_hover | Secondary brand text when in hover state (e.g. brand buttons).                                                                                                       |
| text-brand-tertiary        | Tertiary brand text for lighter accented text and highlights (e.g. numbers in metric cards).                                                                         |
| text-brand-tertiary_alt    | An alternative to tertiary brand text that is lighter in dark mode (e.g. numbers in metric cards).                                                                   |
| text-error-primary         | Default error state semantic text color (e.g. input field error states).                                                                                             |
| text-warning-primary       | Default warning state semantic text color.                                                                                                                           |
| text-success-primary       | Default success state semantic text color.                                                                                                                           |

### Border Color

Use border color variables to manage all stroke colors in your designs across light and dark modes. You can use the same values for `ring-` and `outline-` as well (i.e. `ring-primary` `outline-secondary`).

| Name                   | Usage                                                                                                                                                                                   |
| :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| border-primary         | High contrast borders. These are used for components such as input fields, button groups, and checkboxes.                                                                               |
| border-secondary       | Medium contrast borders. This is the most commonly used border color and is the default for most components (e.g. file uploaders), cards (such as tables), and content dividers.        |
| border-secondary_alt   | An alternative to secondary border that uses alpha transparency. This is used exclusively for floating menus such as input dropdowns and notifications to create sharper bottom border. |
| border-tertiary        | Low contrast borders useful for very subtle dividers and borders such as line and bar chart axis dividers.                                                                              |
| border-disabled        | Default disabled border color for disabled states in components such as input fields and checkboxes.                                                                                    |
| border-disabled_subtle | A more subtle (lower contrast) alternative for disabled borders such as disabled buttons.                                                                                               |
| border-brand           | Default brand border color. Useful for active states in components such as input fields.                                                                                                |
| border-brand_alt       | An brand border color that switches to gray when in dark mode. Useful for components such as brand-style variants of banners and footers.                                               |
| border-error           | Default error state semantic border color. Useful for error states in components such as input fields and file uploaders.                                                               |
| border-error_subtle    | A more subtle (lower contrast) alternative for error state semantic borders such as error state input fields.                                                                           |

### Foreground Color

Use foreground color variables to manage all non-text foreground elements in your designs across light and dark modes. Can be used via `text-`, `bg-`, `ring-`, `outline-`, `stroke-`, `fill-`, etc.

| Name                   | Usage                                                                                                                                                         |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| fg-primary             | Highest contrast non-text foreground elements such as icons.                                                                                                  |
| fg-secondary           | High contrast non-text foreground elements such as icons.                                                                                                     |
| fg-secondary_hover     | Secondary foreground elements when in hover state.                                                                                                            |
| fg-tertiary            | Medium contrast non-text foreground elements such as icons.                                                                                                   |
| fg-tertiary_hover      | Tertiary foreground elements when in hover state.                                                                                                             |
| fg-quaternary          | Low contrast non-text foreground elements such as icons in buttons, help icons and icons used in input fields.                                                |
| fg-quaternary_hover    | Quaternary foreground elements when in hover state, such as help icons.                                                                                       |
| fg-white               | Foreground elements that are always white, regardless of the mode.                                                                                            |
| fg-disabled            | Default color for disabled non-text foreground elements such as icons in disabled button group buttons and input dropdown menu items.                         |
| fg-disabled_subtle     | A more subtle (lower contrast) alternative for non-text disabled foreground elements such as disabled active checkboxes and tag checkboxes.                   |
| fg-brand-primary       | Primary brand color non-text foreground elements such as featured icons and progress bars.                                                                    |
| fg-brand-primary_alt   | An alternative for primary brand color non-text foreground elements that switches to gray when in dark mode such as active horizontal tabs.                   |
| fg-brand-secondary     | Secondary brand color non-text foreground elements such as accents and arrows in marketing site sections (e.g. hero header sections).                         |
| fg-brand-secondary_alt | An alternative for secondary brand color non-text foreground elements that switches to gray when in dark mode such as brand buttons.                          |
| fg-error-primary       | Primary error state color for non-text foreground elements such as featured icons.                                                                            |
| fg-error-secondary     | Secondary error state color for non-text foreground elements such as icons in error state input fields and negative metrics item charts and icons.            |
| fg-warning-primary     | Primary warning state color for non-text foreground elements such as featured icons.                                                                          |
| fg-warning-secondary   | Secondary warning state color for non-text foreground elements.                                                                                               |
| fg-success-primary     | Primary success state color for non-text foreground elements such as featured icons.                                                                          |
| fg-success-secondary   | Secondary success state color for non-text foreground elements such as button dots, avatar online indicator dots, and positive metrics item charts and icons. |

### Background Color

Use background color variables to manage all fill colors for elements in your designs across light and dark modes.

| Name                    | Usage                                                                                                                                                                                         |
| :---------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bg-primary              | The primary background color (white) used across all layouts and components.                                                                                                                  |
| bg-primary_alt          | An alternative primary background color (white) that switches to bg-secondary when in dark mode.                                                                                              |
| bg-primary_hover        | Primary background hover color. This acts as the default hover state background color for components with white backgrounds (e.g. input dropdown menu items).                                 |
| bg-primary-solid        | The primary dark background color used across layouts and components. This switches to bg-secondary when in dark mode and is useful for components such as tooltips and Text editor tooltips. |
| bg-secondary            | The secondary background color used to create contrast against white backgrounds, such as website section backgrounds.                                                                        |
| bg-secondary_alt        | An alternative secondary background color that switches to bg-primary when in dark mode. Useful for components such as border-style horizontal tabs.                                          |
| bg-secondary_hover      | Secondary background hover color. Useful for hover states for components with gray-50 backgrounds such as active states (e.g. navigation items and date pickers).                             |
| bg-secondary_subtle     | An alternative secondary background color that is slightly lighter and more subtle in light mode. This is useful for components such as banners.                                              |
| bg-secondary-solid      | The secondary dark background color used across layouts and components. This is useful for components such as featured icons.                                                                 |
| bg-tertiary             | The tertiary background color used to create contrast against light backgrounds such as toggles.                                                                                              |
| bg-quaternary           | The quaternary background color used to create contrast against light backgrounds, such as sliders and progress bars.                                                                         |
| bg-active               | Default active background color for components such as selected menu items in input dropdowns.                                                                                                |
| bg-disabled             | Default disabled background color for components such as disabled primary buttons and toggles.                                                                                                |
| bg-disabled_subtle      | An alternative disabled background color that is more subtle. This is useful for components such as disabled input fields and checkboxes.                                                     |
| bg-overlay              | Default background color for background overlays. These are useful for overlay components such as modals.                                                                                     |
| bg-brand-primary        | The primary brand background color. Useful for components such as check icons.                                                                                                                |
| bg-brand-primary_alt    | An alternative primary brand background color that switches to bg-secondary when in dark mode. Useful for components such as active horizontal tabs.                                          |
| bg-brand-secondary      | The secondary brand background color. Useful for components such as featured icons.                                                                                                           |
| bg-brand-solid          | Default solid (dark) brand background color. Useful for components such as toggles and messages.                                                                                              |
| bg-brand-solid_hover    | Solid brand background color when in hover state. Useful for components such as toggles.                                                                                                      |
| bg-brand-section        | This is the default dark brand color background used for website sections such as CTA sections and testimonials. Switches to bg-secondary when in dark mode.                                  |
| bg-brand-section_subtle | An alternative brand section background color to provide contrast for website sections such as FAQ sections. Switches to bg-primary when in dark mode.                                        |
| bg-error-primary        | Primary error state background color for components such as buttons.                                                                                                                          |
| bg-error-secondary      | Secondary error state background color for components such as featured icons.                                                                                                                 |
| bg-error-solid          | Default solid (dark) error state background color for components such as buttons, featured icons and metric items.                                                                            |
| bg-error-solid_hover    | Default solid (dark) error hover state background color for components such as buttons.                                                                                                       |
| bg-warning-primary      | Primary warning state background color for components.                                                                                                                                        |
| bg-warning-secondary    | Secondary warning state background color for components such as featured icons.                                                                                                               |
| bg-warning-solid        | Default solid (dark) warning state background color for components such as featured icons.                                                                                                    |
| bg-success-primary      | Primary success state background color for components.                                                                                                                                        |
| bg-success-secondary    | Secondary success state background color for components such as featured icons.                                                                                                               |
| bg-success-solid        | Default solid (dark) success state background color for components such as featured icons and metric items.                                                                                   |

### RelayKit-only token additions (wired in `/prototype`, not in upstream tables)

These tokens are defined in `prototype/app/globals.css` but don't appear in the upstream tables above. They are part of the canonical RelayKit token set.

| Name                            | Wired value (light mode)             | Usage                                                                                                            |
| :------------------------------ | :----------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| focus-ring                      | `var(--color-brand-500)`             | Focus-ring color used via `ring-focus-ring` / `outline-focus-ring`. Brand-aware focus indicator.                 |
| featured-icon-light-fg-brand    | `var(--color-brand-600)`             | Foreground color for brand-themed featured icons (light variant).                                                |
| featured-icon-light-fg-gray     | `var(--color-gray-500)`              | Foreground color for neutral featured icons (light variant).                                                     |
| featured-icon-light-fg-error    | `var(--color-error-600)`             | Foreground color for error featured icons (light variant).                                                       |
| featured-icon-light-fg-warning  | `var(--color-warning-600)`           | Foreground color for warning featured icons (light variant).                                                     |
| featured-icon-light-fg-success  | `var(--color-success-600)`           | Foreground color for success featured icons (light variant).                                                     |

> **No dark-mode variants today.** `globals.css` declares the `light` token set only — no `@media (prefers-color-scheme: dark)` block, no `.dark` class. Dark mode is not wired in `/prototype`. Upstream tokens that switch behavior in dark mode (`*_alt`, `*_on-brand` variants) are not applicable until dark mode is added.
