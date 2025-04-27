// 页面可见性检测模块
const VisibilityObserver = {
    init() {
        this.sections = document.querySelectorAll('section');
        this.bindEvents();
        this.checkVisibility();
    },

    bindEvents() {
        window.addEventListener('scroll', () => this.checkVisibility());
        window.addEventListener('resize', () => this.checkVisibility());
    },

    checkVisibility() {
        this.sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;
            section.classList.toggle('visible', isVisible);
        });
    }
};

// 轮播图功能
function initSlideshow() {
    const slides = document.querySelectorAll('.screenshot-slider img');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    let currentSlide = 0;
    let slideInterval;

    // 预加载图片和事件绑定
    function preloadImage(index) {
        const img = slides[index];
        if (img.dataset.src && !img.src.includes(img.dataset.src)) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
    }

    function showSlide(index) {
        slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
        thumbnails.forEach((thumb, i) => thumb.classList.toggle('active', i === index));
        currentSlide = index;
        updateSlideIndicator();
        updateFeaturedImage(index);
    }

    function updateSlideIndicator() {
        document.querySelector('.current-slide').textContent = currentSlide + 1;
    }

    function startSlideshow() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);
    }

    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    // 绑定事件
    prevBtn.addEventListener('click', () => {
        showSlide((currentSlide - 1 + slides.length) % slides.length);
        stopSlideshow();
        setTimeout(startSlideshow, 10000);
    });
    
    nextBtn.addEventListener('click', () => {
        showSlide((currentSlide + 1) % slides.length);
        stopSlideshow();
        setTimeout(startSlideshow, 10000);
    });

    // 使用事件委托处理缩略图点击
    document.querySelector('.screenshot-thumbnails').addEventListener('click', (e) => {
        if (e.target.classList.contains('thumbnail')) {
            const index = Array.from(thumbnails).indexOf(e.target);
            showSlide(index);
            stopSlideshow();
            setTimeout(startSlideshow, 10000);
        }
    });

    document.querySelector('.screenshot-main').addEventListener('mouseenter', stopSlideshow);
    document.querySelector('.screenshot-main').addEventListener('mouseleave', startSlideshow);

    // 初始化
    preloadImage(0);
    showSlide(0);
    startSlideshow();
    
    // 导出函数到全局作用域
    window.showSlide = showSlide;
}

// 移动端菜单
function initMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// 初始化版本历史功能
function initVersionHistory() {
    document.getElementById('history-link').addEventListener('click', async function(e) {
        e.preventDefault();

        const modal = document.getElementById('version-modal');
        const versionList = document.getElementById('version-list');
        modal.style.display = 'block';
        versionList.innerHTML = '<div class="loading-message"><div class="spinner"></div><p>加载中...</p></div>';

        try {
            const cacheKey = 'houtVersionsCache';
            const cacheTime = 'houtVersionsCacheTime';
            const now = Date.now();
            const cachedData = localStorage.getItem(cacheKey);
            const cacheTimestamp = localStorage.getItem(cacheTime);

            if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp) < 600000)) {
                const data = JSON.parse(cachedData);
                updateVersionModalContent(data);
            } else {
                const response = await fetch('https://api.xn--5brr03o.top/hout.json', {
                    cache: 'no-cache'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                localStorage.setItem(cacheKey, JSON.stringify(data));
                localStorage.setItem(cacheTime, now.toString());
                updateVersionModalContent(data);
            }
        } catch (error) {
            console.error('获取版本信息失败:', error);
            versionList.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i><p>暂时无法获取历史版本信息，请稍后再试</p></div>';
        }

        const closeModal = () => {
            modal.style.opacity = 0;
            setTimeout(() => {
                modal.style.display = 'none';
                modal.style.opacity = 1;
            }, 200);
        };

        const closeButton = document.querySelector('.close');
        closeButton.onclick = closeModal;

        window.onclick = (e) => {
            if (e.target === modal) closeModal();
        };
    });
}

// 更新版本模态框内容
function updateVersionModalContent(data) {
    const versionList = document.getElementById('version-list');

    if (!data.previous_versions || data.previous_versions.length === 0) {
        versionList.innerHTML = '<div class="empty-message"><i class="fas fa-info-circle"></i><p>暂无历史版本</p></div>';
        return;
    }

    versionList.innerHTML = data.previous_versions.map(version => `
        <div class="version-item">
            <h3>版本 ${version.version}</h3>
            <p>发布日期：${version.release_date}</p>
            <div class="version-content">${version.content.replace(/\n/g, '<br>')}</div>
        </div>
    `).join('');
}

// 懒加载图片
function loadLazyImages() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, { rootMargin: '50px 0px' });

    document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
}

// 更新大图
function updateFeaturedImage(index) {
    const featuredImage = document.getElementById('featured-image');
    const featuredTitle = document.getElementById('featured-title');
    const slides = document.querySelectorAll('.screenshot-slider img');
    const currentSlide = slides[index];

    const imgSrc = currentSlide.dataset.src || currentSlide.src;
    featuredImage.src = imgSrc;
    featuredTitle.textContent = currentSlide.title || currentSlide.alt;
}

// 大图预览
function openLightbox(index) {
    const slides = document.querySelectorAll('.screenshot-slider img');
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';

    const imgSrc = slides[index].dataset.src || slides[index].src;

    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <div class="lightbox-loading"><div class="spinner"></div></div>
            <img src="${imgSrc}" alt="${slides[index].alt}" class="lightbox-image">
            <div class="lightbox-caption">${slides[index].title || slides[index].alt}</div>
            <button class="lightbox-prev"><i class="fas fa-chevron-left"></i></button>
            <button class="lightbox-next"><i class="fas fa-chevron-right"></i></button>
            <div class="lightbox-counter"><span class="current">${index + 1}</span>/${slides.length}</div>
        </div>
    `;

    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const loadingIndicator = lightbox.querySelector('.lightbox-loading');

    lightboxImg.onload = function() {
        loadingIndicator.style.display = 'none';
    };

    if (lightboxImg.complete) {
        loadingIndicator.style.display = 'none';
    }

    const closeLight = () => {
        document.body.removeChild(lightbox);
        document.body.style.overflow = '';
    };

    const close = lightbox.querySelector('.lightbox-close');
    close.addEventListener('click', closeLight);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLight();
    });

    let currentLightboxIndex = index;
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter .current');

    function updateLightboxImage(newIndex) {
        loadingIndicator.style.display = 'flex';
        const newSrc = slides[newIndex].dataset.src || slides[newIndex].src;
        lightboxImg.src = newSrc;
        lightboxImg.alt = slides[newIndex].alt;
        lightboxCaption.textContent = slides[newIndex].title || slides[newIndex].alt;
        lightboxCounter.textContent = newIndex + 1;
    }

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex - 1 + slides.length) % slides.length;
        updateLightboxImage(currentLightboxIndex);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex + 1) % slides.length;
        updateLightboxImage(currentLightboxIndex);
    });

    document.addEventListener('keydown', function keyListener(e) {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        } else if (e.key === 'Escape') {
            close.click();
            document.removeEventListener('keydown', keyListener);
        }
    });
}

// 工具函数
function openLink(url) {
    window.open(url, '_blank');
}

// 初始化平滑滚动
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.hash);
            if (!target) return;
            
            target.scrollIntoView({ behavior: 'smooth' });

            // 添加高亮动画
            const highlightElement = document.createElement('div');
            highlightElement.className = 'scroll-highlight';
            document.body.appendChild(highlightElement);

            const rect = target.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            highlightElement.style.top = `${rect.top + scrollTop - 10}px`;
            highlightElement.style.left = `${rect.left - 10}px`;
            highlightElement.style.width = `${rect.width + 20}px`;
            highlightElement.style.height = `${rect.height + 20}px`;

            setTimeout(() => highlightElement.remove(), 1500);

            // 移动端菜单处理
            if (window.innerWidth <= 768) {
                const mobileMenu = document.getElementById('mobile-menu');
                const navLinks = document.querySelector('.nav-links');
                mobileMenu.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });
}

// 大图预览按钮事件
function initFeaturedButton() {
    const featuredButton = document.querySelector('.featured-button');
    if (featuredButton) {
        featuredButton.addEventListener('click', function() {
            const slides = document.querySelectorAll('.screenshot-slider img');
            const index = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
            openLightbox(index);
        });
    }
}

// 初始化下载信息
function initDownloadInfo() {
    const latestVersionElement = document.getElementById('app-latest-version');
    const releaseDateElement = document.getElementById('app-release-date');
    const noticeElement = document.getElementById('app-notice');
    const downloadButton = document.getElementById('download-link');

    async function fetchAPIData() {
        try {
            const cacheKey = 'houtVersionsCache';
            const cacheTime = 'houtVersionsCacheTime';
            const now = Date.now();
            const cachedData = localStorage.getItem(cacheKey);
            const cacheTimestamp = localStorage.getItem(cacheTime);

            if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp) < 600000)) {
                const data = JSON.parse(cachedData);
                updateDownloadInfo(data);
            } else {
                const response = await fetch('https://api.xn--5brr03o.top/hout.json', {
                    cache: 'no-cache'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                localStorage.setItem(cacheKey, JSON.stringify(data));
                localStorage.setItem(cacheTime, now.toString());
                updateDownloadInfo(data);
            }
        } catch (error) {
            console.error('获取版本信息失败:', error);
            latestVersionElement.textContent = '获取失败';
            releaseDateElement.textContent = '获取失败';
            noticeElement.textContent = '获取公告失败，请稍后再试';
        }
    }

    function updateDownloadInfo(data) {
        // 更新版本信息
        latestVersionElement.textContent = data.latest_version || '未知';
        
        // 更新发布日期
        releaseDateElement.textContent = data.release_date || '未知';
        
        // 更新公告
        if (data.notice && data.notice.enabled) {
            noticeElement.innerHTML = data.notice.content.replace(/\\n/g, '<br>');
        } else {
            noticeElement.textContent = '暂无公告';
        }
        
        // 更新下载链接
        if (data.download_links && data.download_links.windows && data.download_links.windows.url) {
            downloadButton.setAttribute('data-url', data.download_links.windows.url);
        } else {
            downloadButton.setAttribute('data-url', '#');
            downloadButton.classList.add('disabled');
            downloadButton.textContent = '暂无下载链接';
        }
    }

    // 获取数据
    fetchAPIData();
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    VisibilityObserver.init();
    initSlideshow();
    initMobileMenu();
    initSmoothScroll();
    initVersionHistory();
    loadLazyImages();
    initFeaturedButton();
    initDownloadInfo();
    
    // 导出必要的函数到全局作用域
    window.openLightbox = openLightbox;
    window.openLink = openLink;
});
