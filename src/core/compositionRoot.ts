import { RuleBasedRecommender } from './ruleBasedRecommender';
import { StaticNutritionProvider } from './staticNutritionProvider';
import type { RecommendationProvider, NutritionProvider } from './providers';

export interface AppContainer {
  recommendationProvider: RecommendationProvider;
  nutritionProvider: NutritionProvider;
}

// Default instantiations
const recommendationProvider = new RuleBasedRecommender();
const nutritionProvider = new StaticNutritionProvider();

export const container: AppContainer = {
  recommendationProvider,
  nutritionProvider,
};

/**
 * Utility to dynamically swap provider implementations (e.g. for testing, AI layer integration).
 */
export function setProviders(
  customRecommendation?: RecommendationProvider,
  customNutrition?: NutritionProvider
) {
  if (customRecommendation) {
    container.recommendationProvider = customRecommendation;
  }
  if (customNutrition) {
    container.nutritionProvider = customNutrition;
  }
}
