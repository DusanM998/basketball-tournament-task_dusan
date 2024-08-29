const { simulacijaGrupneFaze, simulacijaIgre } = require("./grupnaFaza.js");

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

    const paroviCetvrtfinala = [];

    const ukrstiTimove = (timoviIzSesira1, timoviIzSesira2) => {
        shuffleArray(timoviIzSesira2); //Random shuffle za drugi sesir

        timoviIzSesira1.forEach(tim1 => {
            //Nalazi protivnika koji nije iz iste grupe
            const protivnik = timoviIzSesira2.find(tim2 => tim1.grupa !== tim2.grupa);
            paroviCetvrtfinala.push([tim1, protivnik]); //Ukrsta ih u cetvrtfinalu
            timoviIzSesira2.splice(timoviIzSesira2.indexOf(protivnik), 1); //Iz 2. sesira uklanja protivnika koji vec ima para
        });
    };

    //Ukrsta timove
    ukrstiTimove(sesirD, sesirG);
    ukrstiTimove(sesirE, sesirF);

    console.log("\nEliminaciona faza: ");

    console.log("\nParovi četvrtfinala: ");

    const paroviPolufinala = [];

    paroviCetvrtfinala.forEach((par, index) => {
        const [tim1, tim2] = par;
        console.log(`   ${index + 1}. Par: ${tim1.ime} - ${tim2.ime}`);
        if (index % 2 === 0) {
            //Prva dva para idu u jedan polufinalni par, sledeca dva u drugi
            paroviPolufinala.push([par]);
        }
        else {
            paroviPolufinala[paroviPolufinala.length - 1].push(par);
        }
    });

    console.log("\nParovi polufinala: ");
    paroviPolufinala.forEach((parovi, index) => {
        const [prviPar, drugiPar] = parovi;
        console.log(`   Pobednik meča: ${prviPar[0].ime} - ${prviPar[1].ime} vs Pobednik meča: ${drugiPar[0].ime} - ${drugiPar[1].ime}`);
    });
}

module.exports = {
    formiranjeZreba
}