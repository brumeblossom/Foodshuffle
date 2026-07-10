import React, { useEffect, useState } from 'react';
import { usePantryStore } from '../../app/pantryStore';
import { useProfileStore } from '../../app/profileStore';
import { usePlanStore } from '../../app/planStore';
import { useUiStore } from '../../app/uiStore';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Tag } from '../../components/Tag';
import { matchRecipes, parsePantryInput, type FridgeMatch } from '../../core/fridgeMatcher';
import { getRecipes } from '../../data/repo';
import type { Recipe, MealType, DietTag } from '../../data/types';
import { 
  Cancel01Icon, 
  SearchList01Icon, 
  ChefHatIcon, 
  Calendar01Icon,
  HelpCircleIcon
} from 'hugeicons-react';
import { Link } from 'react-router-dom';

export const FridgePage: React.FC = () => {
  const { items, loadPantry, addItemsFromText, removeItem, clearPantry } = usePantryStore();
  const { profile, dailyTarget } = useProfileStore();
  const { swapMeal, currentPlan } = usePlanStore();
  const addToast = useUiStore((state) => state.addToast);

  const [rawInput, setRawInput] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [safeToggle, setSafeToggle] = useState(true);
  const [isSearched, setIsSearched] = useState(false);
  const [matches, setMatches] = useState<FridgeMatch[]>([]);

  // Add to plan state per recipe card
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>(null);
  const [scheduleDay, setScheduleDay] = useState<number>(0);
  const [scheduleSlot, setScheduleSlot] = useState<MealType>('breakfast');

  const daysOfWeekNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Load saved pantry inventory and recipes database on mount
  useEffect(() => {
    loadPantry();
    getRecipes().then((dbRecipes) => {
      setRecipes(dbRecipes);
    }).catch(err => {
      console.error('Failed to load recipes in FridgePage:', err);
    });
  }, [loadPantry]);

  // Execute match recipes logic
  const handleFindRecipes = () => {
    setIsSearched(true);
    const parsedIngredients = parsePantryInput(rawInput);
    
    // Construct recommendation context based on allergy check toggle
    const ctxProfile = safeToggle && profile
      ? profile
      : {
          id: 'primary' as const,
          name: '',
          goal: 'general_health' as const,
          dietTags: [] as DietTag[],
          allergies: [] as string[],
          favoriteFoods: [],
          currency: 'NGN',
          includeSnacks: false,
          onboardingComplete: true,
          createdAt: '',
          updatedAt: '',
        };

    const results = matchRecipes(parsedIngredients, recipes, {
      profile: ctxProfile,
      targetCaloriesPerDay: dailyTarget?.calories || 2000,
    });

    setMatches(results);
  };

  // Saved Pantry Integration
  const handleSaveToPantry = async () => {
    if (!rawInput.trim()) {
      addToast('Please enter ingredients to save first.', 'danger');
      return;
    }

    try {
      await addItemsFromText(rawInput);
      addToast('Ingredients successfully saved to your virtual pantry!', 'success');
      // Reload pantry list
      loadPantry();
    } catch (err) {
      addToast('Failed to save ingredients to pantry.', 'danger');
    }
  };

  const handleLoadSavedPantry = () => {
    if (items.length === 0) {
      addToast('Your virtual pantry is currently empty. Save items first!', 'info');
      return;
    }

    // Convert items array to comma separated text
    const names = items.map(item => item.name).join(', ');
    setRawInput(names);
    addToast('Saved pantry loaded successfully!', 'success');
  };

  const handleRemoveChip = async (id: string, name: string) => {
    try {
      await removeItem(id);
      addToast(`Removed "${name}" from saved pantry.`, 'info');
    } catch (err) {
      addToast('Failed to remove item.', 'danger');
    }
  };

  const handleClearPantry = async () => {
    if (window.confirm('Are you sure you want to clear your virtual pantry?')) {
      try {
        await clearPantry();
        addToast('Cleared saved virtual pantry.', 'info');
      } catch (err) {
        addToast('Failed to clear pantry.', 'danger');
      }
    }
  };

  // Add selected recipe to planner
  const handleAddToPlan = async (recipe: Recipe) => {
    if (!currentPlan) {
      addToast('No active meal plan found. Generate a plan first.', 'danger');
      return;
    }

    try {
      await swapMeal(scheduleDay, scheduleSlot, recipe);
      addToast(`Added ${recipe.name} to ${daysOfWeekNames[scheduleDay]}'s ${scheduleSlot}!`, 'success');
      setActiveRecipeId(null); // Close scheduler box
    } catch (err) {
      console.error(err);
      addToast('Failed to schedule recipe.', 'danger');
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <header className="border-b border-primary/10 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary">Cook From Fridge</h1>
        <p className="text-text-muted mt-1 text-sm">
          Rank meals based on what is in your kitchen right now. Minimize grocery shopping and reduce waste.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side Panel: Pantry & Inputs */}
        <section className="lg:col-span-1 space-y-6">
          <Card className="p-6 space-y-6">
            <h2 className="text-xl font-bold font-display text-primary border-b border-primary/10 pb-2 flex items-center gap-2">
              <SearchList01Icon className="w-5 h-5 text-accent" />
              Kitchen Inventory
            </h2>

            {/* Ingredients Text Area */}
            <div className="space-y-2">
              <label htmlFor="pantry-textarea" className="text-xs font-bold text-text-muted block">
                Enter ingredients you currently have (comma or newline separated):
              </label>
              <textarea
                id="pantry-textarea"
                rows={6}
                className="w-full p-3 rounded border border-border bg-surface text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent font-mono leading-relaxed"
                placeholder="chicken breast, white rice, eggs, fresh pepper, plantain..."
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
              />
            </div>

            {/* Allergy Safe Constraint Checkbox */}
            {profile && (profile.allergies.length > 0 || profile.dietTags.length > 0) && (
              <div className="flex items-start gap-2.5 p-3 bg-primary/5 rounded border border-primary/5">
                <input
                  id="fridge-safe-toggle"
                  type="checkbox"
                  className="w-4 h-4 accent-primary rounded cursor-pointer mt-0.5"
                  checked={safeToggle}
                  onChange={(e) => setSafeToggle(e.target.checked)}
                />
                <label htmlFor="fridge-safe-toggle" className="text-xs font-bold text-text leading-tight cursor-pointer select-none">
                  Respect my allergy & diet tags
                  <span className="block text-[10px] text-text-muted mt-0.5 font-normal">
                    Excludes recipes containing: {profile.allergies.join(', ')}
                  </span>
                </label>
              </div>
            )}

            {/* Buttons Row */}
            <div className="space-y-2 pt-2">
              <Button 
                variant="primary" 
                onClick={handleFindRecipes} 
                className="w-full py-2.5 flex justify-center items-center gap-2 text-sm"
              >
                <ChefHatIcon className="w-4.5 h-4.5" />
                Find Matching Recipes
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="ghost" 
                  onClick={handleSaveToPantry}
                  className="text-xs py-2 flex items-center justify-center gap-1.5"
                  title="Persist text items to virtual fridge"
                >
                  Save Pantry
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleLoadSavedPantry}
                  className="text-xs py-2 flex items-center justify-center gap-1.5"
                  title="Populate input text from saved fridge items"
                >
                  Load Pantry
                </Button>
              </div>
            </div>
          </Card>

          {/* Virtual Fridge Persistent Chips */}
          <Card className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-primary/10 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted">
                Saved Virtual Fridge ({items.length})
              </h3>
              {items.length > 0 && (
                <button 
                  onClick={handleClearPantry} 
                  className="text-[10px] font-bold text-danger hover:underline focus:outline-none"
                >
                  Clear Saved
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <p className="text-xs text-text-muted py-4 text-center leading-relaxed">
                Your virtual fridge is empty. Type ingredients above and click "Save Pantry" to store them.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-primary/10 border border-primary/20 text-xs font-bold text-primary"
                  >
                    <span>{item.name}</span>
                    <button
                      onClick={() => handleRemoveChip(item.id, item.name)}
                      className="text-text-muted hover:text-danger rounded-full focus:outline-none p-0.5 shrink-0"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Cancel01Icon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>

        {/* Right Side: Matches List Grid */}
        <section className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold font-display text-primary border-b border-primary/10 pb-2">
            Matching Results {isSearched && `(${matches.length})`}
          </h2>

          {/* Empty state: User hasn't clicked search yet */}
          {!isSearched && (
            <Card className="p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto text-accent">
                <SearchList01Icon className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h3 className="text-lg font-bold text-primary">Discover Fridge Matches</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Enter the ingredients you currently have in your kitchen on the left panel, and click "Find Matching Recipes" to see ranked matching options.
                </p>
              </div>
            </Card>
          )}

          {/* No match state */}
          {isSearched && matches.length === 0 && (
            <Card className="p-12 text-center space-y-4 border border-dashed border-accent/35">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto text-accent">
                <HelpCircleIcon className="w-6 h-6" />
              </div>
              <div className="space-y-2 max-w-sm mx-auto">
                <h3 className="text-lg font-bold text-primary">No Matching Recipes Found</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  We couldn't find any recipes in our library that match your ingredients list. Try adjusting search terms.
                </p>
                <div className="bg-primary/5 p-3 rounded text-[11px] text-accent font-semibold flex items-center gap-1.5 justify-center mt-2 border border-primary/5">
                  💡 Hint: Try adding a protein (e.g. chicken, fish, beans) or a base (e.g. rice, flour, yams) to unlock matching options!
                </div>
              </div>
            </Card>
          )}

          {/* Match results list grid */}
          {isSearched && matches.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matches.map(({ recipe, haveCount, totalCount, matchPct, missing }) => (
                <Card key={recipe.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative">
                  <div className="space-y-4">
                    
                    {/* Header: Title & percentage score */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-display font-black text-lg text-primary leading-snug">{recipe.name}</h3>
                        <span className="text-[10px] text-text-muted capitalize block mt-0.5">
                          {recipe.cuisine} Cuisine • {recipe.difficulty}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xl font-black text-accent">{Math.round(matchPct)}%</span>
                        <span className="text-[9px] text-text-muted block font-bold uppercase tracking-wider mt-0.5">
                          {haveCount} / {totalCount} items
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">{recipe.description}</p>
                    
                    {/* Key tags (excluding allergens) */}
                    <div className="flex flex-wrap gap-1">
                      {recipe.dietTags.filter(t => t !== 'none').slice(0, 2).map((t) => (
                        <Tag key={t} variant="primary" className="text-[9px] font-sans font-bold">
                          {t.replace('_', ' ')}
                        </Tag>
                      ))}
                    </div>

                    {/* Missing Ingredients Checklist */}
                    {missing.length > 0 && (
                      <div className="text-xs pt-1">
                        <span className="font-bold text-text-muted block mb-1">Missing ({missing.length}):</span>
                        <div className="flex flex-wrap gap-1">
                          {missing.map((m, idx) => (
                            <span 
                              key={idx} 
                              className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-danger/5 text-danger border border-danger/10"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-primary/10 mt-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-muted font-bold">₦{recipe.estimatedCostPerServing.toLocaleString()} / serving</span>
                      <Link to={`/recipes/${recipe.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs px-2.5">
                          View Instructions
                        </Button>
                      </Link>
                    </div>

                    {/* Add to weekly plan toggle action */}
                    {currentPlan && (
                      <div className="border-t border-primary/5 pt-2">
                        {activeRecipeId === recipe.id ? (
                          <div className="space-y-2 bg-primary/5 p-3 rounded text-[11px] border border-primary/5">
                            <div className="grid grid-cols-2 gap-2">
                              {/* Day Select */}
                              <div>
                                <label htmlFor={`day-select-${recipe.id}`} className="font-bold text-text-muted block mb-0.5">Day</label>
                                <select
                                  id={`day-select-${recipe.id}`}
                                  className="w-full px-2 py-1.5 rounded border border-primary/20 bg-surface focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                                  value={scheduleDay}
                                  onChange={(e) => setScheduleDay(Number(e.target.value))}
                                >
                                  {daysOfWeekNames.map((name, i) => (
                                    <option key={i} value={i}>{name}</option>
                                  ))}
                                </select>
                              </div>
                              {/* Slot Select */}
                              <div>
                                <label htmlFor={`slot-select-${recipe.id}`} className="font-bold text-text-muted block mb-0.5">Slot</label>
                                <select
                                  id={`slot-select-${recipe.id}`}
                                  className="w-full px-2 py-1.5 rounded border border-primary/20 bg-surface focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                                  value={scheduleSlot}
                                  onChange={(e) => setScheduleSlot(e.target.value as MealType)}
                                >
                                  <option value="breakfast">Breakfast</option>
                                  <option value="lunch">Lunch</option>
                                  <option value="dinner">Dinner</option>
                                  {profile?.includeSnacks && <option value="snack">Snack</option>}
                                </select>
                              </div>
                            </div>
                            <div className="flex gap-1.5 pt-1">
                              <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={() => handleAddToPlan(recipe)}
                                className="flex-1 py-1.5 text-[10px]"
                              >
                                Confirm Add
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setActiveRecipeId(null)}
                                className="py-1.5 text-[10px]"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button 
                            variant="accent" 
                            size="sm" 
                            onClick={() => {
                              setActiveRecipeId(recipe.id);
                              setScheduleDay(0);
                              setScheduleSlot('breakfast');
                            }}
                            className="w-full py-2 flex items-center justify-center gap-1 text-[11px]"
                          >
                            <Calendar01Icon className="w-3.5 h-3.5" />
                            Schedule This Week
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};
export default FridgePage;
