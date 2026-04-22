# 📄 Winsome — MVP PRD (Simplified Version)

---

# 1. 🧠 Product Overview

**Product Name:** Winsome
**Type:** Mobile App (UI-first MVP)

**Vision:**
Winsome is a chat-based interface where users interact with different AI personalities organized by genres, similar to how contacts are organized in messaging apps.

**MVP Goal:**
Build a **WhatsApp-like UI system** where:

* Left side = personalities (instead of contacts)
* Right side = chat screen (non-functional for MVP)
* Users can explore, add, and customize personalities

---

# 2. 🎯 Core Concept

Instead of contacts:
👉 Users interact with **Genres → Personalities**

Structure:

* Genre = category (e.g., Motivation, Fun, Wealth)
* Personality = specific character inside a genre

Example:

* Motivation → Iron Coach, Discipline Master
* Fun → Chaos Buddy, Meme Friend
* Wealth → Business Mentor

---

# 3. 🧩 Core Features (MVP Scope)

## 3.1 Left Panel — Genre List (Contacts Replacement)

* Vertical list of **Genres**
* Each genre displayed as:

  * Card with icon + name
  * Highlight when selected

### At bottom (fixed):

➕ **Add Genre button**

---

## 3.2 Genre Interaction

On clicking a genre:

* Show list of **Personalities inside that genre**

---

## 3.3 Personality List

Inside each genre:

* Display personality cards:

  * avatar/icon (gamified look)
  * name
  * short tag (e.g., “Hard Discipline”, “Funny Chaos”)

### At bottom:

➕ **Add Personality button**

---

## 3.4 Add Genre Flow

When clicking **Add Genre**:

* Show modal / screen with predefined genres:

  * Motivation
  * Wealth
  * Fun
  * Emotional Support
  * Productivity
* Option:

  * select genre
  * create custom genre (optional MVP+)

---

## 3.5 Add Personality Flow

When clicking **Add Personality**:

* Show personality options based on genre

Example:
Motivation:

* Iron Coach
* No-Excuse Trainer

Fun:

* Chaos Friend
* Meme Generator

Also allow:

* selecting personality across genres (flexibility)

---

## 3.6 Personality Design (Gamified)

Each personality should feel:

* visually distinct
* playful / engaging
* collectible

Design ideas:

* glowing avatars
* badges / rarity feel
* slight animation (hover / tap)
* emoji / icon identity

👉 Goal: personalities feel like “characters,” not plain items

---

## 3.7 Right Panel — Chat Screen (Static for MVP)

* WhatsApp-style chat UI
* shows selected personality name + avatar
* message bubbles (dummy/static)
* input box (non-functional)

👉 Purpose: UI visualization only (no backend needed yet)

---

# 4. 🎨 UI & Design System

## Color Palette

### Base

* Background: `#0B1020`
* Secondary Background: `#12182B`
* Card: `#161D33`

### Primary Accent

* Violet: `#8B5CF6`
* Soft Glow: `#A78BFA`

### Secondary Accent

* Indigo: `#6366F1`
* Highlight Pink (limited): `#EC4899`

### Text

* Primary: `#F8FAFC`
* Secondary: `#A8B0C5`
* Muted: `#7C859D`

### Semantic

* Success: `#22C55E`
* Warning: `#F59E0B`
* Error: `#EF4444`

---

## UI Style

* Dark mode first
* Soft gradients + glow effects
* Rounded cards (modern feel)
* Clean spacing
* Minimal clutter

---

# 5. 🧠 User Flow

### Step 1:

User opens app → sees Genre list

### Step 2:

Clicks a Genre → sees personalities

### Step 3:

Clicks a Personality → opens chat UI

### Step 4:

Adds new Genre or Personality

---

# 6. 🏗 Tech Scope (Simplified MVP)

### Frontend only:

* React Native (Expo)
* No backend required initially

### Data handling:

* Local state / mock data
* Hardcoded personalities & genres

---

# 7. 🚫 Out of Scope (for this MVP)

* AI chat functionality
* memory system
* backend/database
* notifications
* authentication

👉 This MVP is **UI + structure only**

---

# 8. 🎯 Success Criteria

* Clean WhatsApp-like experience
* Easy navigation between genres
* Smooth adding of genres & personalities
* Personalities feel engaging/gamified

---

# 9. 🧩 Future Scope (Next Version)

* AI chat integration
* memory system
* personality behavior logic
* follow-ups & notifications
* progress tracking

---

# 10. 🏁 Product Principle

> **Start simple: build the world before adding intelligence.**

---

# 11. 🔥 One-Line Positioning

**“Winsome — your personal chat world of personalities.”**

---
