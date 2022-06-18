let pokemonRepository = (function() {
  let pokemonList = [
    {name: 'Arbok', height: 3.5, types: ['poison']},
    {name: 'Poliwrath', height: 1.3, types: ['water', 'fighting']},
    {name: 'Armaldo', height: 1.5, types: ['bug','rock']},
    {name: 'Charmander', height: 0.6, types: ['fire']}
  ];
  //function to retrieve all Pokemon
  function getAll() {
    return pokemonList;
  }
  //function to add new Pokemon
  function add(item) {
    pokemonList.push(item);
  }
  //function to filter for Pokemon with specific name
  function findName(name) {
    result = pokemonList.filter(pokemon => pokemon.name === name);
    if (result.length > 0) {
      return result[0];
    } else {
      console.log('The Pokémon you called is currently not available.');
    }
  }
  //return public functions
  return {
    getAll,
    add,
    findName
  }
})();

//Print all objects in pokemonList (name, height and compliment for tall boys)
pokemonRepository.getAll().forEach(function(pokemon) {
  document.write('<p>'+pokemon.name+' (height: '+pokemon.height+')');
  (pokemon.height > 2) ? (document.write(" – That's a tall boy!</p>")) : (document.write('</p>'));
});
