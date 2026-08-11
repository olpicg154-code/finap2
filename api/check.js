export default function handler(req, res) {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ error: "Name required" });
        }

        return res.status(200).json({
            success: true,
            query: name,
            count: 1,
            results: [
                {
                    name,
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

    } catch (e) {
        return res.status(500).json({
            error: "Internal error",
            message: e.message
        });
    }
}