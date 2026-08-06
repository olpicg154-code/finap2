const fs = require("fs");
const Parser = require("rss-parser");

const parser = new Parser({
    headers: {
        "User-Agent": "Mozilla/5.0"
    }
});

console.log("🔥 FinAP Engine STABLE старт\n");


// =========================
// CLEAN TEXT
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
if(t.includes("шахрай") || t.includes("дроп") || t.includes("кібер")) return "fraud";
if(t.includes("санкц") || t.includes("рос")) return "sanctions";
if(t.includes("нбу")) return "nbu";
if(t.includes("платіж") || t.includes("картк")) return "payments";
if(t.includes("банк")) return "banks";

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
nbu:"🟢 НБУ",
payments:"💳 Платежі",
banks:"🏦 Банки",
other:"⚪ Інше"
}[t];
}


// =========================
// SCORE
// =========================

function score(title,topic){

let s=0;
let t=title.toLowerCase();

if(t.includes("fatf")) s+=80;
if(t.includes("нбу")) s+=70;
if(t.includes("санкц")) s+=60;
if(t.includes("шахрай")) s+=60;

return s + ({
aml:40,
fraud:40,
sanctions:35,
nbu:35,
payments:25,
banks:20
}[topic]||0);
}


// =========================
// SHORT
// =========================

function short(t){
return {
aml:"Посилення фінмоніторингу.",
fraud:"Ризики шахрайства.",
sanctions:"Санкції впливають.",
nbu:"Рішення НБУ.",
payments:"Зміни платежів.",
banks:"Банківський сектор."
}[t] || "Фінансова подія.";
}


// =========================
// TIMEOUT RSS
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

const sources =
JSON.parse(
fs.readFileSync("./data/sources.json","utf8")
.replace(/^\uFEFF/,"")
);


// 🔥 БАГАТО ЗАПИТІВ (як було раніше)
const queries = [
"НБУ банки Україна",
"санкції Україна ЄС",
"шахрайство картки банк",
"AML FATF фінмоніторинг",
"банки Україна новини"
];


let all=[];
let seen=new Set();


for(const source of sources){

for(const q of queries){

try{

const url =
"https://news.google.com/rss/search?q="
+
encodeURIComponent(q + " " + source.name)
+
"&hl=uk&gl=UA";

console.log("⏳ RSS:", q);

let feed;

try{
    feed = await fetchWithTimeout(url);
}catch(e){
    console.log("❌ Пропущено:", e.message);
    continue;
}


for(const item of feed.items){

let title = cleanTitle(item.title);

if(!title) continue;

// 🔥 НЕ ВИКИДАЄМО БІЛЬШЕ КРИВІ СИМВОЛИ
// if(title.includes("�")) continue;

if(title.length < 25) continue;

let key = normalize(title);

if(seen.has(key)) continue;
seen.add(key);


let topic = detectTopic(title);


all.push({
title,
topic,
score:score(title,topic),
badge:badge(topic),
category:source.type,
date:new Date().toLocaleDateString("uk-UA"),
short:short(topic),
content:title,
analysis:`FinAP: ${badge(topic)} — важлива подія.`,
impact:"Вплив на фінансовий сектор.",
image:"images/news/eu.jpg",
source:item.link
});

}

}catch(e){
console.log("RSS error:", q);
}

}
}


// =========================
// SORT
// =========================

all.sort((a,b)=>b.score-a.score);


// =========================
// LIMIT 10
// =========================

let result=[];
let count={};

for(const n of all){

if(!count[n.topic]) count[n.topic]=0;

if(count[n.topic]>=2) continue;

result.push(n);
count[n.topic]++;

if(result.length===10) break;

}


// =========================
// TOP NEWS
// =========================

if(result.length){
result[0].top="main";
result.slice(1,3).forEach(x=>x.top="top");
}


// =========================
// SAVE
// =========================

fs.writeFileSync(
"./data/news.json",
JSON.stringify(result,null,2),
"utf8"
);


console.log("\nЗібрано:",all.length);
console.log("Фінальні новини:",result.length);
console.log("Категорії:",count);

console.log("🔥 FinAP Engine STABLE завершено");

}

run();