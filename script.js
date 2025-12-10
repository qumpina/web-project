// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация мобильного меню
    initMobileMenu();
    
    // Инициализация слайдера
    initSlider();
    
    // Инициализация формы
    initContactForm();
    
    // Инициализация плавной прокрутки
    initSmoothScroll();
    
    // Инициализация активных ссылок навигации
    initActiveNavLinks();
});

// Функция инициализации мобильного меню
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Открытие/закрытие мобильного меню
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Обработка выпадающих меню на мобильных устройствах
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });
    
    // Закрытие меню при клике на ссылку
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                
                // Закрытие всех выпадающих меню
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    });
}

// Функция инициализации слайдера
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Функция показа слайда
    function showSlide(index) {
        // Скрыть все слайды
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Убрать активный класс со всех точек
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Показать текущий слайд
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    // Следующий слайд
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }
    
    // Предыдущий слайд
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }
    
    // Обработчики событий для кнопок
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Обработчики событий для точек
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Автоматическое перелистывание слайдов
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Остановка автоматического перелистывания при наведении на слайдер
    const sliderContainer = document.querySelector('.slider-container');
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
}

// Функция инициализации формы
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formSpinner = document.getElementById('form-spinner');
    const formMessage = document.getElementById('form-message');
    
    
    const formcarryUrl = 'https://formcarry.com/s/UYhhzul5isC';
    
    // Обработка отправки формы
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Показываем спиннер и отключаем кнопку
        submitBtn.disabled = true;
        formSpinner.classList.remove('hidden');
        
        // Скрываем предыдущее сообщение
        formMessage.classList.add('hidden');
        
        // Собираем данные формы
        const formData = new FormData(contactForm);
        
        try {
            // Отправляем данные на Formcarry
            const response = await fetch(formcarryUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const result = await response.json();
            
            // Показываем сообщение об успехе или ошибке
            if (result.code === 200) {
                showFormMessage('Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
                contactForm.reset();
            } else {
                showFormMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.', 'error');
            }
            
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            showFormMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.', 'error');
        } finally {
            // Восстанавливаем кнопку
            submitBtn.disabled = false;
            formSpinner.classList.add('hidden');
        }
    });
    
    // Функция показа сообщения формы
    function showFormMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = `form-message ${type}`;
        formMessage.classList.remove('hidden');
        
        // Автоматическое скрытие сообщения через 5 секунд
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 5000);
    }
}

// Функция инициализации плавной прокрутки
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Пропускаем якорь "#" для главной страницы
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                // Получаем высоту шапки для корректировки
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight + 10;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Функция инициализации активных ссылок навигации
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Функция обновления активных ссылок
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Обновляем активные ссылки при скролле
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Инициализация при загрузке
    updateActiveNavLink();
}

// Дополнительная функция для адаптации видео под размер экрана
function adaptVideoToScreen() {
    const video = document.getElementById('header-video');
    const header = document.querySelector('.header');
    
    function adjustVideo() {
        if (window.innerWidth < 768) {
            // На мобильных устройствах можно изменить источник видео
            // на более легкую версию, если она доступна
            // В данном примере просто меняем атрибуты воспроизведения
            video.muted = true;
            video.playsInline = true;
        }
    }
    
    // Вызываем при загрузке и изменении размера окна
    adjustVideo();
    window.addEventListener('resize', adjustVideo);
}

// Вызываем функцию адаптации видео
adaptVideoToScreen();