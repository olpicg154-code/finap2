import fs from "fs";

const file = "./data/news.json";

let news = JSON.parse(
  fs.readFileSync(file, "utf8")
);

function analyze(title) {

  let text = title.toLowerCase();

  let analysis = "Фінансова подія потребує уваги учасників ринку.";
  let impact = "Може вплинути на фінансовий сектор України.";
  let risk = "Рекомендується оцінити можливі ризики.";

  if(text.includes("нбу")) {
    analysis = "Національний банк посилює регулювання та контроль фінансового ринку.";
    impact = "Рішення НБУ можуть впливати на банки, клієнтів та бізнес.";
    risk = "Банкам необхідно адаптувати внутрішні процеси.";
  }

  if(text.includes("санк")) {
    analysis = "Санкційні рішення змінюють умови роботи фінансових компаній.";
    impact = "Можливі зміни для міжнародних операцій та інвестицій.";
    risk = "Підвищується увага до перевірки контрагентів.";
  }

  if(text.includes("aml") || text.includes("фінмонітор")) {
    analysis = "Посилення AML-контролю спрямоване на боротьбу з фінансовими злочинами.";
    impact = "Фінансові установи можуть посилити перевірку клієнтів.";
    risk = "Зростають вимоги до комплаєнсу.";
  }

  return {
    analysis,
    impact,
    risk
  };
}


news = news.map(n => ({
  ...n,
  ...analyze(n.title)
}));


fs.writeFileSync(
  file,
  JSON.stringify(news, null, 2)
);


console.log("🧠 AI аналіз додано:", news.length);