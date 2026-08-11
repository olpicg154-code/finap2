function scoreNews(item) {
    const text = (item.title + " " + item.text).toLowerCase();

    let score = 0;

    if (text.includes("шахрай") || text.includes("фішинг")) score -= 3;
    if (text.includes("штраф") || text.includes("санкц")) score -= 3;
    if (text.includes("збитк")) score -= 3;

    if (text.includes("ризик")) score -= 1;

    if (text.includes("інвест") || text.includes("зрост")) score += 2;
    if (text.includes("розвит") || text.includes("покращ")) score += 1;

    return score;
}

function calculateThermometer(news) {
    let total = 0;

    news.forEach(item => {
        total += scoreNews(item);
    });

    let avg = total / news.length;

    let result = 50 + avg * 10;

    if (result > 100) result = 100;
    if (result < 0) result = 0;

    return Math.round(result);
}