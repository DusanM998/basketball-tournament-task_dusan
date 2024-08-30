const groups = require('./groups.json'); //Za ucitavanje JSON datoteke groups.json
const exibitions = require('./exibitions.json');

const racunajFormu = (teamISOCode) => {
    const mecevi = exibitions[teamISOCode];

    if (!mecevi)
        return 0; //Ako nema prethodno odigranih meceva, forma je 0

    let forma = 0;
    mecevi.forEach(mec => {
        //Deli string Result na poene jednog i drugog tima, a map prolazi kroz svaki
        //od tih stringova rezultata i sa Number ih konvertuje u brojeve
        //Ovde se rezultat split f-je dodeljuje domacinPoeni, protivnikPoeni varijablama
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

    //console.log(`Rezultat: ${rezultat1} - ${rezultat2}`);
    //console.log(`Forma: ${forma1} - ${forma2}`);

    //Vraca objekat koji sadrzi info. o oba tima nakon odigrane utakmice
    return {
        tim1: {
            ime: team1.Team,
            rezultat: rezultat1,
            pobeda: rezultat1 > rezultat2
        },
        tim2: {
            ime: team2.Team,
            rezultat: rezultat2,
            pobeda: rezultat2 > rezultat1 //Ako je rezultat2 > pobeda je true
        }
    };
};

const azurirajTabelu = (tablePosition, tim, pobeda, rezultat, protivnikPoeni) => {
    //Proverava da li u objektu tablePosition postoji unos za tim 'tim.ime'
    if (!tablePosition[tim.ime]) {
        //Kreira se novi objekat sa navedenim svojstvima
        //Sadrzi informacije o svim timovima, a tim.ime omogucava pristup pojedinom timu
        tablePosition[tim.ime] = {
            ime: tim.ime,
            pobede: 0,
            porazi: 0,
            poeni: 0,
            postignuto: 0,
            primljeno: 0
        };
    }
    //Na ukupan broj poena koje tim ima do sada, dodaje se rezultat poslednje odigrane utakmice
    tablePosition[tim.ime].postignuto += rezultat;
    //...kao i primljene poene
    tablePosition[tim.ime].primljeno += protivnikPoeni;
    //ternarni operator za if-else (zavisi od parametra pobeda: 2 ako je true, 1 ako je false)
    tablePosition[tim.ime].poeni += pobeda ? 2 : 1;
    //Azurira ukupan broj pobeda (ili poraza) za tim
    if (pobeda)
        tablePosition[tim.ime].pobede += 1;
    else
        tablePosition[tim.ime].porazi += 1;
};

//Sortira timove na osnovu broja bodova, kos razlike i broja postignutih koseva
const sortirajTimove = (timovi) => {
    /*Ako sort vrati negativan br. a je ispred b*/
    /*Ako vrati pozitivan, b je ispred a, a ako vrati 0 pozicija im je ista*/
    return timovi.sort((a, b) => {
        //Prvi kriterijum za poredjenje - broj bodova koje je tim ostvario
        if (a.poeni !== b.poeni)
            //Ako b ima vise poena od a (b je pozitivno) pa ce ici ispred a u sortiranju
            return b.poeni - a.poeni;
        
        //Ako su timovi isti po broju bodova porede se po kos razlici
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
    /*Konkretno, vraca A, B i C grupe*/
    /*forEach kasnije prolazi kroz svaki element niza koji je vratio Object.keys()*/
    Object.keys(groups).forEach(group => {
        console.log(`Grupna faza - I kolo:\n    Grupa ${group}:`);
        polozaji[group] = {};
        //Predstavlja niz svih timova u trenutnoj grupi
        const timovi = groups[group];
        //console.log(timovi);

        //Prva petlja prolazi kroz svaki tim u grupi
        for (let i = 0; i < timovi.length; i++) {
            //Prolazi kroz sve ostale timove u grupi koji nisu igrali medjusobno sa timom sa indeksom i
            for (let j = i + 1; j < timovi.length; j++) {
                //Vraca objekat koji sadrzi info. o rezultatu utakmice odigranih timova
                const rezultatIgra = simulacijaIgre(timovi[i], timovi[j]);
                //console.log(rezultatIgra);
                //console.log(polozaji[group]);
                console.log(`        ${rezultatIgra.tim1.ime} - ${rezultatIgra.tim2.ime} (${rezultatIgra.tim1.rezultat}: ${rezultatIgra.tim2.rezultat})`);
                azurirajTabelu(polozaji[group],
                    rezultatIgra.tim1,
                    rezultatIgra.tim1.pobeda,
                    rezultatIgra.tim1.rezultat,
                    rezultatIgra.tim2.rezultat
                );
                azurirajTabelu(polozaji[group],
                    rezultatIgra.tim2,
                    rezultatIgra.tim2.pobeda,
                    rezultatIgra.tim2.rezultat, 
                    rezultatIgra.tim1.rezultat);
                
            }
        }
    });

    //Stampa konacan plasman tabela u grupama
    console.log("\nKonacan plasman u grupama: ");
    //Niz u koji se smestaju timovi koji su medju prva 3 u svojim grupama
    const sviTimovi = [];
    Object.keys(groups).forEach(group => {
        //Cuva sve timove u odredjenoj grupi, zatim ih sortira
        const timovi = Object.values(polozaji[group]);
        const sortiraniTimovi = sortirajTimove(timovi);

        //console.log(sortiraniTimovi);

        console.log(`   Grupa ${group} (Tim - pobede / porazi / bodovi / postignuto koševa / primljeno koševa / koš razlika): `);
        sortiraniTimovi.forEach((tim, index) => {
            //console.log(tim);
            const kosRazlika = tim.postignuto - tim.primljeno;
            console.log(`       ${index + 1}. ${tim.ime}: ${tim.pobede} / ${tim.porazi} / ${tim.poeni} / ${tim.postignuto} / ${tim.primljeno} / ${kosRazlika > 0 ? '+' : ''}${kosRazlika}`);
            //Prva 3 tima iz svake grupe se dodaju u niz sviTimovi
            //Niz svi timovi se koristi kasnije za rangiranje timova za eliminacionu fazu
            if (index < 3)
                //Dodaje novi element na kraj niza sviTimovi
                //...tim(spread operator) kopira sva svojstva postojeceg objekta tim u novi objekat
                //Novom objektu se dodaje i grupa u kojoj je tim bio, kao i pozicija u grupi nakon sortiranja
                sviTimovi.push({ ...tim, grupa: group, pozicija: index + 1 });
        });
    });
    //Rangiranje timova iz svih grupa
    console.log("\nRangiranje timova za eliminacionu fazu...");
    //Niz u kome se smestaju rangirani timovi za eliminacionu fazu
    const rangiraniTimovi = [];
    //Funkcija za sortiranje timova na osnovu njihove pozicije u grupnoj fazi
    const rangiraj = (pozicija) => {
        //Filtrira timove prema pozicijama na tabeli
        const timoviZaRangiranje = sviTimovi.filter(tim => tim.pozicija == pozicija);
        //Nakon filtriranja sortira te filtrirane timove
        const sortirani = sortirajTimove(timoviZaRangiranje);
        sortirani.forEach((tim, index) => {
            //U nizu rangiraniTimovi dodaje timove i dodeljuje im se rang za eliminacionu fazu
            rangiraniTimovi.push({ ...tim, rang: rangiraniTimovi.length + 1 });
        });
    };

    //Na kraju se rangiraju timovi iz svih grupa prema njihovoj poziciji
    rangiraj(1);
    rangiraj(2);
    rangiraj(3);

    //Prikaz rangiranih timova
    console.log("\nTimovi koji su prosli u eliminacionu fazu: ");
    //Slice metoda vraca novi niz koji sadrzi elemente originalnog niza rangiraniTimovi
    // s tim sto uzima u obzir prvih osam timova iz niza
    rangiraniTimovi.slice(0, 8).forEach((tim) => {
        console.log(`   ${tim.rang}. ${tim.ime} iz Grupe ${tim.grupa}`);
    });
    if (rangiraniTimovi[8]) {
        console.log(`   9. ${rangiraniTimovi[8].ime} iz Grupe ${rangiraniTimovi[8].grupa} - ne prolazi dalje`)
    }

    return rangiraniTimovi.slice(0, 8);
};


module.exports = {
    simulacijaGrupneFaze,
    simulacijaIgre
}