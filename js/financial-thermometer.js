function calculateScore(news){

    let base = 50;

    let factors = {
        fraud: 0,
        sanctions: 0,
        risk: 0,
        invest: 0,
        growth: 0,
        nbu: 0
    };

    news.forEach(item => {

        const text = (item.title + " " + item.short).toLowerCase();

        if(text.includes("шахрай") || text.includes("фішинг")) factors.fraud++;
        if(text.includes("санкц")) factors.sanctions++;
        if(text.includes("ризик")) factors.risk++;

        if(text.includes("інвест")) factors.invest++;
        if(text.includes("зрост")) factors.growth++;
        if(text.includes("нбу")) factors.nbu++;
    });

    let score = base;

    score -= Math.min(factors.fraud * 5, 15);
    score -= Math.min(factors.sanctions * 4, 12);
    score -= Math.min(factors.risk * 3, 10);

    score += Math.min(factors.invest * 5, 15);
    score += Math.min(factors.growth * 4, 10);
    score += Math.min(factors.nbu * 2, 8);

    score = Math.max(0, Math.min(100, score));

    return {score, factors};
}


function getYesterdayScore(current){
    let saved = localStorage.getItem("thermoHistory");

    if(!saved){
        localStorage.setItem("thermoHistory", JSON.stringify({
            yesterday: current,
            today: current
        }));
        return current;
    }

    let data = JSON.parse(saved);

    // зберігаємо історію
    localStorage.setItem("thermoHistory", JSON.stringify({
        yesterday: data.today,
        today: current
    }));

    return data.today;
}


function getPrediction(score){
    if(score < 30) return Math.max(0, score - 5);
    if(score < 60) return score;
    return Math.min(100, score + 5);
}


function renderFinancialThermometer(){

    const box = document.getElementById("financialThermometer");
    if(!box) return;

    fetch("data/news.json")
        .then(res => res.json())
        .then(news => {

            const {score, factors} = calculateScore(news);

            const yesterday = getYesterdayScore(score);
            const delta = score - yesterday;

            const prediction = getPrediction(score);

            // колір
            let color =
                score < 30 ? "#ff3b30" :
                score < 60 ? "#ffd60a" :
                "#30d158";

            let label =
                score < 30 ? "🔴 Високий ризик" :
                score < 60 ? "🟡 Напруження на ринку" :
                "🟢 Позитивний фон";

            // AI пояснення
            let reasons = [];

            if (factors.fraud > 0) reasons.push("зростання шахрайства");
            if (factors.sanctions > 0) reasons.push("санкційний тиск");
            if (factors.risk > 0) reasons.push("підвищені ризики");
            if (factors.invest > 0) reasons.push("очікування інвестицій");
            if (factors.nbu > 0) reasons.push("рішення НБУ");

            let explanation = reasons.length
                ? "Ринок формується під впливом: " + reasons.join(", ") + "."
                : "Недостатньо даних для повноцінного аналізу.";

            // ризик дня
            let risk =
                factors.sanctions > factors.fraud
                ? "Санкційний тиск"
                : factors.fraud > 0
                ? "Шахрайство"
                : factors.risk > 0
                ? "Загальні ринкові ризики"
                : "Низький рівень ризиків";

            // тренд
            let trend =
                delta > 0 ? `📈 Зростання +${delta}%` :
                delta < 0 ? `📉 Падіння ${delta}%` :
                `➖ Без змін`;

            // прогноз текст
            let forecastText =
                prediction > score ? `Можливе зростання → ${prediction}%` :
                prediction < score ? `Можливе зниження → ${prediction}%` :
                `Очікується стабільність`;

            box.innerHTML = `
            <div style="margin-top:140px;text-align:center">

                <!-- ШКАЛА -->
                <div style="
                    width:360px;
                    height:12px;
                    margin:30px auto;
                    border-radius:20px;
                    background:linear-gradient(90deg,#ff3b30,#ffd60a,#30d158);
                    position:relative;
                ">
                    <div id="dot" style="
                        position:absolute;
                        top:-6px;
                        left:0%;
                        transform:translateX(-50%);
                        width:22px;
                        height:22px;
                        border-radius:50%;
                        background:${color};
                        box-shadow:0 0 12px ${color};
                        transition:left 0.8s ease;
                    "></div>
                </div>

                <!-- ШКАЛА ЦИФРИ -->
                <div style="
                    width:360px;
                    margin:auto;
                    display:flex;
                    justify-content:space-between;
                    font-size:12px;
                    opacity:.6;
                ">
                    <span>0</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                </div>

                <!-- % -->
                <div style="font-size:48px;font-weight:bold;color:${color};margin-top:20px">
                    ${score}%
                </div>

                <!-- СТАН -->
                <div style="margin-top:10px;font-size:18px">
                    ${label}
                </div>

                <!-- ІСТОРІЯ -->
                <div style="margin-top:15px;font-size:14px;opacity:.7">
                    Вчора: ${yesterday}%  
                    <br>${trend}
                </div>

                <!-- ПРОГНОЗ -->
                <div style="margin-top:15px;font-size:16px">
                    🔮 ${forecastText}
                </div>

                <!-- AI пояснення -->
                <div style="margin-top:15px;max-width:600px;margin:auto;opacity:.75">
                    🧠 ${explanation}
                </div>

                <!-- РИЗИК -->
                <div style="margin-top:15px;font-size:14px;color:#ffcc00">
                    ⚠️ Ризик дня: ${risk}
                </div>

            </div>
            `;

            setTimeout(() => {
                document.getElementById("dot").style.left = score + "%";
            }, 200);

        })
        .catch(() => {
            box.innerHTML = "Помилка завантаження";
        });
}

document.addEventListener("DOMContentLoaded", renderFinancialThermometer);