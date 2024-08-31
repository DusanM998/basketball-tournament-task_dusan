Zadatak – Olimpijske Igre
JavaScript projekat koji predstavlja simulaciju košarkaškog turnira na Olimpijskim igrama. Ideja projekta je da se prvo odigrava grupna faza turnira, zatim kako turnir odmiče i ekipe odigravaju utakmice međusobno, beleži se njihova statistika, rangiraju se timovi unutrar grupa, prema ostvarenim bodovima, broju pobeda, koš razlici.
Zatim se na osnovu ranga u grupi formira konačan rang i formiraju se šeširi na osnovu kojih će se timovi kasnije ukrštati u eliminacionoj fazi. 
•	Simulacija odigranih utakmica
Simulacija odigranih utakmica u grupnoj fazi turnira koncipirana je oko funkcije simulacijaIgre koja kao parametre prihvata timove između kojih se odigravaju utakmice.
Za kalkulaciju rezultata uzimaju se u obzir FIBA Ranking tima, kao i prethodno odigrani prijateljski mečevi. Forma tima se izračunava kasnije na osnovu tih odigranih prijateljskih mečeva. Kao parametre za kalkulaciju forme time uzeo sam u obzir razliku između postignutih i primljenih poena tima. Zatim prosečnu formu računam kao količnik ukupne forme i broja odigranih mečeva. Na osnovu forme se kasnije računa i rezultat, a na sam rezultat utiče takođe i verovatnoća pobede jednog tima. Verovatnoća se računa po formuli verovatnoca = tim1.FIBARanking / (tim1.FIBARanking + tim2.FIBARanking). Što bi na primeru značilo da ukoliko je FIBARanking za USA = 1, a FIBARanking Srbije = 3. Onda bi verovatnoća pobede tima USA iznosila 1 / (1 + 2) = 0.25, što bi značilo da USA ima 25% verovatnoće da pobedi Srbiju. 
Funkcija na kraju vraća objekat koji sadrži informacije o oba tima nakon odigrane utakmice i to: ime tima, rezultat (Koliko je poena postigao) I flag da li je tim pobedio ili ne(može biti true ili false)
•	Ažuriranje tabele
Ažuriranje tabele nakon odigranih utakmica impelentirano je pomoću funkcije azurirajTabelu koja prihvata kao parametre poziciju na tabeli, tim, da li je tim pobedio ili ne, rezultat i rezultat protivničkog tima. Zatim se kreira objekat koji sadrži dodatne informacije koje će sačinjavati tabelu, a to su ime tima, broj pobeda i poraza, poene na tabeli, postignute i primljenje koševe.
•	Sortiranje timova na tabeli
Sortiranje timova vrši se pomoću funkcije sortirajTimove koja kao parametar prihvata objekat koji sadrži informacije o timovima. Prvi kriterijum za poređenje timova je broj bodova koje je tim ostvario, a zatim se sortiraju i po koš razlici.
•	Simulacija grupne faze
Odigravanje utakmica u grupnoj fazi, prikaz rezultata i pozicije u grupama izvršava se u funkciji simulacijaGrupneFaze. U funkciji se najpre prolazi kroz objekte koji predstavljaju određenu grupu i to pomogu Object.keys(groups) koji vraća niz svih ključeva datog objekta groups. i za svaki od timova koji su u grupnoj fazi se simulira utakmica, pomoću funkcije simulacijaIgre. Ispisuje se zatim rezultat odigranih utakmica i na kraju se ažurira stanje na tabeli nakon odigranih svih utakmica. 
