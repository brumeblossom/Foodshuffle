import { db } from './db';
import type { UserProfile, Recipe, MealPlan, PantryItem, AppMeta } from './types';
import { SEED_RECIPES } from './seed/recipes';
export { SEED_RECIPES };
import { RecipeSchema } from './validation';

// ---------- Profile CRUD ----------
export async function getProfile(): Promise<UserProfile | null> {
  const profile = await db.profile.get('primary');
  return profile || null;
}

export async function saveProfile(profile: UserProfile): Promise<string> {
  const now = new Date().toISOString();
  const updatedProfile: UserProfile = {
    ...profile,
    id: 'primary',
    updatedAt: now,
    createdAt: profile.createdAt || now
  };
  await db.profile.put(updatedProfile);
  return 'primary';
}

// ---------- Recipes CRUD ----------
export async function getRecipes(): Promise<Recipe[]> {
  return db.recipes.toArray();
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const recipe = await db.recipes.get(id);
  return recipe || null;
}

export async function bulkAddRecipes(recipes: Recipe[]): Promise<void> {
  await db.recipes.bulkPut(recipes);
}

// ---------- Meal Plans CRUD ----------
export async function getPlans(): Promise<MealPlan[]> {
  return db.mealPlans.toArray();
}

export async function savePlan(plan: MealPlan): Promise<string> {
  await db.mealPlans.put(plan);
  return plan.id;
}

export async function deletePlan(id: string): Promise<void> {
  await db.mealPlans.delete(id);
}

// ---------- Pantry CRUD ----------
export async function getPantry(): Promise<PantryItem[]> {
  return db.pantry.toArray();
}

export async function addPantryItem(item: PantryItem): Promise<string> {
  await db.pantry.put(item);
  return item.id;
}

export async function deletePantryItem(id: string): Promise<void> {
  await db.pantry.delete(id);
}

// ---------- App Metadata CRUD ----------
export async function getMeta(): Promise<AppMeta | null> {
  const meta = await db.appMeta.get('meta');
  return meta || null;
}

export async function saveMeta(meta: AppMeta): Promise<string> {
  await db.appMeta.put(meta);
  return 'meta';
}

// ---------- First Run Seeding Mechanism ----------
export async function initAppMetaAndSeeds(): Promise<boolean> {
  const CURRENT_SEED_VERSION = 1;

  // Validate every recipe using the Zod schema. If validation fails, it throws a loud parsing error.
  for (const recipe of SEED_RECIPES) {
    RecipeSchema.parse(recipe);
  }

  const meta = await db.appMeta.get('meta');

  if (!meta) {
    // Brand new installation: seed recipes and metadata
    await db.recipes.bulkPut(SEED_RECIPES);
    await db.appMeta.put({
      id: 'meta',
      schemaVersion: 1,
      seedVersion: CURRENT_SEED_VERSION,
      theme: 'system'
    });
    return true;
  }

  if (meta.seedVersion < CURRENT_SEED_VERSION) {
    // Upgraded application: seed updated recipes and refresh metadata
    await db.recipes.bulkPut(SEED_RECIPES);
    meta.seedVersion = CURRENT_SEED_VERSION;
    await db.appMeta.put(meta);
    return true;
  }

  return false;
}
