/**
 * hout.js - 澎湃解锁工具箱网页的JavaScript功能
 * 包含所有与HOUT工具箱网页相关的交互功能
 */

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 初始化移动端菜单
  initMobileMenu();
  
  // 初始化版本信息
  fetchVersionInfo();
  
  // 获取感谢名单数据
  fetchThanksData();
  
  // 初始化截图轮播
  initScreenshots();
  
  // 初始化浮动下载按钮
  initFloatingDownloadBtn();

  // 显示通知弹窗
  showNotification();

  // 初始化模式名称显示
  updateModeName();
});

/**
 * 更新模式名称显示
 * 根据当前激活的内容标签更新顶部的模式名称
 */
function updateModeName() {
  const modeNameElement = document.getElementById('mode-name');
  const guiContent = document.getElementById('gui-content');
  const batContent = document.getElementById('bat-content');

  if (guiContent && !guiContent.classList.contains('hidden')) {
    modeNameElement.textContent = 'HOUT-GUI';
  } else if (batContent && !batContent.classList.contains('hidden')) {
    modeNameElement.textContent = 'HOUT-CLI';
  }
}

/**
 * 显示通知弹窗
 * 显示页面顶部的通知信息，并在5秒后自动隐藏
 */
function showNotification() {
  const notification = document.getElementById('notification');
  notification.classList.remove('hidden');
  
  // 5秒后自动隐藏
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 5000);
}

/**
 * 初始化移动端菜单
 * 设置移动端菜单的显示/隐藏逻辑和动画效果
 */
function initMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNav = document.getElementById('mobile-nav');
  
  if (mobileMenu && mobileNav) {
    mobileMenu.addEventListener('click', function() {
      mobileNav.classList.toggle('hidden');
      // 切换汉堡菜单图标样式
      const spans = mobileMenu.querySelectorAll('span');
      if (mobileNav.classList.contains('hidden')) {
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
      } else {
        spans[0].style.transform = 'translateY(8px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
      }
    });
    
    // 点击菜单项后关闭菜单
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        mobileNav.classList.add('hidden');
        const spans = mobileMenu.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
      });
    });
  }
}

/**
 * 获取版本信息
 * 从API获取软件版本信息并更新页面显示
 */
async function fetchVersionInfo() {
  try {
    const response = await fetch('https://api.lacs.top/hout.json');
    const data = await response.json();
    
    // 更新GUI版本信息
    document.getElementById('app-latest-version').textContent = data.latest_version;
    document.getElementById('app-release-date').textContent = data.release_date;
    document.getElementById('app-notice').textContent = data.notice.content;
    document.getElementById('app-changelog').textContent = data.content || '暂无更新日志';

    // 设置GUI下载链接
    const downloadLinks = data.download_links.windows;
    const guiDownloadContainer = document.getElementById('gui-download-links');
    guiDownloadContainer.innerHTML = ''; // 清空原有内容

    if (downloadLinks.quark) {
      const quarkLink = document.createElement('a');
      quarkLink.href = downloadLinks.quark;
      quarkLink.className = 'inline-flex items-center px-8 py-4 bg-primary hover:bg-secondary text-white font-semibold rounded-full transition-colors duration-300 shadow-lg transform hover:-translate-y-1';
      quarkLink.innerHTML = '<i class="fab fa-windows text-xl mr-2"></i> 夸克下载';
      quarkLink.onclick = function() { openLink(this.href); return false; };
      guiDownloadContainer.appendChild(quarkLink);
    }

    if (downloadLinks.xunlei) {
      const xunleiLink = document.createElement('a');
      xunleiLink.href = downloadLinks.xunlei;
      xunleiLink.className = 'inline-flex items-center px-8 py-4 bg-primary hover:bg-secondary text-white font-semibold rounded-full transition-colors duration-300 shadow-lg transform hover:-translate-y-1';
      xunleiLink.innerHTML = '<i class="fab fa-windows text-xl mr-2"></i> 迅雷下载';
      xunleiLink.onclick = function() { openLink(this.href); return false; };
      guiDownloadContainer.appendChild(xunleiLink);
    }

    // 更新命令行版本信息
    document.getElementById('bat-latest-version').textContent = data.bat_latest_version;
    document.getElementById('bat-release-date').textContent = data.bat_release_date;
    document.getElementById('bat-notice').textContent = data.bat_notice.content;
    document.getElementById('bat-changelog').textContent = data.bat_content || '暂无更新日志';

    // 设置命令行版本下载链接
    const batDownloadLinks = data.bat_download_links.windows;
    const batDownloadContainer = document.getElementById('bat-download-links');
    batDownloadContainer.innerHTML = ''; // 清空原有内容

    if (batDownloadLinks.quark) {
      const quarkLink = document.createElement('a');
      quarkLink.href = batDownloadLinks.quark;
      quarkLink.className = 'inline-flex items-center px-8 py-4 bg-secondary hover:bg-primary text-white font-semibold rounded-full transition-colors duration-300 shadow-lg transform hover:-translate-y-1';
      quarkLink.innerHTML = '<i class="fab fa-windows text-xl mr-2"></i> 夸克下载';
      quarkLink.onclick = function() { openLink(this.href); return false; };
      batDownloadContainer.appendChild(quarkLink);
    }

    if (batDownloadLinks.xunlei) {
      const xunleiLink = document.createElement('a');
      xunleiLink.href = batDownloadLinks.xunlei;
      xunleiLink.className = 'inline-flex items-center px-8 py-4 bg-secondary hover:bg-primary text-white font-semibold rounded-full transition-colors duration-300 shadow-lg transform hover:-translate-y-1';
      xunleiLink.innerHTML = '<i class="fab fa-windows text-xl mr-2"></i> 迅雷下载';
      xunleiLink.onclick = function() { openLink(this.href); return false; };
      batDownloadContainer.appendChild(xunleiLink);
    }
    
    // 初始化历史版本模态框
    initVersionModal(data);
    initBatVersionModal(data);
    
    // 初始化版本切换标签
    initVersionTabs();
  } catch (error) {
    console.error('获取版本信息失败:', error);
    document.getElementById('app-latest-version').textContent = '获取失败';
    document.getElementById('app-release-date').textContent = '获取失败';
    document.getElementById('app-notice').textContent = '获取公告失败';
    document.getElementById('app-changelog').textContent = '获取失败';
    document.getElementById('bat-latest-version').textContent = '获取失败';
    document.getElementById('bat-release-date').textContent = '获取失败';
    document.getElementById('bat-notice').textContent = '获取公告失败';
    document.getElementById('bat-changelog').textContent = '获取失败';
  }
}

/**
 * 初始化版本切换标签
 * 设置GUI和命令行版本之间的切换逻辑
 */
function initVersionTabs() {
  const guiTab = document.getElementById('gui-tab');
  const batTab = document.getElementById('bat-tab');
  const mobileGuiTab = document.getElementById('mobile-gui-tab');
  const mobileBatTab = document.getElementById('mobile-bat-tab');
  const guiContent = document.getElementById('gui-content');
  const batContent = document.getElementById('bat-content');
  
  // 切换到GUI版本的函数
  function switchToGui() {
    // 激活桌面版GUI标签
    guiTab.classList.remove('bg-white', 'text-gray-700');
    guiTab.classList.add('bg-primary', 'text-white');
    
    // 取消激活桌面版命令行标签
    batTab.classList.remove('bg-primary', 'text-white');
    batTab.classList.add('bg-white', 'text-gray-700');
    
    // 激活移动版GUI标签
    mobileGuiTab.classList.remove('bg-white', 'text-gray-700');
    mobileGuiTab.classList.add('bg-primary', 'text-white');
    
    // 取消激活移动版命令行标签
    mobileBatTab.classList.remove('bg-primary', 'text-white');
    mobileBatTab.classList.add('bg-white', 'text-gray-700');
    
    // 显示GUI内容，隐藏命令行内容
    guiContent.classList.remove('hidden');
    batContent.classList.add('hidden');

    updateModeName(); // 更新模式名称
  }
  
  // 切换到命令行版本的函数
  function switchToBat() {
    // 激活桌面版命令行标签
    batTab.classList.remove('bg-white', 'text-gray-700');
    batTab.classList.add('bg-primary', 'text-white');
    
    // 取消激活桌面版GUI标签
    guiTab.classList.remove('bg-primary', 'text-white');
    guiTab.classList.add('bg-white', 'text-gray-700');
    
    // 激活移动版命令行标签
    mobileBatTab.classList.remove('bg-white', 'text-gray-700');
    mobileBatTab.classList.add('bg-primary', 'text-white');
    
    // 取消激活移动版GUI标签
    mobileGuiTab.classList.remove('bg-primary', 'text-white');
    mobileGuiTab.classList.add('bg-white', 'text-gray-700');
    
    // 显示命令行内容，隐藏GUI内容
    batContent.classList.remove('hidden');
    guiContent.classList.add('hidden');

    updateModeName(); // 更新模式名称
  }
  
  // 为桌面版按钮添加事件监听器
  guiTab.addEventListener('click', switchToGui);
  batTab.addEventListener('click', switchToBat);
  
  // 为移动版按钮添加事件监听器
  mobileGuiTab.addEventListener('click', function() {
    switchToGui();
  });
  
  mobileBatTab.addEventListener('click', function() {
    switchToBat();
  });
}

/**
 * 初始化GUI历史版本模态框
 * 设置GUI版本历史模态框的显示和内容更新
 * @param {Object} data - 从API获取的版本数据
 */
function initVersionModal(data) {
  const modal = document.getElementById('version-modal');
  const closeBtn = modal.querySelector('.close');
  const historyLink = document.getElementById('history-link');
  const modalTitle = modal.querySelector('h2');
  
  // 点击历史版本链接显示模态框
  historyLink.addEventListener('click', function(e) {
    e.preventDefault();
    // 设置模态框标题
    modalTitle.innerHTML = '<i class="fas fa-desktop mr-2"></i> GUI版本历史';
    // 更新模态框内容
    updateVersionModalContent(data);
    modal.classList.remove('hidden');
  });
  
  // 点击关闭按钮隐藏模态框
  closeBtn.addEventListener('click', function() {
    modal.classList.add('hidden');
  });
  
  // 点击模态框外部区域隐藏模态框
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
}

/**
 * 初始化命令行版本历史版本模态框
 * 设置命令行版本历史模态框的显示和内容更新
 * @param {Object} data - 从API获取的版本数据
 */
function initBatVersionModal(data) {
  const batHistoryLink = document.getElementById('bat-history-link');
  const modal = document.getElementById('version-modal');
  const modalTitle = modal.querySelector('h2');
  
  // 点击命令行历史版本链接显示模态框
  batHistoryLink.addEventListener('click', function(e) {
    e.preventDefault();
    // 设置模态框标题
    modalTitle.innerHTML = '<i class="fas fa-terminal mr-2"></i> 命令行版本历史';
    // 更新模态框内容为命令行版本历史
    updateBatVersionModalContent(data);
    modal.classList.remove('hidden');
  });
}

/**
 * 更新命令行版本历史模态框内容
 * 根据API数据更新命令行版本历史模态框的内容
 * @param {Object} data - 从API获取的版本数据
 */
function updateBatVersionModalContent(data) {
  const modalContent = document.getElementById('modal-content');
  
  // 清空模态框内容
  modalContent.innerHTML = '';
  
  // 添加当前版本信息
  const currentVersion = document.createElement('div');
  currentVersion.className = 'mb-8 pb-6 border-b border-gray-200';
  currentVersion.innerHTML = `
    <h3 class="text-xl font-semibold mb-3 flex items-center">
      <i class="fas fa-code-branch mr-2 text-primary"></i>
      当前版本 (${data.bat_latest_version})
    </h3>
    <div class="text-gray-600 whitespace-pre-line">${data.bat_content}</div>
  `;
  modalContent.appendChild(currentVersion);
  
  // 添加历史版本信息
  if (data.bat_previous_versions && data.bat_previous_versions.length > 0) {
    const historyTitle = document.createElement('h3');
    historyTitle.className = 'text-xl font-semibold mb-4 flex items-center';
    historyTitle.innerHTML = '<i class="fas fa-history mr-2 text-primary"></i> 历史版本';
    modalContent.appendChild(historyTitle);
    
    // 创建历史版本列表
    data.bat_previous_versions.forEach(version => {
      const versionItem = document.createElement('div');
      versionItem.className = 'mb-6 pb-6 border-b border-gray-200 last:border-0';
      versionItem.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <h4 class="text-lg font-medium">${version.version}</h4>
          <span class="text-sm text-gray-500">${version.release_date}</span>
        </div>
        <div class="text-gray-600 whitespace-pre-line">${version.content}</div>
      `;
      modalContent.appendChild(versionItem);
    });
  } else {
    const noHistory = document.createElement('p');
    noHistory.className = 'text-gray-500 italic';
    noHistory.textContent = '暂无历史版本信息';
    modalContent.appendChild(noHistory);
  }
}

/**
 * 更新GUI历史版本模态框内容
 * 根据API数据更新GUI版本历史模态框的内容
 * @param {Object} data - 从API获取的版本数据
 */
function updateVersionModalContent(data) {
  const modalContent = document.getElementById('modal-content');
  
  // 清空模态框内容
  modalContent.innerHTML = '';
  
  // 添加当前版本信息
  const currentVersion = document.createElement('div');
  currentVersion.className = 'mb-8 pb-6 border-b border-gray-200';
  currentVersion.innerHTML = `
    <h3 class="text-xl font-semibold mb-3 flex items-center">
      <i class="fas fa-code-branch mr-2 text-primary"></i>
      当前版本 (${data.latest_version})
    </h3>
    <div class="text-gray-600 whitespace-pre-line">${data.content}</div>
  `;
  modalContent.appendChild(currentVersion);
  
  // 添加历史版本信息
  if (data.previous_versions && data.previous_versions.length > 0) {
    const historyTitle = document.createElement('h3');
    historyTitle.className = 'text-xl font-semibold mb-4 flex items-center';
    historyTitle.innerHTML = '<i class="fas fa-history mr-2 text-primary"></i> 历史版本';
    modalContent.appendChild(historyTitle);
    
    // 创建历史版本列表
    data.previous_versions.forEach(version => {
      const versionItem = document.createElement('div');
      versionItem.className = 'mb-6 pb-6 border-b border-gray-200 last:border-0';
      versionItem.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <h4 class="text-lg font-medium">${version.version}</h4>
          <span class="text-sm text-gray-500">${version.release_date}</span>
        </div>
        <div class="text-gray-600 whitespace-pre-line">${version.content}</div>
      `;
      modalContent.appendChild(versionItem);
    });
  } else {
    const noHistory = document.createElement('p');
    noHistory.className = 'text-gray-500 italic';
    noHistory.textContent = '暂无历史版本信息';
    modalContent.appendChild(noHistory);
  }
}

/**
 * 获取感谢名单数据
 * 从API获取感谢名单数据并显示在页面上
 */
function fetchThanksData() {
  fetch('https://api.xn--5brr03o.top/hout.json')
    .then(response => response.json())
    .then(data => {
      if (data && data.thanks && Array.isArray(data.thanks)) {
        displayThanksCards(data.thanks);
      } else {
        console.error('感谢数据格式不正确');
        document.getElementById('thanks-cards').innerHTML = '<p class="text-center col-span-full py-4 text-gray-500">暂无数据</p>';
      }
    })
    .catch(error => {
      console.error('获取感谢数据失败:', error);
      document.getElementById('thanks-cards').innerHTML = '<p class="text-center col-span-full py-4 text-gray-500">数据加载失败</p>';
    });
}

/**
 * 显示感谢卡片
 * 根据API数据创建并显示感谢卡片
 * @param {Array} thanksData - 感谢数据数组
 */
function displayThanksCards(thanksData) {
  const thanksContainer = document.getElementById('thanks-cards');
  thanksContainer.innerHTML = '';
  
  thanksData.forEach(item => {
    // 修复URL中可能存在的错误
    let url = item.url;
    if (url && url.startsWith('h http')) {
      url = url.replace('h http', 'http');
    }
    
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-300 p-6 text-center';
    card.innerHTML = `
      <h4 class="text-xl font-semibold mb-3">${item.name}</h4>
      <p class="text-gray-600 mb-4">${item.content}</p>
      <a href="${url}" target="_blank" class="inline-flex items-center px-4 py-2 bg-primary-light text-primary hover:bg-primary hover:text-white rounded-full transition-colors duration-300 font-medium">
        <i class="fas fa-external-link-alt mr-2"></i> 访问链接
      </a>
    `;
    thanksContainer.appendChild(card);
  });
}

/**
 * 初始化截图轮播
 * 设置软件截图轮播的交互和显示逻辑
 */
function initScreenshots() {
  const featuredImage = document.getElementById('featured-image');
  const featuredTitle = document.getElementById('featured-title');
  const currentSlide = document.querySelector('.current-slide');
  const totalSlides = document.querySelector('.total-slides');
  const prevButton = document.querySelector('.featured-arrow.prev');
  const nextButton = document.querySelector('.featured-arrow.next');
  const thumbnailsContainer = document.querySelector('.screenshot-thumbnails');
  
  if (featuredImage && thumbnailsContainer) {
    const thumbnails = thumbnailsContainer.querySelectorAll('.thumbnail');
    let currentIndex = 0;
    
    // 设置总幻灯片数量
    if (totalSlides) {
      totalSlides.textContent = thumbnails.length;
    }
    
    // 更新当前幻灯片
    function updateSlide(index) {
      // 更新当前索引
      currentIndex = index;
      
      // 更新特色图片
      const activeThumbnail = thumbnails[index];
      const imgSrc = activeThumbnail.src || activeThumbnail.dataset.src;
      
      // 如果缩略图还没有加载，先加载它
      if (activeThumbnail.dataset.src && !activeThumbnail.src) {
        activeThumbnail.src = activeThumbnail.dataset.src;
        activeThumbnail.removeAttribute('data-src');
      }
      
      featuredImage.src = imgSrc;
      featuredImage.alt = activeThumbnail.alt;
      
      // 更新标题
      if (featuredTitle) {
        featuredTitle.textContent = activeThumbnail.title || activeThumbnail.alt;
      }
      
      // 更新当前幻灯片指示器
      if (currentSlide) {
        currentSlide.textContent = index + 1;
      }
      
      // 更新缩略图活动状态
      thumbnails.forEach((thumb, i) => {
        if (i === index) {
          thumb.classList.add('active');
          thumb.classList.add('border-primary');
          thumb.classList.remove('border-transparent');
        } else {
          thumb.classList.remove('active');
          thumb.classList.remove('border-primary');
          thumb.classList.add('border-transparent');
        }
      });
    }
    
    // 缩略图点击事件
    thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => {
        updateSlide(index);
      });
    });
    
    // 上一张按钮
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) {
          newIndex = thumbnails.length - 1;
        }
        updateSlide(newIndex);
      });
    }
    
    // 下一张按钮
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        let newIndex = currentIndex + 1;
        if (newIndex >= thumbnails.length) {
          newIndex = 0;
        }
        updateSlide(newIndex);
      });
    }
    
    // 初始化第一张幻灯片
    updateSlide(0);
    
    // 懒加载缩略图
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      thumbnails.forEach(img => {
        if (img.dataset.src) {
          imageObserver.observe(img);
        }
      });
    } else {
      // 回退方案：立即加载所有图片
      thumbnails.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
    }
  }
}

/**
 * 初始化浮动下载按钮
 * 设置页面右下角浮动下载按钮的交互逻辑
 */
function initFloatingDownloadBtn() {
  const floatingBtn = document.getElementById('floatingDownloadBtn');
  
  if (floatingBtn) {
    floatingBtn.addEventListener('click', function() {
      const downloadSection = document.getElementById('download');
      if (downloadSection) {
        // 滚动到下载部分
        downloadSection.scrollIntoView({ behavior: 'smooth' });
        
        // 确保GUI版本是可见的
        const guiContent = document.getElementById('gui-content');
        const batContent = document.getElementById('bat-content');
        const guiTab = document.getElementById('gui-tab');
        const batTab = document.getElementById('bat-tab');
        
        if (guiContent.classList.contains('hidden')) {
          // 激活GUI标签
          guiTab.classList.remove('bg-white', 'text-gray-700');
          guiTab.classList.add('bg-primary', 'text-white');
          
          // 取消激活命令行标签
          batTab.classList.remove('bg-primary', 'text-white');
          batTab.classList.add('bg-white', 'text-gray-700');
          
          // 显示GUI内容，隐藏命令行内容
          guiContent.classList.remove('hidden');
          batContent.classList.add('hidden');
        }
        
        // 添加高亮效果
        const highlight = document.createElement('div');
        highlight.className = 'animate-highlight-pulse absolute border-2 border-primary rounded-lg pointer-events-none z-40';
        
        const rect = downloadSection.getBoundingClientRect();
        highlight.style.width = rect.width + 'px';
        highlight.style.height = rect.height + 'px';
        highlight.style.top = (window.scrollY + rect.top) + 'px';
        highlight.style.left = rect.left + 'px';
        
        document.body.appendChild(highlight);
        
        // 动画结束后移除高亮元素
        setTimeout(() => {
          document.body.removeChild(highlight);
        }, 1500);
      }
    });
  }
}

/**
 * 外部链接打开函数
 * 在新标签页中打开外部链接
 * @param {string} url - 要打开的URL
 */
function openLink(url) {
  window.open(url, '_blank');
}