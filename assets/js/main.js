const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const pokemonCard = document.getElementById("pokemonCard");

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}" onclick="openDetailPokemon('${
    pokemon.number
  }')">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

function openDetailPokemon(pokemonNumber) {
  pokeApi
    .getPokemonDetail({
      url: `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}/`,
    })
    .then((detailedPokemon) => {
      const pokemonDetailHTML = convertPokemonDetailToHTML(detailedPokemon);
      displayPokemonCard(pokemonDetailHTML);
    })
    .catch((error) => {
      console.error("Erro ao obter detalhes do Pokémon:", error);
    });
}

function convertPokemonDetailToHTML(pokemon) {
  return `
        <span class="close-btn" onclick="closePokemonCard()">X</span>
        <div id="pokemonCardContent">
            <h2>Pokemon: ${pokemon.name}</h2>
            <p>Número: ${pokemon.number}</p>

            <div class="detail">
                <ol class="types-detail">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </div>
    `;
}

function displayPokemonCard(content) {
  const pokemonCard = document.getElementById("pokemonCard");
  const pokemonCardContent = document.getElementById("pokemonCardContent");

  pokemonCardContent.innerHTML = content;
  pokemonCard.style.display = "block";
}

function closePokemonCard() {
  pokemonCard.style.display = "none";
}
