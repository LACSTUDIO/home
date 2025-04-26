document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');

    function checkVisibility() {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                section.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);
    checkVisibility(); // 初始检查
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