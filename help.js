/* Aides courtes, rédigées pour cet outil. */
const HELP = {
  attrs: {
    corps: "Force, souffle et prestance. Les compétences de Corps se comparent au seuil 20 moins cette valeur, et l'Endurance en dépend.",
    coeur: "Courage, empathie et fermeté. Les compétences de Cœur s'y comparent, et l'Espoir en dépend.",
    esprit: "Raisonnement, mémoire et vivacité. Les compétences d'Esprit s'y comparent, et la Parade en dépend."
  },
  skills: {
    presence: "S'imposer par l'allure : respect, admiration ou crainte.",
    inspiration: "Rendre du cœur aux autres, en particulier à un groupe.",
    persuasion: "Convaincre par les mots et tenir un argument.",
    athletics: "Courir, sauter, grimper, nager ou forcer un obstacle.",
    travel: "Tenir la route, juger une étape et encaisser le trajet.",
    stealth: "Se déplacer sans se faire voir ni entendre.",
    awareness: "Repérer un bruit, une lueur ou le signe d'une embuscade.",
    insight: "Deviner une intention derrière une attitude.",
    scan: "Examiner un lieu, une trace ou un détail.",
    hunting: "Pister, poser un piège et trouver de quoi manger.",
    healing: "Soigner une blessure, une fatigue ou un mal plus lent.",
    explore: "S'orienter, trouver un passage et choisir un campement.",
    song: "Chanter, réciter, ou porter une nouvelle qui reste en mémoire.",
    courtesy: "Se tenir juste face à un hôte ou à un étranger.",
    riddle: "Dénouer une énigme, un texte obscur ou un sous-entendu.",
    craft: "Réparer, façonner ou travailler une matière de ses mains.",
    battle: "Lire un engagement et mener ceux qui y prennent part.",
    lore: "Se souvenir d'un peuple, d'une région ou d'un fait ancien.",
    bows: "Tirer avec un arc.",
    swords: "Combattre avec une épée.",
    axes: "Combattre avec une hache ou un bigot.",
    spears: "Combattre avec une lance."
  },
  derived: {
    endurance: "Réserve de fatigue et de coups encaissés. On est épuisé quand elle tombe à la charge ou en dessous.",
    hope: "Réserve que l'on dépense pour ajouter un dé de Maîtrise à un jet, ou pour tenir face à l'Ombre.",
    parry: "Difficulté pour vous toucher au corps à corps. Le bouclier s'y ajoute, à part, car il peut être brisé.",
    sr: "Seuil de réussite : 20 moins l'attribut. Le jet (dé du Destin + dés de Maîtrise) doit l'égaler ou le dépasser.",
    favoured: "Compétence favorite : on lance deux dés du Destin et on garde le meilleur.",
    valour: "Mesure des faits d'armes. On commence au rang 1, et ce rang ouvre une récompense.",
    wisdom: "Mesure du jugement. On commence au rang 1, et ce rang ouvre une vertu."
  },
  cultures: {
    bardides: "Hommes du Nord de Dale, marchands et guerriers, connus pour l'épée et l'arc.",
    elfes: "Premiers-Nés des Havres Gris, précis et patients, que la Mer finit par rappeler.",
    hobbits: "Petit peuple de la Comté, attaché au confort et peu à l'aise avec les longues armes.",
    bree: "Villageois du carrefour des routes, ouverts aux nouvelles venues d'ailleurs.",
    nains: "Artisans endurants d'Erebor et des Montagnes Bleues, peu gênés par le poids de l'armure.",
    rodeurs: "Dúnedain qui gardent l'Eriador sans se faire connaître."
  },
  callings: {}
};
DATA.callings.forEach(function (c) { HELP.callings[c.id] = c.text; });
