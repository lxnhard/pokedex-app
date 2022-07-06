let pokemonRepository = (function() {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  //retrieve all Pokemon
  function getAll() {
    return pokemonList.slice(-150);
  }


  //add new Pokemon
  function add(item) {
    pokemonList.push(item);
  }

  //filter for Pokemon with specific name
  function findName(name) {
    result = pokemonList.filter(pokemon => pokemon.name.startsWith(name));
    if (result.length > 0) {
      return result[0];
    } else {
      $('#search-input').tooltip('show');
      $(document).on("click",function() {
          $('#search-input').tooltip('hide');
      });
    }
  }

  //Search function
  $('#search-form').submit( e => {
    e.preventDefault();
    $('#search-input').tooltip('hide');
    searchinput = $('#search-input').val().toLowerCase();
    let result = findName(searchinput);
    if (result) {
      showDetails(result);
      $('#detailsModal').modal('show');
    }
  })


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
    let offset = Math.floor(pokemonList.length/150)*150;
    apiUrl = 'https://pokeapi.co/api/v2/pokemon/?offset='+offset+'&limit=150';
    console.log(apiUrl);
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


  // load next 150 pokemon at end of page//
  $(window).scroll(function() {
     if($(window).scrollTop() + $(window).height() == $(document).height()) {
       pokemonRepository.loadList().then(function() {
         // Now the data is loaded!
         pokemonRepository.getAll().forEach(function(pokemon){
           pokemonRepository.addListItem(pokemon);
         });
       });
     }
  });


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
  modalImgFront.attr("src", "img/fallback.svg");
  modalImgBack.attr("src", "img/fallback.svg");

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
  pokemon.imageUrlFront ? modalImgFront.attr("src", pokemon.imageUrlFront) : modalImgFront.attr("src", "img/fallback.svg");
  // image of pokemon back
  pokemon.imageUrlBack ? modalImgBack.attr("src", pokemon.imageUrlBack) : modalImgBack.attr("src", "img/fallback.svg");;

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

$(document).ready(function () {
	$(window).scroll(function () {
			if ($(this).scrollTop() > 50) {
				$("#back-to-top").fadeIn();
			} else {
				$("#back-to-top").fadeOut();
			}
		});
		// scroll body to 0px on click
		$("#back-to-top").click(function () {
			$("body,html").animate({
				scrollTop: 0
			}, 400);
			return false;
		});
});
