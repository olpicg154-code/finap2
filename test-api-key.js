require("dotenv").config();

const https = require("https");

const apiKey = process.env.OPENSANCTIONS_API_KEY;

if (!apiKey) {
    console.log("❌ API key не знайдено у .env");
    process.exit(1);
}

console.log("🔑 API key знайдено");

const options = {
    hostname: "api.opensanctions.org",
    path: "/entities/search?q=putin",
    method: "GET",
    headers: {
        "Accept": "application/json",
        "Authorization": "ApiKey " + apiKey,
        "User-Agent": "FinAP/1.0"
    }
};

const req = https.request(options, (res) => {

    let data = "";

    res.on("data", chunk => {
        data += chunk;
    });

    res.on("end", () => {
        console.log("HTTP:", res.statusCode);
        console.log(data.substring(0, 2000));
    });

});

req.on("error", error => {
    console.error("ERROR:", error.message);
});

req.end();
