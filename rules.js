/* Calculs de création. Les plafonds d'expérience sont ceux de la création. */
const SDA = (function () {
  const COMMON_COST = { 0: 1, 1: 2, 2: 3, 3: 5 };
  const COMBAT_COST = { 0: 2, 1: 4, 2: 6 };
  const COMMON_CAP = 4;
  const COMBAT_CAP = 3;
  const POINTS = 10;

  function culture(state) {
    return DATA.cultures.find(function (c) { return c.id === state.cultureId; }) || null;
  }

  function skillById(id) {
    return DATA.skills.find(function (s) { return s.id === id; }) || DATA.combat.find(function (s) { return s.id === id; }) || null;
  }

  function isCombat(id) {
    return DATA.combat.some(function (s) { return s.id === id; });
  }

  function attributes(state) {
    const c = culture(state);
    if (!c || !state.attrPick) return null;
    const row = c.sets[state.attrPick - 1];
    if (!row) return null;
    const bonus = c.bonusAttr && state.bonusAttr ? state.bonusAttr : "";
    return {
      corps: row[0] + (bonus === "corps" ? 1 : 0),
      coeur: row[1] + (bonus === "coeur" ? 1 : 0),
      esprit: row[2] + (bonus === "esprit" ? 1 : 0)
    };
  }

  function sr(state, attrId) {
    const a = attributes(state);
    if (!a) return null;
    let n = 20 - a[attrId];
    if (state.virtueId === "mastery-attr" && state.virtueAttr === attrId) n -= 1;
    return n;
  }

  function baseRank(state, id) {
    const c = culture(state);
    if (!c) return 0;
    if (isCombat(id)) {
      if (id === state.combatPrimary) return 2;
      if (id === state.combatSecondary) return 1;
      return 0;
    }
    return c.ranks[id] || 0;
  }

  function extra(state, id) {
    return Math.max(0, state.extra[id] || 0);
  }

  function rank(state, id) {
    return baseRank(state, id) + extra(state, id);
  }

  function cap(id) {
    return isCombat(id) ? COMBAT_CAP : COMMON_CAP;
  }

  function raiseCost(id, fromRank) {
    const table = isCombat(id) ? COMBAT_COST : COMMON_COST;
    return Object.prototype.hasOwnProperty.call(table, fromRank) ? table[fromRank] : null;
  }

  function spentOn(state, id) {
    const start = baseRank(state, id);
    const end = rank(state, id);
    let total = 0;
    for (let r = start; r < end; r++) {
      const cost = raiseCost(id, r);
      if (cost == null) return total;
      total += cost;
    }
    return total;
  }

  function pointsSpent(state) {
    const ids = DATA.skills.map(function (s) { return s.id; }).concat(DATA.combat.map(function (s) { return s.id; }));
    return ids.reduce(function (sum, id) { return sum + spentOn(state, id); }, 0);
  }

  function pointsLeft(state) {
    return POINTS - pointsSpent(state);
  }

  function calling(state) {
    return DATA.callings.find(function (c) { return c.id === state.callingId; }) || null;
  }

  function favouredList(state) {
    const list = [];
    if (state.favCulture) list.push(state.favCulture);
    (state.callingFav || []).forEach(function (id) { if (id && list.indexOf(id) < 0) list.push(id); });
    if (state.virtueId === "mastery") {
      (state.virtueFav || []).forEach(function (id) { if (id && list.indexOf(id) < 0) list.push(id); });
    }
    return list;
  }

  function isFavoured(state, id) {
    return favouredList(state).indexOf(id) >= 0;
  }

  function derived(state) {
    const c = culture(state);
    const a = attributes(state);
    if (!c || !a) return null;
    const endurance = a.corps + c.end + (state.virtueId === "tough" ? 2 : 0);
    const hope = a.coeur + c.hope + (state.virtueId === "confidence" ? 2 : 0);
    const parry = a.esprit + c.parry + (state.virtueId === "nimble" ? 1 : 0);
    return { endurance: endurance, hope: hope, parry: parry, shadow: 0, valour: 1, wisdom: 1 };
  }

  function stdValue(state) {
    const c = culture(state);
    return c ? DATA.stdRank[c.std] : 0;
  }

  function legalWeapons(state, skillId) {
    const c = culture(state);
    return DATA.weapons.filter(function (w) {
      if (w.skill !== skillId) return false;
      if (c && c.id === "hobbits" && DATA.hobbitWeapons.indexOf(w.id) < 0) return false;
      if (c && c.id === "nains" && DATA.dwarfBan.indexOf(w.id) >= 0) return false;
      return true;
    });
  }

  function legalArmours(state) {
    const std = stdValue(state);
    return DATA.armours.filter(function (a) { return a.min <= std; });
  }

  function legalShields(state) {
    const c = culture(state);
    const std = stdValue(state);
    return DATA.shields.filter(function (s) {
      if (s.min > std) return false;
      if (s.id === "greatshield" && c && DATA.noGreatShield.indexOf(c.id) >= 0) return false;
      return true;
    });
  }

  function weaponById(id) {
    return DATA.weapons.find(function (w) { return w.id === id; }) || null;
  }

  function combatSkillsWithRank(state) {
    return DATA.combat.filter(function (s) { return rank(state, s.id) > 0; });
  }

  function pieceLoad(state, kind, id) {
    let load = 0;
    if (kind === "armour") {
      const a = DATA.armours.find(function (x) { return x.id === id; });
      load = a ? a.load : 0;
    } else if (kind === "helm") {
      load = DATA.helm.load;
    } else if (kind === "shield") {
      const s = DATA.shields.find(function (x) { return x.id === id; });
      load = s ? s.load : 0;
    }
    if (state.rewardId === "cunning" && state.rewardTarget === kind) load = Math.max(0, load - 2);
    return load;
  }

  function loadout(state) {
    const c = culture(state);
    const d = derived(state);
    const weapons = combatSkillsWithRank(state).map(function (s) {
      const w = weaponById(state.weapons[s.id]);
      if (!w) return null;
      let dmg = w.dmg;
      let injury = w.injury;
      const notes = [];
      if (w.note) notes.push(w.note);
      if (state.rewardId === "fell" && state.rewardTarget === w.id) dmg += 1;
      if (state.rewardId === "grievous" && state.rewardTarget === w.id) {
        if (typeof injury === "number") injury += 2;
        else injury = injury.split("/").map(function (n) { return String(Number(n) + 2); }).join("/");
      }
      if (state.rewardId === "keen" && state.rewardTarget === w.id) notes.push("Coup perforant sur 9+");
      return { skill: s.name, skillId: s.id, name: w.name, id: w.id, dmg: dmg, injury: injury, load: w.load, notes: notes.join(". ") };
    }).filter(Boolean);

    const armour = DATA.armours.find(function (a) { return a.id === state.armourId; }) || null;
    const shield = DATA.shields.find(function (s) { return s.id === state.shieldId; }) || null;
    let armourLoad = armour ? pieceLoad(state, "armour", armour.id) : 0;
    let helmLoad = pieceLoad(state, "helm", "helm");
    let shieldLoad = shield ? pieceLoad(state, "shield", shield.id) : 0;
    if (c && c.id === "nains") {
      armourLoad = Math.ceil((armourLoad + helmLoad) / 2);
      helmLoad = 0;
    }
    const weaponLoad = weapons.reduce(function (sum, w) { return sum + w.load; }, 0);
    const total = weaponLoad + armourLoad + helmLoad + shieldLoad;
    let parryMod = shield ? shield.parry : 0;
    if (state.rewardId === "reinforced" && shield) parryMod += 1;
    const protNotes = [];
    if (state.rewardId === "close" && (state.rewardTarget === "armour" || state.rewardTarget === "helm")) {
      protNotes.push(state.rewardTarget === "helm" ? "Casque ajusté : +2 en protection" : "Armure ajustée : +2 en protection");
    }
    return {
      weapons: weapons,
      armour: armour,
      shield: shield,
      helm: DATA.helm,
      armourLoad: c && c.id === "nains" ? armourLoad : armourLoad,
      helmLoad: c && c.id === "nains" ? 0 : helmLoad,
      shieldLoad: shieldLoad,
      total: total,
      parryMod: parryMod,
      parry: d ? d.parry + parryMod : null,
      weary: d ? total : null,
      protNotes: protNotes,
      dwarfArmour: !!(c && c.id === "nains")
    };
  }

  function fellowship(state) {
    const c = culture(state);
    const patron = DATA.patrons.find(function (p) { return p.id === state.patronId; });
    const heroes = Math.max(0, Number(state.heroes) || 0);
    const bree = (c && c.id === "bree" ? 1 : 0) + Math.max(0, Number(state.extraBree) || 0);
    const bonus = patron ? patron.bonus : 0;
    return { heroes: heroes, bree: bree, patron: bonus, total: heroes + bree + bonus };
  }

  function features(state) {
    const call = calling(state);
    const list = (state.features || []).slice();
    if (call) {
      if (call.id === "champion" && state.enemy) list.push(call.feature + " (" + state.enemy + ")");
      else list.push(call.feature);
    }
    return list;
  }

  function issues(state) {
    const out = [];
    const c = culture(state);
    if (!c) out.push("Choisissez une culture.");
    if (!String(state.name || "").trim()) out.push("Indiquez un nom.");
    if (c && (c.id === "hobbits" || c.id === "bree") && !String(state.family || "").trim()) out.push("Indiquez un nom de famille.");
    if (!state.age) out.push("Indiquez l'âge.");
    if (!attributes(state)) out.push("Choisissez un set d'attributs, ou lancez le dé de Maîtrise.");
    if (c && c.bonusAttr && !state.bonusAttr) out.push("Les Rôdeurs ajoutent 1 à un attribut : choisissez lequel.");
    if (c && !state.favCulture) out.push("Choisissez la compétence favorite de la culture.");
    if (c && state.favCulture && c.fav.indexOf(state.favCulture) < 0) out.push("La compétence favorite doit être l'une des deux proposées par la culture.");
    if (!state.combatPrimary) out.push("Choisissez la compétence de combat au rang 2.");
    if (!state.combatSecondary) out.push("Choisissez la seconde compétence de combat, au rang 1.");
    if (state.combatPrimary && state.combatSecondary && state.combatPrimary === state.combatSecondary) out.push("Les deux compétences de combat doivent être différentes.");
    if ((state.features || []).length !== 2) out.push("Choisissez deux particularités de culture.");
    if (!calling(state)) out.push("Choisissez une vocation.");
    if (calling(state) && (state.callingFav || []).filter(Boolean).length !== 2) out.push("Choisissez deux compétences favorites de vocation.");
    if (calling(state) && state.callingId === "champion" && !state.enemy) out.push("Le Champion choisit un type d'ennemis.");
    if (pointsSpent(state) > POINTS) out.push("L'expérience dépasse les 10 points.");
    combatSkillsWithRank(state).forEach(function (s) {
      const w = weaponById(state.weapons[s.id]);
      if (!w) out.push("Choisissez une arme pour " + s.name + ".");
      else if (legalWeapons(state, s.id).every(function (x) { return x.id !== w.id; })) out.push(w.name + " n'est pas disponible pour cette culture.");
    });
    if (!state.armourId) out.push("Choisissez une armure.");
    if (!state.shieldId) out.push("Choisissez un bouclier.");
    if (!state.rewardId) out.push("Choisissez une récompense de départ.");
    if (!state.virtueId) out.push("Choisissez une vertu de départ.");
    if (state.rewardId === "keen" || state.rewardId === "fell" || state.rewardId === "grievous") {
      if (!state.rewardTarget) out.push("Indiquez l'arme concernée par la récompense.");
    }
    if (state.rewardId === "close" || state.rewardId === "cunning") {
      if (!state.rewardTarget) out.push("Indiquez la pièce d'équipement concernée par la récompense.");
    }
    if (state.virtueId === "mastery-attr" && !state.virtueAttr) out.push("Habileté : choisissez l'attribut dont le seuil baisse.");
    if (state.virtueId === "mastery" && (state.virtueFav || []).filter(Boolean).length !== 2) out.push("Maîtrise : choisissez deux compétences communes de plus.");
    if (state.virtueId === "mastery") {
      const seen = {};
      (state.virtueFav || []).forEach(function (id) { if (id) seen[id] = (seen[id] || 0) + 1; });
      Object.keys(seen).forEach(function (id) {
        if (seen[id] > 1) out.push("Maîtrise : les deux compétences doivent être différentes.");
      });
      (state.virtueFav || []).forEach(function (id) {
        if (id && (state.favCulture === id || (state.callingFav || []).indexOf(id) >= 0)) out.push(skillById(id).name + " est déjà favorite.");
      });
    }
    return out.filter(function (item, i, arr) { return arr.indexOf(item) === i; });
  }

  function displayName(state) {
    const family = String(state.family || "").trim();
    const name = String(state.name || "").trim();
    if (family && name) return name + " " + family;
    return name || family;
  }

  return {
    POINTS: POINTS,
    COMMON_CAP: COMMON_CAP,
    COMBAT_CAP: COMBAT_CAP,
    culture: culture,
    skillById: skillById,
    isCombat: isCombat,
    attributes: attributes,
    sr: sr,
    baseRank: baseRank,
    rank: rank,
    cap: cap,
    raiseCost: raiseCost,
    pointsSpent: pointsSpent,
    pointsLeft: pointsLeft,
    calling: calling,
    favouredList: favouredList,
    isFavoured: isFavoured,
    derived: derived,
    legalWeapons: legalWeapons,
    legalArmours: legalArmours,
    legalShields: legalShields,
    loadout: loadout,
    fellowship: fellowship,
    features: features,
    issues: issues,
    displayName: displayName,
    combatSkillsWithRank: combatSkillsWithRank
  };
})();
