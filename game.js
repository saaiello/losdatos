/* ============================================================
   LOS DATOS — GAME LOGIC
   Children & Family Futures | 2026
   ============================================================

   TABLE OF CONTENTS
   1.  Game State
   2.  Rule Data (RULE_DETAIL)
   3.  Zone Data (ZONES)
   4.  HUD & Navigation
   5.  Game Flow Functions
   6.  Zone Rendering
   7.  Builder Functions
   8.  Interaction Handlers
   9.  Modal Functions
   10. Init
   ============================================================ */


/* ============================================================
   1. GAME STATE
   ============================================================ */

let currentZone       = 0;
let voteRevealed      = false;
let score             = 0;
let gameStarted       = false;
let onMissionBriefing = false;
let district5Screen   = 1;


/* ============================================================
   2. RULE DATA
   ============================================================ */

const RULE_DETAIL = [
  {
    num: "Rule I",
    name: "Shared Mission, Vision & Goals",
    anchor: "Get everyone in the huddle",
    plain: "Before a tool is selected, the people most affected need to be in the room. That means frontline staff, supervisors, families with lived experience, community advocates, and tribal partners. A tool adopted without partner input will face resistance no amount of training can fix after the fact.",
    questions: [
      "Who was in the room when this tool was selected, who wasn't?",
      "Were families with lived experience consulted?",
      "Does the tool's stated purpose align with our mission and values?",
      "Who has ongoing oversight authority once the tool is live?",
      "What happens when the tool's output conflicts with stated values?"
    ]
  },
  {
    num: "Rule II",
    name: "Efficient Cross-Systems Communication",
    anchor: "Know whose data you're using",
    plain: "Every predictive risk model is only as good as the data it was trained on. A model built from child welfare, criminal, legal, and public benefits records will reflect the history of those systems. That's not a flaw that better technology can fix. It's a structural feature of building prediction engines on systems data.",
    questions: [
      "What data sources were used to build this tool, what's missing?",
      "Which populations are underrepresented or invisible in the training data?",
      "Has the tool been validated against outcomes outside the child welfare system, like hospitalization data, or only against system-generated outcomes like removal?",
      "Does the tool perform equally well across racial, ethnic, and socioeconomic groups?",
      "What happens when the tool encounters a family profile it hasn't seen before?"
    ]
  },
  {
    num: "Rule III",
    name: "Ongoing Cross-Training & Staff Development",
    anchor: "Train everybody, not just the tech team",
    plain: "Every person who sees a score, acts on a score, or supervises someone who does needs to understand what the tool is measuring and what it isn't. If a worker doesn't know they can push back, or doesn't feel safe doing so, the override mechanism that exists on paper means nothing in practice. Training can't be a one-time event.",
    questions: [
      "Who received training before the tool went live, who didn't?",
      "Does training cover not just how to use the tool but how to critically evaluate its output?",
      "Do workers know the override process, do they feel safe using it?",
      "Is there ongoing training as the tool is recalibrated or protocols change?",
      "How does the agency monitor whether staff are deferring to the score rather than exercising clinical judgment?",
      "Are supervisors trained to support override decisions, not just permit them?"
    ]
  },
  {
    num: "Rule IV",
    name: "Family-Centered Treatment & Recovery Support",
    anchor: "Keep the family at the center",
    plain: "Everything we've talked about today has focused on hotline screening. That’s where most implemented tools currently live. But PRMs aren't limited to that decision point. The ACF brief describes potential use across the continuum. As these tools expand, the family-centered questions become even more critical.",
    questions: [
      "Is the score being used to make a decision based on what's actually known about this family, or is it substituting for that judgment?",
      "How does the agency ensure that SUD treatment engagement is read as a strength, not a risk factor?",
      "Are families informed when a predictive risk tool is being used in decisions about them?",
      "How does the tool account for protective factors, strengths, and family resilience,or does it?"
    ]
  },
  {
    num: "Rule V",
    name: "Measuring & Monitoring Outcomes",
    anchor: "Watch the replay",
    plain: "Deploying a predictive risk tool is not a one-time decision. Models degrade over time. Agency practices change. Community demographics shift. A tool that was well-calibrated at launch can quietly become less accurate, less fair, or less aligned with agency goals without anyone noticing, unless someone is specifically tasked with watching.",
    questions: [
      "Who is responsible for ongoing monitoring of this tool, what authority do they have to act?",
      "How frequently is the tool's performance reviewed, and against what benchmarks?",
      "Is performance data disaggregated by race, ethnicity, and socioeconomic status?",
      "What is the process for recalibrating the tool when performance degrades?",
      "Do frontline workers have a mechanism to flag concerns about the tool's outputs?",
      "What happens when monitoring reveals the tool is performing worse for specific subpopulations?",
      "Has the tool been validated against outcomes outside the child welfare system, and is that validation ongoing?",
      "Is there a structured mechanism for frontline workers to report discrepancies between what the score says and what they're seeing in practice, does that information feed back into recalibration?"
    ]
  },
  {
    num: "Rule VI",
    name: "Sustainability & Institutionalization",
    anchor: "Build it to last — or don't build it at all",
    plain: "Sustainability means building the governance structures, the staff capacity, the monitoring infrastructure, and the community trust a tool of this consequence requires over the long term. And it means being willing to ask the hardest question before deployment: if we can't commit to maintaining this responsibly, should we be deploying it at all?",
    questions: [
      "What is the governance structure for this tool, who is accountable when something goes wrong?",
      "What happens to the tool when leadership changes?",
      "Is there a dedicated budget for ongoing monitoring, recalibration, and staff training?",
      "What is the vendor relationship, what happens if the vendor changes, raises prices, or goes out of business?",
      "Does the agency have independent access to the model, or does sustainability depend entirely on the vendor?",
      "Is there a sunset clause, a defined point at which the tool's continued use requires affirmative reauthorization?",
      "What would it take to retire this tool, and is there a plan for that?",
      "If we can't resource this tool responsibly over the long term, should we be deploying it at all?"
    ]
  }
];


/* ============================================================
   3. ZONE DATA
   ============================================================ */

const ZONES = [
  { // ZONE 0 — placeholder (mission briefing renders from showMissionBriefing)
    id: 0,
    name: "Los Datos",
    time: "5 min",
    narration: null,
    character: null,
    mentiLink: null,
    prompt: null,
    vote: null,
    rules: null,
  },
  { // ZONE 1 — The Call
    id: 1,
    name: "District 1 — The Call",
    time: "10 min",
    narration: `A neighbor called the hotline about the Washington family. She said the kids, ages 9 and 10, knocked on her door saying they were hungry and their mother, Denise Washington, wasn’t home. <br><br> The neighbor doesn’t know where Denise is, just that she leaves some evenings, and she's seen different people coming and going from the apartment. She describes Denise as a Black mother in her 30s and is pretty sure she had a prior drug problem, but she’s been clean for months.<br><br>
    <li>Denise receives housing assistance and Medicaid <br>
    <li>There is prior CPS contact; though the allegation is unsubstantiated and <br>
    <li>There is a flag that Denise is actively enrolled with a community support treatment program completing weekly home visits. `,
    character: {
      emoji: "👩🏽‍💼",
      name: "Maya",
      title: "The Case Manager",
      accent: "#4cc9f0",
      image: "assets/maya.png",
      stats: [
        { label: "EXPERIENCE", val: "11 Years" },
        { label: "CASELOAD",   val: "80+ / Week" },
      ],
      bio: "Maya has worked in child welfare for 11 years. She screens more than 80 referrals a week. She's good at her job, but no one could be consistent across that volume with only their own judgment and a checklist.",
      phrase: null,
    },
    charOrder: "first",
    prompt: null,
    mentiLink: null,
    vote: null,
    rules: null,
  },
  { // ZONE 2 — The Score
    id: 2,
    name: "District 2 — The Score",
    time: "10 min",
    narration: `The Allegheny Family Screening Tool was trained on data from 77,000 referrals. It looked at factors like prior CPS referrals, mental health records, housing assistance, and learned which of those factors have historically been connected to the outcomes it was built to predict. Then it took everything it knew about Denise's household and produced a number.<br><br>
    So the real questions are: Where did the number 17 come from? Whose information built it? And what did it leave out? And that's exactly where we're going next.`,
    character: {
      emoji: "🤖",
      name: "Al the Algorithm",
      title: "The PRM Tool",
      accent: "#f8c400",
      image: "assets/al.png",
      stats: [
        { label: "DATA POINTS", val: "800" },
        { label: "SCALE",       val: "1 to 20" },
      ],
      bio: "Al is not evil. Al is not even conscious. He is a statistical model trained on data from the past. Al has 800 data points on Denise's household and gives Maya the number 17.",
      phrase: "\"I have 800 data points on this.\"",
    },
    charOrder: "before-vote",
    prompt: null,
    mentiLink: null,
    vote: {
      question: "If you were Maya and you saw the number 17. What would you do?",
      optionA: "Screen In",
      optionB: "Screen Out",
      reveal: "It doesn't matter which way you went, what matters is what was driving it. Were you following the score? Were you second-guessing it? The question isn't what AI says. The question is whether its score informs Maya's judgment, or replaces it.",
    },
    rules: null,
  },
  { // ZONE 3 — The Weight
    id: 3,
    name: "District 3 — The Weight",
    time: "12 min",
    narration: `When Al learns that prior CPS contact predicts removal, he's right, statistically. <br><br>
    Remember that finish this sentence game? Al finished it the only way he knew how, based on what he'd seen before.<br><br>
    Prior CPS contact leads to... removal. Not because that's true. Because that's the pattern in Vera's files. <br><br> If the pattern Al learned is a pattern of who has the most records, families who have touched public systems, who have accessed government services, who have had the most contact with agencies that generate data, does that mean the tool makes things worse?`,
    character: {
      emoji: "📚",
      name: "Vera the Data",
      title: "The Training Data",
      accent: "#a855f7",
      image: "assets/vera.png",
      stats: [
        { label: "FILES",      val: "100,000+" },
        { label: "BLIND SPOT", val: "The Unseen" },
      ],
      bio: "Vera is a meticulous librarian. She is thorough, organized and has files on hundreds of thousands of families. However, she only has records from families who touched a government system. She isn't lying. She's just incomplete.",
      phrase: "\"I only have files on families the system already knew.\"",
    },
    charOrder: "reveal-file",
    prompt: null,
    mentiLink: null,
    vote: null,
    rules: null,
  },
  { // ZONE 4 — The Reality
    id: 4,
    name: "District 4 — The Reality",
    time: "8 min",
    narration: `If the pattern Al learned is a pattern of who has the most records, does the tool make things worse? The answer is, it's complicated. The evidence doesn't tell a clean story in either direction.<br><br>
    Allegheny County's 2024 research found after implementing the tool, racial disparities in screening rates decreased. Before the tool, Black children were being screened in at higher rates. After implementation, those gaps narrowed.<br><br>
    So, if the evidence isn't clean in either direction, if the tool isn't making things worse and it isn't making things better, then the question becomes: <i>what exactly is it measuring? Why is it even here? What is the tool actually predicting? </i><br><br>
    ACF's brief talks about modernizing child welfare for consistency and efficiency. And they're not wrong that the system needs both.<br><br>
    But here's what that framing misses, Maya isn't the efficiency problem. She is the human condition. She has the ability to hold both sides of that tension at once, the harm of investigating and the harm of not investigating, the score and the family behind it, the policy and the person it was written for. That is experience, which is something no algorithm can replicate, no matter how many data points it has.`,
    character: null,
    charOrder: null,
    prompt: null,
    mentiLink: null,
    vote: null,
    rules: null,
  },
  { // ZONE 5 — The Table
    id: 5,
    name: "District 5 — The Shift",
    time: "15 min",
    narration: `PRMs are already in more than 2 dozen states with more and more sites considering them.<br><br>The question isn't whether to use the technology, it's <i>what conditions have to be in place before you do?</i><br><br>
    Now, does anyone have any idea of something we may already have that can help us answer that question?<br><br> ---<br><br> AI is not the enemy. It just needs the same thing every system does, the right conditions, the right oversight, and people who know how to ask the right questions.`,
    character: {
      emoji: "📋",
      name: "You",
      title: "Your Voice",
      accent: "#4ade80",
      image: "assets/coach.png",
      stats: null,
      bio: "You've been working at this intersection for years. You already know what families need. You already know how systems fail them. You already know what good practice looks like and you already know how to have this conversation.",
      phrase: null,
    },
    charOrder: "first",
    mentiLink: null,
    vote: null,
    rules: null,
  },
  { // ZONE 6 — The Playbook (Rules of Engagement)
    id: 6,
    name: "District 6 — The Playbook",
    time: "15 min",
    narration: null,
    character: null,
    charOrder: null,
    mentiLink: null,
    prompt: null,
    vote: null,
    rules: [
      { num: "Rule I",   name: "Get everyone in the huddle",                  anchor: "Shared Mission, Vision & Goals",              callback: "Al doesn't set the mission. People do." },
      { num: "Rule II",  name: "Know whose data you're using",                anchor: "Efficient Cross-Systems Communication",        callback: "Vera only has files on families the system already knew." },
      { num: "Rule III", name: "Train everybody, not just the tech team",     anchor: "Ongoing Cross-Training & Staff Development",   callback: "Maya deserves to know she can push back." },
      { num: "Rule IV",  name: "Keep the family at the center",               anchor: "Family-Centered Treatment & Recovery Support", callback: "Denise is not a data point." },
      { num: "Rule V",   name: "Watch the replay",                            anchor: "Measuring & Monitoring Outcomes",              callback: "The scoreboard tells a different story." },
      { num: "Rule VI",  name: "Build it to last — or don't build it at all", anchor: "Sustainability & Institutionalization",        callback: "The Coach doesn't hand you a play and walk away." },
    ],
  },
];


/* ============================================================
   4. HUD & NAVIGATION
   ============================================================ */

function updateHUD(zoneIndex) {
  const zoneNames = [
    'DISTRICT 0',
    'DISTRICT 1 — THE CALL',
    'DISTRICT 2 — THE SCORE',
    'DISTRICT 3 — THE WEIGHT',
    'DISTRICT 4 — THE REALITY',
    'DISTRICT 5 — THE SHIFT',
    'DISTRICT 6 — THE PLAYBOOK'
  ];
  document.getElementById('zone-label').textContent = zoneNames[zoneIndex] || 'LOS DATOS';

  for (let i = 0; i <= 5; i++) {
    const row = document.getElementById('dr-' + i);
    if (!row) continue;
    row.classList.remove('unlocked', 'active');
    if (i < zoneIndex) {
      row.classList.add('unlocked');
      row.querySelector('.district-lock').textContent = 'UNLOCKED';
    } else if (i === zoneIndex - 1) {
      row.classList.add('active');
    }
  }

  const scoreDisplay = document.getElementById('score-display');
  if (scoreDisplay) {
    scoreDisplay.textContent = String(score).padStart(6, '0');
  }
}


/* ============================================================
   5. GAME FLOW FUNCTIONS
   ============================================================ */

function startGame() {
  gameStarted = true;
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('nav-deck').style.display = 'flex';
  showMissionBriefing();
}

function jumpToDistrict(zoneIndex) {
  if (zoneIndex === 99) {
    openFinishScreen();
    return;
  }
  gameStarted = true;
  onMissionBriefing = false;
  district5Screen = 1;
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('nav-deck').style.display = 'flex';
  currentZone = zoneIndex;
  updateHUD(zoneIndex);
  renderZone(zoneIndex);
  document.getElementById('back-btn').style.display = 'flex';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function returnToStart() {
  if (!gameStarted && !onMissionBriefing) return;
  gameStarted       = false;
  onMissionBriefing = false;
  currentZone       = 0;
  district5Screen   = 1;
  document.getElementById('start-screen').style.display = 'flex';
  document.getElementById('main-content').innerHTML = '';
  document.getElementById('unlock-banner').classList.remove('visible');
  document.getElementById('back-btn').style.display = 'none';
  document.getElementById('next-btn').className   = 'nav-btn forward';
  document.getElementById('next-btn').textContent = 'Next Level >>';
  document.getElementById('next-btn').onclick     = advanceDistrict;
  document.getElementById('nav-deck').style.display = 'none';
  updateHUD(0);
}

function showMissionBriefing() {
  onMissionBriefing = true;
  updateHUD(0);
  document.getElementById('zone-label').textContent = '// MISSION BRIEFING //';
  document.getElementById('time-label').textContent = '5 min';

  document.getElementById('main-content').innerHTML = `
    <div class="slide-in">
      <div class="briefing-card">
        <div class="briefing-header">// MISSION BRIEFING //</div>
        <ul class="briefing-objectives">
          <li>Distinguish between generative AI and predictive risk modeling</li>
          <li>Describe how PRMs work in child welfare — data, scoring, and where human judgment applies</li>
          <li>Identify how bias enters a model through training data and why it's structural, not technical</li>
        </ul>
      </div>
      ${buildMentiLink("https://www.menti.com/blnb2mvpkscn")}
    </div>`;

  document.getElementById('back-btn').style.display = 'flex';
  document.getElementById('next-btn').className   = 'nav-btn forward';
  document.getElementById('next-btn').textContent = '>> DEPLOY';
  document.getElementById('next-btn').onclick     = launchDistrict1;
}

function launchDistrict1() {
  onMissionBriefing = false;
  addPoints(0);
  currentZone = 1;
  updateHUD(1);
  renderZone(1);
  setTimeout(showUnlockBanner, 400);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function advanceToPlaybook() {
  district5Screen = 2;
  currentZone     = 6;
  addPoints(100);
  updateHUD(6);
  document.getElementById('zone-label').textContent = 'DISTRICT 6 — THE PLAYBOOK';

  document.getElementById('main-content').innerHTML = `
    <div class="slide-in">
      <div class="rules-header">// RULES OF ENGAGEMENT //</div>
      ${buildRules(ZONES[6].rules)}
      ${buildPrompt(ZONES[6].prompt)}
    </div>`;

  document.getElementById('next-btn').className   = 'nav-btn arrived';
  document.getElementById('next-btn').textContent = 'MISSION COMPLETE >>';
  document.getElementById('next-btn').onclick     = openFinishScreen;
  document.getElementById('back-btn').style.display = 'flex';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function advanceDistrict() {
  if (!gameStarted) return;
  if (currentZone >= 5) return;

  currentZone++;
  addPoints(100);
  updateHUD(currentZone);
  renderZone(currentZone);

  if (currentZone !== 4) {
    setTimeout(showUnlockBanner, 400);
  }

  document.getElementById('back-btn').style.display = 'flex';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() {
  if (!gameStarted && !onMissionBriefing) return;

  // From mission briefing — back to start screen
  if (onMissionBriefing) {
    onMissionBriefing = false;
    gameStarted       = false;
    document.getElementById('main-content').innerHTML = '';
    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('back-btn').style.display = 'none';
    document.getElementById('next-btn').className   = 'nav-btn forward';
    document.getElementById('next-btn').textContent = 'Next Level >>';
    document.getElementById('next-btn').onclick     = advanceDistrict;
    document.getElementById('nav-deck').style.display = 'none';
    updateHUD(0);
    return;
  }

  // From District 1 — back to mission briefing
  if (currentZone === 1) {
    currentZone = 0;
    showMissionBriefing();
    return;
  }

  // From Playbook (District 6) — back to District 5
  if (district5Screen === 2) {
    district5Screen = 1;
    currentZone     = 5;
    updateHUD(5);
    renderZone(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  // Default — go back one district
  currentZone--;
  updateHUD(currentZone);
  renderZone(currentZone);

  document.getElementById('next-btn').className   = 'nav-btn forward';
  document.getElementById('next-btn').textContent = 'Next Level >>';
  document.getElementById('next-btn').onclick     = advanceDistrict;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function addPoints(points) {
  score += points;
  const scoreDisplay = document.getElementById('score-display');
  if (scoreDisplay) {
    scoreDisplay.textContent = String(score).padStart(6, '0');
  }
}

function showUnlockBanner() {
  const Z = ZONES[currentZone];
  if (!Z || !Z.character) return;

  const banner = document.getElementById('unlock-banner');
  banner.textContent = '★ NEW CHARACTER UNLOCKED — ' + Z.character.name.toUpperCase() + ' ★';
  banner.classList.add('visible');

  setTimeout(() => {
    banner.classList.remove('visible');
  }, 3000);
}


/* ============================================================
   6. ZONE RENDERING
   ============================================================ */

function renderZone(zoneIndex) {
  const Z = ZONES[zoneIndex];
  document.getElementById('time-label').textContent = Z.time;

  const narrationText = Z.narration ? Z.narration.replace(/\n\n/g, '<br><br>') : '';
  let html = '';

  // ── Zone 6: The Playbook ──
  if (zoneIndex === 6) {
    html = `
      <div class="slide-in">
        <div class="rules-header">// RULES OF ENGAGEMENT //</div>
        ${buildRules(ZONES[6].rules)}
        ${buildPrompt(ZONES[6].prompt)}
      </div>`;
    document.getElementById('main-content').innerHTML = html;

  // ── Zone 4: The Gap — narration first, character reveals on click ──
  } else if (zoneIndex === 4) {
      html = `
        <div class="slide-in">
          <div class="scroll-card">
            <div class="scroll-label">// CASE FILE //</div>
            <div class="scroll-text">${narrationText}</div>
          </div>
          ${Z.prompt ? buildPrompt(Z.prompt) : ''}
        </div>`;
      document.getElementById('main-content').innerHTML = html;

    const revealBtn = document.getElementById('reveal-supervisor');
    if (revealBtn) {
      revealBtn.addEventListener('click', () => {
        showUnlockBanner();
        revealBtn.closest('.char-frame').outerHTML = buildCharCard(ZONES[4].character);
      });
    }

  // ── Zone 2: The Score — character and vote first, case file reveals on click ──
  } else if (Z.charOrder === 'before-vote') {
    html = `
      <div class="slide-in">
        <div class="content-grid">
          <div class="char-frame" id="district2-left">
            <div class="char-empty">
              <span class="char-empty-icon">🗂</span>
              Case file unlocks after the vote
              <button id="district2-btn" class="reveal-btn" onclick="revealCaseFile()">
                >> REVEAL CASE FILE
              </button>
            </div>
          </div>
          ${buildCharCard(Z.character)}
        </div>
        ${buildVote(Z.vote)}
        <div id="district2-reveal" style="display:none;">
          ${Z.prompt ? buildPrompt(Z.prompt) : ''}
        </div>
      </div>`;
    document.getElementById('main-content').innerHTML = html;

  // ── Zone 3: The Weight — character first, case file reveals on click ──
  } else if (Z.charOrder === 'reveal-file') {
    html = `
      <div class="slide-in">
        <div class="content-grid">
          <div class="char-frame" id="reveal-file-left">
            <div class="char-empty">
              <span class="char-empty-icon">🗂</span>
              Case file unlocks on click
              <button id="reveal-file-btn" class="reveal-btn" onclick="revealFileCard()">
                >> REVEAL CASE FILE
              </button>
            </div>
          </div>
          ${buildCharCard(Z.character)}
        </div>
        <div id="reveal-file-content" style="display:none;">
          ${Z.prompt ? buildPrompt(Z.prompt) : ''}
        </div>
      </div>`;
    document.getElementById('main-content').innerHTML = html;

  // ── All other zones ──
  } else {
    html = `
      <div class="slide-in">
        <div class="content-grid">
          <div class="scroll-card">
            <div class="scroll-label">// CASE FILE //</div>
            <div class="scroll-text">${narrationText}</div>
          </div>
          ${Z.character
            ? buildCharCard(Z.character)
            : '<div class="char-frame"><div class="char-empty"><span class="char-empty-icon">🎮</span>Characters unlock as you enter each district</div></div>'}
        </div>
        ${Z.mentiLink ? buildMentiLink(Z.mentiLink) : ''}
        ${buildVote(Z.vote)}
        ${buildRules(Z.rules)}
        ${Z.prompt ? buildPrompt(Z.prompt) : ''}
      </div>`;
    document.getElementById('main-content').innerHTML = html;
  }

  voteRevealed = false;

  const backBtn    = document.getElementById('back-btn');
  const nextBtn    = document.getElementById('next-btn');
  const diceResult = document.getElementById('dice-result');

  diceResult.textContent  = '';
  backBtn.style.display   = 'flex';

  if (zoneIndex === 5) {
    nextBtn.className   = 'nav-btn forward';
    nextBtn.textContent = '>> THE PLAYBOOK';
    nextBtn.onclick     = advanceToPlaybook;
  } else if (zoneIndex >= 6) {
    nextBtn.className   = 'nav-btn arrived';
    nextBtn.textContent = 'MISSION COMPLETE >>';
    nextBtn.onclick     = openFinishScreen;
  } else {
    nextBtn.className   = 'nav-btn forward';
    nextBtn.textContent = 'Next Level >>';
    nextBtn.onclick     = advanceDistrict;
  }
}


/* ============================================================
   7. BUILDER FUNCTIONS
   ============================================================ */

function buildCharCard(char) {
  if (!char) {
    return `
      <div class="char-frame">
        <div class="char-empty">
          <span class="char-empty-icon">🎮</span>
          Characters unlock as you enter each district
        </div>
      </div>`;
  }
  return `
    <div class="char-frame slide-in" onclick="openCharModal(${currentZone})" role="button" tabindex="0" aria-label="View ${char.name} character card">
      <div class="char-seal">
        ${char.image ? `<img src="${char.image}" alt="${char.name}" class="char-img">` : char.emoji}
      </div>
      <div class="char-name">${char.name}</div>
      <div class="char-title">${char.title}</div>
      <div class="char-bio">${char.bio}</div>
      ${char.phrase ? `<div class="char-phrase">${char.phrase}</div>` : ''}
    </div>`;
}

function buildVote(vote) {
  if (!vote) return '';
  return `
    <div class="vote-section">
      <div class="vote-header">// DISTRICT VOTE //</div>
      <div class="vote-question">${vote.question}</div>
      <div class="vote-row">
        <button class="vote-btn screen-in"  onclick="castVote()">${vote.optionA}</button>
        <button class="vote-btn screen-out" onclick="castVote()">${vote.optionB}</button>
      </div>
      <div class="vote-reveal" id="vote-reveal">${vote.reveal}</div>
    </div>`;
}

function buildRules(rules) {
  if (!rules) return '';
  const tiles = rules.map((r, i) => `
    <div class="rule-tile" onclick="openRuleModal(${i})" role="button" tabindex="0"
         aria-label="Open details for ${r.name}"
         onkeydown="if(event.key==='Enter'||event.key===' ')openRuleModal(${i})">
      <div class="rule-number">${r.num}</div>
      <div class="rule-name">${r.name}</div>
      <div class="rule-anchor">${r.anchor}</div>
      <div class="rule-callback">${r.callback}</div>
      <div class="rule-expand-hint">Tap to expand ↗</div>
    </div>`).join('');
  return `<div class="rules-grid">${tiles}</div>`;
}

function buildMentiLink(link) {
  if (!link) return '';
  return `
    <div class="menti-block">
      <div class="menti-label">// WORD CLOUD — BEFORE WE BEGIN //</div>
      <div class="menti-prompt">When someone says "AI" — what comes to mind?</div>
      <a class="menti-link" href="${link}" target="_blank" rel="noopener noreferrer">
        Open Mentimeter →
      </a>
      <div class="menti-sub">Opens in a new tab · As many words as you need · No right answer</div>
    </div>`;
}

function buildPrompt(prompt) {
  if (!prompt) return '';
  return `
    <div class="prompt-banner">
      <div class="prompt-anchor-icon">▶</div>
      <div>
        <div class="prompt-label">// DISCUSSION //</div>
        <div class="prompt-text">${prompt}</div>
      </div>
    </div>`;
}


/* ============================================================
   8. INTERACTION HANDLERS
   ============================================================ */

function castVote() {
  if (voteRevealed) return;
  voteRevealed = true;
  const reveal = document.getElementById('vote-reveal');
  if (reveal) reveal.classList.add('visible');
  document.querySelectorAll('.vote-btn').forEach(btn => btn.disabled = true);
}

function revealCaseFile() {
  const btn      = document.getElementById('district2-btn');
  const leftSlot = document.getElementById('district2-left');
  const reveal   = document.getElementById('district2-reveal');

  if (btn) btn.style.display = 'none';

  if (leftSlot) {
    leftSlot.outerHTML = `
      <div class="scroll-card slide-in">
        <div class="scroll-label">// CASE FILE //</div>
        <div class="scroll-text">${ZONES[2].narration ? ZONES[2].narration.replace(/\n\n/g, '<br><br>') : ''}</div>
      </div>`;
  }

  if (reveal) {
    reveal.style.display = 'block';
    reveal.classList.add('slide-in');
    window.scrollTo({ top: document.getElementById('main-content').offsetTop, behavior: 'smooth' });
  }
}

function revealFileCard() {
  const leftSlot      = document.getElementById('reveal-file-left');
  const reveal        = document.getElementById('reveal-file-content');
  const narrationText = ZONES[currentZone].narration
    ? ZONES[currentZone].narration.replace(/\n\n/g, '<br><br>')
    : '';

  if (leftSlot) {
    leftSlot.outerHTML = `
      <div class="scroll-card slide-in">
        <div class="scroll-label">// CASE FILE //</div>
        <div class="scroll-text">${narrationText}</div>
      </div>`;
  }

  if (reveal) {
    reveal.style.display = 'block';
    reveal.classList.add('slide-in');
    window.scrollTo({ top: document.getElementById('main-content').offsetTop, behavior: 'smooth' });
  }
}


/* ============================================================
   9. MODAL FUNCTIONS
   ============================================================ */

function openRuleModal(index) {
  const r             = RULE_DETAIL[index];
  const questionItems = r.questions.map(q => `<li>${q}</li>`).join('');

  document.getElementById('modal-content').innerHTML = `
    <div class="modal-header">
      <div class="modal-rule-num">${r.num} — ${r.anchor}</div>
      <div class="modal-rule-name">${r.name}</div>
    </div>
    <div class="modal-section modal-plain">
      <p>${r.plain}</p>
    </div>
    <div class="modal-section modal-questions">
      <div class="modal-section-label">Questions a site should be asking</div>
      <ul>${questionItems}</ul>
    </div>`;

  document.getElementById('rule-modal').classList.add('visible');
  document.body.classList.add('modal-open');
  document.getElementById('modal-close').focus();
}

function closeRuleModal() {
  document.getElementById('rule-modal').classList.remove('visible');
  document.body.classList.remove('modal-open');
}

function openCharModal(zoneIndex) {
  const char = ZONES[zoneIndex].character;
  if (!char) return;

  const box = document.getElementById('char-modal-box');
  box.style.setProperty('--char-accent', char.accent);

  const stats = char.stats ? char.stats.map(s => `
    <div class="char-stat">
      <div class="char-stat-label">${s.label}</div>
      <div class="char-stat-val">${s.val}</div>
    </div>`).join('') : '';

  document.getElementById('char-modal-content').innerHTML = `
    <div class="char-modal-header">
      <div class="char-modal-emoji">
        ${char.image ? `<img src="${char.image}" alt="${char.name}" class="char-modal-img">` : char.emoji}
      </div>
      <div>
        <div class="char-modal-name">${char.name.toUpperCase()}</div>
        <div class="char-modal-title">${char.title}</div>
      </div>
    </div>
    <div class="char-modal-body">
      <div class="char-modal-stats">${stats}</div>
      <div class="char-modal-bio">${char.bio}</div>
      ${char.phrase ? `<div class="char-modal-phrase">${char.phrase}</div>` : ''}
    </div>`;

  document.getElementById('char-modal').classList.add('visible');
  document.body.classList.add('modal-open');
  document.getElementById('char-modal-close').focus();
}

function closeCharModal() {
  document.getElementById('char-modal').classList.remove('visible');
  document.body.classList.remove('modal-open');
}

function openFinishScreen() {
  const row = document.getElementById('dr-complete');
  if (row) {
    row.classList.add('unlocked');
    row.querySelector('.district-lock').textContent = 'UNLOCKED';
  }
  document.getElementById('finish-score-val').textContent = String(score).padStart(6, '0');
  document.getElementById('finish-overlay').classList.add('visible');
  document.body.classList.add('modal-open');
}

function closeFinishScreen() {
  document.getElementById('finish-overlay').classList.remove('visible');
  document.body.classList.remove('modal-open');

  gameStarted       = false;
  currentZone       = 0;
  score             = 0;
  district5Screen   = 1;
  onMissionBriefing = false;

  // Reset all district rows to locked
  document.querySelectorAll('.district-row').forEach(row => {
    row.classList.remove('unlocked', 'active');
    const lock = row.querySelector('.district-lock');
    if (lock) lock.textContent = 'LOCKED';
  });

  // Keep Mission Briefing always available
  const briefingRow = document.getElementById('dr-briefing');
  if (briefingRow) {
    briefingRow.classList.add('unlocked');
    briefingRow.querySelector('.district-lock').textContent = 'AVAILABLE';
  }

  document.getElementById('start-screen').style.display  = 'flex';
  document.getElementById('main-content').innerHTML       = '';
  document.getElementById('unlock-banner').classList.remove('visible');
  document.getElementById('back-btn').style.display       = 'none';
  document.getElementById('next-btn').className           = 'nav-btn forward';
  document.getElementById('next-btn').textContent         = 'Next Level >>';
  document.getElementById('next-btn').onclick             = advanceDistrict;
  document.getElementById('nav-deck').style.display       = 'none';
  updateHUD(0);
}

// Keyboard: close modals on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeRuleModal();
    closeCharModal();
    closeFinishScreen();
  }
});


/* ============================================================
   10. INIT
   ============================================================ */

updateHUD(0);
document.getElementById('nav-deck').style.display = 'none';
