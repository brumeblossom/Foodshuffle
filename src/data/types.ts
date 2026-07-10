// ---------- Enums / unions ----------
export type Gender = 'female' | 'male' | 'non_binary' | 'prefer_not_to_say';

export type DietTag =
  | 'none'
  | 'vegetarian'
  | 'vegan'
  | 'pescatarian'
  | 'diabetic_friendly'
  | 'kosher'
  | 'halal'
  | 'gluten_free'
  | 'keto'
  | 'low_carb'
  | 'dairy_free';

export type Allergen =
  | 'peanuts'
  | 'tree_nuts'
  | 'shellfish'
  | 'fish'
  | 'gluten'
  | 'dairy'
  | 'eggs'
  | 'soy'
  | 'sesame'
  | string; // free entries allowed

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'athlete';

export type Goal =
  | 'general_health'
  | 'weight_loss'
  | 'weight_gain'
  | 'fitness'
  | 'maintain';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type Willingness = 'prefer_not' | 'sometimes' | 'love';
export type CookFrequency = 'rarely' | 'few_per_week' | 'daily';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type Difficulty = 'easy' | 'medium' | 'hard';

// ---------- UserProfile ----------
export interface UserProfile {
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
export interface Nutrition {
  calories: number;              // kcal
  protein: number;               // g
  carbs: number;                 // g
  fat: number;                   // g
  fiber?: number;                // g
  sugar?: number;                // g
  sodium?: number;               // mg
}

// ---------- Recipe ----------
export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;                  // 'g' | 'ml' | 'cup' | 'tbsp' | 'piece' | ...
  optional?: boolean;
  normalizedName?: string;       // for fridge matching
}

export interface Recipe {
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
export interface PlannedMeal {
  recipeId: string;
  servings: number;              // for this planned instance
  locked: boolean;               // preserved across regenerations
}

export interface MealPlanDay {
  date: string;                  // ISO date
  dayOfWeek: number;             // 0-6
  breakfast?: PlannedMeal;
  lunch?: PlannedMeal;
  dinner?: PlannedMeal;
  snacks?: PlannedMeal[];
}

export interface MealPlan {
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
export interface PantryItem {
  id: string;
  name: string;
  normalizedName: string;
  addedAt: string;
}

// ---------- App meta ----------
export interface AppMeta {
  id: 'meta';
  schemaVersion: number;
  seedVersion: number;           // which recipe seed is loaded
  theme: 'light' | 'dark' | 'system';
}
