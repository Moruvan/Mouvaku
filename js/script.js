document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const menuToggle = document.getElementById('menu-toggle');
    const userBtn = document.getElementById('user-btn');
    const accountPopup = document.getElementById('account-popup');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    menuToggle.onclick = () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    };

    overlay.onclick = menuToggle.onclick;

    userBtn.onclick = (e) => {
        e.stopPropagation();
        accountPopup.classList.toggle('active');
    };

    dropdownToggle.onclick = (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
    };

    document.onclick = () => accountPopup.classList.remove('active');
});

function switchAuth(view) {
    document.getElementById('login-view').classList.toggle('hidden', view === 'request');
    document.getElementById('request-view').classList.toggle('hidden', view === 'login');
}

function submitRequest() {
    alert("Заявка отправлена!");
    switchAuth('login');
}
