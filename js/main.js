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
const umiId = 'a4e8c20f-d2e8-4b10-bdf5-2d52c389fd45'; // 获取到的 websiteId

document.addEventListener('DOMContentLoaded', function() {
    // 初始化主题
    initTheme();

    // 默认显示 project1 卡片
    showProject('project1');
    
    // 动态调整项目卡片高度
    adjustProjectCardHeight();


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
                event.preventDefault();
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
    
    // 获取哔哩哔哩粉丝数据
    fetchBilibiliFans();

    // 获取模态框元素
    const ycModal = document.getElementById('yc-modal');
    
    // 点击模态框背景时关闭模态框
    if (modal) {
        const modalBackground = modal.querySelector('.modal-background');
        modalBackground.addEventListener('click', function(e) {
            // 只有当点击的是背景元素本身时才关闭模态框
            if (e.target === modalBackground) {
                closeModal();
            }
        });
    }
    
    // 点击远程刷机模态框背景时关闭
    if (ycModal) {
        const ycModalBackground = ycModal.querySelector('.modal-background');
        ycModalBackground.addEventListener('click', function(e) {
            // 只有当点击的是背景元素本身时才关闭模态框
            if (e.target === ycModalBackground) {
                closeModalYC();
            }
        });
    }
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

function showModal(iconUrl) {
    try {
        if (!validateModalElements()) {
            throw new Error('error: 模态框元素未找到');
        }

        modal.style.display = 'block';

        if (iconUrl !== 'none') {
            qrImage.src = iconUrl; // 直接使用 URL
            qrImage.style.display = 'block';
        } else {
            qrImage.style.display = 'none';
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
    return modal && qrImage;
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

// 获取哔哩哔哩粉丝数据
function fetchBilibiliFans() {
    // 使用JSONP方式解决跨域问题
    const script = document.createElement('script');
    script.src = 'https://api.bilibili.com/x/relation/stat?vmid=1779662818&jsonp=handleBilibiliFansData';
    document.body.appendChild(script);
    
    // 设置超时处理，防止API请求失败时没有显示
    setTimeout(() => {
        const fansElement = document.getElementById('bilibili-fans');
        if (fansElement && fansElement.textContent === '粉丝数:') {
            fansElement.textContent = '粉丝数: 获取中...';
            console.log('B站粉丝数据获取超时');
        }
    }, 5000);
}

// JSONP回调函数
function handleBilibiliFansData(response) {
    console.log('收到B站API响应:', response);
    if (response && response.code === 0 && response.data) {
        const fansCount = response.data.follower;
        const fansElement = document.getElementById('bilibili-fans');
        if (fansElement) {
            fansElement.textContent = '粉丝数: ' + fansCount;
            console.log('成功更新B站粉丝数:', fansCount);
        } else {
            console.error('未找到显示粉丝数的元素');
        }
    } else {
        console.error('B站API返回错误:', response);
        const fansElement = document.getElementById('bilibili-fans');
        if (fansElement) {
            fansElement.textContent = '粉丝数: 获取失败';
        }
    }
}

// 主题切换功能
const themeToggle = document.getElementById('dark-mode-toggle');
const mobileThemeToggle = document.getElementById('mobile-dark-mode-toggle');

// 公共的切换主题函数
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    // 更新桌面端按钮图标
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon-o');
        icon.classList.add('fa-sun-o');
    } else {
        icon.classList.remove('fa-sun-o');
        icon.classList.add('fa-moon-o');
    }
    
    // 更新移动端按钮图标
    const mobileIcon = mobileThemeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        mobileIcon.classList.remove('fa-moon-o');
        mobileIcon.classList.add('fa-sun-o');
    } else {
        mobileIcon.classList.remove('fa-sun-o');
        mobileIcon.classList.add('fa-moon-o');
    }
    
    // 保存主题偏好到localStorage
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// 桌面端按钮点击事件
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// 移动端按钮点击事件
if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', toggleTheme);
}

// 页面加载时检查用户主题偏好
window.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        
        // 如果主题是暗色模式，更新按钮图标为太阳图标
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-moon-o');
            icon.classList.add('fa-sun-o');
        }
        
        // 更新移动端按钮图标
        const mobileIcon = mobileThemeToggle.querySelector('i');
        if (mobileIcon) {
            mobileIcon.classList.remove('fa-moon-o');
            mobileIcon.classList.add('fa-sun-o');
        }
    }
});

// 下载类型切换
const downloadTypeButtons = {
  gui: document.getElementById('gui-download-btn'),
  cli: document.getElementById('cli-download-btn')
};

// 版本内容容器
const versionContents = {
  gui: document.getElementById('gui-content'),
  cli: document.getElementById('bat-content')
};

// 初始化下载链接
function initializeDownloadLinks() {
  // 创建下载方式点击处理函数
  function createDownloadHandler(linkElement, xunleiLink, quarkLink) {
    return () => {
      if (xunleiLink && quarkLink) {
        // 获取最新的链接元素
        const appXunleiLink = document.getElementById('app-xunlei-link');
        const appQuarkLink = document.getElementById('app-quark-link');
        const batXunleiLink = document.getElementById('bat-xunlei-link');
        const batQuarkLink = document.getElementById('bat-quark-link');
        
        // 更新下拉菜单中的链接
        if (appXunleiLink) appXunleiLink.href = xunleiLink;
        if (appQuarkLink) appQuarkLink.href = quarkLink;
        if (batXunleiLink) batXunleiLink.href = xunleiLink;
        if (batQuarkLink) batQuarkLink.href = quarkLink;
        
        // 显示下载方式选择弹窗
        showDownloadModal(xunleiLink, quarkLink);
        
        // 阻止默认跳转
        return false;
      }
      return true;
    };
  }

  // 显示下载方式选择弹窗
  function showDownloadModal(xunleiLink, quarkLink) {
    // 创建模态框HTML
    const modalHTML = `
      <div id="download-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-96 shadow-xl animate-fadeIn">
          <h3 class="text-xl font-bold mb-4">选择下载方式</h3>
          <div class="space-y-3">
            <a href="${xunleiLink}" onclick="openLink(this.href); return false;" class="block w-full text-center px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
              迅雷下载
            </a>
            <a href="${quarkLink}" onclick="openLink(this.href); return false;" class="block w-full text-center px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
              夸克网盘
            </a>
            <a href="#" onclick="window.location.href = document.getElementById('download-link').dataset.windowsUrl; return false;" class="block w-full text-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
              直接下载（Windows）
            </a>
          </div>
          <button onclick="document.getElementById('download-modal').remove()" class="mt-4 w-full text-center px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
            取消
          </button>
        </div>
      </div>
    `;
    
    // 移除已有的模态框
    const existingModal = document.getElementById('download-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // 添加新的模态框
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  // 处理GUI下载链接
  const appDownloadLink = document.getElementById('download-link');
  const appXunleiLink = document.getElementById('app-xunlei-link');
  const appQuarkLink = document.getElementById('app-quark-link');

  // 处理CLI下载链接
  const batDownloadLink = document.getElementById('bat-download-link');
  const batXunleiLink = document.getElementById('bat-xunlei-link');
  const batQuarkLink = document.getElementById('bat-quark-link');

  // 设置点击事件
  if (appDownloadLink && (appXunleiLink || batXunleiLink) && (appQuarkLink || batQuarkLink)) {
    
    // 保存原始Windows下载链接
    appDownloadLink.dataset.windowsUrl = appDownloadLink.href;
    if (batDownloadLink) {
      batDownloadLink.dataset.windowsUrl = batDownloadLink.href;
    }

    // 为所有下载链接绑定点击处理
    [appDownloadLink, batDownloadLink].forEach(link => {
      if (link) {
        link.addEventListener('click', createDownloadHandler(
          link,
          (appXunleiLink && appXunleiLink.href) || (batXunleiLink && batXunleiLink.href),
          (appQuarkLink && appQuarkLink.href) || (batQuarkLink && batQuarkLink.href)
        ));
      }
    });
  }
}

// 添加动画支持
function addAnimationSupport() {
  // 添加淡入动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-out forwards;
    }
  `;
  document.head.appendChild(style);
}

// 切换下载类型
function toggleDownloadType(type) {
  // 验证参数
  if (!['gui', 'cli'].includes(type)) return;

  // 更新按钮样式
  Object.entries(downloadTypeButtons).forEach(([key, button]) => {
    if (button) {
      button.classList.toggle('bg-primary', key === type);
      button.classList.toggle('text-white', key === type);
      button.classList.toggle('bg-gray-200', key !== type);
      button.classList.toggle('text-gray-700', key !== type);
    }
  });

  // 切换内容显示
  Object.entries(versionContents).forEach(([key, content]) => {
    if (content) {
      content.classList.toggle('hidden', key !== type);
      // 触发动画
      if (key === type && !content.classList.contains('hidden')) {
        content.classList.add('animate-fadeIn');
        setTimeout(() => {
          content.classList.remove('animate-fadeIn');
        }, 500);
      }
    }
  });
}

// 初始化函数
function init() {
  // 默认显示GUI版本
  toggleDownloadType('gui');
  
  // 绑定按钮点击事件
  downloadTypeButtons.gui?.addEventListener('click', () => toggleDownloadType('gui'));
  downloadTypeButtons.cli?.addEventListener('click', () => toggleDownloadType('cli'));
  
  // 初始化下载链接
  initializeDownloadLinks();
  
  // 添加版本切换动画
  document.querySelectorAll('[data-version]').forEach(element => {
    element.addEventListener('click', () => {
      const version = element.dataset.version;
      toggleDownloadType(version);
      
      // 添加动画效果
      const content = versionContents[version];
      if (content) {
        content.classList.add('animate-fadeIn');
        setTimeout(() => {
          content.classList.remove('animate-fadeIn');
        }, 500);
      }
    });
  });
}

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', () => {
  init();
  addAnimationSupport();
});

// 友情链接申请弹窗功能
document.addEventListener('DOMContentLoaded', function() {
    const applyLinkBtn = document.getElementById('applyLinkBtn');
    const applyLinkModal = document.getElementById('applyLinkModal');
    const closeModalBtn = document.getElementById('closeModal');
    const submitApplicationBtn = document.getElementById('submitApplication');
    const linkApplicationForm = document.getElementById('linkApplicationForm');

    // 打开弹窗
    applyLinkBtn.addEventListener('click', function() {
        applyLinkModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });

    // 关闭弹窗
    closeModalBtn.addEventListener('click', function() {
        applyLinkModal.classList.add('hidden');
        document.body.style.overflow = '';
    });

    // 表单提交处理
    submitApplicationBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 验证表单
        if (!linkApplicationForm.checkValidity()) {
            linkApplicationForm.reportValidity();
            return;
        }

        // 获取表单数据
        const formData = new FormData(linkApplicationForm);
        const applicationData = {
            siteName: formData.get('siteName'),
            siteUrl: formData.get('siteUrl'),
            contactEmail: formData.get('contactEmail'),
            description: formData.get('description')
        };

        // 这里可以添加发送到服务器的代码，现在先用console.log模拟
        console.log('收到友情链接申请:', applicationData);
        
        // 显示成功提示（实际应用中应替换为真正的通知）
        alert('感谢您的申请！我们将在24小时内审核并邮件通知您结果。');
        
        // 关闭弹窗并重置表单
        applyLinkModal.classList.add('hidden');
        document.body.style.overflow = '';
        linkApplicationForm.reset();
    });

    // 点击遮罩层关闭弹窗
    applyLinkModal.addEventListener('click', function(e) {
        if (e.target === applyLinkModal) {
            applyLinkModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });
});
