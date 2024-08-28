const { simulacijaGrupneFaze } = require("./grupnaFaza.js");
const { formiranjeZreba } = require('./eliminacionaFaza.js');

console.log("Simulacija Košarkaškog turnira u Parizu 2024... ");
const rangiraniTimovi = simulacijaGrupneFaze();
formiranjeZreba(rangiraniTimovi);
console.log("Simulacija završena!");