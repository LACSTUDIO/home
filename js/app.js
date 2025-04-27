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

// 初始化页面功能
document.addEventListener('DOMContentLoaded', () => {
    VisibilityObserver.init();
    initSlideshow();
    initMobileMenu();
    initSmoothScroll();
    initVersionHistory();
    loadLazyImages();
});

// 轮播图功能
function initSlideshow() {
    const slides = document.querySelectorAll('.screenshot-slider img');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    const currentSlideIndicator = document.querySelector('.current-slide');
    const totalSlidesIndicator = document.querySelector('.total-slides');
    let currentSlide = 0;
    let slideInterval;

    if (totalSlidesIndicator) {
        totalSlidesIndicator.textContent = slides.length;
    }

    function showSlide(index) {
        slides.forEach(slide => {
            slide.classList.remove('active');
            if (slide.dataset.src && !slide.src.includes(slide.dataset.src)) {
                slide.src = slide.dataset.src;
                slide.removeAttribute('data-src');
            }
        });

        thumbnails.forEach(thumb => {
            thumb.classList.remove('active');
            if (thumb.dataset.src && !thumb.src.includes(thumb.dataset.src)) {
                thumb.src = thumb.dataset.src;
                thumb.removeAttribute('data-src');
            }
        });

        slides[index].classList.add('active');
        thumbnails[index].classList.add('active');
        currentSlide = index;

        if (currentSlideIndicator) {
            currentSlideIndicator.textContent = index + 1;
        }

        updateFeaturedImage(index);
    }

    function startSlideshow() {
        stopSlideshow();
        slideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);
    }

    function stopSlideshow() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }

    // 初始化轮播
    startSlideshow();

    // 事件监听
    document.querySelector('.screenshot-main').addEventListener('mouseenter', stopSlideshow);
    document.querySelector('.screenshot-main').addEventListener('mouseleave', startSlideshow);

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
        stopSlideshow();
        setTimeout(startSlideshow, 10000);
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
        stopSlideshow();
        setTimeout(startSlideshow, 10000);
    });

    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            showSlide(index);
            stopSlideshow();
            setTimeout(startSlideshow, 10000);
        });
    });

    // 触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;

    const sliderElement = document.querySelector('.screenshot-slider');
    if (sliderElement) {
        sliderElement.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        sliderElement.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            nextBtn.click();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            prevBtn.click();
        }
    }
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

// 平滑滚动
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
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

                    setTimeout(() => {
                        highlightElement.remove();
                    }, 1500);

                    // 移动端菜单处理
                    if (window.innerWidth <= 768) {
                        const mobileMenu = document.getElementById('mobile-menu');
                        const navLinks = document.querySelector('.nav-links');
                        mobileMenu.classList.remove('active');
                        navLinks.classList.remove('active');
                    }
                }
            }
        });
    });
}

// 版本历史
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
        
        const closeButton = document.querySelector('.close');
        closeButton.onclick = () => {
            modal.style.opacity = 0;
            setTimeout(() => {
                modal.style.display = 'none';
                modal.style.opacity = 1;
            }, 200);
        };
        
        window.onclick = (e) => {
            if (e.target === modal) {
                modal.style.opacity = 0;
                setTimeout(() => {
                    modal.style.display = 'none';
                    modal.style.opacity = 1;
                }, 200);
            }
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
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (hasIntersectionObserver) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px 0px' });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// 工具函数
function openLink(url) {
    window.open(url, '_blank');
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
    
    const close = lightbox.querySelector('.lightbox-close');
    close.addEventListener('click', () => {
        document.body.removeChild(lightbox);
        document.body.style.overflow = '';
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            document.body.removeChild(lightbox);
            document.body.style.overflow = '';
        }
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

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    VisibilityObserver.init();
});

document.addEventListener("DOMContentLoaded", function() {
    const container = document.querySelector('.screenshot-container');
    const slider = container.querySelector('.screenshot-slider');
    const images = slider.querySelectorAll('img');
    const thumbnails = container.querySelectorAll('.thumbnail');
    let currentIndex = 0;
    const intervalTime = 3000; // 每3秒切换一次图片
    let intervalId;

    function showImage(index) {
        images.forEach((img, i) => img.classList.toggle('active', i === parseInt(index)));
        thumbnails.forEach((thumb, i) => thumb.classList.toggle('active', i === parseInt(index)));
        currentIndex = parseInt(index);
    }

    function showNextImage() {
        showImage((currentIndex + 1) % images.length);
    }

    function startSlideshow() {
        intervalId = setInterval(showNextImage, intervalTime);
    }

    function stopSlideshow() {
        clearInterval(intervalId);
    }

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            showImage(index);
        });
    });

    container.addEventListener('mouseenter', stopSlideshow);
    container.addEventListener('mouseleave', startSlideshow);

    startSlideshow();
});

// 轮播图功能
const slides = document.querySelectorAll('.screenshot-slider img');
const thumbnails = document.querySelectorAll('.thumbnail');
const prevBtn = document.querySelector('.slider-arrow.prev');
const nextBtn = document.querySelector('.slider-arrow.next');
const currentSlideIndicator = document.querySelector('.current-slide');
const totalSlidesIndicator = document.querySelector('.total-slides');
let currentSlide = 0;
let slideInterval;

// 更新轮播指示器
if (totalSlidesIndicator) {
  totalSlidesIndicator.textContent = slides.length;
}

function showSlide(index) {
  slides.forEach(slide => {
    slide.classList.remove('active');
    // 确保图片已加载
    if (slide.dataset.src && !slide.src.includes(slide.dataset.src)) {
      slide.src = slide.dataset.src;
      slide.removeAttribute('data-src');
    }
  });
  
  thumbnails.forEach(thumb => {
    thumb.classList.remove('active');
    // 确保缩略图已加载
    if (thumb.dataset.src && !thumb.src.includes(thumb.dataset.src)) {
      thumb.src = thumb.dataset.src;
      thumb.removeAttribute('data-src');
    }
  });
  
  slides[index].classList.add('active');
  thumbnails[index].classList.add('active');
  currentSlide = index;
  
  // 更新指示器
  if (currentSlideIndicator) {
    currentSlideIndicator.textContent = index + 1;
  }
}

// 自动轮播功能
function startSlideshow() {
  stopSlideshow(); // 确保没有多个定时器运行
  slideInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 5000); // 5秒切换一次
}

function stopSlideshow() {
  if (slideInterval) {
    clearInterval(slideInterval);
  }
}

// 初始化轮播
startSlideshow();

// 鼠标悬停时暂停轮播
document.querySelector('.screenshot-main').addEventListener('mouseenter', stopSlideshow);
document.querySelector('.screenshot-main').addEventListener('mouseleave', startSlideshow);

// 按钮控制
prevBtn.addEventListener('click', () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
  stopSlideshow();
  setTimeout(startSlideshow, 10000); // 10秒后恢复自动轮播
});

nextBtn.addEventListener('click', () => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
  stopSlideshow();
  setTimeout(startSlideshow, 10000);
});

// 缩略图点击事件
thumbnails.forEach((thumb, index) => {
  thumb.addEventListener('click', () => {
    showSlide(index);
    stopSlideshow();
    setTimeout(startSlideshow, 10000);
  });
});

// 大图预览功能
slides.forEach((slide, index) => {
  slide.addEventListener('click', () => {
    openLightbox(index);
  });
});

// 添加触摸滑动支持
let touchStartX = 0;
let touchEndX = 0;

const sliderElement = document.querySelector('.screenshot-slider');
if (sliderElement) {
  sliderElement.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, {passive: true});
  
  sliderElement.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, {passive: true});
}

function handleSwipe() {
  const swipeThreshold = 50; // 最小滑动距离
  if (touchEndX < touchStartX - swipeThreshold) {
    // 向左滑动 - 下一张
    nextBtn.click();
  } else if (touchEndX > touchStartX + swipeThreshold) {
    // 向右滑动 - 上一张
    prevBtn.click();
  }
}

// 大图预览功能
function openLightbox(index) {
  stopSlideshow(); // 打开灯箱时暂停轮播
  
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  
  // 确保图片已加载
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
  
  // 图片加载完成后隐藏加载动画
  const lightboxImg = lightbox.querySelector('.lightbox-image');
  const loadingIndicator = lightbox.querySelector('.lightbox-loading');
  
  lightboxImg.onload = function() {
    loadingIndicator.style.display = 'none';
  };
  
  // 如果图片已经缓存，可能不会触发onload事件
  if (lightboxImg.complete) {
    loadingIndicator.style.display = 'none';
  }
  
  // 关闭灯箱
  const close = lightbox.querySelector('.lightbox-close');
  close.addEventListener('click', () => {
    document.body.removeChild(lightbox);
    document.body.style.overflow = '';
    startSlideshow();
  });
  
  // 点击灯箱背景关闭
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      document.body.removeChild(lightbox);
      document.body.style.overflow = '';
      startSlideshow();
    }
  });
  
  // 上一张/下一张
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
  
  // 键盘导航
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

// 懒加载图片处理
function loadLazyImages() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if (hasIntersectionObserver) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '50px 0px' });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // 回退方案：立即加载所有图片
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

// 初始化懒加载
loadLazyImages();

function openLink(url) {
    window.open(url, '_blank');
}

// 更新大图卡片
function updateFeaturedImage(index) {
  const featuredImage = document.getElementById('featured-image');
  const featuredTitle = document.getElementById('featured-title');
  const currentSlide = slides[index];
  
  // 确保图片已加载
  const imgSrc = currentSlide.dataset.src || currentSlide.src;
  featuredImage.src = imgSrc;
  featuredTitle.textContent = currentSlide.title || currentSlide.alt;
}

// 修改 showSlide 函数，添加大图卡片更新
const originalShowSlide = showSlide;
showSlide = function(index) {
  originalShowSlide(index);
  updateFeaturedImage(index);
}

// 大图卡片控制按钮
const featuredPrevBtn = document.querySelector('.featured-controls .prev');
const featuredNextBtn = document.querySelector('.featured-controls .next');

if(featuredPrevBtn) {
  featuredPrevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
    stopSlideshow();
    setTimeout(startSlideshow, 10000);
  });
}

if(featuredNextBtn) {
  featuredNextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
    stopSlideshow();
    setTimeout(startSlideshow, 10000);
  });
}

// 页面跳转动画
// 使用 Intersection Observer 监测元素是否在视口中
if (hasIntersectionObserver) {
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 根据部分ID选择不同的动画方向
        if (['features', 'support'].includes(entry.target.id)) {
          entry.target.classList.add('section-animate-horizontal');
        } else {
          entry.target.classList.add('section-animate');
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15, // 当15%的元素可见时触发
    rootMargin: '0px 0px -100px 0px' // 底部偏移，提前触发动画
  });

  sections.forEach(section => {
    observer.observe(section);
  });
}

// 平滑滚动增强 - 添加滚动进度指示
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  const originalHandler = anchor.onclick;
  
  anchor.onclick = function(e) {
    const href = this.getAttribute('href');
    if (!href.startsWith('#')) return;
    
    e.preventDefault();
    
    // 获取目标元素
    const targetElement = document.querySelector(href);
    if (!targetElement) return;
    
    // 添加高亮动画
    const highlightElement = document.createElement('div');
    highlightElement.className = 'scroll-highlight';
    document.body.appendChild(highlightElement);
    
    // 获取目标元素位置
    const rect = targetElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 设置高亮元素位置和尺寸
    highlightElement.style.top = `${rect.top + scrollTop - 10}px`;
    highlightElement.style.left = `${rect.left - 10}px`;
    highlightElement.style.width = `${rect.width + 20}px`;
    highlightElement.style.height = `${rect.height + 20}px`;
    
    // 平滑滚动到目标位置
    window.scrollTo({
      top: rect.top + scrollTop - 80, // 考虑导航栏高度
      behavior: 'smooth'
    });
    
    // 动画完成后移除高亮元素
    setTimeout(() => {
      highlightElement.remove();
    }, 1500);
    
    // 如果是移动设备，点击导航链接后关闭菜单
    if (window.innerWidth <= 768) {
      mobileMenu.classList.remove('active');
      navLinks.classList.remove('active');
    }
  };
});

// 1. 使用模块化组织代码
const UI = {
  elements: {
    slider: document.querySelector('.screenshot-slider'),
    thumbnails: document.querySelectorAll('.thumbnail'),
    prevBtn: document.querySelector('.slider-arrow.prev'),
    nextBtn: document.querySelector('.slider-arrow.next')
  },
  
  state: {
    currentSlide: 0,
    slideInterval: null,
    isPlaying: true
  },
  
  init() {
    this.bindEvents();
    this.startSlideshow();
  },
  
  bindEvents() {
    this.elements.prevBtn?.addEventListener('click', () => this.prevSlide());
    this.elements.nextBtn?.addEventListener('click', () => this.nextSlide());
    this.elements.thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => this.showSlide(index));
    });
  },
  
  showSlide(index) {
    // 轮播图逻辑
  },
  
  startSlideshow() {
    if (this.state.slideInterval) this.stopSlideshow();
    this.state.slideInterval = setInterval(() => this.nextSlide(), 5000);
  },
  
  stopSlideshow() {
    clearInterval(this.state.slideInterval);
    this.state.slideInterval = null;
  }
};

// 2. 使用工具函数
const utils = {
  debounce(fn, delay) {
    let timer = null;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },
  
  throttle(fn, delay) {
    let last = 0;
    return function(...args) {
      const now = Date.now();
      if (now - last >= delay) {
        fn.apply(this, args);
        last = now;
      }
    };
  }
};

// 3. 统一的事件处理
const EventHandler = {
  init() {
    this.handleScroll();
    this.handleResize();
    this.handleNavigation();
  },
  
  handleScroll: utils.throttle(() => {
    // 滚动处理逻辑
  }, 100),
  
  handleResize: utils.debounce(() => {
    // 调整布局逻辑
  }, 250),
  
  handleNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        target?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }
};

// 1. 图片懒加载优化
const lazyLoadImages = () => {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
};

// 2. 事件委托优化
document.querySelector('.feature-grid').addEventListener('click', (e) => {
  const card = e.target.closest('.feature-card');
  if (card) {
    // 处理卡片点击
  }
});

// 3. 资源预加载
const preloadResources = () => {
  const resources = [
    '../img/hout/main.png',
    '../css/app.css'
  ];
  
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = resource.endsWith('.css') ? 'style' : 'image';
    document.head.appendChild(link);
  });
};

  // 获取软件最新版本号
  document.getElementById('history-link').addEventListener('click', async function(e) {
    e.preventDefault();
    
    // 显示加载中的弹窗
    const modal = document.getElementById('version-modal');
    const versionList = document.getElementById('version-list');
    modal.style.display = 'block';
    versionList.innerHTML = '<div class="loading-message"><div class="spinner"></div><p>加载中...</p></div>';
    
    try {
      // 使用缓存策略加速API请求
      const cacheKey = 'houtVersionsCache';
      const cacheTime = 'houtVersionsCacheTime';
      const now = Date.now();
      const cachedData = localStorage.getItem(cacheKey);
      const cacheTimestamp = localStorage.getItem(cacheTime);
      
      // 检查是否有缓存且缓存时间小于10分钟
      if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp) < 600000)) {
        const data = JSON.parse(cachedData);
        updateVersionModalContent(data);
      } else {
        // 无缓存或缓存过期，发起网络请求
        const response = await fetch('https://api.xn--5brr03o.top/hout.json', {
          cache: 'no-cache'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 更新缓存
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheTime, now.toString());
        
        updateVersionModalContent(data);
      }
    } catch (error) {
      console.error('获取版本信息失败:', error);
      versionList.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i><p>暂时无法获取历史版本信息，请稍后再试</p></div>';
    }
    
    // 关闭逻辑优化
    const closeButton = document.querySelector('.close');
    closeButton.onclick = () => {
      modal.style.opacity = 0;
      setTimeout(() => {
        modal.style.display = 'none';
        modal.style.opacity = 1;
      }, 200);
    };
    
    window.onclick = (e) => {
      if (e.target === modal) {
        modal.style.opacity = 0;
        setTimeout(() => {
          modal.style.display = 'none';
          modal.style.opacity = 1;
        }, 200);
      }
    };
  });

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

  // 移动端菜单切换
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');

  mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // 平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({
          behavior: 'smooth'
        });
        
        // 如果是移动设备，点击导航链接后关闭菜单
        if (window.innerWidth <= 768) {
          mobileMenu.classList.remove('active');
          navLinks.classList.remove('active');
        }
      }
    });
  });

  // 懒加载图片处理
  function loadLazyImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (hasIntersectionObserver) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      }, { rootMargin: '50px 0px' });
      
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // 回退方案：立即加载所有图片
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }
  
  // 初始化懒加载
  loadLazyImages();
  
  // 优化后的轮播图功能
  const slides = document.querySelectorAll('.screenshot-slider img');
  const thumbnails = document.querySelectorAll('.thumbnail');
  const prevBtn = document.querySelector('.slider-arrow.prev');
  const nextBtn = document.querySelector('.slider-arrow.next');
  let currentSlide = 0;
  let slideInterval;

  // 预加载图片
  function preloadImage(index) {
    const img = slides[index];
    if (img.dataset.src && !img.src.includes(img.dataset.src)) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
  }

  // 显示指定幻灯片
  function showSlide(index) {
    // 预加载前后图片
    const prevIndex = (index - 1 + slides.length) % slides.length;
    const nextIndex = (index + 1) % slides.length;
    preloadImage(prevIndex);
    preloadImage(nextIndex);

    // 切换当前幻灯片
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });

    currentSlide = index;
    updateSlideIndicator();
  }

  // 更新幻灯片指示器
  function updateSlideIndicator() {
    const currentSlideIndicator = document.querySelector('.current-slide');
    if (currentSlideIndicator) {
      currentSlideIndicator.textContent = currentSlide + 1;
    }
  }

  // 自动轮播功能
  function startSlideshow() {
    stopSlideshow();
    slideInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, 5000);
  }

  function stopSlideshow() {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
  }

  // 初始化轮播图
  function initSlideshow() {
    // 预加载第一张图片
    preloadImage(0);

    // 添加事件监听
    prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
      stopSlideshow();
      setTimeout(startSlideshow, 10000);
    });

    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
      stopSlideshow();
      setTimeout(startSlideshow, 10000);
    });

    // 缩略图点击事件
    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        showSlide(index);
        stopSlideshow();
        setTimeout(startSlideshow, 10000);
      });
    });

    // 鼠标悬停控制
    const sliderContainer = document.querySelector('.screenshot-main');
    sliderContainer.addEventListener('mouseenter', stopSlideshow);
    sliderContainer.addEventListener('mouseleave', startSlideshow);

    // 初始化自动轮播
    startSlideshow();
  }

  // 页面加载完成后初始化
  document.addEventListener('DOMContentLoaded', initSlideshow);