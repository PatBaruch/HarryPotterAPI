window.addEventListener('DOMContentLoaded', fetchSpells);

async function fetchSpells() {
  const proxyUrl = 'http://localhost:3000/api/spells';

  try {
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch spells data');
    }
    const spells = await response.json();

    // Group spells by their first letter
    const spellsByLetter = spells.reduce((acc, spell) => {
      const firstLetter = spell.name[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(spell);
      return acc;
    }, {});

    // Sort letters alphabetically
    const orderedLetters = Object.keys(spellsByLetter).sort();

    // Array to hold promises for each letter
    const fetchPromises = [];

    // Create fetch promises for each letter in the desired order
    for (const letter of orderedLetters) {
      const spellsForLetter = spellsByLetter[letter] || [];
      const promise = fetchSpellsForLetter(spellsForLetter, letter);
      fetchPromises.push(promise);
    }

    // Wait for all promises to resolve
    const spellsContentArray = await Promise.all(fetchPromises);

    // Populate spells data into the main content
    const mainContent = document.querySelector('main');
    mainContent.innerHTML =`
    <h1 class="text-6xl font-bold mb-12 text-center">Spells</h1>
    ${spellsContentArray.join('')}
    `;
  } catch (error) {
    console.error('Error fetching spells data:', error);
  }
}

async function fetchSpellsForLetter(spells, letter) {
  const spellsContent = `
    <div class="spell-group">
      <h2 class="text-4xl font-bold mt-6">${letter}</h2>
      <div class="spells-list">
        ${spells.map(spell => `
          <div class="spell p-4 border-b border-gray-200">
            <h3 class="text-xl font-bold">${spell.name}</h3>
            <p><strong>Incantation:</strong> ${spell.incantation || 'Unknown'}</p>
            <p><strong>Effect:</strong> ${spell.effect || 'Unknown'}</p>
            <p><strong>Type:</strong> ${spell.type || 'Unknown'}</p>
            <p><strong>Light:</strong> ${spell.light || 'Unknown'}</p>
            <p><strong>Creator:</strong> ${spell.creator || 'Unknown'}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  return spellsContent;
}
