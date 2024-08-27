const groups = require('./groups.json'); //Za ucitavanje JSON datoteke groups.json

const simulacijaIgre = (team1, team2) => {
    const verovatnoca1 = team1.FIBARanking / (team1.FIBARanking + team2.FIBARanking); //Verovatnoca pobede prvog tima
    /* broj poena prvog tima, generise se kao random broj izmedju 70 i 120, osnova je 70, a dodatak random broj izmedju 0 i 50 */
    /* deo (1 - verovatnoca) * 10 se zasniva na verovatnoci pobede protivnika. Sto je veca verovatnoca pobede protivnika, tim ce postici manje poena */
    const rezultat1 = Math.floor(Math.random() * 50) + 70 + Math.floor((1 - verovatnoca1) * 10);
    const rezultat2 = Math.floor(Math.random() * 50) + 70 + Math.floor(verovatnoca1 * 10);

    return {
        tim1: {
            ime: team1.Team,
            rezultat: rezultat1,
            pobeda: rezultat1 > rezultat2
        },
        tim2: {
            ime: team2.Team,
            rezultat: rezultat2,
            pobeda: rezultat2 > rezultat1
        }
    };
};

const azurirajTabelu = (polozaji, tim, pobeda, rezultat, protivnikPoeni) => {
    //Proverava da li tim vec postoji u tabeli, ako ne inicijalizujem ga
    if (!polozaji[tim.ime]) {
        //Kreira se novi objekat sa navedenim svojstvima
        polozaji[tim.ime] = {
            ime: tim.ime,
            pobede: 0,
            porazi: 0,
            poeni: 0,
            postignuto: 0,
            primljeno: 0
        };
    }
    polozaji[tim.ime].postignuto += rezultat;
    polozaji[tim.ime].primljeno += protivnikPoeni;
    //ternarni operator za if-else (zavisi od parametra provera: 2 ako je true, 1 ako je false)
    polozaji[tim.ime].poeni += pobeda ? 2 : 1;
    //Azurira ukupan broj pobeda (ili poraza) za tim
    if (pobeda)
        polozaji[tim.ime].pobede += 1;
    else
        polozaji[tim.ime].porazi += 1;
};

const simulacijaGrupneFaze = () => {
    //Objekat u kome se beleze rezultati i statistika timova
    const polozaji = {};
    /*Prolazi kroz sve grupe*/
    /* Object.keys() vraca niz svih kljuceva datog objekta (groups objekat u ovom slucaju) */
    /*Konkretno, vraca A, B i C */
    /*forEach kasnije prolazi kroz svaki element niza koji je vratio Object.keys()*/
    Object.keys(groups).forEach(group => {
        console.log(`Grupna faza - I kolo:\n    Grupa ${group}:`);
        polozaji[group] = {};
        const timovi = groups[group];

        for (let i = 0; i < timovi.length; i++) {
            for (let j = i + 1; j < timovi.length; j++) {
                const rezultatIgra = simulacijaIgre(timovi[i], timovi[j]);
                console.log(`        ${rezultatIgra.tim1.ime} - ${rezultatIgra.tim2.ime} (${rezultatIgra.tim1.rezultat}: ${rezultatIgra.tim2.rezultat})`);
                azurirajTabelu(polozaji[group], rezultatIgra.tim1, rezultatIgra.tim1.pobeda, rezultatIgra.tim1.rezultat, rezultatIgra.tim2.rezultat);
                azurirajTabelu(polozaji[group], rezultatIgra.tim2, rezultatIgra.tim2.pobeda, rezultatIgra.tim2.rezultat, rezultatIgra.tim1.rezultat);
            }
        }
    });
};

module.exports = {
    simulacijaGrupneFaze
}