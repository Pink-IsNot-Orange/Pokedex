// Elementos del DOM
const container = document.querySelector("#pokemonContainer");
const containerBtn = document.querySelector("#btn-container");
const searchPoke = document.querySelector("#pokeSearch");
const navBtn = document.querySelectorAll(".navButtons");

// Url a la que hacer fetch
let pokemons = [];
let filterButtonTypes = ["all"];

/* UTILITIES */
function arraysEqual(a, b) {
  /* Esto esta aqui por otro bug donde al marcar varias veces un mismo tipo
  se seguia añadiendo al array 'filterButtonTypes' causando que no fueran de la misma
  longitud 'typesUnique' y 'filterButtonTypes'. Con Set se eliminan los duplicados*/
  a = new Set(a);
  b = new Set(b);
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.size !== b.size) return false;

  /* Esto es para arreglar un bug que impedia comprobar que dos array desordenados
  pudieran ser iguales: e.j => ["all","grass","poison"] != ["all","poison","grass"]*/

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/* Codigo asincrono fetch pokemonApi */
async function getPokemons(api) {
  pokemons = [];
  const pokeResults = await fetch(api);
  const data = await pokeResults.json();
  for (const pokeData of data.results) {
    const pokemonsResponse = await fetch(pokeData.url);
    const dataJson = await pokemonsResponse.json();
    pokemons.push(dataJson);
  }
}

/* DYNAMIC DISPLAY OF POKEMONS */
function displayPokemons(pokemonData) {
  container.innerHTML = "";
  let displayPoke = pokemonData.map((pokemon) => {
    return `<div class="ui card">
              <div class="image">
                  <img srcset="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" alt="pokemon">
              </div>
              <h4>${pokemon.name}</h4>
              <p><strong>#</strong> ${pokemon.id}</p>
            </div>
    `;
  });
  displayPoke = displayPoke.join("");
  container.innerHTML = displayPoke;
}

/* DYINAMIC BUTTONS DISPLAY */
function displayButtons(pokemon) {
  /* Conseguir todos los tipos de los 151 pokemon repetidos en un array */
  const pokeTypes = [];
  pokemon.forEach((poke) => {
    for (let i = 0; i < poke.types.length; i++) {
      pokeTypes.push(poke.types[i]["type"]["name"]);
    }
  });
  /* Declaracion para array unico usando el constructor Set
  que solo admite valores no duplicados */
  const typesUnique = ["all", ...new Set(pokeTypes)].sort();
  let btn = typesUnique
    .map((uType) => {
      return `<button class="filter-btn ${uType}" type="button" data-id="${uType}">${uType}</button>
    `;
    })
    .join("");
  containerBtn.innerHTML = btn;

  /* Esto es para conseguir dejar el boton ALL cuando no hay 
  mas posibilidades */
  if (arraysEqual(filterButtonTypes.sort(), typesUnique)) {
    let btn = typesUnique.map((uType) => {
      return `<button class="filter-btn ${uType}" type="button" data-id="${uType}">${uType}</button>
    `;
    });
    containerBtn.innerHTML = btn[0];
    filterButtonTypes = ["all"];
  }

  const filterBtns = document.querySelectorAll(".filter-btn");
  /* Filtros */
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const category = e.currentTarget.dataset.id;
      // Esto es para no volver a añadir ALL al array de comparacion (bug)
      if (category !== "all") {
        filterButtonTypes.push(category);
      }

      const filteredTypes = pokemon.filter((pokemonToFilter) => {
        for (let i = 0; i < pokemonToFilter.types.length; i++) {
          if (pokemonToFilter.types[i]["type"]["name"] === category) {
            return pokemonToFilter;
          }
        }
      });
      if (category === "all") {
        displayPokemons(pokemons);
        displayButtons(pokemons);
      } else {
        displayPokemons(filteredTypes);
        displayButtons(filteredTypes);
      }
    });
  });
}

searchPoke.addEventListener("keyup", (e) => {
  const filteredNames = pokemons.filter((filteredArray) => {
    return filteredArray.name.includes(e.target.value.toLowerCase());
  });
  displayPokemons(filteredNames);
});

navBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (e.target.value == "kanto") {
      const apiKanto = "https://pokeapi.co/api/v2/pokemon?limit=151";
      const pokeDisplay = getPokemons(apiKanto);
      pokeDisplay.then(() => {
        displayPokemons(pokemons);
        displayButtons(pokemons);
      });
    } else if (e.target.value == "johto") {
      const apiJohto = "https://pokeapi.co/api/v2/pokemon?limit=100&offset=151";
      const pokeDisplay = getPokemons(apiJohto);
      pokeDisplay.then(() => {
        displayPokemons(pokemons);
        displayButtons(pokemons);
      });
    } else if (e.target.value == "hoenn") {
      const apiHoenn = "https://pokeapi.co/api/v2/pokemon?limit=135&offset=251";
      const pokeDisplay = getPokemons(apiHoenn);
      pokeDisplay.then(() => {
        displayPokemons(pokemons);
        displayButtons(pokemons);
      });
    } else if (e.target.value == "sinnoh") {
      const apiHoenn = "https://pokeapi.co/api/v2/pokemon?limit=107&offset=386";
      const pokeDisplay = getPokemons(apiHoenn);
      pokeDisplay.then(() => {
        displayPokemons(pokemons);
        displayButtons(pokemons);
      });
    } else if (e.target.value == "teselia") {
      const apiHoenn = "https://pokeapi.co/api/v2/pokemon?limit=156&offset=493";
      const pokeDisplay = getPokemons(apiHoenn);
      pokeDisplay.then(() => {
        displayPokemons(pokemons);
        displayButtons(pokemons);
      });
    } else if (e.target.value == "kalos") {
      const apiHoenn = "https://pokeapi.co/api/v2/pokemon?limit=72&offset=649";
      const pokeDisplay = getPokemons(apiHoenn);
      pokeDisplay.then(() => {
        displayPokemons(pokemons);
        displayButtons(pokemons);
      });
    }
  });
});
