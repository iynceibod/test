const tg = window.Telegram?.WebApp;
if (!tg) {
  console.warn('Telegram WebApp не найден');
} else {
  tg.expand();
  tg.setHeaderColor('#2d5016');
}

// Форма регистрации (ваш существующий код)
const form = document.getElementById('regForm');
const submitBtn = form?.querySelector('.submit-btn');

// Элементы для списка модерации
const modersList = document.getElementById('modersList');
const loadingSpinner = document.querySelector('.loading-spinner');
const totalModersElement = document.getElementById('totalModers');
const modersUpTo3Element = document.getElementById('modersUpTo3');

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  if (modersList) {
    loadModersData();
  }
  
  if (form) {
    initForm();
  }
});

// Загрузка данных модерации
async function loadModersData() {
  try {
    if (tg) {
      // 1. Вариант с получением данных через WebApp.initData
      if (tg.initDataUnsafe?.moders_data) {
        const data = JSON.parse(tg.initDataUnsafe.moders_data);
        renderModersData(data);
      } 
      // 2. Вариант с запросом данных у бота
      else {
        tg.sendData(JSON.stringify({action: "get_moders"}));
        tg.onEvent('webAppDataReceived', (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.action === "moders_data") {
              renderModersData(data.payload);
            }
          } catch (error) {
            showModersError();
          }
        });
      }
    } else {
      // Режим разработки - тестовые данные
      const testData = {
        grouped: {
          "Руководство Discord": [
            {level: 5, role: "Администратор", nick: {text: "Admin_User", link: "https://t.me/admin"}}
          ],
          "Модераторы": [
            {level: 2, role: "Модератор", nick: {text: "Moder_User", link: null}}
          ]
        },
        total: 2,
        up_to_3: 1
      };
      renderModersData(testData);
    }
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    showModersError();
  }
}

function renderModersData(data) {
  if (!data || !data.grouped) {
    showModersError();
    return;
  }

  // Обновляем статистику
  totalModersElement.textContent = data.total || 0;
  modersUpTo3Element.textContent = data.up_to_3 || 0;

  // Строим список модерации
  let html = '';
  
  for (const [groupName, moders] of Object.entries(data.grouped)) {
    if (moders.length === 0) continue;
    
    html += `<div class="moders-group">
               <h3 class="group-title">${groupName}</h3>
               <div class="moders-group-list">`;
    
    moders.forEach(moder => {
      const nickHtml = moder.nick.link 
        ? `<a href="${moder.nick.link}" target="_blank" class="moder-nick-link">${moder.nick.text}</a>`
        : `<span class="moder-nick">${moder.nick.text}</span>`;
      
      html += `<div class="moder-item">
                 <div class="moder-info">
                   ${nickHtml}
                   <span class="moder-role">${moder.role}</span>
                 </div>
               </div>`;
    });
    
    html += `</div></div>`;
  }
  
  modersList.innerHTML = html;
  loadingSpinner.style.display = 'none';
}

function showModersError() {
  if (loadingSpinner) {
    loadingSpinner.querySelector('p').textContent = 'Ошибка загрузки данных. Пожалуйста, попробуйте позже.';
  }
}

// Ваш существующий код для формы (с небольшими изменениями)
function initForm() {
  const fieldTouched = {
    nick: false,
    fa: false,
    discord_id: false,
    vozrast: false,
    gorod: false
  };

  function validateNick(nick) {
    const errorElement = document.getElementById('nick-error');
    
    if (!fieldTouched.nick) return true;
    
    if (!nick) {
      showError(errorElement, 'Введите ник');
      return false;
    }
    
    if (!nick.includes('_')) {
      showError(errorElement, 'Ник должен быть в формате Nick_Name');
      return false;
    }
    
    hideError(errorElement);
    return true;
  }

  function validateForumAccount(url) {
    const errorElement = document.getElementById('fa-error');
    
    if (!fieldTouched.fa) return true;
    
    if (!url) {
      showError(errorElement, 'Введите URL форумного аккаунта');
      return false;
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      showError(errorElement, 'Введите корректный URL');
      return false;
    }
    
    hideError(errorElement);
    return true;
  }

  function validateDiscordId(id) {
    const errorElement = document.getElementById('discord-error');
    
    if (!fieldTouched.discord_id) return true;
    
    if (!id) {
      showError(errorElement, 'Введите Discord ID');
      return false;
    }
    
    if (!/^\d+$/.test(id)) {
      showError(errorElement, 'Discord ID должен состоять только из цифр');
      return false;
    }
    
    hideError(errorElement);
    return true;
  }

  function validateAge(age) {
    const errorElement = document.getElementById('age-error');
    
    if (!fieldTouched.vozrast) return true;
    
    if (!age) {
      showError(errorElement, 'Введите возраст');
      return false;
    }
    
    hideError(errorElement);
    return true;
  }

  function validateLocation(location) {
    const errorElement = document.getElementById('location-error');
    
    if (!fieldTouched.gorod) return true;
    
    if (!location) {
      showError(errorElement, 'Введите место проживания');
      return false;
    }
    
    hideError(errorElement);
    return true;
  }

  function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
  }

  function hideError(element) {
    element.textContent = '';
    element.style.display = 'none';
  }

  function validateForm() {
    const nick = document.getElementById('nick').value.trim();
    const fa = document.getElementById('fa').value.trim();
    const discord_id = document.getElementById('discord_id').value.trim();
    const vozrast = document.getElementById('vozrast').value;
    const gorod = document.getElementById('gorod').value.trim();
    
    const isNickValid = validateNick(nick);
    const isFaValid = validateForumAccount(fa);
    const isDiscordValid = validateDiscordId(discord_id);
    const isAgeValid = validateAge(vozrast);
    const isLocationValid = validateLocation(gorod);
    
    const isValid = isNickValid && isFaValid && isDiscordValid && isAgeValid && isLocationValid;
    submitBtn.disabled = !isValid;
    
    return isValid;
  }

  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      fieldTouched[this.id] = true;
      validateForm();
      if (this.classList.contains('invalid')) {
        this.classList.remove('invalid');
      }
    });
    
    input.addEventListener('blur', function() {
      fieldTouched[this.id] = true;
      const value = this.value.trim();
      
      switch(this.id) {
        case 'nick':
          validateNick(value);
          if (!validateNick(value)) this.classList.add('invalid');
          break;
        case 'fa':
          validateForumAccount(value);
          if (!validateForumAccount(value)) this.classList.add('invalid');
          break;
        case 'discord_id':
          validateDiscordId(value);
          if (!validateDiscordId(value)) this.classList.add('invalid');
          break;
        case 'vozrast':
          validateAge(value);
          if (!validateAge(value)) this.classList.add('invalid');
          break;
        case 'gorod':
          validateLocation(value);
          if (!validateLocation(value)) this.classList.add('invalid');
          break;
      }
    });
  });

  function submitForm() {
    if (!validateForm()) {
      return;
    }
    
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
        alert('Ошибка отправки данных');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    }, 800);
  }

  function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
      <div class="success-icon"></div>
      <div>Заявка успешно отправлена!</div>
    `;
    form.parentNode.insertBefore(successDiv, form);
    
    submitBtn.textContent = 'Готово!';
    submitBtn.classList.remove('loading');
    submitBtn.style.background = '#22c55e';
    
    setTimeout(() => {
      form.reset();
      submitBtn.style.background = '';
      submitBtn.textContent = 'Отправить заявку';
      successDiv.remove();
      validateForm();
      
      for (const key in fieldTouched) {
        fieldTouched[key] = false;
      }
    }, 3000);
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    submitForm();
  });

  validateForm();
}
