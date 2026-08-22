# Meridian — Design System & Visual Architecture Specification

> **Platform Purpose**: AI-Powered Student Career Intelligence & Placement Command Center  
> **Audience**: Ambitious, technical, momentum-driven university students (engineering & computer science)  
> **Aesthetic Archetype**: *Precise Engineering Terminal meets High-Momentum Aerospace/Foundry UI* (clean geometric discipline, deliberate optical weights, subtle structural gridlines, high data density without clutter).

---

## 1. Color System & Semantic Tokens

We strictly avoid the three default AI tropes:
1. *Warm cream (`#F4F1EA`) + terracotta (`#D97757`)* — too editorial/literary for an engineering career OS.
2. *Pure `#000` + single neon acid green/cyan* — too gamey/cyberpunk, lacks corporate placement credibility.
3. *Zero-radius broadsheet newspaper style* — unsuited for interactive dashboards and data telemetry.

Instead, we utilize a **Deep Slate & Technical Azure** palette:
- **Base Canvas**: Crisp Cool Slate (Light: `#F8FAFC`, Dark: `#0B0F19`)
- **Primary Accent**: Precision Electric Indigo (`#4F46E5` / `#6366F1`)
- **AI Signature Accent**: Prismatic Violet-Cyan Hybrid (`#7C3AED` to `#06B6D4` gradient / glow)
- **Surfaces**: Layered elevation tokens with calculated contrast ratios rather than raw black/white.

### Token Matrix

| Token Name | Light Mode | Dark Mode | Semantic Purpose |
|---|---|---|---|
| `--color-bg-canvas` | `#F8FAFC` (Slate 50) | `#0B0F19` (Deep Void Slate) | Page background |
| `--color-bg-surface` | `#FFFFFF` (Pure White) | `#111827` (Slate 900) | Standard container surface |
| `--color-bg-surface-elevated`| `#F1F5F9` (Slate 100) | `#1E293B` (Slate 800) | Hover states, modals, popovers |
| `--color-border-subtle` | `#E2E8F0` (Slate 200) | `#1F2937` (Slate 800) | Structural dividers & rules |
| `--color-border-strong` | `#CBD5E1` (Slate 300) | `#374151` (Slate 700) | Active inputs, selected states |
| `--color-text-primary` | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) | Primary titles, scores, headings |
| `--color-text-secondary` | `#475569` (Slate 600) | `#94A3B8` (Slate 400) | Body copy, descriptions |
| `--color-text-muted` | `#94A3B8` (Slate 400) | `#64748B` (Slate 500) | Labels, timestamps, hints |
| `--color-accent-primary` | `#4F46E5` (Indigo 600) | `#6366F1` (Indigo 500) | Primary buttons, active nav pill |
| `--color-accent-ai` | `#7C3AED` (Violet 600) | `#A855F7` (Purple 500) | AI badges, Gemini insights, Next Best Action |
| `--color-ai-glow` | `rgba(124, 58, 237, 0.08)` | `rgba(168, 85, 247, 0.15)` | AI container highlight backdrop |
| `--color-success` | `#059669` (Emerald 600)| `#10B981` (Emerald 500)| Target met, milestones completed |
| `--color-warning` | `#D97706` (Amber 600)  | `#F59E0B` (Amber 500)  | High-priority gaps, tight deadlines |
| `--color-danger` | `#DC2626` (Red 600)    | `#EF4444` (Red 500)    | Critical missing skills, low attendance |

---

## 2. Typography & Scale Hierarchy

### Typeface Selection
1. **Display / Heading**: `Plus Jakarta Sans` / `Inter Display` — geometric, modern, high x-height, confident.
2. **Body & Interface**: `Inter` — supreme legibility at 11–14px, exceptional numerical clarity.
3. **Data / Metric / Code**: `JetBrains Mono` / `Geist Mono` — tabular numbers, scores, Big-O notations, code snippets.

### Scale Hierarchy
| Level | Font Size | Line Height | Weight | Tracking | Usage |
|---|---|---|---|---|---|
| **Display 1** | `36px` (`2.25rem`) | `1.15` | `800` (Extrabold) | `-0.03em` | Primary readiness score, hero metric |
| **H1** | `24px` (`1.5rem`) | `1.2` | `700` (Bold) | `-0.02em` | Main section headings |
| **H2** | `18px` (`1.125rem`)| `1.3` | `700` (Bold) | `-0.01em` | Subsection titles, modal headers |
| **H3 / Title** | `14px` (`0.875rem`)| `1.4` | `600` (Semibold)| `0` | Card headers, question prompts |
| **Body Regular**| `13px` (`0.8125rem`)| `1.5` | `400` / `500` | `0` | General descriptive text |
| **Caption** | `11px` (`0.6875rem`)| `1.4` | `500` (Medium) | `+0.01em` | Helper hints, metadata, tags |
| **Data Monospace**| `12px` (`0.75rem`)| `1.3` | `600` (Semibold)| `0` | Timestamps, marks, percentages, code |

---

## 3. Spacing, Radius & Elevation Scale

### Spacing Scale (4px Base Grid)
- `2xs`: `4px` | `xs`: `8px` | `sm`: `12px` | `md`: `16px` | `lg`: `24px` | `xl`: `32px` | `2xl`: `48px`

### Corner Radius System
- `rounded-xs`: `4px` — micro badges, tags, code snippets
- `rounded-sm`: `8px` — inputs, table row highlights, buttons
- `rounded-md`: `12px` — interactive control panels, dialogs
- `rounded-lg`: `16px` — primary hero surfaces, readiness containers
- `rounded-full`: `9999px` — pills, status dots, circular rings

### Elevation / Shadow Tokens (Restrained, Not Pervasive)
- `elevation-subtle`: `0 1px 2px 0 rgba(0, 0, 0, 0.04)` (Clean surface separation)
- `elevation-interactive`: `0 4px 12px -2px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.03)` (Hover on interactive items)
- `elevation-ai`: `0 0 20px -3px rgba(124, 58, 237, 0.15)` (Dedicated AI highlight aura)

---

## 4. Visual Form Mapping (§1 Compliance)

We strictly eliminate the "everything is a card" anti-pattern:

| Data Entity | Previous Anti-Pattern | New Native Form |
|---|---|---|
| **Career Readiness (85/100)** | Plain rectangular box with text | Dual-track concentric **SVG Radial Ring Meter** with animated stroke offset and status telemetry |
| **Roadmap Stages (Sem 5)** | 7 large individual cards | **Continuous Linear Timeline Rail** with status nodes (`completed` ✓, `active` pulse, `upcoming` hollow) |
| **Skill Competency (You vs. Target)** | 6 nested cards | **Paired Horizon Delta Bars** with target benchmarks overlaid on current mastery levels |
| **Study Time Progression** | Generic thick bar chart | **Micro-Sparkline & Slim Rounded Pillar Track** with custom time tooltips |
| **AI Next Best Action** | Standard message card | **Signature AI Radiant Panel** with violet/cyan boundary sheen and prominent direct CTA |
| **Semester Subjects & Grades** | Scattered cards | **Compact Engineered Gradebook Table** with integrated attendance safe-zone meters |
| **Pomodoro Focus Timer** | Rectangular countdown card | **Circular SVG Progress Stopwatch** with session telemetry and quick tactile controls |

---

## 5. Signature Product Element

**The "Orbital Readiness Ring & AI Beam"**:
1. **The Orbital Readiness Ring**: An SVG telemetry circle featuring dual-band depth (background track, foreground gradient stroke), accompanied by a real-time delta badge (`+0.2 vs Sem 4`) and direct industry percentile rank.
2. **The AI Beam Header**: Any surface containing active generative AI synthesis (e.g. Next Best Action, Skill Gap Intelligence, Interview Feedback) features a distinct `1px` subtle gradient border (`linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(168, 85, 247, 0.4))`) and a pulsing live status dot (`● Gemini 3.6 Connected`).

---

## 6. Self-Critique & Divergence from AI Defaults

- **Did we use warm cream / terracotta?** No. Used cool high-clarity slate (`#0B0F19` / `#F8FAFC`).
- **Did we use pure black `#000` + harsh neon?** No. Used layered `#111827` / `#1E293B` surfaces with refined Indigo/Violet accents.
- **Did we keep generic rectangular cards everywhere?** No. Mapped each data type to timelines, telemetry rings, paired delta bars, dense gradebook tables, and signature AI panels.
- **Is the dark mode an afterthought?** No. Explicit token pairings defined for both modes with matching contrast ratios and elevation separation.
