const tg = window.Telegram?.WebApp;
if (tg) {
  tg.expand();
  tg.setHeaderColor('#667eea');
} else {
  console.warn('Telegram WebApp не найден');
}

const form = document.getElementById('regForm');
const submitBtn = form.querySelector('.submit-btn');

function validateForm() {
  const nick = document.getElementById('nick').value.trim();
  const fa = document.getElementById('fa').value.trim();
  const discord_id = document.getElementById('discord_id').value.trim();
  const vozrast = document.getElementById('vozrast').value.trim();
  const gorod = document.getElementById('gorod').value.trim();

  let valid = true;

  // Очистка ошибок
  document.querySelectorAll('.error').forEach(e => e.textContent = '');

  // Ник
  if (!nick.includes('_')) {
    document.getElementById('nick-error').textContent = 'Ник должен содержать "_"';
    valid = false;
  }

  // Форум
  if (!fa.startsWith('http')) {
    document.getElementById('fa-error').textContent = 'Укажите ссылку на форум';
    valid = false;
  }

  // Discord ID
  if (!/^\d+$/.test(discord_id)) {
    document.getElementById('discord-error').textContent = 'ID должен содержать только цифры';
    valid = false;
  }

  // Возраст
  if (!vozrast) {
    document.getElementById('vozrast-error').textContent = 'Возраст обязателен';
    valid = false;
  }

  // Город
  if (!gorod) {
    document.getElementById('gorod-error').textContent = 'Укажите местоположение';
    valid = false;
  }

  submitBtn.disabled = !valid;
  return valid;
}


const inputs = form.querySelectorAll('input');
inputs.forEach(input => {
  input.addEventListener('input', validateForm);
  input.addEventListener('blur', validateForm);
});

function submitForm() {
  if (!validateForm()) return;

  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  const data = {
    nick: document.getElementById('nick').value.trim(),
    fa: document.getElementById('fa').value.trim(),
    discord_id: document.getElementById('discord_id').value.trim(),
    vozrast: parseInt(document.getElementById('vozrast').value),
    gorod: document.getElementById('gorod').value.trim(),
    timestamp: new Date().toISOString()
  };

  setTimeout(() => {
    try {
      if (tg) {
        tg.sendData(JSON.stringify(data));
      } else {
        console.log('Данные формы:', data);
        showSuccessMessage();
      }
    } catch (err) {
      console.error('Ошибка отправки:', err);
      alert('❌ Ошибка отправки данных');
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  }, 800);
}

function showSuccessMessage() {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.innerHTML = '✅ Заявка успешно отправлена!';
  form.parentNode.insertBefore(successDiv, form);
  submitBtn.textContent = '✅ Готово!';
  submitBtn.style.background = '#22c55e';
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  submitForm();
});

validateForm();
