import Parser from "rss-parser";

const parser = new Parser({
  headers: { "User-Agent": "Mozilla/5.0" }
});

let CACHE = null;
let LAST = 0;

function clean(t){
  return t.replace(/\s+-\s+.*$/,"").trim();
}

function topic(title){

  const t = title.toLowerCase();

  if(t.includes("шахрай") || t.includes("фішинг")) return "fraud";
  if(t.includes("санкц") || t.includes("рос")) return "sanctions";
  if(t.includes("нбу")) return "nbu";
  if(t.includes("платіж") || t.includes("картк")) return "payments";
  if(t.includes("fatf") || t.includes("фінмон")) return "aml";

  return "other";
}

function badge(t){
  return {
    fraud:"⚠️ ШАХРАЙСТВО",
    sanctions:"🔴 Санкції",
    nbu:"🟢 НБУ",
    payments:"💳 Платежі",
    aml:"🟣 AML",
    other:"⚪ Інше"
  }[t];
}

function short(t){
  return {
    fraud:"Ризики шахрайства.",
    sanctions:"Санкції впливають.",
    nbu:"Рішення НБУ.",
    payments:"Зміни платежів.",
    aml:"Посилення фінмоніторингу.",
    other:"Важлива фінансова подія."
  }[t];
}

export default async function handler(req,res){

  try{

    // кеш 30 хв
    if(CACHE && Date.now()-LAST < 30*60*1000){
      return res.status(200).json(CACHE);
    }

    const queries = [
      "НБУ фінанси",
      "шахрайство картки Україна",
      "санкції банки",
      "AML FATF Україна",
      "платежі Україна"
    ];

    let news=[];
    let seen=new Set();

    for(const q of queries){

      const url =
        "https://news.google.com/rss/search?q=" +
        encodeURIComponent(q) +
        "&hl=uk&gl=UA";

      const feed = await parser.parseURL(url);

      for(const item of feed.items){

        let title = clean(item.title);

        if(!title || title.length<40) continue;

        if(seen.has(title)) continue;
        seen.add(title);

        const t = topic(title);

        news.push({
          title,
          topic:t,
          badge:badge(t),
          short:short(t),
          date:new Date().toLocaleDateString("uk-UA"),
          image:"images/news/eu.jpg",
          source:item.link
        });

      }

    }

    news = news.slice(0,10);

    // головна + топ
    if(news.length){
      news[0].top="main";
      news.slice(1,3).forEach(x=>x.top="top");
    }

    CACHE=news;
    LAST=Date.now();

    return res.status(200).json(news);

  }catch(e){
    return res.status(500).json({error:e.toString()});
  }
}
