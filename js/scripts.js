let pokemonRepository = (function() {
  let pokemonList = [
    {name: 'Arbok', height: 3.5, types: ['poison']},
    {name: 'Poliwrath', height: 1.3, types: ['water', 'fighting']},
    {name: 'Armaldo', height: 1.5, types: ['bug','rock']},
    {name: 'Charmander', height: 0.6, types: ['fire']}
  ];

  //retrieve all Pokemon
  function getAll() {
    return pokemonList;
  }

  //add new Pokemon
  function add(item) {
    //check if added item is object with the same keys as the first object in pokemonList
    if ((typeof(item) === 'object') &&
    (Object.keys(item).length === Object.keys(pokemonList[0]).length) &&
    (Object.keys(item).toString() === Object.keys(pokemonList[0]).toString())) {
      pokemonList.push(item);
    } else {
      console.error('Wrong input');
    }
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

  //show details for pokemon
  function showDetails(pokemon) {
    console.log(pokemon);
  }

  //return public functions
  return {
    getAll,
    add,
    findName,
    addListItem
  }
})();

//Print all objects in pokemonList (name, height and compliment for tall boys)
pokemonRepository.getAll().forEach(function(pokemon) {
  pokemonRepository.addListItem(pokemon);
});
