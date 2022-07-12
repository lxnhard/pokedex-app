let pokemonRepository = (function() {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  //retrieve most recently loaded 150 pokemon
  function getAll() {
    return pokemonList.slice(-150);
  }

  //add new Pokemon
  function add(item) {
    pokemonList.push(item);
  }

  //filter for Pokemon with specific name
  function findName(name) {
    let result = pokemonList.filter(pokemon => pokemon.name.startsWith(name));
    if (result.length > 0) {
      return result[0];
    } else {
      $('#search-input').tooltip('show');
      $(document).on('click', function() {
        $('#search-input').tooltip('hide');
      });
    }
  }

  //Search function
  $('#search-form').submit(e => {
    e.preventDefault();
    $('#search-input').tooltip('hide');
    let searchinput = $('#search-input')
      .val()
      .toLowerCase();
    let result = findName(searchinput);
    if (result) {
      showDetails(result);
      $('#detailsModal').modal('show');
    }
  });

  //add pokemon to html-list
  function addListItem(pokemon) {
    let pokemonList = document.querySelector('.pokemon-list');
    let listItem = document.createElement('li');
    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#detailsModal');
    button.classList.add(
      'pokemonButton',
      'list-group-item',
      'list-group-item-action',
      'w-100'
    );
    button.innerText = pokemon.name;
    //append elements
    listItem.appendChild(button);
    pokemonList.appendChild(listItem);
    //on click: show details
    button.addEventListener('click', function() {
      showDetails(pokemon);
    });
  }

  //fetch list data from api
  function loadList() {
    showLoader();
    let offset = Math.floor(pokemonList.length / 150) * 150;
    apiUrl =
      'https://pokeapi.co/api/v2/pokemon/?offset=' + offset + '&limit=150';
    return fetch(apiUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        json.results.forEach(function(item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
        });
        hideLoader();
      })
      .catch(function(e) {
        console.error(e);
        hideLoader();
      });
  }
  //fetch detail data from api
  function loadDetails(item) {
    showLoader();
    let url = item.detailsUrl;
    return fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(details) {
        // Now we add the details to the item
        item.imageUrlFront = details.sprites.front_default;
        item.imageUrlBack = details.sprites.back_default;
        item.height = details.height;
        item.weight = details.weight;
        item.types = details.types;
        item.abilities = details.abilities;
        hideLoader();
      })
      .catch(function(e) {
        console.error(e);
        hideLoader();
      });
  }

  //show details for pokemon
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function() {
      showModal(pokemon);
    });
  }

  // load new Pokemon in list and display
  // promise gets rejected if now further pokemon available in API
  function loadDisplay() {
    let promise = new Promise(function(resolve, reject) {
      if (Math.floor(pokemonList.length / 150) * 150 < 1154) {
        loadList()
          .then(function() {
            getAll().forEach(function(pokemon) {
              addListItem(pokemon);
            });
          })
          .then(function() {
            resolve();
          });
      } else {
        reject();
      }
    });
    return promise;
  }

  // load next 150 pokemon at end of page//
  $(window).scroll(function() {
    if ($(window).scrollTop() + $(window).height() == $(document).height()) {
      loadDisplay().catch();
    }
  });

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
    let modalTitle = $('.modal-title');

    let modalImgFront = $('#modal-img-front');
    let modalImgBack = $('#modal-img-back');

    let modalHeight = $('.detail-height');
    let modalWeight = $('.detail-weight');
    let modalTypes = $('.detail-types');
    let modalTypesHeadline = $('.detail-headline-types');
    let modalAbilities = $('.detail-abilities');

    modalTitle.empty();
    modalHeight.empty();
    modalWeight.empty();
    modalTypes.empty();
    modalTypesHeadline.empty();
    modalAbilities.empty();

    //pokemon name as title
    let titleElement = document.createElement('h1');
    titleElement.innerText = pokemon.name;
    titleElement.classList.add('capitalize');

    //height element
    let heightElement = document.createElement('span');
    heightElement.innerHTML = pokemon.height + ' m';
    //weight element
    let weightElement = document.createElement('span');
    weightElement.innerHTML = pokemon.weight + ' kg';

    //types element
    let typesElement = document.createElement('span');
    let typesHeadline = document.createElement('span');
    let types = [];
    pokemon.types.forEach(function(typeObj) {
      types.push(' ' + typeObj.type.name);
    });
    //one or multiple types?
    if (types.length < 2) {
      typesHeadline.innerHTML = 'Type:';
    } else {
      typesHeadline.innerHTML = 'Types:';
    }
    typesElement.innerHTML = types.toString();
    typesElement.classList.add('capitalize');

    //abilities element
    let abilitiesElement = document.createElement('span');
    let abilities = [];
    pokemon.abilities.forEach(function(abilitiesObj) {
      abilities.push(' ' + abilitiesObj.ability.name);
    });
    abilitiesElement.innerHTML = abilities.toString();
    abilitiesElement.classList.add('capitalize');

    modalTitle.append(titleElement);
    modalHeight.append(heightElement);
    modalWeight.append(weightElement);
    modalTypes.append(typesElement);
    modalTypesHeadline.append(typesHeadline);
    modalAbilities.append(abilitiesElement);
    // image of pokemon front
    pokemon.imageUrlFront
      ? modalImgFront.attr('src', pokemon.imageUrlFront)
      : modalImgFront.attr('src', 'img/fallback.svg');
    // image of pokemon back
    pokemon.imageUrlBack
      ? modalImgBack.attr('src', pokemon.imageUrlBack)
      : modalImgBack.attr('src', 'img/fallback.svg');

    //Button Next
    let buttonNext = $('#button-next');
    buttonNext.off().on('click', () => {
      //if next pokemon is within loaded list, show its modal
      if (pokemonList.indexOf(pokemon) < pokemonList.length - 1) {
        // empty image
        modalImgFront.attr('src', '');
        modalImgBack.attr('src', '');
        //load new details
        showDetails(pokemonList[pokemonList.indexOf(pokemon) + 1]);
      } else {
        //if next pokemon is not within loaded list, load next 150 and show its modal
        //load new list
        loadDisplay()
          .then(function() {
            // empty image
            modalImgFront.attr('src', '');
            modalImgBack.attr('src', '');
            showDetails(pokemonList[pokemonList.indexOf(pokemon) + 1]);
            hideLoader();
          })
          .catch(function() {
            hideLoader();
          });
      }
    });
    //Button Previous
    let buttonPrev = $('#button-prev');
    buttonPrev.off().on('click', () => {
      if (pokemonList.indexOf(pokemon) > 0) {
        modalImgFront.attr('src', '');
        modalImgBack.attr('src', '');
        showDetails(pokemonList[pokemonList.indexOf(pokemon) - 1]);
      }
    });

    // empty image on modal close
    $('#detailsModal').on('hidden.bs.modal', function() {
      modalImgFront.attr('src', '');
      modalImgBack.attr('src', '');
    });
  }

  //return public functions
  return {
    getAll,
    add,
    findName,
    addListItem,
    loadList,
    loadDetails,
    loadDisplay
  };
})();

//load and display first 150 Pokemon
pokemonRepository.loadDisplay();

//back to top
$(document).ready(function() {
  $(window).scroll(function() {
    if ($(this).scrollTop() > 50) {
      $('#back-to-top').fadeIn();
    } else {
      $('#back-to-top').fadeOut();
    }
  });
  // scroll body to 0px on click
  $('#back-to-top').click(function() {
    $('body,html').animate(
      {
        scrollTop: 0
      },
      400
    );
    return false;
  });
});
