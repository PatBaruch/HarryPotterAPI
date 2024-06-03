window.addEventListener('DOMContentLoaded', () => {
  const loading = document.getElementById('loading');
  loading.style.display = 'block'; // Show loading animation

  fetchWizards().then(() => {
    loading.style.display = 'none'; // Hide loading animation after content is loaded
  }).catch(error => {
    console.error('Error loading content:', error);
    loading.style.display = 'none'; // Hide loading animation if an error occurs
  });
});

async function fetchWizards() {
  const proxyUrl = 'https://harrypotterapi-b3l0.onrender.com/api/wizards';

  try {
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch wizards data');
    }
    const wizards = await response.json();

    // Group wizards by their first letter
    const wizardsByLetter = wizards.reduce((acc, wizard) => {
      const firstLetter = (wizard.lastName.trim()[0] || '#').toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(wizard);
      return acc;
    }, {});

    // Sort letters alphabetically
    const orderedLetters = Object.keys(wizardsByLetter).sort();

    // Array to hold promises for each letter
    const fetchPromises = [];

    // Create fetch promises for each letter in the desired order
    for (const letter of orderedLetters) {
      const wizardsForLetter = wizardsByLetter[letter] || [];
      const promise = fetchWizardsForLetter(wizardsForLetter, letter);
      fetchPromises.push(promise);
    }

    // Wait for all promises to resolve
    const wizardsContentArray = await Promise.all(fetchPromises);

    // Populate wizards data into the main content
    const mainContent = document.querySelector('main');
    mainContent.innerHTML =`
    <h1 class="text-6xl font-bold mb-12 text-center">Wizards and elixirs created by them</h1>
    ${wizardsContentArray.join('')}
    `;
  } catch (error) {
    console.error('Error fetching wizards data:', error);
  }
}

async function fetchWizardsForLetter(wizards, letter) {
  let isFirstWizard = true; // Flag to check if it's the first wizard in the group
  const wizardsContentArray = await Promise.all(
    wizards.map(async wizard => {
      const elixirDetailsArray = await Promise.all(
        wizard.elixirs.map(async elixir => {
          // Fetch and format elixir details
          try {
            const elixirDetails = await fetchElixirDetails(elixir.id); // Pass elixir ID instead of name
            return `
              <div class="elixir p-4 border-b border-gray-200 flex items-center">
                <a href="#" class="elixir-link" data-description="${elixirDetails.effect || 'No effect available'}">${elixir.name}:</a>
                <span class="elixir-description ml-2">${elixirDetails.effect || 'No effect available'}</span>
              </div>
            `;
          } catch (error) {
            console.error(`Error fetching elixir details for ${elixir.id}:`, error);
            return `${elixir.name}: Error fetching details`;
          }
        })
      );

      const elixirList = elixirDetailsArray.join('');

      // Generate HTML content for the wizard
      let wizardContent = `
        <div class="wizard p-4 border-b border-gray-200">
          <h3 class="text-xl font-bold">${wizard.firstName ? wizard.firstName + ' ' : ''}${wizard.lastName}</h3>
          <p><strong>Elixirs:</strong></p>
          <div class="elixirs">${elixirList}</div>
        </div>
      `;

      // If it's the first wizard in the group, add the letter
      if (isFirstWizard) {
        wizardContent = `
          <h2 class="text-4xl font-bold mt-6">${letter}</h2>
          ${wizardContent}
        `;
        isFirstWizard = false; // Update flag after adding the letter
      }

      return wizardContent;
    })
  );

  return wizardsContentArray.join('');
}


async function fetchElixirDetails(elixirId) {
  const proxyUrl = 'http://localhost:3000/api/elixirs'; // Adjust the URL as needed
  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch elixirs data');
  }
  const elixirs = await response.json();
  const matchingElixir = elixirs.find(elixir => elixir.id === elixirId); // Find elixir by ID
  if (!matchingElixir) {
    throw new Error(`Elixir '${elixirId}' not found`);
  }
  return matchingElixir;
}



