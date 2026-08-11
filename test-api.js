const https = require("https");

const url = "https://api.opensanctions.org/entities/search?q=putin";

https.get(url, {
    headers: {
        "Accept": "application/json",
        "User-Agent": "FinAP/1.0"
    }
}, function(res) {

    let data = "";

    res.on("data", function(chunk) {
        data += chunk;
    });

    res.on("end", function() {
        console.log("HTTP:", res.statusCode);
        console.log(data);
    });

}).on("error", function(error) {
    console.error("ERROR:", error.message);
});
