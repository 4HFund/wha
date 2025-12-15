# Luau Manor Resident Hub — Accessibility-First Redesign Plan

## 1️⃣ Homepage Redesign Plan
- **Improved headline:** “Luau Manor Resident Hub” → Subhead: “Quick help for repairs, concerns, and paperwork—no login needed.”
- **Plain-language explainer (1–2 sentences):** “Use this site to request maintenance, share a concern, or ask for documents. Your message goes straight to the Luau Manor office.”
- **Recommended section order (top to bottom):**
  1. Hero with headline, subhead, and three large action buttons (Maintenance, Concern, Documents) plus phone numbers.
  2. "What you can do here" (short cards for the three actions with one-sentence descriptions).
  3. "How it works" steps (3 bullets with icons/numbers).
  4. Announcements/Notices (one-line alerts, printable flyers links).
  5. Upcoming events / calendar highlights.
  6. Helpful documents and policies (handbook, pet policy, move-in files).
  7. Resident Council & Resident of the Month (community items).
  8. Footer with reassurances and contact numbers.

## 2️⃣ Navigation Structure
- **Simplified menu:**
  - Home
  - Maintenance
  - Concerns
  - Documents (dropdown: Request Documents, Handbook, Policies, Pet Policy/Forms)
  - Community (dropdown: Events, Resident Council, Resident of the Month)
- **Mobile-first pattern:** Use a single “Menu” button on small screens that expands a vertical list with large tap targets.
- **Sticky header:** Keep the header pinned with a subtle shadow; ensure reduced height (60–68px) and prominent “Call now” quick link on mobile.
- **State cues:** Use a strong focus ring and high-contrast hover for links; keep the current page highlighted with a bold outline.

## 3️⃣ Calls-to-Action
- **Top 3 actions:** Submit Maintenance, Report a Concern, Request Documents.
- **Button text (plain language):**
  - Maintenance: “🛠️ Start a Maintenance Request”
  - Concern: “🔔 Share a Concern (can be anonymous)”
  - Documents: “📄 Ask for Paperwork”
- **Button styling:**
  - Size: Minimum 48px height with 18–20px text; full-width on mobile, medium width on desktop.
  - Colors: Primary lagoon teal (#0e9aa6) for Maintenance, warm coral (#f76b6a) for Concerns, calm sand outline (#f2e7d5) with teal text for Documents.
  - Placement: Group together in the hero; repeat as secondary buttons under each card for clarity.

## 4️⃣ Visual Style Guide
- **Fonts (web-safe/lightweight):** Headings: "Trebuchet MS" or "Verdana"; Body: "Arial", sans-serif. Keep letter spacing relaxed for readability.
- **Color palette (calm, tropical-inspired, high contrast):**
  - Lagoon Teal: #0e9aa6 (primary buttons, links)
  - Coral Sunset: #f76b6a (alerts, secondary buttons)
  - Warm Sand: #f2e7d5 (background blocks, dividers)
  - Deep Reef: #0f1f38 (headings/text)
  - Cloud White: #ffffff (cards) with muted text #4a5668
- **Spacing:** 24px top/bottom section padding; 16px card padding; 12–16px gutters on mobile. Use 16px between form fields and 12px between labels and inputs.
- **Dividers:** Soft sand-colored lines (#e9ddc7) or 12px vertical whitespace instead of harsh rules; keep sections visually separated with background shifts.

## 5️⃣ Accessibility Improvements
- **Font sizes:** Body text 18px minimum; headings 24–32px; buttons 18–20px. Maintain a 1.6 line height.
- **Contrast:** Ensure text-to-background contrast at least 4.5:1; buttons should meet 3:1 against their background; avoid light text on gradients.
- **Keyboard use:**
  - All navigation and dropdowns operable via keyboard with visible focus outlines (3px teal ring, 2px offset).
  - Skip-to-content link at the top for screen readers/keyboard users.
  - Form inputs should have programmatically associated labels, helper text, and clear error states.
- **Screen readers:**
  - Use descriptive aria-labels on nav toggles (“Open menu”, “Close menu”).
  - Provide live region for confirmation messages (“Request sent. We’ll contact you soon.”).
  - Announcements section should be a list with headings for quick navigation.

## 6️⃣ Content Improvements
- **Plain-language rewrites:**
  - “Concerns” intro → “Tell us about noise, safety, or neighbor issues. You can stay anonymous.”
  - “Documents” intro → “Ask for letters, ledgers, or forms. Choose email, print, or pickup.”
  - “Policies” intro → “Key rules about guests, inspections, and pets. The handbook has full details.”
- **Reassurance micro-copy:**
  - Under each form button: “This message goes directly to the Luau Manor office.”
  - Near anonymous option: “You can leave your name blank; we still review every report.”
  - Near phone numbers: “If you prefer talking, call us. We’re happy to help.”
- **Clarity for emergencies:** “For life-threatening emergencies, call 911 first. For urgent building issues, use Emergency Maintenance.”

## 7️⃣ Optional Enhancements (Low-Risk)
- **Announcements strip:** A simple, dismissible banner for water shutoffs, elevator updates, or holiday hours; printable flyer link when relevant.
- **Resident spotlight:** Small card featuring a Resident of the Month photo and quote; rotates monthly without login.
- **Simple calendar/notice board:** Static list of upcoming events with date badges; allow PDF flyers for printing. Keep to plain HTML lists for performance.

## 8️⃣ Page Templates (static-friendly)
- **Hero block:** Single column on mobile with stacked buttons and phone numbers; two columns on desktop.
- **Cards grid:** Responsive 1–2 columns on mobile, 3 columns on desktop; large touch targets.
- **Forms:** One question per line with large labels, helper text, and optional hint icons; include progress cues like “Step 1 of 3”.

## 9️⃣ Tone & Voice
- Warm, respectful, and calm. Use “you” and “we” language. Avoid acronyms unless defined. Keep sentences under 18 words when possible.
