import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePlanStore } from '../../app/planStore';
import { useProfileStore } from '../../app/profileStore';
import { useUiStore } from '../../app/uiStore';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Tag } from '../../components/Tag';
import { getRecipes } from '../../data/repo';
import { container } from '../../core/compositionRoot';
import type { MealType, Recipe } from '../../data/types';
import { 
  LockIcon, 
  RefreshIcon, 
  Calendar01Icon,
  AlertCircleIcon,
  EyeIcon,
  PlayIcon
} from 'hugeicons-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export const ThisWeekPage: React.FC = () => {
  const { currentPlan, loadCurrentPlan, generateWeeklyPlan, regeneratePlan, swapMeal, toggleLockMeal } = usePlanStore();
  const { profile, dailyTarget, macroTargets } = useProfileStore();
  const addToast = useUiStore((state) => state.addToast);

  // Recipes state loaded from db
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [animationKey, setAnimationKey] = useState(0);

  // Swap modal local state
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [swapDayIndex, setSwapDayIndex] = useState<number | null>(null);
  const [swapSlot, setSwapSlot] = useState<MealType | null>(null);
  const [swapOptions, setSwapOptions] = useState<Recipe[]>([]);

  useEffect(() => {
    loadCurrentPlan();
    getRecipes().then((dbRecipes) => {
      setRecipes(dbRecipes);
    }).catch(err => {
      console.error('Failed to load recipes for details:', err);
    });
  }, [loadCurrentPlan]);

  const recipeMap = useMemo(() => new Map(recipes.map((r) => [r.id, r])), [recipes]);

  // Compute daily aggregates
  const dayAggregates = useMemo(() => {
    if (!currentPlan) return [];
    return currentPlan.days.map((day) => {
      let calories = 0;
      let protein = 0;
      let carbs = 0;
      let fat = 0;
      let cost = 0;

      const addMeal = (recipeId: string, servings: number) => {
        const recipe = recipeMap.get(recipeId);
        if (recipe) {
          calories += recipe.nutritionPerServing.calories * servings;
          protein += recipe.nutritionPerServing.protein * servings;
          carbs += recipe.nutritionPerServing.carbs * servings;
          fat += recipe.nutritionPerServing.fat * servings;
          cost += recipe.estimatedCostPerServing * servings;
        }
      };

      if (day.breakfast) addMeal(day.breakfast.recipeId, day.breakfast.servings);
      if (day.lunch) addMeal(day.lunch.recipeId, day.lunch.servings);
      if (day.dinner) addMeal(day.dinner.recipeId, day.dinner.servings);
      if (day.snacks) {
        for (const s of day.snacks) {
          addMeal(s.recipeId, s.servings);
        }
      }

      return {
        calories: Math.round(calories),
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fat: Math.round(fat),
        cost: Math.round(cost),
      };
    });
  }, [currentPlan, recipeMap]);

  // Weekly aggregate computations for Recharts
  const weeklyAggregates = useMemo(() => {
    let totalCal = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    dayAggregates.forEach(day => {
      totalCal += day.calories;
      totalProtein += day.protein;
      totalCarbs += day.carbs;
      totalFat += day.fat;
    });

    const activeDays = dayAggregates.length || 7;
    const avgCal = Math.round(totalCal / activeDays);

    const pKcal = totalProtein * 4;
    const cKcal = totalCarbs * 4;
    const fKcal = totalFat * 9;

    return {
      avgCalories: avgCal,
      chartData: [
        { name: 'Protein', value: pKcal, grams: totalProtein, color: 'var(--accent)' },
        { name: 'Carbs', value: cKcal, grams: totalCarbs, color: 'var(--highlight)' },
        { name: 'Fat', value: fKcal, grams: totalFat, color: 'var(--primary)' }
      ]
    };
  }, [dayAggregates]);

  // Handle plan regeneration
  const handleRegenerate = async () => {
    try {
      await regeneratePlan();
      setAnimationKey(prev => prev + 1);
      addToast('Plan regenerated! Kept locked meals.', 'success');
    } catch (err) {
      addToast('Failed to regenerate plan.', 'danger');
    }
  };

  const handleGenerateFirstPlan = async () => {
    try {
      const todayString = new Date().toISOString().split('T')[0];
      await generateWeeklyPlan(todayString);
      setAnimationKey(prev => prev + 1);
      addToast('New weekly plan generated successfully!', 'success');
    } catch (err) {
      addToast('Failed to generate plan.', 'danger');
    }
  };

  // Open swap dialog and fetch options
  const openSwapModal = (dayIndex: number, slot: MealType) => {
    if (!currentPlan || !profile) return;
    setSwapDayIndex(dayIndex);
    setSwapSlot(slot);

    // Call swap suggestions from composition root
    const options = container.recommendationProvider.suggestSwap(
      dayIndex,
      slot,
      currentPlan,
      recipes,
      profile
    );

    setSwapOptions(options.slice(0, 5)); // show top 5 alternatives
    setIsSwapModalOpen(true);
  };

  const handleApplySwap = async (recipe: Recipe) => {
    if (swapDayIndex === null || !swapSlot) return;
    try {
      await swapMeal(swapDayIndex, swapSlot, recipe);
      setIsSwapModalOpen(false);
      addToast('Meal swapped successfully!', 'success');
    } catch (err) {
      addToast('Failed to swap meal.', 'danger');
    }
  };

  const daysOfWeekNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  if (!currentPlan) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 max-w-md mx-auto font-sans">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Calendar01Icon className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-primary font-display">No Plan Generated</h2>
          <p className="text-text-muted text-sm leading-relaxed">
            You don't have a meal plan configured for this week yet. Let's build a customized 7-day schedule adhering to your budget, calorie limit, and diet preferences.
          </p>
        </div>
        <Button variant="accent" onClick={handleGenerateFirstPlan} className="w-full py-3 flex items-center justify-center gap-2">
          <PlayIcon className="w-4 h-4" />
          Generate Your Weekly Plan
        </Button>
      </div>
    );
  }

  // Budget validation: budget slice is monthly / 4.33
  const budgetLimit = profile?.monthlyBudget ? profile.monthlyBudget / 4.33 : 15000;
  const isOverBudget = currentPlan.estimatedWeeklyCost > budgetLimit;

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-primary/10 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">This Week's Meal Plan</h1>
          <p className="text-text-muted mt-1 text-sm">
            Manage your lock preferences, swap dishes, and track grocery costs and calorie targets.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={handleRegenerate} className="flex items-center gap-2">
            <RefreshIcon className="w-4 h-4" />
            Regenerate Week
          </Button>
          <Button variant="ghost" onClick={handleGenerateFirstPlan}>
            Fresh Generate
          </Button>
        </div>
      </header>

      {/* Plan Insights Widgets */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Cost & Budget */}
        <Card className={`p-5 flex flex-col justify-between border ${isOverBudget ? 'border-danger/30 bg-danger/5' : 'border-primary/10'}`}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Estimated Weekly Cost</span>
            {isOverBudget && <AlertCircleIcon className="w-4 h-4 text-danger" />}
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-accent">₦{currentPlan.estimatedWeeklyCost.toLocaleString()}</span>
            {profile?.monthlyBudget && (
              <p className="text-xs text-text-muted mt-1">
                Target Slice: ₦{Math.round(budgetLimit).toLocaleString()}/week
              </p>
            )}
          </div>
          {isOverBudget && (
            <div className="text-[10px] text-danger font-semibold bg-danger/10 p-2 rounded">
              Cost exceeds your target weekly budget limit.
            </div>
          )}
        </Card>

        {/* Target Calories */}
        <Card className="p-5 flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Average Calories</span>
          <div className="my-2">
            <span className="text-3xl font-black text-primary">
              {weeklyAggregates.avgCalories} kcal/day
            </span>
            <p className="text-xs text-text-muted mt-1">
              Target: {dailyTarget?.calories || 2000} kcal ({dailyTarget?.isEstimate ? 'Estimate' : 'MSJ Computed'})
            </p>
          </div>
        </Card>

        {/* Macro Split Recharts Pie */}
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Macro Split Distribution</span>
          <div className="grid grid-cols-2 gap-2 items-center">
            <div className="h-28 w-full" role="img" aria-label="Macro split pie chart showing protein, carbohydrates, and fats distributions">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={weeklyAggregates.chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={45}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {weeklyAggregates.chartData.map((entry, index) => (
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
            
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                <span className="font-semibold text-text">P: {macroTargets?.proteinG}g</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-highlight border border-primary/10" />
                <span className="font-semibold text-text">C: {macroTargets?.carbsG}g</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="font-semibold text-text">F: {macroTargets?.fatG}g</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 3 columns x 3 rows grid layout */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPlan.days.map((day, dayIndex) => {
          const stats = dayAggregates[dayIndex] || { calories: 0, protein: 0, carbs: 0, fat: 0, cost: 0 };
          const limit = dailyTarget?.calories || 2000;
          const isOver = stats.calories > limit;
          const calPercent = Math.min((stats.calories / limit) * 100, 100);

          return (
            <Card 
              key={`${dayIndex}-${animationKey}`} 
              className="p-4 flex flex-col justify-between hover:shadow-md transition-shadow animate-fade-in motion-reduce:animate-none"
              style={{
                animationDelay: `${dayIndex * 70}ms`,
                animationFillMode: 'both',
              }}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="border-b border-primary/10 pb-2">
                  <h2 className="font-display font-black text-lg text-primary">{daysOfWeekNames[dayIndex]}</h2>
                  <span className="text-[10px] text-text-muted font-mono">{day.date}</span>
                </div>

                {/* Slots */}
                <div className="space-y-3">
                  {/* Breakfast */}
                  {day.breakfast && (
                    <div className="text-xs bg-primary/5 p-2 rounded border border-primary/5 space-y-1">
                      <div className="flex justify-between items-center">
                        <Tag variant="primary" className="text-[9px] px-1 font-black">Breakfast</Tag>
                        <button
                          type="button"
                          onClick={() => toggleLockMeal(dayIndex, 'breakfast')}
                          className="text-text-muted hover:text-accent p-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                          aria-label={day.breakfast.locked ? 'Unlock breakfast' : 'Lock breakfast'}
                        >
                          <LockIcon className={`w-3 h-3 ${day.breakfast.locked ? 'text-accent' : 'opacity-40'}`} />
                        </button>
                      </div>
                      
                      <span className="font-bold text-text block truncate leading-tight">
                        {recipeMap.get(day.breakfast.recipeId)?.name || 'Recipe Loading...'}
                      </span>

                      {/* Info & Action Row */}
                      <div className="flex justify-between items-center pt-1 border-t border-primary/5">
                        <Link 
                          to={`/recipes/${day.breakfast.recipeId}`}
                          className="inline-flex items-center text-[10px] font-bold text-text-muted hover:text-accent focus:outline-none"
                          title="View Recipe Details"
                        >
                          <EyeIcon className="w-2.5 h-2.5 mr-0.5" />
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => openSwapModal(dayIndex, 'breakfast')}
                          className="text-[10px] font-extrabold text-primary hover:text-accent focus:outline-none"
                        >
                          Swap
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Lunch */}
                  {day.lunch && (
                    <div className="text-xs bg-primary/5 p-2 rounded border border-primary/5 space-y-1">
                      <div className="flex justify-between items-center">
                        <Tag variant="success" className="text-[9px] px-1 font-black">Lunch</Tag>
                        <button
                          type="button"
                          onClick={() => toggleLockMeal(dayIndex, 'lunch')}
                          className="text-text-muted hover:text-accent p-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                          aria-label={day.lunch.locked ? 'Unlock lunch' : 'Lock lunch'}
                        >
                          <LockIcon className={`w-3 h-3 ${day.lunch.locked ? 'text-accent' : 'opacity-40'}`} />
                        </button>
                      </div>
                      
                      <span className="font-bold text-text block truncate leading-tight">
                        {recipeMap.get(day.lunch.recipeId)?.name || 'Recipe Loading...'}
                      </span>

                      {/* Info & Action Row */}
                      <div className="flex justify-between items-center pt-1 border-t border-primary/5">
                        <Link 
                          to={`/recipes/${day.lunch.recipeId}`}
                          className="inline-flex items-center text-[10px] font-bold text-text-muted hover:text-accent focus:outline-none"
                          title="View Recipe Details"
                        >
                          <EyeIcon className="w-2.5 h-2.5 mr-0.5" />
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => openSwapModal(dayIndex, 'lunch')}
                          className="text-[10px] font-extrabold text-primary hover:text-accent focus:outline-none"
                        >
                          Swap
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Snacks */}
                  {day.snacks &&
                    day.snacks.map((snack, snackIdx) => (
                      <div key={snackIdx} className="text-xs bg-primary/5 p-2 rounded border border-primary/5 space-y-1">
                        <div className="flex justify-between items-center">
                          <Tag variant="highlight" className="text-[9px] px-1 font-black">Snack</Tag>
                          <button
                            type="button"
                            onClick={() => toggleLockMeal(dayIndex, 'snack', snackIdx)}
                            className="text-text-muted hover:text-accent p-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                            aria-label={snack.locked ? 'Unlock snack' : 'Lock snack'}
                          >
                            <LockIcon className={`w-3 h-3 ${snack.locked ? 'text-accent' : 'opacity-40'}`} />
                          </button>
                        </div>
                        
                        <span className="font-bold text-text block truncate leading-tight">
                          {recipeMap.get(snack.recipeId)?.name || 'Recipe Loading...'}
                        </span>

                        {/* Info & Action Row */}
                        <div className="flex justify-between items-center pt-1 border-t border-primary/5">
                          <Link 
                            to={`/recipes/${snack.recipeId}`}
                            className="inline-flex items-center text-[10px] font-bold text-text-muted hover:text-accent focus:outline-none"
                            title="View Recipe Details"
                          >
                            <EyeIcon className="w-2.5 h-2.5 mr-0.5" />
                            View
                          </Link>
                          <button
                            type="button"
                            onClick={() => openSwapModal(dayIndex, 'snack')}
                            className="text-[10px] font-extrabold text-primary hover:text-accent focus:outline-none"
                          >
                            Swap
                          </button>
                        </div>
                      </div>
                    ))}

                  {/* Dinner */}
                  {day.dinner && (
                    <div className="text-xs bg-primary/5 p-2 rounded border border-primary/5 space-y-1">
                      <div className="flex justify-between items-center">
                        <Tag variant="accent" className="text-[9px] px-1 font-black">Dinner</Tag>
                        <button
                          type="button"
                          onClick={() => toggleLockMeal(dayIndex, 'dinner')}
                          className="text-text-muted hover:text-accent p-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                          aria-label={day.dinner.locked ? 'Unlock dinner' : 'Lock dinner'}
                        >
                          <LockIcon className={`w-3 h-3 ${day.dinner.locked ? 'text-accent' : 'opacity-40'}`} />
                        </button>
                      </div>
                      
                      <span className="font-bold text-text block truncate leading-tight">
                        {recipeMap.get(day.dinner.recipeId)?.name || 'Recipe Loading...'}
                      </span>

                      {/* Info & Action Row */}
                      <div className="flex justify-between items-center pt-1 border-t border-primary/5">
                        <Link 
                          to={`/recipes/${day.dinner.recipeId}`}
                          className="inline-flex items-center text-[10px] font-bold text-text-muted hover:text-accent focus:outline-none"
                          title="View Recipe Details"
                        >
                          <EyeIcon className="w-2.5 h-2.5 mr-0.5" />
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => openSwapModal(dayIndex, 'dinner')}
                          className="text-[10px] font-extrabold text-primary hover:text-accent focus:outline-none"
                        >
                          Swap
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Day cost and calorie meter */}
              <div className="mt-4 border-t border-primary/10 pt-3 space-y-2">
                <div className="flex justify-between text-[11px] font-semibold text-text-muted">
                  <span className={isOver ? 'text-danger font-bold' : 'text-text-muted'}>
                    {stats.calories} kcal
                  </span>
                  <span>₦{stats.cost}</span>
                </div>
                
                {/* Progress bar container */}
                <div className="w-full h-2 rounded-full bg-primary/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300 ease-out"
                    style={{
                      width: `${calPercent}%`,
                      backgroundColor: isOver ? 'var(--danger)' : 'var(--primary)',
                    }}
                  />
                </div>
                {isOver && (
                  <span className="text-[9px] font-black text-danger uppercase block text-right tracking-tight">
                    Calorie Limit Exceeded
                  </span>
                )}
              </div>
            </Card>
          );
        })}

        {/* Shortcut 1: Virtual Fridge */}
        <Card className="p-4 flex flex-col justify-between border border-dashed border-border bg-surface/30 opacity-90 shadow-none hover:shadow-sm">
          <div className="space-y-3">
            <div className="border-b border-primary/10 pb-2">
              <h2 className="font-display font-black text-lg text-primary">Leftovers?</h2>
              <span className="text-[10px] text-text-muted font-mono">Kitchen Inventory</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Have extra ingredients in your fridge? Enter them in our Virtual Fridge matcher to find recipe suggestions you can make today.
            </p>
          </div>
          <div className="pt-4">
            <Link
              to="/fridge"
              className="inline-flex items-center justify-center font-sans font-semibold rounded transition-all duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] px-4 py-2.5 text-xs bg-primary text-primary-fg hover:bg-primary/90 border border-transparent shadow-sm w-full text-center"
            >
              Open Virtual Fridge
            </Link>
          </div>
        </Card>

        {/* Shortcut 2: Browse Recipes */}
        <Card className="p-4 flex flex-col justify-between border border-dashed border-border bg-surface/30 opacity-90 shadow-none hover:shadow-sm">
          <div className="space-y-3">
            <div className="border-b border-primary/10 pb-2">
              <h2 className="font-display font-black text-lg text-primary">Need Ideas?</h2>
              <span className="text-[10px] text-text-muted font-mono">Discover Recipes</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Explore our full database of healthy meals across all slots. Filter by difficulty, cuisines, budget, and allergy safety.
            </p>
          </div>
          <div className="pt-4">
            <Link
              to="/recipes"
              className="inline-flex items-center justify-center font-sans font-semibold rounded transition-all duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] px-4 py-2.5 text-xs bg-primary text-primary-fg hover:bg-primary/90 border border-transparent shadow-sm w-full text-center"
            >
              Browse Recipes
            </Link>
          </div>
        </Card>
      </section>

      {/* Swap Modal alternatives list */}
      {isSwapModalOpen && (
        <Modal
          isOpen={isSwapModalOpen}
          onClose={() => setIsSwapModalOpen(false)}
          title="Select Swap Alternative"
        >
          <div className="space-y-4 font-sans">
            <p className="text-xs text-text-muted">
              Choose a replacement recipe satisfying your calorie parameters and preferences.
            </p>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {swapOptions.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-4">
                  No alternative recipes found matching constraints.
                </p>
              ) : (
                swapOptions.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => handleApplySwap(recipe)}
                    className="flex justify-between items-center p-3 rounded bg-primary/5 hover:bg-primary/10 cursor-pointer border border-primary/10 text-sm transition-all active:scale-95"
                  >
                    <div>
                      <span className="font-bold text-primary block">{recipe.name}</span>
                      <span className="text-xs text-text-muted">
                        {recipe.cuisine} • {recipe.nutritionPerServing.calories} kcal
                      </span>
                    </div>
                    <span className="text-xs font-bold text-accent">₦{recipe.estimatedCostPerServing}</span>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end pt-3 border-t border-primary/10">
              <Button variant="ghost" onClick={() => setIsSwapModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default ThisWeekPage;
