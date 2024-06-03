window.addEventListener('DOMContentLoaded', fetchIngredients);

async function fetchIngredients() {
  const proxyUrl = 'https://harrypotterapi-b3l0.onrender.com/api/ingredients';

  try {
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch ingredients data');
    }
    const ingredients = await response.json();

    // Group ingredients by their first letter
    const ingredientsByLetter = ingredients.reduce((acc, ingredient) => {
      const firstLetter = ingredient.name[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(ingredient);
      return acc;
    }, {});

    // Sort letters alphabetically
    const orderedLetters = Object.keys(ingredientsByLetter).sort();

    // Array to hold promises for each letter
    const fetchPromises = [];

    // Create fetch promises for each letter in the desired order
    for (const letter of orderedLetters) {
      const ingredientsForLetter = ingredientsByLetter[letter] || [];
      const promise = fetchIngredientsForLetter(ingredientsForLetter, letter);
      fetchPromises.push(promise);
    }

    // Wait for all promises to resolve
    const ingredientsContentArray = await Promise.all(fetchPromises);

    // Populate ingredients data into the main content
    const mainContent = document.querySelector('main');
    mainContent.innerHTML =`
    <h1 class="text-6xl font-bold mb-12 text-center">Ingridients</h1>
    ${ingredientsContentArray.join('')}
    `;
  } catch (error) {
    console.error('Error fetching ingredients data:', error);
  }
}

async function fetchIngredientsForLetter(ingredients, letter) {
  const ingredientsContent = `
    <div class="ingredient-group">
      <h2 class="text-4xl font-bold mt-6">${letter}</h2>
      <div class="ingredients-list">
        ${ingredients.map(ingredient => `
          <div class="ingredient p-4 border-b border-gray-200">
            <h3 class="text-xl font-bold">${ingredient.name}</h3>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  return ingredientsContent;
}
