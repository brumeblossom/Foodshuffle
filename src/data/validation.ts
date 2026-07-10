import { z } from 'zod';

export const NutritionSchema = z.object({
  calories: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  fiber: z.number().nonnegative().optional(),
  sugar: z.number().nonnegative().optional(),
  sodium: z.number().nonnegative().optional(),
});

export const IngredientSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  optional: z.boolean().optional(),
  normalizedName: z.string().optional(),
});

export const DifficultySchema = z.enum(['easy', 'medium', 'hard']);
export const MealTypeSchema = z.enum(['breakfast', 'lunch', 'dinner', 'snack']);

export const DietTagSchema = z.enum([
  'none',
  'vegetarian',
  'vegan',
  'pescatarian',
  'diabetic_friendly',
  'kosher',
  'halal',
  'gluten_free',
  'keto',
  'low_carb',
  'dairy_free',
]);

export const RecipeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  cuisine: z.string().min(1),
  imageUrl: z.string().optional(),
  mealTypes: z.array(MealTypeSchema).min(1),
  ingredients: z.array(IngredientSchema).min(1),
  steps: z.array(z.string().min(1)).min(1),
  prepTimeMins: z.number().nonnegative(),
  cookTimeMins: z.number().nonnegative(),
  servings: z.number().positive(),
  nutritionPerServing: NutritionSchema,
  dietTags: z.array(DietTagSchema),
  allergens: z.array(z.string()),
  estimatedCostPerServing: z.number().nonnegative(),
  costCurrency: z.string().refine((val) => val === 'NGN', {
    message: "Currency must be NGN",
  }),
  difficulty: DifficultySchema,
  tags: z.array(z.string()),
});

export const UserProfileSchema = z.object({
  id: z.literal('primary').default('primary'),
  name: z.string().trim().min(1, 'Name is required'),
  gender: z.enum(['female', 'male', 'non_binary', 'prefer_not_to_say']).optional(),
  age: z.number().int().min(1, 'Age must be positive').max(120, 'Age cannot exceed 120').optional(),
  heightCm: z.number().positive('Height must be positive').max(250).optional(),
  weightKg: z.number().positive('Weight must be positive').max(300).optional(),
  favoriteFoods: z.array(z.string()),
  allergies: z.array(z.string()),
  dietTags: z.array(DietTagSchema).min(1, 'At least one diet preference required'),
  activityLevel: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'athlete']).optional(),
  goal: z.enum(['general_health', 'weight_loss', 'weight_gain', 'fitness', 'maintain']),
  monthlyBudget: z.number().positive('Budget must be positive').optional(),
  currency: z.string().min(1).default('NGN'),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  willingnessToCook: z.enum(['prefer_not', 'sometimes', 'love']).optional(),
  cookFrequency: z.enum(['rarely', 'few_per_week', 'daily']).optional(),
  includeSnacks: z.boolean().default(false),
  onboardingComplete: z.boolean().default(false),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

