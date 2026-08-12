async function loadThermometer() {
    const res = await fetch("data/news.json");
    const data = await res.json();

    const news = data.slice(0, 10);

    let score = 50;
    let factors = [];

    news.forEach(n => {
        if (n.category === "fraud") {
            score += 10;
            factors.push("зростання шахрайства");
        }
        if (n.category === "sanctions") {
            score += 8;
            factors.push("санкційний тиск");
        }
        if (n.category === "aml") {
            score += 7;
            factors.push("посилення фінмоніторингу");
        }
        if (n.category === "nbu") {
            score += 5;
            factors.push("рішення НБУ");
        }
        if (n.category === "invest") {
            score -= 5;
            factors.push("очікування інвестицій");
        }
    });

    score = Math.max(0, Math.min(100, score));

    // ВЧОРА
    const saved = JSON.parse(localStorage.getItem("finap_thermo")) || {};
    const yesterday = saved.score ?? score;

    let diff = score - yesterday;

    let diffText = "";
    if (diff > 0) diffText = "🔺 +" + diff + "%";
    else if (diff < 0) diffText = "🔻 " + diff + "%";
    else diffText = "➖ Без змін";

    let status = "";
    if (score < 35) status = "🟢 Стабільність";
    else if (score < 65) status = "🟡 Напруження на ринку";
    else status = "🔴 Високий ризик";

    let forecast = "";
    if (score < 35) forecast = "Очікується стабільність";
    else if (score < 65) forecast = "Можливі коливання";
    else forecast = "Ймовірна турбулентність";

    const risk = factors[0] || "Немає явних ризиків";

    document.getElementById("financialThermometer").innerHTML = 
        <div class="thermo-wrapper">

            <div class="thermo-scale">0 25 50 75 100</div>

            <div class="thermo-bar">
                <div class="thermo-fill" style="width:%"></div>
            </div>

            <div class="thermo-value">%</div>

            <div class="thermo-status"></div>

            <div class="thermo-yesterday">
                Вчора: %<br>
            </div>

            <div class="thermo-forecast">🔮 </div>

            <div class="thermo-ai">
                🧠 Ринок формується під впливом:<br>
                
            </div>

            <div class="thermo-risk">
                ⚠️ Ризик дня: 
            </div>

        </div>
    ;

    localStorage.setItem("finap_thermo", JSON.stringify({
        score: score
    }));
}

loadThermometer();
