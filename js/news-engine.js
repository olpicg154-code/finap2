const fs = require("fs");
const Parser = require("rss-parser");

const parser = new Parser({
    headers: { "User-Agent": "Mozilla/5.0" }
});

console.log("🔥 FinAP Engine PRO старт\n");

// =========================
// CLEAN
// =========================

function clean(text){
    if(!text) return "";
    return text
        .replace(/^\uFEFF/, "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function cleanTitle(title){
    return clean(title)
        .replace(/\s+-\s+.*$/, "")
        .trim();
}

function normalize(t){
    return t.toLowerCase()
        .replace(/[^а-яіїєґa-z0-9 ]/gi, "")
        .replace(/\s+/g, " ")
        .trim();
}

// =========================
// TOPIC
// =========================

function detectTopic(t){

    t = t.toLowerCase();

    if(t.includes("fatf") || t.includes("aml") || t.includes("фінмон")) return "aml";
    if(t.includes("шахрай") || t.includes("фішинг") || t.includes("кібер")) return "fraud";
    if(t.includes("санкц") || t.includes("рос") || t.includes("єс")) return "sanctions";
    if(t.includes("крипт") || t.includes("bitcoin") || t.includes("crypto")) return "crypto";
    if(t.includes("інвест") || t.includes("ринок") || t.includes("акції")) return "invest";
    if(t.includes("платіж") || t.includes("картк")) return "payments";
    if(t.includes("банк")) return "banks";
    if(t.includes("нбу")) return "nbu";

    return "other";
}

// =========================
// BADGE
// =========================

function badge(t){
    return {
        aml:"🟣 AML",
        fraud:"⚠️ ШАХРАЙСТВО",
        sanctions:"🔴 Санкції",
        nbu:"🏦 НБУ",
        payments:"💳 Платежі",
        banks:"🏦 Банки",
        invest:"📈 Інвестиції",
        crypto:"🪙 Crypto",
        other:"📊 Ринок"
    }[t];
}

// =========================
// SCORE
// =========================

function score(title,topic){

    let s = 0;
    let t = title.toLowerCase();

    if(t.includes("fatf")) s += 80;
    if(t.includes("санкц")) s += 60;
    if(t.includes("шахрай")) s += 60;

    if(t.includes("єс") || t.includes("сша") || t.includes("міжнарод")) s += 30;

    if(t.includes("нбу")) s += 50;

    return s + ({
        aml:40,
        fraud:40,
        sanctions:35,
        invest:35,
        crypto:30,
        payments:25,
        banks:20,
        nbu:20
    }[topic] || 0);
}

// =========================
// SHORT
// =========================

function short(t){
    return {
        aml:"Посилення фінмоніторингу.",
        fraud:"Ризики шахрайства.",
        sanctions:"Санкційний тиск.",
        nbu:"Рішення регулятора.",
        payments:"Зміни платежів.",
        banks:"Банківський сектор.",
        invest:"Інвестиційний ринок.",
        crypto:"Ринок криптовалют."
    }[t] || "Фінансова подія.";
}

// =========================
// IMAGE
// =========================

function getNewsImage(topic){
    return {
        fraud:"images/news/fraud.jpeg",
        aml:"images/news/aml.jpeg",
        sanctions:"images/news/sanctions.jpeg",
        nbu:"images/news/nbu.jpeg",
        payments:"images/news/payments.jpeg",
        invest:"images/news/invest.jpeg",
        crypto:"images/news/crypto.jpeg",
        banks:"images/news/default.jpeg",
        other:"images/news/default.jpeg"
    }[topic] || "images/news/default.jpeg";
}

// =========================
// FETCH
// =========================

async function fetchWithTimeout(url, timeout = 5000){
    return Promise.race([
        parser.parseURL(url),
        new Promise((_, reject)=>
            setTimeout(()=>reject(new Error("timeout")), timeout)
        )
    ]);
}

// =========================
// ENGINE
// =========================

async function run(){

    const sources = JSON.parse(
        fs.readFileSync("./data/sources.json","utf8")
            .replace(/^\uFEFF/,"")
    );

    const queries = [
        "економіка Україна",
        "інвестиції Україна",
        "ринок капіталу Україна",
        "банки Україна",
        "платіжні системи Україна",
        "криптовалюта Україна",
        "санкції ЄС Україна",
        "FATF AML фінмоніторинг",
        "фінансові технології fintech",
        "міжнародні ринки фінанси"
    ];

    let all = [];
    let seen = new Set();

    for(const source of sources){

        for(const q of queries){

            try{

                const url =
                    "https://news.google.com/rss/search?q=" +
                    encodeURIComponent(q + " " + source.name) +
                    "&hl=uk&gl=UA";

                console.log("⏳", q);

                let feed;

                try{
                    feed = await fetchWithTimeout(url);
                }catch(e){
                    console.log("❌ timeout");
                    continue;
                }

                for(const item of feed.items){

                    let title = cleanTitle(item.title);
                    if(!title || title.length < 25) continue;

                    let key = normalize(title);
                    if(seen.has(key)) continue;
                    seen.add(key);

                    let topic = detectTopic(title);

                    let sc = score(title, topic);

                    if(topic === "nbu") sc -= 15;

                    all.push({
                        title,
                        topic,
                        score: sc,
                        badge: badge(topic),
                        date: new Date().toLocaleDateString("uk-UA"),
                        short: short(topic),
                        content: title,

                        // 🔥 FIX ТУТ
                        analysis: "FinAP: " + badge(topic) + " — ключова подія.",

                        impact: "Вплив на фінансовий сектор.",
                        image: getNewsImage(topic),
                        source: item.link
                    });
                }

            }catch(e){
                console.log("RSS error");
            }
        }
    }

    all.sort((a,b)=>b.score-a.score);

    const LIMITS = {
        nbu:2,
        fraud:2,
        sanctions:2,
        aml:2,
        payments:2,
        banks:2,
        invest:3,
        crypto:2,
        other:2
    };

    let result = [];
    let count = {};

    for(const n of all){

        count[n.topic] = count[n.topic] || 0;

        if(count[n.topic] >= (LIMITS[n.topic] || 2)) continue;

        result.push(n);
        count[n.topic]++;

        if(result.length === 10) break;
    }

    if(result.length){
        result[0].top = "main";
        result.slice(1,3).forEach(x => x.top = "top");
    }

    result.push({
    meta: {
        updated: new Date().toISOString(),
        count: result.length
    }
});

fs.writeFileSync(
    "./data/news.json",
    JSON.stringify(result,null,2),
    "utf8"
    );

    console.log("\n✅ Зібрано:", all.length);
    console.log("📊 Фінальні:", result.length);
    console.log("📂 Категорії:", count);

    console.log("\n🔥 FinAP Engine PRO завершено");
}

run();