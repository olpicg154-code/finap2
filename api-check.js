export default async function handler(req, res) {

    const name = req.query.name;

    if (!name) {
        return res.status(400).json({
            success: false,
            error: "No name provided"
        });
    }

    try {

        const response = await fetch(
            "https://api.opensanctions.org/match",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    queries: {
                        q1: {
                            schema: "Person",
                            properties: {
                                name: [name]
                            }
                        }
                    }
                })
            }
        );

        const data = await response.json();

        const results =
            data.results?.q1?.results || [];

        return res.status(200).json({
            success: true,
            query: name,
            count: results.length,
            results: results
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            error: error.message
        });

    }
}