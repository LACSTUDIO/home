const projects = ['project1', 'project2', 'project3', 'project4'];
const projectCards = document.querySelectorAll('.project-card');
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
    fetch('https://api.github.com/repos/LACSTUDIO/home')
        .then(response => response.json())
        .then(data => {
            const updateTime = new Date(data.updated_at);
            const formattedTime = `${updateTime.getFullYear()}年${updateTime.getMonth() + 1}月${updateTime.getDate()}日 ${updateTime.getHours()}时${updateTime.getMinutes()}分`;
            document.getElementById('update_time').textContent += ' ' + formattedTime;
        })
        .catch(error => console.error('Error:', error));



    // 添加项目按钮点击事件监听器
    const projectButtons = document.querySelectorAll('#project-buttons button');
    projectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const project = this.getAttribute('data-project');
            if (projects.includes(project)) {
                showProject(project);
            } else {
                console.error('无效的项目名称:', project);
            }
        });
    });

    // 为 modal-link 按钮添加点击事件监听器
    if (modalLink) {
        modalLink.addEventListener('click', function(event) {
            const url = this.getAttribute('data-href');
            if (openLink(url)) {
                event.preventDefault(); // 防止默认行为
            }
        });
    }

    // 为 darkModeButton 添加点击事件监听器
    if (darkModeButton) {
        darkModeButton.addEventListener('click', toggleDarkMode);
    }

    // 添加滚动事件监听器
    window.addEventListener('scroll', handleScroll);

    // 初始化时检查可见性
    handleScroll();
});

function handleScroll() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        section.classList.toggle('visible', rect.top <= window.innerHeight && rect.bottom >= 0);
    });
}

function toggleDarkMode() {
    try {
        console.log('toggleDarkMode called'); // 添加调试信息
        document.body.classList.toggle('dark-mode');
        darkModeButton.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        console.log('dark-mode class toggled:', document.body.classList.contains('dark-mode')); // 添加调试信息
    } catch (error) {
        console.error('切换暗黑模式时出错:', error);
    }
}

function showModal(icon, title, text, href = '#') {
    try {
        if (!validateModalElements()) {
            throw new Error('模态框中的一个或多个元素未找到');
        }

        modal.style.display = 'block';
        modalTitle.textContent = title;
        modalText.textContent = text;

        toggleVisibility(qrImage, icon !== 'none');
        toggleVisibility(modalImage, icon !== 'none');
        if (icon !== 'none') {
            qrImage.src = `img/qr/${icon}.png`;
            modalImage.src = `img/icons/${icon}.svg`;
        }

        toggleVisibility(modalLink, href !== 'none');
        if (href !== 'none') {
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
        if (!validateUrl(url)) {
            throw new Error('无效的URL');
        }

        // 在新标签页中打开链接
        window.open(url, '_blank');

        console.log(`成功打开链接: ${url}`); // 添加调试信息
        return true;
    } catch (error) {
        console.error('打开链接时出错:', error);
        return false;
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
        card.classList.toggle('active', card.getAttribute('data-project') === project);
    });

    // 更新按钮样式
    const projectButtons = document.querySelectorAll('#project-buttons button');
    projectButtons.forEach(button => {
        button.classList.toggle('active', button.getAttribute('data-project') === project);
    });
}

// 辅助函数：验证模态框元素是否存在
function validateModalElements() {
    return modal && modalTitle && modalText && qrImage && modalImage && modalLink;
}

// 辅助函数：验证URL格式
function validateUrl(url) {
    return url && typeof url === 'string' && /^(https?:\/\/)/i.test(url);
}

// 辅助函数：切换元素的可见性
function toggleVisibility(element, isVisible) {
    if (element) {
        element.style.display = isVisible ? 'block' : 'none';
    }
}
