async function fetchHouseData(houseName) {
    const proxyUrl = 'https://harrypotterapi-b3l0.onrender.com/api/houses';

    const houseImages = {
      'slytherin': '/images/slytherin.webp',
      'gryffindor': '/images/gryffindor.webp',
      'ravenclaw': '/images/ravenclaw.webp',
      'hufflepuff': '/images/hufflepuff.webp',
  };

    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch houses data');
        }
        const houses = await response.json();

        // Find the specific house data from the fetched houses
        const houseData = houses.find(house => house.name.toLowerCase() === houseName.toLowerCase());
        if (!houseData) {
            throw new Error(`${houseName} data not found`);
        }

        // Populate house data into the main content
        const mainContent = document.querySelector('main');
        const houseDetails = `
            <div class="mx-auto max-w-2xl px-4">
                <h1 class="text-3xl font-bold text-center">${houseData.name}</h1>
                <div class="flex justify-center padding-top: 5rem;">
                  <img class="w-60 h-60 md:w-96 md:h-96" src="${houseImages[houseData.name.toLowerCase()]}" alt="${houseData.name} House">
                </div>
                <p class="mt-4">House Colors: ${houseData.houseColours}</p>
                <p>Founder: ${houseData.founder}</p>
                <p>Animal: ${houseData.animal}</p>
                <p>Element: ${houseData.element}</p>
                <p>Ghost: ${houseData.ghost}</p>
                <p>Common Room: ${houseData.commonRoom}</p>
                <p>Heads: ${houseData.heads.map(head => `${head.firstName} ${head.lastName}`).join(', ')}</p>
                <p>Traits: ${houseData.traits.map(trait => trait.name).join(', ')}</p>
            </div>
        `;
        mainContent.innerHTML = houseDetails;
    } catch (error) {
        console.error(`Error fetching ${houseName} data:`, error);
    }
}

// Call fetchHouseData when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const houseName = document.body.getAttribute('data-house');
    fetchHouseData(houseName);
});
