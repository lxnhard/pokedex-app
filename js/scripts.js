let pokemonList = [
  {name: 'Arbok', height: 3.5, types: ['poison']},
  {name: 'Poliwrath', height: 1.3, types: ['water', 'fighting']},
  {name: 'Armaldo', height: 1.5, types: ['bug','rock']}
];

for (let i = 0; i < pokemonList.length; i++) {
  document.write(pokemonList[i].name+" (height: "+pokemonList[i].height+")");
  (pokemonList[i].height > 2) ? (document.write(" – "+"That's a tall boy! <br>")) : (document.write("<br>"));
}
