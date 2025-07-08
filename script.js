:root {
    --primary: #1a2e1a;
    --primary-light: #2d4a2d;
    --primary-darker: #0f1a0f;
    --accent: #4a6741;
    --accent-light: #6b8a62;
    --accent-bright: #7fb069;
    --background: #0a0f0a;
    --surface: #1a2e1a;
    --surface-light: #233323;
    --surface-elevated: #2d4a2d;
    --text: #e8f5e8;
    --text-secondary: #b8d4b8;
    --text-muted: #7fb069;
    --border: #2d4a2d;
    --border-light: #3d5a3d;
    --border-focus: #7fb069;
    --success: #7fb069;
    --error: #d4615b;
    --warning: #e8b86d;
    --shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.6);
    --shadow-xl: 0 12px 40px rgba(0, 0, 0, 0.8);
    --radius: 12px;
    --radius-sm: 8px;
    --radius-lg: 16px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, sans-serif;
    background: linear-gradient(135deg, var(--background) 0%, var(--primary-darker) 30%, var(--primary) 70%, var(--primary-light) 100%);
    background-attachment: fixed;
    color: var(--text);
    line-height: 1.6;
    padding: 20px;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.container {
    width: 100%;
    max-width: 440px;
}

.form-wrapper {
    background: var(--surface);
    border-radius: var(--radius-lg);
    padding: 48px;
    box-shadow: var(--shadow-xl);
    border: 1px solid var(--border);
    backdrop-filter: blur(20px);
    position: relative;
    overflow: hidden;
}

.form-wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent-bright), transparent);
    opacity: 0.6;
}

.header {
    text-align: center;
    margin-bottom: 40px;
}

.icon {
    width: 56px;
    height: 56px;
    margin: 0 auto 24px;
    background: linear-gradient(135deg, var(--accent), var(--accent-bright));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text);
    font-size: 22px;
    font-weight: 700;
    box-shadow: var(--shadow);
    position: relative;
}

.icon::after {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, var(--accent-bright), var(--accent));
    border-radius: 50%;
    z-index: -1;
    opacity: 0.3;
}

.title {
    font-size: 28px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 8px;
    letter-spacing: -0.025em;
}

.subtitle {
    color: var(--text-secondary);
    font-size: 16px;
    font-weight: 400;
}

.form-group {
    margin-bottom: 24px;
    position: relative;
}

.form-group label {
    display: block;
    font-weight: 500;
    color: var(--text);
    margin-bottom: 8px;
    font-size: 14px;
    letter-spacing: 0.025em;
}

.form-group input {
    width: 100%;
    padding: 16px 20px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-size: 16px;
    background: var(--surface-light);
    color: var(--text);
    transition: var(--transition);
    outline: none;
    font-weight: 400;
}

.form-group input::placeholder {
    color: var(--text-muted);
    opacity: 0.8;
}

.form-group input:focus {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px rgba(127, 176, 105, 0.15);
    background: var(--surface-elevated);
    transform: translateY(-1px);
}

.form-group input:hover:not(:focus) {
    border-color: var(--border-light);
    background: var(--surface-elevated);
}

.form-group input.error {
    border-color: var(--error);
    background: rgba(212, 97, 91, 0.1);
    animation: shake 0.4s ease-in-out;
}

.form-group input.success {
    border-color: var(--success);
    background: rgba(127, 176, 105, 0.1);
}

.error-message {
    color: var(--error);
    font-size: 12px;
    margin-top: 6px;
    display: none;
    font-weight: 500;
}

.submit-btn {
    width: 100%;
    padding: 16px 24px;
    background: linear-gradient(135deg, var(--accent), var(--accent-bright));
    color: var(--text);
    border: none;
    border-radius: var(--radius);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    margin-top: 12px;
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow);
}

.submit-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.6s ease;
}

.submit-btn:hover {
    background: linear-gradient(135deg, var(--accent-bright), var(--accent-light));
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.submit-btn:hover::before {
    left: 100%;
}

.submit-btn:active {
    transform: translateY(0);
}

.submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.submit-btn.loading {
    color: transparent;
    pointer-events: none;
}

.submit-btn.loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    border: 2px solid transparent;
    border-top: 2px solid var(--text);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

/* Модераторы */
.moders-wrapper {
    background: var(--surface);
    border-radius: var(--radius-lg);
    padding: 40px;
    box-shadow: var(--shadow-xl);
    border: 1px solid var(--border);
    margin-top: 24px;
    backdrop-filter: blur(20px);
    position: relative;
    overflow: hidden;
}

.moders-wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent-bright), transparent);
    opacity: 0.6;
}

.moders-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 32px;
    text-align: center;
    letter-spacing: -0.025em;
}

.moder-group {
    margin-bottom: 32px;
}

.moder-group:last-child {
    margin-bottom: 0;
}

.moder-group-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
    position: relative;
}

.moder-group-title::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 40px;
    height: 1px;
    background: var(--accent-bright);
}

.moder-item {
    display: flex;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
    transition: var(--transition);
    position: relative;
}

.moder-item:last-child {
    border-bottom: none;
}

.moder-item:hover {
    background: var(--surface-light);
    margin: 0 -20px;
    padding: 16px 20px;
    border-radius: var(--radius);
    border-bottom: 1px solid transparent;
    transform: translateX(4px);
}

.moder-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--accent-bright));
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text);
    font-size: 16px;
    font-weight: 600;
    margin-right: 16px;
    flex-shrink: 0;
    box-shadow: var(--shadow);
    position: relative;
}

.moder-avatar::after {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, var(--accent-bright), var(--accent));
    border-radius: 50%;
    z-index: -1;
    opacity: 0.3;
}

.moder-info {
    flex-grow: 1;
}

.moder-name {
    font-weight: 600;
    color: var(--text);
    font-size: 16px;
    margin-bottom: 4px;
}

.moder-level {
    font-size: 13px;
    color: var(--text-secondary);
    font-weight: 500;
}

.moder-tg {
    color: var(--accent-bright);
    text-decoration: none;
    font-size: 13px;
    margin-top: 4px;
    display: block;
    font-weight: 500;
    transition: var(--transition);
}

.moder-tg:hover {
    color: var(--accent-light);
    text-decoration: underline;
}

.stats {
    display: flex;
    justify-content: space-between;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
    gap: 16px;
}

.stat-item {
    text-align: center;
    flex: 1;
    padding: 16px;
    background: var(--surface-light);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    transition: var(--transition);
}

.stat-item:hover {
    background: var(--surface-elevated);
    transform: translateY(-2px);
    box-shadow: var(--shadow);
}

.stat-value {
    display: block;
    font-size: 24px;
    font-weight: 700;
    color: var(--accent-bright);
    margin-bottom: 4px;
}

.stat-label {
    display: block;
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 500;
    letter-spacing: 0.025em;
}

.loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
    text-align: center;
    color: var(--text-secondary);
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border);
    border-top: 3px solid var(--accent-bright);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
}

/* Адаптивность */
@media (max-width: 480px) {
    body {
        padding: 16px;
    }
    
    .form-wrapper,
    .moders-wrapper {
        padding: 32px 24px;
    }
    
    .icon {
        width: 48px;
        height: 48px;
        font-size: 20px;
    }
    
    .title {
        font-size: 24px;
    }
    
    .form-group input {
        padding: 14px 16px;
    }
    
    .submit-btn {
        padding: 14px 20px;
    }
    
    .stats {
        flex-direction: column;
        gap: 12px;
    }
    
    .stat-item {
        padding: 12px;
    }
    
    .moder-avatar {
        width: 40px;
        height: 40px;
        font-size: 14px;
    }
}

/* Дополнительные улучшения */
.form-group input:focus::placeholder {
    opacity: 0.5;
    transform: translateY(-2px);
}

.submit-btn:focus-visible {
    outline: 2px solid var(--accent-bright);
    outline-offset: 2px;
}

/* Скроллбар */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: var(--surface);
}

::-webkit-scrollbar-thumb {
    background: var(--accent);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--accent-bright);
}

/* Выделение текста */
::selection {
    background: rgba(127, 176, 105, 0.3);
    color: var(--text);
}
