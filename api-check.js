require("dotenv").config();

const express = require("express");

const app = express();
const PORT = 3001;

// CORS для локального сайту на localhost:3000
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

app.get("/check", async (req, res) => {

    const name = (req.query.name || "").trim();

    if (!name) {
        return res.status(400).json({
            error: "Не вказано ім'я або компанію"
        });
    }

    console.log("FinAP CHECK:", name);

    try {

        const response = await fetch(
            "https://api.opensanctions.org/match/default",
            {
                method: "POST",

                headers: {
                    "Authorization":
                        "ApiKey " + process.env.OPENSANCTIONS_API_KEY,
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    queries: {
                        q: {
                            schema: "Person",

                            properties: {
                                name: [name]
                            }
                        }
                    },

                    limit: 10
                })
            }
        );

        console.log(
            "OpenSanctions HTTP:",
            response.status
        );

        const data = await response.json();

        if (!response.ok) {

            return res.status(response.status).json({
                error: "Помилка OpenSanctions",
                details: data
            });

        }

        const results =
            data?.responses?.q?.results || [];

        const formatted = results.map(item => {

            const p = item.properties || {};
            const topics = p.topics || [];

            return {

                id: item.id || null,

                name:
                    item.caption ||
                    "Невідомо",

                schema:
                    item.schema ||
                    null,

                score:
                    item.score ||
                    0,

                match:
                    item.match === true,

                sanctions:
                    topics.includes("sanction"),

                pep:
                    topics.includes("role.pep"),

                wanted:
                    topics.includes("wanted"),

                topics: topics,

                datasets:
                    item.datasets || [],

                birthDate:
                    p.birthDate?.[0] ||
                    null,

                country:
                    p.country?.[0] ||
                    null,

                position:
                    p.position?.[0] ||
                    null,

                sourceUrls:
                    p.sourceUrl ||
                    []
            };

        });

        console.log(
            "Знайдено:",
            formatted.length
        );

        res.json({

            success: true,

            query: name,

            count: formatted.length,

            results: formatted

        });

    } catch (error) {

        console.error(
            "SERVER ERROR:",
            error
        );

        res.status(500).json({

            error: "Помилка сервера",

            message:
                error.message

        });

    }

});

app.listen(PORT, () => {

    console.log(
        "FinAP CHECK API працює: http://localhost:" +
        PORT
    );

});
