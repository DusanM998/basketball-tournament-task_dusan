
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const simulirajCetvrtfinale = (tim1, tim2) => {
    // Faktori za uticaj razlicitih atributa na ishod utakmice
    //Faktor 0.5 oznacava da broj pobeda ima najveci uticaj na snagu tima
    //Faktor 0.3 oznacava koliki znacaj ima broj poena na tabeli za snagu tima
    //Faktor 0.1 oznacava znacaj postignutih poena na utakmicama
    const faktorSnage1 = 
        (tim1.pobede * 0.5 + tim1.poeni * 0.3 + tim1.postignuto * 0.1) / 
        (tim1.pobede + tim1.porazi + 1);
        
    const faktorSnage2 = 
        (tim2.pobede * 0.5 + tim2.poeni * 0.3 + tim2.postignuto * 0.1) / 
        (tim2.pobede + tim2.porazi + 1);
    
    const totalFaktorSnage = faktorSnage1 + faktorSnage2;

    //Verovatnoca da prvi tim pobedi
    const verovatnoca1 = faktorSnage1 / totalFaktorSnage;

    //Rezultat se racuna kao ranije
    const rezultat1 = Math.floor(Math.random() * 50) + 70 + Math.floor((1 - verovatnoca1) * 10);
    const rezultat2 = Math.floor(Math.random() * 50) + 70 + Math.floor(verovatnoca1 * 10);

    // Formiranje rezultata utakmice
    return {
        tim1: {
            ime: tim1.ime,
            rezultat: rezultat1,
            pobeda: rezultat1 > rezultat2
        },
        tim2: {
            ime: tim2.ime,
            rezultat: rezultat2,
            pobeda: rezultat2 > rezultat1
        }
    };
};

const simulacijaPolufinalaFinala = (tim1, tim2) => {
    // Izračunaj ukupni faktor snage za oba tima
    //Vraca 1 ako tim1.pobede ima vrednost vecu od 0(tim1 ima bar jednu pobedu)
    const faktorSnage1 = 
        (tim1.pobede ? 1 : 0) * 0.5 + tim1.rezultat * 0.3;
        
    const faktorSnage2 = 
        (tim2.pobede ? 1 : 0) * 0.5 + tim2.rezultat * 0.3;

    // Normalizuj faktore snage
    const totalFaktorSnage = faktorSnage1 + faktorSnage2;
    const verovatnoca1 = totalFaktorSnage === 0 ? 0.5 : faktorSnage1 / totalFaktorSnage;

    // Odredi rezultat za oba tima
    const rezultat1 = Math.floor(Math.random() * 20) + 80 + Math.floor((1 - verovatnoca1) * 10);
    const rezultat2 = Math.floor(Math.random() * 20) + 80 + Math.floor(verovatnoca1 * 10);

    // Vrati rezultat utakmice
    return {
        tim1: {
            ime: tim1.ime,
            rezultat: rezultat1,
            pobeda: rezultat1 > rezultat2
        },
        tim2: {
            ime: tim2.ime,
            rezultat: rezultat2,
            pobeda: rezultat2 > rezultat1
        }
    };
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
    const porazeniCetvrtfinale = [];

    paroviCetvrtfinala.forEach((par, index) => {
        const [tim1, tim2] = par;
        //console.log(par);
        console.log(`   \nUtakmica ${index + 1}. Par: ${tim1.ime} - ${tim2.ime}`);
        const rezultat = simulirajCetvrtfinale(par[0], par[1]);
        //console.log(par[0], par[1]);
        //console.log(rezultat);
        const pobednik = rezultat.tim1.pobeda ? rezultat.tim1 : rezultat.tim2;
        //console.log(pobednik);
        const porazen = rezultat.tim1.pobeda ? rezultat.tim2 : rezultat.tim1;

        console.log(`   ${index + 1}. Par: ${rezultat.tim1.ime} - ${rezultat.tim2.ime} | Rezultat: ${rezultat.tim1.rezultat} - ${rezultat.tim2.rezultat} | Pobednik: ${pobednik.ime}`);

        if (index % 2 === 0) {
            //Prva dva para idu u jedan polufinalni par, sledeca dva u drugi
            paroviPolufinala.push([pobednik]);
        }
        else {
            paroviPolufinala[paroviPolufinala.length - 1].push(pobednik);
        }

        porazeniCetvrtfinale.push(porazen);
    });

    console.log("\nParovi polufinala: ");
    const finalisti = [];
    const porazeniPolufinale = [];

    paroviPolufinala.forEach((parovi, index) => {
        const [prviPar, drugiPar] = parovi;
        //console.log(parovi);
        const rezultatPolufinala1 = simulacijaPolufinalaFinala(prviPar, drugiPar);
        //console.log(rezultatPolufinala1);
        const pobednikPolufinala = rezultatPolufinala1.tim1.pobeda ? rezultatPolufinala1.tim1 : rezultatPolufinala1.tim2;
        const porazeniPolufinala = rezultatPolufinala1.tim1.pobeda ? rezultatPolufinala1.tim2 : rezultatPolufinala1.tim1;

        console.log(`   Pobednik meča: ${rezultatPolufinala1.tim1.ime} - ${rezultatPolufinala1.tim2.ime} ide u Finale! | Rezultat: ${rezultatPolufinala1.tim1.rezultat} - ${rezultatPolufinala1.tim2.rezultat} | Pobednik: ${pobednikPolufinala.ime} je u Finalu.`);

        finalisti.push(pobednikPolufinala);
        porazeniPolufinale.push(porazeniPolufinala);
    });

    // Utakmica za treće mesto
    console.log("\nUtakmica za treće mesto:");
    const rezultatZaTreceMesto = simulacijaPolufinalaFinala(porazeniPolufinale[0], porazeniPolufinale[1]);
    const bronzanaMedalja = rezultatZaTreceMesto.tim1.pobeda ? rezultatZaTreceMesto.tim1 : rezultatZaTreceMesto.tim2;
    //console.log(bronzanaMedalja);
    console.log(`   ${rezultatZaTreceMesto.tim1.ime} - ${rezultatZaTreceMesto.tim2.ime} | Rezultat: ${rezultatZaTreceMesto.tim1.rezultat} - ${rezultatZaTreceMesto.tim2.rezultat} | Bronza: ${bronzanaMedalja.ime}`);

    // Finale
    console.log("\nFinale:");
    const rezultatFinala = simulacijaPolufinalaFinala(finalisti[0], finalisti[1]);
    //console.log(rezultatFinala);
    const zlatnaMedalja = rezultatFinala.tim1.pobeda ? rezultatFinala.tim1 : rezultatFinala.tim2;
    //console.log(zlatnaMedalja);
    const srebrnaMedalja = rezultatFinala.tim1.pobeda ? rezultatFinala.tim2 : rezultatFinala.tim1;
    console.log(`   ${rezultatFinala.tim1.ime} - ${rezultatFinala.tim2.ime} | Rezultat: ${rezultatFinala.tim1.rezultat} - ${rezultatFinala.tim2.rezultat} | Zlato: ${zlatnaMedalja.ime} | Srebro: ${srebrnaMedalja.ime}`);

    // Ispisivanje medalja
    console.log("\nMedalje:");
    console.log(`   Zlatna medalja: ${zlatnaMedalja.ime}`);
    console.log(`   Srebrna medalja: ${srebrnaMedalja.ime}`);
    console.log(`   Bronzana medalja: ${bronzanaMedalja.ime}`);
}



module.exports = {
    formiranjeZreba
}