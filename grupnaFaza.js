const groups = require('./groups.json'); //Za ucitavanje JSON datoteke groups.json
const exibitions = require('./exibitions.json');

const racunajFormu = (teamISOCode) => {
    const mecevi = exibitions[teamISOCode];

    if (!mecevi)
        return 0; //Ako nema prethodno odigranih meceva, forma je 0

    let forma = 0;
    mecevi.forEach(mec => {
        const [domacinPoeni, protivnikPoeni] = mec.Result.split('-').map(Number);
        forma += domacinPoeni - protivnikPoeni; //Na formu utice razlika u poenima
    });

    return forma / mecevi.length; //Procesna forma na osnovu odigranih prethodnih meceva
}

const simulacijaIgre = (team1, team2) => {
    const verovatnoca1 = team1.FIBARanking / (team1.FIBARanking + team2.FIBARanking); //Verovatnoca pobede prvog tima
    /* broj poena prvog tima, generise se kao random broj izmedju 70 i 120, osnova je 70, a dodatak random broj izmedju 0 i 50 */
    /* deo (1 - verovatnoca) * 10 se zasniva na verovatnoci pobede protivnika. Sto je veca verovatnoca pobede protivnika, tim ce postici manje poena */

    const forma1 = racunajFormu(team1.ISOCode);
    const forma2 = racunajFormu(team2.ISOCode);

    const rezultat1 = Math.floor(Math.random() * 50) + 70 + Math.floor((1 - verovatnoca1 + forma1 * 0.05) * 10);
    const rezultat2 = Math.floor(Math.random() * 50) + 70 + Math.floor((verovatnoca1 + forma2 * 0.05) * 10);

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

const razlikaPoena = (timovi) => {
    const razlike = {};

    for (let i = 0; i < timovi.length; i++) {
        for (let j = i + 1; j < timovi.length; j++) {
            const tim1 = timovi[i];
            const tim2 = timovi[j];
            if (!razlike[tim1.ime])
                razlike[tim1.ime] = 0;
            if (!razlike[tim2.ime])
                razlike[tim2.ime] = 0;

            if (tim1.rezultat > tim2.rezultat) {
                razlike[tim1.ime] += tim1.rezultat - tim2.rezultat;
                razlike[tim2.ime] -= tim1.rezultat - tim2.rezultat;
            }
            else {
                razlike[tim1.ime] -= tim2.rezultat - tim1.rezultat;
                razlike[tim2.ime] += tim2.rezultat - tim1.rezultat;
            }
        }
    }

    return razlike;
};

//Sortira timove na osnovu broja bodova, kos razlike i broja postignutih koseva
const sortirajTimove = (timovi) => {
    return timovi.sort((a, b) => {
        if (a.poeni !== b.poeni)
            return b.poeni - a.poeni;
        const kosRazlikaA = a.postignuto - a.primljeno;
        const kosRazlikaB = b.postignuto - b.primljeno;
        if (kosRazlikaA !== kosRazlikaB)
            return kosRazlikaB - kosRazlikaA;
        
        return b.postignuto - a.postignuto;
    });
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
                azurirajTabelu(polozaji[group],
                    rezultatIgra.tim1, rezultatIgra.tim1.pobeda,
                    rezultatIgra.tim1.rezultat,
                    rezultatIgra.tim2.rezultat
                );
                azurirajTabelu(polozaji[group],
                    rezultatIgra.tim2, rezultatIgra.tim2.pobeda,
                    rezultatIgra.tim2.rezultat, 
                    rezultatIgra.tim1.rezultat);
            }
        }
    });

    //Stampa konacan plasman tabela u grupama
    console.log("\nKonacan plasman u grupama: ");
    const sviTimovi = [];
    Object.keys(groups).forEach(group => {
        const timovi = Object.values(polozaji[group]);
        const sortiraniTimovi = sortirajTimove(timovi);

        console.log(`   Grupa ${group} (Tim - pobede / porazi / bodovi / postignuto koševa / primljeno koševa / koš razlika): `);
        sortiraniTimovi.forEach((tim, index) => {
            const kosRazlika = tim.postignuto - tim.primljeno;
            console.log(`       ${index + 1}. ${tim.ime}: ${tim.pobede} / ${tim.porazi} / ${tim.poeni} / ${tim.postignuto} / ${tim.primljeno} / ${kosRazlika > 0 ? '+' : ''}${kosRazlika}`);
            if (index < 3)
                sviTimovi.push({ ...tim, grupa: group, pozicija: index + 1 });
        });
    });
    //Rangiranje timova iz svih grupa
    console.log("\nRangiranje timova za eliminacionu fazu...");
    const rangiraniTimovi = [];
    const rangiraj = (pozicija) => {
        const timoviZaRangiranje = sviTimovi.filter(tim => tim.pozicija == pozicija);
        const sortirani = sortirajTimove(timoviZaRangiranje);
        sortirani.forEach((tim, index) => {
            rangiraniTimovi.push({ ...tim, rang: rangiraniTimovi.length + 1 });
        });
    };

    rangiraj(1);
    rangiraj(2);
    rangiraj(3);

    //Prikaz rangiranih timova
    console.log("\nTimovi koji su prosli u eliminacionu fazu: ");
    rangiraniTimovi.slice(0, 8).forEach((tim) => {
        console.log(`   ${tim.rang}. ${tim.ime} iz Grupe ${tim.grupa}`);
    });
    if (rangiraniTimovi[8]) {
        console.log(`   9. ${rangiraniTimovi[8].ime} iz grupe ${rangiraniTimovi[8].grupa} - ne prolazi dalje`)
    }
};

module.exports = {
    simulacijaGrupneFaze
}