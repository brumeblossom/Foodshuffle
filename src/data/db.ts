import Dexie, { type Table } from 'dexie';
import type { UserProfile, Recipe, MealPlan, PantryItem, AppMeta } from './types';

export class FoodShuffleDB extends Dexie {
  profile!: Table<UserProfile, string>;
  recipes!: Table<Recipe, string>;
  mealPlans!: Table<MealPlan, string>;
  pantry!: Table<PantryItem, string>;
  appMeta!: Table<AppMeta, string>;

  constructor() {
    // Define the Dexie database name exactly as 'productport'
    super('productport');
    
    // Version 1 configuration mapping table indexes
    this.version(1).stores({
      profile: 'id',
      recipes: 'id, name, cuisine, difficulty',
      mealPlans: 'id, weekStartDate',
      pantry: 'id, name, normalizedName',
      appMeta: 'id',
    });

    /*
     * Upgrade path stub:
     * When schema modifications are made in the future, define version increments here.
     * Example:
     *
     * this.version(2).stores({
     *   recipes: 'id, name, cuisine, difficulty, prepTimeMins' // adding an index
     * }).upgrade(async tx => {
     *   // perform data mutations if needed
     * });
     */
  }
}

export const db = new FoodShuffleDB();
