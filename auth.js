// Симуляция базы данных (в реальности нужен бэкенд)
let users = JSON.parse(localStorage.getItem('users')) || [
    {
        id: 1,
        username: 'admin',
        password: 'admin123',
        role: 'Администратор',
        social: 'discord',
        socialContact: 'admin#0001',
        avatar: 'https://i.pravatar.cc/150?img=1',
        registrationDate: '2024-01-01',
        status: 'Активен',
        isAdmin: true
    }
];

let pendingRequests = JSON.parse(localStorage.getItem('pendingRequests')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Переменные состояния
let isLoginMode = true;

// Элементы DOM
const authContainer = document.getElementById('authContainer');
const mainContent = document.getElementById('mainContent');
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const authBtn = document.getElementById('authBtn');
const authSwitch = document.getElementById('authSwitch');
const authSwitchText = document.getElementById('authSwitchText');
const registerFields = document.getElementById('registerFields');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const userWidget = document.getElementById('userWidget');
const profileMenu = document.getElementById('profileMenu');

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    if (currentUser) {
        showMainContent();
    }
    
    // Обработчики событий
    authForm.addEventListener('submit', handleAuth);
    authSwitch.addEventListener('click', toggleAuthMode);
    menuToggle.addEventListener('click', toggleSidebar);
    closeSidebar.addEventListener('click', toggleSidebar);
    userWidget.addEventListener('click', toggleProfileMenu);
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
        
        if (!profileMenu.contains(e.target) && !userWidget.contains(e.target)) {
            profileMenu.style.display = 'none';
        }
    });
});

// Переключение режима авторизации/регистрации
function toggleAuthMode(e) {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    
    if (isLoginMode) {
        authTitle.textContent = 'Авторизация';
        authBtn.textContent = 'ВОЙТИ';
        authSwitchText.textContent = 'Нет аккаунта?';
        authSwitch.textContent = 'Подать заявку';
        registerFields.style.display = 'none';
    } else {
        authTitle.textContent = 'Регистрация';
        authBtn.textContent = 'ПОДАТЬ ЗАЯВКУ';
        authSwitchText.textContent = 'Уже есть аккаунт?';
        authSwitch.textContent = 'Войти';
        registerFields.style.display = 'block';
    }
    
    authForm.reset();
}

// Обработка авторизации/регистрации
function handleAuth(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (isLoginMode) {
        // Авторизация
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showMainContent();
        } else {
            alert('❌ Неверный логин или пароль!');
        }
    } else {
        // Регистрация
        const socialType = document.getElementById('socialType').value;
        const socialContact = document.getElementById('socialContact').value;
        
        if (!socialType || !socialContact) {
            alert('❌ Заполните все поля!');
            return;
        }
        
        // Проверка на существующего пользователя
        if (users.find(u => u.username === username)) {
            alert('❌ Пользователь с таким ником уже существует!');
            return;
        }
        
        // Создание заявки
        const newRequest = {
            id: Date.now(),
            username,
            password,
            social: socialType,
            socialContact,
            requestDate: new Date().toLocaleDateString('ru-RU')
        };
        
        pendingRequests.push(newRequest);
        localStorage.setItem('pendingRequests', JSON.stringify(pendingRequests));
        
        alert('✅ Заявка отправлена! Ожидайте одобрения администратора.');
        toggleAuthMode(e);
    }
}

// Показать главный контент
function showMainContent() {
    authContainer.style.display = 'none';
    mainContent.style.display = 'block';
    menuToggle.style.display = 'flex';
    
    document.getElementById('welcomeUser').textContent = currentUser.username;
    
    // Обновление виджета пользователя
    userWidget.style.display = 'flex';
    document.getElementById('userName').textContent = currentUser.username;
    document.getElementById('userRole').textContent = currentUser.role;
    document.getElementById('userAvatar').src = currentUser.avatar;
    document.getElementById('regDate').textContent = currentUser.registrationDate;
    document.getElementById('userStatus').textContent = currentUser.status;
    
    // Показать админ-панель если пользователь админ
    if (currentUser.isAdmin) {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'block';
        });
    }
    
    // Загрузить участников
    loadMembers();
}

// Загрузка списка участников
function loadMembers() {
    const membersGrid = document.getElementById('membersGrid');
    membersGrid.innerHTML = '';
    
    users.forEach(user => {
        const card = document.createElement('div');
        card.className = 'member-card';
        card.innerHTML = `
            <div class="member-header">
                <img src="${user.avatar}" alt="${user.username}" class="member-avatar">
                <div>
                    <div class="member-name">${user.username}</div>
                    <div class="member-role">${user.role}</div>
                </div>
            </div>
            <div class="member-links">
                <a href="#" class="social-link" title="${user.social}">
                    ${getSocialIcon(user.social)}
                </a>
            </div>
        `;
        
        card.addEventListener('click', () => {
            window.location.href = `/${user.username}`;
        });
        
        membersGrid.appendChild(card);
    });
}

// Получить иконку соц. сети
function getSocialIcon(social) {
    const icons = {
        discord: '💬',
        telegram: '✈️',
        vk: '🎵'
    };
    return icons[social] || '🔗';
}

// Переключение боковой панели
function toggleSidebar() {
    sidebar.classList.toggle('active');
}

// Переключение меню профиля
function toggleProfileMenu(e) {
    e.stopPropagation();
    const menu = document.getElementById('profileMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// Выход
function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        location.reload();
    }
}

// Открыть настройки
function openSettings() {
    alert('Функция в разработке');
}
// Обновленная функция loadMembers с переходом на профили
function loadMembers() {
    const membersGrid = document.getElementById('membersGrid');
    membersGrid.innerHTML = '';
    
    users.forEach(user => {
        const card = document.createElement('div');
        card.className = 'member-card';
        card.innerHTML = `
            <div class="member-header">
                <img src="${user.avatar}" alt="${user.username}" class="member-avatar">
                <div>
                    <div class="member-name">${user.username}</div>
                    <div class="member-role">${user.role}</div>
                </div>
            </div>
            <p class="member-bio">${user.bio || 'Нет описания'}</p>
            <div class="member-links">
                ${user.links ? user.links.slice(0, 3).map(link => `
                    <a href="${link.url}" class="social-link" title="${link.title}" target="_blank" onclick="event.stopPropagation()">
                        ${getSocialIcon(link.type)}
                    </a>
                `).join('') : ''}
            </div>
        `;
        
        // Переход на профиль при клике на карточку
        card.addEventListener('click', () => {
            window.location.href = `profile.html?user=${user.username}`;
        });
        
        membersGrid.appendChild(card);
    });
}
