document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const menuToggle = document.getElementById('menu-toggle');
    const userBtn = document.getElementById('user-btn');
    const accountPopup = document.getElementById('account-popup');

    // 1. Sidebar & Overlay Logic
    const toggleMenu = () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    };

    menuToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // 2. Account Popup
    userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        accountPopup.classList.toggle('active');
    });

    document.addEventListener('click', () => {
        accountPopup.classList.remove('active');
    });

    // 3. Dropdown Logic (FIXED)
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const navDropdown = document.querySelector('.nav-dropdown');

    dropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Важно, чтобы не срабатывал клик по родителю
        dropdownMenu.classList.toggle('active');
        navDropdown.classList.toggle('active');
    });

    // 4. Section Switching
    const navItems = document.querySelectorAll('.nav-item[data-section]');
    const allSections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-section');
            
            // Скрываем всё
            allSections.forEach(sec => sec.classList.add('hidden'));
            
            // Показываем нужный блок
            const target = document.getElementById(targetId + '-section');
            if (target) target.classList.remove('hidden');

            // Если кликнули по вложенному элементу — закрываем меню
            if (item.classList.contains('sub-item') || !item.classList.contains('dropdown-toggle')) {
                toggleMenu();
            }
        });
    });
});

// Функции переключения внутри формы (Login / Request)
function switchAuth(view) {
    const loginView = document.getElementById('login-view');
    const requestView = document.getElementById('request-view');

    if (view === 'request') {
        loginView.classList.add('hidden');
        requestView.classList.remove('hidden');
    } else {
        loginView.classList.remove('hidden');
        requestView.classList.add('hidden');
    }
}

// Эмуляция отправки заявки
function submitRequest() {
    const nick = document.getElementById('reg-nick').value;
    const contact = document.getElementById('reg-contact').value;

    if (nick && contact) {
        alert(Заявка от ${nick} отправлена! Мы свяжемся с вами в ${contact}.);
        switchAuth('login');
    } else {
        alert('Заполни все поля, дружище!');
    }
}
