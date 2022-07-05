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
    button.setAttribute('type', 'button');
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#detailsModal');
    button.classList.add('pokemonButton', 'list-group-item', 'list-group-item-action', 'w-100');
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
      item.imageUrlFront = details.sprites.front_default;
      item.imageUrlBack = details.sprites.back_default;
      item.height = details.height;
      item.weight = details.weight;
      item.types = details.types;
      item.abilities = details.abilities;
      hideLoader();
    }).catch(function (e) {
      console.error(e);
      hideLoader();
    });
  }

  //show details for pokemon
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      //show Modal
      showModal(pokemon);
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


// Modal

function showModal(pokemon) {
  let modalBody = $(".modal-body");
  let modalTitle = $(".modal-title");
  let modalHeader = $(".modal-header");

  let modalImgFront = $("#modal-img-front");
  let modalImgBack = $("#modal-img-back");

  let modalHeight = $(".detail-height");
  let modalWeight = $(".detail-weight");
  let modalTypes = $(".detail-types");
  let modalTypesHeadline = $(".detail-headline-types");
  let modalAbilities = $(".detail-abilities");

  modalTitle.empty();
  modalHeight.empty();
  modalWeight.empty();
  modalTypes.empty();
  modalTypesHeadline.empty();
  modalAbilities.empty();

  //pokemon name as title
  let titleElement = document.createElement('h1');
  titleElement.innerText = pokemon.name;
  titleElement.classList.add("capitalize");

  //height element
  let heightElement = document.createElement('span');
  heightElement.innerHTML = pokemon.height+" m";
  //weight element
  let weightElement = document.createElement('span');
  weightElement.innerHTML = pokemon.weight+" kg";

  //types element
  let typesElement = document.createElement('span');
  let typesHeadline = document.createElement('span');
  let types = [];
  pokemon.types.forEach(function(typeObj){
    types.push(" "+typeObj.type.name);
  });
  //one or multiple types?
  if (types.length<2) {
    typesHeadline.innerHTML = "Type:";
  } else {
    typesHeadline.innerHTML = "Types:";
  }
  typesElement.innerHTML = types.toString();
  typesElement.classList.add("capitalize");

  //abilities element
  let abilitiesElement = document.createElement('span');
  let abilities = [];
  pokemon.abilities.forEach(function(abilitiesObj){
    abilities.push(" "+abilitiesObj.ability.name);
  });
  abilitiesElement.innerHTML = abilities.toString();
  abilitiesElement.classList.add("capitalize");

  modalTitle.append(titleElement);
  modalHeight.append(heightElement);
  modalWeight.append(weightElement);
  modalTypes.append(typesElement);
  modalTypesHeadline.append(typesHeadline);
  modalAbilities.append(abilitiesElement);
  // image of pokemon front
  modalImgFront.attr("src", pokemon.imageUrlFront);
  // image of pokemon back
  modalImgBack.attr("src", pokemon.imageUrlBack);

  //Button Next
  buttonNext = $('#button-next');
  buttonNext.off().on('click', e => {
      if (pokemonList.indexOf(pokemon) < (pokemonList.length-1)) {
        showDetails(pokemonList[pokemonList.indexOf(pokemon)+1]);
        return;
      }
  })
  //Button Previous
  buttonPrev = $('#button-prev');
  buttonPrev.off().on('click', e => {
      if (pokemonList.indexOf(pokemon) > 0) {
        showDetails(pokemonList[pokemonList.indexOf(pokemon)-1]);
      }
  })
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
