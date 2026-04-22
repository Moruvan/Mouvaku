// Получить имя пользователя из URL
const urlParams = new URLSearchParams(window.location.search);
const profileUsername = urlParams.get('user') || 'admin';

// Текущий пользователь (из localStorage)
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Загрузить профиль
let profileData = null;

document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    setupEditorEvents();
});

// Загрузка профиля
function loadProfile() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    profileData = users.find(u => u.username === profileUsername);
    
    if (!profileData) {
        document.querySelector('.profile-container').innerHTML = `
            <h1>❌ Профиль не найден</h1>
            <p>Пользователь ${profileUsername} не существует</p>
            <a href="index.html" style="color: var(--accent-color);">← Вернуться на главную</a>
        `;
        return;
    }
    
    // Загрузить персональные настройки дизайна
    const customDesign = JSON.parse(localStorage.getItem(`design_${profileUsername}`)) || {};
    
    if (customDesign.background) {
        document.querySelector('.profile-container').style.background = customDesign.background;
    }
    
    if (customDesign.borderRadius) {
        document.querySelector('.profile-container').style.borderRadius = customDesign.borderRadius + 'px';
    }
    
    if (customDesign.opacity) {
        document.querySelector('.profile-container').style.opacity = customDesign.opacity;
    }
    
    // Отобразить данные
    document.getElementById('profileAvatar').src = profileData.avatar;
    document.getElementById('profileUsername').textContent = profileData.username;
    document.getElementById('profileRole').textContent = profileData.role;
    document.getElementById('profileBio').textContent = profileData.bio || 'Нет описания';
    document.getElementById('profileRegDate').textContent = profileData.registrationDate;
    document.getElementById('profileStatus').textContent = profileData.status;
    
    // Загрузить ссылки
    loadProfileLinks();
    
    // Показать кнопку редактирования если это профиль текущего пользователя
    if (currentUser && currentUser.username === profileUsername) {
        document.getElementById('editProfileBtn').style.display = 'block';
    }
}

// Загрузить ссылки профиля
function loadProfileLinks() {
    const linksContainer = document.getElementById('profileLinks');
    const links = profileData.links || [];
    
    if (links.length === 0) {
        linksContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Нет добавленных ссылок</p>';
        return;
    }
    
    linksContainer.innerHTML = '';
    
    links.forEach(link => {
        const linkCard = document.createElement('a');
        linkCard.href = link.url;
        linkCard.target = '_blank';
        linkCard.className = 'link-card';
        linkCard.innerHTML = `
            <div class="link-icon">${getSocialIcon(link.type)}</div>
            <div class="link-text">${link.title || getSocialName(link.type)}</div>
            <span style="color: var(--text-secondary);">→</span>
        `;
        
        // Применить кастомную иконку если есть
        if (link.customIcon) {
            linkCard.querySelector('.link-icon').innerHTML = `<img src="${link.customIcon}" style="width: 100%; height: 100%; border-radius: 8px;">`;
        }
        
        linksContainer.appendChild(linkCard);
    });
}

// Получить иконку соц. сети
function getSocialIcon(type) {
    const icons = {
        discord: '💬',
        telegram: '✈️',
        vk: '🎵',
        github: '🐙',
        twitter: '🐦',
        instagram: '📷',
        youtube: '📺',
        twitch: '🎮',
        spotify: '🎵',
        website: '🌐',
        email: '📧',
        custom: '🔗'
    };
    return icons[type] || '🔗';
}

// Получить название соц. сети
function getSocialName(type) {
    const names = {
        discord: 'Discord',
        telegram: 'Telegram',
        vk: 'VKontakte',
        github: 'GitHub',
        twitter: 'Twitter',
        instagram: 'Instagram',
        youtube: 'YouTube',
        twitch: 'Twitch',
        spotify: 'Spotify',
        website: 'Веб-сайт',
        email: 'Email',
        custom: 'Другое'
    };
    return names[type] || 'Ссылка';
}

// Открыть редактор профиля
function openProfileEditor() {
    const modal = document.getElementById('profileEditorModal');
    modal.style.display = 'block';
    
    // Загрузить текущие данные
    document.getElementById('editAvatar').value = profileData.avatar;
    document.getElementById('editBio').value = profileData.bio || '';
    
    // Загрузить настройки дизайна
    const customDesign = JSON.parse(localStorage.getItem(`design_${profileUsername}`)) || {};
    
    if (customDesign.bgType) {
        document.getElementById('cardBgType').value = customDesign.bgType;
        toggleBgType();
    }
    
    // Загрузить ссылки в редактор
    loadSocialLinksEditor();
}

// Настройка событий редактора
function setupEditorEvents() {
    // Переключение типа фона
    document.getElementById('cardBgType').addEventListener('change', toggleBgType);
    
    // Обновление значения прозрачности
    document.getElementById('cardTransparency').addEventListener('input', function() {
        document.getElementById('transparencyValue').textContent = this.value;
    });
    
    // Закрытие модального окна
    document.querySelector('#profileEditorModal .close').addEventListener('click', () => {
        document.getElementById('profileEditorModal').style.display = 'none';
    });
}

// Переключение типа фона
function toggleBgType() {
    const type = document.getElementById('cardBgType').value;
    
    if (type === 'color') {
        document.getElementById('colorPicker').style.display = 'block';
        document.getElementById('gradientPicker').style.display = 'none';
    } else {
        document.getElementById('colorPicker').style.display = 'none';
        document.getElementById('gradientPicker').style.display = 'block';
    }
}

// Загрузить редактор ссылок
function loadSocialLinksEditor() {
    const container = document.getElementById('socialLinksEditor');
    const links = profileData.links || [];
    
    container.innerHTML = '';
    
    links.forEach((link, index) => {
        addSocialLinkField(link, index);
    });
}

// Добавить поле для ссылки
function addSocialLink() {
    const index = document.querySelectorAll('.social-link-item').length;
    addSocialLinkField(null, index);
}

function addSocialLinkField(linkData, index) {
    const container = document.getElementById('socialLinksEditor');
    
    const linkItem = document.createElement('div');
    linkItem.className = 'social-link-item';
    linkItem.innerHTML = `
        <select data-index="${index}" class="link-type">
            <option value="discord" ${linkData?.type === 'discord' ? 'selected' : ''}>Discord</option>
            <option value="telegram" ${linkData?.type === 'telegram' ? 'selected' : ''}>Telegram</option>
            <option value="vk" ${linkData?.type === 'vk' ? 'selected' : ''}>VK</option>
            <option value="github" ${linkData?.type === 'github' ? 'selected' : ''}>GitHub</option>
            <option value="twitter" ${linkData?.type === 'twitter' ? 'selected' : ''}>Twitter</option>
            <option value="instagram" ${linkData?.type === 'instagram' ? 'selected' : ''}>Instagram</option>
            <option value="youtube" ${linkData?.type === 'youtube' ? 'selected' : ''}>YouTube</option>
            <option value="twitch" ${linkData?.type === 'twitch' ? 'selected' : ''}>Twitch</option>
            <option value="spotify" ${linkData?.type === 'spotify' ? 'selected' : ''}>Spotify</option>
            <option value="website" ${linkData?.type === 'website' ? 'selected' : ''}>Веб-сайт</option>
            <option value="email" ${linkData?.type === 'email' ? 'selected' : ''}>Email</option>
            <option value="custom" ${linkData?.type === 'custom' ? 'selected' : ''}>Другое</option>
        </select>
        <input type="text" placeholder="Название (опционально)" class="link-title" value="${linkData?.title || ''}" data-index="${index}">
        <input type="url" placeholder="https://..." class="link-url" value="${linkData?.url || ''}" data-index="${index}" required>
        <input type="url" placeholder="URL иконки (опционально)" class="link-icon" value="${linkData?.customIcon || ''}" data-index="${index}">
        <button type="button" class="remove-link-btn" onclick="removeSocialLink(this)">🗑️</button>
    `;
    
    container.appendChild(linkItem);
}

// Удалить поле ссылки
function removeSocialLink(button) {
    button.closest('.social-link-item').remove();
}

// Сохранить профиль
function saveProfile() {
    if (!currentUser || currentUser.username !== profileUsername) {
        alert('❌ У вас нет прав на редактирование этого профиля!');
        return;
    }
    
    // Собрать данные
    const avatar = document.getElementById('editAvatar').value;
    const bio = document.getElementById('editBio').value;
    
    // Настройки дизайна
    const bgType = document.getElementById('cardBgType').value;
    let background;
    
    if (bgType === 'color') {
        const color = document.getElementById('cardColor').value;
        background = color;
    } else {
        const color1 = document.getElementById('gradientColor1').value;
        const color2 = document.getElementById('gradientColor2').value;
        const angle = document.getElementById('gradientAngle').value;
        background = `linear-gradient(${angle}, ${color1}, ${color2})`;
    }
    
    const borderRadius = document.getElementById('cardShape').value;
    const opacity = document.getElementById('cardTransparency').value;
    
    // Собрать ссылки
    const linkItems = document.querySelectorAll('.social-link-item');
    const links = [];
    
    linkItems.forEach((item, index) => {
        const type = item.querySelector('.link-type').value;
        const title = item.querySelector('.link-title').value;
        const url = item.querySelector('.link-url').value;
        const customIcon = item.querySelector('.link-icon').value;
        
        if (url) {
            links.push({
                type,
                title: title || getSocialName(type),
                url,
                customIcon: customIcon || null
            });
        }
    });
    
    // Обновить данные пользователя
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.username === profileUsername);
    
    if (userIndex !== -1) {
        users[userIndex].avatar = avatar;
        users[userIndex].bio = bio;
        users[userIndex].links = links;
        
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Сохранить настройки дизайна отдельно
    const customDesign = {
        bgType,
        background,
        borderRadius,
        opacity
    };
    
    localStorage.setItem(`design_${profileUsername}`, JSON.stringify(customDesign));
    
    // Обновить текущего пользователя если это он
    if (currentUser.username === profileUsername) {
        currentUser.avatar = avatar;
        currentUser.bio = bio;
        currentUser.links = links;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    alert('✅ Профиль сохранен!');
    
    // Закрыть модальное окно и перезагрузить
    document.getElementById('profileEditorModal').style.display = 'none';
    location.reload();
}

// Закрытие модального окна при клике вне его
window.addEventListener('click', function(e) {
    const modal = document.getElementById('profileEditorModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
