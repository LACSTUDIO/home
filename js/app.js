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