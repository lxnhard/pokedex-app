let pokemonList = [
  {name: 'Arbok', height: 3.5, types: ['poison']},
  {name: 'Poliwrath', height: 1.3, types: ['water', 'fighting']},
  {name: 'Armaldo', height: 1.5, types: ['bug','rock']},
  {name: 'Charmander', height: 0.6, types: ['fire']}
];

//Print all objects in pokemonList (name, height and compliment for tall boys)
pokemonList.forEach(function(pokemon) {
  document.write("<p>"+pokemon.name+" (height: "+pokemon.height+")");
  (pokemon.height > 2) ? (document.write(" – "+"That's a tall boy!</p>")) : (document.write("</p>"));
});
