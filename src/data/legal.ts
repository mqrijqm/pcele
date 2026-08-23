// Generated from the original site's legal pages.
import type { Locale } from '@/i18n/config';

export type LegalBlock = { t: 'p'; text: string } | { t: 'ul'; items: string[] };
export type LegalSection = { id: string; heading: string; blocks: LegalBlock[] };
export type LegalDoc = { effective: string; sections: LegalSection[] };

export const legal: Record<Locale, { terms: LegalDoc; privacy: LegalDoc }> = {
  "sr": {
    "terms": {
      "effective": "Datum stupanja na snagu: 17.07.2026.",
      "sections": [
        {
          "id": "opste-odredbe",
          "heading": "1. Opšte odredbe",
          "blocks": [
            {
              "t": "p",
              "text": "Ove uslove kupovine (\"Uslovi\") primjenjuje Pčelarstvo Jevtić, porodično poljoprivredno gazdinstvo sa sjedištem u selu Mračaj, opština Prnjavor, Republika Srpska, Bosna i Hercegovina (JIB: [JIB], matični broj: [matični broj]), u daljem tekstu \"Prodavac\", \"mi\" ili \"nas\". Uslovi uređuju svaku kupovinu proizvoda putem internet prodavnice na adresi pcelarstvo-jevtic.ba (u daljem tekstu \"Prodavnica\")."
            },
            {
              "t": "p",
              "text": "Kupovinom u Prodavnici kupac (\"Kupac\", \"vi\") potvrđuje da je prije slanja narudžbe pročitao, razumio i prihvatio ove Uslove, kao i Politiku privatnosti. Ako se ne slažete sa bilo kojim dijelom Uslova, molimo vas da ne izvršite narudžbu."
            }
          ]
        },
        {
          "id": "proizvodi-i-cijene",
          "heading": "2. Proizvodi i cijene",
          "blocks": [
            {
              "t": "p",
              "text": "U Prodavnici nudimo prirodne pčelinje proizvode - med (bagremov, livadski, lipov i druge vrste), propolis i polen, proizvedene na našem porodičnom pčelinjaku u okolini Mračaja. Fotografije i opisi proizvoda na sajtu predstavljaju vjeran prikaz proizvoda, ali stvarni izgled (boja, konzistencija) meda može neznatno varirati u zavisnosti od godišnjeg doba i izvora nektara, što je prirodna karakteristika, a ne nedostatak."
            },
            {
              "t": "p",
              "text": "Sve cijene na sajtu izražene su u konvertibilnim markama (KM / BAM) i predstavljaju konačnu cijenu proizvoda koju Kupac plaća, bez skrivenih troškova. Trošak dostave prikazuje se zasebno prije potvrde narudžbe i nije uključen u cijenu proizvoda. Zadržavamo pravo izmjene cijena u bilo kom trenutku, s tim da će se na već potvrđenu narudžbu primjenjivati cijena važeća u trenutku slanja te narudžbe."
            }
          ]
        },
        {
          "id": "narudzba-i-ugovor",
          "heading": "3. Poručivanje i zaključenje ugovora",
          "blocks": [
            {
              "t": "p",
              "text": "Narudžba se vrši elektronskim putem - dodavanjem proizvoda u korpu i završetkom procesa plaćanja. Prije slanja narudžbe, Kupac ima priliku da provjeri i izmijeni sadržaj korpe, unesene podatke i izabrani način dostave i plaćanja."
            },
            {
              "t": "p",
              "text": "Ugovor o kupoprodaji smatra se zaključenim u trenutku kada Kupac primi email potvrdu narudžbe od Prodavca. Prodavac zadržava pravo da odbije ili otkaže narudžbu u slučaju očigledne greške u cijeni, nedostupnosti proizvoda na zalihama ili sumnje na zloupotrebu, o čemu će Kupac biti obaviješten putem email adrese navedene prilikom narudžbe."
            }
          ]
        },
        {
          "id": "nacin-placanja",
          "heading": "4. Način plaćanja",
          "blocks": [
            {
              "t": "p",
              "text": "Kupac može izabrati jedan od sljedećih načina plaćanja prilikom završetka narudžbe:"
            },
            {
              "t": "ul",
              "items": [
                "Plaćanje karticom putem Stripe-a - sigurna online transakcija; podatke o kartici unosite direktno kod pružaoca usluga plaćanja Stripe, a mi ih ne vidimo niti čuvamo na našim serverima.",
                "Plaćanje pouzećem (gotovinom prilikom preuzimanja) - iznos narudžbe plaćate kuriru u trenutku isporuke pošiljke."
              ]
            },
            {
              "t": "p",
              "text": "Za plaćanje karticom, sredstva se terete u trenutku potvrde narudžbe. Za plaćanje pouzećem, kurirska služba može naplatiti dodatnu naknadu za ovu uslugu, o čemu ćete biti obaviješteni prije potvrde narudžbe."
            }
          ]
        },
        {
          "id": "dostava",
          "heading": "5. Dostava",
          "blocks": [
            {
              "t": "p",
              "text": "Dostavljamo na teritoriji Bosne i Hercegovine putem kurirske službe. Trošak dostave iznosi 10 KM za narudžbe ispod 50 KM, dok je dostava besplatna za narudžbe u vrijednosti od 50 KM i više."
            },
            {
              "t": "p",
              "text": "Uobičajeno vrijeme isporuke je 2 do 5 radnih dana od potvrde narudžbe, u zavisnosti od lokacije Kupca i dostupnosti proizvoda. U periodima povećane potražnje (npr. praznici) rok isporuke može biti nešto duži, o čemu ćemo vas blagovremeno obavijestiti."
            },
            {
              "t": "p",
              "text": "Rizik slučajnog oštećenja ili gubitka proizvoda prelazi na Kupca u trenutku kada proizvod bude predat Kupcu ili licu koje je Kupac ovlastio da preuzme pošiljku. Molimo vas da pri preuzimanju provjerite da li je pošiljka oštećena i, ukoliko jeste, to odmah prijavite kuriru i nama."
            }
          ]
        },
        {
          "id": "pravo-na-odustanak",
          "heading": "6. Pravo na odustanak od ugovora (povrat u roku od 14 dana)",
          "blocks": [
            {
              "t": "p",
              "text": "U skladu sa Zakonom o zaštiti potrošača u Bosni i Hercegovini, Kupac koji je proizvod naručio na daljinu (putem interneta) ima pravo da, bez navođenja razloga, odustane od ugovora u roku od 14 dana od dana prijema proizvoda."
            },
            {
              "t": "p",
              "text": "Da biste ostvarili pravo na odustanak, potrebno je da nas u navedenom roku pismeno obavijestite (na email adresu navedenu u odjeljku Kontakt) o svojoj odluci, uz naznaku broja narudžbe. Proizvod je zatim potrebno vratiti u originalnom, neotvorenom i neoštećenom pakovanju, najkasnije u roku od 14 dana od dana kada ste nas obavijestili o odustanku."
            },
            {
              "t": "ul",
              "items": [
                "Zbog prirode robe (prehrambeni proizvodi), pravo na odustanak ne odnosi se na proizvode čije je originalno pakovanje otvoreno ili zapečaćenje uklonjeno nakon isporuke, iz razloga zaštite zdravlja i higijene.",
                "Proizvod se vraća o trošku Kupca, osim ako je proizvod neispravan, oštećen u transportu, ili je isporučen proizvod koji ne odgovara naručenom.",
                "Nakon što primimo i pregledamo vraćeni proizvod, izvršićemo povrat cjelokupnog plaćenog iznosa (uključujući osnovni trošak dostave) u roku od 14 dana, istim putem plaćanja koji je Kupac koristio prilikom kupovine, osim ako se izričito ne dogovori drugačije."
              ]
            }
          ]
        },
        {
          "id": "reklamacije",
          "heading": "7. Reklamacije i saobraznost robe",
          "blocks": [
            {
              "t": "p",
              "text": "Ukoliko primljeni proizvod ima nedostatak, nije saobrazan opisu na sajtu ili je oštećen prilikom transporta, Kupac ima pravo na reklamaciju u skladu sa važećim propisima o zaštiti potrošača."
            },
            {
              "t": "p",
              "text": "Reklamacija se podnosi putem email adrese navedene u odjeljku Kontakt, uz opis nedostatka i, po mogućnosti, fotografiju proizvoda. Na svaku reklamaciju odgovaramo u roku od 24 do 48 sati od prijema."
            },
            {
              "t": "p",
              "text": "U zavisnosti od prirode nedostatka, Kupcu nudimo zamjenu proizvoda, popust na iznos narudžbe ili povrat novca. Prodavac vodi evidenciju svih primljenih reklamacija u skladu sa zakonom."
            }
          ]
        },
        {
          "id": "odgovornost",
          "heading": "8. Odgovornost",
          "blocks": [
            {
              "t": "p",
              "text": "Med i drugi pčelinji proizvodi su prirodni proizvodi i mogu sadržavati tragove polena i drugih prirodnih sastojaka. Osobe sa poznatom alergijom na pčelinje proizvode ili polen trebalo bi da se posavjetuju sa ljekarom prije konzumacije. Med se ne preporučuje za djecu mlađu od 12 mjeseci, u skladu sa opšteprihvaćenim pedijatrijskim preporukama."
            },
            {
              "t": "p",
              "text": "Prodavac ne odgovara za štetu nastalu neadekvatnim skladištenjem proizvoda nakon isporuke, niti za indirektnu štetu (izgubljenu dobit, gubitak podataka i slično) nastalu usljed korištenja ili nemogućnosti korištenja Prodavnice."
            },
            {
              "t": "p",
              "text": "Prodavac se oslobađa odgovornosti za kašnjenje ili neizvršenje obaveza uzrokovano okolnostima van njegove razumne kontrole (viša sila), kao što su elementarne nepogode, prekid rada kurirskih službi ili mjere državnih organa."
            }
          ]
        },
        {
          "id": "zastita-podataka",
          "heading": "9. Zaštita ličnih podataka",
          "blocks": [
            {
              "t": "p",
              "text": "Lične podatke koje nam dostavite prilikom kupovine (ime, adresa, kontakt podaci) obrađujemo u skladu sa našom Politikom privatnosti, koja je sastavni dio ovih Uslova i dostupna je na stranici Politika privatnosti."
            }
          ]
        },
        {
          "id": "izmjene-uslova",
          "heading": "10. Izmjene uslova kupovine",
          "blocks": [
            {
              "t": "p",
              "text": "Zadržavamo pravo da povremeno izmijenimo ove Uslove, o čemu će datum posljednje izmjene biti naveden na vrhu ove stranice. Na već zaključene ugovore primjenjuju se Uslovi koji su bili na snazi u trenutku slanja narudžbe."
            }
          ]
        },
        {
          "id": "mjerodavno-pravo",
          "heading": "11. Mjerodavno pravo i rješavanje sporova",
          "blocks": [
            {
              "t": "p",
              "text": "Na ove Uslove primjenjuje se pravo Bosne i Hercegovine, odnosno Republike Srpske. Eventualne sporove strane će nastojati riješiti sporazumno; ukoliko to ne bude moguće, nadležan je stvarno i mjesno nadležni sud u Republici Srpskoj."
            }
          ]
        },
        {
          "id": "kontakt",
          "heading": "12. Kontakt",
          "blocks": [
            {
              "t": "p",
              "text": "Za sva pitanja u vezi sa ovim Uslovima, narudžbama, reklamacijama ili odustankom od ugovora, možete nas kontaktirati na email info@pcelarstvo-jevtic.ba ili putem kontakt forme na stranici Kontakt."
            }
          ]
        }
      ]
    },
    "privacy": {
      "effective": "Datum stupanja na snagu: 17.07.2026.",
      "sections": [
        {
          "id": "uvod",
          "heading": "1. Uvod",
          "blocks": [
            {
              "t": "p",
              "text": "Ova Politika privatnosti opisuje koje lične podatke prikuplja Pčelarstvo Jevtić, porodično poljoprivredno gazdinstvo sa sjedištem u selu Mračaj, opština Prnjavor, Republika Srpska, Bosna i Hercegovina (JIB: [JIB]), u svojstvu rukovaoca podacima (u daljem tekstu \"mi\", \"nas\"), prilikom vaše posjete i korištenja internet prodavnice pcelarstvo-jevtic.ba, u koje svrhe se ti podaci koriste i koja prava imate u vezi sa njima."
            }
          ]
        },
        {
          "id": "koje-podatke-prikupljamo",
          "heading": "2. Koje podatke prikupljamo",
          "blocks": [
            {
              "t": "p",
              "text": "U zavisnosti od toga kako koristite Prodavnicu, prikupljamo sljedeće kategorije podataka:"
            },
            {
              "t": "ul",
              "items": [
                "Podaci o narudžbi: ime i prezime, adresa za dostavu, email adresa, broj telefona i sadržaj narudžbe - potrebni za obradu i isporuku vaše narudžbe.",
                "Podaci o nalogu: email adresa i lozinka (u šifrovanom obliku), ukoliko odlučite da kreirate korisnički nalog radi praćenja narudžbi.",
                "Podaci sa kontakt forme: ime, email adresa i sadržaj poruke koju nam pošaljete putem stranice Kontakt.",
                "Podaci za newsletter: email adresa, ukoliko se dobrovoljno prijavite za primanje novosti i ponuda.",
                "Podaci o plaćanju: prilikom plaćanja karticom, podatke o kartici obrađuje isključivo Stripe kao naš pružalac usluga plaćanja - mi ne vidimo, ne primamo niti čuvamo brojeve kartica na našim serverima.",
                "Tehnički podaci: IP adresa i osnovni podaci o pregledaču/uređaju koji se automatski bilježe radi sigurnosti sajta i sprječavanja zloupotreba."
              ]
            }
          ]
        },
        {
          "id": "svrha-obrade",
          "heading": "3. Svrha obrade podataka",
          "blocks": [
            {
              "t": "p",
              "text": "Vaše podatke obrađujemo u sljedeće svrhe:"
            },
            {
              "t": "ul",
              "items": [
                "Izvršenje kupoprodajnog ugovora - obrada, priprema i dostava vaše narudžbe, kao i komunikacija u vezi sa narudžbom.",
                "Upravljanje korisničkim nalogom - omogućavanje pristupa istoriji narudžbi i sačuvanim podacima za dostavu.",
                "Odgovaranje na upite - komunikacija putem kontakt forme ili email adrese.",
                "Slanje newslettera - obavještavanje o novim proizvodima i ponudama, isključivo uz vašu prethodnu saglasnost.",
                "Ispunjavanje zakonskih obaveza - vođenje računovodstvene i poreske dokumentacije u skladu sa propisima Bosne i Hercegovine.",
                "Sprječavanje zloupotreba i osiguravanje sigurnosti - zaštita Prodavnice od prevara i neovlašćenog pristupa."
              ]
            }
          ]
        },
        {
          "id": "pravni-osnov",
          "heading": "4. Pravni osnov obrade",
          "blocks": [
            {
              "t": "p",
              "text": "Obrada vaših podataka zasniva se na: izvršenju ugovora (obrada narudžbi), vašoj saglasnosti (newsletter, kolačići koji nisu neophodni), zakonskoj obavezi (računovodstvena evidencija) i našem legitimnom interesu (sprječavanje zloupotreba, poboljšanje rada sajta)."
            }
          ]
        },
        {
          "id": "kolacici",
          "heading": "5. Kolačići (cookies)",
          "blocks": [
            {
              "t": "p",
              "text": "Prodavnica koristi kolačiće - male tekstualne fajlove koji se čuvaju na vašem uređaju radi ispravnog funkcionisanja sajta i poboljšanja korisničkog iskustva."
            },
            {
              "t": "ul",
              "items": [
                "Neophodni kolačići - omogućavaju osnovne funkcije poput korpe za kupovinu, prijave na nalog i izbora jezika; bez njih sajt ne bi ispravno radio.",
                "Analitički kolačići - pomažu nam da razumijemo kako posjetioci koriste sajt, radi unapređenja sadržaja i performansi.",
                "Kolačići za izbor jezika i regije - pamte vaš odabrani jezik (srpski/engleski) kako ga ne biste morali ponovo birati pri sljedećoj posjeti."
              ]
            },
            {
              "t": "p",
              "text": "Kolačićima možete upravljati putem podešavanja vašeg internet pregledača, uključujući njihovo brisanje ili blokiranje. Imajte u vidu da onemogućavanje neophodnih kolačića može uticati na funkcionisanje pojedinih dijelova sajta (npr. korpe za kupovinu)."
            }
          ]
        },
        {
          "id": "trece-strane",
          "heading": "6. Dijeljenje podataka sa trećim stranama",
          "blocks": [
            {
              "t": "p",
              "text": "Vaše podatke ne prodajemo trećim stranama. Pojedine podatke dijelimo isključivo sa pouzdanim pružaocima usluga, u mjeri neophodnoj za pružanje naših usluga:"
            },
            {
              "t": "ul",
              "items": [
                "Stripe - obrada plaćanja karticom; Stripe prima i čuva podatke o kartici u skladu sa PCI DSS standardom, a mi tim podacima ne pristupamo.",
                "Kurirska služba - ime, adresa i broj telefona neophodni za isporuku vaše narudžbe.",
                "Pružaoci usluga hostinga i email komunikacije - tehnička podrška za rad sajta i slanje email obavještenja (potvrda narudžbe, newsletter)."
              ]
            },
            {
              "t": "p",
              "text": "Podatke možemo otkriti nadležnim organima ukoliko je to zakonski obavezno (npr. u poreske ili inspekcijske svrhe)."
            }
          ]
        },
        {
          "id": "cuvanje-podataka",
          "heading": "7. Čuvanje podataka",
          "blocks": [
            {
              "t": "p",
              "text": "Podatke o narudžbama i računima čuvamo onoliko dugo koliko to nalažu propisi o računovodstvu i oporezivanju u Bosni i Hercegovini. Podatke dostavljene putem kontakt forme čuvamo dok je to potrebno radi rješavanja vašeg upita, a najduže 12 mjeseci od posljednjeg kontakta. Email adresu za newsletter čuvamo dok se ne odjavite sa liste primalaca."
            }
          ]
        },
        {
          "id": "prava-korisnika",
          "heading": "8. Vaša prava",
          "blocks": [
            {
              "t": "p",
              "text": "U vezi sa svojim ličnim podacima, imate pravo da:"
            },
            {
              "t": "ul",
              "items": [
                "zatražite pristup podacima koje o vama čuvamo;",
                "zatražite ispravku netačnih ili nepotpunih podataka;",
                "zatražite brisanje podataka (\"pravo na zaborav\"), osim ako smo zakonski obavezni da ih zadržimo (npr. računovodstvena dokumentacija);",
                "ograničite ili se usprotivite određenim vidovima obrade, uključujući direktni marketing;",
                "povučete datu saglasnost u bilo kom trenutku, bez uticaja na zakonitost prethodne obrade;",
                "zatražite prenosivost podataka u strukturiranom, uobičajeno korištenom formatu."
              ]
            },
            {
              "t": "p",
              "text": "Zahtjeve u vezi sa navedenim pravima možete poslati na email info@pcelarstvo-jevtic.ba. Odgovorićemo u najkraćem mogućem roku, a najkasnije u roku od 30 dana. Takođe imate pravo podnijeti pritužbu Agenciji za zaštitu ličnih podataka u Bosni i Hercegovini (AZLP), ukoliko smatrate da je obrada vaših podataka u suprotnosti sa propisima."
            }
          ]
        },
        {
          "id": "sigurnost",
          "heading": "9. Sigurnost podataka",
          "blocks": [
            {
              "t": "p",
              "text": "Primjenjujemo odgovarajuće tehničke i organizacione mjere zaštite vaših podataka, uključujući šifrovanu (HTTPS) komunikaciju između vašeg pregledača i naših servera i ograničen pristup podacima samo osoblju kojem je to neophodno za obavljanje posla. Plaćanja karticom obrađuju se isključivo preko Stripe-a, pružaoca usluga sertifikovanog po PCI DSS standardu, tako da mi nikada ne dolazimo u posjed kompletnog broja vaše kartice."
            }
          ]
        },
        {
          "id": "djeca",
          "heading": "10. Djeca",
          "blocks": [
            {
              "t": "p",
              "text": "Prodavnica nije namijenjena djeci mlađoj od 18 godina. Ne prikupljamo svjesno lične podatke maloljetnika bez saglasnosti roditelja ili staratelja. Ukoliko saznamo da smo prikupili podatke maloljetnika bez odgovarajuće saglasnosti, izbrisaćemo ih bez odlaganja."
            }
          ]
        },
        {
          "id": "izmjene-politike",
          "heading": "11. Izmjene politike privatnosti",
          "blocks": [
            {
              "t": "p",
              "text": "Ovu Politiku privatnosti možemo povremeno ažurirati, o čemu će datum posljednje izmjene biti naveden na vrhu ove stranice. Preporučujemo da povremeno provjerite ovu stranicu radi upoznavanja sa eventualnim izmjenama."
            }
          ]
        },
        {
          "id": "kontakt-zahtjevi",
          "heading": "12. Kontakt za zahtjeve",
          "blocks": [
            {
              "t": "p",
              "text": "Za sva pitanja u vezi sa ovom Politikom privatnosti ili radi ostvarivanja vaših prava, kontaktirajte nas na email info@pcelarstvo-jevtic.ba ili putem kontakt forme na stranici Kontakt."
            }
          ]
        }
      ]
    }
  },
  "en": {
    "terms": {
      "effective": "Effective date: July 17, 2026",
      "sections": [
        {
          "id": "opste-odredbe",
          "heading": "1. General provisions",
          "blocks": [
            {
              "t": "p",
              "text": "These terms of purchase (\"Terms\") are applied by Pčelarstvo Jevtić, a family agricultural holding based in the village of Mračaj, Prnjavor municipality, Republika Srpska, Bosnia and Herzegovina (Tax ID / JIB: [JIB], Registration number: [matični broj]), referred to below as the \"Seller\", \"we\" or \"us\". The Terms govern every purchase of products through the online store at pcelarstvo-jevtic.ba (the \"Store\")."
            },
            {
              "t": "p",
              "text": "By placing an order in the Store, the customer (\"Customer\", \"you\") confirms that, before submitting the order, they have read, understood, and accepted these Terms as well as the Privacy Policy. If you do not agree with any part of these Terms, please do not place an order."
            }
          ]
        },
        {
          "id": "proizvodi-i-cijene",
          "heading": "2. Products and prices",
          "blocks": [
            {
              "t": "p",
              "text": "In the Store we offer natural bee products - honey (acacia, meadow, linden and other varieties), propolis and pollen, produced at our family apiary near Mračaj. Photographs and descriptions on the site are a faithful representation of the products, but the actual appearance (color, texture) of the honey may vary slightly depending on the season and nectar source, which is a natural characteristic and not a defect."
            },
            {
              "t": "p",
              "text": "All prices on the site are expressed in convertible marks (KM / BAM) and represent the final price the Customer pays, with no hidden costs. The delivery cost is shown separately before the order is confirmed and is not included in the product price. We reserve the right to change prices at any time; an already confirmed order will be charged at the price in effect at the moment that order was placed."
            }
          ]
        },
        {
          "id": "narudzba-i-ugovor",
          "heading": "3. Ordering and formation of the contract",
          "blocks": [
            {
              "t": "p",
              "text": "An order is placed electronically - by adding products to the cart and completing the checkout process. Before submitting the order, the Customer has the opportunity to review and change the cart contents, the entered details, and the chosen delivery and payment method."
            },
            {
              "t": "p",
              "text": "The sales contract is considered concluded when the Customer receives an email order confirmation from the Seller. The Seller reserves the right to refuse or cancel an order in the event of an obvious pricing error, unavailability of stock, or suspicion of fraud, and will notify the Customer via the email address provided with the order."
            }
          ]
        },
        {
          "id": "nacin-placanja",
          "heading": "4. Payment methods",
          "blocks": [
            {
              "t": "p",
              "text": "The Customer can choose one of the following payment methods at checkout:"
            },
            {
              "t": "ul",
              "items": [
                "Card payment via Stripe - a secure online transaction; you enter your card details directly with our payment provider, Stripe, and we never see or store them on our servers.",
                "Cash on delivery - you pay the order amount to the courier at the time the package is delivered."
              ]
            },
            {
              "t": "p",
              "text": "For card payments, funds are charged at the moment the order is confirmed. For cash on delivery, the courier service may charge an additional fee for this service, of which you will be informed before confirming the order."
            }
          ]
        },
        {
          "id": "dostava",
          "heading": "5. Delivery",
          "blocks": [
            {
              "t": "p",
              "text": "We deliver throughout Bosnia and Herzegovina via courier. The delivery fee is 10 KM for orders under 50 KM, while delivery is free for orders of 50 KM or more."
            },
            {
              "t": "p",
              "text": "The typical delivery time is 2 to 5 business days from order confirmation, depending on the Customer’s location and product availability. During periods of higher demand (e.g. holidays), the delivery time may be somewhat longer, and we will inform you in advance."
            },
            {
              "t": "p",
              "text": "The risk of accidental damage or loss of the product passes to the Customer at the moment the product is handed over to the Customer or to a person the Customer has authorized to receive the shipment. Please check the shipment for damage upon receipt and, if any is found, report it to the courier and to us immediately."
            }
          ]
        },
        {
          "id": "pravo-na-odustanak",
          "heading": "6. Right of withdrawal (14-day return period)",
          "blocks": [
            {
              "t": "p",
              "text": "In accordance with the Consumer Protection Law of Bosnia and Herzegovina, a Customer who ordered a product remotely (over the internet) has the right to withdraw from the contract within 14 days of receiving the product, without stating a reason."
            },
            {
              "t": "p",
              "text": "To exercise the right of withdrawal, you must notify us in writing (to the email address listed under Contact) within the stated period, stating your order number. The product must then be returned in its original, unopened, undamaged packaging no later than 14 days from the day you notified us of the withdrawal."
            },
            {
              "t": "ul",
              "items": [
                "Due to the nature of the goods (food products), the right of withdrawal does not apply to products whose original packaging has been opened or the seal removed after delivery, for health and hygiene reasons.",
                "The product is returned at the Customer’s expense, unless the product is defective, was damaged in transit, or the delivered product does not match what was ordered.",
                "Once we receive and inspect the returned product, we will refund the full amount paid (including the basic delivery cost) within 14 days, using the same payment method the Customer used for the purchase, unless expressly agreed otherwise."
              ]
            }
          ]
        },
        {
          "id": "reklamacije",
          "heading": "7. Complaints and conformity of goods",
          "blocks": [
            {
              "t": "p",
              "text": "If a received product has a defect, does not conform to the description on the site, or was damaged in transit, the Customer has the right to file a complaint in accordance with applicable consumer protection regulations."
            },
            {
              "t": "p",
              "text": "A complaint is submitted via the email address listed under Contact, along with a description of the defect and, if possible, a photograph of the product. We respond to every complaint within 24 to 48 hours of receiving it."
            },
            {
              "t": "p",
              "text": "Depending on the nature of the defect, we offer the Customer a product replacement, a discount on the order amount, or a refund. The Seller keeps records of all received complaints in accordance with the law."
            }
          ]
        },
        {
          "id": "odgovornost",
          "heading": "8. Liability",
          "blocks": [
            {
              "t": "p",
              "text": "Honey and other bee products are natural products and may contain traces of pollen and other natural ingredients. Anyone with a known allergy to bee products or pollen should consult a doctor before consumption. Honey is not recommended for children under 12 months of age, in line with generally accepted pediatric guidance."
            },
            {
              "t": "p",
              "text": "The Seller is not liable for damage arising from improper storage of the product after delivery, nor for indirect damages (lost profit, data loss, and similar) arising from the use or inability to use the Store."
            },
            {
              "t": "p",
              "text": "The Seller is released from liability for delay or non-performance caused by circumstances beyond its reasonable control (force majeure), such as natural disasters, disruption of courier services, or measures taken by state authorities."
            }
          ]
        },
        {
          "id": "zastita-podataka",
          "heading": "9. Protection of personal data",
          "blocks": [
            {
              "t": "p",
              "text": "Personal data you provide to us when making a purchase (name, address, contact details) is processed in accordance with our Privacy Policy, which forms an integral part of these Terms and is available on the Privacy Policy page."
            }
          ]
        },
        {
          "id": "izmjene-uslova",
          "heading": "10. Changes to these terms",
          "blocks": [
            {
              "t": "p",
              "text": "We reserve the right to amend these Terms from time to time; the date of the last amendment will be shown at the top of this page. Contracts already concluded remain subject to the Terms in effect at the time the order was placed."
            }
          ]
        },
        {
          "id": "mjerodavno-pravo",
          "heading": "11. Governing law and dispute resolution",
          "blocks": [
            {
              "t": "p",
              "text": "These Terms are governed by the law of Bosnia and Herzegovina, specifically Republika Srpska. The parties will attempt to resolve any dispute amicably; if this is not possible, the competent court in Republika Srpska shall have jurisdiction."
            }
          ]
        },
        {
          "id": "kontakt",
          "heading": "12. Contact",
          "blocks": [
            {
              "t": "p",
              "text": "For any questions regarding these Terms, orders, complaints, or withdrawal from the contract, you can reach us at info@pcelarstvo-jevtic.ba or through the contact form on the Contact page."
            }
          ]
        }
      ]
    },
    "privacy": {
      "effective": "Effective date: July 17, 2026",
      "sections": [
        {
          "id": "uvod",
          "heading": "1. Introduction",
          "blocks": [
            {
              "t": "p",
              "text": "This Privacy Policy describes what personal data is collected by Pčelarstvo Jevtić, a family agricultural holding based in the village of Mračaj, Prnjavor municipality, Republika Srpska, Bosnia and Herzegovina (Tax ID / JIB: [JIB]), acting as data controller (referred to below as \"we\", \"us\"), when you visit and use the online store at pcelarstvo-jevtic.ba, for what purposes that data is used, and what rights you have in relation to it."
            }
          ]
        },
        {
          "id": "koje-podatke-prikupljamo",
          "heading": "2. What data we collect",
          "blocks": [
            {
              "t": "p",
              "text": "Depending on how you use the Store, we collect the following categories of data:"
            },
            {
              "t": "ul",
              "items": [
                "Order data: first and last name, delivery address, email address, phone number, and order contents - required to process and deliver your order.",
                "Account data: email address and password (in encrypted form), if you choose to create a customer account to track your orders.",
                "Contact form data: name, email address, and the content of the message you send us via the Contact page.",
                "Newsletter data: email address, if you voluntarily sign up to receive news and offers.",
                "Payment data: when paying by card, card details are processed exclusively by Stripe, our payment service provider - we never see, receive, or store card numbers on our servers.",
                "Technical data: IP address and basic browser/device information automatically logged for site security and fraud prevention."
              ]
            }
          ]
        },
        {
          "id": "svrha-obrade",
          "heading": "3. Purpose of processing",
          "blocks": [
            {
              "t": "p",
              "text": "We process your data for the following purposes:"
            },
            {
              "t": "ul",
              "items": [
                "Performing the sales contract - processing, preparing, and delivering your order, and communicating about it.",
                "Managing your account - enabling access to your order history and saved delivery details.",
                "Responding to inquiries - communication via the contact form or email.",
                "Sending the newsletter - informing you about new products and offers, only with your prior consent.",
                "Fulfilling legal obligations - keeping accounting and tax records in accordance with the regulations of Bosnia and Herzegovina.",
                "Preventing abuse and ensuring security - protecting the Store from fraud and unauthorized access."
              ]
            }
          ]
        },
        {
          "id": "pravni-osnov",
          "heading": "4. Legal basis for processing",
          "blocks": [
            {
              "t": "p",
              "text": "Our processing of your data is based on: performance of a contract (processing orders), your consent (newsletter, non-essential cookies), legal obligation (accounting records), and our legitimate interest (fraud prevention, improving the site)."
            }
          ]
        },
        {
          "id": "kolacici",
          "heading": "5. Cookies",
          "blocks": [
            {
              "t": "p",
              "text": "The Store uses cookies - small text files stored on your device to enable the site to function correctly and to improve the user experience."
            },
            {
              "t": "ul",
              "items": [
                "Essential cookies - enable core functions such as the shopping cart, account login, and language selection; without them the site would not work correctly.",
                "Analytics cookies - help us understand how visitors use the site, so we can improve content and performance.",
                "Language and region cookies - remember your selected language (Serbian/English) so you do not have to choose it again on your next visit."
              ]
            },
            {
              "t": "p",
              "text": "You can manage cookies through your browser settings, including deleting or blocking them. Please note that disabling essential cookies may affect the functioning of certain parts of the site (e.g. the shopping cart)."
            }
          ]
        },
        {
          "id": "trece-strane",
          "heading": "6. Sharing data with third parties",
          "blocks": [
            {
              "t": "p",
              "text": "We do not sell your data to third parties. We share certain data only with trusted service providers, to the extent necessary to deliver our services:"
            },
            {
              "t": "ul",
              "items": [
                "Stripe - card payment processing; Stripe receives and stores card data in accordance with the PCI DSS standard, and we never have access to it.",
                "Courier service - name, address, and phone number necessary to deliver your order.",
                "Hosting and email service providers - technical support for running the site and sending email notifications (order confirmations, newsletter)."
              ]
            },
            {
              "t": "p",
              "text": "We may disclose data to competent authorities where legally required (e.g. for tax or inspection purposes)."
            }
          ]
        },
        {
          "id": "cuvanje-podataka",
          "heading": "7. Data retention",
          "blocks": [
            {
              "t": "p",
              "text": "We keep order and invoice data for as long as required by the accounting and tax regulations of Bosnia and Herzegovina. Data submitted via the contact form is kept for as long as needed to resolve your inquiry, and for no longer than 12 months from the last contact. We keep your newsletter email address until you unsubscribe."
            }
          ]
        },
        {
          "id": "prava-korisnika",
          "heading": "8. Your rights",
          "blocks": [
            {
              "t": "p",
              "text": "Regarding your personal data, you have the right to:"
            },
            {
              "t": "ul",
              "items": [
                "request access to the data we hold about you;",
                "request correction of inaccurate or incomplete data;",
                "request deletion of your data (\"right to be forgotten\"), unless we are legally required to retain it (e.g. accounting records);",
                "restrict or object to certain forms of processing, including direct marketing;",
                "withdraw given consent at any time, without affecting the lawfulness of processing carried out before the withdrawal;",
                "request data portability in a structured, commonly used format."
              ]
            },
            {
              "t": "p",
              "text": "Requests relating to the rights above can be sent to info@pcelarstvo-jevtic.ba. We will respond as soon as possible, and no later than within 30 days. You also have the right to lodge a complaint with the Personal Data Protection Agency of Bosnia and Herzegovina (AZLP) if you believe the processing of your data does not comply with the applicable regulations."
            }
          ]
        },
        {
          "id": "sigurnost",
          "heading": "9. Data security",
          "blocks": [
            {
              "t": "p",
              "text": "We apply appropriate technical and organizational measures to protect your data, including encrypted (HTTPS) communication between your browser and our servers, and access to data limited to staff who need it to do their job. Card payments are processed exclusively through Stripe, a PCI DSS-certified payment provider, so we never come into possession of your full card number."
            }
          ]
        },
        {
          "id": "djeca",
          "heading": "10. Children",
          "blocks": [
            {
              "t": "p",
              "text": "The Store is not intended for children under the age of 18. We do not knowingly collect personal data from minors without parental or guardian consent. If we learn that we have collected data from a minor without appropriate consent, we will delete it without delay."
            }
          ]
        },
        {
          "id": "izmjene-politike",
          "heading": "11. Changes to this policy",
          "blocks": [
            {
              "t": "p",
              "text": "We may update this Privacy Policy from time to time; the date of the last amendment will be shown at the top of this page. We recommend checking this page periodically to stay informed of any changes."
            }
          ]
        },
        {
          "id": "kontakt-zahtjevi",
          "heading": "12. Contact for requests",
          "blocks": [
            {
              "t": "p",
              "text": "For any questions about this Privacy Policy or to exercise your rights, contact us at info@pcelarstvo-jevtic.ba or through the contact form on the Contact page."
            }
          ]
        }
      ]
    }
  }
};
