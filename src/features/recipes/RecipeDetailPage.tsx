import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRecipeById } from '../../data/repo';
import { usePlanStore } from '../../app/planStore';
import { useUiStore } from '../../app/uiStore';
import { useProfileStore } from '../../app/profileStore';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Tag } from '../../components/Tag';
import { Stepper } from '../../components/Stepper';
import type { Recipe, MealType } from '../../data/types';
import { 
  Clock01Icon, 
  ArrowLeft01Icon, 
  ChefHatIcon, 
  Calendar01Icon
} from 'hugeicons-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addToast = useUiStore((state) => state.addToast);
  const { swapMeal, currentPlan } = usePlanStore();
  const { profile } = useProfileStore();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Servings Stepper State
  const [servings, setServings] = useState<number>(4);

  // Add to plan state
  const [scheduleDay, setScheduleDay] = useState<number>(0);
  const [scheduleSlot, setScheduleSlot] = useState<MealType>('breakfast');

  // Load recipe from Dexie
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getRecipeById(id).then((dbRecipe) => {
        if (dbRecipe) {
          setRecipe(dbRecipe);
          setServings(dbRecipe.servings);
        }
      }).catch(err => {
        console.error('Failed to load recipe details:', err);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [id]);

  // Compute scaled values
  const scaledIngredients = useMemo(() => {
    if (!recipe) return [];
    return recipe.ingredients.map(ing => {
      const ratio = servings / recipe.servings;
      const scaledQty = Math.round((ing.quantity * ratio) * 10) / 10;
      return {
        ...ing,
        scaledQuantity: scaledQty
      };
    });
  }, [recipe, servings]);

  // Compute total batch nutrition
  const totalBatchNutrition = useMemo(() => {
    if (!recipe) return null;
    const ratio = servings / recipe.servings;
    return {
      calories: Math.round(recipe.nutritionPerServing.calories * ratio),
      protein: Math.round(recipe.nutritionPerServing.protein * ratio),
      carbs: Math.round(recipe.nutritionPerServing.carbs * ratio),
      fat: Math.round(recipe.nutritionPerServing.fat * ratio),
    };
  }, [recipe, servings]);

  // Recharts Pie Chart macro split data per serving (which is constant)
  const chartData = useMemo(() => {
    if (!recipe) return [];
    const pKcal = recipe.nutritionPerServing.protein * 4;
    const cKcal = recipe.nutritionPerServing.carbs * 4;
    const fKcal = recipe.nutritionPerServing.fat * 9;
    return [
      { name: 'Protein', value: pKcal, grams: recipe.nutritionPerServing.protein, color: 'var(--accent)' },
      { name: 'Carbs', value: cKcal, grams: recipe.nutritionPerServing.carbs, color: 'var(--highlight)' },
      { name: 'Fat', value: fKcal, grams: recipe.nutritionPerServing.fat, color: 'var(--primary)' }
    ];
  }, [recipe]);

  // Handle schedule to meal plan
  const handleAddToPlan = async () => {
    if (!recipe || !currentPlan) {
      addToast('No active meal plan found. Go to onboarding or generate a plan first.', 'danger');
      return;
    }

    try {
      // Execute the schedule swap
      await swapMeal(scheduleDay, scheduleSlot, recipe);
      addToast(`Added ${recipe.name} to ${daysOfWeekNames[scheduleDay]}'s ${scheduleSlot}!`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to add meal to your weekly plan.', 'danger');
    }
  };

  const daysOfWeekNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center py-20 font-sans max-w-sm mx-auto space-y-4">
        <h2 className="text-2xl font-bold font-display text-primary">Recipe Not Found</h2>
        <p className="text-text-muted text-sm">We couldn't find the recipe you were looking for in the database.</p>
        <Link to="/recipes" className="inline-block pt-2">
          <Button variant="primary">Back to Recipes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <header className="border-b border-primary/10 pb-4">
        <button 
          onClick={() => navigate(-1)} 
          className="text-xs font-bold text-accent hover:underline mb-3 flex items-center gap-1.5 focus:outline-none"
        >
          <ArrowLeft01Icon className="w-4 h-4" />
          Go Back
        </button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-primary font-display leading-tight">{recipe.name}</h1>
            <p className="text-text-muted mt-1.5 text-sm capitalize">
              {recipe.cuisine} Cuisine • {recipe.difficulty} Difficulty
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 cols: description, ingredients, directions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recipe Image Banner */}
          {recipe.imageUrl && (
            <div className="w-full h-64 sm:h-80 rounded overflow-hidden relative border border-primary/5 shadow-sm">
              <img 
                src={recipe.imageUrl} 
                alt={recipe.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          )}

          {/* Description */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-bold font-display text-primary border-b border-primary/10 pb-2">About this recipe</h2>
            <p className="text-sm leading-relaxed text-text-muted">{recipe.description}</p>
          </Card>

          {/* Dynamic Ingredients list */}
          <Card className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-primary/10 pb-3">
              <h2 className="text-xl font-bold font-display text-primary">Ingredients List</h2>
              
              {/* Serving Stepper */}
              <div className="max-w-[180px]">
                <Stepper
                  label="Yields servings"
                  value={servings}
                  min={1}
                  max={20}
                  step={1}
                  onChange={setServings}
                />
              </div>
            </div>

            <ul className="space-y-3" aria-label="Ingredients List">
              {scaledIngredients.map((ing, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    id={`ing-${idx}`}
                    className="w-4.5 h-4.5 accent-primary rounded cursor-pointer shrink-0"
                  />
                  <label htmlFor={`ing-${idx}`} className="cursor-pointer select-none leading-relaxed flex-1 text-text">
                    <span className="font-bold">
                      {ing.scaledQuantity} {ing.unit}
                    </span>{' '}
                    <span>{ing.name}</span>
                    {ing.optional && <span className="text-[10px] text-text-muted italic ml-1">(Optional)</span>}
                  </label>
                </li>
              ))}
            </ul>
          </Card>

          {/* Steps directions */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-bold font-display text-primary border-b border-primary/10 pb-2">Directions</h2>
            <ol className="space-y-4 pl-4 text-sm leading-relaxed text-text-muted">
              {recipe.steps.map((step, idx) => (
                <li key={idx} className="list-decimal pl-2 marker:font-bold marker:text-primary">
                  {step}
                </li>
              ))}
            </ol>
          </Card>
        </div>

        {/* Right 1 col: metadata info and nutrition targets */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recipe Profile Card */}
          <Card className="p-6 space-y-6">
            <h2 className="text-xl font-bold font-display text-primary border-b border-primary/10 pb-2">Recipe Profile</h2>

            {/* Time specifications */}
            <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-text-muted">
              <div className="flex items-center gap-2 bg-primary/5 p-2.5 rounded border border-primary/5">
                <Clock01Icon className="w-4 h-4 text-accent" />
                <span>Prep: {recipe.prepTimeMins} mins</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/5 p-2.5 rounded border border-primary/5">
                <Clock01Icon className="w-4 h-4 text-primary" />
                <span>Cook: {recipe.cookTimeMins} mins</span>
              </div>
            </div>

            {/* Cost metrics */}
            <div className="space-y-1 bg-accent/5 p-4 rounded border border-accent/15">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Estimated cost / serving</span>
              <div className="text-3xl font-black text-accent">₦{recipe.estimatedCostPerServing.toLocaleString()}</div>
            </div>

            {/* Nutrition per serving */}
            <div className="space-y-4 pt-4 border-t border-primary/10">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">Nutrition splits</span>
              
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="h-24 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={20}
                        outerRadius={35}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(_value, name, props) => {
                          const grams = props.payload.grams;
                          return [`${grams}g`, name];
                        }}
                        contentStyle={{
                          backgroundColor: 'var(--surface)',
                          borderColor: 'var(--primary)',
                          borderRadius: '4px',
                          fontSize: '10px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span className="font-semibold text-text">P: {recipe.nutritionPerServing.protein}g</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-highlight border border-primary/10" />
                    <span className="font-semibold text-text">C: {recipe.nutritionPerServing.carbs}g</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-semibold text-text">F: {recipe.nutritionPerServing.fat}g</span>
                  </div>
                </div>
              </div>

              {/* Servings scaled totals vs per-serving */}
              <div className="bg-primary/5 p-3 rounded text-xs space-y-2 border border-primary/5">
                <div className="flex justify-between">
                  <span className="text-text-muted font-semibold">Calories / Serving:</span>
                  <span className="font-black text-primary">{recipe.nutritionPerServing.calories} kcal</span>
                </div>
                {servings !== recipe.servings && totalBatchNutrition && (
                  <div className="flex justify-between border-t border-primary/10 pt-2 text-[11px]">
                    <span className="text-accent font-bold">Total Batch ({servings} serv):</span>
                    <span className="font-black text-accent">{totalBatchNutrition.calories} kcal</span>
                  </div>
                )}
              </div>
            </div>

            {/* Diet and Allergen tags */}
            <div className="space-y-4 pt-4 border-t border-primary/10 text-xs">
              {/* Diet Tags */}
              <div className="space-y-1.5">
                <span className="font-bold text-text-muted uppercase block text-[10px]">Dietary tags</span>
                <div className="flex flex-wrap gap-1">
                  {recipe.dietTags.filter(t => t !== 'none').map((tag) => (
                    <Tag key={tag} variant="primary">
                      {tag.replace('_', ' ')}
                    </Tag>
                  ))}
                </div>
              </div>

              {/* Allergen Tags */}
              {recipe.allergens && recipe.allergens.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-bold text-danger uppercase block text-[10px]">Allergen warnings</span>
                  <div className="flex flex-wrap gap-1">
                    {recipe.allergens.map((allergy) => (
                      <Tag key={allergy} variant="danger">
                        Contains: {allergy.replace('_', ' ')}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Add to Week Planner Box */}
          {currentPlan && (
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-bold font-display text-primary border-b border-primary/10 pb-2 flex items-center gap-1.5">
                <Calendar01Icon className="w-5 h-5 text-accent" />
                Schedule Into Plan
              </h3>
              
              <div className="space-y-3 text-xs">
                {/* Day selector */}
                <div className="space-y-1">
                  <label htmlFor="schedule-day-select" className="font-bold text-text-muted">Target Day</label>
                  <select
                    id="schedule-day-select"
                    className="w-full px-3 py-2 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    value={scheduleDay}
                    onChange={(e) => setScheduleDay(Number(e.target.value))}
                  >
                    {daysOfWeekNames.map((dayName, idx) => (
                      <option key={idx} value={idx}>{dayName}</option>
                    ))}
                  </select>
                </div>

                {/* Slot Selector */}
                <div className="space-y-1">
                  <label htmlFor="schedule-slot-select" className="font-bold text-text-muted">Target Slot</label>
                  <select
                    id="schedule-slot-select"
                    className="w-full px-3 py-2 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    value={scheduleSlot}
                    onChange={(e) => setScheduleSlot(e.target.value as MealType)}
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    {profile?.includeSnacks && <option value="snack">Snack</option>}
                  </select>
                </div>

                <Button variant="accent" onClick={handleAddToPlan} className="w-full py-2.5 mt-2 flex justify-center items-center gap-2">
                  <ChefHatIcon className="w-4 h-4" />
                  Add to My Week
                </Button>
              </div>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
};
export default RecipeDetailPage;
