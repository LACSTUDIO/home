
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

    showSlide(0);
    startSlideshow();
}

// 移动端菜单
function initMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
            mobileMenu.setAttribute('aria-expanded', mobileMenu.classList.contains('active'));
        });

        // 确保点击菜单项后关闭菜单
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                navLinks.classList.remove('active');
                mobileMenu.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// 更新版本模态框内容



// 更新预览图
function updateFeaturedImage(index) {
    const previewImage = document.getElementById('preview-image');
    const previewTitle = document.getElementById('preview-title');
    const slides = document.querySelectorAll('.screenshot-slider img');
    const currentSlide = slides[index];
    previewImage.src = currentSlide.src;
    previewTitle.textContent = currentSlide.title || currentSlide.alt;
}

// 工具函数

// 初始化平滑滚动
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.hash);
            if (!target) return;
            target.scrollIntoView({ behavior: 'smooth' });
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

async function initVersionInfo() {
    try {
        const response = await fetch('https://api.xn--5brr03o.top/hout.json');
        const data = await response.json();

        // 更新版本信息
        document.getElementById('app-latest-version').textContent = data.latest_version;
        document.getElementById('app-release-date').textContent = data.release_date;
        document.getElementById('app-notice').textContent = data.notice.content;

        // 设置下载链接
        const downloadLink = document.getElementById('download-link');
        downloadLink.setAttribute('data-url', data.download_links.windows.url);
        downloadLink.href = data.download_links.windows.url;

        // 初始化历史版本模态框
        const modal = document.getElementById('version-modal');
        const closeBtn = modal.querySelector('.close');
        const historyLink = document.getElementById('history-link');

        historyLink.addEventListener('click', () => {
            updateVersionModalContent(data);
            modal.style.display = 'flex';
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

    } catch (error) {
        console.error('获取版本信息失败:', error);
        document.getElementById('app-latest-version').textContent = '获取失败';
        document.getElementById('app-release-date').textContent = '获取失败';
        document.getElementById('app-notice').textContent = '获取公告失败';
    }
}

function updateVersionModalContent(data) {
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = ''; // 清空模态框内容
    data.previous_versions.forEach(version => {
        modalContent.innerHTML += `<div class="version-item">
                    <h4>版本: ${version.version}</h4>
                    <p>发布日期: ${version.release_date}</p>
                    <p>内容: ${version.content}</p>
                    <hr> <!-- 添加分隔线以便更清晰地分隔不同版本 -->
                </div>`;
    });
}

// 调用initVersionInfo函数以初始化版本信息
document.addEventListener('DOMContentLoaded', initVersionInfo);

// 初始化浮动下载按钮
function initFloatingDownloadBtn() {
    const floatingBtn = document.getElementById('floatingDownloadBtn');

    if (floatingBtn) {
        floatingBtn.addEventListener('click', function(e) {
            e.preventDefault(); // 阻止默认行为
            const downloadSection = document.getElementById('download');
            if (downloadSection) {
                // 确保平滑滚动到下载区域
                downloadSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                
                // 添加高亮效果
                const highlightElement = document.createElement('div');
                highlightElement.className = 'scroll-highlight';
                document.body.appendChild(highlightElement);
                const rect = downloadSection.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                highlightElement.style.top = `${rect.top + scrollTop - 10}px`;
                highlightElement.style.left = `${rect.left - 10}px`;
                highlightElement.style.width = `${rect.width + 20}px`;
                highlightElement.style.height = `${rect.height + 20}px`;
                setTimeout(() => highlightElement.remove(), 1500);
            }
        });
    }
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    VisibilityObserver.init();
    initSmoothScroll();
    initSlideshow();
    initFeaturedButton();
    initMobileMenu(); // 初始化移动端菜单
    initVersionInfo(); // 添加版本信息初始化
    initFloatingDownloadBtn(); // 初始化浮动下载按钮
    window.openLightbox = openLightbox;
    window.openLink = openLink;
});

// 确保浮动下载按钮在页面加载后立即可用
initFloatingDownloadBtn();
