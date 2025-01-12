const projects = ['project1', 'project2', 'project3', 'project4'];
const projectCards = document.querySelectorAll('.project-card'); // 修正这里
const modal = document.getElementById('modal');
const modalTitle = document.querySelector('.modal-title');
const modalText = document.querySelector('.modal-text');
const qrImage = document.querySelector('.qr');
const modalImage = document.querySelector('.modal-img');
const modalLink = document.getElementById('modal-link');
const darkModeButton = document.querySelector('.btn-dark-mode');
const welcomeMessage = document.querySelector('.welcome-message');
const update_time = document.getElementById('update_time');

document.addEventListener('DOMContentLoaded', function() {
    // 默认显示 project1 卡片
    showProject('project1');
    // 获取网站更新时间
    fetch('https://api.github.com/repos/LACSTUDIO/lacshome')
        .then(response => response.json())
        .then(data => {
            const updateTime = new Date(data.updated_at);
            const formattedTime = `${updateTime.getFullYear()}年${updateTime.getMonth() + 1}月${updateTime.getDate()}日 ${updateTime.getHours()}时${updateTime.getMinutes()}分`;
            update_time.textContent += ' ' + formattedTime;
        })
        .catch(error => console.error('Error:', error));

    // 添加项目按钮点击事件监听器
    const projectButtons = document.querySelectorAll('#project-buttons button');
    projectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const project = this.getAttribute('data-project');
            showProject(project);
        });
    });

    // 为 modal-link 按钮添加点击事件监听器
    if (modalLink) {
        modalLink.addEventListener('click', function(event) {
            const url = this.getAttribute('data-href');
            openLink(url);
            event.preventDefault(); // 防止默认行为
        });
    }

    // 为 darkModeButton 添加点击事件监听器
    if (darkModeButton) {
        darkModeButton.addEventListener('click', toggleDarkMode);
    }
});

function toggleDarkMode() {
    try {
        document.body.classList.toggle('dark-mode');
        darkModeButton.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    } catch (error) {
        console.error('切换暗黑模式时出错:', error);
    }
}

function toggleRedThemeAndShowPopup() {
    console.log('toggleRedThemeAndShowPopup called');
    document.body.classList.toggle('red-theme');
    console.log('red-theme toggled');
}

function showModal(icon, title, text, href = '#') {
    try {
        if (!modal || !modalTitle || !modalText || !qrImage || !modalImage || !modalLink) {
            throw new Error('模态框中的一个或多个元素未找到');
        }

        modal.style.display = 'block';
        modalTitle.textContent = title;
        modalText.textContent = text;

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
            modalLink.setAttribute('data-href', href); // 使用 data-href 传递 URL
        }
    } catch (error) {
        console.error('显示模态框时出错:', error);
    }
}

function closeModal() {
    try {
        if (!modal) {
            throw new Error('模态框元素未找到');
        }
        modal.style.display = 'none';
    } catch (error) {
        console.error('关闭模态框时出错:', error);
    }
}

function openLink(url) {
    try {
        if (!url || typeof url !== 'string') {
            throw new Error('无效的URL');
        }

        // 增强 URL 校验，确保是有效的 HTTP/HTTPS 链接
        const urlPattern = /^(https?:\/\/)/i;
        if (!urlPattern.test(url)) {
            throw new Error('无效的URL格式');
        }

        // 在新标签页中打开链接
        window.open(url, '_blank');

        console.log(`成功打开链接: ${url}`); // 添加调试信息
    } catch (error) {
        console.error('打开链接时出错:', error);
    }
}

function closeWelcome() {
    try {
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

function showProject(project) {
    projectCards.forEach(card => {
        if (card.getAttribute('data-project') === project) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // 更新按钮样式
    const projectButtons = document.querySelectorAll('#project-buttons button');
    projectButtons.forEach(button => {
        if (button.getAttribute('data-project') === project) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}
