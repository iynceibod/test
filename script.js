const tg = window.Telegram?.WebApp;
if (!tg) {
  console.warn('Telegram WebApp не найден');
} else {
  tg.expand();
  tg.setHeaderColor('#1a5c1a');
}

// Получение элементов формы
const form = document.getElementById('regForm');
const submitBtn = form.querySelector('.submit-btn');

// Функции валидации
function validateNick(nick) {
  if (!nick) return 'Укажите игровой ник';
  if (!nick.includes('_')) return 'Ник должен содержать символ "_"';
  return null;
}

function validateFA(fa) {
  if (!fa) return 'Укажите ссылку на форумный аккаунт';
  if (!fa.startsWith('http://') && !fa.startsWith('https://')) {
    return 'Ссылка должна начинаться с http:// или https://';
  }
  return null;
}

function validateDiscordID(id) {
  if (!id) return 'Укажите Discord ID';
  if (!/^\d+$/.test(id)) return 'Discord ID должен содержать только цифры';
  return null;
}

// Функция показа ошибок
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorDiv = document.getElementById(fieldId + '-error');
  
  if (message) {
    field.classList.add('error');
    errorDiv.textContent = message;
  } else {
    field.classList.remove('error');
    errorDiv.textContent = '';
  }
}

// Валидация в реальном времени
function validateForm() {
  const nick = document.getElementById('nick').value.trim();
  const fa = document.getElementById('fa').value.trim();
  const discord_id = document.getElementById('discord_id').value.trim();
  const vozrast = document.getElementById('vozrast').value;
  const gorod = document.getElementById('gorod').value.trim();

  // Проверяем каждое поле
  const nickError = validateNick(nick);
  const faError = validateFA(fa);
  const discordError = validateDiscordID(discord_id);

  // Показываем ошибки
  showError('nick', nickError);
  showError('fa', faError);
  showError('discord_id', discordError);

  // Проверяем, есть ли ошибки
  const hasErrors = nickError || faError || discordError;
  const allFilled = nick && fa && discord_id && vozrast && gorod;

  submitBtn.disabled = hasErrors || !allFilled;
  return !hasErrors && allFilled;
}

// Добавляем слушатели для валидации
const inputs = form.querySelectorAll('input');
inputs.forEach(input => {
  input.addEventListener('input', validateForm);
  input.addEventListener('blur', validateForm);
});

// Функция отправки данных
function submitForm() {
  if (!validateForm()) {
    return;
  }
  
  // Показываем загрузку
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  
  // Собираем данные
  const data = {
    nick: document.getElementById('nick').value.trim(),
    fa: document.getElementById('fa').value.trim(),
    discord_id: document.getElementById('discord_id').value.trim(),
    vozrast: parseInt(document.getElementById('vozrast').value),
    gorod: document.getElementById('gorod').value.trim(),
    timestamp: new Date().toISOString()
  };
  
  // Отправка через Telegram WebApp
  setTimeout(() => {
    try {
      if (tg) {
        tg.sendData(JSON.stringify(data));
      } else {
        // Для тестирования вне Telegram
        console.log('Данные формы:', data);
        showSuccessMessage();
      }
    } catch (err) {
      console.error('Ошибка отправки:', err);
      alert('❌ Ошибка отправки данных');
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  }, 1000);
}

// Показать сообщение об успехе
function showSuccessMessage() {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.innerHTML = '🦕 Заявка отправлена! Добро пожаловать в команду!';
  form.parentNode.insertBefore(successDiv, form);
  
  submitBtn.innerHTML = '🎉 Готово!';
  submitBtn.style.background = 'linear-gradient(135deg, #32cd32, #228b22)';
  submitBtn.classList.remove('loading');
}

// Обработка отправки формы
form.addEventListener('submit', function(e) {
  e.preventDefault();
  submitForm();
});

// Инициализация валидации
validateForm();
