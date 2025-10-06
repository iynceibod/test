const tg = window.Telegram.WebApp;
const urlParams = new URLSearchParams(window.location.search);
const balls = urlParams.get("balls");

document.getElementById("user-balls").innerText = balls ? `${balls} баллов` : "Недоступно";

tg.ready();
tg.expand();

function showLoading() {
  document.getElementById("loading").classList.add("show");
}
function hideLoading() {
  document.getElementById("loading").classList.remove("show");
}

function showNotification(message, type = "error") {
  const n = document.getElementById("notification");
  n.textContent = message;
  n.className = `notification ${type}`;
  n.classList.remove("hidden");
  setTimeout(() => n.classList.add("hidden"), 3000);
}

function buyItem(item, cost) {
  showLoading();
  setTimeout(() => {
    tg.sendData(JSON.stringify({ type: "shop_purchase", item, cost }));
    hideLoading();
  }, 400);
}

function calculateExchange() {
  const amount = parseInt(document.getElementById("exchangeAmount").value);
  const result = document.getElementById("exchangeResult");

  if (!amount || amount < 10) {
    result.textContent = "❌ Минимум 10 баллов для обмена";
    result.className = "exchange-result error-result";
    result.classList.remove("hidden");
    return;
  }

  const exp = amount * 250;
  result.textContent = `✅ ${amount} баллов = ${exp.toLocaleString("ru-RU")} опыта`;
  result.className = "exchange-result success-result";
  result.classList.remove("hidden");
}

function buyExchange() {
  const amount = parseInt(document.getElementById("exchangeAmount").value);
  if (!amount || amount < 10)
    return showNotification("❌ Минимум 10 баллов для обмена");

  showLoading();
  setTimeout(() => {
    tg.sendData(JSON.stringify({
      type: "shop_purchase",
      item: "exchange_exp",
      amount,
      cost: amount,
    }));
    hideLoading();
  }, 500);
}
