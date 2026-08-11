export default function handler(request) {
    try {
        const url = new URL(request.url);
        const name = url.searchParams.get("name");

        if (!name) {
            return new Response(
                JSON.stringify({ error: "Name required" }),
                { status: 400 }
            );
        }

        return new Response(
            JSON.stringify({
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
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    } catch (e) {
        return new Response(
            JSON.stringify({
                error: "Internal error",
                message: e.message
            }),
            { status: 500 }
        );
    }
}