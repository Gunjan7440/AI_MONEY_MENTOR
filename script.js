// ================= GLOBAL =================
let chart;

// ================= LOGIN CHECK =================
window.onload = function () {
    let currentPage = window.location.pathname;

    if (!localStorage.getItem("user") && !currentPage.includes("login.html")) {
        window.location = "login.html";
    }

    loadHistory();
};

// ================= ANALYZE FUNCTION =================
function analyze() {

    let income = Number(document.getElementById("income")?.value) || 0;
    let expense = Number(document.getElementById("expense")?.value) || 0;
    let savings = Number(document.getElementById("savings")?.value) || 0;

    let net = income - expense;
    if (income === 0 && expense === 0 && savings === 0) {
    alert("Please enter values first!");
    return;
}

    // NET WORTH
    updateText("networth", "₹" + (savings + net));
    updateText("growth", "+₹" + net + " this month 🚀");

    // SMART CALCULATION
    let invest = Math.max(0, Math.floor(net * 0.6));
    let emergency = Math.max(0, Math.floor(net * 0.2));

    // AI ADVICE
    let advice = getAdvice(net);

    let result = `
        <p>💰 Monthly Savings: ₹${net}</p>
        <p>📊 Suggested Investment: ₹${invest}</p>
        <p>⚠️ Emergency Fund: ₹${emergency}</p>
        <p>🧠 Advice: ${advice}</p>
    `;

    updateHTML("result", result);

    // SCORE
    let score = income > 0 ? Math.min(100, Math.floor((net / income) * 100)) : 0;
    updateText("score", score + "/100");

    // FIRE
    let fire = (expense * 12) * 25;
    updateText("fire", "₹" + fire);

    // HISTORY
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history.push(`₹${income} - ₹${expense} = ₹${net}`);
    localStorage.setItem("history", JSON.stringify(history));
    loadHistory();

    // CHART
    createChart(income, expense, savings);
}

// ================= HELPER FUNCTIONS =================
function updateText(id, value) {
    let el = document.getElementById(id);
    if (el) el.innerText = value;
}

function updateHTML(id, value) {
    let el = document.getElementById(id);
    if (el) el.innerHTML = value;
}

// ================= AI ADVICE =================
function getAdvice(net) {
    if (net <= 0) return "⚠️ You are spending more than you earn.";
    if (net < 5000) return "⚠️ Increase savings and reduce expenses.";
    if (net < 20000) return "👍 Good! Start SIP investments.";
    return "🚀 Excellent! Invest aggressively.";
}

// ================= CHART =================
function createChart(income, expense, savings) {
    let ctx = document.getElementById("financeChart");

    if (!ctx) return;

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Income", "Expenses", "Savings"],
            datasets: [{
                data: [income, expense, savings],
            }]
        },
        options: {
            animation: {
                duration: 1200,
                animateScale: true
            },
            plugins: {
                legend: {
                    labels: {
                        color: "white"
                    }
                }
            }
        }
    });
}

// ================= HISTORY =================
function loadHistory() {
    let list = document.getElementById("history");
    if (!list) return;

    let history = JSON.parse(localStorage.getItem("history")) || [];
    list.innerHTML = "";

    history.forEach(item => {
        let li = document.createElement("li");
        li.innerText = item;
        list.appendChild(li);
    });
}

function clearHistory() {
    localStorage.removeItem("history");
    updateHTML("history", "");
}

// ================= AUTH =================
function logout() {
    localStorage.removeItem("user");
    window.location = "login.html";
}

function login() {
    let user = document.getElementById("username")?.value;
    let pass = document.getElementById("password")?.value;

    if (user && pass) {
        localStorage.setItem("user", user);
        window.location = "index.html";
    } else {
        alert("Please enter credentials");
    }
}

// ================= AI CHAT =================

// SMART AI RESPONSE
function getAIResponse(msg) {
    msg = msg.toLowerCase();

    if (msg.includes("invest")) return "📈 Invest in SIP & diversify portfolio.";
    if (msg.includes("save")) return "💰 Save at least 20% of income.";
    if (msg.includes("tax")) return "🧾 Use 80C, ELSS, PPF for tax saving.";
    if (msg.includes("fire")) return "🔥 FIRE = 25x yearly expenses.";
    if (msg.includes("loan")) return "🏦 Avoid high-interest loans.";
    if (msg.includes("insurance")) return "🛡️ Take term + health insurance.";
    if (msg.includes("stock")) return "📊 Prefer index funds for beginners.";
    if (msg.includes("budget")) return "📊 Track and control spending.";

   return "🤖 Ask about saving, investing, tax, FIRE, or loans!";
}

// ================= SEND MESSAGE =================
function sendMessage() {

    let input = document.getElementById("userInput");
    let chatBox = document.getElementById("chatBox");

    if (!input || !chatBox) return;

    let msg = input.value.trim();
    if (!msg) return;

    // USER MESSAGE
    let userDiv = document.createElement("div");
    userDiv.className = "msg user";
    userDiv.innerText = msg;
    chatBox.appendChild(userDiv);

    // BOT MESSAGE WITH TYPING EFFECT
    let botDiv = document.createElement("div");
    botDiv.className = "msg bot";
    chatBox.appendChild(botDiv);

    let reply = getAIResponse(msg);
    let i = 0;

    function typeEffect() {
        if (i < reply.length) {
            botDiv.innerHTML += reply.charAt(i);
            i++;
            setTimeout(typeEffect, 20);
        }
    }

    typeEffect();

    chatBox.scrollTop = chatBox.scrollHeight;
    input.value = "";
}

// ================= ENTER KEY =================
document.addEventListener("DOMContentLoaded", function () {
    let input = document.getElementById("userInput");

    if (input) {
        input.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
            }
        });
    }
});

// ================= VOICE INPUT =================
function startVoice() {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.lang = "en-IN";

    recognition.onresult = function (event) {
        document.getElementById("userInput").value = event.results[0][0].transcript;
    };

    recognition.start();
}