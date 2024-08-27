const grupe = require('./groups.json'); //Za ucitavanje JSON datoteke groups.json

const simulacijaIgre = (tim1, tim2) => {
    const verovatnoca = tim1.FIBARanking / (tim1.FIBARanking + tim2.FIBARanking); //Verovatnoca pobede prvog tima
    /* broj poena prvog tima, generise se kao random broj izmedju 70 i 120, osnova je 70, a dodatak random broj izmedju 0 i 50 */
    /* deo (1 - verovatnoca) * 10 se zasniva na verovatnoci pobede protivnika. Sto je veca verovatnoca pobede protivnika, tim ce postici manje poena */
    const rezultat1 = Math.floor(Math.random() * 50) + 70 + Math.floor((1 - verovatnoca) * 10); 
    const rezultat2 = Math.floor(Math.random() * 50) + 70 + Math.floor(verovatnoca * 10);

    return {
        tim1: {
            ime: tim1.Team,
            rezultat: rezultat1,
            pobeda: rezultat1 > rezultat2
        },
        tim2: {
            ime: tim2.Team,
            rezultat: rezultat2,
            pobeda: rezultat2 > rezultat1
        }
    };
};

module.exports = {
    simulacijaIgre
}