const grupe = require('./groups.json'); //Za ucitavanje JSON datoteke groups.json

const simulacijaIgre = (team1, team2) => {
    const verovatnoca = team1.FIBARanking / (team1.FIBARanking + team2.FIBARanking); //Verovatnoca pobede prvog tima
    /* broj poena prvog tima, generise se kao random broj izmedju 70 i 120, osnova je 70, a dodatak random broj izmedju 0 i 50 */
    /* deo (1 - verovatnoca) * 10 se zasniva na verovatnoci pobede protivnika. Sto je veca verovatnoca pobede protivnika, tim ce postici manje poena */
    const rezultat1 = Math.floor(Math.random() * 50) + 70 + Math.floor((1 - verovatnoca) * 10); 
    const rezultat2 = Math.floor(Math.random() * 50) + 70 + Math.floor(verovatnoca * 10);

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

const simulacijaGrupneFaze = () => {
    Object.keys(grupe).forEach(grupa => {
        console.log(`Grupa ${grupa}: `);
        const timovi = grupe[grupa];

        for (let i = 0; i < timovi.length; i++){
            for (let j = i + 1; j < timovi.length; i++) {
                const rezultat = simulacijaIgre(timovi[i], timovi[j]);
                console.log(`        ${rezultat.tim1.ime} -${rezultat.tim2.ime}
                    (${rezultat.tim1.rezultat}: ${rezultat.tim2.rezultat})`);
            }
        }
    });
}

module.exports = {
    simulacijaGrupneFaze
}