async function loadThermometer() {
    const res = await fetch("data/news.json");
    const data = await res.json();

    const news = data.slice(0, 10);

    let score = 0;

    news.forEach(n => {
        if (n.category === "fraud") score += 10;
        if (n.category === "sanctions") score += 8;
        if (n.category === "aml") score += 7;
        if (n.category === "nbu") score += 5;
        if (n.category === "invest") score -= 3;
    });

    score = Math.max(0, Math.min(100, 50 + score));

    // 📌 ДАТА СЬОГОДНІ
    const today = new Date().toISOString().slice(0, 10);

    // 📌 БЕРЕМО ВЧОРА
    const saved = JSON.parse(localStorage.getItem("finap_thermo")) || {};
    const yesterdayScore = saved.score ?? score;

    let diff = score - yesterdayScore;

    let diffText = "";
    if (diff > 0) diffText = `🔺 +${diff}%`;
    else if (diff < 0) diffText = `🔻 ${diff}%`;
    else diffText = "➖ Без змін";

    let mood = "";
    if (score < 35) mood = "🟢 Стабільність";
    else if (score < 65) mood = "🟡 Напруження";
    else mood = "🔴 Ризик";

    document.getElementById("financialThermometer").innerHTML = `
        <div class="thermo-box">
            <div class="thermo-scale">0 25 50 75 100</div>
            <div class="thermo-value">${score}%</div>
            <div class="thermo-status">${mood}</div>
            <div class="thermo-diff">Вчора: ${yesterdayScore}%</div>
            <div class="thermo-diff">${diffText}</div>
        </div>
    `;

    // 📌 ЗБЕРІГАЄМО СЬОГОДНІ
    localStorage.setItem("finap_thermo", JSON.stringify({
        score: score,
        date: today
    }));
}

loadThermometer();