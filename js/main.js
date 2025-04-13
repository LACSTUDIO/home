const projects = ['project1', 'project2', 'project3', 'project4'];
const projectCards = document.querySelectorAll('.project-card');
const modal = document.getElementById('modal');
const modalTitle = document.querySelector('.modal-title');
const modalText = document.querySelector('.modal-text');
const qrImage = document.querySelector('.qr');
const modalImage = document.querySelector('.modal-img');
const modalLink = document.getElementById('modal-link');
const darkModeButton = document.querySelector('.btn-dark-mode');
const maoBtn = document.getElementById('mao-btn');
const update_time = document.getElementById('update_time');
const umiId = 'a4e8c20f-d2e8-4b10-bdf5-2d52c389fd45'; // 获取到的 websiteId

document.addEventListener('DOMContentLoaded', function() {
    // 初始化主题
    initTheme();

    // 默认显示 project1 卡片
    showProject('project1');
    
    // 动态调整项目卡片高度
    adjustProjectCardHeight();

    // 获取网站更新时间
    fetch('https://api.github.com/repos/LACSTUDIO/home')
        .then(response => response.json())
        .then(data => {
            const updateTime = new Date(data.updated_at);
            const formattedTime = `${updateTime.getFullYear()}年${updateTime.getMonth() + 1}月${updateTime.getDate()}日 ${updateTime.getHours()}时${updateTime.getMinutes()}分`;
            update_time.textContent += ' ' + formattedTime;
        })
        .catch(error => console.error('获取网站更新时间出错:', error));

    // 添加项目按钮点击事件监听器
    document.querySelectorAll('#project-buttons button').forEach(button => {
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

    // 为 mao-btn 添加点击事件监听器
    if (maoBtn) {
        maoBtn.addEventListener('click', toggleMaoTheme);
    }

    // 添加滚动事件监听器
    window.addEventListener('scroll', handleScroll);

    // 初始化时检查可见性
    handleScroll();

    // 初始化 umami 统计
    umiTongji().catch(error => console.error('初始化 umiTongji 出错:', error));
});

function handleScroll() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const isVisible = section.getBoundingClientRect().top <= window.innerHeight && section.getBoundingClientRect().bottom >= 0;
        section.classList.toggle('visible', isVisible);
    });
}

// 切换主题函数
function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';

    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    darkModeButton.textContent = isDark ? '🌙' : '☀️';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// 初始化主题
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    darkModeButton.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

function toggleMaoTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');

    if (currentTheme === 'red') {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-theme', 'red');
        localStorage.setItem('theme', 'red');
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

        const hasIcon = icon !== 'none';
        toggleVisibility(qrImage, hasIcon);
        toggleVisibility(modalImage, hasIcon);
        if (hasIcon) {
            qrImage.src = `img/qr/${icon}.webp`;
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

function showProject(projectId) {
    const container = document.getElementById('project-cards-container');
    const cards = document.querySelectorAll('.project-card');
    const cardsPerRow = window.innerWidth >= 768 ? 2 : 1;

    // 隐藏所有项目卡片
    cards.forEach(card => {
        card.style.display = 'none';
        card.classList.remove('active');
    });

    // 显示选中项目组的卡片
    const activeCards = document.querySelectorAll(`.project-card[data-project="${projectId}"]`);
    activeCards.forEach(card => {
        card.style.display = 'flex';
        card.classList.add('active');
    });

    // 计算并设置容器高度
    const cardHeight = 160; // 卡片的最小高度
    const cardMargin = 24; // 上下边距总和
    const rows = Math.ceil(activeCards.length / cardsPerRow);
    const containerHeight = rows * (cardHeight + cardMargin);
    container.style.minHeight = `${containerHeight}px`;

    // 更新按钮状态
    document.querySelectorAll('#project-buttons .btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-project') === projectId) {
            btn.classList.add('active');
        }
    });
}

// 动态调整项目卡片高度
function adjustProjectCardHeight() {
    const activeCards = document.querySelectorAll('.project-card.active');
    if (activeCards.length === 0) return;
    
    // 重置高度以便重新计算
    activeCards.forEach(card => {
        card.style.height = 'auto';
    });
    
    // 根据屏幕宽度决定布局方式
    if (window.innerWidth > 768) {
        // 桌面布局：每行两个卡片，确保每行卡片高度一致
        for (let i = 0; i < activeCards.length; i += 2) {
            const currentCard = activeCards[i];
            const nextCard = activeCards[i + 1];
            
            if (nextCard) {
                // 如果有下一个卡片，取两者中较高的高度
                const maxHeight = Math.max(currentCard.scrollHeight, nextCard.scrollHeight);
                currentCard.style.height = `${maxHeight}px`;
                nextCard.style.height = `${maxHeight}px`;
            }
        }
    } else {
        // 移动布局：每个卡片高度自适应内容
        activeCards.forEach(card => {
            card.style.height = 'auto';
        });
    }
}

// 窗口大小改变时重新调整卡片高度
window.addEventListener('resize', adjustProjectCardHeight);

// 辅助函数：验证模态框元素是否存在
function validateModalElements() {
    return modal && modalTitle && modalText && qrImage && modalImage && modalLink;
}

// 辅助函数：验证URL格式
function validateUrl(url) {
    return url && typeof url === 'string' && /^(https?:\/\/)/i.test(url);
}

// 辅助函数：切换元素的显示
function toggleVisibility(element, isVisible) {
    if (element) {
        element.style.display = isVisible ? 'block' : 'none';
    }
}

async function umiTongji() {
    const response = await fetch(`https://umami.xn--5brr03o.top/api/umami?websiteId=${umiId}`, {
        method: 'GET',
        mode: 'cors',
        cache: 'default',
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const resdata = await response.json();
    document.querySelector('#pvStatic').textContent = resdata.pageviews.value;
}
