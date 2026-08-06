import Parser from "rss-parser";

const parser = new Parser({
  headers: { "User-Agent": "Mozilla/5.0" }
});

function clean(title) {
  return title.replace(/\s+-\s+.*$/, "").trim();
}

export default async function handler(req, res) {
  try {

    const sources = [
      { name: "НБУ" },
      { name: "FATF" },
      { name: "банки Україна" },
      { name: "санкції ЄС" },
      { name: "шахрайство платежі" }
    ];

    let news = [];
    let seen = new Set();

    for (const s of sources) {

      const url =
        "https://news.google.com/rss/search?q=" +
        encodeURIComponent(s.name + " фінанси банки НБУ AML санкції") +
        "&hl=uk&gl=UA";

      const feed = await parser.parseURL(url);

      for (const item of feed.items) {

        let title = clean(item.title);

        if (!title || title.length < 30) continue;

        if (seen.has(title)) continue;
        seen.add(title);

        news.push({
          title,
          date: new Date().toLocaleDateString("uk-UA"),
          image: "images/news/eu.jpg",
          source: item.link
        });
      }
    }

    news = news.slice(0, 10);

    return res.status(200).json(news);

  } catch (e) {
    return res.status(500).json({ error: e.toString() });
  }
}
