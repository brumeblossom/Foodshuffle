import React, { useEffect, useState, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfileStore } from '../../app/profileStore';
import { useUiStore } from '../../app/uiStore';
import { UserProfileSchema } from '../../data/validation';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { db } from '../../data/db';
import { SEED_RECIPES } from '../../data/repo';
import type { UserProfile, DietTag, Allergen } from '../../data/types';
import { 
  Cancel01Icon, 
  Settings02Icon, 
  DatabaseIcon,
  ChefHatIcon
} from 'hugeicons-react';

const COMMON_ALLERGENS = [
  'peanuts',
  'tree_nuts',
  'shellfish',
  'fish',
  'gluten',
  'dairy',
  'eggs',
  'soy',
  'sesame'
];

export const ProfilePage: React.FC = () => {
  const { profile, dailyTarget, macroTargets, saveProfile, loadProfile } = useProfileStore();
  const { theme, setTheme, addToast } = useUiStore();

  // Local state for custom chip inputs
  const [favFoodInput, setFavFoodInput] = useState('');
  const [customAllergenInput, setCustomAllergenInput] = useState('');

  // Refs for accessible HTML5 <dialog> modals
  const resetDialogRef = useRef<HTMLDialogElement | null>(null);
  const seedDialogRef = useRef<HTMLDialogElement | null>(null);

  // Setup form methods
  const methods = useForm<UserProfile>({
    resolver: zodResolver(UserProfileSchema) as any,
    mode: 'onChange',
    defaultValues: {
      id: 'primary',
      name: '',
      gender: 'female',
      age: 25,
      heightCm: undefined,
      weightKg: undefined,
      favoriteFoods: [],
      allergies: [],
      dietTags: ['none'],
      activityLevel: 'moderately_active',
      goal: 'general_health',
      monthlyBudget: 50000,
      currency: 'NGN',
      skillLevel: 'intermediate',
      willingnessToCook: 'sometimes',
      cookFrequency: 'few_per_week',
      includeSnacks: false,
      onboardingComplete: true,
    }
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = methods;

  // Watch properties for stateful render updates
  const watchedDiets = watch('dietTags') || ['none'];
  const watchedAllergies = watch('allergies') || [];
  const watchedFavorites = watch('favoriteFoods') || [];

  // Sync profile details into form defaults
  useEffect(() => {
    if (profile) {
      reset({
        ...profile,
        heightCm: profile.heightCm || undefined,
        weightKg: profile.weightKg || undefined,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: UserProfile) => {
    try {
      // Ensure height/weight values are stored as undefined if cleared
      const updatedProfile: UserProfile = {
        ...data,
        heightCm: data.heightCm ? Number(data.heightCm) : undefined,
        weightKg: data.weightKg ? Number(data.weightKg) : undefined,
        onboardingComplete: true,
      };

      await saveProfile(updatedProfile);
      addToast('Profile configuration updated successfully!', 'success');
      // Re-trigger target computations inside profileStore
      loadProfile();
    } catch (err) {
      console.error(err);
      addToast('Failed to save profile parameters.', 'danger');
    }
  };

  // Diet Tag triggers
  const handleDietToggle = (diet: DietTag) => {
    if (diet === 'none') {
      setValue('dietTags', ['none']);
      return;
    }
    const filtered = watchedDiets.filter(t => t !== 'none');
    if (filtered.includes(diet)) {
      const next = filtered.filter(t => t !== diet);
      setValue('dietTags', next.length === 0 ? ['none'] : next);
    } else {
      setValue('dietTags', [...filtered, diet]);
    }
  };

  // Allergen Chip triggers
  const handleAddAllergen = (item: string) => {
    const trimmed = item.trim().toLowerCase();
    if (!trimmed) return;
    if (watchedAllergies.includes(trimmed)) return;
    setValue('allergies', [...watchedAllergies, trimmed as Allergen]);
  };

  const handleRemoveAllergen = (item: string) => {
    setValue('allergies', watchedAllergies.filter(a => a !== item));
  };

  // Favorite Food Chip triggers
  const handleAddFavorite = () => {
    const trimmed = favFoodInput.trim();
    if (!trimmed) return;
    if (watchedFavorites.includes(trimmed)) return;
    setValue('favoriteFoods', [...watchedFavorites, trimmed]);
    setFavFoodInput('');
  };

  const handleRemoveFavorite = (item: string) => {
    setValue('favoriteFoods', watchedFavorites.filter(f => f !== item));
  };

  // Data Actions: database reset
  const handleConfirmReset = async () => {
    try {
      resetDialogRef.current?.close();
      await db.transaction('rw', [db.profile, db.recipes, db.mealPlans, db.pantry, db.appMeta], async () => {
        await db.profile.clear();
        await db.recipes.clear();
        await db.mealPlans.clear();
        await db.pantry.clear();
        await db.appMeta.clear();
      });
      
      // Wipe localStorage scheme preference
      localStorage.removeItem('color-scheme');
      
      addToast('Application database reset successfully.', 'success');
      // Send user back to onboarding flow
      window.location.href = '/onboarding';
    } catch (err) {
      console.error(err);
      addToast('Failed to clear database.', 'danger');
    }
  };

  // Data Actions: seeds regeneration
  const handleConfirmRegenerateSeeds = async () => {
    try {
      seedDialogRef.current?.close();
      await db.recipes.clear();
      await db.recipes.bulkPut(SEED_RECIPES);
      addToast('Database seed recipes successfully regenerated!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to regenerate seed recipes.', 'danger');
    }
  };

  const dietOptions: { value: DietTag; label: string }[] = [
    { value: 'none', label: 'None (No specific diet)' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'pescatarian', label: 'Pescatarian' },
    { value: 'diabetic_friendly', label: 'Diabetic Friendly' },
    { value: 'gluten_free', label: 'Gluten Free' },
    { value: 'keto', label: 'Keto' },
    { value: 'low_carb', label: 'Low Carb' },
    { value: 'dairy_free', label: 'Dairy Free' },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <header className="border-b border-primary/10 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary">Profile & Preferences</h1>
        <p className="text-text-muted mt-1 text-sm">
          Fine-tune your health profiles, track calorie calculations, adjust themes, or perform database maintenance.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Profile Form Fields */}
        <section className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
                
                {/* Section 1: Personal Details */}
                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-primary/5 pb-1">
                    Personal Metrics
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Name */}
                    <div className="space-y-1 sm:col-span-2">
                      <label htmlFor="name-input" className="text-xs font-bold text-text">Name *</label>
                      <input
                        id="name-input"
                        type="text"
                        className="w-full px-3 py-2 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm"
                        {...register('name', { required: true })}
                      />
                      {errors.name && <span className="text-xs text-danger">Name is required</span>}
                    </div>

                    {/* Age */}
                    <div className="space-y-1">
                      <label htmlFor="age-input" className="text-xs font-bold text-text">Age</label>
                      <input
                        id="age-input"
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm"
                        {...register('age', { valueAsNumber: true })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Gender */}
                    <div className="space-y-1">
                      <label htmlFor="gender-select" className="text-xs font-bold text-text">Gender</label>
                      <select
                        id="gender-select"
                        className="w-full px-3 py-2 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm text-text"
                        {...register('gender')}
                      >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="non_binary">Non-Binary</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </div>

                    {/* Height */}
                    <div className="space-y-1">
                      <label htmlFor="height-input" className="text-xs font-bold text-text">Height (cm)</label>
                      <input
                        id="height-input"
                        type="number"
                        className="w-full px-3 py-2 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm"
                        placeholder="Optional"
                        {...register('heightCm', { 
                          setValueAs: (v: any) => v === '' ? undefined : Number(v)
                        })}
                      />
                    </div>

                    {/* Weight */}
                    <div className="space-y-1">
                      <label htmlFor="weight-input" className="text-xs font-bold text-text">Weight (kg)</label>
                      <input
                        id="weight-input"
                        type="number"
                        className="w-full px-3 py-2 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm"
                        placeholder="Optional"
                        {...register('weightKg', { 
                          setValueAs: (v: any) => v === '' ? undefined : Number(v)
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Goals & Activity */}
                <div className="space-y-4 pt-2">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-primary/5 pb-1">
                    Goals & Activity Settings
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Goal */}
                    <div className="space-y-1">
                      <label htmlFor="goal-select" className="text-xs font-bold text-text">Goal</label>
                      <select
                        id="goal-select"
                        className="w-full px-3 py-2 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm text-text"
                        {...register('goal')}
                      >
                        <option value="general_health">General Health</option>
                        <option value="weight_loss">Weight Loss (-500 kcal)</option>
                        <option value="weight_gain">Weight Gain (+300..500 kcal)</option>
                        <option value="fitness">Fitness / Athletic Performance</option>
                      </select>
                    </div>

                    {/* Activity Level */}
                    <div className="space-y-1">
                      <label htmlFor="activity-select" className="text-xs font-bold text-text">Activity Level</label>
                      <select
                        id="activity-select"
                        className="w-full px-3 py-2 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm text-text"
                        {...register('activityLevel')}
                      >
                        <option value="sedentary">Sedentary (No exercise)</option>
                        <option value="lightly_active">Lightly Active (1-3 days/week)</option>
                        <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                        <option value="very_active">Very Active (6-7 days/week)</option>
                        <option value="athlete">Athlete (Intense training)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Budget */}
                    <div className="space-y-1">
                      <label htmlFor="budget-input" className="text-xs font-bold text-text">Monthly Grocery Budget</label>
                      <div className="relative">
                        <input
                          id="budget-input"
                          type="number"
                          min="1000"
                          className="w-full pl-12 pr-3 py-2 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm font-mono"
                          {...register('monthlyBudget', { valueAsNumber: true })}
                        />
                        <span className="absolute left-3 top-2.5 text-xs text-text-muted font-bold font-sans">NGN</span>
                      </div>
                    </div>

                    {/* Include Snacks Toggle */}
                    <div className="flex items-center gap-3 bg-primary/5 p-3 rounded border border-primary/10 mt-5">
                      <input
                        id="snacks-toggle"
                        type="checkbox"
                        className="w-4 h-4 accent-primary rounded cursor-pointer"
                        {...register('includeSnacks')}
                      />
                      <label htmlFor="snacks-toggle" className="text-xs font-bold cursor-pointer select-none text-text">
                        Include Snacks daily slot
                      </label>
                    </div>
                  </div>
                </div>

                {/* Section 3: Diet & Allergens */}
                <div className="space-y-4 pt-2">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-primary/5 pb-1">
                    Dietary Requirements & Allergens
                  </h2>

                  {/* Diets Grid */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-text block">Diet Profiles</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {dietOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleDietToggle(opt.value)}
                          className={`px-3 py-2.5 rounded text-xs font-bold border text-center transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                            watchedDiets.includes(opt.value)
                              ? 'bg-primary border-transparent text-primary-fg'
                              : 'bg-primary/5 border-primary/15 hover:bg-primary/10 text-text'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Allergies list */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-bold text-text block">Allergies (Select / Type)</span>
                    <div className="flex flex-wrap gap-1">
                      {COMMON_ALLERGENS.map((allergen) => (
                        <button
                          key={allergen}
                          type="button"
                          onClick={() => {
                            if (watchedAllergies.includes(allergen)) {
                              handleRemoveAllergen(allergen);
                            } else {
                              handleAddAllergen(allergen);
                            }
                          }}
                          className={`px-2.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                            watchedAllergies.includes(allergen)
                              ? 'bg-danger text-white border-transparent'
                              : 'bg-primary/5 border-primary/15 text-text hover:bg-primary/10'
                          }`}
                        >
                          {allergen.replace('_', ' ')}
                        </button>
                      ))}
                    </div>

                    {/* Custom allergen input */}
                    <div className="flex gap-2">
                      <input
                        id="custom-allergen-input"
                        type="text"
                        className="flex-1 px-3 py-2 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm"
                        placeholder="Add custom allergen e.g. MSG"
                        value={customAllergenInput}
                        onChange={(e) => setCustomAllergenInput(e.target.value)}
                      />
                      <Button 
                        variant="ghost" 
                        type="button" 
                        onClick={() => {
                          handleAddAllergen(customAllergenInput);
                          setCustomAllergenInput('');
                        }}
                        className="px-3 py-2 text-xs"
                      >
                        Add
                      </Button>
                    </div>

                    {/* Display active custom allergy chips */}
                    {watchedAllergies.filter(a => !COMMON_ALLERGENS.includes(a)).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {watchedAllergies.filter(a => !COMMON_ALLERGENS.includes(a)).map((allergy) => (
                          <div 
                            key={allergy}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-danger/10 text-danger border border-danger/25 text-xs font-bold"
                          >
                            <span>{allergy}</span>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveAllergen(allergy)}
                              className="focus:outline-none hover:opacity-80"
                            >
                              <Cancel01Icon className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 4: Favorite foods */}
                <div className="space-y-3 pt-2">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-primary/5 pb-1">
                    Favorite Foods
                  </h2>

                  <div className="flex gap-2">
                    <input
                      id="fav-food-input"
                      type="text"
                      className="flex-1 px-3 py-2 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm"
                      placeholder="Add food e.g. plantain"
                      value={favFoodInput}
                      onChange={(e) => setFavFoodInput(e.target.value)}
                    />
                    <Button variant="ghost" type="button" onClick={handleAddFavorite} className="px-3 py-2 text-xs">
                      Add
                    </Button>
                  </div>

                  {watchedFavorites.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {watchedFavorites.map((food) => (
                        <div 
                          key={food}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-primary/10 text-primary border border-primary/25 text-xs font-bold"
                        >
                          <span>{food}</span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveFavorite(food)}
                            className="focus:outline-none hover:opacity-80"
                          >
                            <Cancel01Icon className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 5: Cooking Preferences */}
                <div className="space-y-4 pt-2">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-primary/5 pb-1">
                    Cooking Preferences
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Skill level */}
                    <div className="space-y-1">
                      <label htmlFor="skill-select" className="text-xs font-bold text-text">Cooking Skill</label>
                      <select
                        id="skill-select"
                        className="w-full px-3 py-2 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm text-text"
                        {...register('skillLevel')}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    {/* Willingness to cook */}
                    <div className="space-y-1">
                      <label htmlFor="willingness-select" className="text-xs font-bold text-text">Willingness</label>
                      <select
                        id="willingness-select"
                        className="w-full px-3 py-2 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm text-text"
                        {...register('willingnessToCook')}
                      >
                        <option value="yes">Happy to cook</option>
                        <option value="sometimes">Sometimes</option>
                        <option value="no">Prefer quick assembly</option>
                      </select>
                    </div>

                    {/* Frequency */}
                    <div className="space-y-1">
                      <label htmlFor="frequency-select" className="text-xs font-bold text-text">Cooking Frequency</label>
                      <select
                        id="frequency-select"
                        className="w-full px-3 py-2 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm text-text"
                        {...register('cookFrequency')}
                      >
                        <option value="daily">Daily</option>
                        <option value="few_per_week">Few times per week</option>
                        <option value="rarely">Rarely</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Save button */}
                <Button variant="primary" type="submit" className="w-full py-3 flex justify-center items-center gap-2">
                  <Settings02Icon className="w-5 h-5" />
                  Save Profile Configuration
                </Button>
              </form>
            </FormProvider>
          </Card>
        </section>

        {/* Right Side: Calculated Targets, Theme Settings & DB Controls */}
        <section className="lg:col-span-1 space-y-6">
          
          {/* Target Calculator Sidebar Card */}
          <Card className="p-6 space-y-6 border border-primary/10">
            <h2 className="text-xl font-bold font-display text-primary border-b border-primary/10 pb-2 flex items-center gap-2">
              <ChefHatIcon className="w-5 h-5 text-accent" />
              Calculated Limits
            </h2>
            
            {/* Calorie Card */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Target Calories</span>
              <div className="text-3xl font-black text-primary font-mono leading-none">
                {dailyTarget?.calories || 2000} <span className="text-sm font-normal font-sans">kcal / day</span>
              </div>
              
              {/* Dynamic Estimate indicator */}
              {dailyTarget?.isEstimate ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 text-amber-600 border border-amber-500/25 text-[10px] font-bold uppercase tracking-wider">
                  ⚠️ Heuristic Estimate (Body Metrics Absent)
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-success/10 text-success border border-success/25 text-[10px] font-bold uppercase tracking-wider">
                  ✅ Computed Targets (Mifflin-St Jeor)
                </div>
              )}
            </div>

            {/* Daily Macros splits */}
            <div className="space-y-3 pt-4 border-t border-primary/10">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Daily Macros Target</span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center bg-primary/5 p-2.5 rounded border border-primary/5">
                  <span className="font-semibold text-text-muted">Protein</span>
                  <span className="font-bold text-primary font-mono">{macroTargets?.proteinG}g</span>
                </div>
                <div className="flex justify-between items-center bg-primary/5 p-2.5 rounded border border-primary/5">
                  <span className="font-semibold text-text-muted">Carbohydrates</span>
                  <span className="font-bold text-primary font-mono">{macroTargets?.carbsG}g</span>
                </div>
                <div className="flex justify-between items-center bg-primary/5 p-2.5 rounded border border-primary/5">
                  <span className="font-semibold text-text-muted">Fats</span>
                  <span className="font-bold text-primary font-mono">{macroTargets?.fatG}g</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Theme Selector Widget */}
          <Card className="p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-primary/5 pb-2 flex items-center gap-2">
              <Settings02Icon className="w-4.5 h-4.5 text-accent" />
              Theme Appearance
            </h2>

            <div className="grid grid-cols-3 gap-2">
              {(['light', 'dark', 'system'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-2 text-xs font-bold rounded border text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent capitalize ${
                    theme === t
                      ? 'bg-primary text-primary-fg border-transparent'
                      : 'bg-primary/5 border-primary/15 text-text hover:bg-primary/10'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Card>

          {/* Database Maintenance panel */}
          <Card className="p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-primary/5 pb-2 flex items-center gap-2">
              <DatabaseIcon className="w-4.5 h-4.5 text-danger" />
              Maintenance & Data
            </h2>

            <div className="space-y-2">
              <Button 
                variant="ghost" 
                onClick={() => seedDialogRef.current?.showModal()} 
                className="w-full text-xs py-2 flex items-center justify-center gap-2"
              >
                Regenerate Seed Recipes
              </Button>
              <Button 
                variant="danger" 
                onClick={() => resetDialogRef.current?.showModal()} 
                className="w-full text-xs py-2 flex items-center justify-center gap-2"
              >
                Reset All Application Data
              </Button>
            </div>
          </Card>
        </section>
      </div>

      {/* Database Reset Dialog modal */}
      <dialog 
        ref={resetDialogRef} 
        className="rounded-lg p-6 bg-surface text-text max-w-sm w-full border border-primary/15 shadow-2xl backdrop:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-labelledby="reset-modal-title"
      >
        <div className="space-y-4">
          <h3 id="reset-modal-title" className="text-lg font-bold font-display text-danger">Reset All Data?</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            This action will permanently delete your user profile parameters, virtual pantry inventory, active meal plans, and all saved metadata. This cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => resetDialogRef.current?.close()}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmReset}>
              Confirm Reset
            </Button>
          </div>
        </div>
      </dialog>

      {/* Database Regenerate Seeds Dialog modal */}
      <dialog 
        ref={seedDialogRef} 
        className="rounded-lg p-6 bg-surface text-text max-w-sm w-full border border-primary/15 shadow-2xl backdrop:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-labelledby="seed-modal-title"
      >
        <div className="space-y-4">
          <h3 id="seed-modal-title" className="text-lg font-bold font-display text-primary">Regenerate Seed Recipes?</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            This will wipe the recipes database table and reload the default local seed recipes stack. Custom edits to recipes will be overwritten.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => seedDialogRef.current?.close()}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleConfirmRegenerateSeeds}>
              Confirm Regenerate
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
};
export default ProfilePage;
