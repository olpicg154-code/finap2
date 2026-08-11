require("dotenv").config();

const https = require("https");

const apiKey = process.env.OPENSANCTIONS_API_KEY;

if (!apiKey) {
    console.log("❌ API key не знайдено");
    process.exit(1);
}

const body = JSON.stringify({
    queries: {
        q: {
            schema: "Person",
            properties: {
                name: ["putin"]
            }
        }
    }
});

const options = {
    hostname: "api.opensanctions.org",
    path: "/match/default",
    method: "POST",
    headers: {
        "Authorization": "ApiKey " + apiKey,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Content-Length": Buffer.byteLength(body)
    }
};

console.log("🔎 Перевіряємо: putin");
console.log("🌐 Endpoint: /match/default");

const req = https.request(options, (res) => {

    let data = "";

    res.on("data", (chunk) => {
        data += chunk;
    });

    res.on("end", () => {

        console.log("HTTP:", res.statusCode);
        console.log("");

        try {
            const json = JSON.parse(data);
            console.log(JSON.stringify(json, null, 2));
        } catch {
            console.log(data);
        }

    });

});

req.on("error", (error) => {
    console.error("❌ ERROR:", error.message);
});

req.write(body);
req.end();
