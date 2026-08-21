// Generated from the original site's blog articles.
import type { Locale } from '@/i18n/config';

export type Block = { t: 'h2' | 'p'; text: string };

export type Post = {
  slug: string;
  order: number;
  image: string;
  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;
  date: Record<Locale, string>;
  readingTime: Record<Locale, string>;
  body: Record<Locale, Block[]>;
};

export const posts: Post[] = [
  {
    "slug": "proljetno-budjenje-pcelinjaka",
    "order": 1,
    "image": "/images/real/kosnice-livada.webp",
    "title": {
      "sr": "Proljetno buđenje pčelinjaka",
      "en": "The apiary wakes up for spring"
    },
    "excerpt": {
      "sr": "Prvi topli dani, prvi izleti čišćenja, prva kontrola zajednice. Šta se u pčelinjaku u Mračaju dešava čim se probudi proljeće.",
      "en": "The first warm day, the first cleansing flight, the first inspection of the colony. What happens in the Mračaj apiary the moment spring arrives."
    },
    "date": {
      "sr": "2. maj 2026.",
      "en": "May 2, 2026"
    },
    "readingTime": {
      "sr": "6 min čitanja",
      "en": "6 min read"
    },
    "body": {
      "sr": [
        {
          "t": "p",
          "text": "Cijele zime pčelinja zajednica živi stisnuta u klupko unutar košnice, grijući se međusobno i hraneći se zalihama meda koje su sakupile tokom prethodne sezone. One doslovno ne napuštaju košnicu mjesecima — što znači i da danima, čak i sedmicama, zadržavaju sve tjelesne otpatke. Zato je prvi topao dan u godini, obično kad temperatura pređe desetak stepeni, trenutak koji svaki pčelar čeka: pčele konačno izlijeću na takozvani \"čistački let\", kratak izlazak isključivo radi pražnjenja, prije nego što se vrate u košnicu."
        },
        {
          "t": "p",
          "text": "Za pčelara, taj prvi let je i prvi vizuelni znak da je zajednica preživjela zimu."
        },
        {
          "t": "h2",
          "text": "Prva kontrola"
        },
        {
          "t": "p",
          "text": "Čim vrijeme dozvoli miran pristup košnicama, slijedi prva detaljna kontrola. Cilj nije samo provjeriti da li je matica živa — često je lakše i pouzdanije provjeriti ima li svježe legnute jaja i larvi, jer to potvrđuje da matica funkcioniše, bez potrebe da se ona fizički pronađe i time nepotrebno uznemirava zajednica. Pored toga, pčelar procjenjuje stanje zaliha hrane, opštu snagu i brojnost zajednice, i čisti dno košnice od mrtvih pčela nakupljenih tokom zime."
        },
        {
          "t": "p",
          "text": "Ova kontrola nosi i jedan manje očigledan rizik: mnoge zajednice ne stradaju zbog hladnoće same po sebi, nego zato što potroše zimske zalihe prije nego što proljetna paša zaista krene. Taj period — kada je zajednica već aktivna i troši više hrane, a napolju još nema dovoljno cvjetanja — jedan je od najosjetljivijih trenutaka u cijeloj pčelarskoj godini."
        },
        {
          "t": "h2",
          "text": "Prihrana kad zatreba"
        },
        {
          "t": "p",
          "text": "Ako kontrola pokaže da su zalihe prenisko, pčelar dodaje prihranu — najčešće šećerni sirup ili gusti fondan — kako bi zajednica premostila period do prve ozbiljnije paše. Ovo nije zamjena za med, nego privremena podrška dok priroda ne preuzme ulogu."
        },
        {
          "t": "h2",
          "text": "Prva paša u okolini Mračaja"
        },
        {
          "t": "p",
          "text": "Prvi izvori nektara i polena rano u proljeće obično nisu bagrem ni lipa, čiji je cvat tek kasnije. Umjesto toga, pčele se prvo oslanjaju na rane cvjetnice: resa vrbe i lijeske, poljski maslačak i cvjetove voćaka u okolnim vrtovima i voćnjacima. Ovi rani izvori polena su ključni jer daju zajednici bjelančevine potrebne za odgoj novog legla, dok su pravi medonosni viškovi tek na pomolu."
        },
        {
          "t": "h2",
          "text": "Kontrola rojenja"
        },
        {
          "t": "p",
          "text": "Kako se zajednica tokom proljeća naglo širi, raste i rizik od rojenja — prirodnog procesa u kojem stara matica sa dijelom pčela napušta košnicu u potrazi za novim domom, ostavljajući preostaloj zajednici da odgaji novu maticu. Rojenje je za pčele potpuno prirodno, ali za pčelara znači gubitak pola zajednice i, posljedično, manji prinos meda te sezone. Zato se u ovom periodu pažljivo dodaju nadgradnje (nastavci) kako bi zajednica imala dovoljno prostora za širenje, a po potrebi se jače zajednice i vještački dijele kako bi se rojenje spriječilo prije nego što do njega dođe."
        },
        {
          "t": "h2",
          "text": "Zaključak"
        },
        {
          "t": "p",
          "text": "Proljeće u pčelinjaku nije samo lijep prizor pčela koje se vraćaju na cvijeće — to je najosjetljiviji i najzahtjevniji period cijele sezone, u kojem se odlučuje koliko će zajednica biti jaka kad stigne prava paša. Sve što pčelar uradi ili propusti u ovim sedmicama direktno se odražava na med koji ćemo tačiti mjesecima kasnije."
        }
      ],
      "en": [
        {
          "t": "p",
          "text": "All winter, a bee colony lives clustered tightly inside the hive, keeping each other warm and living off the honey stores gathered the season before. They don't leave the hive at all for months at a time — which also means they hold their waste for days, sometimes weeks. That's why the first warm day of the year, usually once the temperature climbs past ten degrees or so, is the moment every beekeeper waits for: the bees finally fly out on what's called a cleansing flight, a short trip made purely to relieve themselves before returning to the hive."
        },
        {
          "t": "p",
          "text": "For a beekeeper, that first flight is also the first visual sign that the colony has made it through winter."
        },
        {
          "t": "h2",
          "text": "The first inspection"
        },
        {
          "t": "p",
          "text": "As soon as the weather allows calm access to the hives, the first detailed inspection follows. The goal isn't only to confirm the queen is alive — it's often easier and more reliable to look for freshly laid eggs and larvae, since that confirms the queen is functioning without needing to physically find her and unnecessarily disturb the colony. Beyond that, the beekeeper assesses food stores, overall colony strength and numbers, and clears the hive floor of bees that died over winter."
        },
        {
          "t": "p",
          "text": "This inspection carries a less obvious risk too: many colonies don't die from cold itself, but because they burn through their winter stores before the spring nectar flow truly begins. That stretch — when the colony is already active and consuming more food, but there isn't yet enough in bloom outside — is one of the most fragile moments in the entire beekeeping year."
        },
        {
          "t": "h2",
          "text": "Feeding when it's needed"
        },
        {
          "t": "p",
          "text": "If the inspection shows stores are running low, the beekeeper adds supplemental feed — usually sugar syrup or a thick fondant — to help the colony bridge the gap until a proper nectar flow starts. This isn't a replacement for honey, just temporary support until nature takes over."
        },
        {
          "t": "h2",
          "text": "The first forage around Mračaj"
        },
        {
          "t": "p",
          "text": "The earliest sources of nectar and pollen in spring usually aren't acacia or linden, which bloom much later. Instead, bees first rely on early bloomers: willow and hazel catkins, wild dandelion, and blossoms on fruit trees in the surrounding gardens and orchards. These early pollen sources matter because they supply the protein the colony needs to raise new brood, while the real honey surplus is still weeks away."
        },
        {
          "t": "h2",
          "text": "Managing swarming"
        },
        {
          "t": "p",
          "text": "As the colony expands rapidly through spring, so does the risk of swarming — the natural process in which the old queen leaves the hive with part of the colony in search of a new home, leaving the rest to raise a new queen. Swarming is entirely natural for bees, but for a beekeeper it means losing half the colony and, as a result, a smaller honey yield that season. That's why supers are added carefully during this period to give the colony room to expand, and stronger colonies are sometimes split artificially to prevent swarming before it happens."
        },
        {
          "t": "h2",
          "text": "Conclusion"
        },
        {
          "t": "p",
          "text": "Spring in the apiary isn't just the pleasant sight of bees returning to flowers — it's the most fragile and demanding stretch of the whole season, the one that decides how strong the colony will be once the real forage arrives. Whatever the beekeeper gets right or misses in these weeks shows up directly in the honey we'll be jarring months later."
        }
      ]
    }
  },
  {
    "slug": "benefiti-propolisa",
    "order": 2,
    "image": "/images/real/otklapanje-rama.webp",
    "title": {
      "sr": "Benefiti propolisa",
      "en": "The benefits of propolis"
    },
    "excerpt": {
      "sr": "Pčele ga zovu \"pčelinji kit\" i njime brane cijelu košnicu. Šta propolis zapravo jeste, otkud njegova reputacija i kako se koristi van košnice.",
      "en": "Bees call it hive glue and use it to defend the entire colony. What propolis actually is, where its reputation comes from, and how it is used outside the hive."
    },
    "date": {
      "sr": "8. april 2026.",
      "en": "April 8, 2026"
    },
    "readingTime": {
      "sr": "5 min čitanja",
      "en": "5 min read"
    },
    "body": {
      "sr": [
        {
          "t": "p",
          "text": "Propolis je jedan od najmanje poznatih pčelinjih proizvoda, iako ga svaka košnica proizvodi u nekoj količini. Pčele ga prave miješajući smolu koju sakupljaju sa pupoljaka i kore drveća sa voskom i sopstvenim enzimima, i koriste ga kao građevinski i zaštitni materijal — otuda i narodni naziv \"pčelinji kit\"."
        },
        {
          "t": "h2",
          "text": "Čemu propolis služi u košnici"
        },
        {
          "t": "p",
          "text": "Unutar košnice, propolis ima gotovo isključivo odbrambenu i strukturnu ulogu. Pčele njime zatvaraju pukotine i proreze kroz koje bi mogao ući hladan vazduh ili štetočine, ojačavaju saće i prevlače unutrašnje površine tankim slojem koji djeluje kao prirodna barijera protiv bakterija i gljivica. Jedan od najpoznatijih primjera te \"sanitarne\" upotrebe jeste to što pčele, kada u košnicu uđe uljez prevelik da bi ga iznijele napolje — najčešće glodar — nemaju način da ga uklone, pa ga umjesto toga potpuno oblože propolisom. Na taj način sprječavaju raspadanje i širenje patogena unutar košnice, praktično ga \"balsamujući\"."
        },
        {
          "t": "h2",
          "text": "Šta propolis sadrži"
        },
        {
          "t": "p",
          "text": "Sastav propolisa nikad nije potpuno identičan od regiona do regiona, jer direktno zavisi od biljaka sa kojih pčele sakupljaju smolu. U umjerenom klimatskom pojasu, kakav imamo i u Bosni, dominira takozvani \"topolin\" tip propolisa, bogat flavonoidima i fenolnim kiselinama. Istraživanja tokom decenija identifikovala su u propolisu i preko tri stotine različitih jedinjenja, mada se tačan broj i omjeri razlikuju iz uzorka u uzorak."
        },
        {
          "t": "p",
          "text": "Zbog te prirodne varijabilnosti, propolis nikad nije potpuno standardizovana sirovina — svaka serija nosi pomalo drugačiji \"potpis\" flore iz koje potiče."
        },
        {
          "t": "h2",
          "text": "Tradicionalna i savremena upotreba"
        },
        {
          "t": "p",
          "text": "Upotreba propolisa u narodnoj medicini stara je vjekovima — pominju ga još antički izvori, uključujući spise pripisane Hipokratu, u kontekstu njege rana i grla. Danas se propolis najčešće koristi u obliku alkoholne tinkture, spreja za grlo, pastila ili kapi, a mnogi ga tradicionalno posežu kao podršku organizmu tokom hladnijih mjeseci."
        },
        {
          "t": "p",
          "text": "Važno je naglasiti da propolis nije lijek niti zamjena za medicinsku terapiju — proizvodi na bazi propolisa se koriste kao dodatak ishrani, a ne kao tretman bolesti. Osobe sklone alergijama na pčelinje proizvode (uključujući polen i matičnu mliječ) trebalo bi da budu oprezne i, po potrebi, prvo se konsultuju sa ljekarom prije redovne upotrebe."
        },
        {
          "t": "h2",
          "text": "Kako se propolis sakuplja"
        },
        {
          "t": "p",
          "text": "Pčelari propolis sakupljaju struganjem sa ramova i unutrašnjih zidova košnice, ili postavljanjem posebnih mrežica koje pčele same ispune propolisom, nakon čega se mrežica jednostavno ohladi i propolis se odlijepi u komadima. Prinos po košnici je skroman — najčešće svega stotinjak grama godišnje, zavisno od soja pčela i sezone — što objašnjava zašto je čist propolis uvijek nešto skuplji od meda: količina koju jedna zajednica pčela može da \"priušti\" bez štete po samu košnicu je ograničena."
        },
        {
          "t": "h2",
          "text": "Zaključak"
        },
        {
          "t": "p",
          "text": "Propolis je proizvod nastao iz nužde same pčelinje zajednice — njihove potrebe da zaštite svoj dom od infekcije i raspadanja. Ta ista svojstva su vjekovima privlačila ljude da ga koriste van košnice, a savremena istraživanja tek postepeno rasvjetljavaju zašto. Kao i kod meda, porijeklo i čistoća su ono što najviše određuje kvalitet — propolis bez dodataka, sakupljen iz poznatih košnica, ostaje najpouzdaniji izbor."
        }
      ],
      "en": [
        {
          "t": "p",
          "text": "Propolis is one of the least understood bee products, even though every colony produces some amount of it. Bees make it by mixing resin they collect from tree buds and bark with wax and their own enzymes, then use it as both a building material and a protective coating — hence the common name \"bee glue.\""
        },
        {
          "t": "h2",
          "text": "What propolis does inside the hive"
        },
        {
          "t": "p",
          "text": "Inside the colony, propolis serves an almost entirely defensive and structural role. Bees use it to seal cracks and gaps that could let in cold air or pests, to reinforce the comb, and to coat interior surfaces with a thin layer that acts as a natural barrier against bacteria and fungi. One of the best-known examples of this \"sanitary\" use is what happens when an intruder too large to remove — most often a rodent — gets into the hive and dies there: unable to carry it out, the bees instead encase it completely in propolis. This prevents decay and the spread of pathogens inside the colony, effectively mummifying it."
        },
        {
          "t": "h2",
          "text": "What propolis contains"
        },
        {
          "t": "p",
          "text": "Propolis composition is never quite identical from one region to the next, because it depends directly on which plants the bees draw resin from. In temperate climates like ours in Bosnia, the dominant type is so-called \"poplar\" propolis, rich in flavonoids and phenolic acids. Decades of research have identified more than three hundred distinct compounds in propolis overall, though the exact count and ratios vary from sample to sample."
        },
        {
          "t": "p",
          "text": "Because of this natural variability, propolis is never a fully standardized raw material — every batch carries a slightly different signature of the flora it came from."
        },
        {
          "t": "h2",
          "text": "Traditional and modern use"
        },
        {
          "t": "p",
          "text": "Propolis has a documented history in folk medicine stretching back centuries — ancient sources, including texts attributed to Hippocrates, reference it in the context of wound and throat care. Today it is most commonly used as an alcohol tincture, a throat spray, lozenges, or drops, and many people traditionally reach for it during the colder months."
        },
        {
          "t": "p",
          "text": "It's worth being clear that propolis is not a medicine or a substitute for medical treatment — propolis-based products are used as a dietary supplement, not a disease treatment. People prone to allergies to bee products (including pollen and royal jelly) should be cautious and, if needed, speak with a doctor before regular use."
        },
        {
          "t": "h2",
          "text": "How propolis is harvested"
        },
        {
          "t": "p",
          "text": "Beekeepers collect propolis by scraping it off frames and the inner walls of the hive, or by placing special mesh screens that bees fill with propolis on their own; the screen is then chilled and the propolis simply peels off in pieces. Yield per hive is modest — typically only around a hundred grams a year, depending on the bee strain and the season — which explains why pure propolis tends to cost more than honey: the amount a single colony can \"spare\" without harming itself is limited."
        },
        {
          "t": "h2",
          "text": "Conclusion"
        },
        {
          "t": "p",
          "text": "Propolis exists because of the bee colony's own need to protect its home from infection and decay. Those same properties have drawn people to use it outside the hive for centuries, and modern research is only gradually explaining why. As with honey, origin and purity are what determine quality most — propolis with nothing added, collected from known hives, remains the most reliable choice."
        }
      ]
    }
  },
  {
    "slug": "kako-prepoznati-pravi-domaci-med",
    "order": 3,
    "image": "/images/real/kante-med.webp",
    "title": {
      "sr": "Kako prepoznati pravi domaći med",
      "en": "How to recognize real, raw honey"
    },
    "excerpt": {
      "sr": "Kristalizacija, gustina, miris i deklaracija govore više o kvalitetu meda nego bilo koji kuhinjski trik. Evo na šta zaista treba obratiti pažnju.",
      "en": "Crystallization, thickness, aroma, and the label say more about honey quality than any kitchen trick. Here is what actually matters."
    },
    "date": {
      "sr": "15. mart 2026.",
      "en": "March 15, 2026"
    },
    "readingTime": {
      "sr": "6 min čitanja",
      "en": "6 min read"
    },
    "body": {
      "sr": [
        {
          "t": "p",
          "text": "Svake godine police prodavnica preplave \"medovi\" čije porijeklo teško da neko može provjeriti. Izvještaji o falsifikovanju meda — najčešće razblaživanjem jeftinim šećernim sirupima — redovno se pojavljuju i u evropskim i u svjetskim medijima, pa ne čudi što sve više kupaca postavlja pitanje: kako uopšte znati da je med u tegli pravi?"
        },
        {
          "t": "p",
          "text": "Odgovor nije jedan jednostavan trik, nego nekoliko stvari koje, posmatrane zajedno, daju mnogo jasniju sliku."
        },
        {
          "t": "h2",
          "text": "Kristalizacija nije mana, nego dokaz"
        },
        {
          "t": "p",
          "text": "Najveći nesporazum kod kupaca je da kristalisan med \"nije dobar\" ili da je \"star\". Zapravo je obrnuto — kristalizacija je prirodan proces koji potvrđuje da je med sirov i neobrađen na visokim temperaturama. Med je prezasićen rastvor šećera (uglavnom fruktoze i glukoze), pa se glukoza vremenom izdvaja u kristale, posebno na nižim temperaturama."
        },
        {
          "t": "p",
          "text": "Brzina kristalizacije zavisi od odnosa fruktoze i glukoze, a taj odnos određuje biljka sa koje su pčele sakupljale nektar. Bagremov med, na primjer, ima izrazito visok udio fruktoze u odnosu na glukozu, pa ostaje tečan mjesecima, ponekad i duže od godinu dana. Livadski i drugi polifloralni medovi obično kristališu brže, nekad već za nekoliko sedmica od vrcanja. Nijedna od te dvije pojave nije znak lošijeg kvaliteta — samo govori o botaničkom porijeklu meda."
        },
        {
          "t": "p",
          "text": "Med koji nikad ne kristališe, čak ni nakon dužeg stajanja na hladnijem mjestu, prije zaslužuje pitanje nego onaj koji to učini."
        },
        {
          "t": "h2",
          "text": "Gustina, tekstura i miris"
        },
        {
          "t": "p",
          "text": "Pravi med je gust i viskozan — kada ga zagrabite kašikom, polako i u niti curi nazad u teglu, ne prska niti se ponaša kao sirup. Ovo je posljedica niskog sadržaja vode (obično oko 17-18%), koji ujedno objašnjava zašto se med, ako je pravilno vrcan i skladišten, ne kvari i ne fermentiše."
        },
        {
          "t": "p",
          "text": "Miris i ukus takođe nose informaciju. Sirovi med ima kompleksan, slojevit ukus koji varira od serije do serije — cvjetne, ponekad blago voćne ili smolaste note, zavisno od paše. Med koji uvijek ima potpuno isti, ravan i neutralan ukus, bez obzira na sezonu ili seriju, često je više prerađen nego što deklaracija sugeriše."
        },
        {
          "t": "h2",
          "text": "Test sa vodom nije pouzdan"
        },
        {
          "t": "p",
          "text": "Na internetu kruži popularan \"test\": kap meda se ubaci u čašu vode, pa se prati da li tone u komadu (navodno pravi med) ili se odmah rastvara (navodno falsifikat). Ovaj test zvuči logično, ali prehrambeni stručnjaci ga smatraju nepouzdanim — na ponašanje kapi utiču temperatura, gustina i način ubacivanja, pa isti med može dati različit rezultat iz jedne u drugu probu. Kućni testovi ovog tipa mogu biti zabavni, ali ne bi trebalo da budu jedini kriterijum kojim se neko vodi."
        },
        {
          "t": "h2",
          "text": "Deklaracija i porijeklo govore najviše"
        },
        {
          "t": "p",
          "text": "Od 2024. godine nova evropska pravila zahtijevaju da mješani medovi na deklaraciji navedu procentualno učešće zemalja porijekla, upravo zbog rasprostranjenog problema netransparentnih mješavina. Kupac koji čita deklaraciju i traži jasno naveden izvor — po mogućnosti ime i lokaciju pčelara, a ne samo \"proizvod više zemalja EU i van EU\" — značajno smanjuje rizik da kupi razblažen proizvod."
        },
        {
          "t": "p",
          "text": "Najsigurniji put i dalje ostaje kupovina direktno od pčelara kojeg poznajete ili čije poslovanje možete provjeriti — gdje se med vrca, filtrira i puni bez ikakvih dodataka, a svaka tegla nosi trag konkretne paše i sezone, a ne anonimne mješavine."
        },
        {
          "t": "h2",
          "text": "Zaključak"
        },
        {
          "t": "p",
          "text": "Pravi med se ne prepoznaje po jednom \"definitivnom\" znaku, nego po skladu više malih detalja: kristalizaciji koja dolazi i odlazi zavisno od vrste, gustini koja se osjeti na kašici, mirisu koji se mijenja iz serije u seriju i deklaraciji koja ne krije porijeklo. Kad sve to poklopi, med najvjerovatnije zaslužuje povjerenje koje mu dajete."
        }
      ],
      "en": [
        {
          "t": "p",
          "text": "Every year, store shelves fill up with \"honey\" whose origin is nearly impossible to verify. Reports of honey fraud — most often dilution with cheap sugar syrups — turn up regularly in both European and global media, so it is no surprise that more shoppers are asking a simple question: how do you actually know the jar in front of you is real?"
        },
        {
          "t": "p",
          "text": "There is no single definitive trick. Instead, there are a handful of things that, looked at together, give a much clearer picture."
        },
        {
          "t": "h2",
          "text": "Crystallization is proof, not a flaw"
        },
        {
          "t": "p",
          "text": "The most common misunderstanding among buyers is that crystallized honey \"has gone bad\" or is \"old.\" The opposite is closer to the truth — crystallization is a natural process that confirms honey is raw and hasn't been processed at high temperatures. Honey is a supersaturated sugar solution (mostly fructose and glucose), so over time glucose separates out into crystals, especially at cooler temperatures."
        },
        {
          "t": "p",
          "text": "How fast this happens depends on the ratio of fructose to glucose, and that ratio is determined by the plants the bees foraged on. Acacia honey, for example, has an unusually high fructose-to-glucose ratio, so it stays liquid for months, sometimes over a year. Meadow honey and other multi-floral blends typically crystallize faster, sometimes within weeks of extraction. Neither behavior is a sign of lower quality — it simply reflects the honey's botanical origin."
        },
        {
          "t": "p",
          "text": "Honey that never crystallizes, even after sitting somewhere cool for a long stretch, deserves more scrutiny than honey that does."
        },
        {
          "t": "h2",
          "text": "Thickness, texture, and aroma"
        },
        {
          "t": "p",
          "text": "Real honey is thick and viscous — scoop it with a spoon and it slowly ribbons back into the jar rather than splashing or behaving like syrup. This comes from its low water content (typically around 17-18%), which is also why properly extracted and stored honey doesn't spoil or ferment."
        },
        {
          "t": "p",
          "text": "Smell and taste carry information too. Raw honey has a complex, layered flavor that shifts from batch to batch — floral notes, sometimes fruity or resinous undertones, depending on the forage. Honey that tastes exactly the same, flat and neutral, regardless of season or batch, is often more processed than the label suggests."
        },
        {
          "t": "h2",
          "text": "The water-glass test isn't reliable"
        },
        {
          "t": "p",
          "text": "A popular \"test\" circulates online: drop a bit of honey into a glass of water and watch whether it sinks in one piece (supposedly real honey) or dissolves immediately (supposedly fake). It sounds logical, but food scientists consider it unreliable — temperature, viscosity, and how the drop is added all affect the result, so the same honey can behave differently from one try to the next. Home tests like this can be a fun experiment, but they shouldn't be anyone's only criterion."
        },
        {
          "t": "h2",
          "text": "Labels and origin tell you the most"
        },
        {
          "t": "p",
          "text": "Since 2024, new EU rules require blended honeys to list the percentage share of each country of origin on the label, precisely because of how widespread untransparent blending had become. A buyer who reads the label and looks for a clearly stated source — ideally a beekeeper's name and location, not just \"blend of EU and non-EU honeys\" — significantly lowers the risk of buying a diluted product."
        },
        {
          "t": "p",
          "text": "The safest route remains buying directly from a beekeeper you know or whose operation you can verify — honey extracted, filtered, and jarred with nothing added, where every jar carries the trace of a specific forage and season instead of an anonymous blend."
        },
        {
          "t": "h2",
          "text": "Conclusion"
        },
        {
          "t": "p",
          "text": "Real honey isn't identified by one \"definitive\" sign, but by how several small details line up: crystallization that comes and goes depending on the variety, a thickness you can feel on the spoon, an aroma that shifts from batch to batch, and a label that doesn't hide its origin. When all of that lines up, the honey most likely deserves the trust you're placing in it."
        }
      ]
    }
  }
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
