import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfileStore } from '../../app/profileStore';
import { usePlanStore } from '../../app/planStore';
import { useUiStore } from '../../app/uiStore';
import { UserProfileSchema } from '../../data/validation';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import type { UserProfile, ActivityLevel, Goal, DietTag } from '../../data/types';
import { 
  UserIcon, 
  ArrowRightDoubleIcon, 
  ArrowLeft01Icon, 
  Cancel01Icon,
  PlusSignIcon,
  CheckmarkCircle02Icon
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

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const saveProfile = useProfileStore((state) => state.saveProfile);
  const generateWeeklyPlan = usePlanStore((state) => state.generateWeeklyPlan);
  const addToast = useUiStore((state) => state.addToast);

  const [step, setStep] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Chip input local states
  const [favFoodInput, setFavFoodInput] = useState('');
  const [customAllergenInput, setCustomAllergenInput] = useState('');

  // Setup React Hook Form
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
      onboardingComplete: false,
    }
  });

  const { register, handleSubmit, trigger, watch, setValue, formState: { errors } } = methods;

  // Watch fields for custom interactive elements
  const currentFavoriteFoods = watch('favoriteFoods') || [];
  const currentAllergies = watch('allergies') || [];
  const currentDietTags = watch('dietTags') || ['none'];
  const currentActivityLevel = watch('activityLevel') || 'moderately_active';
  const currentGoal = watch('goal') || 'general_health';

  const nextStep = async () => {
    // Validate current step fields
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ['name'];
    if (step === 2) fieldsToValidate = ['gender', 'age'];
    if (step === 3) fieldsToValidate = ['heightCm', 'weightKg'];
    if (step === 6) fieldsToValidate = ['dietTags'];
    if (step === 7) fieldsToValidate = ['activityLevel'];
    if (step === 8) fieldsToValidate = ['goal'];
    if (step === 9) fieldsToValidate = ['monthlyBudget', 'currency'];
    if (step === 10) fieldsToValidate = ['skillLevel', 'willingnessToCook', 'cookFrequency', 'includeSnacks'];

    const isValid = fieldsToValidate.length > 0 
      ? await trigger(fieldsToValidate) 
      : true;

    if (isValid) {
      setStep((s) => Math.min(10, s + 1));
    }
  };

  const prevStep = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  // Keyboard navigation support: Enter goes to next step when valid
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nextStep();
    }
  };

  // Skip handlers for optional steps
  const skipStep3 = () => {
    setValue('heightCm', undefined);
    setValue('weightKg', undefined);
    setStep(4);
  };

  // Chip input handlers
  const addFavoriteFood = () => {
    const food = favFoodInput.trim();
    if (!food) return;
    if (!currentFavoriteFoods.includes(food)) {
      setValue('favoriteFoods', [...currentFavoriteFoods, food]);
    }
    setFavFoodInput('');
  };

  const removeFavoriteFood = (food: string) => {
    setValue('favoriteFoods', currentFavoriteFoods.filter((f) => f !== food));
  };

  const toggleAllergen = (allergen: string) => {
    if (currentAllergies.includes(allergen)) {
      setValue('allergies', currentAllergies.filter((a) => a !== allergen));
    } else {
      setValue('allergies', [...currentAllergies, allergen]);
    }
  };

  const addCustomAllergen = () => {
    const allergy = customAllergenInput.trim().toLowerCase();
    if (!allergy) return;
    if (!currentAllergies.includes(allergy)) {
      setValue('allergies', [...currentAllergies, allergy]);
    }
    setCustomAllergenInput('');
  };

  const toggleDietTag = (val: DietTag) => {
    if (val === 'none') {
      setValue('dietTags', ['none']);
      return;
    }
    const filtered = currentDietTags.filter((t) => t !== 'none');
    if (filtered.includes(val)) {
      const next = filtered.filter((t) => t !== val);
      setValue('dietTags', next.length === 0 ? ['none'] : next);
    } else {
      setValue('dietTags', [...filtered, val]);
    }
  };

  // On onboarding submit
  const onSubmit = async (data: UserProfile) => {
    // Build full profile payload
    const finalProfile: UserProfile = {
      ...data,
      id: 'primary',
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await saveProfile(finalProfile);
      setIsFinished(true);
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
      addToast('Failed to save profile. Please verify your details.', 'danger');
    }
  };

  // Generates meal plan on finish
  const handleGenerateFirstPlan = async () => {
    setIsGenerating(true);
    try {
      const todayString = new Date().toISOString().split('T')[0];
      await generateWeeklyPlan(todayString);
      addToast('Onboarding completed! Welcome to FoodShuffle.', 'success');
      navigate('/');
    } catch (err) {
      console.error(err);
      addToast('Onboarding profile saved, but weekly plan generation failed. Go to Planner to retry.', 'danger');
      navigate('/');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isFinished) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-6 font-sans">
        <div className="flex justify-center">
          <CheckmarkCircle02Icon className="w-20 h-20 text-success animate-bounce" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary">Onboarding Complete!</h1>
        <p className="text-text-muted text-sm max-w-sm mx-auto">
          We have configured your health parameters and calculated your daily target calories and macro goals. Let's create your first personalized week now.
        </p>
        <div className="pt-4">
          <Button 
            variant="accent" 
            onClick={handleGenerateFirstPlan} 
            disabled={isGenerating}
            className="w-full py-4 text-base font-bold flex justify-center items-center gap-2 shadow-lg"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing Recipes...
              </>
            ) : (
              <>
                Generate My First Week
                <ArrowRightDoubleIcon className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4 font-sans">
      {/* Header with Progress Bar */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center text-xs text-text-muted font-bold">
          <span>STEP {step} OF 10</span>
          <span>{Math.round((step / 10) * 100)}% COMPLETE</span>
        </div>
        <ProgressBar value={step} max={10} />
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit as any)} onKeyDown={handleKeyDown} className="space-y-6">
          <Card className="p-6 sm:p-8 space-y-6 min-h-[350px] flex flex-col justify-between">
            
            {/* Step Content Wrapper */}
            <div className="flex-1 flex flex-col justify-center">
              
              {/* STEP 1: Name */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="text-2xl font-bold font-display text-primary flex items-center gap-2">
                    <UserIcon className="w-6 h-6 text-accent" />
                    Let's start. What is your name?
                  </h2>
                  <div className="space-y-1">
                    <label htmlFor="name-input" className="sr-only">Your Name</label>
                    <input
                      id="name-input"
                      type="text"
                      autoFocus
                      required
                      placeholder="e.g. Blossom"
                      className="w-full px-4 py-3 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-base"
                      {...register('name')}
                    />
                    {errors.name && (
                      <p className="text-xs text-danger font-semibold mt-1">{errors.name.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: Gender & Age */}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="text-2xl font-bold font-display text-primary">Tell us a bit about yourself</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="gender-select" className="text-xs font-bold text-text-muted block">Gender</label>
                      <select
                        id="gender-select"
                        className="w-full px-4 py-3 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm"
                        {...register('gender')}
                      >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="non_binary">Non-Binary</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="age-input" className="text-xs font-bold text-text-muted block">Age (Years)</label>
                      <input
                        id="age-input"
                        type="number"
                        min="1"
                        max="120"
                        className="w-full px-4 py-3 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm"
                        {...register('age', { valueAsNumber: true })}
                      />
                      {errors.age && (
                        <p className="text-xs text-danger font-semibold mt-1">{errors.age.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Height & Weight (Optional) */}
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-start gap-2">
                    <h2 className="text-2xl font-bold font-display text-primary">Body Metrics (Optional)</h2>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-black uppercase">Skippable</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Entering your height and weight allows us to calculate your exact basal metabolic rate (BMR) for highly personalized daily calorie caps. You can skip if preferred.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="height-input" className="text-xs font-bold text-text-muted block">Height (cm)</label>
                      <input
                        id="height-input"
                        type="number"
                        min="50"
                        max="250"
                        placeholder="170"
                        className="w-full px-4 py-3 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm"
                        {...register('heightCm', { valueAsNumber: true })}
                      />
                      {errors.heightCm && (
                        <p className="text-xs text-danger font-semibold mt-1">{errors.heightCm.message}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="weight-input" className="text-xs font-bold text-text-muted block">Weight (kg)</label>
                      <input
                        id="weight-input"
                        type="number"
                        min="10"
                        max="300"
                        placeholder="70"
                        className="w-full px-4 py-3 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm"
                        {...register('weightKg', { valueAsNumber: true })}
                      />
                      {errors.weightKg && (
                        <p className="text-xs text-danger font-semibold mt-1">{errors.weightKg.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Favorite Foods */}
              {step === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-start gap-2">
                    <h2 className="text-2xl font-bold font-display text-primary">Any favorite ingredients?</h2>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-black uppercase">Skippable</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Dishes containing these words or ingredients will score higher in your plan recommendations!
                  </p>
                  
                  <div className="flex gap-2">
                    <label htmlFor="fav-food-input" className="sr-only">Add Favorite Food</label>
                    <input
                      id="fav-food-input"
                      type="text"
                      placeholder="e.g. chicken, rice, tomatoes"
                      className="flex-1 px-4 py-2.5 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm"
                      value={favFoodInput}
                      onChange={(e) => setFavFoodInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addFavoriteFood();
                        }
                      }}
                    />
                    <Button variant="primary" type="button" onClick={addFavoriteFood}>
                      <PlusSignIcon className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Chips Container */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {currentFavoriteFoods.map((food) => (
                      <div
                        key={food}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-primary/10 border border-primary/20 text-primary animate-slide-in"
                      >
                        <span>{food}</span>
                        <button
                          type="button"
                          onClick={() => removeFavoriteFood(food)}
                          className="hover:text-danger rounded-full focus:outline-none p-0.5"
                          aria-label={`Remove ${food}`}
                        >
                          <Cancel01Icon className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: Allergies */}
              {step === 5 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-start gap-2">
                    <h2 className="text-2xl font-bold font-display text-primary">Do you have food allergies?</h2>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-black uppercase">Skippable</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Recipes containing any matching allergy tags will be strictly filtered out of your recommendations.
                  </p>

                  {/* Common allergen multi select */}
                  <div className="grid grid-cols-3 gap-2">
                    {COMMON_ALLERGENS.map((allergy) => (
                      <button
                        key={allergy}
                        type="button"
                        onClick={() => toggleAllergen(allergy)}
                        className={`px-2 py-2 rounded text-[11px] font-bold border text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent capitalize ${
                          currentAllergies.includes(allergy)
                            ? 'bg-danger border-transparent text-white'
                            : 'bg-primary/5 border-primary/10 hover:bg-primary/10 text-text'
                        }`}
                      >
                        {allergy.replace('_', ' ')}
                      </button>
                    ))}
                  </div>

                  {/* Free text custom allergen input */}
                  <div className="flex gap-2 pt-2">
                    <label htmlFor="custom-allergy-input" className="sr-only">Add other allergy</label>
                    <input
                      id="custom-allergy-input"
                      type="text"
                      placeholder="Add other e.g. honey, garlic"
                      className="flex-1 px-4 py-2.5 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm"
                      value={customAllergenInput}
                      onChange={(e) => setCustomAllergenInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCustomAllergen();
                        }
                      }}
                    />
                    <Button variant="primary" type="button" onClick={addCustomAllergen}>
                      <PlusSignIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 6: Diet Types */}
              {step === 6 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="text-2xl font-bold font-display text-primary">Do you follow a specific diet?</h2>
                  <p className="text-xs text-text-muted">
                    We will strictly filter your plans to satisfy every selected diet restriction.
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { value: 'none', label: 'None' },
                      { value: 'vegetarian', label: 'Vegetarian' },
                      { value: 'vegan', label: 'Vegan' },
                      { value: 'pescatarian', label: 'Pescatarian' },
                      { value: 'diabetic_friendly', label: 'Diabetic Friendly' },
                      { value: 'gluten_free', label: 'Gluten Free' },
                      { value: 'keto', label: 'Keto' },
                      { value: 'low_carb', label: 'Low Carb' },
                      { value: 'dairy_free', label: 'Dairy Free' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleDietTag(opt.value as DietTag)}
                        className={`px-3 py-2.5 rounded text-xs font-semibold border text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                          currentDietTags.includes(opt.value as DietTag)
                            ? 'bg-primary border-transparent text-primary-fg'
                            : 'bg-primary/5 border-primary/10 hover:bg-primary/10 text-text'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 7: Activity Level */}
              {step === 7 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="text-2xl font-bold font-display text-primary">How active are you?</h2>
                  <div className="space-y-2" role="radiogroup" aria-label="Activity Level">
                    {[
                      { value: 'sedentary', title: 'Sedentary', desc: 'Little to no exercise; desk job.' },
                      { value: 'lightly_active', title: 'Lightly Active', desc: 'Light exercise or active hobbies 1-3 days/week.' },
                      { value: 'moderately_active', title: 'Moderately Active', desc: 'Moderate workouts or sports 3-5 days/week.' },
                      { value: 'very_active', title: 'Very Active', desc: 'Intense workouts or athletic hobbies 6-7 days/week.' },
                      { value: 'athlete', title: 'Athlete', desc: 'Professional training or extreme physical work daily.' },
                    ].map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => setValue('activityLevel', opt.value as ActivityLevel)}
                        className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                          currentActivityLevel === opt.value
                            ? 'bg-primary/10 border-primary text-text'
                            : 'bg-surface border-primary/10 hover:bg-primary/5 text-text'
                        }`}
                        role="radio"
                        aria-checked={currentActivityLevel === opt.value}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            setValue('activityLevel', opt.value as ActivityLevel);
                          }
                        }}
                      >
                        <div>
                          <span className="font-bold text-sm block">{opt.title}</span>
                          <span className="text-xs text-text-muted">{opt.desc}</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          currentActivityLevel === opt.value ? 'border-primary bg-primary' : 'border-border'
                        }`}>
                          {currentActivityLevel === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 8: Goal */}
              {step === 8 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="text-2xl font-bold font-display text-primary">What is your weekly health goal?</h2>
                  <div className="space-y-2" role="radiogroup" aria-label="Health Goal">
                    {[
                      { value: 'general_health', title: 'General Health & Well-being', desc: 'Maintain current physical wellness and eat cleanly.' },
                      { value: 'weight_loss', title: 'Weight Loss / Deficit', desc: 'Achieve a safe caloric deficit for weight control.' },
                      { value: 'weight_gain', title: 'Weight Gain / Surplus', desc: 'Build lean mass with structured caloric excess.' },
                      { value: 'fitness', title: 'Muscle Building & Athletic Fitness', desc: 'High-protein distributions for exercise performance.' },
                    ].map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => setValue('goal', opt.value as Goal)}
                        className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                          currentGoal === opt.value
                            ? 'bg-primary/10 border-primary text-text'
                            : 'bg-surface border-border hover:bg-primary/5 text-text'
                        }`}
                        role="radio"
                        aria-checked={currentGoal === opt.value}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            setValue('goal', opt.value as Goal);
                          }
                        }}
                      >
                        <div>
                          <span className="font-bold text-sm block">{opt.title}</span>
                          <span className="text-xs text-text-muted">{opt.desc}</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          currentGoal === opt.value ? 'border-primary bg-primary' : 'border-border'
                        }`}>
                          {currentGoal === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 9: Monthly Budget */}
              {step === 9 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="text-2xl font-bold font-display text-primary">Set your grocery budget</h2>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Set a target budget. We will score plans that stay within this limit higher and warn you if recommendations exceed this slice.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label htmlFor="budget-input" className="text-xs font-bold text-text-muted block">Monthly Budget</label>
                      <input
                        id="budget-input"
                        type="number"
                        min="1000"
                        className="w-full px-4 py-3 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm"
                        {...register('monthlyBudget', { valueAsNumber: true })}
                      />
                      {errors.monthlyBudget && (
                        <p className="text-xs text-danger font-semibold mt-1">{errors.monthlyBudget.message}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="currency-select" className="text-xs font-bold text-text-muted block">Currency</label>
                      <select
                        id="currency-select"
                        className="w-full px-4 py-3 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-sm"
                        {...register('currency')}
                      >
                        <option value="NGN">NGN (₦)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 10: Cooking Preferences */}
              {step === 10 && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="text-2xl font-bold font-display text-primary">Lastly, cooking preferences</h2>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {/* Cooking Skill */}
                    <div className="space-y-1">
                      <label htmlFor="skill-select" className="text-[10px] font-bold text-text-muted uppercase block">Skill Level</label>
                      <select
                        id="skill-select"
                        className="w-full px-3 py-2.5 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-xs"
                        {...register('skillLevel')}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    {/* Willingness */}
                    <div className="space-y-1">
                      <label htmlFor="willingness-select" className="text-[10px] font-bold text-text-muted uppercase block">Willingness</label>
                      <select
                        id="willingness-select"
                        className="w-full px-3 py-2.5 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-xs"
                        {...register('willingnessToCook')}
                      >
                        <option value="prefer_not">Prefer Not</option>
                        <option value="sometimes">Sometimes</option>
                        <option value="love">Love It</option>
                      </select>
                    </div>

                    {/* Frequency */}
                    <div className="space-y-1">
                      <label htmlFor="frequency-select" className="text-[10px] font-bold text-text-muted uppercase block">Frequency</label>
                      <select
                        id="frequency-select"
                        className="w-full px-3 py-2.5 rounded border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-xs"
                        {...register('cookFrequency')}
                      >
                        <option value="rarely">Rarely</option>
                        <option value="few_per_week">Weekly</option>
                        <option value="daily">Daily</option>
                      </select>
                    </div>
                  </div>

                  {/* Snacks toggle */}
                  <div className="flex items-center gap-3 bg-primary/5 p-3 rounded border border-primary/10 mt-4">
                    <input
                      id="onboard-snacks-cb"
                      type="checkbox"
                      className="w-4 h-4 accent-primary rounded cursor-pointer"
                      {...register('includeSnacks')}
                    />
                    <label htmlFor="onboard-snacks-cb" className="text-xs font-semibold cursor-pointer select-none">
                      Include snacks in weekly meal plans (Adds snack slot)
                    </label>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions Row */}
            <div className="flex justify-between items-center pt-6 border-t border-primary/10 mt-6 gap-3">
              
              {/* Back Button */}
              {step > 1 ? (
                <Button 
                  variant="ghost" 
                  type="button" 
                  onClick={prevStep}
                  className="flex items-center gap-1.5"
                >
                  <ArrowLeft01Icon className="w-4 h-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {/* Next/Skip/Finish Row */}
              <div className="flex gap-2">
                {/* Skip button for Step 3, 4, 5 */}
                {step === 3 && (
                  <Button variant="ghost" type="button" onClick={skipStep3} className="text-text-muted">
                    Skip
                  </Button>
                )}
                {step === 4 && (
                  <Button variant="ghost" type="button" onClick={() => setStep(5)} className="text-text-muted">
                    Skip
                  </Button>
                )}
                {step === 5 && (
                  <Button variant="ghost" type="button" onClick={() => setStep(6)} className="text-text-muted">
                    Skip
                  </Button>
                )}

                {/* Main Next/Submit Trigger */}
                {step < 10 ? (
                  <Button variant="primary" type="button" onClick={nextStep} className="flex items-center gap-1.5">
                    Next
                    <ArrowRightDoubleIcon className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button variant="accent" type="submit">
                    Complete Onboarding
                  </Button>
                )}
              </div>

            </div>

          </Card>
        </form>
      </FormProvider>
    </div>
  );
};
export default OnboardingPage;
