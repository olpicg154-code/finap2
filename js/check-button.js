function renderCheckButton(){

    const container = document.createElement("div");

    container.style.position = "fixed";
    container.style.top = "110px";
    container.style.right = "50px";
    container.style.zIndex = "10000";

    container.innerHTML = `
        <a href="check.html" style="
            padding: 12px 28px;
            border-radius: 30px;
            background: rgba(255, 59, 48, 0.08);
            backdrop-filter: blur(8px);
            border: 1.5px solid #ff3b30;
            color: #fff;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 1px;
            text-decoration: none;
            box-shadow:
                0 0 10px rgba(255, 59, 48, 0.5),
                inset 0 0 8px rgba(255, 59, 48, 0.3);
            transition: all 0.3s ease;
        ">
            ⚠️ КОНТРАГЕНТ
        </a>
    `;

    document.body.appendChild(container);
}

document.addEventListener("DOMContentLoaded", renderCheckButton);