// JavaScript for RandomMagicEffect Tool
document.addEventListener('DOMContentLoaded', function () {
    const genreSelect = document.getElementById('genre-select');
    const randomEffectBtn = document.getElementById('random-effect-btn');
    const randomGenreEffectBtn = document.getElementById('random-genre-effect-btn');
    const effectDisplay = document.getElementById('effect-display');
    const jsonPath = '/GameMastersTable/assets/libraries/Random/RandomMagicEffect.json';

    let effectsData = {};

    // Fetch the JSON data
    fetch(jsonPath)
        .then(response => response.json())
        .then(data => {
            effectsData = data.genres;
            populateGenres();
        })
        .catch(error => console.error('Error loading JSON:', error));

    function populateGenres() {
        for (let genre in effectsData) {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreSelect.appendChild(option);
        }
    }

    function getRandomEffect() {
        const allEffects = [];
        for (let genre in effectsData) {
            allEffects.push(...effectsData[genre]);
        }
        const randomEffect = allEffects[Math.floor(Math.random() * allEffects.length)];
        displayEffect(randomEffect);
    }

    function getRandomEffectByGenre() {
        const selectedGenre = genreSelect.value;
        if (!selectedGenre) {
            alert('Please select a genre.');
            return;
        }
        const genreEffects = effectsData[selectedGenre];
        const randomEffect = genreEffects[Math.floor(Math.random() * genreEffects.length)];
        displayEffect(randomEffect);
    }

    function displayEffect(effect) {
        effectDisplay.innerHTML = `
      <h2>${effect.name}</h2>
      <p><strong>Dice Damage:</strong> ${effect.dice_damage}</p>
      <p><strong>Description:</strong> ${effect.description}</p>
    `;
    }

    randomEffectBtn.addEventListener('click', getRandomEffect);
    randomGenreEffectBtn.addEventListener('click', getRandomEffectByGenre);
});
