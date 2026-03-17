// 1. KÜRESEL SES TETİKLEYİCİ (Tarayıcı Engelini Aşmak İçin)
window.addEventListener('click', () => {
    const bgm = document.getElementById('bgm');
    if (bgm && bgm.paused && !muted) {
        bgm.play().catch(() => {});
    }
}, { once: true });

const QUESTIONS = {
    standard: [
        { 
            title: "Project-E-mail",
            content: "Betreft: Lancering Project Icarus. Budget: €1.2M. Belangrijkste contact: Mark de Groot (mark@bedrijf.nl).", 
            choices: [
                {t: "Vraag AI om feedback", r: 45, err: "FOUT: Projectnamen en specifieke budgetten mogen niet in AI."}, 
                {t: "Stuur naar collega", r: -10}
            ],
            fact: "REAL CASE: Samsung medewerkers deelden per ongeluk gevoelige projectnotulen met ChatGPT ter verbetering."
        },
        { 
            title: "Klantenservice Ticket",
            content: "Gebruiker: Sophie Jansen. Probleem: Kan niet inloggen met BSN 123456789. Gebruikt browser Chrome.", 
            choices: [
                {t: "Analyseer via AI-bot", r: 50, err: "AVG LEK: Je hebt een BSN nummer gedeeld met een externe cloud service."}, 
                {t: "Maskeer BSN & help", r: -15}
            ],
            fact: "WETGEVING: Het BSN is een uniek persoonsgegeven dat onder de AVG de allerhoogste bescherming geniet."
        },
        { 
            title: "Vakantiefoto LinkedIn",
            content: "Selfie op je nieuwe thuiswerkplek. Op de achtergrond hangt een post-it met het AI-wachtwoord.", 
            choices: [
                {t: "Post direct", r: 35, err: "SECURITY: Wachtwoorden of inlogcodes op de achtergrond zijn een goudmijn voor hackers."}, 
                {t: "Verwijder post-it", r: -5}
            ],
            fact: "FACT: Visuele lekken op social media zijn verantwoordelijk voor 15% van de bedrijfsgerelateerde hacks."
        },
        { 
            title: "Gratis AI PDF Tool",
            content: "Upload het jaarverslag (concept) naar 'PDF-AI-Reader' om een samenvatting te maken.", 
            choices: [
                {t: "Bestand uploaden", r: 40, err: "DATA RISICO: Gratis online tools slaan vaak je documenten op hun eigen servers op."}, 
                {t: "Zelf samenvatten", r: -10}
            ],
            fact: "SECURITY: Veel 'gratis' AI-readers verkopen de geüploade data door aan data-brokers."
        },
        { 
            title: "AI Chrome Extensie",
            content: "Installeer 'SmartCompose AI' om sneller te typen in je zakelijke mailbox.", 
            choices: [
                {t: "Nu installeren", r: 30, err: "RISICO: Deze extensie kan alles lezen wat je typt (keylogging risico)."}, 
                {t: "Alleen op privé PC", r: -5}
            ],
            fact: "REAL CASE: Malafide browser-extensies zijn een veelgebruikte methode om bedrijfsgeheimen te stelen."
        }
    ],
    corporate: [
        { 
            title: "NIS2 - Meldingsplicht",
            content: "Er is een potentieel AI-datalek ontdekt. De directie wil eerst 3 dagen intern onderzoek doen.", 
            choices: [
                {t: "Wacht op onderzoek", r: 60, err: "NIS2 SCHENDING: Je moet significante incidenten binnen 24u melden."}, 
                {t: "Meld direct (24u)", r: -30}
            ],
            fact: "REGULERING: Onder de nieuwe NIS2-richtlijn riskeren bedrijven miljoenenboetes bij te late melding."
        },
        { 
            title: "BIO2 - Data Opslag",
            content: "Onze AI-oplossing gebruikt servers in de VS. Is dit toegestaan voor Nederlandse overheidsdata?", 
            choices: [
                {t: "Ja, mits versleuteld", r: 55, err: "BIO2 FOUT: Kritieke data moet binnen de EU-grenzen blijven."}, 
                {t: "Nee, eis EU-servers", r: -20}
            ],
            fact: "SOEVEREINITEIT: De Cloud Act in de VS geeft hun overheid toegang tot data op Amerikaanse servers."
        },
        { 
            title: "AI Algoritme Bias",
            content: "Een AI-systeem wijst automatisch cv's af van een specifieke postcode zonder menselijke controle.", 
            choices: [
                {t: "Systeem behouden", r: 45, err: "ETHISCHE FOUT: Geautomatiseerde discriminatie is verboden onder de AI-Act."}, 
                {t: "Menselijke review", r: -20}
            ],
            fact: "REAL CASE: De Toeslagenaffaire is een pijnlijk voorbeeld van algoritmes die groepen uitsluiten."
        },
        { 
            title: "Supply Chain Audit",
            content: "Je AI-leverancier weigert een security-audit omdat ze 'gecertificeerd' zijn door een onbekende partij.", 
            choices: [
                {t: "Vertrouw certificaat", r: 40, err: "NIS2 RISICO: Je bent wettelijk verantwoordelijk voor de veiligheid van je keten."}, 
                {t: "Eis onafhankelijke audit", r: -15}
            ],
            fact: "SUPPLY CHAIN: 60% van de inbraken begint bij een kwetsbaarheid bij een toeleverancier."
        },
        { 
            title: "DPIA Biometrie",
            content: "Directie wil AI-gezichtsherkenning invoeren voor kantoortoegang zonder privacy-onderzoek.", 
            choices: [
                {t: "Direct implementeren", r: 50, err: "WETTELIJKE FOUT: Biometrische data vereist ALTIJD een DPIA vooraf."}, 
                {t: "DPIA procedure starten", r: -30}
            ],
            fact: "PRIVACY: Biometrische gegevens zijn 'bijzondere persoonsgegevens' met de strengste regels."
        }
    ]
};

let currentIdx = 0, risk = 0, maskedCount = 0, activePool = [], muted = false, currentAgent = "";
const bgm = document.getElementById('bgm');
const sfx = document.getElementById('sfxAlert');
const video = document.getElementById('introVideo');

// ÖNEMLİ: Yerel dosya yolunu burada tekrar tanımlıyoruz
if(bgm) {
    bgm.src = "assets/bg-music.mp3";
    bgm.load();
}

document.getElementById('btnStart').onclick = () => {
    const nameInput = document.getElementById('agent-name').value.trim();
    if(!nameInput) { 
        alert("ACCESS DENIED: Enter Agent Name!"); 
        return; 
    }
    
    currentAgent = nameInput;
    const isCorp = document.getElementById('corporate-mode').checked;
    activePool = isCorp ? QUESTIONS.corporate : QUESTIONS.standard;
    currentIdx = 0;
    
    document.getElementById('intro-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    addLog(`Agent ${currentAgent} initialized.`, false);

    // MEDYA MOTORUNU BAŞLAT
    if (video) {
        video.muted = false;
        video.play().catch(() => {});
    }

    if (bgm && !muted) {
        bgm.volume = 0.4;
        bgm.play().then(() => {
            addLog("Audio Engine: Online.", false);
        }).catch(() => {
            addLog("Audio Engine: Standby. Click screen.", true);
            // Yedek plan
            const runAudio = () => {
                bgm.play();
                addLog("Audio Engine: Online.", false);
                document.removeEventListener('click', runAudio);
            };
            document.addEventListener('click', runAudio);
        });
    }

    loadMission();
};

function loadMission() {
    const q = activePool[currentIdx];
    document.getElementById('task-name').textContent = q.title;
    document.getElementById('inspection-box').innerHTML = q.content.split(' ').map(w => `<span class="word" onclick="mask(this)">${w}</span>`).join(' ');
    
    const grid = document.getElementById('choice-grid');
    grid.innerHTML = '';
    q.choices.forEach(c => {
        const btn = document.createElement('button');
        btn.className = "btn-action";
        btn.textContent = c.t;
        btn.onclick = () => makeDecision(c, q.fact);
        grid.appendChild(btn);
    });
}

function mask(el) {
    if(!el.classList.contains('masked')) {
        el.classList.add('masked');
        maskedCount++;
        addLog("Data bit encrypted.", false);
    }
}

function makeDecision(choice, fact) {
    risk += choice.r;
    updateUI();
    if(choice.r > 0) {
        if(!muted && sfx) sfx.play().catch(() => {});
        addLog(`VIOLATION: ${choice.err}`, true);
        document.getElementById('modal-header').style.color = "#ff4444";
        document.getElementById('modal-header').textContent = "⚠️ SECURITY BREACH";
    } else {
        addLog("Compliance confirmed.", false);
        document.getElementById('modal-header').style.color = "#00ff88";
        document.getElementById('modal-header').textContent = "✅ ANALYSIS COMPLETE";
    }
    document.getElementById('fact-body').textContent = fact;
    document.getElementById('fact-modal').classList.remove('hidden');
}

function updateUI() {
    document.getElementById('risk-val').textContent = risk;
    document.getElementById('meter-fill').style.height = Math.min(Math.max(risk,0), 100) + "%";
    const badge = document.getElementById('badge-val');
    badge.textContent = risk > 60 ? "CRITICAL" : "CERTIFIED";
    badge.className = risk > 60 ? "v-val insecure" : "v-val secure";
}

document.getElementById('btnNext').onclick = () => {
    document.getElementById('fact-modal').classList.add('hidden');
    currentIdx++;
    if(currentIdx < activePool.length) loadMission();
    else finish();
};

function addLog(msg, isErr) {
    const log = document.getElementById('log-content');
    if(!log) return;
    const div = document.createElement('div');
    div.className = isErr ? "log-entry error" : "log-entry";
    div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    log.prepend(div);
}

function finish() {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    document.getElementById('final-risk').textContent = risk;
    document.getElementById('final-mask').textContent = maskedCount;

    let scores = JSON.parse(localStorage.getItem('agentScores')) || [];
    scores.push({name: currentAgent, risk: risk, masked: maskedCount, mode: document.getElementById('corporate-mode').checked ? "Corp" : "Std"});
    scores.sort((a,b) => a.risk - b.risk);
    localStorage.setItem('agentScores', JSON.stringify(scores.slice(0, 8)));
    
    const list = document.getElementById('leaderboard-list');
    if(list) {
        list.innerHTML = scores.slice(0, 8).map((s) => `
            <div class="score-item ${s.name === currentAgent ? 'highlight' : ''}">
                <span>${s.name} (${s.mode})</span>
                <span>R: ${s.risk} | M: ${s.masked}</span>
            </div>
        `).join('');
    }
}

document.getElementById('toggle-sound').onclick = () => {
    muted = !muted;
    document.getElementById('toggle-sound').textContent = muted ? "🔇 GELUID: UIT" : "🔊 GELUID: AAN";
    if (bgm) muted ? bgm.pause() : bgm.play().catch(() => {});
};