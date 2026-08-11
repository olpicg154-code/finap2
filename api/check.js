export default async function handler(req, res) {

    const name = req.query.name;

    if (!name) {
        return res.status(400).json({ error: "Name required" });
    }

    return res.status(200).json({
        success: true,
        query: name,
        count: 1,
        results: [
            {
                name: name,
                score: 0.87,
                sanctions: false,
                pep: false,
                wanted: false,
                country: "UA",
                position: "Дані не знайдено у санкційних списках",
                datasets: ["FinAP demo"]
            }
        ]
    });
}
