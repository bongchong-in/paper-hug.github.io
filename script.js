document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuButton && mobileMenu) {
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');

        const toggleMenu = () => {
            mobileMenu.classList.toggle('hidden');
            const isExpanded = !mobileMenu.classList.contains('hidden');
            menuButton.setAttribute('aria-expanded', String(isExpanded));
            if (isExpanded) {
                menuButton.innerHTML = `<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
            } else {
                menuButton.innerHTML = `<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>`;
            }
        };

        menuButton.addEventListener('click', toggleMenu);
        
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (!mobileMenu.classList.contains('hidden')) {
                    toggleMenu();
                }
            });
        });
    }
    
    // --- Smooth Scrolling for all anchor links ---
    const allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            // Ensure it's a valid ID selector
            if (targetId && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // --- Animated Counters ---
    const counters = document.querySelectorAll('.animated-counter');
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);
            element.textContent = currentValue.toLocaleString() + '+';
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.getAttribute('data-animated') !== 'true') {
                const counter = entry.target;
                const targetValue = parseInt(counter.getAttribute('data-target'), 10);
                const textElement = counter.querySelector('p:first-child');
                
                if (textElement && !isNaN(targetValue)) {
                   animateValue(textElement, 0, targetValue, 2000);
                   counter.setAttribute('data-animated', 'true');
                }
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.1 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // --- New: Scroll-triggered animations ---
    const animatedElements = document.querySelectorAll('.scroll-animate');

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    animatedElements.forEach(element => {
        scrollObserver.observe(element);
    });

    // --- Partner Carousel ---
    const initPartnerCarousel = () => {
        const wrapper = document.getElementById('partner-carousel-wrapper');
        if (!wrapper) return;

        const track = document.getElementById('partner-track');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        if (!track || !prevBtn || !nextBtn || track.children.length === 0) {
            if (wrapper) wrapper.style.display = 'none'; // Hide carousel if no items
            return;
        }

        const originalCards = Array.from(track.children);
        const cardCount = originalCards.length;

        // Clone cards for seamless looping and append them
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });

        let currentIndex = 0;
        let intervalId;
        const cardStyle = window.getComputedStyle(originalCards[0]);
        const cardMargin = parseInt(cardStyle.marginLeft, 10) + parseInt(cardStyle.marginRight, 10);
        const cardWidth = originalCards[0].offsetWidth + cardMargin;
        
        const move = () => {
            currentIndex++;
            track.style.transition = 'transform 0.5s ease-in-out';
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            
            if (currentIndex >= cardCount) {
                setTimeout(() => {
                    track.style.transition = 'none';
                    currentIndex = 0;
                    track.style.transform = `translateX(0)`;
                }, 500); // This duration must match the CSS transition duration
            }
        };

        const startAutoScroll = () => {
            stopAutoScroll(); // Ensure no multiple intervals are running
            intervalId = setInterval(move, 3000);
        };
        
        const stopAutoScroll = () => {
            clearInterval(intervalId);
        };
        
        nextBtn.addEventListener('click', () => {
            stopAutoScroll();
            move();
            startAutoScroll();
        });

        prevBtn.addEventListener('click', () => {
            stopAutoScroll();
            
            if (currentIndex === 0) {
                track.style.transition = 'none';
                currentIndex = cardCount;
                track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            
                setTimeout(() => {
                    track.style.transition = 'transform 0.5s ease-in-out';
                    currentIndex--;
                    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
                }, 20); // A small delay is enough to re-enable transition
            } else {
                currentIndex--;
                track.style.transition = 'transform 0.5s ease-in-out';
                track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            }
            
            startAutoScroll();
        });
        
        wrapper.addEventListener('mouseenter', stopAutoScroll);
        wrapper.addEventListener('mouseleave', startAutoScroll);

        startAutoScroll();
    };

    initPartnerCarousel();

    // --- Testimonial Carousel ---
    const initTestimonialCarousel = () => {
        const wrapper = document.getElementById('testimonial-carousel-wrapper');
        if (!wrapper) return;

        const track = document.getElementById('testimonial-track');
        const prevBtn = document.getElementById('testimonial-prev-btn');
        const nextBtn = document.getElementById('testimonial-next-btn');

        if (!track || !prevBtn || !nextBtn || track.children.length === 0) {
            if (wrapper) wrapper.style.display = 'none';
            return;
        }

        const originalCards = Array.from(track.children);
        const cardCount = originalCards.length;

        // Clone cards for seamless looping
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });

        let currentIndex = 0;
        let intervalId;

        const getCardWidth = () => {
            if (originalCards.length === 0) return 0;
            const cardStyle = window.getComputedStyle(originalCards[0]);
            const cardMargin = parseInt(cardStyle.marginLeft, 10) + parseInt(cardStyle.marginRight, 10);
            return originalCards[0].offsetWidth + cardMargin;
        }

        let cardWidth = getCardWidth();

        const move = () => {
            currentIndex++;
            track.style.transition = 'transform 0.5s ease-in-out';
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            
            if (currentIndex >= cardCount) {
                setTimeout(() => {
                    track.style.transition = 'none';
                    currentIndex = 0;
                    track.style.transform = `translateX(0)`;
                }, 500);
            }
        };

        const startAutoScroll = () => {
            stopAutoScroll();
            intervalId = setInterval(move, 4000); // Slower speed for testimonials
        };
        
        const stopAutoScroll = () => {
            clearInterval(intervalId);
        };
        
        nextBtn.addEventListener('click', () => {
            stopAutoScroll();
            move();
            startAutoScroll();
        });

        prevBtn.addEventListener('click', () => {
            stopAutoScroll();
            
            if (currentIndex === 0) {
                track.style.transition = 'none';
                currentIndex = cardCount;
                track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            
                setTimeout(() => {
                    track.style.transition = 'transform 0.5s ease-in-out';
                    currentIndex--;
                    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
                }, 20);
            } else {
                currentIndex--;
                track.style.transition = 'transform 0.5s ease-in-out';
                track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            }
            
            startAutoScroll();
        });
        
        wrapper.addEventListener('mouseenter', stopAutoScroll);
        wrapper.addEventListener('mouseleave', startAutoScroll);

        window.addEventListener('resize', () => {
            stopAutoScroll();
            track.style.transition = 'none';
            cardWidth = getCardWidth();
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            startAutoScroll();
        });

        startAutoScroll();
    };

    initTestimonialCarousel();

    // --- FAQ Accordion ---
    const initFaqAccordion = () => {
        const accordion = document.getElementById('faq-accordion');
        if (!accordion) return;

        const faqQuestions = accordion.querySelectorAll('.faq-question');

        faqQuestions.forEach(button => {
            button.addEventListener('click', () => {
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                const answerPanel = document.getElementById(button.getAttribute('aria-controls'));

                // Close all other items
                faqQuestions.forEach(otherButton => {
                    if (otherButton !== button) {
                        otherButton.setAttribute('aria-expanded', 'false');
                        const otherAnswer = document.getElementById(otherButton.getAttribute('aria-controls'));
                        otherAnswer.style.maxHeight = null;
                    }
                });

                // Toggle the clicked item
                if (isExpanded) {
                    button.setAttribute('aria-expanded', 'false');
                    answerPanel.style.maxHeight = null;
                } else {
                    button.setAttribute('aria-expanded', 'true');
                    answerPanel.style.maxHeight = answerPanel.scrollHeight + 'px';
                }
            });
        });
    };

    initFaqAccordion();

    // --- Update Footer Year ---
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});