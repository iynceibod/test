// Инициализация Telegram WebApp
const tg = window.Telegram?.WebApp;

if (!tg) {
  console.warn('Telegram WebApp не найден');
} else {
  tg.expand();
  tg.setHeaderColor('#667eea');
}

// Получение элементов формы
const form = document.getElementById('regForm');
const submitBtn = form.querySelector('.submit-btn');

// Валидация в реальном времени
function validateForm() {
  const nick = document.getElementById('nick').value.trim();
  const fa = document.getElementById('fa').value.trim();
  const discord_id = document.getElementById('discord_id').value.trim();
  const vozrast = document.getElementById('vozrast').value;
  const gorod = document.getElementById('gorod').value.trim();
  
  const isValid = nick && fa && discord_id && vozrast && gorod;
  submitBtn.disabled = !isValid;
  
  return isValid;
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
  }, 800);
}

// Показать сообщение об успехе (для тестирования)
function showSuccessMessage() {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.innerHTML = '✅ Заявка успешно отправлена!';
  form.parentNode.insertBefore(successDiv, form);
  
  submitBtn.textContent = '✅ Готово!';
  submitBtn.style.background = '#22c55e';
}

// Обработка отправки формы
form.addEventListener('submit', function(e) {
  e.preventDefault();
  submitForm();
});

// Инициализация валидации
validateForm();
