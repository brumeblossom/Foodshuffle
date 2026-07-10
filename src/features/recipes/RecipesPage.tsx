import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecipes } from '../../data/repo';
import { useProfileStore } from '../../app/profileStore';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Tag } from '../../components/Tag';
import type { Recipe, MealType } from '../../data/types';
import { 
  SearchList01Icon, 
  Clock01Icon, 
  FilterIcon,
  TickDouble02Icon
} from 'hugeicons-react';

export const RecipesPage: React.FC = () => {
  const { profile } = useProfileStore();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState<string>('all');
  const [mealTypeFilter, setMealTypeFilter] = useState<string>('all');
  const [dietFilter, setDietFilter] = useState<string>('all');
  const [maxPrepTime, setMaxPrepTime] = useState<number>(120);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [maxCost, setMaxCost] = useState<number>(5000);
  const [safeAllergiesToggle, setSafeAllergiesToggle] = useState<boolean>(true);

  // Load recipes from Dexie on mount
  useEffect(() => {
    getRecipes().then((dbRecipes) => {
      if (dbRecipes && dbRecipes.length > 0) {
        setRecipes(dbRecipes);
      }
    }).catch(err => {
      console.error('Failed to load recipes:', err);
    });
  }, []);

  const cuisines = useMemo(() => {
    const set = new Set(recipes.map((r) => r.cuisine));
    return ['all', ...Array.from(set)];
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // 1. Search by name/description
      const matchSearch = recipe.name.toLowerCase().includes(search.toLowerCase()) ||
        recipe.description.toLowerCase().includes(search.toLowerCase());
      
      // 2. Cuisine filter
      const matchCuisine = cuisineFilter === 'all' || recipe.cuisine === cuisineFilter;
      
      // 3. Meal type filter
      const matchMeal = mealTypeFilter === 'all' || recipe.mealTypes.includes(mealTypeFilter as MealType);

      // 4. Diet tags filter
      const matchDiet = dietFilter === 'all' || 
        recipe.dietTags.some(t => t.toLowerCase() === dietFilter.toLowerCase());

      // 5. Max Prep Time
      const matchPrep = recipe.prepTimeMins <= maxPrepTime;

      // 6. Difficulty
      const matchDifficulty = difficultyFilter === 'all' || recipe.difficulty === difficultyFilter;

      // 7. Max Cost per serving
      const matchCost = recipe.estimatedCostPerServing <= maxCost;

      // 8. Safe for my allergies check
      let matchAllergies = true;
      if (safeAllergiesToggle && profile?.allergies && profile.allergies.length > 0) {
        // Exclude if recipe allergens list contains any user allergen
        const userAllergies = profile.allergies.map(a => a.toLowerCase().trim());
        const hasTriggerAllergen = recipe.allergens.some(allergen => 
          userAllergies.includes(allergen.toLowerCase().trim())
        );
        
        // Also check if any ingredient contains any allergen word
        const hasIngredientAllergen = recipe.ingredients.some(ing => 
          userAllergies.some(allergy => ing.name.toLowerCase().includes(allergy))
        );

        if (hasTriggerAllergen || hasIngredientAllergen) {
          matchAllergies = false;
        }
      }

      return matchSearch && matchCuisine && matchMeal && matchDiet && matchPrep && matchDifficulty && matchCost && matchAllergies;
    });
  }, [recipes, search, cuisineFilter, mealTypeFilter, dietFilter, maxPrepTime, difficultyFilter, maxCost, safeAllergiesToggle, profile]);

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <header className="border-b border-primary/10 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary">Browse Recipes</h1>
        <p className="text-text-muted mt-1 text-sm">
          Explore our local-first recipe library, complete with detailed macro profiles, customizable serving options, and allergen filtering.
        </p>
      </header>

      {/* Filters Card */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-2 text-primary font-bold text-sm border-b border-primary/10 pb-2">
          <FilterIcon className="w-4 h-4 text-accent" />
          <span>Search & Filters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Text Search */}
          <div className="relative md:col-span-2">
            <label htmlFor="recipe-search" className="sr-only">Search recipes</label>
            <input
              id="recipe-search"
              type="text"
              className="w-full pl-10 pr-4 py-2.5 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm"
              placeholder="Search recipes by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <SearchList01Icon className="w-5 h-5 absolute left-3 top-3 text-text-muted" />
          </div>

          {/* Cuisine Select */}
          <div>
            <label htmlFor="cuisine-select" className="sr-only">Filter by Cuisine</label>
            <select
              id="cuisine-select"
              className="w-full px-3 py-2.5 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm text-text"
              value={cuisineFilter}
              onChange={(e) => setCuisineFilter(e.target.value)}
            >
              <option value="all">All Cuisines</option>
              {cuisines.filter(c => c !== 'all').map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)} Cuisine
                </option>
              ))}
            </select>
          </div>

          {/* Meal Type Select */}
          <div>
            <label htmlFor="mealtype-select" className="sr-only">Filter by Meal Type</label>
            <select
              id="mealtype-select"
              className="w-full px-3 py-2.5 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm text-text"
              value={mealTypeFilter}
              onChange={(e) => setMealTypeFilter(e.target.value)}
            >
              <option value="all">All Meal Slots</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snacks</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
          {/* Diet Select */}
          <div>
            <label htmlFor="diet-select" className="text-xs font-bold text-text-muted block mb-1.5">Diet Requirement</label>
            <select
              id="diet-select"
              className="w-full px-3 py-2 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm text-text"
              value={dietFilter}
              onChange={(e) => setDietFilter(e.target.value)}
            >
              <option value="all">Any Diet</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="pescatarian">Pescatarian</option>
              <option value="diabetic_friendly">Diabetic Friendly</option>
              <option value="gluten_free">Gluten Free</option>
              <option value="keto">Keto</option>
              <option value="low_carb">Low Carb</option>
              <option value="dairy_free">Dairy Free</option>
            </select>
          </div>

          {/* Difficulty Select */}
          <div>
            <label htmlFor="difficulty-select" className="text-xs font-bold text-text-muted block mb-1.5">Cooking Skill Required</label>
            <select
              id="difficulty-select"
              className="w-full px-3 py-2 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm text-text"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="all">Any Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Max Prep Time Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-text-muted">
              <label htmlFor="prep-slider">Max Prep Time</label>
              <span>{maxPrepTime === 120 ? 'Any' : `${maxPrepTime} mins`}</span>
            </div>
            <input
              id="prep-slider"
              type="range"
              min="5"
              max="120"
              step="5"
              className="w-full accent-primary bg-primary/20 rounded h-1.5 cursor-pointer"
              value={maxPrepTime}
              onChange={(e) => setMaxPrepTime(Number(e.target.value))}
            />
          </div>

          {/* Max Cost per serving Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-text-muted">
              <label htmlFor="cost-slider">Max Cost / Serving</label>
              <span>{maxCost === 5000 ? 'Any' : `₦${maxCost}`}</span>
            </div>
            <input
              id="cost-slider"
              type="range"
              min="200"
              max="5000"
              step="100"
              className="w-full accent-primary bg-primary/20 rounded h-1.5 cursor-pointer"
              value={maxCost}
              onChange={(e) => setMaxCost(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Allergy Toggle Switch */}
        {profile?.allergies && profile.allergies.length > 0 && (
          <div className="flex items-center gap-3 pt-3 border-t border-primary/10">
            <input
              id="allergy-safe-toggle"
              type="checkbox"
              className="w-4 h-4 accent-primary rounded cursor-pointer"
              checked={safeAllergiesToggle}
              onChange={(e) => setSafeAllergiesToggle(e.target.checked)}
            />
            <label htmlFor="allergy-safe-toggle" className="text-xs font-bold text-text flex items-center gap-1.5 cursor-pointer select-none">
              <TickDouble02Icon className="w-4 h-4 text-success" />
              Safe for my allergies (Hides recipes containing: {profile.allergies.join(', ')})
            </label>
          </div>
        )}
      </Card>

      {/* Recipe Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.length === 0 ? (
          <div className="col-span-full py-16 text-center text-text-muted space-y-2">
            <p className="text-lg font-bold text-primary">No recipes match your filter options</p>
            <p className="text-xs">Try clearing search terms or sliding time/budget limits up.</p>
          </div>
        ) : (
          filteredRecipes.map((recipe) => (
            <Card key={recipe.id} className="p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                {/* Mock image container */}
                <div className="w-full h-40 rounded bg-primary/10 overflow-hidden relative border border-primary/5 flex items-center justify-center text-text-muted">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-accent/5 to-transparent" />
                  <Clock01Icon className="w-10 h-10 opacity-30" />
                </div>

                <div>
                  <h3 className="font-display font-black text-xl text-primary leading-snug">{recipe.name}</h3>
                  <span className="text-xs text-text-muted capitalize">
                    {recipe.cuisine} • {recipe.difficulty}
                  </span>
                </div>
                
                <p className="text-xs text-text-muted line-clamp-2">{recipe.description}</p>
                
                {/* Diet tags (excluding allergens) */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {recipe.dietTags.filter(t => t !== 'none').slice(0, 3).map((t) => (
                    <Tag key={t} variant="primary" className="text-[9px]">
                      {t.replace('_', ' ')}
                    </Tag>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-primary/10 mt-4 flex justify-between items-center">
                <div className="text-xs">
                  <span className="font-bold text-text block">₦{recipe.estimatedCostPerServing.toLocaleString()}</span>
                  <span className="text-[10px] text-text-muted">{recipe.nutritionPerServing.calories} kcal / serving</span>
                </div>
                <Link to={`/recipes/${recipe.id}`}>
                  <Button variant="primary" size="sm" className="text-xs">
                    View Recipe
                  </Button>
                </Link>
              </div>
            </Card>
          ))
        )}
      </section>
    </div>
  );
};
export default RecipesPage;
