window.addEventListener('DOMContentLoaded', fetchElixirs);

async function fetchElixirs() {
  const proxyUrl = 'https://harrypotterapi-b3l0.onrender.com/api/elixirs';

  try {
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch elixirs data');
    }
    const elixirs = await response.json();

    // Group elixirs by difficulty
    const elixirsByDifficulty = elixirs.reduce((acc, elixir) => {
      const difficulty = elixir.difficulty || 'Unknown';
      if (!acc[difficulty]) {
        acc[difficulty] = [];
      }
      acc[difficulty].push(elixir);
      return acc;
    }, {});

    // Reorder the difficulties
    const orderedDifficulties = [
      'OrdinaryWizardingLevel',
      'Beginner',
      'Moderate',
      'Advanced',
      'OneOfAKind',
      'Unknown'
    ];

    // Array to hold promises for each difficulty
    const fetchPromises = [];

    // Create fetch promises for each difficulty in the desired order
    for (const difficulty of orderedDifficulties) {
      const elixirsForDifficulty = elixirsByDifficulty[difficulty] || [];
      const promise = fetchElixirsForDifficulty(elixirsForDifficulty, difficulty);
      fetchPromises.push(promise);
    }

    // Wait for all promises to resolve
    const elixirsContentArray = await Promise.all(fetchPromises);

    // Populate elixirs data into the main content
    const mainContent = document.querySelector('main');
    mainContent.innerHTML =`
    <h1 class="text-6xl font-bold mb-12 text-center">Elixirs</h1>
    ${elixirsContentArray.join('')}
    `;
  } catch (error) {
    console.error('Error fetching elixirs data:', error);
  }
}

async function fetchElixirsForDifficulty(elixirs, difficulty) {
  const elixirsContent = `
    <div class="elixir-group">
      <h2 class="text-4xl font-bold mt-6">${difficulty}</h2>
      <div class="elixirs-list">
        ${elixirs.map(elixir => `
          <div class="elixir p-4 border-b border-gray-200">
            <h3 class="text-xl font-bold">${elixir.name}</h3>
            <p><strong>Effect:</strong> ${elixir.effect || 'Unknown'}</p>
            <p><strong>Side Effects:</strong> ${elixir.sideEffects !== null ? elixir.sideEffects : 'None'}</p>
            <p><strong>Characteristics:</strong> ${elixir.characteristics || 'Unknown'}</p>
            <p><strong>Brewing Time:</strong> ${elixir.time || 'Unknown'}</p>
            <p><strong>Ingredients:</strong> ${elixir.ingredients.map(ingredient => ingredient.name).join(', ') || 'Unknown'}</p>
            <p><strong>Inventor:</strong> ${
              elixir.inventors.length > 0
                ? elixir.inventors.map(inventor => `${inventor.firstName} ${inventor.lastName}`).join(', ')
                : 'Unknown'
            }</p>
            <p><strong>Manufacturer:</strong> ${elixir.manufacturer || 'Unknown'}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  return elixirsContent;
}
