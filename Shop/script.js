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
function showNicknameForm() {
    document.getElementById('nicknameForm').classList.remove('hidden');
    document.getElementById('newNickname').focus();
}

function hideNicknameForm() {
    document.getElementById('nicknameForm').classList.add('hidden');
    document.getElementById('newNickname').value = '';
}

function buyNickname() {
    const nickname = document.getElementById('newNickname').value.trim();
    if (!nickname) {
        showNotification('❌ Введите новый никнейм');
        return;
    }
    showLoading();
    setTimeout(() => {
        tg.sendData(JSON.stringify({
            type: "shop_purchase",
            item: "change_nickname",
            nickname: nickname,
            cost: 50
        }));
        hideLoading();
    }, 500);
}

function showRoleForm() {
    document.getElementById('roleForm').classList.remove('hidden');
    document.getElementById('roleName').focus();
}

function hideRoleForm() {
    document.getElementById('roleForm').classList.add('hidden');
    document.getElementById('roleName').value = '';
    document.getElementById('roleColor').value = '';
}

function buyRole() {
    const roleName = document.getElementById('roleName').value.trim();
    const roleColor = document.getElementById('roleColor').value.trim();
    
    if (!roleName || !roleColor) {
        showNotification('❌ Заполните все поля');
        return;
    }
    
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!colorRegex.test(roleColor)) {
        showNotification('❌ Неверный формат цвета. Используйте формат #RRGGBB');
        return;
    }
    
    showLoading();
    setTimeout(() => {
        tg.sendData(JSON.stringify({
            type: "shop_purchase",
            item: "create_personal_role",
            roleName: roleName,
            roleColor: roleColor,
            cost: 200
        }));
        hideLoading();
    }, 500);
}

// Обработчики Enter для форм
document.getElementById('newNickname').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buyNickname();
    }
});

document.getElementById('roleName').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('roleColor').focus();
    }
});

document.getElementById('roleColor').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buyRole();
    }
});

