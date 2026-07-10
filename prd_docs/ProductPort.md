# ProductPort — Meal & Recipe Planner (PRD)

**Product name (working):** ProductPort
**Version:** 1.0 (MVP)
**Owner:** KayKav Academy
**Status:** Ready for build
**Platform:** Web (responsive, mobile-first)
**Last updated:** 2026-07-01

---

## 1. Summary

ProductPort is a local-first web app that turns a short onboarding questionnaire into a personalized weekly meal plan. It recommends recipes that respect the user's diet, allergies, budget, cooking ability, and health goals, tells them what each meal costs and contains nutritionally, and can suggest recipes from ingredients they already have.

The MVP ships with a **curated recipe dataset** and **rule-based recommendations**, but every recommendation and nutrition calculation sits behind a provider interface so an AI/LLM backend can be dropped in later without a rewrite.

---

## 2. Goals & non-goals

### Goals (v1)
- Get a user from zero to a usable weekly meal plan in under 3 minutes.
- Personalize plans across diet, allergies, budget, skill, and goal.
- Show calorie and macro information for every meal and every day.
- Let users find "what can I cook right now" from ingredients on hand.
- Feel premium, minimal, and accessible — including a genuinely accessible dark mode.
- No login, no server: everything persists in the browser.

### Non-goals (deferred to v2+)
These appear in the discovery board but are **out of MVP scope**:
- Restaurant/chef recommendations and "buy pre-cooked from specific restaurants."
- Weather-based suggestions (e.g. ice cream when hot) and water reminders.
- Meal-plan sharing / export to others.
- "Food shuffle" (random meal) and non-repetitive timetable generation as standalone features (basic variety is handled by the planner, but these are not surfaced as features yet).
- Multi-user accounts, cloud sync, social features.

---

## 3. Target user

A busy individual who wants to eat according to a goal (health, weight, fitness) without spending mental energy on planning. They may cook a little, a lot, or reluctantly, and they care about staying within a monthly food budget. Regional focus is **both Nigerian/local and international**, with the user filtering by cuisine.

---

## 4. MVP feature set

### 4.1 Onboarding & profile
A guided, multi-step questionnaire (with progress indicator) that builds the user profile. All answers are editable later from a Profile screen.

**Collected fields:**
- Name
- Gender
- Age
- **Height & weight** *(added; optional — see note below)*
- Favorite foods (free multi-entry)
- Allergies (multi-select + free entry; e.g. peanuts, shellfish, gluten, dairy, eggs, soy)
- Diet type(s) (multi-select): None, Vegetarian, Vegan, Pescatarian, Diabetic-friendly, Kosher, Halal, Gluten-free, Keto, Low-carb, Dairy-free
- Activity level: Sedentary, Lightly active, Moderately active, Very active, Athlete
- Goal: General health, Weight loss, Weight gain, Muscle/fitness, Maintain
- Monthly food budget (amount + currency; default ₦, NGN)
- Cooking skill level: Beginner, Intermediate, Advanced
- Willingness to cook: Prefer not to, Sometimes, Love to cook
- Cooking frequency: Rarely, A few times a week, Daily

> **Engineering note — height & weight.** The original brief didn't include height/weight, but accurate per-day calorie targets (Mifflin-St Jeor) require them. Decision: include them as **optional** fields. When provided, we compute BMR → TDEE → goal-adjusted target. When skipped, we fall back to an age/gender/activity heuristic band and clearly label the target as an estimate. This keeps onboarding short while enabling real nutrition math.

**Onboarding rules**
- Each step is skippable except Name and Goal.
- Onboarding completion sets `onboardingComplete = true` and triggers the first plan generation offer.
- Re-running onboarding never destroys existing meal plans.

### 4.2 Weekly meal plan generation
- Generates a **7-day plan** (breakfast, lunch, dinner; snacks optional per user preference).
- Each day targets the user's daily calorie goal within a tolerance band (±10%).
- Total plan cost is estimated and compared against the **weekly slice of the monthly budget** (monthly ÷ 4.33). Over-budget days are flagged, not blocked.
- Respects: allergies (hard exclude), diet types (hard exclude), cuisine filter, cooking skill (recipe difficulty ≤ skill), and prep time (bounded by willingness/frequency).
- Users can **lock** a meal they like and **regenerate** the rest; locked meals are preserved.
- Users can **swap** any single meal for an alternative that fits the same constraints.
- Variety rule: avoid repeating the same recipe more than once per plan unless the pool is too small.

### 4.3 Recipe browse & filter
- Browsable recipe library with search.
- Filters: cuisine, meal type, diet tags, max prep time, difficulty, max cost per serving, and "safe for my allergies" toggle.
- Recipe detail view: image, description, ingredients (with quantities), steps, prep/cook time, servings, difficulty, cuisine, per-serving nutrition, estimated cost, allergen and diet tags. Serving size adjustable (scales ingredients).
- "Add to this week's plan" action from any recipe.

### 4.4 Calorie & nutrition information
- Per-serving nutrition on every recipe: calories, protein, carbs, fat, fiber, sugar, sodium.
- Daily plan roll-up: total calories and macro breakdown vs. target, shown as a compact chart.
- Weekly summary: average daily calories, macro split, and estimated weekly spend.

### 4.5 Cook-from-fridge (ingredient matching)
- Text input (comma- or newline-separated) where the user lists ingredients they have.
- Matches against the recipe library, ranked by percentage of a recipe's ingredients the user already has.
- Each result shows what's missing so the user can decide.
- Optional: save a "pantry" list so it persists between sessions.
- Respects allergy/diet constraints in results.

---

## 5. UX / design direction

**Feel:** minimal, modern, premium. Warm and appetizing without being cluttered. The interface should feel like a well-designed cookbook crossed with a produce market label system.

### 5.1 Palette (brand → semantic tokens)
Brand colors provided:

| Name | Hex |
|---|---|
| Sunshine | `#ffc926` |
| Tomato Burst | `#d52518` |
| Cream | `#f3e8cc` |
| Forest Green | `#18542a` |
| Crisp Carrot | `#f96015` |
| Kiwi | `#9abc05` |

**Design decision:** Rather than the default "cream + serif + terracotta" look, **Forest Green is the structural anchor** (primary text, primary buttons, nav), Cream is the canvas, and Sunshine / Carrot / Kiwi / Tomato form a produce-accent set used sparingly to differentiate meal types and states. The signature element is a **recipe/nutrition "label" motif** (thin-ruled tags reminiscent of grocery labels) applied to meal cards and nutrition summaries.

**Semantic tokens (light):**
- `--bg`: Cream `#f3e8cc`
- `--surface`: `#fbf6ea` (lightened cream for cards)
- `--text`: Forest Green `#18542a`
- `--text-muted`: `#3c5a44`
- `--primary`: Forest Green `#18542a` (white text)
- `--accent`: Crisp Carrot `#f96015`
- `--danger`: Tomato Burst `#d52518`
- `--highlight`: Sunshine `#ffc926` (dark text only)
- `--success`: Kiwi `#9abc05` (dark text only)

**Semantic tokens (dark) — accessibility-first:**
- `--bg`: `#12180f` (warm near-black, green-leaning)
- `--surface`: `#1b2416`
- `--text`: `#f3e8cc` (cream)
- `--text-muted`: `#c3cbb2`
- `--primary`: `#7fce8f` (brightened forest green for contrast on dark; white/near-black text as needed)
- `--accent`: `#ff8a4d` (brightened carrot)
- `--danger`: `#ff6a5c` (brightened tomato)
- `--highlight`: `#ffc926`
- `--success`: `#b6dc3a`

> **Contrast rules (must pass WCAG 2.1 AA):** Body text ≥ 4.5:1; large text/UI ≥ 3:1. Sunshine and Kiwi are **never** used as backgrounds for light text — they carry dark (`#18542a` / near-black) text only. Primary buttons in light mode use white text on Forest Green (passes AA). All accent-on-background pairings are verified before ship.

### 5.2 Typography
- **Display / headings:** Fraunces (variable serif — warm, slightly characterful, premium). Used with restraint for titles, recipe names, big numbers. *(Alt if unavailable: Instrument Serif.)*
- **Body / UI:** Inter (clean, legible at small sizes, tabular numerals for nutrition/cost data).
- Type scale: a clear modular scale; serif reserved for the "voice" moments (hero, recipe titles, day headers), sans for everything functional.

### 5.3 Accessibility (non-negotiable)
- WCAG 2.1 AA contrast across both themes.
- Full keyboard navigation with visible focus states.
- Respect `prefers-reduced-motion`.
- Respect `prefers-color-scheme` for initial theme; manual toggle overrides and persists.
- Semantic HTML, labelled form controls, ARIA where needed.
- Minimum 44×44px touch targets on mobile.

### 5.4 Motion
- Restrained. One orchestrated moment (plan-generation reveal) rather than scattered effects. Hover/press micro-interactions on cards. All motion gated behind reduced-motion.

---

## 6. Technical stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | **React 18** | |
| Build tool | **Vite** | Fast dev, PWA-ready |
| Language | **TypeScript** | Strict mode |
| Styling | **Tailwind CSS** | Semantic tokens via CSS variables; class-based dark mode |
| State | **Zustand** | Profile, plan, UI state |
| Local storage | **Dexie.js (IndexedDB)** | Profile, plans, recipes, pantry |
| Routing | **React Router** | |
| Forms & validation | **react-hook-form + zod** | Onboarding + profile edit |
| Charts | **Recharts** | Nutrition roll-ups |
| Icons | **Hugeicons** | React package |
| Fonts | **Fraunces + Inter** | Self-host or Google Fonts |
| PWA (optional) | **vite-plugin-pwa** | Installable, offline shell |

### 6.1 Architecture principles
- **Local-first:** no backend, no auth. All data in IndexedDB. Seed recipes bundled and loaded on first run.
- **AI-ready via provider interfaces:** define `RecommendationProvider` and `NutritionProvider` interfaces. Ship `RuleBasedRecommendationProvider` and `StaticNutritionProvider` now; an `AIRecommendationProvider` (Anthropic API) can be added later behind the same interface with zero UI changes.
- **Pure, testable core:** the planning/scoring/nutrition logic is framework-agnostic pure functions, unit-testable independent of React.

### 6.2 Recommendation logic (rule-based, v1)
1. **Hard filters:** remove recipes containing user allergens; remove recipes violating any active diet tag; apply cuisine filter if set.
2. **Scoring** (weighted): goal/calorie fit, budget fit (cost/serving vs daily budget), skill fit (difficulty ≤ skill), time fit (prep time vs willingness/frequency), favorite-food match, and variety penalty for repeats within the plan.
3. **Assembly:** fill 7 days × meal slots, honoring locked meals, keeping each day within the calorie tolerance band and the plan within the weekly budget where possible.

### 6.3 Nutrition target logic
- If height + weight present: Mifflin-St Jeor BMR → × activity factor → TDEE → goal adjustment (e.g. −500 kcal weight loss, +300–500 gain, maintenance = TDEE). Macro split by goal.
- If absent: heuristic band from age/gender/activity, labelled "estimate."

---

## 7. Data model

TypeScript-oriented schema. Stored in IndexedDB via Dexie tables: `profile`, `recipes`, `mealPlans`, `pantry`, `appMeta`.

```ts
// ---------- Enums / unions ----------
type Gender = 'female' | 'male' | 'non_binary' | 'prefer_not_to_say';

type DietTag =
  | 'none' | 'vegetarian' | 'vegan' | 'pescatarian'
  | 'diabetic_friendly' | 'kosher' | 'halal'
  | 'gluten_free' | 'keto' | 'low_carb' | 'dairy_free';

type Allergen =
  | 'peanuts' | 'tree_nuts' | 'shellfish' | 'fish'
  | 'gluten' | 'dairy' | 'eggs' | 'soy' | 'sesame' | string; // free entries allowed

type ActivityLevel =
  | 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'athlete';

type Goal =
  | 'general_health' | 'weight_loss' | 'weight_gain' | 'fitness' | 'maintain';

type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
type Willingness = 'prefer_not' | 'sometimes' | 'love';
type CookFrequency = 'rarely' | 'few_per_week' | 'daily';
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
type Difficulty = 'easy' | 'medium' | 'hard';

// ---------- UserProfile ----------
interface UserProfile {
  id: 'primary';                 // single local user
  name: string;
  gender?: Gender;
  age?: number;
  heightCm?: number;             // optional — improves calorie accuracy
  weightKg?: number;             // optional
  favoriteFoods: string[];
  allergies: Allergen[];
  dietTags: DietTag[];
  activityLevel?: ActivityLevel;
  goal: Goal;
  monthlyBudget?: number;
  currency: string;              // e.g. 'NGN'
  skillLevel?: SkillLevel;
  willingnessToCook?: Willingness;
  cookFrequency?: CookFrequency;
  includeSnacks: boolean;        // default false
  onboardingComplete: boolean;
  createdAt: string;             // ISO
  updatedAt: string;             // ISO
}

// ---------- Nutrition ----------
interface Nutrition {
  calories: number;              // kcal
  protein: number;               // g
  carbs: number;                 // g
  fat: number;                   // g
  fiber?: number;                // g
  sugar?: number;                // g
  sodium?: number;               // mg
}

// ---------- Recipe ----------
interface Ingredient {
  name: string;
  quantity: number;
  unit: string;                  // 'g' | 'ml' | 'cup' | 'tbsp' | 'piece' | ...
  optional?: boolean;
  normalizedName?: string;       // for fridge matching
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  cuisine: string;               // e.g. 'Nigerian', 'Italian', 'Indian'
  imageUrl?: string;
  mealTypes: MealType[];
  ingredients: Ingredient[];
  steps: string[];
  prepTimeMins: number;
  cookTimeMins: number;
  servings: number;              // base servings the recipe yields
  nutritionPerServing: Nutrition;
  dietTags: DietTag[];           // diets this recipe satisfies
  allergens: Allergen[];         // allergens present
  estimatedCostPerServing: number; // in a base currency; scaled for display
  costCurrency: string;          // base currency of the cost figure, e.g. 'NGN'
  difficulty: Difficulty;
  tags: string[];                // free-form ('quick', 'high_protein', 'one_pot')
}

// ---------- Meal Plan ----------
interface PlannedMeal {
  recipeId: string;
  servings: number;              // for this planned instance
  locked: boolean;               // preserved across regenerations
}

interface MealPlanDay {
  date: string;                  // ISO date
  dayOfWeek: number;             // 0-6
  breakfast?: PlannedMeal;
  lunch?: PlannedMeal;
  dinner?: PlannedMeal;
  snacks?: PlannedMeal[];
}

interface MealPlan {
  id: string;
  weekStartDate: string;         // ISO (Monday)
  days: MealPlanDay[];           // length 7
  targetCaloriesPerDay: number;
  estimatedWeeklyCost: number;
  createdAt: string;
  // snapshot of the constraints used, so a plan is reproducible/explainable
  profileSnapshot: Pick<
    UserProfile,
    'dietTags' | 'allergies' | 'goal' | 'skillLevel' | 'monthlyBudget' | 'currency'
  >;
}

// ---------- Pantry (cook-from-fridge) ----------
interface PantryItem {
  id: string;
  name: string;
  normalizedName: string;
  addedAt: string;
}

// ---------- App meta ----------
interface AppMeta {
  id: 'meta';
  schemaVersion: number;
  seedVersion: number;           // which recipe seed is loaded
  theme: 'light' | 'dark' | 'system';
}
```

### 7.1 Derived values (computed, not stored)
- `dailyCalorieTarget` — from profile (Mifflin-St Jeor or heuristic).
- `macroTargets` — from goal.
- `weeklyBudgetSlice` — `monthlyBudget / 4.33`.
- `dayNutritionRollup` / `weekNutritionRollup` — summed from planned meals.

---

## 8. Screens (MVP)

1. **Onboarding** — multi-step questionnaire with progress.
2. **Home / This Week** — the current 7-day plan, day cards, daily calorie/cost roll-up, regenerate + per-meal swap/lock.
3. **Recipes** — browse, search, filter; recipe detail.
4. **Cook from Fridge** — ingredient input, ranked matches, missing-ingredient display, optional saved pantry.
5. **Profile** — view/edit all onboarding answers, theme toggle, reset data.

---

## 9. Success criteria (MVP)
- User completes onboarding and receives a valid, constraint-respecting weekly plan.
- Zero recipes containing declared allergens ever appear in a generated plan.
- Nutrition and cost figures display correctly per meal, per day, per week.
- Cook-from-fridge returns sensibly ranked matches.
- Both themes pass automated WCAG AA contrast checks; keyboard-navigable throughout.
- Fully responsive from 320px up.

---

## 10. Open questions / future (v2)
- Restaurant & chef sourcing (needs location + places data).
- Weather-aware suggestions + hydration reminders (needs geolocation + weather API + notifications).
- Plan sharing/export (PDF or link).
- AI provider swap-in (Anthropic API) for free-form and pantry-aware recommendations.
- Grocery list generation from the weekly plan.
- Multiple saved plans / plan history.
