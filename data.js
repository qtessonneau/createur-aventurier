/* Données de création — L'Anneau Unique, 2e édition française.
   Chiffres et listes de jeu. Les textes du livre ne sont pas reproduits. */
const DATA = {
  stdRank: { modeste: 0, courant: 1, prospere: 2 },
  stdName: { modeste: "Modeste", courant: "Courant", prospere: "Prospère" },
  usefulCount: { modeste: 1, courant: 2, prospere: 3 },
  treasure: { modeste: "0", courant: "30", prospere: "90" },
  mount: {
    modeste: "Pas de monture.",
    courant: "Vieux cheval ou poney affamé, vigueur 1.",
    prospere: "Monture décente, vigueur 2."
  },
  attrs: [
    { id: "corps", name: "Corps" },
    { id: "coeur", name: "Cœur" },
    { id: "esprit", name: "Esprit" }
  ],
  skills: [
    { id: "presence", name: "Présence", attr: "corps", group: "Personnalité" },
    { id: "inspiration", name: "Inspiration", attr: "coeur", group: "Personnalité" },
    { id: "persuasion", name: "Persuasion", attr: "esprit", group: "Personnalité" },
    { id: "athletics", name: "Athlétisme", attr: "corps", group: "Déplacement" },
    { id: "travel", name: "Voyage", attr: "coeur", group: "Déplacement" },
    { id: "stealth", name: "Discrétion", attr: "esprit", group: "Déplacement" },
    { id: "awareness", name: "Vigilance", attr: "corps", group: "Perception" },
    { id: "insight", name: "Intuition", attr: "coeur", group: "Perception" },
    { id: "scan", name: "Inspection", attr: "esprit", group: "Perception" },
    { id: "hunting", name: "Chasse", attr: "corps", group: "Survie" },
    { id: "healing", name: "Soins", attr: "coeur", group: "Survie" },
    { id: "explore", name: "Exploration", attr: "esprit", group: "Survie" },
    { id: "song", name: "Chant", attr: "corps", group: "Coutume" },
    { id: "courtesy", name: "Courtoisie", attr: "coeur", group: "Coutume" },
    { id: "riddle", name: "Énigmes", attr: "esprit", group: "Coutume" },
    { id: "craft", name: "Artisanat", attr: "corps", group: "Savoir" },
    { id: "battle", name: "Art de la guerre", attr: "coeur", group: "Savoir" },
    { id: "lore", name: "Connaissances", attr: "esprit", group: "Savoir" }
  ],
  combat: [
    { id: "bows", name: "Arcs" },
    { id: "swords", name: "Épées" },
    { id: "axes", name: "Haches" },
    { id: "spears", name: "Lances" }
  ],
  enemies: ["Araignées", "Hommes malfaisants", "Morts-vivants", "Orques", "Trolls", "Wargs"],
  weapons: [
    { id: "shortsword", name: "Épée courte", skill: "swords", dmg: 3, injury: 16, load: 1, note: "" },
    { id: "sword", name: "Épée", skill: "swords", dmg: 4, injury: 16, load: 2, note: "" },
    { id: "longsword", name: "Épée longue", skill: "swords", dmg: 5, injury: "16/18", load: 3, note: "Une ou deux mains" },
    { id: "shortspear", name: "Lance courte", skill: "spears", dmg: 3, injury: 14, load: 2, note: "Peut être lancée" },
    { id: "spear", name: "Lance", skill: "spears", dmg: 4, injury: "14/16", load: 3, note: "Une ou deux mains, peut être lancée" },
    { id: "greatspear", name: "Grande lance", skill: "spears", dmg: 5, injury: 16, load: 4, note: "Deux mains" },
    { id: "axe", name: "Hache", skill: "axes", dmg: 5, injury: 18, load: 2, note: "" },
    { id: "longaxe", name: "Hache à long manche", skill: "axes", dmg: 6, injury: "18/20", load: 3, note: "Une ou deux mains" },
    { id: "greataxe", name: "Grande hache", skill: "axes", dmg: 7, injury: 20, load: 4, note: "Deux mains" },
    { id: "mattock", name: "Bigot", skill: "axes", dmg: 7, injury: 18, load: 3, note: "Deux mains" },
    { id: "bow", name: "Arc", skill: "bows", dmg: 3, injury: 14, load: 2, note: "À distance" },
    { id: "greatbow", name: "Grand arc", skill: "bows", dmg: 4, injury: 16, load: 4, note: "À distance" }
  ],
  hobbitWeapons: ["shortsword", "shortspear", "spear", "axe", "bow"],
  dwarfBan: ["greatbow", "greatspear"],
  armours: [
    { id: "leather", name: "Chemise de cuir", dice: 1, load: 3, min: 0 },
    { id: "corslet", name: "Corselet à manches longues", dice: 2, load: 6, min: 0 },
    { id: "mail", name: "Chemise de mailles", dice: 3, load: 9, min: 1 },
    { id: "hauberk", name: "Cotte de mailles", dice: 4, load: 12, min: 2 }
  ],
  helm: { id: "helm", name: "Heaume", dice: 1, load: 4 },
  shields: [
    { id: "buckler", name: "Rondache", parry: 1, load: 2, min: 0 },
    { id: "shield", name: "Bouclier", parry: 2, load: 4, min: 1 },
    { id: "greatshield", name: "Grand bouclier", parry: 3, load: 6, min: 2 }
  ],
  noGreatShield: ["hobbits", "nains"],
  rewards: [
    { id: "keen", name: "Acéré", piece: "weapon", text: "L'arme choisie inflige un coup perforant dès que le dé du Destin indique 9 ou plus." },
    { id: "close", name: "Ajusté", piece: "armourhelm", text: "Les jets de protection de l'armure ou du casque choisi gagnent +2." },
    { id: "cunning", name: "Astucieux", piece: "loadpiece", text: "La charge de l'armure, du casque ou du bouclier choisi baisse de 2 (minimum 0)." },
    { id: "fell", name: "Dévastateur", piece: "weapon", text: "L'arme choisie gagne +1 aux dégâts." },
    { id: "grievous", name: "Féroce", piece: "weapon", text: "L'arme choisie gagne +2 à sa valeur de blessure." },
    { id: "reinforced", name: "Renforcé", piece: "shield", text: "Le bouclier gagne +1 à son modificateur de parade." }
  ],
  virtues: [
    { id: "confidence", name: "Assurance", text: "L'Espoir augmente de 2." },
    { id: "mastery-attr", name: "Habileté", text: "Le seuil de réussite d'un attribut au choix baisse de 1." },
    { id: "sure", name: "Main sûre", text: "Lors d'un coup puissant, le Corps compte 1 de plus. Lors d'un coup perforant, le dé du Destin compte 1 de plus." },
    { id: "mastery", name: "Maîtrise", text: "Deux compétences communes supplémentaires deviennent favorites." },
    { id: "tough", name: "Résistance", text: "L'Endurance augmente de 2." },
    { id: "nimble", name: "Vivacité", text: "La Parade augmente de 1." }
  ],
  patrons: [
    { id: "balin", name: "Balin, fils de Fundin", callings: "Capitaine, Champion", bonus: 1, aim: "Reprendre des places fortes et affronter les lieutenants de l'Ennemi.", gift: "Dépenser 1 point de Communauté pour favoriser un jet de combat." },
    { id: "bilbo", name: "Bilbo Sacquet", callings: "Chasseur de trésors, Érudit", bonus: 2, aim: "Retrouver un savoir ou des choses perdues.", gift: "Rendre visite à Bilbo lors de l'entreprise « Rencontrer un garant » augmente la Communauté de 1." },
    { id: "cirdan", name: "Círdan le Charpentier de Nefs", callings: "Érudit, Messager", bonus: 1, aim: "Raviver l'espoir et préserver le savoir des âges précédents.", gift: "Dépenser 1 point de Communauté pour relancer tous les dés d'un jet. Le rencontrer peut offrir une rumeur." },
    { id: "gandalf", name: "Gandalf le Gris", callings: "Capitaine, Messager", bonus: 2, aim: "Prévenir les Peuples Libres et les pousser à agir.", gift: "Dépenser 1 point de Communauté pour favoriser un test d'Ombre." },
    { id: "gilraen", name: "Gilraen, fille de Dírhael", callings: "Champion, Protecteur", bonus: 0, aim: "Lutter contre l'Ennemi et défendre les plus faibles.", gift: "Dans l'ancien Arnor, les événements de voyage se traitent comme en terres frontalières. La rencontrer peut offrir une rumeur." },
    { id: "bombadil", name: "Tom Bombadil et Baie d'Or", callings: "Chasseur de trésors, Protecteur", bonus: 2, aim: "Protéger le pays et ce qui y a été enfoui.", gift: "Dépenser tous les points de Communauté pour demander leur intervention sur les terres de Tom." }
  ],
  callings: [
    { id: "captain", name: "Capitaine", skills: ["battle", "inspiration", "persuasion"], feature: "Commandement", shadow: "Attrait du pouvoir", text: "Vous partez pour guider les autres, parce qu'ils vous font confiance." },
    { id: "champion", name: "Champion", skills: ["athletics", "hunting", "presence"], feature: "Connaissance des ennemis", shadow: "Malédiction de vengeance", text: "Vous partez affronter l'Ombre les armes à la main." },
    { id: "treasure", name: "Chasseur de trésors", skills: ["stealth", "explore", "scan"], feature: "Monte-en-l'air", shadow: "Mal du dragon", text: "Vous partez chercher ce que les siècles ont laissé dans l'ombre." },
    { id: "scholar", name: "Érudit", skills: ["craft", "lore", "riddle"], feature: "Rimes de savoir", shadow: "Attrait des secrets", text: "Vous partez pour que le savoir éclaire la route des autres." },
    { id: "messenger", name: "Messager", skills: ["song", "courtesy", "travel"], feature: "Folklore", shadow: "Folie itinérante", text: "Vous partez porter des nouvelles et relier des peuples trop longtemps séparés." },
    { id: "warden", name: "Protecteur", skills: ["insight", "healing", "awareness"], feature: "Conscience de l'Ombre", shadow: "Voie du désespoir", text: "Vous partez tenir la lisière, pour ceux qui ne peuvent pas se défendre." }
  ],
  cultures: [
    {
      id: "bardides", name: "Bardides", std: "prospere",
      end: 20, hope: 8, parry: 12,
      age: { min: 16, max: 70, hint: "En général entre 18 et 40 ans." },
      sets: [[5, 7, 2], [4, 7, 3], [5, 6, 3], [4, 6, 4], [5, 5, 4], [6, 6, 2]],
      fav: ["inspiration", "athletics"],
      combat: ["bows", "swords"],
      features: ["Beau", "Courageux", "Entêté", "Fier", "Généreux", "Grand", "Impétueux", "Passionné"],
      ranks: { presence: 1, inspiration: 2, persuasion: 3, athletics: 1, travel: 1, stealth: 0, awareness: 0, insight: 2, scan: 1, hunting: 2, healing: 0, explore: 1, song: 1, courtesy: 2, riddle: 0, craft: 1, battle: 2, lore: 1 },
      advantage: "Intrépide", advantageText: "Les tests de Vaillance sont favorisés.",
      names: {
        m: ["Aegir", "Arn", "Brandulf", "Domarr", "Egil", "Erland", "Farald", "Finn", "Gautarr", "Hafgrim", "Hjalmar", "Ingolf", "Jofur", "Kolbeinn", "Leiknir", "Lomund", "Munan", "Nari", "Nefstan", "Ottarr", "Ragnarr", "Reinald", "Sigmarr", "Steinarr", "Thorald", "Torwald", "Ulfarr", "Unnarr", "Vandil", "Varinn"],
        f: ["Aldis", "Asfrid", "Bera", "Bergdis", "Dagmar", "Eilif", "Erna", "Frida", "Geira", "Gudrun", "Halla", "Hild", "Ingirun", "Ingrith", "Lif", "Linhild", "Kelda", "Runa", "Saldis", "Sigga", "Sigrun", "Thora", "Thordis", "Thorhild", "Ulfhild", "Ulfrun", "Una", "Valdis", "Vigdis", "Walda"]
      }
    },
    {
      id: "elfes", name: "Elfes du Lindon", std: "modeste",
      end: 20, hope: 8, parry: 12,
      age: { min: 80, max: 500, hint: "Adulte vers 100 ans. Rarement aventurier au-delà de 300 ans." },
      sets: [[5, 2, 7], [4, 3, 7], [5, 3, 6], [4, 4, 6], [5, 4, 5], [6, 2, 6]],
      fav: ["song", "lore"],
      combat: ["bows", "spears"],
      features: ["Beau", "Circonspect", "Jovial", "Majestueux", "Patient", "Rapide", "Subtil", "Vue perçante"],
      ranks: { presence: 2, inspiration: 1, persuasion: 0, athletics: 2, travel: 0, stealth: 3, awareness: 2, insight: 0, scan: 0, hunting: 0, healing: 1, explore: 0, song: 2, courtesy: 0, riddle: 0, craft: 2, battle: 0, lore: 3 },
      advantage: "Précision elfique", advantageText: "Tant que le héros n'est pas mélancolique, dépenser 1 point d'Espoir accorde une réussite magique sur un jet de compétence. En phase de communauté, la rémission spirituelle ne retire qu'1 point d'Ombre.",
      names: {
        m: ["Amras", "Aredhel", "Beleganor", "Belegon", "Calanhir", "Carmagor", "Dagorhir", "Durandir", "Edrahil", "Ellahir", "Fincalan", "Fuindor", "Galdagor", "Galdor", "Hallas", "Hirimlad", "Ithildir", "Lascalan", "Linaith", "Mablin", "Malanor", "Nauros", "Orgalad", "Pelegorn", "Sargon"],
        f: ["Anórel", "Aranel", "Arbereth", "Baraniel", "Calanril", "Celebrindal", "Celenneth", "Elanor", "Elwing", "Eraniel", "Fimbrethil", "Gloredhel", "Idril", "Irilde", "Laurelin", "Lórwend", "Lothíriel", "Meneloth", "Moriel", "Narieth", "Narniel", "Nimloth", "Nimrodel", "Níniel", "Tarandîs"]
      }
    },
    {
      id: "hobbits", name: "Hobbits de la Comté", std: "courant",
      end: 18, hope: 10, parry: 12,
      age: { min: 18, max: 110, hint: "Souvent à partir de 33 ans. Les plus téméraires partent entre 20 et 33 ans." },
      sets: [[3, 6, 5], [3, 7, 4], [2, 7, 5], [4, 6, 4], [4, 5, 5], [2, 6, 6]],
      fav: ["stealth", "courtesy"],
      combat: ["bows", "swords"],
      features: ["Affable", "Curieux", "Honorable", "Jovial", "Loyal", "Passionné", "Rustre", "Vue perçante"],
      ranks: { presence: 0, inspiration: 0, persuasion: 2, athletics: 0, travel: 0, stealth: 3, awareness: 2, insight: 2, scan: 0, hunting: 0, healing: 1, explore: 0, song: 2, courtesy: 2, riddle: 3, craft: 1, battle: 0, lore: 0 },
      advantage: "Bon sens hobbit", advantageText: "Les tests de Sagesse sont favorisés. Les tests d'Ombre pour résister à la Cupidité gagnent un dé de Maîtrise.",
      restriction: "Armes permises : arc, dague, épée courte, gourdin, hache, lance, lance courte, massue. Pas de grand bouclier.",
      names: {
        m: ["Andwise", "Berilac", "Bungo", "Cottar", "Doderic", "Dudo", "Erling", "Fastred", "Ferumbras", "Foulque", "Gorhendad", "Griffon", "Halfred", "Hamson", "Ilberic", "Isembold", "Isengar", "Longon", "Marmadas", "Marroc", "Mungo", "Odon", "Orgulas", "Othon", "Posco", "Reginard", "Robin", "Rudigar", "Sadoc", "Saradas", "Tobold", "Tolman"],
        f: ["Adaldrida", "Amaranthe", "Asphodèle", "Belba", "Bell", "Berylla", "Camellia", "Daisy", "Églantine", "Estella", "Gilly", "Hanna", "Lily", "Malva", "Marguerite", "May", "Mélilot", "Menegilda", "Menthe", "Mirabelle", "Myrtille", "Perle", "Pivoine", "Pervinca", "Pimprenelle", "Primevère", "Primula", "Prisca", "Rosamunda", "Ruby", "Salvia"],
        family: ["Barbotteux", "Besace", "Bipied", "Bolger", "Bonenfant", "Bophin", "Brandebouc", "Bravet", "Brun", "Bunce", "Chaumine", "Chénier", "Derichebourg", "Fierpied", "Fouille", "Fouine", "Gamegie", "Gardner", "Grogne", "Le Cordier", "Lebrun", "Maggotte", "Petitterrier", "Piedblanc", "Sacquet", "Sanglebuc", "Sonnecor", "Testarude", "Touque", "Touque du Nord"]
      }
    },
    {
      id: "bree", name: "Hommes de Bree", std: "courant",
      end: 20, hope: 10, parry: 10,
      age: { min: 16, max: 70, hint: "Partent jeunes, et se fixent en général avant 40 ans." },
      sets: [[2, 5, 7], [3, 4, 7], [3, 5, 6], [4, 4, 6], [4, 5, 5], [2, 6, 6]],
      fav: ["insight", "riddle"],
      combat: ["axes", "spears"],
      features: ["Affable", "Curieux", "Généreux", "Loyal", "Malin", "Patient", "Rustre", "Sincère"],
      ranks: { presence: 0, inspiration: 2, persuasion: 2, athletics: 1, travel: 1, stealth: 1, awareness: 1, insight: 2, scan: 1, hunting: 1, healing: 0, explore: 1, song: 1, courtesy: 3, riddle: 2, craft: 2, battle: 0, lore: 0 },
      advantage: "Originaire de Bree", advantageText: "Chaque Homme de Bree de la compagnie augmente la Communauté de 1.",
      names: {
        m: ["Alfred", "Artie", "Bill", "Bob", "Carl", "Ed", "Fred", "Giles", "Herb", "Larry", "Nob", "Oswald", "Percy", "Perry", "Sid", "Tom", "Harry"],
        f: ["Daisy", "Emma", "Etta", "Fay", "Fern", "Flora", "Gert", "Holly", "Lily", "Myrtille", "Poppy", "Rose", "Sage", "Tilly", "Violette"],
        family: ["Aballon", "Bellsap", "Brûlemousse", "Buissonrose", "Cerisenée", "Chênedur", "Chesterdur", "Chèvre-Feuille", "Cueillépine", "Doucerave", "Fauconlys", "Fougeron", "Hâblefeu", "Haie-Cerclée", "Lainedechardon", "Larmoise", "Luirenard", "Mèche-Dejonc", "Pied-Bruyère", "Poiredebeurré", "Rétif", "Ruedupollen", "Tranchebruyère", "Ventgardian", "Vertchaudron", "Vivebranche"]
      }
    },
    {
      id: "nains", name: "Nains du Peuple de Durin", std: "prospere",
      end: 22, hope: 8, parry: 10,
      age: { min: 40, max: 200, hint: "En général de 50 à 90 ans." },
      sets: [[7, 2, 5], [7, 3, 4], [6, 3, 5], [6, 4, 4], [5, 4, 5], [6, 2, 6]],
      fav: ["travel", "craft"],
      combat: ["axes", "swords"],
      features: ["Circonspect", "Entêté", "Fier", "Impétueux", "Majestueux", "Malin", "Secret", "Sévère"],
      ranks: { presence: 2, inspiration: 0, persuasion: 0, athletics: 1, travel: 3, stealth: 0, awareness: 0, insight: 0, scan: 3, hunting: 0, healing: 0, explore: 2, song: 1, courtesy: 1, riddle: 2, craft: 2, battle: 1, lore: 1 },
      advantage: "Infatigable", advantageText: "La charge de l'armure, casque inclus et bouclier exclu, est divisée par deux (arrondir au supérieur).",
      restriction: "Pas de grand arc, de grande lance ni de grand bouclier.",
      names: {
        m: ["Ai", "Anar", "Beli", "Bláin", "Borin", "Burin", "Bruni", "Farin", "Flói", "Frár", "Frerin", "Frór", "Ginar", "Gróin", "Grór", "Hanar", "Hepti", "Iari", "Lófar", "Lóni", "Náli", "Nár", "Niping", "Nói", "Núr", "Nýrád", "Ónar", "Póri", "Regin", "Svior", "Veig", "Vidar"],
        f: ["Adís", "Afrid", "Agda", "Bersa", "Birna", "Dagrún", "Dís", "Drífa", "Edda", "Elin", "Fenja", "Frida", "Geira", "Gísla", "Hadda", "Hón", "Ida", "Ilmr", "Jóra", "Kára", "Kóna", "Líf", "Línhild", "Már", "Mist", "Nál", "Oda", "Ósk", "Rán", "Rinda", "Sefa", "Syn", "Tóra", "Trana", "Úlfrún", "Vírún", "Yrr"]
      }
    },
    {
      id: "rodeurs", name: "Rôdeurs du Nord", std: "modeste",
      end: 20, hope: 6, parry: 14,
      age: { min: 16, max: 90, hint: "Vers 20 ans. Ils voyagent rarement loin de l'Eriador après la cinquantaine." },
      sets: [[7, 5, 2], [7, 4, 3], [6, 5, 3], [6, 4, 4], [5, 5, 4], [6, 6, 2]],
      fav: ["hunting", "lore"],
      combat: ["spears", "swords"],
      features: ["Courageux", "Grand", "Honorable", "Rapide", "Secret", "Sévère", "Sincère", "Subtil"],
      ranks: { presence: 1, inspiration: 0, persuasion: 0, athletics: 2, travel: 2, stealth: 2, awareness: 2, insight: 0, scan: 1, hunting: 2, healing: 2, explore: 2, song: 0, courtesy: 0, riddle: 0, craft: 0, battle: 2, lore: 2 },
      advantage: "Rois des Hommes", advantageText: "Ajoutez 1 à un attribut au choix. En phase de communauté, hors Yule, l'Espoir récupéré ne peut pas dépasser la moitié du Cœur (arrondir au supérieur).",
      bonusAttr: true,
      names: {
        m: ["Adrahil", "Amlaith", "Arvegil", "Baranor", "Belecthor", "Bergil", "Celepharn", "Cirion", "Damrod", "Dírhael", "Duinhir", "Egalmoth", "Eradan", "Findemir", "Forlong", "Golasdan", "Hallas", "Hirluin", "Ingold", "Iorlas", "Malvegil", "Ohtar", "Orodreth", "Tarannon", "Targon"],
        f: ["Anwen", "Arbereth", "Berúthiel", "Baraniel", "Calanril", "Celenneth", "Elnîth", "Eraniel", "Finduilas", "Gilraen", "Gilraeth", "Gloredhel", "Idril", "Ioreth", "Ivorwen", "Lórwend", "Lothíriel", "Luindîs", "Meneloth", "Moriel", "Morwen", "Narieth", "Narniel", "Orothêl", "Tarandîs"]
      }
    }
  ]
};
