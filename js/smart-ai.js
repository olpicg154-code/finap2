function smartAnalyze(news) {

    let title = news.title.toLowerCase();

    let result = {
        audience: [],
        risk: "",
        meaning: "",
        action: []
    };


    if (
        title.includes("дроп") ||
        title.includes("шахрай")
    ) {

        result.audience = [
            "🏦 Банки",
            "💳 Платіжні сервіси",
            "👤 Користувачі карток"
        ];

        result.risk = "🔴 Високий";

        result.meaning =
            "Посилюється контроль підозрілих операцій. Банки можуть блокувати нетипові перекази.";

        result.action = [
            "Перевірити платежі",
            "Не передавати доступ до рахунків",
            "Посилити внутрішній контроль"
        ];
    }


    else if (
        title.includes("fatf") ||
        title.includes("aml") ||
        title.includes("фінмонітор")
    ) {

        result.audience = [
            "🏦 Банки",
            "💼 Фінансові компанії",
            "📑 Комплаєнс"
        ];

        result.risk = "🟠 Середній";

        result.meaning =
            "Зростають вимоги до перевірки клієнтів та походження коштів.";

        result.action = [
            "Оновити AML-процедури",
            "Перевірити ризикових клієнтів",
            "Підготувати документи"
        ];
    }


    else if (
        title.includes("санкц")
    ) {

        result.audience = [
            "🌍 Міжнародний бізнес",
            "🏦 Банки",
            "🚢 Експортери"
        ];

        result.risk = "🔴 Високий";

        result.meaning =
            "Можуть змінитися правила міжнародних операцій та співпраці з партнерами.";

        result.action = [
            "Перевірити контрагентів",
            "Переглянути платежі",
            "Контролювати санкційні ризики"
        ];
    }


    else if (
        title.includes("нбу")
    ) {

        result.audience = [
            "🏦 Банки",
            "💼 Бізнес",
            "👤 Клієнти"
        ];

        result.risk = "🟡 Помірний";

        result.meaning =
            "Регулятор змінює правила роботи фінансового ринку.";

        result.action = [
            "Слідкувати за новими вимогами",
            "Перевірити внутрішні процеси"
        ];
    }


    else {

        result.audience = [
            "💼 Бізнес",
            "📊 Фінансовий сектор"
        ];

        result.risk = "🟢 Низький";

        result.meaning =
            "Подія може вплинути на фінансові процеси та рішення компаній.";

        result.action = [
            "Слідкувати за оновленнями"
        ];
    }


    return result;

}