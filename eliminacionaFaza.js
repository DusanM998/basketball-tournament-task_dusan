const { simulacijaGrupneFaze } = require("./grupnaFaza.js");

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const formiranjeZreba = (rangiraniTimovi) => {
    //Rangirane timove svrstava u sesire
    //Prva dva tima iz niza idu u sesir D, itd
    const sesirD = rangiraniTimovi.slice(0, 2);
    const sesirE = rangiraniTimovi.slice(2, 4);
    const sesirF = rangiraniTimovi.slice(4, 6);
    const sesirG = rangiraniTimovi.slice(6, 8);

    console.log("\nŠeširi:");
    console.log("    Šešir D");
    sesirD.forEach(tim => console.log(`        ${tim.ime}`));
    console.log("    Šešir E");
    sesirE.forEach(tim => console.log(`        ${tim.ime}`));
    console.log("    Šešir F");
    sesirF.forEach(tim => console.log(`        ${tim.ime}`));
    console.log("    Šešir G");
    sesirG.forEach(tim => console.log(`        ${tim.ime}`));

    
}

module.exports = {
    formiranjeZreba
}