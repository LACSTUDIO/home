const projects = ['project1', 'project2', 'project3', 'project4'];

function showProject(projectId) {
    try {
        document.querySelectorAll('.project-card.active').forEach(card => card.classList.remove('active'));
        document.querySelectorAll('.btn-group .btn.active').forEach(btn => btn.classList.remove('active'));

        const projectElement = document.getElementById(projectId);
        if (!projectElement) {
            throw new Error(`项目ID为 ${projectId} 的元素未找到`);
        }
        projectElement.classList.add('active');

        const index = projects.indexOf(projectId);
        if (index === -1) {
            throw new Error(`项目ID为 ${projectId} 的索引未找到`);
        }
        document.querySelectorAll('.btn-group .btn')[index].classList.add('active');
    } catch (error) {
        console.error('设置项目时出错:', error);
    }
}

function toggleDarkMode() {
    try {
        document.body.classList.toggle('dark-mode');
        const content = document.querySelector('.content');
        if (!content) {
            throw new Error('内容元素未找到');
        }
        content.classList.toggle('dark-mode');

        const btn = document.querySelector('.btn-dark-mode');
        if (!btn) {
            throw new Error('按钮元素未找到');
        }
        btn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    } catch (error) {
        console.error('切换暗黑模式时出错:', error);
    }
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
        const modalImage = document.querySelector('.modal-img');
        const modalLink = document.getElementById('modal-link');

        [qrImage, modalImage, modalLink].forEach(element => {
            if (!element) {
                throw new Error('模态框中的元素未找到');
            }
        });

        if (icon === 'none') {
            qrImage.style.display = 'none';
            modalImage.style.display = 'none';
        } else {
            qrImage.style.display = 'block';
            qrImage.src = `img/qr/${icon}.png`;

            modalImage.style.display = 'block';
            modalImage.src = `img/icons/${icon}.svg`;
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

function closeWelcome() {
    try {
        const welcomeMessage = document.querySelector('.welcome-message');
        if (!welcomeMessage) {
            throw new Error('欢迎消息元素未找到');
        }
        welcomeMessage.style.display = 'none';
    } catch (error) {
        console.error('关闭欢迎消息时出错:', error);
    }
}

function showModalYC() {
    try {
        const modalYC = document.getElementById("yc-modal");
        if (!modalYC) {
            throw new Error('YC模态框元素未找到');
        }
        modalYC.style.display = "block";
    } catch (error) {
        console.error('显示YC模态框时出错:', error);
    }
}

function closeModalYC() {
    try {
        const modalYC = document.getElementById("yc-modal");
        if (!modalYC) {
            throw new Error('YC模态框元素未找到');
        }
        modalYC.style.display = "none";
    } catch (error) {
        console.error('关闭YC模态框时出错:', error);
    }
}
