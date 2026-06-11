# 07_DESIGN_SYSTEM.md — PISE Mentorship Portal MVP

## 1. Purpose

This document defines the visual direction, component patterns, interaction style, typography, color tokens, and copy tone for the PISE Mentorship Portal MVP.

Use this document after reading:

```text
01_PRD.md
02_MVP_FUNCTIONAL_SPEC.md
03_DATA_MODEL.md
04_UI_FLOW.md
```

This file helps Claude Code understand:

* how the portal should look and feel,
* how pages should be visually structured,
* how mentor cards should look,
* how filters should behave,
* how forms should be presented,
* how buttons, tags, cards, states, and status badges should be styled.

This document should guide UI implementation.

Do not copy another platform’s UI directly.

Use:

* PISE website as the brand reference,
* ADPList as a mentoring interaction reference,
* this document as the implementation source of truth for the portal UI.

---

## 2. Design Goal

The PISE Mentorship Portal should feel like a warm, trusted, youth-led mentorship space.

It should help mentees feel:

* welcomed,
* guided,
* less overwhelmed,
* confident to explore mentors,
* prepared before booking.

It should help mentors feel:

* respected,
* in control of their own profile,
* clear about what information to provide,
* supported by PISE admins.

It should help admins feel:

* clear about mentor readiness,
* able to review and publish mentors quickly,
* not forced to manage a heavy dashboard.

The portal should not feel like:

* a corporate HR system,
* a cold SaaS admin console,
* a generic marketplace,
* a complex booking product,
* a social network.

---

## 3. Brand Foundation

## 3.1 PISE Brand Feeling

The portal should feel connected to PISE:

* warm,
* youth-led,
* community-driven,
* empathetic,
* hopeful,
* accessible,
* grounded,
* impact-oriented.

PISE is not just a booking platform. The portal should carry the feeling of mentorship, opportunity access, youth development, and community impact.

## 3.2 Brand Keywords

Use these keywords to guide design choices:

```text
Warm
Accessible
Youthful
Grounded
Empathetic
Clear
Community-driven
Growth-oriented
Impactful
Supportive
```

## 3.3 Product Personality

The portal should feel:

* supportive, not transactional,
* structured, not overwhelming,
* credible, not overly formal,
* modern, not flashy,
* personal, not generic,
* calm, not noisy.

---

## 4. External References

## 4.1 PISE Website as Brand Reference

Use the PISE website as the primary brand reference.

Borrow these principles:

* youth empowerment,
* community impact,
* opportunity access,
* leadership development,
* warm storytelling,
* mission-driven language.

Do not over-modernize the portal until it loses the PISE feeling.

The portal should feel like a natural extension of PISE, not a separate SaaS product.

## 4.2 ADPList as Interaction Reference

Use ADPList only as an interaction reference for:

* mentor discovery,
* browsing mentors by expertise,
* browsing mentors by location or relevant criteria,
* clear profile-first exploration,
* action-oriented mentor marketplace structure,
* easy path from mentor discovery to booking.

Do not copy:

* ADPList’s exact visual design,
* exact layout,
* exact branding,
* exact copy,
* exact component styling.

Translate the useful mentoring interaction patterns into a simpler PISE version.

---

## 5. Visual Direction

## 5.1 Overall Look

Use a clean, soft, editorial layout.

Recommended style:

* light warm background,
* white content surfaces,
* rounded cards,
* readable typography,
* generous spacing,
* soft borders,
* clear CTAs,
* subtle visual hierarchy.

Avoid:

* dark enterprise dashboard look,
* excessive gradients,
* heavy shadows,
* dense tables on mentee-facing pages,
* flashy animations,
* overly corporate blue SaaS style,
* too many colors.

## 5.2 UI Mood

The UI should feel:

```text
Warm but not childish
Clean but not sterile
Modern but not trendy
Structured but not rigid
Friendly but still credible
```

## 5.3 Brand Application Rule

When making a design decision, choose the option that makes the portal feel:

```text
more human
more supportive
more readable
more focused
more connected to PISE
```

Do not choose visual complexity just to make the UI look more “designed”.

---

## 6. Color Tokens

Use these colors consistently across the MVP.

Claude Code should define these values in Tailwind configuration or a shared theme file.

Do not use random one-off hex values inside components unless necessary.

## 6.1 Primary Palette

Primary color should feel warm, optimistic, and action-oriented.

```text
primary.50  = #FFF7ED
primary.100 = #FFEDD5
primary.200 = #FED7AA
primary.500 = #F97316
primary.600 = #EA580C
primary.700 = #C2410C
```

Usage:

* primary CTA buttons,
* active filter chips,
* important highlights,
* key action states,
* warm section accents.

## 6.2 Secondary Palette

Secondary color should feel grounded, growth-oriented, and community-oriented.

```text
secondary.50  = #ECFDF5
secondary.100 = #D1FAE5
secondary.500 = #10B981
secondary.600 = #059669
secondary.700 = #047857
```

Usage:

* supportive emphasis,
* complete profile status,
* published status,
* soft community/growth accents,
* secondary tags when needed.

## 6.3 Neutral Palette

Use warm neutrals instead of cold grays.

```text
neutral.50  = #FAFAF9
neutral.100 = #F5F5F4
neutral.200 = #E7E5E4
neutral.300 = #D6D3D1
neutral.400 = #A8A29E
neutral.500 = #78716C
neutral.600 = #57534E
neutral.800 = #292524
neutral.900 = #1C1917
```

Usage:

* page background,
* card borders,
* body text,
* helper text,
* muted UI,
* dividers.

## 6.4 Warning Palette

Use warning colors for incomplete, unpublished, or needs-review states.

```text
warning.50  = #FEFCE8
warning.100 = #FEF9C3
warning.500 = #EAB308
warning.600 = #CA8A04
warning.700 = #A16207
```

Usage:

* incomplete mentor profile,
* unpublished mentor profile,
* non-standard Calendly URL warning,
* profile needs review.

## 6.5 Error Palette

Use error colors only for real errors.

```text
error.50  = #FEF2F2
error.100 = #FEE2E2
error.500 = #EF4444
error.600 = #DC2626
error.700 = #B91C1C
```

Usage:

* invalid URL,
* unauthorized access,
* failed save,
* destructive actions only when necessary.

Do not overuse red.

---

## 7. Semantic Color Tokens

Use semantic tokens in components instead of raw color names where possible.

## 7.1 Background

```text
background.page    = neutral.50
background.surface = #FFFFFF
background.subtle  = primary.50
background.soft    = neutral.100
```

## 7.2 Text

```text
text.primary   = neutral.900
text.secondary = neutral.600
text.muted     = neutral.500
text.inverse   = #FFFFFF
```

## 7.3 Borders

```text
border.default = neutral.200
border.strong  = neutral.300
border.focus   = primary.600
```

## 7.4 Buttons

```text
button.primary.bg      = primary.600
button.primary.hover   = primary.700
button.primary.text    = #FFFFFF

button.secondary.bg     = #FFFFFF
button.secondary.border = neutral.200
button.secondary.hover  = neutral.100
button.secondary.text   = neutral.800

button.ghost.bg    = transparent
button.ghost.hover = neutral.100
button.ghost.text  = neutral.700
```

## 7.5 Status

```text
status.success.bg     = secondary.50
status.success.text   = secondary.700
status.success.border = secondary.100

status.warning.bg     = warning.50
status.warning.text   = warning.700
status.warning.border = warning.100

status.error.bg       = error.50
status.error.text     = error.700
status.error.border   = error.100

status.neutral.bg     = neutral.100
status.neutral.text   = neutral.700
status.neutral.border = neutral.200
```

---

## 8. Typography

## 8.1 Primary Font

Use:

```text
Inter
```

Fallback:

```text
system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

Reason:

* Inter is highly readable for UI.
* Inter works well for both English and Vietnamese UI content.
* Inter supports Vietnamese diacritics when the correct font subset is loaded.

## 8.2 Vietnamese Rendering Rule

The portal may contain Vietnamese and English text.

When implementing Inter, ensure Vietnamese characters render correctly.

Test with this sentence:

```text
PISE giúp mentee tìm đúng mentor, chuẩn bị câu hỏi, và đặt lịch mentorship qua Calendly.
```

Check that these characters render cleanly:

```text
ă â ê ô ơ ư đ
á à ả ã ạ
ấ ầ ẩ ẫ ậ
ắ ằ ẳ ẵ ặ
ế ề ể ễ ệ
ố ồ ổỗộ
ớ ờ ở ỡ ợ
ứ ừửữự
```

If Vietnamese rendering looks broken, inconsistent, or falls back strangely, fix the font loading setup.

## 8.3 Font Loading Rule

Recommended implementation:

* use Inter from `next/font/google` if available,
* include Vietnamese subset if required by the implementation,
* fall back to system sans-serif.

Do not use decorative fonts for functional UI.

Do not use Geist as primary font unless Vietnamese rendering is manually tested.

## 8.4 Font Scale

Use a simple type scale.

```text
text-xs   = 12px
text-sm   = 14px
text-base = 16px
text-lg   = 18px
text-xl   = 20px
text-2xl  = 24px
text-3xl  = 30px
text-4xl  = 36px
```

## 8.5 Typography Usage

### Page Title

```text
font-size: text-3xl or text-4xl
font-weight: 700
line-height: 1.15
color: text.primary
```

Use for:

* Home page title,
* Mentor list page title,
* Mentor profile title,
* Admin page title.

### Section Title

```text
font-size: text-xl or text-2xl
font-weight: 600
line-height: 1.25
color: text.primary
```

Use for:

* What I can help with,
* Suggested topics,
* Booking instructions,
* Admin form sections.

### Card Title

```text
font-size: text-lg
font-weight: 600
line-height: 1.3
color: text.primary
```

Use for:

* Mentor name,
* Admin card title,
* Empty state title.

### Body Text

```text
font-size: text-base
font-weight: 400
line-height: 1.6
color: text.secondary
```

Use for:

* mentor bio,
* profile content,
* helper description.

### Helper Text

```text
font-size: text-sm
font-weight: 400
line-height: 1.5
color: text.secondary
```

Use for:

* form helper text,
* page helper text,
* empty state description.

### Label Text

```text
font-size: text-sm
font-weight: 500
line-height: 1.4
color: text.primary
```

Use for:

* form labels,
* filter group labels,
* admin table labels.

---

## 9. Layout Principles

## 9.1 Page Width

Use a centered max-width container.

Recommended:

```text
max-width: 1120px or 1200px
horizontal padding: 16px mobile, 24px tablet, 32px desktop
```

## 9.2 Section Spacing

Use generous spacing between sections.

Recommended:

```text
page top spacing: 32–48px
section spacing: 32px
card gap: 16–24px
form field gap: 16px
```

## 9.3 Grid System

For mentor cards:

```text
desktop: 2–3 columns
tablet: 2 columns
mobile: 1 column
```

Do not build complex masonry layouts.

## 9.4 Page Structure Pattern

Most pages should follow this structure:

```text
Header
Page title
Short helper text
Primary content
Empty/loading/error states if needed
```

Keep hierarchy obvious.

---

## 10. Navigation Pattern

## 10.1 Header

Use a simple top header.

Header should include:

* PISE wordmark or logo,
* role-based navigation,
* logout action.

## 10.2 Navigation by Role

Mentee:

```text
Home
Mentors
Feedback
```

Mentor:

```text
Home
Mentors
My Profile
Feedback
```

Admin:

```text
Home
Mentors
Admin
Feedback
```

Feedback is an external link, not an internal route.

## 10.3 Mobile Navigation

For MVP, use the simplest responsive solution:

* allow nav links to wrap,
* stack nav links,
* or use a basic menu from UI library.

Do not spend time building a complex custom mobile navigation system.

---

## 11. Component Pattern: Buttons

## 11.1 Button Types

Use these button variants:

```text
Primary Button
Secondary Button
Ghost Button
Destructive Button
External Link Button
```

## 11.2 Primary Button

Use for main actions:

* Browse mentors,
* View Profile,
* Book via Calendly,
* Save profile,
* Publish mentor.

Style direction:

```text
background: button.primary.bg
text: button.primary.text
hover: button.primary.hover
border radius: 12px
font weight: 600
height: 40–44px
```

## 11.3 Secondary Button

Use for supportive actions:

* Clear filters,
* Save draft,
* Back to list.

Style direction:

```text
background: button.secondary.bg
border: button.secondary.border
text: button.secondary.text
hover: button.secondary.hover
border radius: 12px
height: 40–44px
```

## 11.4 Ghost Button

Use for low-priority actions:

* Back,
* Cancel,
* View details.

## 11.5 Destructive Button

Use only for risky actions:

* Unpublish mentor,
* deactivate user if ever built.

Do not overuse red.

## 11.6 External Link Button

Use for:

* Book via Calendly,
* Submit session feedback.

Behavior:

* opens in new tab,
* visually indicates external action if simple.

---

## 12. Component Pattern: Cards

## 12.1 General Card Style

Cards should feel soft and readable.

Recommended style:

```text
background: background.surface
border: 1px solid border.default
border radius: 16–24px
padding: 20–24px
shadow: none or very subtle
```

Avoid heavy SaaS card shadows.

## 12.2 Mentor Card

Mentor card should help mentees quickly answer:

```text
Who is this mentor?
What do they do?
What can they help me with?
Are they relevant to me?
```

Show:

* avatar/photo,
* name,
* current role/title,
* location tags,
* discipline tags,
* industry tags,
* support area tags,
* short bio,
* View Profile button.

Do not make card too dense.

Do not show full profile content on card.

## 12.3 Mentor Card Layout

Recommended layout:

```text
Avatar + name + role
Short bio
Tag groups
View Profile CTA
```

On mobile, everything stacks vertically.

## 12.4 Admin Status Card

Use simple status cards for:

* Complete / Incomplete,
* Published / Unpublished,
* Valid link / Missing link / Check link,
* Linked / Not linked.

Keep status labels short.

---

## 13. Component Pattern: Tags and Chips

## 13.1 Tag Usage

Use tags for:

* locations,
* disciplines,
* industries,
* support areas,
* status labels.

## 13.2 Tag Style

Recommended style:

```text
small rounded pill
subtle background
medium text contrast
compact padding
font-size: text-xs or text-sm
```

## 13.3 Tag Groups

Group tags by meaning when needed:

```text
Location
Disciplines
Industries
Support areas
```

On mentor cards, show only enough tags to communicate fit.

Do not let tags dominate the card.

## 13.4 Selected Filter Chips

Selected filters should be visually clear.

Pattern:

```text
selected chip = filled or stronger border
unselected chip = subtle border
clear all = small secondary action
```

---

## 14. Component Pattern: Filters

## 14.1 Filter Groups

Required filter groups:

* Location,
* Disciplines,
* Industries.

Do not build support area filtering in MVP.

Support areas are display tags only.

## 14.2 Filter Interaction

Use simple multi-select chips or checkboxes.

Behavior:

* user can select multiple values per group,
* OR logic within group,
* AND logic across groups,
* selected filters are visible,
* user can clear one selected filter,
* user can clear all filters.

## 14.3 Filter Layout

Desktop:

```text
filters above mentor grid or in a simple left section
```

Mobile:

```text
filters stack above mentor list
```

Do not build advanced filter drawer unless already easy with UI library.

---

## 15. Component Pattern: Mentor Profile Page

## 15.1 Goal

The mentor profile page should help mentees decide whether to book.

It should feel like reading a short, useful profile rather than filling a transaction form.

## 15.2 Layout

Recommended structure:

```text
Profile header
Key tags
What I can help with
Good fit for
Suggested topics
Booking instructions
Book via Calendly CTA
Feedback link
```

## 15.3 Profile Header

Show:

* avatar/photo,
* mentor name,
* current role/title,
* short bio,
* key tags,
* Book via Calendly CTA.

## 15.4 Section Style

Each section should be clearly separated but not too heavy.

Use:

* section headings,
* short paragraphs,
* bullet lists where useful.

Do not create overly long profile pages.

---

## 16. Component Pattern: Mentor Profile Management Form

## 16.1 Goal

The mentor profile management form should help mentors complete their profile without feeling overwhelmed.

## 16.2 Form Structure

Break the form into clear sections:

```text
Profile status
Basic information
Discovery attributes
Profile content
Booking information
Save action
```

## 16.3 Profile Status Card

Show:

* Published / Unpublished,
* Complete / Incomplete,
* missing required fields,
* short explanation that admin controls publishing.

Recommended copy:

```text
Complete the required fields so PISE can review and publish your profile.
```

## 16.4 Form Interaction

Use:

* clear labels,
* helper text for complex fields,
* textarea for longer answers,
* simple multi-select chips for categories,
* visible save button.

Avoid:

* multi-step wizard,
* autosave,
* complex approval workflow,
* rich text editor.

## 16.5 Field Helper Copy

For “What I can help with”:

```text
Describe the topics or situations where you can support mentees.
```

For “Suitable mentee profile”:

```text
Describe who would benefit most from talking with you.
```

For “Suggested topics”:

```text
Share a few questions or topics mentees can prepare before booking.
```

For “Calendly URL”:

```text
Paste the booking link you want mentees to use.
```

---

## 17. Component Pattern: Admin Mentor Management

## 17.1 Goal

Admin UI should help PISE answer:

```text
Which mentor profiles are ready?
Which profiles are incomplete?
Which mentors are visible to mentees?
Which profiles need follow-up?
```

## 17.2 Admin Mentor List

Use a simple table or card list.

Show:

* mentor name,
* linked mentor user status,
* completeness status,
* Calendly URL status,
* published status,
* last updated,
* actions.

## 17.3 Admin Edit Form

Use the same basic form structure as mentor profile management, plus admin-only fields:

```text
Linked mentor user
Slug
Publish/unpublish controls
```

## 17.4 Admin Actions

Use:

* Save draft,
* Publish,
* Unpublish.

Do not build:

* approval workflow,
* comment thread,
* version history,
* admin analytics.

---

## 18. Component Pattern: Empty, Loading, Error, Warning States

## 18.1 Empty State

Empty states should be human and helpful.

Example:

```text
No mentors match your current filters.
Try removing one filter or browsing all mentors.
```

Use an action when helpful:

```text
Clear filters
```

## 18.2 Loading State

Use simple skeletons or loading text.

Do not build complex animated loaders.

## 18.3 Error State

Errors should be clear and actionable.

Example:

```text
Something went wrong. Please try again.
```

## 18.4 Warning State

Use warning states for:

* incomplete profile,
* unpublished profile,
* non-standard Calendly URL.

Example:

```text
This link does not look like a standard Calendly URL. Please double-check before saving.
```

---

## 19. Interaction Principles

## 19.1 Mentor Discovery

The discovery experience should feel guided, not overwhelming.

Use:

* clear filters,
* scannable mentor cards,
* plain-language labels,
* profile-first booking.

Do not push mentees to book before they understand mentor fit.

## 19.2 Booking

Calendly booking should be treated as an external action.

Pattern:

```text
Book via Calendly
→ open external link in new tab
```

Do not show booking confirmation inside the portal.

## 19.3 Feedback

Feedback should be treated as an external action.

Pattern:

```text
Submit session feedback
→ open external form in new tab
```

Do not build feedback submission UI.

## 19.4 Publishing

Publishing should be controlled by admin only.

Pattern:

```text
Mentor completes profile
→ Admin reviews completeness
→ Admin publishes
```

Mentor should see status but not publish button.

---

## 20. Responsive Design Rules

## 20.1 Mobile

On mobile:

* stack mentor cards,
* stack form sections,
* stack filters,
* keep buttons full-width when useful,
* avoid dense tables.

## 20.2 Desktop

On desktop:

* use card grids for mentor list,
* use wider forms with readable sections,
* keep profile content centered and readable.

## 20.3 Admin Tables

If table is hard on mobile, use stacked cards.

Do not overbuild complex responsive tables.

---

## 21. Accessibility Rules

The UI should be accessible by default.

Use:

* semantic HTML,
* keyboard-accessible buttons and links,
* visible focus states,
* sufficient color contrast,
* clear labels for form fields,
* descriptive button text.

Do not rely on color alone for status.

Status should use both text and visual style.

Example:

```text
Incomplete
Published
Missing link
```

---

## 22. Implementation Rules for Claude Code

When implementing UI:

1. Follow `04_UI_FLOW.md` for screen behavior.
2. Follow this file for visual and interaction patterns.
3. Use Inter as the primary font.
4. Make sure Vietnamese text renders correctly.
5. Use the color tokens defined in this file.
6. Do not invent additional routes.
7. Do not build image upload.
8. Do not build support area filter.
9. Do not build admin user management UI.
10. Do not build in-app feedback UI.
11. Do not build native booking UI.
12. Use reusable components, but do not over-abstract.
13. Keep mentor-facing UI simple and encouraging.
14. Keep admin UI functional and minimal.
15. Use clear empty, loading, error, and warning states.
16. Preserve PISE’s warm, community-driven brand feeling.

---

## 23. Component Completion Checklist

The design system is applied correctly when:

* pages feel warm, clear, and connected to PISE,
* Inter renders Vietnamese and English text correctly,
* color usage is consistent across components,
* mentor browsing feels simple and guided,
* mentor cards clearly communicate fit,
* mentor profile page helps mentees decide before booking,
* Calendly CTA is obvious but external,
* mentor profile form feels manageable,
* admin mentor management is simple and practical,
* tags and filters are consistent,
* states are clear and helpful,
* mobile layout is readable,
* no unnecessary UI complexity is added.
