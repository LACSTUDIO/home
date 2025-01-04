const projects = ['project1', 'project2', 'project3', 'project4'];

function showProject(projectId) {
    document.querySelectorAll('.project-card').forEach(card => card.classList.remove('active'));
    document.querySelectorAll('.btn-group .btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(projectId).classList.add('active');
    const index = projects.indexOf(projectId);
    document.querySelectorAll('.btn-group .btn')[index].classList.add('active');
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const content = document.querySelector('.content');
    content.classList.toggle('dark-mode');
    const btn = document.querySelector('.btn-dark-mode');
    btn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
}


function toggleRedThemeAndShowPopup() {
    console.log('toggleRedThemeAndShowPopup called');
    document.body.classList.toggle('red-theme');
    console.log('red-theme toggled');
    // document.getElementById('Mao-message').style.display = 'block';
    // console.log('Mao-message displayed');
}

function showModal(icon, title, text, href = '#') {
    try {
        const modal = document.getElementById('modal');
        if (!modal) {
            throw new Error('模态框元素未找到');
        }
        modal.style.display = 'block';

        const modalTitle = document.querySelector('.modal-title');
        if (!modalTitle) {
            throw new Error('模态框标题元素未找到');
        }
        modalTitle.textContent = title;

        const modalText = document.querySelector('.modal-text');
        if (!modalText) {
            throw new Error('模态框文本元素未找到');
        }
        modalText.textContent = text;

        const qrImage = document.querySelector('.qr');
        if (!qrImage) {
            throw new Error('二维码图片元素未找到');
        }
        if (icon === 'none') {
            qrImage.style.display = 'none';
        } else {
            qrImage.style.display = 'block';
            qrImage.src = `img/qr/${icon}.png`;
        }

        const modalImage = document.querySelector('.modal-img');
        if (!modalImage) {
            throw new Error('模态框图片元素未找到');
        }
        if (icon === 'none') {
            modalImage.style.display = 'none';
        } else {
            modalImage.style.display = 'block';
            modalImage.src = `img/icons/${icon}.svg`;
        }

        const modalLink = document.getElementById('modal-link');
        if (!modalLink) {
            throw new Error('模态框链接元素未找到');
        }
        if (href === 'none') {
            modalLink.style.display = 'none';
        } else {
            modalLink.style.display = 'block';
            modalLink.setAttribute('href', href);
        }
    } catch (error) {
        console.error('显示模态框时出错:', error);
    }
}


function closeModal() {
    try {
        const modal = document.getElementById('modal');
        if (!modal) {
            throw new Error('模态框元素未找到');
        }
        modal.style.display = 'none';
    } catch (error) {
        console.error('关闭模态框时出错:', error);
    }
}

function openLink(event) {
    try {
        event.preventDefault();
        const modalLink = document.getElementById('modal-link');
        if (!modalLink) {
            throw new Error('模态框链接元素未找到');
        }
        const href = modalLink.getAttribute('href');
        if (href && href !== 'none') {
            window.location.href = href;
        } else {
            console.warn('没有找到有效的链接地址');
        }
    } catch (error) {
        console.error('打开链接时出错:', error);
    }
}
function closeWelcome(){
    document.querySelector('.welcome-message').style.display = 'none';
}

function showModalYC() {
    var modal = document.getElementById("yc-modal");
    modal.style.display = "block";
}
function closeModalYC() {
    var modal = document.getElementById("yc-modal");
    modal.style.display = "none";
}
