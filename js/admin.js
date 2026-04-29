// --- ЗАЩИТА АДМИНКИ ---
const secretPass = "152515"; // ПОМЕНЯЙ ЭТОТ ПАРОЛЬ НА СВОЙ!
const currentLock = sessionStorage.getItem('admin_lock');

if (currentLock !== secretPass) {
    let attempt = prompt("Доступ закрыт. Введите пароль:");
    if (attempt === secretPass) {
        sessionStorage.setItem('admin_lock', secretPass);
    } else {
        window.location.href = "index.html"; // Выкидываем на визитку
    }
}
// ----------------------

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();

    document.getElementById('color-accent').addEventListener('input', (e) => {
        document.getElementById('hex-accent').textContent = e.target.value;
    });
    document.getElementById('color-text').addEventListener('input', (e) => {
        document.getElementById('hex-text').textContent = e.target.value;
    });
    document.getElementById('color-bg').addEventListener('input', (e) => {
        document.getElementById('hex-bg').textContent = e.target.value;
    });

    document.getElementById('card-opacity').addEventListener('input', (e) => {
        document.getElementById('opacity-val').textContent = e.target.value;
    });
    document.getElementById('card-blur').addEventListener('input', (e) => {
        document.getElementById('blur-val').textContent = e.target.value;
    });
});

function saveAllSettings() {
    const config = {
        bgUrl: document.getElementById('bg-url').value,
        audioUrl: document.getElementById('audio-url').value,
        avatarUrl: document.getElementById('avatar-url').value,
        bio: document.getElementById('bio-text').value,
        location: document.getElementById('location-text').value,
        cardPosition: document.getElementById('card-position').value, // Сохраняем позицию
        opacity: document.getElementById('card-opacity').value,
        blur: document.getElementById('card-blur').value,
        colorAccent: document.getElementById('color-accent').value,
        colorText: document.getElementById('color-text').value,
        colorBg: document.getElementById('color-bg').value,
        monoIcons: document.getElementById('toggle-mono').checked,
        animTitle: document.getElementById('toggle-anim').checked,
        volumeControl: document.getElementById('toggle-volume').checked
    };

    localStorage.setItem('sotoriko_config', JSON.stringify(config));

    const btn = document.querySelector('.btn-save');
    const originalText = btn.textContent;
    btn.textContent = 'Сохранено! ✔️';
    btn.style.background = 'var(--accent)';
    btn.style.color = '#000';
    btn.style.boxShadow = 'var(--neon-glow)';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = 'transparent';
        btn.style.color = 'var(--accent)';
        btn.style.boxShadow = 'none';
    }, 2000);
}

function loadSettings() {
    const saved = localStorage.getItem('sotoriko_config');
    if (!saved) return;

    const config = JSON.parse(saved);

    document.getElementById('bg-url').value = config.bgUrl || '';
    document.getElementById('audio-url').value = config.audioUrl || '';
    document.getElementById('avatar-url').value = config.avatarUrl || '';
    document.getElementById('bio-text').value = config.bio || '';
    document.getElementById('location-text').value = config.location || '';
    
    document.getElementById('card-position').value = config.cardPosition || 'center'; // Загружаем позицию

    document.getElementById('card-opacity').value = config.opacity || 50;
    document.getElementById('opacity-val').textContent = config.opacity || 50;
    
    document.getElementById('card-blur').value = config.blur || 20;
    document.getElementById('blur-val').textContent = config.blur || 20;

    if (config.colorAccent) {
        document.getElementById('color-accent').value = config.colorAccent;
        document.getElementById('hex-accent').textContent = config.colorAccent;
    }
    if (config.colorText) {
        document.getElementById('color-text').value = config.colorText;
        document.getElementById('hex-text').textContent = config.colorText;
    }
    if (config.colorBg) {
        document.getElementById('color-bg').value = config.colorBg;
        document.getElementById('hex-bg').textContent = config.colorBg;
    }

    document.getElementById('toggle-mono').checked = config.monoIcons || false;
    document.getElementById('toggle-anim').checked = config.animTitle !== false;
    document.getElementById('toggle-volume').checked = config.volumeControl !== false;
}
