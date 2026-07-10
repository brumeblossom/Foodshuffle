import type { Recipe, Difficulty } from '../data/types';
import type { RecommendationContext } from './providers';

export interface FridgeMatch {
  recipe: Recipe;
  haveCount: number;
  totalCount: number;
  matchPct: number;
  missing: string[];
}

/**
 * Normalizes an ingredient name for comparison by lowercasing, stripping quantities/units,
 * performing basic singularization, and resolving synonyms.
 */
export function normalizeIngredient(raw: string): string {
  let word = raw.toLowerCase().trim();

  // 1. Remove leading digits, decimals, fractions (e.g., "1/2", "0.5", "1.5"), hyphens, percent signs
  word = word.replace(/^[\d\s\/\.\-½¼¾⅓⅔%]+/, '');

  // 2. Strip parenthetical details (e.g., "garlic cloves (finely minced)" -> "garlic cloves")
  word = word.replace(/\s*\(.*\)\s*/g, ' ');

  // 3. Strip "of" preposition prefix (e.g., "cup of coconut milk" -> "coconut milk")
  word = word.replace(/^.*\bof\b\s+/, '');

  // 4. Strip common units
  const units = [
    'grams', 'gram', 'g', 'milliliters', 'milliliter', 'ml', 'kilograms', 'kilogram', 'kg',
    'cups', 'cup', 'tbsp', 'tsp', 'tablespoons', 'tablespoon', 'teaspoons', 'teaspoon',
    'pieces', 'piece', 'cans', 'can', 'cloves', 'clove', 'heads', 'head', 'ounces', 'ounce', 'oz',
    'bunches', 'bunch', 'slices', 'slice', 'packages', 'package', 'pack', 'packs', 'cans of', 'can of'
  ];
  const unitRegex = new RegExp(`^\\b(?:${units.join('|')})\\b\\s+`, 'i');
  word = word.replace(unitRegex, '');

  // Clean trailing spaces resulting from replacements
  word = word.trim();

  // 5. Basic Singularization
  if (word.endsWith('oes')) { // tomatoes -> tomato
    word = word.slice(0, -2);
  } else if (word.endsWith('ies')) { // berries -> berry
    word = word.slice(0, -3) + 'y';
  } else if (
    word.endsWith('s') &&
    !word.endsWith('ss') &&
    !word.endsWith('us') &&
    !word.endsWith('is') &&
    !word.endsWith('as')
  ) {
    word = word.slice(0, -1);
  }

  // 6. Synonym Mapping (Sub-string & Exact match)
  const synonyms: [string, string][] = [
    ['tomato paste', 'tomato'],
    ['canned tomato', 'tomato'],
    ['cherry tomato', 'tomato'],
    ['roma tomato', 'tomato'],
    ['tomatoes', 'tomato'],
    ['bell pepper', 'pepper'],
    ['sweet pepper', 'pepper'],
    ['chili pepper', 'pepper'],
    ['habanero pepper', 'pepper'],
    ['scotch bonnet', 'pepper'],
    ['cayenne pepper', 'pepper'],
    ['chilis', 'pepper'],
    ['chili', 'pepper'],
    ['chilli', 'pepper'],
    ['chillies', 'pepper'],
    ['red onion', 'onion'],
    ['white onion', 'onion'],
    ['yellow onion', 'onion'],
    ['spring onion', 'onion'],
    ['green onion', 'onion'],
    ['scallion', 'onion'],
    ['onions', 'onion'],
    ['garlic clove', 'garlic'],
    ['garlic powder', 'garlic'],
    ['chicken breast', 'chicken'],
    ['chicken thigh', 'chicken'],
    ['chicken wing', 'chicken'],
    ['chicken meat', 'chicken'],
    ['olive oil', 'oil'],
    ['vegetable oil', 'oil'],
    ['canola oil', 'oil'],
    ['cooking oil', 'oil'],
    ['coconut oil', 'oil'],
    ['groundnut oil', 'oil'],
    ['peanut oil', 'oil'],
    ['beef meat', 'beef'],
    ['ground beef', 'beef'],
  ];

  for (const [syn, canonical] of synonyms) {
    if (word === syn || word.includes(syn)) {
      return canonical;
    }
  }

  return word;
}

/**
 * Splits pantry inputs by commas or newlines, normalizes each item, and returns a deduplicated list.
 */
export function parsePantryInput(text: string): string[] {
  if (!text) return [];
  
  const rawItems = text.split(/[,\n]/);
  const normalizedSet = new Set<string>();

  for (const item of rawItems) {
    const normalized = normalizeIngredient(item);
    if (normalized) {
      normalizedSet.add(normalized);
    }
  }

  return Array.from(normalizedSet);
}

/**
 * Filters a recipe list to safe recipes matching the user constraints, then ranks them based
 * on the percentage of recipe ingredients currently matched in the user's pantry.
 */
export function matchRecipes(
  pantry: string[],
  recipes: Recipe[],
  ctx: RecommendationContext
): FridgeMatch[] {
  const { profile } = ctx;
  const matches: FridgeMatch[] = [];

  const normalizedPantry = pantry.map(item => normalizeIngredient(item)).filter(Boolean);

  // Pre-process user allergies for case-insensitive matching
  const userAllergies = (profile.allergies || []).map(a => a.toLowerCase().trim()).filter(Boolean);

  // Pre-process active diet tags (exclude 'none')
  const activeDietTags = (profile.dietTags || []).filter(t => t !== 'none');

  // User cooking skill mapped to a numeric rank
  const skillRankMap: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3 };
  const userSkillRank = skillRankMap[profile.skillLevel || 'intermediate'] || 2;

  const difficultyRankMap: Record<Difficulty, number> = { easy: 1, medium: 2, hard: 3 };

  for (const recipe of recipes) {
    // ----------------------------------------------------
    // REUSE HARD FILTERS
    // ----------------------------------------------------

    // A. Allergen exclusion
    let containsAllergen = false;
    const recipeAllergens = (recipe.allergens || []).map(a => a.toLowerCase().trim());
    const recipeTags = (recipe.tags || []).map(t => t.toLowerCase().trim());
    const recipeNameLower = recipe.name.toLowerCase();
    const recipeDescLower = recipe.description.toLowerCase();

    for (const allergen of userAllergies) {
      if (recipeAllergens.some(a => a.includes(allergen) || allergen.includes(a))) {
        containsAllergen = true;
        break;
      }
      if (recipeTags.some(t => t.includes(allergen))) {
        containsAllergen = true;
        break;
      }
      if (recipeNameLower.includes(allergen) || recipeDescLower.includes(allergen)) {
        containsAllergen = true;
        break;
      }
      if (recipe.ingredients.some(ing => ing.name.toLowerCase().includes(allergen))) {
        containsAllergen = true;
        break;
      }
    }
    if (containsAllergen) {
      continue;
    }

    // B. Diet Tag Compliance
    if (activeDietTags.length > 0) {
      const hasAllDiets = activeDietTags.every(diet => recipe.dietTags.includes(diet));
      if (!hasAllDiets) {
        continue;
      }
    }

    // C. Cooking Skill Match (recipe difficulty <= user skill)
    const recipeDiffRank = difficultyRankMap[recipe.difficulty || 'easy'] || 1;
    if (recipeDiffRank > userSkillRank) {
      continue;
    }

    // D. Cuisine matching (applied from RecommendationContext if specified)
    if (ctx.cuisineFilter) {
      const filterLower = ctx.cuisineFilter.toLowerCase().trim();
      if (recipe.cuisine.toLowerCase().trim() !== filterLower) {
        continue;
      }
    }

    // ----------------------------------------------------
    // INGREDIENTS MATCHING
    // ----------------------------------------------------
    let haveCount = 0;
    const missing: string[] = [];

    for (const ingredient of recipe.ingredients) {
      if (ingredient.optional) {
        // Skip optional ingredients from matches requirements
        continue;
      }

      const normalizedIngName = normalizeIngredient(ingredient.name);
      const isMatched = normalizedPantry.some(p => {
        return p === normalizedIngName || normalizedIngName.includes(p) || p.includes(normalizedIngName);
      });

      if (isMatched) {
        haveCount++;
      } else {
        missing.push(ingredient.name);
      }
    }

    const totalRequiredCount = recipe.ingredients.filter(i => !i.optional).length;
    const matchPct = totalRequiredCount > 0 ? (haveCount / totalRequiredCount) * 100 : 0;

    matches.push({
      recipe,
      haveCount,
      totalCount: totalRequiredCount,
      matchPct: Math.round(matchPct * 10) / 10,
      missing,
    });
  }

  // Rank by matchPct descending, then by name alphabetically
  return matches.sort((a, b) => {
    if (b.matchPct !== a.matchPct) {
      return b.matchPct - a.matchPct;
    }
    return a.recipe.name.localeCompare(b.recipe.name);
  });
}
