(function () {
  const STEPS = ["Culture", "Attributs", "Compétences", "Vocation", "Expérience", "Équipement", "Récompense", "Background", "Fiche"];
  const KEY = "sda-draft";
  const TONGUE = {
    bardides: "Langue : le dalien.",
    elfes: "Langues : le sindarin et le commun.",
    hobbits: "Langue : le commun.",
    bree: "Langue : le commun, avec le tour de Bree.",
    nains: "Langue : le commun. Le vrai nom, dans la langue secrète, ne se dit pas aux autres peuples.",
    rodeurs: "Langue : l'ouistrain, le commun. Certains portent un nom sindarin."
  };

  function blank() {
    return {
      v: 1, step: 0, cultureId: "", name: "", family: "", age: "", sex: "",
      attrPick: 0, lastRoll: 0, bonusAttr: "", favCulture: "",
      combatPrimary: "", combatSecondary: "", features: [], callingId: "",
      callingFav: [], enemy: "", extra: {}, rewardId: "", rewardTarget: "",
      virtueId: "", virtueAttr: "", virtueFav: [], weapons: {}, armourId: "",
      shieldId: "", useful: ["", "", ""], usefulSkill: ["", "", ""],
      patronId: "", refuge: "", heroes: "", extraBree: "", attachment: "", notes: "",
      childhood: "", youth: "", road: ""
    };
  }

  let state = blank();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data || data.v !== 1) return;
      state = Object.assign(blank(), data);
    } catch (e) { /* brouillon illisible */ }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* stockage indisponible */ }
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function tip(id, text) {
    if (!text) return esc(id);
    return '<span class="tip" data-tip="' + esc(text) + '">' + esc(id) + "</span>";
  }

  function skillName(id) {
    const s = SDA.skillById(id);
    return s ? s.name : id;
  }

  function clampExtras() {
    const ids = DATA.skills.map(function (s) { return s.id; }).concat(DATA.combat.map(function (s) { return s.id; }));
    ids.forEach(function (id) {
      const room = SDA.cap(id) - SDA.baseRank(state, id);
      const cur = state.extra[id] || 0;
      if (cur > room) {
        if (room > 0) state.extra[id] = room;
        else delete state.extra[id];
      }
    });
    let guard = 0;
    while (SDA.pointsSpent(state) > SDA.POINTS && guard < 40) {
      guard += 1;
      const id = ids.filter(function (key) { return (state.extra[key] || 0) > 0; }).pop();
      if (!id) break;
      state.extra[id] -= 1;
      if (state.extra[id] <= 0) delete state.extra[id];
    }
  }

  function ensureGear() {
    if (!SDA.culture(state)) return;
    SDA.combatSkillsWithRank(state).forEach(function (s) {
      const legal = SDA.legalWeapons(state, s.id);
      if (!legal.some(function (w) { return w.id === state.weapons[s.id]; })) {
        state.weapons[s.id] = legal.length ? legal[0].id : "";
      }
    });
    const arms = SDA.legalArmours(state);
    if (!arms.some(function (a) { return a.id === state.armourId; })) state.armourId = arms.length ? arms[0].id : "";
    const shields = SDA.legalShields(state);
    if (!shields.some(function (s) { return s.id === state.shieldId; })) state.shieldId = shields.length ? shields[0].id : "";
    if (state.rewardId === "keen" || state.rewardId === "fell" || state.rewardId === "grievous") {
      const ids = SDA.combatSkillsWithRank(state).map(function (s) { return state.weapons[s.id]; });
      if (ids.indexOf(state.rewardTarget) < 0) state.rewardTarget = "";
    }
  }

  function setCulture(id) {
    if (state.cultureId === id) return;
    state.cultureId = id;
    state.attrPick = 0;
    state.lastRoll = 0;
    state.bonusAttr = "";
    state.favCulture = "";
    state.combatPrimary = "";
    state.combatSecondary = "";
    state.features = [];
    state.extra = {};
    state.weapons = {};
    state.family = "";
  }

  function toggleList(list, id, max) {
    const arr = list.filter(Boolean);
    const i = arr.indexOf(id);
    if (i >= 0) arr.splice(i, 1);
    else {
      if (arr.length >= max) arr.shift();
      arr.push(id);
    }
    return arr;
  }

  function raise(id, dir) {
    const cur = state.extra[id] || 0;
    if (dir < 0) {
      if (cur <= 0) return;
      state.extra[id] = cur - 1;
      if (state.extra[id] <= 0) delete state.extra[id];
      return;
    }
    const from = SDA.rank(state, id);
    if (from >= SDA.cap(id)) return;
    const cost = SDA.raiseCost(id, from);
    if (cost == null || cost > SDA.pointsLeft(state)) return;
    state.extra[id] = cur + 1;
  }

  function namesFor(c) {
    if (!c) return [];
    const bag = c.names || {};
    if (state.sex === "Femme") return bag.f || [];
    if (state.sex === "Homme") return bag.m || [];
    return (bag.m || []).concat(bag.f || []);
  }

  function options(list, value, placeholder) {
    let html = '<option value="">' + esc(placeholder || "Choisir…") + "</option>";
    list.forEach(function (item) {
      const id = typeof item === "string" ? item : item.id;
      const label = typeof item === "string" ? item : item.name;
      html += '<option value="' + esc(id) + '"' + (id === value ? " selected" : "") + ">" + esc(label) + "</option>";
    });
    return html;
  }

  function pips(n) {
    let html = '<span class="pips">';
    for (let i = 1; i <= 6; i++) html += '<i class="' + (i <= n ? "on" : "") + '"></i>';
    return html + "</span>";
  }

  function injuryText(value) {
    const text = String(value);
    if (text.indexOf("/") < 0) return text;
    const parts = text.split("/");
    return parts[0] + " (1 main) / " + parts[1] + " (2 mains)";
  }

  function stepCulture() {
    const c = SDA.culture(state);
    let html = '<h2>Culture</h2><p class="lead">On commence par le peuple. Le niveau de vie, l\'avantage et les compétences de départ en découlent. Survolez un nom pour une phrase d\'explication.</p><div class="choices">';
    DATA.cultures.forEach(function (item) {
      html += '<button type="button" class="' + (item.id === state.cultureId ? "active" : "") + '" data-action="culture" data-id="' + item.id + '" data-tip="' + esc(HELP.cultures[item.id]) + '">' + esc(item.name) + "</button>";
    });
    html += "</div>";
    if (!c) return html;
    html += '<div class="panel"><p><strong>' + esc(c.name) + "</strong> — niveau de vie " + esc(DATA.stdName[c.std]) + ".</p>";
    html += "<p>Avantage : " + tip(c.advantage, c.advantageText) + "</p>";
    if (c.restriction) html += '<p class="hint">' + esc(c.restriction) + "</p>";
    html += '<p class="hint">' + esc(TONGUE[c.id]) + "</p></div>";
    html += '<div class="grid">';
    html += '<label class="field"><span>Nom</span><input data-bind="name" value="' + esc(state.name) + '" autocomplete="off"></label>';
    html += '<label class="field"><span>Suggestion</span><select data-action="suggest">' + options(namesFor(c), "", "Un prénom du peuple…") + "</select></label>";
    if (c.names.family) {
      html += '<label class="field"><span>Nom de famille</span><input data-bind="family" value="' + esc(state.family) + '"></label>';
      html += '<label class="field"><span>Familles</span><select data-action="family">' + options(c.names.family, "", "Une famille…") + "</select></label>";
    }
    html += '<label class="field"><span>Filtrer les prénoms</span><select data-bind="sex" data-action="bind">';
    html += ["", "Femme", "Homme"].map(function (g) {
      return '<option value="' + esc(g) + '"' + (state.sex === g ? " selected" : "") + ">" + (g || "Tous") + "</option>";
    }).join("");
    html += "</select></label>";
    html += '<label class="field"><span>Âge</span><input data-bind="age" inputmode="numeric" maxlength="3" value="' + esc(state.age) + '"><span class="hint">' + esc(c.age.hint) + "</span></label>";
    html += "</div>";
    return html;
  }

  function stepAttrs() {
    const c = SDA.culture(state);
    if (!c) return '<h2>Attributs</h2><p class="lead">Choisissez d\'abord une culture.</p>';
    const a = SDA.attributes(state);
    let html = "<h2>Attributs</h2><p class=\"lead\">Choisissez l'une des six lignes, ou lancez un dé de Maîtrise (1 à 6) pour la tirer au sort. Le seuil d'une compétence est 20 moins l'attribut qui la gouverne.</p>";
    html += '<div class="actions"><button type="button" class="btn" data-action="roll-attr">Lancer le dé de Maîtrise</button>';
    if (state.lastRoll) html += '<span class="hint">Dernier jet : ' + state.lastRoll + "</span>";
    html += "</div><div class=\"sets\">";
    c.sets.forEach(function (row, i) {
      const n = i + 1;
      html += '<button type="button" class="set' + (state.attrPick === n ? " active" : "") + '" data-action="set" data-n="' + n + '"><b>' + n + "</b><span>Corps " + row[0] + "</span><span>Cœur " + row[1] + "</span><span>Esprit " + row[2] + "</span></button>";
    });
    html += "</div>";
    if (c.bonusAttr) {
      html += '<div class="panel"><p>Rois des Hommes : ajoutez 1 à un attribut.</p><div class="choices">';
      DATA.attrs.forEach(function (attr) {
        html += '<button type="button" class="' + (state.bonusAttr === attr.id ? "active" : "") + '" data-action="bonus" data-id="' + attr.id + '">' + attr.name + "</button>";
      });
      html += "</div></div>";
    }
    if (a) {
      html += '<div class="stats">';
      DATA.attrs.forEach(function (attr) {
        html += '<div class="stat"><h3>' + tip(attr.name, HELP.attrs[attr.id]) + "</h3><strong>" + a[attr.id] + '</strong><div class="hint">' + tip("SR " + SDA.sr(state, attr.id), HELP.derived.sr) + "</div></div>";
      });
      const d = SDA.derived(state);
      html += "</div><div class=\"stats\">";
      html += '<div class="stat"><h3>' + tip("Endurance", HELP.derived.endurance) + "</h3><strong>" + d.endurance + "</strong><div class=\"hint\">Corps + " + c.end + "</div></div>";
      html += '<div class="stat"><h3>' + tip("Espoir", HELP.derived.hope) + "</h3><strong>" + d.hope + "</strong><div class=\"hint\">Cœur + " + c.hope + "</div></div>";
      html += '<div class="stat"><h3>' + tip("Parade", HELP.derived.parry) + "</h3><strong>" + d.parry + "</strong><div class=\"hint\">Esprit + " + c.parry + "</div></div>";
      html += "</div>";
    }
    return html;
  }

  function stepSkills() {
    const c = SDA.culture(state);
    if (!c) return "<h2>Compétences</h2><p class=\"lead\">Choisissez d'abord une culture.</p>";
    let html = "<h2>Compétences</h2><p class=\"lead\">Les rangs viennent de la culture. Choisissez l'une des deux compétences proposées comme favorite, puis la compétence de combat au rang 2 et une seconde au rang 1. Une favorite se joue avec deux dés du Destin : on garde le meilleur.</p>";
    html += "<h3>Compétence favorite</h3><div class=\"choices\">";
    c.fav.forEach(function (id) {
      html += '<button type="button" class="' + (state.favCulture === id ? "active" : "") + '" data-action="fav" data-id="' + id + '" data-tip="' + esc(HELP.skills[id]) + '">' + esc(skillName(id)) + " " + c.ranks[id] + "</button>";
    });
    html += "</div><h3>Combat — rang 2</h3><div class=\"choices\">";
    c.combat.forEach(function (id) {
      html += '<button type="button" class="' + (state.combatPrimary === id ? "active" : "") + '" data-action="primary" data-id="' + id + '" data-tip="' + esc(HELP.skills[id]) + '">' + esc(skillName(id)) + "</button>";
    });
    html += "</div><h3>Combat — rang 1</h3><div class=\"choices\">";
    DATA.combat.forEach(function (s) {
      if (s.id === state.combatPrimary) return;
      html += '<button type="button" class="' + (state.combatSecondary === s.id ? "active" : "") + '" data-action="secondary" data-id="' + s.id + '" data-tip="' + esc(HELP.skills[s.id]) + '">' + esc(s.name) + "</button>";
    });
    html += "</div><h3>Deux particularités</h3><div class=\"choices\">";
    c.features.forEach(function (name) {
      html += '<button type="button" class="' + (state.features.indexOf(name) >= 0 ? "active" : "") + '" data-action="feature" data-id="' + esc(name) + '" data-tip="' + esc(HELP.features[name] || "") + '">' + esc(name) + "</button>";
    });
    html += "</div>";
    html += '<div class="skill-table">';
    DATA.skills.forEach(function (s) {
      const fav = state.favCulture === s.id;
      const shown = SDA.rank(state, s.id);
      html += '<div class="skill-row"><span>' + tip(s.name, HELP.skills[s.id]) + '</span>' + pips(shown) + "<b>" + shown + "</b>" + (fav ? '<em>favorite</em>' : "") + "</div>";
    });
    html += "</div>";
    return html;
  }

  function stepCalling() {
    let html = "<h2>Vocation</h2><p class=\"lead\">La vocation n'est pas un métier : c'est la raison de prendre la route. Elle donne deux compétences favorites, une particularité, et la voie de l'Ombre à noter.</p><div class=\"choices\">";
    DATA.callings.forEach(function (c) {
      html += '<button type="button" class="' + (state.callingId === c.id ? "active" : "") + '" data-action="calling" data-id="' + c.id + '" data-tip="' + esc(c.text) + '">' + esc(c.name) + "</button>";
    });
    html += "</div>";
    const call = SDA.calling(state);
    if (!call) return html;
    html += '<div class="panel"><p>' + esc(call.text) + "</p><p>Particularité : <strong>" + tip(call.feature, HELP.features[call.feature]) + "</strong></p><p class=\"hint\">Voie de l'Ombre : " + esc(call.shadow) + ".</p></div>";
    html += "<h3>Deux compétences favorites</h3><div class=\"choices\">";
    call.skills.forEach(function (id) {
      const already = state.favCulture === id;
      html += '<button type="button" class="' + (state.callingFav.indexOf(id) >= 0 ? "active" : "") + '" data-action="cfav" data-id="' + id + '" data-tip="' + esc(HELP.skills[id]) + '">' + esc(skillName(id)) + (already ? " (déjà favorite)" : "") + "</button>";
    });
    html += "</div>";
    if (call.id === "champion") {
      html += '<label class="field"><span>Ennemis de prédilection</span><select data-action="enemy">' + options(DATA.enemies, state.enemy, "Choisir un type…") + "</select></label>";
    }
    return html;
  }

  function stepXp() {
    const left = SDA.pointsLeft(state);
    let html = "<h2>Expérience acquise</h2><p class=\"lead\">10 points, dépensés rang après rang. Une compétence commune s'arrête au rang 4 (coûts 1, 2, 3 puis 5). Une compétence de combat s'arrête au rang 3 (coûts 2, 4 puis 6).</p>";
    html += '<p class="points">Points restants : <strong>' + left + "</strong></p>";
    function block(list) {
      let out = "";
      list.forEach(function (s) {
        const rk = SDA.rank(state, s.id);
        const cost = SDA.raiseCost(s.id, rk);
        const can = cost != null && rk < SDA.cap(s.id) && cost <= left;
        out += '<div class="skill-row"><span>' + tip(s.name, HELP.skills[s.id]) + (SDA.isFavoured(state, s.id) ? " ★" : "") + "</span>" + pips(rk) + "<b>" + rk + '</b><span class="stepper"><button type="button" data-action="xp" data-id="' + s.id + '" data-dir="-1">−</button><button type="button" data-action="xp" data-id="' + s.id + '" data-dir="1"' + (can ? "" : " disabled") + ">+" + (cost == null || rk >= SDA.cap(s.id) ? "" : " " + cost) + "</button></span></div>";
      });
      return out;
    }
    html += "<h3>Compétences communes</h3>" + block(DATA.skills);
    html += "<h3>Compétences de combat</h3>" + block(DATA.combat);
    return html;
  }

  function stepGear() {
    const c = SDA.culture(state);
    if (!c) return "<h2>Équipement</h2><p class=\"lead\">Choisissez d'abord une culture.</p>";
    ensureGear();
    const gear = SDA.loadout(state);
    let html = "<h2>Équipement</h2><p class=\"lead\">Une arme pour chaque compétence de combat possédée, plus une armure, un casque et un bouclier. Le niveau de vie " + esc(DATA.stdName[c.std]) + " limite les mailles et les grands boucliers. Objets utiles : " + DATA.usefulCount[c.std] + ". " + esc(DATA.mount[c.std]) + " Trésor de départ : " + DATA.treasure[c.std] + ".</p>";
    if (c.restriction) html += '<p class="hint">' + esc(c.restriction) + "</p>";
    SDA.combatSkillsWithRank(state).forEach(function (s) {
      html += "<h3>" + esc(s.name) + " — rang " + SDA.rank(state, s.id) + "</h3><div class=\"choices\">";
      SDA.legalWeapons(state, s.id).forEach(function (w) {
        const detail = "Dégâts " + w.dmg + ", blessure " + injuryText(w.injury) + ", charge " + w.load + (w.note ? ". " + w.note : "");
        html += '<button type="button" class="' + (state.weapons[s.id] === w.id ? "active" : "") + '" data-action="pick-weapon" data-skill="' + s.id + '" data-id="' + w.id + '" data-tip="' + esc(detail) + '">' + esc(w.name) + "</button>";
      });
      html += "</div>";
    });
    html += '<div class="grid">';
    html += '<label class="field"><span>Armure</span><select data-action="armour">';
    SDA.legalArmours(state).forEach(function (a) {
      html += '<option value="' + a.id + '"' + (state.armourId === a.id ? " selected" : "") + ">" + esc(a.name) + " — " + a.dice + "d, charge " + a.load + "</option>";
    });
    html += '</select></label><label class="field"><span>Casque</span><input value="Heaume — 1d, charge 4" disabled></label>';
    html += '<label class="field"><span>Bouclier</span><select data-action="shield">';
    SDA.legalShields(state).forEach(function (s) {
      html += '<option value="' + s.id + '"' + (state.shieldId === s.id ? " selected" : "") + ">" + esc(s.name) + " — parade +" + s.parry + ", charge " + s.load + "</option>";
    });
    html += "</select></label></div>";
    html += '<p class="points">Charge totale : <strong>' + gear.total + "</strong>";
    if (gear.dwarfArmour) html += " (armure et casque déjà réduits de moitié)";
    const d = SDA.derived(state);
    if (d) html += ". Épuisé si l'Endurance tombe à " + gear.total + " ou moins (Endurance " + d.endurance + ").";
    html += "</p><h3>Objets utiles</h3><p class=\"hint\">Chacun est lié à une compétence. En jeu, un seul objet peut avantager un jet.</p>";
    for (let i = 0; i < DATA.usefulCount[c.std]; i++) {
      html += '<div class="grid"><label class="field"><span>Objet ' + (i + 1) + '</span><input data-bind="useful-' + i + '" value="' + esc(state.useful[i] || "") + '"></label>';
      html += '<label class="field"><span>Compétence</span><select data-action="uskill" data-i="' + i + '">' + options(DATA.skills, state.usefulSkill[i] || "", "Compétence…") + "</select></label></div>";
    }
    return html;
  }

  function stepReward() {
    ensureGear();
    let html = "<h2>Récompense et vertu</h2><p class=\"lead\">On commence avec 1 en Vaillance et 1 en Sagesse. Cela ouvre une récompense, qui améliore l'équipement, et une vertu.</p><h3>Récompense</h3><div class=\"choices\">";
    DATA.rewards.forEach(function (r) {
      html += '<button type="button" class="' + (state.rewardId === r.id ? "active" : "") + '" data-action="reward" data-id="' + r.id + '" data-tip="' + esc(r.text) + '">' + esc(r.name) + "</button>";
    });
    html += "</div>";
    const reward = DATA.rewards.find(function (r) { return r.id === state.rewardId; });
    if (reward) {
      html += '<p class="hint">' + esc(reward.text) + "</p>";
      if (reward.piece === "weapon") {
        html += "<h3>Arme concernée</h3><div class=\"choices\">";
        SDA.loadout(state).weapons.forEach(function (w) {
          html += '<button type="button" class="' + (state.rewardTarget === w.id ? "active" : "") + '" data-action="reward-weapon" data-id="' + w.id + '">' + esc(w.name) + "</button>";
        });
        html += "</div>";
      } else if (reward.piece === "armourhelm") {
        html += '<label class="field"><span>Pièce</span><select data-action="rtarget">' + options([{ id: "armour", name: "Armure" }, { id: "helm", name: "Casque" }], state.rewardTarget, "Choisir…") + "</select></label>";
      } else if (reward.piece === "loadpiece") {
        html += '<label class="field"><span>Pièce</span><select data-action="rtarget">' + options([{ id: "armour", name: "Armure" }, { id: "helm", name: "Casque" }, { id: "shield", name: "Bouclier" }], state.rewardTarget, "Choisir…") + "</select></label>";
      }
    }
    html += "<h3>Vertu</h3><div class=\"choices\">";
    DATA.virtues.forEach(function (v) {
      html += '<button type="button" class="' + (state.virtueId === v.id ? "active" : "") + '" data-action="virtue" data-id="' + v.id + '" data-tip="' + esc(v.text) + '">' + esc(v.name) + "</button>";
    });
    html += "</div>";
    const virtue = DATA.virtues.find(function (v) { return v.id === state.virtueId; });
    if (virtue) html += '<p class="hint">' + esc(virtue.text) + "</p>";
    if (state.virtueId === "mastery-attr") {
      html += '<div class="choices">';
      DATA.attrs.forEach(function (a) {
        html += '<button type="button" class="' + (state.virtueAttr === a.id ? "active" : "") + '" data-action="vattr" data-id="' + a.id + '">' + a.name + "</button>";
      });
      html += "</div>";
    }
    if (state.virtueId === "mastery") {
      html += '<div class="choices">';
      DATA.skills.forEach(function (s) {
        const already = state.favCulture === s.id || state.callingFav.indexOf(s.id) >= 0;
        if (already) return;
        html += '<button type="button" class="' + (state.virtueFav.indexOf(s.id) >= 0 ? "active" : "") + '" data-action="vfav" data-id="' + s.id + '">' + esc(s.name) + "</button>";
      });
      html += "</div>";
    }
    return html;
  }

  function stepBackground() {
    let html = "<h2>Background</h2><p class=\"lead\">Racontez d'où vient ce héros, et ce qui l'a décidé à prendre la route. Écrivez librement : quelques lignes suffisent.</p>";
    html += '<label class="field"><span>Enfance</span><textarea data-bind="childhood" placeholder="Où il a grandi, auprès de qui, ce qui l\'a marqué enfant.">' + esc(state.childhood) + "</textarea></label>";
    html += '<label class="field"><span>Adolescence</span><textarea data-bind="youth" placeholder="Ce qu\'il a appris, qui il a fréquenté, ce qu\'il a commencé à vouloir.">' + esc(state.youth) + "</textarea></label>";
    html += '<label class="field"><span>Ce qui l\'a poussé à prendre la route</span><textarea data-bind="road" placeholder="L\'événement, la personne ou le choix qui l\'a fait partir.">' + esc(state.road) + "</textarea></label>";
    html += '<label class="field"><span>Notes</span><textarea data-bind="notes">' + esc(state.notes) + "</textarea></label>";
    return html;
  }

  function stepSheet() {
    const issues = SDA.issues(state);
    let html = "<h2>Fiche</h2><p class=\"lead\">La fiche tient sur deux pages. Téléchargez-la en PDF : dans la fenêtre qui s'ouvre, choisissez « Enregistrer au format PDF ».</p>";
    html += '<div class="actions"><button type="button" class="btn" data-action="print">Télécharger en PDF</button></div>';
    if (issues.length) {
      html += '<div class="issues"><p>Avant de considérer la fiche terminée :</p><ul>';
      issues.forEach(function (item) { html += "<li>" + esc(item) + "</li>"; });
      html += "</ul></div>";
    } else if (SDA.pointsLeft(state) > 0) {
      html += '<p class="hint">Il reste ' + SDA.pointsLeft(state) + " point(s) d'expérience. Vous pouvez revenir les dépenser.</p>";
    }
    html += '<p><button type="button" class="btn ghost" data-action="reset">Nouvelle fiche</button></p>';
    return html;
  }

  function sheetHtml() {
    ensureGear();
    const c = SDA.culture(state);
    const a = SDA.attributes(state);
    const d = SDA.derived(state);
    const call = SDA.calling(state);
    const gear = SDA.loadout(state);
    const reward = DATA.rewards.find(function (r) { return r.id === state.rewardId; });
    const virtue = DATA.virtues.find(function (v) { return v.id === state.virtueId; });
    function attrBox(id, label) {
      if (!a) return '<div class="abox"><b>' + label + '</b><strong>—</strong><small>SR —</small></div>';
      return '<div class="abox"><b>' + label + "</b><strong>" + a[id] + "</strong><small>SR " + SDA.sr(state, id) + "</small></div>";
    }
    function col(attr) {
      return DATA.skills.filter(function (s) { return s.attr === attr; }).map(function (s) {
        const rk = c ? SDA.rank(state, s.id) : 0;
        return '<div class="sline"><span>' + (SDA.isFavoured(state, s.id) ? "★ " : "") + esc(s.name) + "</span>" + pips(rk) + "<b>" + rk + "</b></div>";
      }).join("");
    }
    let weapons = "";
    if (!gear.weapons.length) weapons = "<tr><td colspan=\"5\">—</td></tr>";
    gear.weapons.forEach(function (w) {
      weapons += "<tr><td>" + esc(w.name) + "</td><td>" + esc(w.skill) + "</td><td>" + w.dmg + "</td><td>" + esc(injuryText(w.injury)) + "</td><td>" + w.load + (w.notes ? "<small>" + esc(w.notes) + "</small>" : "") + "</td></tr>";
    });
    const useful = [];
    if (c) {
      for (let i = 0; i < DATA.usefulCount[c.std]; i++) {
        if (state.useful[i]) useful.push(state.useful[i] + (state.usefulSkill[i] ? " (" + skillName(state.usefulSkill[i]) + ")" : ""));
      }
    }
    let rewardLine = reward ? reward.name : "—";
    if (reward && state.rewardTarget) {
      if (state.rewardTarget === "armour") rewardLine += " (armure)";
      else if (state.rewardTarget === "helm") rewardLine += " (casque)";
      else if (state.rewardTarget === "shield") rewardLine += " (bouclier)";
      else {
        const w = DATA.weapons.find(function (item) { return item.id === state.rewardTarget; });
        if (w) rewardLine += " (" + w.name + ")";
      }
    }
    let virtueLine = virtue ? virtue.name : "—";
    if (state.virtueId === "mastery-attr" && state.virtueAttr) {
      const attr = DATA.attrs.find(function (item) { return item.id === state.virtueAttr; });
      virtueLine += attr ? " (" + attr.name + ")" : "";
    }
    if (state.virtueId === "mastery") virtueLine += " (" + state.virtueFav.map(skillName).filter(Boolean).join(", ") + ")";
    const armourName = gear.armour ? gear.armour.name + " " + gear.armour.dice + "d" : "—";
    const close = state.rewardId === "close" ? state.rewardTarget : "";

    return '<article class="sheet-page"><div class="sheet-inner"><header class="shead"><div><p class="eyebrow">L\'Anneau Unique — fiche d\'aventurier</p><h2>' + esc(SDA.displayName(state) || "Sans nom") + '</h2></div><div class="marks"><span>Vaillance <b>1</b></span><span>Sagesse <b>1</b></span></div></header>' +
      '<div class="idline"><span>Culture <b>' + esc(c ? c.name : "—") + "</b></span><span>Vocation <b>" + esc(call ? call.name : "—") + "</b></span><span>Âge <b>" + esc(state.age || "—") + "</b></span><span>Niveau de vie <b>" + esc(c ? DATA.stdName[c.std] : "—") + "</b></span></div>" +
      '<p class="traits">Particularités : ' + esc(SDA.features(state).join(" · ") || "—") + "</p>" +
      '<div class="attrline">' + attrBox("corps", "Corps") + attrBox("coeur", "Cœur") + attrBox("esprit", "Esprit") +
      '<div class="abox"><b>Endurance</b><strong>' + (d ? d.endurance : "—") + '</strong><small>actuelle</small></div>' +
      '<div class="abox"><b>Espoir</b><strong>' + (d ? d.hope : "—") + '</strong><small>actuel</small></div>' +
      '<div class="abox"><b>Parade</b><strong>' + (d ? d.parry : "—") + "</strong><small>+ bouclier " + (gear.parryMod ? "+" + gear.parryMod : "—") + " = " + (gear.parry == null ? "—" : gear.parry) + "</small></div></div>" +
      '<div class="skillcols"><section><h3>Corps</h3>' + col("corps") + '</section><section><h3>Cœur</h3>' + col("coeur") + '</section><section><h3>Esprit</h3>' + col("esprit") + "</section></div>" +
      '<div class="combatline">' + DATA.combat.map(function (s) {
        const rk = c ? SDA.rank(state, s.id) : 0;
        return "<span><b>" + esc(s.name) + "</b> " + rk + "</span>";
      }).join("") + "</div>" +
      '<p class="fine">Ombre 0 · Épuisé si Endurance ≤ charge ' + gear.total + " · Mélancolique si Ombre ≥ Espoir" + (c && c.id === "rodeurs" ? " · Hors Yule, l'Espoir récupéré en communauté ne dépasse pas la moitié du Cœur" : "") + "</p></div></article>" +
      '<article class="sheet-page"><div class="sheet-inner"><h3>Attirail</h3><table><thead><tr><th>Arme</th><th>Compétence</th><th>Dégâts</th><th>Blessure</th><th>Charge</th></tr></thead><tbody>' + weapons + "</tbody></table>" +
      '<div class="gearline"><span>Armure <b>' + esc(armourName) + (close === "armour" ? " +2" : "") + "</b></span><span>Casque <b>Heaume 1d" + (close === "helm" ? " +2" : "") + "</b></span><span>Bouclier <b>" + esc(gear.shield ? gear.shield.name + " +" + gear.parryMod : "—") + "</b></span><span>Charge <b>" + gear.total + "</b></span></div>" +
      (gear.dwarfArmour ? '<p class="fine">Infatigable : la charge de l\'armure et du casque est réduite de moitié.</p>' : "") +
      '<p class="traits">Objets utiles : ' + esc(useful.join(" · ") || "—") + "</p>" +
      '<p class="traits">Monture : ' + esc(c ? DATA.mount[c.std] : "—") + " · Trésor " + esc(c ? DATA.treasure[c.std] : "—") + "</p>" +
      '<div class="twocol"><div><h3>Récompense</h3><p>' + esc(rewardLine) + "</p><h3>Vertu</h3><p>" + esc(virtueLine) + "</p><h3>Avantage</h3><p>" + esc(c ? c.advantage + " — " + c.advantageText : "—") + "</p></div><div><h3>Voie de l'Ombre</h3><p>" + esc(call ? call.shadow : "—") + "</p></div></div>" +
      "<h3>Background</h3><p class=\"notes\"><b>Enfance.</b> " + esc(state.childhood || "—") + "</p><p class=\"notes\"><b>Adolescence.</b> " + esc(state.youth || "—") + "</p><p class=\"notes\"><b>La route.</b> " + esc(state.road || "—") + "</p>" +
      '<h3>Notes</h3><p class="notes">' + esc(state.notes || "") + "</p>" +
      '<p class="fine">Outil de table, non officiel. Le livre reste la référence. Les aides à l\'écran sont rédigées pour cet outil.</p></div></article>';
  }

  const bodies = [stepCulture, stepAttrs, stepSkills, stepCalling, stepXp, stepGear, stepReward, stepBackground, stepSheet];

  function render() {
    clampExtras();
    ensureGear();
    const nav = STEPS.map(function (name, i) {
      return '<button type="button" class="no-print' + (state.step === i ? " active" : "") + '" data-action="goto" data-step="' + i + '">' + (i + 1) + ". " + esc(name) + "</button>";
    }).join("");
    const root = document.getElementById("app");
    root.innerHTML = '<header class="top no-print"><div class="brand"><h1>Créateur d\'aventurier</h1><p>Vos joueurs créent leur héros pas à pas, puis téléchargent la fiche. Outil de table, non officiel : le livre reste la référence.</p></div></header><nav class="steps no-print">' + nav + '</nav><main class="card no-print">' + bodies[state.step]() + '</main>' +
      (state.step === 8 ? '<div class="sheet-wrap">' + sheetHtml() + "</div>" : "") +
      '<div class="nav no-print"><button type="button" class="btn secondary" data-action="prev"' + (state.step === 0 ? " disabled" : "") + '>Retour</button><button type="button" class="btn" data-action="next"' + (state.step === 8 ? " disabled" : "") + ">Continuer</button></div>";
    save();
  }

  function onClick(e) {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === "goto") state.step = Number(btn.dataset.step);
    else if (action === "prev") state.step = Math.max(0, state.step - 1);
    else if (action === "next") state.step = Math.min(8, state.step + 1);
    else if (action === "culture") setCulture(btn.dataset.id);
    else if (action === "set") { state.attrPick = Number(btn.dataset.n); state.lastRoll = 0; }
    else if (action === "roll-attr") {
      const n = 1 + Math.floor(Math.random() * 6);
      state.attrPick = n;
      state.lastRoll = n;
    } else if (action === "bonus") state.bonusAttr = btn.dataset.id;
    else if (action === "fav") state.favCulture = btn.dataset.id;
    else if (action === "primary") {
      if (state.combatPrimary !== btn.dataset.id) {
        state.combatPrimary = btn.dataset.id;
        if (state.combatSecondary === state.combatPrimary) state.combatSecondary = "";
        DATA.combat.forEach(function (s) { delete state.extra[s.id]; });
      }
    } else if (action === "secondary") {
      if (state.combatSecondary !== btn.dataset.id) {
        state.combatSecondary = btn.dataset.id;
        DATA.combat.forEach(function (s) { delete state.extra[s.id]; });
      }
    } else if (action === "feature") state.features = toggleList(state.features, btn.dataset.id, 2);
    else if (action === "calling") {
      state.callingId = btn.dataset.id;
      state.callingFav = [];
      state.enemy = "";
    } else if (action === "cfav") state.callingFav = toggleList(state.callingFav, btn.dataset.id, 2);
    else if (action === "xp") raise(btn.dataset.id, Number(btn.dataset.dir));
    else if (action === "reward") { state.rewardId = btn.dataset.id; state.rewardTarget = ""; }
    else if (action === "virtue") { state.virtueId = btn.dataset.id; state.virtueAttr = ""; state.virtueFav = []; }
    else if (action === "vattr") state.virtueAttr = btn.dataset.id;
    else if (action === "vfav") state.virtueFav = toggleList(state.virtueFav, btn.dataset.id, 2);
    else if (action === "pick-weapon") state.weapons[btn.dataset.skill] = btn.dataset.id;
    else if (action === "reward-weapon") state.rewardTarget = btn.dataset.id;
    else if (action === "print") { window.print(); return; }
    else if (action === "reset") {
      if (!window.confirm("Effacer cette fiche et recommencer ?")) return;
      state = blank();
      localStorage.removeItem(KEY);
    } else return;
    render();
  }

  function onChange(e) {
    const t = e.target;
    const action = t.dataset.action;
    if (action === "bind") state[t.dataset.bind] = t.value;
    else if (action === "suggest") { if (t.value) state.name = t.value; }
    else if (action === "family") { if (t.value) state.family = t.value; }
    else if (action === "enemy") state.enemy = t.value;
    else if (action === "armour") state.armourId = t.value;
    else if (action === "shield") state.shieldId = t.value;
    else if (action === "uskill") state.usefulSkill[Number(t.dataset.i)] = t.value;
    else if (action === "rtarget") state.rewardTarget = t.value;
    else if (action === "patron") state.patronId = t.value;
    else if (t.dataset.bind === "age") {
      const c = SDA.culture(state);
      const n = parseInt(state.age, 10);
      if (c && state.age !== "" && !isNaN(n)) state.age = String(Math.min(c.age.max, Math.max(c.age.min, n)));
    } else return;
    render();
  }

  function onInput(e) {
    const t = e.target;
    const bind = t.dataset.bind;
    if (!bind) return;
    if (bind === "age" || bind === "heroes" || bind === "extraBree") {
      const max = bind === "age" ? 3 : 2;
      const clean = t.value.replace(/\D/g, "").slice(0, max);
      if (t.value !== clean) t.value = clean;
      state[bind] = clean;
      save();
      return;
    }
    if (bind.indexOf("useful-") === 0) {
      state.useful[Number(bind.slice(7))] = t.value;
      save();
      return;
    }
    if (bind === "name" || bind === "family" || bind === "refuge" || bind === "attachment" || bind === "notes" || bind === "childhood" || bind === "youth" || bind === "road") {
      state[bind] = t.value;
      save();
    }
  }

  document.addEventListener("click", onClick);
  document.addEventListener("change", onChange);
  document.addEventListener("input", onInput);
  document.addEventListener("focusin", function (e) {
    if (e.target.dataset && e.target.dataset.bind === "age") e.target.select();
  });

  const pop = document.createElement("div");
  pop.className = "tip-pop";
  document.body.appendChild(pop);
  document.addEventListener("mouseover", function (e) {
    const el = e.target.closest("[data-tip]");
    if (!el) { pop.classList.remove("show"); return; }
    pop.textContent = el.getAttribute("data-tip");
    pop.classList.add("show");
  });
  document.addEventListener("mousemove", function (e) {
    if (!pop.classList.contains("show")) return;
    pop.style.left = Math.min(window.innerWidth - 280, e.clientX + 14) + "px";
    pop.style.top = (e.clientY + 18) + "px";
  });
  document.addEventListener("mouseout", function (e) {
    if (e.target.closest && e.target.closest("[data-tip]")) pop.classList.remove("show");
  });

  load();
  render();
})();
