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


let isSpinning = false;
let rotation = 0;
let spinVelocity = 0;
let animationFrameId = null;
const spinDuration = 5000;

const prizes = [
  { text: "500 DP", icon: "💰", weight: 30 },
  { text: "1000 DP", icon: "💵", weight: 20 },
  { text: "50 баллов", icon: "📅", weight: 15 },
  { text: "1 предупреждение", icon: "⭐", weight: 10 },
  { text: "Снятие любого наказания", icon: "🔓", weight: 3 },
  { text: "Отсутствие нормы на неделю", icon: "📅", weight: 3 },
  { text: "Персональная роль", icon: "🎭", weight: 3 },
  { text: "Понижение", icon: "📉", weight: 1 }
];


document.addEventListener("DOMContentLoaded", () => {
  renderPrizeList();
});

function openRoulette() {
  const modal = document.getElementById("rouletteModal");
  modal.classList.remove("hidden");
  drawRoulette();
  resetUI();
}

function closeRoulette() {
  document.getElementById("rouletteModal").classList.add("hidden");
  cancelAnimationFrame(animationFrameId);
  isSpinning = false;
}

function resetUI() {
  document.getElementById("rouletteResult").classList.add("hidden");
  const btn = document.getElementById("spinButton");
  btn.disabled = false;
  btn.style.display = "block";
}

function drawRoulette() {
  const canvas = document.getElementById("rouletteCanvas");
  const ctx = canvas.getContext("2d");
  const numSectors = prizes.length;
  const angle = (2 * Math.PI) / numSectors;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = Math.min(cx, cy) - 10;
  const colors = ["#2332ff", "#111", "#3163ff", "#151515", "#2332ff", "#111"];

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < numSectors; i++) {
    const start = angle * i + rotation;
    const end = start + angle;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(start + angle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px 'Segoe UI', sans-serif";
    let text = prizes[i].text;
    if (text.length > 15) text = text.substring(0, 14) + "..";
    ctx.fillText(text, r - 15, 4);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, 25, 0, 2 * Math.PI);
  ctx.fillStyle = "#0b0b0b";
  ctx.fill();
  ctx.strokeStyle = "#2b57ff";
  ctx.lineWidth = 3;
  ctx.stroke();
}

function getWeightedPrizeIndex() {
  const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
  let rnd = Math.random() * totalWeight;
  for (let i = 0; i < prizes.length; i++) {
    rnd -= prizes[i].weight;
    if (rnd < 0) return i;
  }
  return prizes.length - 1;
}

function spinRoulette() {
  if (isSpinning) return;
  isSpinning = true;
  const btn = document.getElementById("spinButton");
  btn.disabled = true;

  const spinStartTime = Date.now();

  const targetIndex = getWeightedPrizeIndex();
  const numSectors = prizes.length;
  const anglePerSector = (2 * Math.PI) / numSectors;

  const targetSectorCenter = targetIndex * anglePerSector + anglePerSector / 2;
  const targetAngle = (3 * Math.PI / 2) - targetSectorCenter;
  const normalizedAngle = (targetAngle + 2 * Math.PI) % (2 * Math.PI);


  const extraRotations = 8; 
  const totalRotation = extraRotations * 2 * Math.PI + normalizedAngle;
  const startRotation = rotation;

  function animate() {
    const elapsed = Date.now() - spinStartTime;
    const progress = Math.min(elapsed / spinDuration, 1);

    const c1 = 1.70158;
    const c3 = c1 + 1;
    const easeOutBack = (x) =>
      1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);

    rotation = startRotation + totalRotation * easeOutBack(progress);
    drawRoulette();

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      isSpinning = false;
      showResult(targetIndex); 
    }
  }

  animationFrameId = requestAnimationFrame(animate);
}

function showResult(index) {
  const prize = prizes[index];
  const resultDiv = document.getElementById("rouletteResult");
  resultDiv.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;gap:8px;">
      <span style="font-size:20px;">${prize.icon}</span>
      <span>${prize.text}</span>
    </div>`;
  resultDiv.classList.remove("hidden");
  document.getElementById("spinButton").style.display = "none";
  
  setTimeout(() => {
    tg.sendData(JSON.stringify({
      type: "shop_purchase",
      item: "roulette_spin",
      prize: `${prize.icon} ${prize.text}`
    }));
  }, 1000);
}

function renderPrizeList() {
  const list = document.getElementById("prizeList");
  list.innerHTML = prizes
    .map(p => `<li><span class="prize-icon">${p.icon}</span>${p.text}</li>`)
    .join("");
}

