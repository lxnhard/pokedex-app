let pokemonRepository = (function() {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  //retrieve all Pokemon
  function getAll() {
    return pokemonList;
  }

  //add new Pokemon
  function add(item) {
    pokemonList.push(item);
  }

  //filter for Pokemon with specific name
  function findName(name) {
    result = pokemonList.filter(pokemon => pokemon.name === name);
    if (result.length > 0) {
      return result[0];
    } else {
      console.log('The Pokémon you called is currently not available.');
    }
  }

  //add pokemon to html-list
  function addListItem(pokemon) {
    let pokemonList = document.querySelector('.pokemon-list');
    let listItem = document.createElement('li');
    let button = document.createElement('button');
    button.classList.add('pokemonButton');
    button.innerText = pokemon.name;
    //append elements
    listItem.appendChild(button);
    pokemonList.appendChild(listItem);
    //on click: show details
    button.addEventListener('click', function (event) {
      showDetails(pokemon);
    });
  }
  //fetch list data from api
  function loadList() {
    showLoader();
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
        hideLoader();
      });
    }).catch(function (e) {
      console.error(e);
      hideLoader();
    })
  }
  //fetch detail data from api
  function loadDetails(item) {
    showLoader();
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      // Now we add the details to the item
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types;
      hideLoader();
    }).catch(function (e) {
      console.error(e);
      hideLoader();
    });
  }
  //show details for pokemon
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      console.log(pokemon);
    });
  }
//show/hide pokeball loader
function showLoader() {
  let loader = document.querySelector('.pokeball');
  loader.classList.remove('hidden');
}
function hideLoader() {
  let loader = document.querySelector('.pokeball');
  loader.classList.add('hidden');
}

  //return public functions
  return {
    getAll,
    add,
    findName,
    addListItem,
    loadList,
    loadDetails
  }
})();

//Print all objects in pokemonList
pokemonRepository.loadList().then(function() {
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});
