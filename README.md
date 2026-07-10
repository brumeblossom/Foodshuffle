# FoodShuffle - MVP Meal Planner

FoodShuffle is a robust, responsive web application for personalized weekly meal planning, designed with high visual standards and accessibility guidelines (WCAG 2.1 AA).

---

## 🚀 Run Instructions

### 1. Requirements
- **Node.js**: v20.x or v22.x
- **Package Manager**: npm

### 2. Local Setup
```bash
# Install dependencies
npm install

# Run the local development server
npm run dev

# Open the browser at the local preview link
# http://localhost:5173/
```

### 3. Production Build & Preview
```bash
# Compile and build the production bundle
npm run build

# Start a local preview server of the built production files
npm run preview
```

### 4. Running Tests
```bash
# Execute unit and integration tests via Vitest
npm run test
```

---

## 🏗️ Architecture Overview

The codebase is structured under clean domain-driven feature boundaries:

```text
src/
├── app/                  # Application State (Zustand Stores)
│   ├── pantryStore.ts    # Virtual pantry ingredients list
│   ├── planStore.ts      # Active 7-day meal plan & schedule updates
│   ├── profileStore.ts   # User profile metadata & target calories
│   └── uiStore.ts        # Global alerts (toasts) & theme appearance
│
├── components/           # Reusable Design System Primitive Elements
│   ├── Button.tsx        # High-contrast accessible buttons
│   ├── Card.tsx          # Primitive layout boxes
│   ├── Navigation.tsx    # Keyboard-friendly desktop side-nav & mobile tab bar
│   └── Tag.tsx           # Monospace tags (primary, highlight, success)
│
├── core/                 # Core Logic Engines & Interfaces
│   ├── compositionRoot.ts# Composition Root mapping providers
│   ├── fridgeMatcher.ts  # String-matching parser & ingredient rankers
│   ├── nutrition.ts      # Mifflin-St Jeor daily macro limit calculators
│   ├── providers.ts      # Provider abstract definitions
│   └── ruleBasedRecommender.ts # Core recommendation & slot-filling engines
│
├── data/                 # Repository Layers & Seed Data
│   ├── db.ts             # IndexedDB Schema definition (Dexie)
│   ├── repo.ts           # DB query wrapper utilities
│   ├── types.ts          # Strongly-typed schemas (TypeScript interfaces)
│   └── validation.ts     # Zod form validation structures
│
└── features/             # Feature Screen Views
    ├── a11y/             # Automated Axe accessibility tests
    ├── fridge/           # Cook From Fridge interface
    ├── onboarding/       # 10-step guided onboarding questionnaire
    ├── plan/             # Weekly meal plan card deck & swap controls
    ├── profile/          # Settings configurations & maintenance controls
    └── recipes/          # Searchable recipe list & stepper servings detail
```

---

## 🧠 Future AI Recommendations Integration

To support future AI recommendations (e.g. LLM/Gemini recommendations based on user constraints and preferences), **you do not need to edit any UI components**.

All dependencies are resolved via a **single composition root** at **`src/core/compositionRoot.ts`**.

### Plugging in a Future `AIRecommendationProvider`

1. **Implement the Provider**: Create your new recommendation engine class implementing the `RecommendationProvider` interface:
   ```typescript
   // src/core/aiRecommender.ts
   import type { RecommendationProvider, RecommendationContext } from './providers';
   import type { Recipe, MealPlan, UserProfile, MealType } from '../data/types';

   export class AIRecommender implements RecommendationProvider {
     generateWeeklyPlan(ctx: RecommendationContext): MealPlan {
       // Call Gemini API / model endpoints, structure output, apply filters, and return MealPlan
     }

     suggestSwap(dayIndex: number, slot: MealType, plan: MealPlan, candidates: Recipe[], profile: UserProfile): Recipe[] {
       // Return AI-powered alternatives for the selected day and meal slot
     }
   }
   ```

2. **Register in the Composition Root**: Open **`src/core/compositionRoot.ts`**, import your new class, and swap the recommendation provider registration:
   ```typescript
   import { AIRecommender } from './aiRecommender'; // New AI class
   // import { RuleBasedRecommender } from './ruleBasedRecommender'; // Old static implementation

   class CompositionRoot {
     readonly recommendationProvider: RecommendationProvider;
     readonly nutritionProvider: NutritionProvider;

     constructor() {
       // Plug in AI Recommender here! The entire application automatically consumes it.
       this.recommendationProvider = new AIRecommender();
       this.nutritionProvider = new DefaultNutritionProvider();
     }
   }

   export const container = new CompositionRoot();
   ```

No other files (Zustand stores, page components, or seed repo layers) need modifications. The change is completely isolated, clean, and modular.
