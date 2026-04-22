// Открыть админ-панель
function openAdminPanel() {
    const modal = document.getElementById('adminModal');
    modal.style.display = 'block';
    loadUsersTable();
}

// Открыть заявки на регистрацию
function openRequests() {
    if (pendingRequests.length === 0) {
        alert('📭 Нет новых заявок');
        return;
    }
    
    const requestsList = pendingRequests.map(req => `
        <div style="padding: 15px; border: 1px solid #00d4ff; border-radius: 10px; margin-bottom: 10px;">
            <strong>${req.username}</strong> (${req.social}: ${req.socialContact})
            <div style="margin-top: 10px;">
                <button class="action-btn" onclick="approveRequest(${req.id})">✅ Одобрить</button>
                <button class="action-btn danger" onclick="rejectRequest(${req.id})">❌ Отклонить</button>
            </div>
        </div>
    `).join('');
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>📋 Заявки на регистрацию</h2>
            ${requestsList}
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Одобрить заявку
function approveRequest(id) {
    const request = pendingRequests.find(r => r.id === id);
    if (!request) return;
    
    const newUser = {
        id: users.length + 1,
        username: request.username,
        password: request.password,
        role: 'Пользователь',
        social: request.social,
        socialContact: request.socialContact,
        avatar: `https://i.pravatar.cc/150?img=${users.length + 1}`,
        registrationDate: new Date().toLocaleDateString('ru-RU'),
        status: 'Активен',
        isAdmin: false
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    pendingRequests = pendingRequests.filter(r => r.id !== id);
    localStorage.setItem('pendingRequests', JSON.stringify(pendingRequests));
    
    alert(`✅ Пользователь ${newUser.username} добавлен!`);
    location.reload();
}

// Отклонить заявку
function rejectRequest(id) {
    if (confirm('Вы уверены, что хотите отклонить эту заявку?')) {
        pendingRequests = pendingRequests.filter(r => r.id !== id);
        localStorage.setItem('pendingRequests', JSON.stringify(pendingRequests));
        alert('❌ Заявка отклонена');
        location.reload();
    }
}

// Загрузить таблицу пользователей
function loadUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${user.avatar}" alt="${user.username}"></td>
            <td>${user.username}</td>
            <td>
                <select onchange="changeRole(${user.id}, this.value)" ${user.isAdmin && user.id === 1 ? 'disabled' : ''}>
                    <option value="Пользователь" ${user.role === 'Пользователь' ? 'selected' : ''}>Пользователь</option>
                    <option value="Модератор" ${user.role === 'Модератор' ? 'selected' : ''}>Модератор</option>
                    <option value="Администратор" ${user.role === 'Администратор' ? 'selected' : ''}>Администратор</option>
                    <option value="VIP" ${user.role === 'VIP' ? 'selected' : ''}>VIP</option>
                </select>
            </td>
            <td>${user.status}</td>
            <td>${user.social}: ${user.socialContact}</td>
            <td>
                <button class="action-btn" onclick="editUser(${user.id})">✏️</button>
                ${user.id !== 1 ? `<button class="action-btn danger" onclick="deleteUser(${user.id})">🗑️</button>` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Изменить роль
function changeRole(userId, newRole) {
    const user = users.find(u => u.id === userId);
    if (user) {
        user.role = newRole;
        user.isAdmin = newRole === 'Администратор';
        localStorage.setItem('users', JSON.stringify(users));
        alert(`✅ Роль изменена на "${newRole}"`);
    }
}

// Редактировать пользователя
function editUser(userId) {
    alert('Функция редактирования в разработке');
}

// Удалить пользователя
function deleteUser(userId) {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
        alert('✅ Пользователь удален');
        loadUsersTable();
        loadMembers();
    }
}

// Открыть список участников
function openMembersList() {
    toggleSidebar();
    document.querySelector('.container h1').scrollIntoView({ behavior: 'smooth' });
}

// Закрытие модальных окон
document.querySelectorAll('.modal .close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});
