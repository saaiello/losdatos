/* ============================================================
   LOS DATOS — GAME LOGIC
   ============================================================ */

// ── Game state ──
let currentZone  = 0;
let voteRevealed = false;
let score        = 0;
let gameStarted  = false;
let onMissionBriefing = false;
let district5Screen   = 1;

// ── Full rule data for modal overlays ──
const RULE_DETAIL = [
  {
    num: "Rule I",
    name: "Get everyone in the huddle",
    anchor: "Shared Mission, Vision & Goals",
    plain: "Before a tool is selected, the people most affected need to be in the room. That means frontline staff, supervisors, families with lived experience, community advocates, and tribal partners. A tool adopted without stakeholder input will face resistance no amount of training can fix after the fact.",
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
    name: "Know whose data you're using",
    anchor: "Efficient Cross-Systems Communication",
    plain: "Every predictive risk model is only as good as the data it was trained on. A model built from child welfare, criminal, legal, and public benefits records will reflect the history of those systems — including their documented patterns of racial and economic disparity. That's not a flaw that better technology can fix. It's a structural feature of building prediction engines on systems data.",
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
    name: "Train everybody, not just the tech team",
    anchor: "Ongoing Cross-Training & Staff Development",
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
    name: "Keep the family at the center",
    anchor: "Family-Centered Treatment & Recovery Support",
    plain: "A predictive risk tool generates a score about a family. It does not generate a plan for a family. The moment a score starts substituting for genuine engagement with the people behind it, their strengths, their context, their history, their goals, the tool has stopped serving the family and started replacing them. Families are not data points.",
    questions: [
      "Are families informed when a predictive risk tool is being used in decisions about them?",
      "Do families have any mechanism to understand or contest a score?",
      "How does the agency ensure that SUD treatment engagement is read as a strength, not a risk factor?",
      "Is there a mechanism for the screener to flag contextual information that the score can't capture — like an active home visiting program — before the decision is made?",
    ]
  },
  {
    num: "Rule V",
    name: "Watch the replay",
    anchor: "Measuring & Monitoring Outcomes",
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
    name: "Build it to last — or don't build it at all",
    anchor: "Sustainability & Institutionalization",
    plain: "A predictive risk tool deployed without a sustainability plan is not a modernization strategy, it's a liability. Sustainability means building the governance structures, the staff capacity, the monitoring infrastructure, and the community trust a tool of this consequence requires over the long term. And it means being willing to ask the hardest question before deployment: if we can't commit to maintaining this responsibly, should we be deploying it at all?",
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

// ── Zone data ──
const ZONES = [
  { //ZONE ZERO
    id: 0,
    name: "Los Datos",
    time: "5 min",
    narration: `Welcome to Los Datos. Before we begin — when I say the word "AI," what comes to mind?

    Most people picture ChatGPT, Gemini, a chatbot. That's generative AI — the kind that creates content, writes text, generates images. Think of it like a very sophisticated game of "finish this sentence," except it's played billions of times, across billions of documents, until the system gets very good at knowing what tends to come next. That's real, and we can talk about it another time.

    What we're really here for today is something different. Something quieter. Something already inside child welfare systems across this country. It doesn't write anything. It doesn't talk. It assigns a number. And that number can change what happens to a family.`,
    character: null,
    mentiLink: "https://www.menti.com/PLACEHOLDER",
    prompt: null,
    vote: null,
    rules: null,
  },
  { // ZONE ONE
    id: 1,
    name: "District 1 — The Call",
    time: "10 min",
    narration: `A referral comes in. A neighbor called the hotline about the Washington family. She said the kids, ages 6 and 8, were knocking on her door saying they were hungry. Denise Washington, a Black mother in her 30s, wasn't home. The neighbor didn't know where she was, just that she leaves some evenings. The neighbor said she's seen different people coming and going from the apartment, and that she's pretty sure Denise had a prior drug problem, but she’s been clean for months. The kids looked clean and healthy.<br><br>
    Maya picks up the call. She gathers the information, validates it, cross-checks it against the data warehouse. She sees Denise receives housing assistance and Medicaid. She sees prior CPS contact; the allegation was unsubstantiated. She also sees a flag that Denise is actively enrolled with a community support treatment program that is known to complete home visits. Once the referral is complete, she runs the score and within seconds, a number appears on her screen. The number is 17.`,
    character: {
      emoji: "👩🏽‍💼",
      name: "Maya",
      title: "The Case Manager",
      accent: "#4cc9f0",
      image: "assets/maya.png",
      stats: [
      { label: "EXPERIENCE", val: "11 Years" },
      { label: "CASELOAD", val: "80+ / Week" },
    ],
      bio: "Maya has worked in child welfare for 11 years. She screens more than 80 referrals a week. She's good at her job — but no one could be consistent across that volume with only their own judgment and a checklist. Maya is why predictive risk models exist. She is not the problem. She is the human condition.",
      phrase: null,
    },
    charOrder: "first",
    prompt: null,
    mentiLink: null,
    vote: null,
    rules: null,
  },
  {// ZONE TWO
    id: 2,
    name: "District 2 — The Score",
    time: "10 min",
    narration: `The Allegheny Family Screening Tool was trained on data from 77,000 referrals. The algorithm looked at 800 data points such as: prior CPS referrals, behavioral health records, housing assistance, jail records and juvenile probation. That then becomes a score from 1 to 20.<br><br>
    A score of 18–20, with a child under 16 in the home, is High-Risk Protocol — default screen in. A score of 1–12, with kids over 7: Low-Risk Protocol — default screen out. Maya still has discretion. Her supervisor still makes the call.<br><br>`,
    character: {
      emoji: "🤖",
      name: "Al the Algorithm",
      title: "The PRM Tool",
      accent: "#f8c400",
      image: "assets/al.png",
      stats: [
      { label: "DATA POINTS", val: "800" },
      { label: "SCALE", val: "1 to 20" },
    ],
      bio: "Al is not evil. Al is not even conscious. He is a statistical model trained on nearly 77,000 referrals from the past. He has 800 data points on Denise's household and gives Maya a number between 1 and 20. Al genuinely believes he is helping but he only knows what he's been shown. He gives Denise Washington a score of 17 out of 20.",
      phrase: "\"I have 800 data points on this.\"",
    },
    charOrder: "before-vote",
    prompt: null,
    mentiLink: null,
    vote: {
      question: "Maya sees the number. Denise's score is 17 — if you were Maya, what would you do?",
      optionA: "Screen In",
      optionB: "Screen Out",
      reveal: "Here's the thing about that vote — it doesn't matter which way you went. What matters is what was driving it. Were you following the score? Were you second-guessing it? Were you thinking about Denise — what you know about her, what you don't? The question isn't what Al says. The question is whether Al's score informs Maya's judgment — or replaces it.",
    },
    rules: null,
  },
  {// ZONE THREE
    id: 3,
    name: "District 3 — The Weight",
    time: "12 min",
    narration: `Think about what went into Denise's score. Prior CPS contact. Housing assistance. Medicaid. Behavioral health records.<br><br>
    Now ask the real question, <i>whose historical data did Al learn from?</i> Vera's files.<br><br>
    And Vera's files exist because certain families had more contact with systems that generate records. Those systems have had the most contact with families who are poor, Black, Indigenous, and reliant on government services to survive. Not because those families have more risk but because they've been seen more.`,
    character: {
      emoji: "📚",
      name: "Vera the Data",
      title: "The Training Data",
      accent: "#a855f7",
      image: "assets/vera.png",
      stats: [
      { label: "FILES", val: "100,000+" },
      { label: "BLIND SPOT", val: "The Unseen" },
    ],
      bio: "Vera is a meticulous librarian. She has files on hundreds of thousands of families. She is thorough and organized — but she only has records from families who touched a government system. She has no files on families who never called a hotline, never applied for housing assistance, never interacted with the criminal legal system, behavioral health system, or public benefits systems. She isn't lying. She's just incomplete. And she doesn't know what she doesn't know.",
      phrase: "\"I only have files on families the system already knew.\"",
    },
    charOrder: "reveal-file",
    prompt: null,
    mentiLink: null,
    vote: null,
    rules: null,
  },
  {// ZONE FOUR
    id: 4,
    name: "District 4 — The Gap",
    time: "8 min",
    narration: `So, if the data is biased, and the pattern Al learned is a pattern of surveillance, does that mean the tool makes things worse? That's the honest question.<br><br>
    Allegheny County's 2024 research found after implementing the tool, racial disparities in screening rates decreased.<br><br>
    But here's the question that data can't answer: <i>what is the tool actually predicting?</i> And its not whether a child will be harmed. It's whether a child will be removed and those are not the same thing. A child can be removed without ever being in danger and a child can be in danger without ever being removed.<br><br>
    So, the goal isn't to get rid of the tool. It's to be honest about what it measures, and what it doesn't.`,
    character: {
      emoji: "👔",
      name: "The Supervisor",
      title: "The Protocol Layer",
      accent: "#fb923c",
      image: "assets/supervisor.png",
      stats: [
      { label: "DECISIONS", val: "80+ / Week" },
      { label: "OVERRIDE", val: "Possible" },
    ],
      bio: "The Supervisor is the policy layer. And at a score of 17, there is no default policy, no automatic answer.<br><br> Maya brings the referral, the data, and the score. The Supervisor brings oversight, accountability, and the authority to make the call. Together they're supposed to ask: what do we know, what don't we know, and what does this family actually need?<br><br>A score of 17 should be starting a conversation. Not ending one. And how well that conversation goes depends entirely on whether the conditions are in place for it to even happen",
      phrase: "Two people. One number. No easy answer.",
    },
    charOrder: "first",
    prompt: null,
    mentiLink: null,
    vote: null,
    rules: null,
  },
  {// ZONE FIVE
    id: 5,
    name: "District 5 — The Table",
    time: "15 min",
    narration: `AI is not going away. PRMs are already in more than 2 dozen states with more and more sites considering them. The question isn't whether to use the technology. The question is, <i>what conditions have to be in place before you do?</i><br><br>
    Now, does anyone have any idea of something we may already have in place, that can answer that question?


    CFF already has the framework to answer that. We didn't need to build a new framework for AI. We just need to apply the one we already have.

    These are the Rules of Engagement.`,
    character: {
      emoji: "📋",
      name: "The Playbook Coach",
      title: "CFF's Voice",
      accent: "#4ade80",
      image: "assets/coach.png",
      stats: [
      { label: "FRAMEWORK", val: "CFF" },
      { label: "APPROACH", val: "TA & Training" },
    ],
      bio: "The Playbook Coach doesn't have all the answers. But they have the right questions — and they know which framework to reach for. They've been working at the SUD–child welfare intersection for decades. They know what families need. They know how systems fail them. And they know what good TA looks like.",
      phrase: "The Coach doesn't hand you a play and walk away.",
    },
    charOrder: "first",
    mentiLink: null,
    vote: null,
    rules: null,
  },
  {// ZONE SIX
    id: 6,
    name: "District 5 — Rules of Engagement",
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

// ── Map update ──
function updateHUD(zoneIndex) {
  const zoneNames = [
    'DISTRICT 0',
    'DISTRICT 1 — THE CALL',
    'DISTRICT 2 — THE SCORE',
    'DISTRICT 3 — THE WEIGHT',
    'DISTRICT 4 — THE GAP',
    'DISTRICT 5 — THE TABLE'
  ];
  document.getElementById('zone-label').textContent = zoneNames[zoneIndex];

  for (let i = 0; i <= 4; i++) {
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
  const navDeck = document.getElementById('nav-deck');
  // hide nav when on start screen (zone 0 and game not started)
}

function startGame() {
  gameStarted = true;
  const startScreen = document.getElementById('start-screen');
  startScreen.style.display = 'none';
  document.getElementById('nav-deck').style.display = 'flex';
  showMissionBriefing();
}

function jumpToDistrict(zoneIndex) {
  gameStarted = true;
  onMissionBriefing = false;
  district5Screen = 1;
  document.getElementById('start-screen').style.display = 'none';
  currentZone = zoneIndex;
  updateHUD(zoneIndex);
  renderZone(zoneIndex);
  document.getElementById('back-btn').style.display = 'flex';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function returnToStart() {
  if (!gameStarted && !onMissionBriefing) return;
  gameStarted = false;
  onMissionBriefing = false;
  currentZone = 0;
  district5Screen = 1;
  document.getElementById('start-screen').style.display = 'flex';
  document.getElementById('main-content').innerHTML = '';
  document.getElementById('unlock-banner').classList.remove('visible');
  document.getElementById('back-btn').style.display = 'none';
  document.getElementById('next-btn').className = 'nav-btn forward';
  document.getElementById('next-btn').textContent = 'Next Level >>';
  document.getElementById('next-btn').onclick = advanceDistrict;
  updateHUD(0);
  document.getElementById('nav-deck').style.display = 'none';
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
      ${buildMentiLink("https://www.menti.com/PLACEHOLDER")}
    </div>`;

  const backBtn = document.getElementById('back-btn');
  const nextBtn = document.getElementById('next-btn');

  backBtn.style.display = 'flex';
  nextBtn.className   = 'nav-btn forward';
  nextBtn.textContent = '>> DEPLOY';
  nextBtn.onclick     = launchDistrict1;
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

function advanceDistrict5Screen() {
  district5Screen = 2;
  document.getElementById('zone-label').textContent = 'DISTRICT 5 — RULES OF ENGAGEMENT';

  document.getElementById('main-content').innerHTML = `
    <div class="slide-in">
      <div class="rules-header">// RULES OF ENGAGEMENT //</div>
      ${buildRules(ZONES[6].rules)}
      ${buildPrompt(ZONES[6].prompt)}
    </div>`;

  const nextBtn = document.getElementById('next-btn');
  nextBtn.className   = 'nav-btn arrived';
  nextBtn.textContent = 'MISSION COMPLETE >>';
  nextBtn.onclick     = openFinishScreen;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function addPoints(points) {
  score += points;
  const scoreDisplay = document.getElementById('score-display');
  if (scoreDisplay) {
    scoreDisplay.textContent = String(score).padStart(6, '0');
  }
}

// ── Build character card HTML ──
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

// ── Build vote section HTML ──
function buildVote(vote) {
  if (!vote) return '';
  return `
    <div class="vote-section">
      <div class="vote-header">⚔ Crew Vote</div>
      <div class="vote-question">${vote.question}</div>
      <div class="vote-row">
        <button class="vote-btn screen-in" onclick="castVote()">${vote.optionA}</button>
        <button class="vote-btn screen-out" onclick="castVote()">${vote.optionB}</button>
      </div>
      <div class="vote-reveal" id="vote-reveal">${vote.reveal}</div>
    </div>`;
}

// ── Build rules grid HTML ──
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

// ── Build Mentimeter link block ──
function buildMentiLink(link) {
  if (!link) return '';
  return `
    <div class="menti-block">
      <div class="menti-label">//🎮 WORD CLOUD - BEFORE WE BEGIN //</div>
      <div class="menti-prompt">When I say "AI" — what comes to mind? Add your answer:</div>
      <a class="menti-link" href="${link}" target="_blank" rel="noopener noreferrer">
        Open Mentimeter →
      </a>
      <div class="menti-sub">Opens in a new tab · One or two words · No right answer</div>
    </div>`;
}

// ── Build discussion prompt HTML ──
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

// ── Anchor text lookup ──
function getAnchorText(index) {
  const anchors = [
    "CFF's Comprehensive Framework has always held that effective cross-system collaboration starts with shared mission, vision, and goals — before services are designed, before contracts are signed, before tools are selected. That principle doesn't change because the tool is algorithmic. A predictive risk model encodes assumptions about what a child welfare system is trying to accomplish. If your agency hasn't explicitly named those goals and gotten buy-in across stakeholders, you have no foundation to evaluate whether a tool serves them or undermines them.",
    "CFF's Comprehensive Framework emphasizes efficient cross-systems communication as a foundation for effective service delivery — and that means understanding not just what data systems share, but what they don't. CFF has spent decades helping sites understand how information flows — and doesn't flow — across systems. That expertise is exactly what's needed when a site is evaluating whether a PRM's data sources reflect the full picture of the families they serve.",
    "CFF's Comprehensive Framework places ongoing cross-training and staff development at the center of systems change work — not as a one-time event but as a continuous organizational practice. Predictive risk tools aren't static. They're recalibrated over time, their outputs shift as agency data changes, and the policy protocols around them evolve. The framework's emphasis on ongoing development is precisely the standard sites need to hold vendors and administrators accountable to.",
    "Family-centered treatment and recovery support is not a program model in CFF's framework — it's a values orientation that runs through every element of the work. It holds that families are the experts on their own lives, that services should be built around their strengths and needs, and that the relationship between a family and the people serving them is itself a mechanism of change. A predictive risk tool has no relationship with a family. It has a score. CFF's framework is unambiguous about which one drives outcomes.",
    "CFF's Comprehensive Framework places measuring and monitoring outcomes at the center of sustained systems change — not as an evaluation add-on but as an ongoing organizational practice. Monitoring a predictive risk tool means more than tracking overall accuracy rates. It means disaggregating performance data by race, ethnicity, and socioeconomic status to detect subpopulation disparities that aggregate metrics can hide, and building feedback loops between frontline workers and the people who maintain the model.",
    "Sustainability and institutionalization in CFF's Comprehensive Framework isn't about keeping programs alive for their own sake — it's about ensuring that the structures, practices, and values that produce good outcomes for families become embedded in how a system operates, regardless of who is leading it or what the funding climate looks like. A tool that operates without institutionalized governance, recalibration processes, and accountability mechanisms will degrade — quietly, consistently, and consequentially."
  ];
  return anchors[index] || '';
}

// ── Open rule modal ──
function openRuleModal(index) {
  const r = RULE_DETAIL[index];
  const questionItems = r.questions.map(q => `<li>${q}</li>`).join('');
  const modal = document.getElementById('rule-modal');
  const modalContent = document.getElementById('modal-content');

  modalContent.innerHTML = `
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

  modal.classList.add('visible');
  document.body.classList.add('modal-open');
  document.getElementById('modal-close').focus();
}

// ── Close rule modal ──
function closeRuleModal() {
  const modal = document.getElementById('rule-modal');
  modal.classList.remove('visible');
  document.body.classList.remove('modal-open');
}

function openCharModal(zoneIndex) {
  const char = ZONES[zoneIndex].character;
  if (!char) return;

  const modal = document.getElementById('char-modal');
  const box   = document.getElementById('char-modal-box');

  box.style.setProperty('--char-accent', char.accent);

  const stats = char.stats.map(s => `
    <div class="char-stat">
      <div class="char-stat-label">${s.label}</div>
      <div class="char-stat-val">${s.val}</div>
    </div>`).join('');

  document.getElementById('char-modal-content').innerHTML = `
    <div class="char-modal-header">
      <div class="char-modal-emoji">${char.image ? `<img src="${char.image}" alt="${char.name}" class="char-modal-img">` : char.emoji}</div>
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

  modal.classList.add('visible');
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

  const finishVal = document.getElementById('finish-score-val');
  finishVal.textContent = String(score).padStart(6, '0');
  document.getElementById('finish-overlay').classList.add('visible');
  document.body.classList.add('modal-open');
}

function closeFinishScreen() {
  document.getElementById('finish-overlay').classList.remove('visible');
  document.body.classList.remove('modal-open');
  gameStarted = false;
  currentZone = 0;
  score = 0;
  district5Screen = 1;
  onMissionBriefing = false
  // Reset all district rows to locked
  const allRows = document.querySelectorAll('.district-row');
  allRows.forEach(row => {
    row.classList.remove('unlocked', 'active');
    const lock = row.querySelector('.district-lock');
    if (lock) lock.textContent = 'LOCKED';
    document.getElementById('nav-deck').style.display = 'none';
  });

  // Keep Mission Briefing always available
  const briefingRow = document.getElementById('dr-briefing');
  if (briefingRow) {
    briefingRow.classList.add('unlocked');
    const lock = briefingRow.querySelector('.district-lock');
    if (lock) lock.textContent = 'AVAILABLE';
  }
  document.getElementById('start-screen').style.display = 'flex';
  document.getElementById('main-content').innerHTML = '';
  document.getElementById('unlock-banner').classList.remove('visible');
  document.getElementById('back-btn').style.display = 'none';
  document.getElementById('next-btn').className = 'nav-btn forward';
  document.getElementById('next-btn').textContent = 'Next Level >>';
  document.getElementById('next-btn').onclick = advanceDistrict;
  updateHUD(0);
}

// ── Render a zone ──
function renderZone(zoneIndex) {
  const Z = ZONES[zoneIndex];

  document.getElementById('time-label').textContent = Z.time;

  const narrationText = Z.narration ? Z.narration.replace(/\n\n/g, '<br><br>') : '';

  let html = '';

  if (zoneIndex === 4) {
    html = `
      <div class="slide-in">
        <div class="content-grid">
          <div class="scroll-card">
            <div class="scroll-label">// CASE FILE //</div>
            <div class="scroll-text">${narrationText}</div>
          </div>
          <div class="char-frame">
            <div class="char-empty">
              <span class="char-empty-icon">🎮</span>
              Character unlocks after briefing
              <button class="reveal-btn" id="reveal-supervisor">
                >> REVEAL CHARACTER
              </button>
            </div>
          </div>
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

  } else {
    // All other districts
    html = `
      <div class="slide-in">
        <div class="content-grid">
          <div class="scroll-card">
            <div class="scroll-label">// CASE FILE //</div>
            <div class="scroll-text">${narrationText}</div>
          </div>
          ${Z.character ? buildCharCard(Z.character) : '<div class="char-frame"><div class="char-empty"><span class="char-empty-icon">🎮</span>Characters unlock as you enter each district</div></div>'}
        </div>
        ${Z.mentiLink ? buildMentiLink(Z.mentiLink) : ''}
        ${buildVote(Z.vote)}
        ${buildRules(Z.rules)}
        ${Z.prompt ? buildPrompt(Z.prompt) : ''}
      </div>`;

    document.getElementById('main-content').innerHTML = html;
  }

  voteRevealed = false;

  const backBtn = document.getElementById('back-btn');
  const nextBtn = document.getElementById('next-btn');
  const diceDisplay = document.getElementById('dice-result');

  diceDisplay.textContent = '';
  backBtn.style.display = 'flex';

  if (zoneIndex === 5) {
    nextBtn.className   = 'nav-btn forward';
    nextBtn.textContent = 'Next Level >>';
    nextBtn.onclick     = advanceDistrict5Screen;
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

// ── Crew vote ──
function castVote() {
  if (voteRevealed) return;
  voteRevealed = true;
  const reveal = document.getElementById('vote-reveal');
  if (reveal) reveal.classList.add('visible');
  document.querySelectorAll('.vote-btn').forEach(btn => btn.disabled = true);
}

function revealCaseFile() {
  const btn = document.getElementById('district2-btn');
  const leftSlot = document.getElementById('district2-left');
  const reveal = document.getElementById('district2-reveal');

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
  const leftSlot = document.getElementById('reveal-file-left');
  const reveal = document.getElementById('reveal-file-content');
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

// ── Advance Level ──
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

function showUnlockBanner() {
  const Z = ZONES[currentZone];
  if (!Z.character) return;

  const banner = document.getElementById('unlock-banner');
  banner.textContent = '★ NEW CHARACTER UNLOCKED — ' + Z.character.name.toUpperCase() + ' ★';
  banner.classList.add('visible');

  setTimeout(() => {
    banner.classList.remove('visible');
  }, 3000);
}

// ── Go back ──
function goBack() {
  if (!gameStarted) return;
  if (currentZone <= 0 && !onMissionBriefing) return;

  // From mission briefing — back to start screen
  if (onMissionBriefing) {
    onMissionBriefing = false;
    gameStarted = false;
    document.getElementById('main-content').innerHTML = '';
    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('back-btn').style.display = 'none';
    document.getElementById('next-btn').className = 'nav-btn forward';
    document.getElementById('next-btn').textContent = 'Next Level >>';
    document.getElementById('next-btn').onclick = advanceDistrict;
    updateHUD(0);
    return;
  }

// From District 1 — back to mission briefing
  if (currentZone === 1) {
    currentZone = 0;
    showMissionBriefing();
    return;
  }

  // From District 5 Screen 2 — back to Screen 1
  if (district5Screen === 2) {
    district5Screen = 1;
    updateHUD(5);
    renderZone(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  // Default — go back one district
  currentZone--;
  updateHUD(currentZone);
  renderZone(currentZone);

  const nextBtn = document.getElementById('next-btn');
  nextBtn.className   = 'nav-btn forward';
  nextBtn.textContent = 'Next Level >>';
  nextBtn.onclick     = advanceDistrict;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Keyboard: close modal on Escape ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeRuleModal();
    closeCharModal();
    closeFinishScreen();
  }
});

// ── Init ──
updateHUD(0);
document.getElementById('nav-deck').style.display = 'none';
