import type { Recipe } from '../types';

export const SEED_RECIPES: Recipe[] = [
  // ==================== WEST AFRICAN / NIGERIAN CUISINE (20 Recipes) ====================
  {
    id: 'jollof-rice',
    name: 'Classic Jollof Rice',
    description: 'A rich, smokey West African one-pot rice dish simmered in a spiced tomato-pepper sauce.',
    cuisine: 'Nigerian',
    imageUrl: '/images/recipes/jollof-rice.jpg',
    mealTypes: ['lunch', 'dinner'],
    ingredients: [
      { name: 'Easy cook long grain rice', quantity: 500, unit: 'g', normalizedName: 'rice' },
      { name: 'Red bell peppers', quantity: 3, unit: 'pieces', normalizedName: 'bell pepper' },
      { name: 'Tomato paste', quantity: 100, unit: 'g', normalizedName: 'tomato paste' },
      { name: 'Onions', quantity: 2, unit: 'pieces', normalizedName: 'onion' },
      { name: 'Vegetable oil', quantity: 80, unit: 'ml', normalizedName: 'vegetable oil' },
      { name: 'Chicken stock cubes', quantity: 3, unit: 'pieces', normalizedName: 'stock cube' },
      { name: 'Curry powder & thyme', quantity: 10, unit: 'g', normalizedName: 'spices' }
    ],
    steps: [
      'Blend peppers, tomatoes, and one onion until smooth.',
      'Sauté the second chopped onion in vegetable oil, add tomato paste and fry for 5 minutes.',
      'Pour in blended peppers and cook until oil separates.',
      'Add rice, stock, curry, thyme, cover and steam on low heat until soft.'
    ],
    prepTimeMins: 15,
    cookTimeMins: 35,
    servings: 4,
    nutritionPerServing: { calories: 420, protein: 8, carbs: 80, fat: 8, fiber: 4, sugar: 5, sodium: 620 },
    dietTags: ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'halal'],
    allergens: [],
    estimatedCostPerServing: 900,
    costCurrency: 'NGN',
    difficulty: 'medium',
    tags: ['spicy', 'one_pot', 'classic']
  },
  {
    id: 'egusi-soup',
    name: 'Egusi Soup with Spinach',
    description: 'A traditional thick melon-seed soup enriched with red oil, stock, and fresh spinach.',
    cuisine: 'Nigerian',
    imageUrl: '/images/recipes/egusi-soup.jpg',
    mealTypes: ['lunch', 'dinner'],
    ingredients: [
      { name: 'Ground egusi (melon seeds)', quantity: 200, unit: 'g', normalizedName: 'egusi' },
      { name: 'Red palm oil', quantity: 60, unit: 'ml', normalizedName: 'palm oil' },
      { name: 'Fresh spinach leaves', quantity: 300, unit: 'g', normalizedName: 'spinach' },
      { name: 'Ground crayfish', quantity: 15, unit: 'g', normalizedName: 'crayfish' },
      { name: 'Stock fish or dry fish', quantity: 100, unit: 'g', normalizedName: 'fish' },
      { name: 'Bouillon cube', quantity: 2, unit: 'pieces', normalizedName: 'stock cube' }
    ],
    steps: [
      'Mix ground egusi with a little warm water to form thick pastes.',
      'Heat palm oil in a pot, fry onions, and add the egusi pastes to fry.',
      'Add stock fish, crayfish, bouillon, and 2 cups of water. Simmer for 15 minutes.',
      'Stir in shredded spinach leaves and cook for 5 more minutes.'
    ],
    prepTimeMins: 20,
    cookTimeMins: 25,
    servings: 4,
    nutritionPerServing: { calories: 380, protein: 18, carbs: 12, fat: 28, fiber: 3, sugar: 2, sodium: 580 },
    dietTags: ['gluten_free', 'dairy_free', 'keto', 'low_carb', 'halal'],
    allergens: ['fish'],
    estimatedCostPerServing: 1200,
    costCurrency: 'NGN',
    difficulty: 'medium',
    tags: ['rich', 'savory', 'traditional']
  },
  {
    id: 'moi-moi',
    name: 'Steamed Bean Pudding (Moi Moi)',
    description: 'Savory steamed bean pudding made from peeled black-eyed peas, peppers, and onions.',
    cuisine: 'Nigerian',
    imageUrl: '/images/recipes/moi-moi.jpg',
    mealTypes: ['breakfast', 'lunch', 'snack'],
    ingredients: [
      { name: 'Brown or black-eyed beans', quantity: 300, unit: 'g', normalizedName: 'beans' },
      { name: 'Tatashe (red bell pepper)', quantity: 2, unit: 'pieces', normalizedName: 'bell pepper' },
      { name: 'Vegetable oil', quantity: 50, unit: 'ml', normalizedName: 'vegetable oil' },
      { name: 'Onions', quantity: 1, unit: 'piece', normalizedName: 'onion' },
      { name: 'Hard-boiled eggs', quantity: 2, unit: 'pieces', normalizedName: 'egg' },
      { name: 'Crayfish', quantity: 10, unit: 'g', normalizedName: 'crayfish' }
    ],
    steps: [
      'Soak and peel the beans. Blend with tatashe, onions, and water until very smooth.',
      'Stir in vegetable oil, crayfish, salt, and warm water to form a pancake-like batter.',
      'Pour into small oiled tins or leaves, place egg slices in each portion.',
      'Steam in a covered pot with boiling water for 40 minutes.'
    ],
    prepTimeMins: 30,
    cookTimeMins: 40,
    servings: 4,
    nutritionPerServing: { calories: 240, protein: 14, carbs: 28, fat: 9, fiber: 6, sugar: 3, sodium: 340 },
    dietTags: ['vegetarian', 'gluten_free', 'dairy_free', 'diabetic_friendly', 'halal'],
    allergens: ['eggs'],
    estimatedCostPerServing: 500,
    costCurrency: 'NGN',
    difficulty: 'hard',
    tags: ['steamed', 'high_protein', 'healthy']
  },
  {
    id: 'efo-riro',
    name: 'Efo Riro (Yoruba Spinach Stew)',
    description: 'A rich Yoruba spinach stew prepared with bell pepper sauce, palm oil, and locust beans.',
    cuisine: 'Nigerian',
    imageUrl: '/images/recipes/efo-riro.jpg',
    mealTypes: ['lunch', 'dinner'],
    ingredients: [
      { name: 'Shredded spinach leaves', quantity: 500, unit: 'g', normalizedName: 'spinach' },
      { name: 'Red palm oil', quantity: 50, unit: 'ml', normalizedName: 'palm oil' },
      { name: 'Iru (locust beans)', quantity: 20, unit: 'g', normalizedName: 'locust beans' },
      { name: 'Assorted boiled meats', quantity: 200, unit: 'g', normalizedName: 'meat' },
      { name: 'Ground crayfish', quantity: 15, unit: 'g', normalizedName: 'crayfish' },
      { name: 'Blended bell peppers', quantity: 150, unit: 'g', normalizedName: 'bell pepper' }
    ],
    steps: [
      'Blanch the spinach in hot water for 1 minute, drain completely.',
      'Heat palm oil, fry iru and chopped onions.',
      'Add blended pepper sauce, crayfish, meat, and boil down for 10 minutes.',
      'Fold in spinach, adjust seasoning, and cook for 3 minutes on low heat.'
    ],
    prepTimeMins: 15,
    cookTimeMins: 20,
    servings: 4,
    nutritionPerServing: { calories: 290, protein: 16, carbs: 8, fat: 21, fiber: 4, sugar: 2, sodium: 490 },
    dietTags: ['gluten_free', 'dairy_free', 'keto', 'low_carb', 'halal'],
    allergens: [],
    estimatedCostPerServing: 1100,
    costCurrency: 'NGN',
    difficulty: 'medium',
    tags: ['spicy', 'savory', 'traditional']
  },
  {
    id: 'akara',
    name: 'Crispy Akara (Bean Fritters)',
    description: 'Light and fluffy deep-fried bean cakes seasoned with fresh peppers and onions.',
    cuisine: 'Nigerian',
    imageUrl: '/images/recipes/akara.jpg',
    mealTypes: ['breakfast', 'snack'],
    ingredients: [
      { name: 'Black-eyed beans', quantity: 200, unit: 'g', normalizedName: 'beans' },
      { name: 'Scotch bonnet pepper', quantity: 1, unit: 'piece', normalizedName: 'chili' },
      { name: 'Onion', quantity: 0.5, unit: 'piece', normalizedName: 'onion' },
      { name: 'Vegetable oil for frying', quantity: 250, unit: 'ml', normalizedName: 'vegetable oil' }
    ],
    steps: [
      'Soak and peel the beans, then blend with scotch bonnet and onion using very little water.',
      'Whisk the paste vigorously with a wooden spoon for 5 minutes to incorporate air.',
      'Heat oil in a deep pan. Spoon the batter into hot oil.',
      'Fry until golden brown on both sides.'
    ],
    prepTimeMins: 20,
    cookTimeMins: 15,
    servings: 3,
    nutritionPerServing: { calories: 190, protein: 8, carbs: 18, fat: 10, fiber: 4, sugar: 1, sodium: 180 },
    dietTags: ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'halal'],
    allergens: [],
    estimatedCostPerServing: 350,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: ['fried', 'crispy', 'street_food']
  },
  {
    id: 'beans-plantain',
    name: 'Ewa Riro (Stewed Beans & Plantain)',
    description: 'Slow-cooked brown beans in a tasty palm oil and onion sauce, topped with fried sweet plantains.',
    cuisine: 'Nigerian',
    imageUrl: '/images/recipes/beans-plantain.jpg',
    mealTypes: ['lunch', 'dinner'],
    ingredients: [
      { name: 'Oloyin (sweet honey) beans', quantity: 300, unit: 'g', normalizedName: 'beans' },
      { name: 'Ripe sweet plantain', quantity: 2, unit: 'pieces', normalizedName: 'plantain' },
      { name: 'Palm oil', quantity: 40, unit: 'ml', normalizedName: 'palm oil' },
      { name: 'Onions', quantity: 1, unit: 'piece', normalizedName: 'onion' },
      { name: 'Scotch bonnet pepper', quantity: 1, unit: 'piece', normalizedName: 'chili' }
    ],
    steps: [
      'Boil beans in water until completely tender.',
      'In a separate pot, heat palm oil, fry onions and blended scotch bonnet.',
      'Stir the sauce into the tender beans, mash slightly, and simmer for 10 minutes.',
      'Fry diced ripe plantains in vegetable oil and serve on top of the stewed beans.'
    ],
    prepTimeMins: 10,
    cookTimeMins: 50,
    servings: 4,
    nutritionPerServing: { calories: 340, protein: 12, carbs: 55, fat: 9, fiber: 8, sugar: 14, sodium: 220 },
    dietTags: ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'halal'],
    allergens: [],
    estimatedCostPerServing: 600,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: ['sweet_savory', 'comfort_food']
  },
  {
    id: 'chicken-peppersoup',
    name: 'Chicken Pepper Soup',
    description: 'A warm, soothing, and light spicy broth cooked with fresh chicken chunks and native African spices.',
    cuisine: 'Nigerian',
    imageUrl: '/images/recipes/chicken-peppersoup.jpg',
    mealTypes: ['dinner', 'snack'],
    ingredients: [
      { name: 'Chicken bone-in pieces', quantity: 500, unit: 'g', normalizedName: 'chicken' },
      { name: 'Pepper soup spice mix', quantity: 15, unit: 'g', normalizedName: 'peppersoup spices' },
      { name: 'Scent leaves (or basil)', quantity: 20, unit: 'g', normalizedName: 'basil' },
      { name: 'Dry chili powder', quantity: 5, unit: 'g', normalizedName: 'chili' },
      { name: 'Onion', quantity: 1, unit: 'piece', normalizedName: 'onion' }
    ],
    steps: [
      'Place chicken in a pot with chopped onions, stock cubes, salt and steam for 10 minutes.',
      'Add 4 cups of water, pepper soup spices, and dry chili.',
      'Boil on medium heat for 20 minutes until chicken is tender.',
      'Stir in shredded scent leaves and simmer for 2 minutes.'
    ],
    prepTimeMins: 10,
    cookTimeMins: 30,
    servings: 3,
    nutritionPerServing: { calories: 220, protein: 24, carbs: 3, fat: 12, fiber: 1, sugar: 0, sodium: 480 },
    dietTags: ['gluten_free', 'dairy_free', 'keto', 'low_carb', 'diabetic_friendly', 'halal'],
    allergens: [],
    estimatedCostPerServing: 950,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: ['spicy', 'broth', 'soothing']
  },
  {
    id: 'suya-beef',
    name: 'Spicy Beef Suya Fillets',
    description: 'Thinly sliced beef marinated in hot peanut spice (Yaji) and grilled to smoky perfection.',
    cuisine: 'Nigerian',
    imageUrl: '/images/recipes/beef-suya.jpg',
    mealTypes: ['dinner', 'snack'],
    ingredients: [
      { name: 'Beef sirloin or flank', quantity: 400, unit: 'g', normalizedName: 'beef' },
      { name: 'Suya spice powder (Yaji)', quantity: 40, unit: 'g', normalizedName: 'suya spice' },
      { name: 'Vegetable oil', quantity: 20, unit: 'ml', normalizedName: 'vegetable oil' },
      { name: 'Raw red onions & cabbage', quantity: 100, unit: 'g', normalizedName: 'vegetables' }
    ],
    steps: [
      'Slice the beef into very thin strips.',
      'Thread strips onto skewers, coat thoroughly with suya spice and oil.',
      'Grill on a hot barbecue or oven grill for 12-15 minutes, turning occasionally.',
      'Serve hot with sliced onions, tomatoes, and extra yaji.'
    ],
    prepTimeMins: 15,
    cookTimeMins: 15,
    servings: 3,
    nutritionPerServing: { calories: 310, protein: 28, carbs: 4, fat: 20, fiber: 2, sugar: 1, sodium: 590 },
    dietTags: ['gluten_free', 'dairy_free', 'keto', 'low_carb', 'diabetic_friendly', 'halal'],
    allergens: ['peanuts'],
    estimatedCostPerServing: 1500,
    costCurrency: 'NGN',
    difficulty: 'medium',
    tags: ['grilled', 'spicy', 'street_food']
  },
  {
    id: 'ofada-rice',
    name: 'Ofada Rice & Ayamase Sauce',
    description: 'Local unpolished brown rice served with a fiery green pepper, palm oil, and locust bean sauce.',
    cuisine: 'Nigerian',
    imageUrl: '/images/recipes/ofada-rice.jpg',
    mealTypes: ['lunch', 'dinner'],
    ingredients: [
      { name: 'Local Ofada rice', quantity: 400, unit: 'g', normalizedName: 'ofada rice' },
      { name: 'Green bell peppers', quantity: 4, unit: 'pieces', normalizedName: 'bell pepper' },
      { name: 'Palm oil', quantity: 60, unit: 'ml', normalizedName: 'palm oil' },
      { name: 'Locust beans (Iru)', quantity: 20, unit: 'g', normalizedName: 'locust beans' },
      { name: 'Beef chunks', quantity: 150, unit: 'g', normalizedName: 'beef' }
    ],
    steps: [
      'Wash Ofada rice thoroughly and boil in water until soft. Set aside.',
      'Bleach palm oil in a closed pot for 10 minutes, fry onions and locust beans.',
      'Add blended and drained green peppers and cooked beef chunks.',
      'Fry until oil floats on top, then serve with the hot local rice.'
    ],
    prepTimeMins: 20,
    cookTimeMins: 40,
    servings: 4,
    nutritionPerServing: { calories: 480, protein: 12, carbs: 65, fat: 16, fiber: 5, sugar: 3, sodium: 410 },
    dietTags: ['gluten_free', 'dairy_free', 'halal'],
    allergens: [],
    estimatedCostPerServing: 1100,
    costCurrency: 'NGN',
    difficulty: 'hard',
    tags: ['local_grain', 'spicy', 'traditional']
  },
  {
    id: 'poundo-yam-okra',
    name: 'Poundo Yam & Ila Alasepo (Okra Soup)',
    description: 'Smooth mashed yam dough served with a quick-cooked, slimy, and seafood-infused okra broth.',
    cuisine: 'Nigerian',
    imageUrl: '/images/recipes/pounded-yam-okra.jpg',
    mealTypes: ['lunch', 'dinner'],
    ingredients: [
      { name: 'Pounded yam flour', quantity: 300, unit: 'g', normalizedName: 'yam flour' },
      { name: 'Fresh okra fingers', quantity: 250, unit: 'g', normalizedName: 'okra' },
      { name: 'Shrimps', quantity: 100, unit: 'g', normalizedName: 'shrimp' },
      { name: 'Palm oil', quantity: 15, unit: 'ml', normalizedName: 'palm oil' },
      { name: 'Crayfish', quantity: 10, unit: 'g', normalizedName: 'crayfish' }
    ],
    steps: [
      'Chop okra into fine small pieces.',
      'Boil water, stir in yam flour continuously until a smooth elastic dough forms.',
      'In a pot, heat palm oil, add okra, shrimps, crayfish, and 1 cup of stock. Cook for 5 minutes.',
      'Serve the hot okra soup with the molded pounded yam.'
    ],
    prepTimeMins: 15,
    cookTimeMins: 15,
    servings: 3,
    nutritionPerServing: { calories: 360, protein: 15, carbs: 62, fat: 7, fiber: 5, sugar: 2, sodium: 310 },
    dietTags: ['gluten_free', 'dairy_free', 'halal'],
    allergens: ['shellfish'],
    estimatedCostPerServing: 1300,
    costCurrency: 'NGN',
    difficulty: 'medium',
    tags: ['swallow', 'slimy', 'seafood']
  },
  {
    id: 'dodo',
    name: 'Dodo (Fried Sweet Plantains)',
    description: 'Sweet, caramelised fried plantain slices. Perfect as a meal companion or light snack.',
    cuisine: 'Nigerian',
    imageUrl: '/images/recipes/fried-plantain.jpg',
    mealTypes: ['breakfast', 'lunch', 'dinner', 'snack'],
    ingredients: [
      { name: 'Very ripe yellow plantains', quantity: 2, unit: 'pieces', normalizedName: 'plantain' },
      { name: 'Vegetable oil for shallow frying', quantity: 150, unit: 'ml', normalizedName: 'vegetable oil' },
      { name: 'Salt', quantity: 2, unit: 'g', normalizedName: 'salt' }
    ],
    steps: [
      'Peel and slice the sweet plantains diagonally into 1/2 inch chunks.',
      'Toss plantains in a pinch of salt.',
      'Heat oil in a frying pan and shallow fry plantain slices on medium heat.',
      'Turn until both sides are soft, deeply caramelized and golden brown.'
    ],
    prepTimeMins: 5,
    cookTimeMins: 10,
    servings: 2,
    nutritionPerServing: { calories: 180, protein: 1, carbs: 32, fat: 6, fiber: 3, sugar: 15, sodium: 120 },
    dietTags: ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'halal'],
    allergens: [],
    estimatedCostPerServing: 250,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: ['sweet', 'easy', 'side_dish']
  },
  {
    id: 'puff-puff',
    name: 'Sweet Yeasted Puff Puff',
    description: 'A universally loved West African street food: sweet, pillowy, and spongy deep-fried dough balls.',
    cuisine: 'Nigerian',
    imageUrl: '/images/recipes/puff-puff.jpg',
    mealTypes: ['breakfast', 'snack'],
    ingredients: [
      { name: 'All-purpose flour', quantity: 250, unit: 'g', normalizedName: 'flour' },
      { name: 'Sugar', quantity: 60, unit: 'g', normalizedName: 'sugar' },
      { name: 'Fast action yeast', quantity: 7, unit: 'g', normalizedName: 'yeast' },
      { name: 'Nutmeg powder', quantity: 2, unit: 'g', normalizedName: 'nutmeg' },
      { name: 'Vegetable oil for frying', quantity: 300, unit: 'ml', normalizedName: 'vegetable oil' }
    ],
    steps: [
      'Combine flour, yeast, sugar, nutmeg, and warm water into a thick batter.',
      'Cover with a cloth and leave in a warm place for 45 minutes to rise.',
      'Heat oil. Punch out balls of the risen dough using your hands or a scoop into the oil.',
      'Deep fry until perfectly round and golden brown.'
    ],
    prepTimeMins: 50,
    cookTimeMins: 15,
    servings: 4,
    nutritionPerServing: { calories: 270, protein: 4, carbs: 48, fat: 7, fiber: 2, sugar: 12, sodium: 10 },
    dietTags: ['vegetarian', 'vegan', 'dairy_free', 'halal'],
    allergens: [],
    estimatedCostPerServing: 200,
    costCurrency: 'NGN',
    difficulty: 'medium',
    tags: ['yeast', 'fried', 'sweet', 'street_food']
  },
  {
    id: 'chin-chin',
    name: 'Crunchy Chin Chin Snack',
    description: 'Sweet, crunchy, fried pastry cubes infused with nutmeg and cream flavor. A staple holiday snack.',
    cuisine: 'Nigerian',
    imageUrl: '/images/recipes/chin-chin.jpg',
    mealTypes: ['snack'],
    ingredients: [
      { name: 'All-purpose flour', quantity: 300, unit: 'g', normalizedName: 'flour' },
      { name: 'Butter', quantity: 50, unit: 'g', normalizedName: 'butter' },
      { name: 'Sugar', quantity: 75, unit: 'g', normalizedName: 'sugar' },
      { name: 'Milk', quantity: 50, unit: 'ml', normalizedName: 'milk' },
      { name: 'Nutmeg', quantity: 3, unit: 'g', normalizedName: 'nutmeg' }
    ],
    steps: [
      'Mix dry ingredients, rub in butter, add milk to knead into a stiff dough.',
      'Roll out dough flat on a board and cut into tiny 1/2-inch squares.',
      'Heat deep vegetable oil and fry pastry cubes in small batches.',
      'Stir constantly until light golden brown, then drain and cool.'
    ],
    prepTimeMins: 20,
    cookTimeMins: 15,
    servings: 6,
    nutritionPerServing: { calories: 290, protein: 5, carbs: 42, fat: 11, fiber: 1, sugar: 13, sodium: 80 },
    dietTags: ['vegetarian', 'halal'],
    allergens: ['dairy'],
    estimatedCostPerServing: 200,
    costCurrency: 'NGN',
    difficulty: 'medium',
    tags: ['crunchy', 'baked_goods', 'snack']
  },
  {
    id: 'abacha',
    name: 'Abacha (African Salad)',
    description: 'Shredded cassava salad tossed in raw palm oil emulsion, garden eggs, and scent leaves.',
    cuisine: 'Nigerian',
    imageUrl: '/images/recipes/abacha.jpg',
    mealTypes: ['lunch', 'snack'],
    ingredients: [
      { name: 'Dried abacha (cassava shreds)', quantity: 200, unit: 'g', normalizedName: 'cassava shreds' },
      { name: 'Palm oil', quantity: 40, unit: 'ml', normalizedName: 'palm oil' },
      { name: 'Edible potash (Akanwu)', quantity: 5, unit: 'g', normalizedName: 'potash' },
      { name: 'Ugba (oil bean seeds)', quantity: 50, unit: 'g', normalizedName: 'ugba' },
      { name: 'Garden eggs', quantity: 2, unit: 'pieces', normalizedName: 'garden egg' },
      { name: 'Dry pepper & crayfish', quantity: 15, unit: 'g', normalizedName: 'crayfish' }
    ],
    steps: [
      'Soak dry cassava shreds in cold water for 10 minutes, drain completely.',
      'Dissolve potash in a little water, filter, and mix the liquid with palm oil to form a yellow paste.',
      'Stir dry pepper, crayfish, and ugba into the oil paste.',
      'Add abacha shreds, mix thoroughly, and garnish with sliced garden eggs.'
    ],
    prepTimeMins: 15,
    cookTimeMins: 0,
    servings: 3,
    nutritionPerServing: { calories: 310, protein: 4, carbs: 45, fat: 14, fiber: 6, sugar: 3, sodium: 190 },
    dietTags: ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'halal'],
    allergens: [],
    estimatedCostPerServing: 600,
    costCurrency: 'NGN',
    difficulty: 'medium',
    tags: ['raw', 'cold_dish', 'traditional']
  },
  {
    id: 'yam-porridge',
    name: 'Asaro (Yam Porridge)',
    description: 'Yam cubes slowly boiled in a seasoned pepper-tomato-onion broth until soft and mushy.',
    cuisine: 'Nigerian',
    imageUrl: '/images/recipes/asaro.jpg',
    mealTypes: ['lunch', 'dinner'],
    ingredients: [
      { name: 'Puna yam cubes', quantity: 600, unit: 'g', normalizedName: 'yam' },
      { name: 'Palm oil', quantity: 40, unit: 'ml', normalizedName: 'palm oil' },
      { name: 'Onions', quantity: 1, unit: 'piece', normalizedName: 'onion' },
      { name: 'Blended bell peppers & chili', quantity: 100, unit: 'g', normalizedName: 'bell pepper' },
      { name: 'Vegetable leaf garnish', quantity: 30, unit: 'g', normalizedName: 'greens' }
    ],
    steps: [
      'Peel yam and cut into medium cubes, place in a pot with water to cover.',
      'Add blended peppers, chopped onions, palm oil, and bouillon cubes.',
      'Cook on medium heat for 25 minutes until yam is soft.',
      'Using a wooden spoon, mash some yam cubes to thicken the gravy, stir in greens.'
    ],
    prepTimeMins: 15,
    cookTimeMins: 30,
    servings: 4,
    nutritionPerServing: { calories: 390, protein: 5, carbs: 75, fat: 10, fiber: 6, sugar: 4, sodium: 290 },
    dietTags: ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'halal'],
    allergens: [],
    estimatedCostPerServing: 750,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: ['hearty', 'one_pot', 'comfort_food']
  },
  {
    id: 'bole',
    name: 'Roasted Plantain with Grilled Fish',
    description: 'A famous street snack: roasted sweet plantains served with spicy grilled fish and pepper sauce.',
    cuisine: 'Nigerian',
    imageUrl: '/images/recipes/roasted-plantain-fish.jpg',
    mealTypes: ['lunch', 'dinner'],
    ingredients: [
      { name: 'Yellow semi-ripe plantain', quantity: 2, unit: 'pieces', normalizedName: 'plantain' },
      { name: 'Mackerel fish whole', quantity: 1, unit: 'piece', normalizedName: 'fish' },
      { name: 'Palm oil & chili sauce', quantity: 30, unit: 'ml', normalizedName: 'palm oil' },
      { name: 'Peanuts', quantity: 30, unit: 'g', normalizedName: 'peanuts' }
    ],
    steps: [
      'Peel plantains and roast on an open grill (or oven rack) until tender and golden.',
      'Clean mackerel, score, coat in blended chili sauce and oil, then grill.',
      'Serve hot roasted plantain with the grilled fish and roasted peanuts.'
    ],
    prepTimeMins: 15,
    cookTimeMins: 25,
    servings: 2,
    nutritionPerServing: { calories: 430, protein: 22, carbs: 48, fat: 17, fiber: 4, sugar: 12, sodium: 380 },
    dietTags: ['gluten_free', 'dairy_free', 'halal'],
    allergens: ['fish', 'peanuts'],
    estimatedCostPerServing: 1400,
    costCurrency: 'NGN',
    difficulty: 'medium',
    tags: ['grilled', 'street_food', 'smokey']
  },
  {
    id: 'gizdodo',
    name: 'Gizdodo (Gizzard & Plantain Stew)',
    description: 'Boiled and fried chicken gizzards tossed with sweet plantain cubes in spicy bell pepper sauce.',
    cuisine: 'Nigerian',
    imageUrl: '/images/recipes/gizdodo.jpg',
    mealTypes: ['lunch', 'dinner', 'snack'],
    ingredients: [
      { name: 'Chicken gizzards', quantity: 300, unit: 'g', normalizedName: 'chicken gizzard' },
      { name: 'Ripe sweet plantains', quantity: 2, unit: 'pieces', normalizedName: 'plantain' },
      { name: 'Red pepper bell sauce', quantity: 100, unit: 'g', normalizedName: 'bell pepper' },
      { name: 'Onions', quantity: 1, unit: 'piece', normalizedName: 'onion' },
      { name: 'Vegetable oil for frying', quantity: 150, unit: 'ml', normalizedName: 'vegetable oil' }
    ],
    steps: [
      'Boil gizzards with spice, slice, and deep fry until crispy.',
      'Dice plantains, fry until golden brown, drain.',
      'Sauté onions and pepper sauce, then toss the fried gizzard and plantain chunks in the sauce.',
      'Cook for 5 minutes until fully coated.'
    ],
    prepTimeMins: 15,
    cookTimeMins: 25,
    servings: 3,
    nutritionPerServing: { calories: 350, protein: 18, carbs: 35, fat: 16, fiber: 4, sugar: 11, sodium: 490 },
    dietTags: ['gluten_free', 'dairy_free', 'halal'],
    allergens: [],
    estimatedCostPerServing: 1100,
    costCurrency: 'NGN',
    difficulty: 'medium',
    tags: ['savory', 'fried', 'spicy']
  },
  {
    id: 'coconut-rice',
    name: 'West African Coconut Rice',
    description: 'Fragrant parboiled rice cooked in rich, fresh coconut milk extract with mixed vegetables.',
    cuisine: 'Nigerian',
    imageUrl: '/images/recipes/coconut-rice.jpg',
    mealTypes: ['lunch', 'dinner'],
    ingredients: [
      { name: 'Parboiled rice', quantity: 400, unit: 'g', normalizedName: 'rice' },
      { name: 'Fresh coconut milk', quantity: 400, unit: 'ml', normalizedName: 'coconut milk' },
      { name: 'Carrots & green peas', quantity: 100, unit: 'g', normalizedName: 'vegetables' },
      { name: 'Crayfish', quantity: 15, unit: 'g', normalizedName: 'crayfish' },
      { name: 'Bouillon cubes', quantity: 2, unit: 'pieces', normalizedName: 'stock cube' }
    ],
    steps: [
      'Boil coconut milk, stock, crayfish, and chopped onions in a pot.',
      'Wash rice and add to the seasoned boiling coconut milk.',
      'Cover pot tightly and cook on low heat for 25 minutes.',
      'Stir in green vegetables and simmer for 5 more minutes.'
    ],
    prepTimeMins: 15,
    cookTimeMins: 30,
    servings: 4,
    nutritionPerServing: { calories: 410, protein: 7, carbs: 70, fat: 12, fiber: 3, sugar: 2, sodium: 420 },
    dietTags: ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'halal'],
    allergens: [],
    estimatedCostPerServing: 850,
    costCurrency: 'NGN',
    difficulty: 'medium',
    tags: ['coconut', 'fragrant', 'one_pot']
  },
  {
    id: 'masa',
    name: 'Rice Cakes (Masa)',
    description: 'Northern Nigerian pan-fried rice cakes made from raw and cooked rice batter, crispy outside.',
    cuisine: 'Nigerian',
    imageUrl: '/images/recipes/masa-rice-cakes.jpg',
    mealTypes: ['breakfast', 'snack'],
    ingredients: [
      { name: 'Short grain white rice', quantity: 300, unit: 'g', normalizedName: 'rice' },
      { name: 'Yeast', quantity: 5, unit: 'g', normalizedName: 'yeast' },
      { name: 'Sugar', quantity: 30, unit: 'g', normalizedName: 'sugar' },
      { name: 'Baking powder', quantity: 3, unit: 'g', normalizedName: 'baking powder' },
      { name: 'Vegetable oil for griddle', quantity: 30, unit: 'ml', normalizedName: 'vegetable oil' }
    ],
    steps: [
      'Soak raw rice overnight, blend with a portion of cooked rice, yeast, and sugar into a batter.',
      'Allow batter to ferment and rise for 3 hours.',
      'Stir in baking powder. Spoon batter into a hot oiled multi-cavity griddle.',
      'Flip once until both sides are puffy, golden and crispy.'
    ],
    prepTimeMins: 180, // Needs fermentation time
    cookTimeMins: 20,
    servings: 4,
    nutritionPerServing: { calories: 260, protein: 5, carbs: 54, fat: 3, fiber: 2, sugar: 7, sodium: 50 },
    dietTags: ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'halal'],
    allergens: [],
    estimatedCostPerServing: 300,
    costCurrency: 'NGN',
    difficulty: 'hard',
    tags: ['puffy', 'fermented', 'traditional']
  },
  {
    id: 'miyan-kuka',
    name: 'Miyan Kuka (Baobab Soup)',
    description: 'A traditional Northern Nigerian green soup cooked with powdered baobab leaves and dried fish.',
    cuisine: 'Nigerian',
    imageUrl: '/images/recipes/miyan-kuka.jpg',
    mealTypes: ['lunch', 'dinner'],
    ingredients: [
      { name: 'Kuka (baobab leaf) powder', quantity: 30, unit: 'g', normalizedName: 'baobab powder' },
      { name: 'Palm oil', quantity: 30, unit: 'ml', normalizedName: 'palm oil' },
      { name: 'Beef chunks', quantity: 150, unit: 'g', normalizedName: 'beef' },
      { name: 'Dry fish', quantity: 50, unit: 'g', normalizedName: 'fish' },
      { name: 'Locust beans', quantity: 15, unit: 'g', normalizedName: 'locust beans' }
    ],
    steps: [
      'Boil beef, dry fish, and locust beans in stock for 15 minutes.',
      'Add palm oil and season with salt and pepper.',
      'Reduce heat, sprinkle kuka powder slowly while whisking to avoid lumps.',
      'Simmer for 5 minutes on very low heat.'
    ],
    prepTimeMins: 10,
    cookTimeMins: 25,
    servings: 3,
    nutritionPerServing: { calories: 290, protein: 18, carbs: 10, fat: 20, fiber: 5, sugar: 1, sodium: 390 },
    dietTags: ['gluten_free', 'dairy_free', 'halal'],
    allergens: ['fish'],
    estimatedCostPerServing: 900,
    costCurrency: 'NGN',
    difficulty: 'medium',
    tags: ['herbal', 'traditional', 'swallow_soup']
  },

  // ==================== INTERNATIONAL CUISINE (20 Recipes) ====================
  {
    id: 'spaghetti-carbonara',
    name: 'Spaghetti Carbonara',
    description: 'An authentic Italian pasta dish cooked with eggs, hard cheese, and crispy guanciale.',
    cuisine: 'Italian',
    imageUrl: '/images/recipes/spaghetti-carbonara.jpg',
    mealTypes: ['lunch', 'dinner'],
    ingredients: [
      { name: 'Spaghetti pasta', quantity: 350, unit: 'g', normalizedName: 'spaghetti' },
      { name: 'Pancetta or bacon strips', quantity: 150, unit: 'g', normalizedName: 'bacon' },
      { name: 'Egg yolks', quantity: 4, unit: 'pieces', normalizedName: 'egg' },
      { name: 'Pecorino Romano cheese', quantity: 50, unit: 'g', normalizedName: 'cheese' },
      { name: 'Black pepper', quantity: 5, unit: 'g', normalizedName: 'pepper' }
    ],
    steps: [
      'Boil pasta in salted water until al dente.',
      'Crisp pancetta in a dry pan until fat renders.',
      'Whisk eggs yolks and grated cheese with warm water to form a sauce paste.',
      'Drain pasta, toss in pan with pancetta, remove from heat, and fold in the egg mixture.'
    ],
    prepTimeMins: 10,
    cookTimeMins: 15,
    servings: 3,
    nutritionPerServing: { calories: 510, protein: 22, carbs: 55, fat: 22, fiber: 2, sugar: 1, sodium: 710 },
    dietTags: [],
    allergens: ['gluten', 'eggs', 'dairy'],
    estimatedCostPerServing: 1100,
    costCurrency: 'NGN',
    difficulty: 'medium',
    tags: ['creamy', 'pasta', 'classic']
  },
  {
    id: 'margherita-pizza',
    name: 'Neapolitan Margherita Pizza',
    description: 'A classic Italian flatbread topped with simple marinara sauce, fresh mozzarella, and basil.',
    cuisine: 'Italian',
    imageUrl: '/images/recipes/margherita-pizza.jpg',
    mealTypes: ['lunch', 'dinner', 'snack'],
    ingredients: [
      { name: 'Pizza dough ball', quantity: 250, unit: 'g', normalizedName: 'pizza dough' },
      { name: 'Tomato passata sauce', quantity: 80, unit: 'ml', normalizedName: 'tomato paste' },
      { name: 'Fresh mozzarella cheese slices', quantity: 100, unit: 'g', normalizedName: 'cheese' },
      { name: 'Fresh basil leaves', quantity: 10, unit: 'g', normalizedName: 'basil' },
      { name: 'Olive oil', quantity: 10, unit: 'ml', normalizedName: 'olive oil' }
    ],
    steps: [
      'Roll out dough flat on a pizza tray or baking sheet.',
      'Spread passata sauce evenly, top with mozzarella slices and basil.',
      'Drizzle with olive oil.',
      'Bake in a preheated oven at maximum temperature for 10-12 minutes.'
    ],
    prepTimeMins: 15,
    cookTimeMins: 12,
    servings: 2,
    nutritionPerServing: { calories: 390, protein: 16, carbs: 54, fat: 12, fiber: 3, sugar: 4, sodium: 680 },
    dietTags: ['vegetarian', 'halal'],
    allergens: ['gluten', 'dairy'],
    estimatedCostPerServing: 800,
    costCurrency: 'NGN',
    difficulty: 'medium',
    tags: ['baked', 'classic', 'kid_friendly']
  },
  {
    id: 'chicken-tikka',
    name: 'Chicken Tikka Masala',
    description: 'Tender tandoori chicken pieces simmered in a spiced, creamy tomato curry sauce.',
    cuisine: 'Indian',
    imageUrl: '/images/recipes/chicken-tikka-masala.jpg',
    mealTypes: ['lunch', 'dinner'],
    ingredients: [
      { name: 'Chicken breast cubed', quantity: 450, unit: 'g', normalizedName: 'chicken' },
      { name: 'Plain Greek yogurt', quantity: 100, unit: 'g', normalizedName: 'yogurt' },
      { name: 'Garam masala & cumin spices', quantity: 15, unit: 'g', normalizedName: 'spices' },
      { name: 'Tomato puree', quantity: 200, unit: 'g', normalizedName: 'tomato paste' },
      { name: 'Heavy cream', quantity: 50, unit: 'ml', normalizedName: 'cream' }
    ],
    steps: [
      'Marinate chicken in yogurt and spices for 2 hours, then grill until cooked.',
      'For the sauce, simmer tomato puree, garlic, ginger, and masala spices.',
      'Stir in heavy cream and cooked grilled chicken pieces.',
      'Simmer on low heat for 10 minutes.'
    ],
    prepTimeMins: 20,
    cookTimeMins: 20,
    servings: 3,
    nutritionPerServing: { calories: 420, protein: 32, carbs: 10, fat: 28, fiber: 2, sugar: 4, sodium: 590 },
    dietTags: ['gluten_free', 'keto', 'low_carb', 'halal'],
    allergens: ['dairy'],
    estimatedCostPerServing: 1600,
    costCurrency: 'NGN',
    difficulty: 'hard',
    tags: ['curry', 'creamy', 'spiced']
  },
  {
    id: 'chana-masala',
    name: 'Vegan Chana Masala',
    description: 'A classic Indian chickpea stew loaded with ginger, cumin, coriander, and fresh tomatoes.',
    cuisine: 'Indian',
    imageUrl: '/images/recipes/chana-masala.jpg',
    mealTypes: ['lunch', 'dinner'],
    ingredients: [
      { name: 'Boiled canned chickpeas', quantity: 400, unit: 'g', normalizedName: 'chickpeas' },
      { name: 'Diced tomatoes', quantity: 200, unit: 'g', normalizedName: 'tomato' },
      { name: 'Garam masala spice mix', quantity: 10, unit: 'g', normalizedName: 'spices' },
      { name: 'Onions', quantity: 1, unit: 'piece', normalizedName: 'onion' },
      { name: 'Coriander leaves', quantity: 10, unit: 'g', normalizedName: 'coriander' }
    ],
    steps: [
      'Sauté chopped onions and spices in oil until fragrant.',
      'Add diced tomatoes and cook for 5 minutes until soft.',
      'Pour in drained chickpeas and 1 cup of water, simmer for 15 minutes.',
      'Garnish with chopped fresh coriander leaves.'
    ],
    prepTimeMins: 10,
    cookTimeMins: 15,
    servings: 3,
    nutritionPerServing: { calories: 230, protein: 9, carbs: 36, fat: 5, fiber: 9, sugar: 3, sodium: 390 },
    dietTags: ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'diabetic_friendly', 'halal'],
    allergens: [],
    estimatedCostPerServing: 450,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: ['vegan', 'fiber_rich', 'budget']
  },
  {
    id: 'greek-salad',
    name: 'Mediterranean Greek Salad',
    description: 'Crisp cucumbers, juicy tomatoes, red onions, olives, and blocks of creamy feta cheese.',
    cuisine: 'Mediterranean',
    imageUrl: '/images/recipes/greek-salad.jpg',
    mealTypes: ['lunch', 'snack'],
    ingredients: [
      { name: 'English cucumber', quantity: 1, unit: 'piece', normalizedName: 'cucumber' },
      { name: 'Cherry tomatoes', quantity: 150, unit: 'g', normalizedName: 'tomato' },
      { name: 'Feta cheese block', quantity: 100, unit: 'g', normalizedName: 'cheese' },
      { name: 'Kalamata olives', quantity: 50, unit: 'g', normalizedName: 'olives' },
      { name: 'Extra virgin olive oil', quantity: 20, unit: 'ml', normalizedName: 'olive oil' }
    ],
    steps: [
      'Chop cucumber, tomatoes, and red onions into chunks.',
      'Toss chopped vegetables in a bowl with kalamata olives.',
      'Drizzle with olive oil and sprinkle dried oregano.',
      'Top with cubed feta cheese.'
    ],
    prepTimeMins: 10,
    cookTimeMins: 0,
    servings: 2,
    nutritionPerServing: { calories: 210, protein: 6, carbs: 7, fat: 18, fiber: 2, sugar: 3, sodium: 490 },
    dietTags: ['vegetarian', 'gluten_free', 'keto', 'low_carb', 'diabetic_friendly', 'halal'],
    allergens: ['dairy'],
    estimatedCostPerServing: 700,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: ['raw', 'fresh', 'quick']
  },
  {
    id: 'falafel-wrap',
    name: 'Falafel Wrap with Tahini',
    description: 'Crispy herb chickpea falafels wrapped in warm flatbread with salad and creamy sesame tahini sauce.',
    cuisine: 'Mediterranean',
    imageUrl: '/images/recipes/falafel-wrap.jpg',
    mealTypes: ['lunch', 'dinner'],
    ingredients: [
      { name: 'Prepared chickpea falafel balls', quantity: 6, unit: 'pieces', normalizedName: 'falafel' },
      { name: 'Pita or flatbread wraps', quantity: 2, unit: 'pieces', normalizedName: 'flatbread' },
      { name: 'Hummus & Tahini paste', quantity: 40, unit: 'g', normalizedName: 'tahini' },
      { name: 'Lettuce & tomato slices', quantity: 80, unit: 'g', normalizedName: 'salad' }
    ],
    steps: [
      'Reheat or fry falafel balls until crispy.',
      'Warm the flatbread wraps, spread a layer of hummus.',
      'Place falafels and sliced salad inside the wraps.',
      'Drizzle with tahini paste, roll tightly and serve.'
    ],
    prepTimeMins: 10,
    cookTimeMins: 5,
    servings: 2,
    nutritionPerServing: { calories: 390, protein: 11, carbs: 52, fat: 15, fiber: 7, sugar: 4, sodium: 580 },
    dietTags: ['vegetarian', 'vegan', 'dairy_free', 'halal'],
    allergens: ['gluten', 'sesame'],
    estimatedCostPerServing: 800,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: ['wrap', 'street_food', 'portable']
  },
  {
    id: 'hummus-pita',
    name: 'Hummus & Warm Pita',
    description: 'Creamy blended chickpeas with garlic, lemon, and olive oil. Perfect afternoon dip.',
    cuisine: 'Mediterranean',
    imageUrl: '/images/recipes/hummus-pita.jpg',
    mealTypes: ['snack'],
    ingredients: [
      { name: 'Canned chickpeas drained', quantity: 250, unit: 'g', normalizedName: 'chickpeas' },
      { name: 'Sesame tahini paste', quantity: 30, unit: 'g', normalizedName: 'tahini' },
      { name: 'Lemon juice & olive oil', quantity: 25, unit: 'ml', normalizedName: 'olive oil' },
      { name: 'Pita bread pockets', quantity: 2, unit: 'pieces', normalizedName: 'flatbread' }
    ],
    steps: [
      'Blend chickpeas, tahini, lemon juice, garlic, and water until thick and creamy.',
      'Spoon into a bowl, make a well, and pour olive oil.',
      'Warm the pita pockets in a toaster or griddle.',
      'Slice bread and serve with the hummus dip.'
    ],
    prepTimeMins: 10,
    cookTimeMins: 3,
    servings: 2,
    nutritionPerServing: { calories: 290, protein: 9, carbs: 38, fat: 12, fiber: 6, sugar: 1, sodium: 390 },
    dietTags: ['vegetarian', 'vegan', 'dairy_free', 'halal'],
    allergens: ['gluten', 'sesame'],
    estimatedCostPerServing: 400,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: ['dip', 'creamy', 'snack']
  },
  {
    id: 'classic-burger',
    name: 'Flame Grilled Beef Burger',
    description: 'Seasoned beef patty grilled and served in a brioche bun with cheddar, lettuce, and tomatoes.',
    cuisine: 'American',
    imageUrl: '/images/recipes/beef-burger.jpg',
    mealTypes: ['lunch', 'dinner'],
    ingredients: [
      { name: 'Minced beef chuck', quantity: 300, unit: 'g', normalizedName: 'ground beef' },
      { name: 'Burger brioche buns', quantity: 2, unit: 'pieces', normalizedName: 'brioche bun' },
      { name: 'Cheddar cheese slices', quantity: 2, unit: 'pieces', normalizedName: 'cheese' },
      { name: 'Lettuce & tomato slices', quantity: 50, unit: 'g', normalizedName: 'salad' }
    ],
    steps: [
      'Shape minced beef into two circular patties, season with salt and pepper.',
      'Sear patties on a hot griddle for 4 minutes per side.',
      'Place cheese slices on patties to melt during the last minute.',
      'Toast buns, build burgers with patties, lettuce, and tomatoes.'
    ],
    prepTimeMins: 10,
    cookTimeMins: 8,
    servings: 2,
    nutritionPerServing: { calories: 540, protein: 34, carbs: 32, fat: 28, fiber: 2, sugar: 6, sodium: 790 },
    dietTags: ['halal'],
    allergens: ['gluten', 'dairy'],
    estimatedCostPerServing: 1800,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: ['grilled', 'fast_food', 'classic']
  },
  {
    id: 'chocolate-cookies',
    name: 'Chewy Chocolate Chip Cookies',
    description: 'Golden-baked cookies with crispy edges, chewy centers, and rich dark chocolate chips.',
    cuisine: 'American',
    imageUrl: '/images/recipes/chocolate-chip-cookies.jpg',
    mealTypes: ['snack'],
    ingredients: [
      { name: 'Baking flour', quantity: 200, unit: 'g', normalizedName: 'flour' },
      { name: 'Butter softened', quantity: 100, unit: 'g', normalizedName: 'butter' },
      { name: 'Brown sugar', quantity: 100, unit: 'g', normalizedName: 'sugar' },
      { name: 'Dark chocolate chips', quantity: 100, unit: 'g', normalizedName: 'chocolate' },
      { name: 'Egg', quantity: 1, unit: 'piece', normalizedName: 'egg' }
    ],
    steps: [
      'Cream butter and brown sugar together, beat in the egg.',
      'Fold in flour, baking soda, and chocolate chips to form a dough.',
      'Spoon round dough portions onto a lined baking sheet.',
      'Bake in oven at 180°C for 10-12 minutes until edges are golden.'
    ],
    prepTimeMins: 15,
    cookTimeMins: 12,
    servings: 10, // Yields multiple cookies
    nutritionPerServing: { calories: 180, protein: 2, carbs: 24, fat: 9, fiber: 1, sugar: 14, sodium: 110 },
    dietTags: ['vegetarian', 'halal'],
    allergens: ['gluten', 'dairy', 'eggs'],
    estimatedCostPerServing: 200,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: ['baked', 'sweet', 'classic']
  },
  {
    id: 'chicken-stirfry',
    name: 'Ginger Chicken Stir-Fry',
    description: 'Stir-fried chicken breast fillets with fresh broccoli, bell peppers, carrots, and ginger-soy sauce.',
    cuisine: 'Asian',
    imageUrl: '/images/recipes/chicken-stirfry.jpg',
    mealTypes: ['lunch', 'dinner'],
    ingredients: [
      { name: 'Chicken breast sliced', quantity: 300, unit: 'g', normalizedName: 'chicken' },
      { name: 'Broccoli florets & carrot sticks', quantity: 200, unit: 'g', normalizedName: 'vegetables' },
      { name: 'Soy sauce', quantity: 30, unit: 'ml', normalizedName: 'soy sauce' },
      { name: 'Minced ginger & garlic', quantity: 15, unit: 'g', normalizedName: 'ginger' },
      { name: 'Sesame oil', quantity: 15, unit: 'ml', normalizedName: 'oil' }
    ],
    steps: [
      'Heat sesame oil in a hot wok, sear chicken slices until cooked. Set aside.',
      'In the same wok, toss ginger, garlic, broccoli, and carrots, fry for 4 minutes.',
      'Add chicken back into the wok, pour in soy sauce.',
      'Stir fry on high heat for 2 minutes and serve.'
    ],
    prepTimeMins: 15,
    cookTimeMins: 10,
    servings: 2,
    nutritionPerServing: { calories: 290, protein: 28, carbs: 12, fat: 12, fiber: 3, sugar: 3, sodium: 680 },
    dietTags: ['dairy_free', 'keto', 'low_carb', 'diabetic_friendly', 'halal'],
    allergens: ['soy', 'sesame'],
    estimatedCostPerServing: 1200,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: ['stir_fry', 'quick', 'high_protein']
  },
  {
    id: 'egg-fried-rice',
    name: 'Chinese Egg Fried Rice',
    description: 'Stir-fried cold jasmine rice tossed with green onions, scrambled eggs, and light soy sauce.',
    cuisine: 'Asian',
    imageUrl: '/images/recipes/egg-fried-rice.jpg',
    mealTypes: ['breakfast', 'lunch', 'dinner'],
    ingredients: [
      { name: 'Cooked jasmine rice (cold)', quantity: 400, unit: 'g', normalizedName: 'rice' },
      { name: 'Eggs', quantity: 2, unit: 'pieces', normalizedName: 'egg' },
      { name: 'Green scallions (spring onions)', quantity: 30, unit: 'g', normalizedName: 'scallions' },
      { name: 'Soy sauce', quantity: 20, unit: 'ml', normalizedName: 'soy sauce' }
    ],
    steps: [
      'Scramble eggs in a hot oiled pan, break into pieces and set aside.',
      'Add more oil, toss in white parts of chopped scallions and cook.',
      'Add cold rice, break up lumps, and stir fry for 5 minutes.',
      'Drizzle soy sauce, return eggs and toss with green parts of scallions.'
    ],
    prepTimeMins: 5,
    cookTimeMins: 10,
    servings: 2,
    nutritionPerServing: { calories: 340, protein: 9, carbs: 62, fat: 5, fiber: 2, sugar: 1, sodium: 490 },
    dietTags: ['vegetarian', 'dairy_free', 'halal'],
    allergens: ['eggs', 'soy'],
    estimatedCostPerServing: 500,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: ['quick', 'stir_fry', 'budget']
  },
  {
    id: 'miso-soup',
    name: 'Traditional Japanese Miso Soup',
    description: 'A light, comforting soup broth flavored with dashi stock, soybean paste, tofu, and wakame.',
    cuisine: 'Asian',
    imageUrl: '/images/recipes/miso-soup.jpg',
    mealTypes: ['breakfast', 'snack'],
    ingredients: [
      { name: 'Silken tofu cubed', quantity: 150, unit: 'g', normalizedName: 'tofu' },
      { name: 'Miso paste', quantity: 30, unit: 'g', normalizedName: 'miso' },
      { name: 'Dried wakame seaweed', quantity: 5, unit: 'g', normalizedName: 'seaweed' },
      { name: 'Dashi stock powder', quantity: 5, unit: 'g', normalizedName: 'dashi' }
    ],
    steps: [
      'Dissolve dashi stock in 3 cups of boiling water.',
      'Add silken tofu cubes and wakame seaweed, simmer for 3 minutes.',
      'Ladle some broth into a cup, whisk miso paste until dissolved, return to pot.',
      'Remove from heat instantly (do not boil miso) and serve.'
    ],
    prepTimeMins: 5,
    cookTimeMins: 5,
    servings: 2,
    nutritionPerServing: { calories: 80, protein: 6, carbs: 6, fat: 3, fiber: 1, sugar: 2, sodium: 620 },
    dietTags: ['vegetarian', 'dairy_free', 'gluten_free', 'diabetic_friendly', 'halal'],
    allergens: ['soy'],
    estimatedCostPerServing: 400,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: ['broth', 'warm', 'light']
  },
  {
    id: 'avocado-toast',
    name: 'Smashed Avocado Toast',
    description: 'Sourdough bread slices toasted, topped with creamy avocado mash and a warm poached egg.',
    cuisine: 'Mediterranean',
    imageUrl: '/images/recipes/avocado-toast.jpg',
    mealTypes: ['breakfast', 'snack'],
    ingredients: [
      { name: 'Sourdough bread slices', quantity: 2, unit: 'pieces', normalizedName: 'sourdough' },
      { name: 'Ripe avocado', quantity: 1, unit: 'piece', normalizedName: 'avocado' },
      { name: 'Egg', quantity: 1, unit: 'piece', normalizedName: 'egg' },
      { name: 'Lemon juice & chili flakes', quantity: 5, unit: 'ml', normalizedName: 'spices' }
    ],
    steps: [
      'Mash avocado with a squeeze of lemon juice, salt, and chili flakes.',
      'Toast sourdough slices until crispy.',
      'Poach or fry the egg in a pan.',
      'Spread avocado mash over toast, top with the egg and serve.'
    ],
    prepTimeMins: 5,
    cookTimeMins: 5,
    servings: 1,
    nutritionPerServing: { calories: 310, protein: 12, carbs: 24, fat: 18, fiber: 7, sugar: 2, sodium: 390 },
    dietTags: ['vegetarian', 'dairy_free', 'halal'],
    allergens: ['gluten', 'eggs'],
    estimatedCostPerServing: 500,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: ['toast', 'breakfast', 'quick']
  },
  {
    id: 'oatmeal-bowl',
    name: 'Banana Berry Oatmeal Bowl',
    description: 'Creamy oats cooked in almond milk, topped with sliced bananas, blueberries, and seeds.',
    cuisine: 'American',
    imageUrl: '/images/recipes/oatmeal-bowl.jpg',
    mealTypes: ['breakfast'],
    ingredients: [
      { name: 'Rolled oats', quantity: 60, unit: 'g', normalizedName: 'oats' },
      { name: 'Almond milk', quantity: 250, unit: 'ml', normalizedName: 'almond milk' },
      { name: 'Banana sliced', quantity: 0.5, unit: 'piece', normalizedName: 'banana' },
      { name: 'Fresh blueberries', quantity: 30, unit: 'g', normalizedName: 'blueberries' }
    ],
    steps: [
      'Combine oats and almond milk in a pot.',
      'Simmer on medium heat for 7-8 minutes, stirring until thick and creamy.',
      'Pour oats into a bowl.',
      'Arrange sliced bananas, blueberries, and a drizzle of honey on top.'
    ],
    prepTimeMins: 2,
    cookTimeMins: 8,
    servings: 1,
    nutritionPerServing: { calories: 280, protein: 8, carbs: 48, fat: 4, fiber: 7, sugar: 12, sodium: 80 },
    dietTags: ['vegetarian', 'vegan', 'dairy_free', 'gluten_free', 'halal'],
    allergens: [],
    estimatedCostPerServing: 350,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: ['creamy', 'oats', 'healthy']
  },
  {
    id: 'french-toast',
    name: 'Cinnamon French Toast',
    description: 'Fluffy brioche slices soaked in a spiced egg-milk batter and pan-fried until golden.',
    cuisine: 'American',
    imageUrl: '/images/recipes/french-toast.jpg',
    mealTypes: ['breakfast'],
    ingredients: [
      { name: 'Brioche bread thick slices', quantity: 2, unit: 'pieces', normalizedName: 'brioche' },
      { name: 'Egg', quantity: 1, unit: 'piece', normalizedName: 'egg' },
      { name: 'Whole milk', quantity: 50, unit: 'ml', normalizedName: 'milk' },
      { name: 'Ground cinnamon', quantity: 2, unit: 'g', normalizedName: 'cinnamon' }
    ],
    steps: [
      'Whisk egg, milk, cinnamon, and a drop of vanilla extract in a shallow bowl.',
      'Dip bread slices into the egg mixture, allowing both sides to absorb batter.',
      'Melt butter in a skillet, fry bread for 3 minutes per side until golden brown.',
      'Serve warm with a drizzle of syrup.'
    ],
    prepTimeMins: 5,
    cookTimeMins: 6,
    servings: 1,
    nutritionPerServing: { calories: 340, protein: 12, carbs: 38, fat: 14, fiber: 2, sugar: 8, sodium: 320 },
    dietTags: ['vegetarian', 'halal'],
    allergens: ['gluten', 'eggs', 'dairy'],
    estimatedCostPerServing: 400,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: ['sweet', 'breakfast', 'comfort_food']
  },
  {
    id: 'caesar-salad',
    name: 'Chicken Caesar Salad',
    description: 'Crisp romaine lettuce tossed in creamy parmesan dressing, topped with grilled chicken and croutons.',
    cuisine: 'American',
    imageUrl: '/images/recipes/caesar-salad.jpg',
    mealTypes: ['lunch', 'dinner'],
    ingredients: [
      { name: 'Romaine lettuce chopped', quantity: 150, unit: 'g', normalizedName: 'lettuce' },
      { name: 'Grilled chicken breast strips', quantity: 100, unit: 'g', normalizedName: 'chicken' },
      { name: 'Caesar salad dressing', quantity: 30, unit: 'ml', normalizedName: 'dressing' },
      { name: 'Grated parmesan cheese & croutons', quantity: 20, unit: 'g', normalizedName: 'cheese' }
    ],
    steps: [
      'Wash and dry romaine lettuce, place in a salad bowl.',
      'Add chicken breast strips and croutons.',
      'Pour Caesar dressing over ingredients and toss to coat.',
      'Sprinkle with grated parmesan cheese.'
    ],
    prepTimeMins: 10,
    cookTimeMins: 0,
    servings: 1,
    nutritionPerServing: { calories: 360, protein: 26, carbs: 12, fat: 22, fiber: 2, sugar: 2, sodium: 580 },
    dietTags: ['halal'],
    allergens: ['gluten', 'dairy'],
    estimatedCostPerServing: 1100,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: ['fresh', 'crisp', 'salad']
  },
  {
    id: 'lentil-soup',
    name: 'Lemon Lentil Soup',
    description: 'A hearty and nutritious yellow lentil soup flavored with garlic, cumin, and fresh lemon squeeze.',
    cuisine: 'Mediterranean',
    imageUrl: '/images/recipes/lentil-soup.jpg',
    mealTypes: ['lunch', 'dinner'],
    ingredients: [
      { name: 'Red lentils washed', quantity: 200, unit: 'g', normalizedName: 'lentils' },
      { name: 'Onion & carrots diced', quantity: 100, unit: 'g', normalizedName: 'vegetables' },
      { name: 'Ground cumin', quantity: 5, unit: 'g', normalizedName: 'cumin' },
      { name: 'Fresh lemon juice', quantity: 15, unit: 'ml', normalizedName: 'lemon' },
      { name: 'Vegetable broth', quantity: 700, unit: 'ml', normalizedName: 'broth' }
    ],
    steps: [
      'Sauté chopped onion and carrot cubes in a pot.',
      'Add washed lentils, cumin, and vegetable broth. Bring to a boil.',
      'Simmer on low heat for 20 minutes until lentils are fully dissolved.',
      'Stir in fresh lemon juice, blend until creamy if desired, and serve.'
    ],
    prepTimeMins: 10,
    cookTimeMins: 20,
    servings: 3,
    nutritionPerServing: { calories: 210, protein: 12, carbs: 32, fat: 3, fiber: 8, sugar: 3, sodium: 410 },
    dietTags: ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'diabetic_friendly', 'halal'],
    allergens: [],
    estimatedCostPerServing: 400,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: ['soup', 'creamy', 'fiber_rich', 'budget']
  },
  {
    id: 'baked-salmon',
    name: 'Garlic Herb Baked Salmon',
    description: 'Flaky baked salmon fillets seasoned with garlic, dill, lemon, and rich butter.',
    cuisine: 'Mediterranean',
    imageUrl: '/images/recipes/baked-salmon.jpg',
    mealTypes: ['lunch', 'dinner'],
    ingredients: [
      { name: 'Salmon fillet skin-on', quantity: 300, unit: 'g', normalizedName: 'salmon' },
      { name: 'Butter melted', quantity: 20, unit: 'g', normalizedName: 'butter' },
      { name: 'Minced garlic & dried dill', quantity: 10, unit: 'g', normalizedName: 'garlic' },
      { name: 'Lemon slices', quantity: 2, unit: 'pieces', normalizedName: 'lemon' }
    ],
    steps: [
      'Place salmon fillets on a lined baking tray.',
      'Brush with melted butter, rub with garlic, dill, and salt.',
      'Top with lemon slices.',
      'Bake in a preheated oven at 200°C for 12-15 minutes until fish flakes easily.'
    ],
    prepTimeMins: 5,
    cookTimeMins: 15,
    servings: 2,
    nutritionPerServing: { calories: 340, protein: 32, carbs: 1, fat: 22, fiber: 0, sugar: 0, sodium: 310 },
    dietTags: ['gluten_free', 'keto', 'low_carb', 'diabetic_friendly', 'halal'],
    allergens: ['dairy', 'fish'],
    estimatedCostPerServing: 2200,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: ['baked', 'fish', 'healthy']
  },
  {
    id: 'taco-salad',
    name: 'Turkey Taco Salad',
    description: 'Ground turkey cooked in taco spices, served on lettuce with corn, black beans, and salsa.',
    cuisine: 'Mexican',
    imageUrl: '/images/recipes/taco-salad.jpg',
    mealTypes: ['lunch', 'dinner'],
    ingredients: [
      { name: 'Minced lean turkey', quantity: 250, unit: 'g', normalizedName: 'ground turkey' },
      { name: 'Taco seasoning powder', quantity: 15, unit: 'g', normalizedName: 'spices' },
      { name: 'Romaine lettuce chopped', quantity: 150, unit: 'g', normalizedName: 'lettuce' },
      { name: 'Sweet corn & black beans', quantity: 100, unit: 'g', normalizedName: 'beans' },
      { name: 'Tomato salsa dressing', quantity: 30, unit: 'ml', normalizedName: 'salsa' }
    ],
    steps: [
      'Brown the minced turkey in a skillet, add taco seasoning and 1/4 cup water, simmer for 5 minutes.',
      'Arrange lettuce, corn, and black beans in a serving bowl.',
      'Top with the warm cooked spiced turkey.',
      'Ladle tomato salsa dressing on top and toss.'
    ],
    prepTimeMins: 10,
    cookTimeMins: 8,
    servings: 2,
    nutritionPerServing: { calories: 290, protein: 24, carbs: 18, fat: 12, fiber: 5, sugar: 4, sodium: 590 },
    dietTags: ['gluten_free', 'dairy_free', 'halal'],
    allergens: [],
    estimatedCostPerServing: 1200,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: ['spicy', 'taco', 'salad']
  },
  {
    id: 'quesadilla',
    name: 'Cheesy Veggie Quesadilla',
    description: 'Toasted flour tortillas filled with melted cheddar, grilled bell peppers, onions, and sweet corn.',
    cuisine: 'Mexican',
    imageUrl: '/images/recipes/veggie-quesadilla.jpg',
    mealTypes: ['lunch', 'dinner', 'snack'],
    ingredients: [
      { name: 'Flour tortillas large', quantity: 2, unit: 'pieces', normalizedName: 'tortilla' },
      { name: 'Shredded cheddar cheese', quantity: 100, unit: 'g', normalizedName: 'cheese' },
      { name: 'Bell pepper & onions sliced', quantity: 80, unit: 'g', normalizedName: 'vegetables' },
      { name: 'Sweet corn', quantity: 30, unit: 'g', normalizedName: 'sweet corn' }
    ],
    steps: [
      'Sauté bell pepper and onion slices in a pan until soft. Set aside.',
      'Place one tortilla in a clean skillet, sprinkle cheese, vegetables, and corn.',
      'Top with the second tortilla, press flat.',
      'Toast on medium heat for 3-4 minutes per side until tortilla is crispy and cheese is melted.'
    ],
    prepTimeMins: 10,
    cookTimeMins: 8,
    servings: 2,
    nutritionPerServing: { calories: 380, protein: 14, carbs: 42, fat: 16, fiber: 3, sugar: 3, sodium: 620 },
    dietTags: ['vegetarian', 'halal'],
    allergens: ['gluten', 'dairy'],
    estimatedCostPerServing: 650,
    costCurrency: 'NGN',
    difficulty: 'easy',
    tags: ['toasted', 'cheesy', 'vegetarian']
  }
];
