const fs = require("fs");

const file = "data/news.json";

const news = JSON.parse(fs.readFileSync(file, "utf8"));


function generateAI(news){

    let analysis = "";
    let impact = "";


    if(news.topic === "fraud"){

        analysis =
        "FinAP AI: Виявлено підвищений ризик шахрайських операцій. " +
        "Основна увага — захист персональних даних, платіжних карток та онлайн-операцій.";

        impact =
        "Вплив на Україну: користувачам необхідно посилити цифрову безпеку, " +
        "а фінансовим установам — контроль підозрілих операцій.";

    }


    else if(news.topic === "aml"){

        analysis =
        "FinAP AI: Подія пов'язана з посиленням фінансового моніторингу, " +
        "контролем ризиків та виконанням AML-вимог.";

        impact =
        "Вплив на Україну: банки та фінансові компанії можуть посилити процедури перевірки клієнтів.";

    }


    else if(news.topic === "sanctions"){

        analysis =
        "FinAP AI: Санкційні рішення впливають на фінансовий ринок, " +
        "інвестиційні потоки та діяльність окремих компаній.";

        impact =
        "Вплив на Україну: можливі зміни у роботі фінансових установ та інвесторів.";

    }


    else if(news.topic === "nbu"){

        analysis =
        "FinAP AI: Рішення НБУ спрямоване на стабільність банківської системи " +
        "та розвиток фінансового сектору.";

        impact =
        "Вплив на Україну: зміни можуть вплинути на клієнтів банків та фінансові сервіси.";

    }


    else {

        analysis =
        "FinAP AI: Подія має потенційний вплив на фінансовий сектор.";

        impact =
        "Вплив на Україну: потребує подальшого аналізу.";

    }


    news.analysis = analysis;
    news.impact = impact;


    return news;

}



const updated = news.map(generateAI);


fs.writeFileSync(
    file,
    JSON.stringify(updated,null,2),
    "utf8"
);


console.log("AI analysis completed:", updated.length);