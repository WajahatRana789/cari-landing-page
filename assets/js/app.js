
const initAnimation = () => {
    ScrollReveal().reveal('.fade-up', {
        origin: 'bottom',
        distance: '40px',
        duration: 1000,
        easing: 'ease-in-out',
        opacity: 0,
        viewFactor: 0.2 // reveal when 20% of the element is visible
    });

    ScrollReveal().reveal('.fade-down', {
        origin: 'top',
        distance: '40px',
        duration: 1000,
        easing: 'ease-in-out',
        opacity: 0,
        viewFactor: 0.2
    });
}

const initParallaxEffect = () => {
    const container = document.querySelector(".about-images");
    const image1 = container.querySelector(".image-1");
    const image2 = container.querySelector(".image-2");
    let idleTween;

    const strength = 30;

    // Animate on mousemove
    container.addEventListener("mousemove", (e) => {
        if (idleTween) idleTween.kill(); // stop idle animation

        const bounds = container.getBoundingClientRect();
        const x = e.clientX - bounds.left - bounds.width / 2;
        const y = e.clientY - bounds.top - bounds.height / 2;

        gsap.to(image1, {
            x: x / strength,
            y: y / strength,
            duration: 0.4,
            ease: "power2.out"
        });

        gsap.to(image2, {
            x: -x / strength,
            y: -y / strength,
            duration: 0.4,
            ease: "power2.out"
        });
    });

    // Start idle animation on mouse enter
    container.addEventListener("mouseenter", () => {
        if (idleTween) idleTween.kill();

        idleTween = gsap.timeline({ repeat: -1, yoyo: true })
            .to(image1, { x: 3, y: -3, duration: 2, ease: "sine.inOut" })
            .to(image1, { x: -3, y: 3, duration: 2, ease: "sine.inOut" }, 0)
            .to(image2, { x: -3, y: 3, duration: 2, ease: "sine.inOut" }, 0)
            .to(image2, { x: 3, y: -3, duration: 2, ease: "sine.inOut" }, 2);
    });

    // Reset on leave
    container.addEventListener("mouseleave", () => {
        if (idleTween) idleTween.kill();

        gsap.to([image1, image2], {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "power2.out"
        });
    });
}

const adjustSlickCardHeight = () => {
    const cards = $('#how-it-works-section').find('.step-card');
    let maxHeight = 0;

    cards.each(function () {
        const cardHeight = $(this).outerHeight(true);
        if (cardHeight > maxHeight) {
            maxHeight = cardHeight;
        }
    });

    cards.attr('style', 'min-height: ' + maxHeight + 'px');
}

$(document).ready(function () {
    initAnimation();
    initParallaxEffect();

    // debounce from underscore.js
    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        }
    }

    // use x and y mousewheel event data to navigate flickity
    function slick_handle_wheel_event(e, slick_instance, slick_is_animating) {
        // do not trigger a slide change if another is being animated
        if (!slick_is_animating) {
            // pick the larger of the two delta magnitudes (x or y) to determine nav direction
            var direction =
                Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

            if (direction > 0) {
                // next slide
                slick_instance.slick('slickNext');
            } else {
                // prev slide
                slick_instance.slick('slickPrev');
            }
        }
    }

    // debounce the wheel event handling since trackpads can have a lot of inertia
    var slick_handle_wheel_event_debounced = debounce(
        slick_handle_wheel_event
        , 100, true
    );


    // slider
    const slider = $('.how-it-works-slides');
    slider.slick({
        // Basic settings
        slidesToShow: 1,
        slidesToScroll: 1,

        // Touch settings
        touchThreshold: 5, // How many pixels to move before considering it a swipe
        swipe: true, // Enable swiping
        swipeToSlide: true, // Swipe directly to slide (not just one at a time)
        draggable: true, // Enable mouse dragging

        // Trackpad/scroll settings
        waitForAnimate: false, // Don't wait for animation to complete
        useTransform: true, // Use CSS transforms for smoother scrolling

        // Optional settings
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true
    });
    var slider_is_animating = false;

    slider.on('afterChange', function (index) {
        slider_is_animating = false;
        adjustSlickCardHeight();
    });

    slider.on('beforeChange', function (index) {
        slider_is_animating = true;
        adjustSlickCardHeight();
    });

    slider.on('wheel', function (e) {
        slick_handle_wheel_event_debounced(e.originalEvent, slider, slider_is_animating);
    });


    // Button click to go to specific slide
    $('.how-it-works-slide-buttons button').on('click', function () {
        var slideIndex = $(this).data('slide');
        $('.how-it-works-slides').slick('slickGoTo', slideIndex);

        $('.how-it-works-slide-buttons button').removeClass('active');
        $(this).addClass('active');
    });

    // Highlight the button based on current slide
    $('.how-it-works-slides').on('afterChange', function (event, slick, currentSlide) {
        $('.how-it-works-slide-buttons button').removeClass('active');
        $('.how-it-works-slide-buttons button[data-slide="' + currentSlide + '"]').addClass('active');
    });

    // Trigger once on load
    var initialSlide = $('.how-it-works-slides').slick('slickCurrentSlide');
    $('.how-it-works-slide-buttons button[data-slide="' + initialSlide + '"]').addClass('active');


    let kbCardsAnimationInterval = null;

    function layoutCards() {
        const container = $('.kb-cards-container');
        const cards = container.children('.kb-card');
        const cardHeight = cards.first().outerHeight(true);

        // Reposition all cards absolutely
        cards.each(function (i) {
            $(this).css({
                position: 'absolute',
                top: i * cardHeight,
                left: 0
            });
        });
    }
    function rotateCards() {
        const container = $('.kb-cards-container');
        const cards = container.children('.kb-card');

        let positions = [];
        cards.each(function () {
            positions.push($(this).position().top);
        });

        const firstCard = cards.eq(0);

        // Animate first card out to the right
        firstCard.animate({
            top: '-500px',
            opacity: 0
        }, 1000, function () {
            const lastTop = positions[positions.length - 1];
            const lastOffset = lastTop + $(this).outerHeight(true);

            // Immediately move first card below all
            $(this).css({
                top: lastOffset,
                left: 0
            });

            // Append to container
            container.append(this);

            // Animate other cards upward
            for (let i = 1; i < cards.length; i++) {
                cards.eq(i).animate({ top: positions[i - 1] }, 1000);
            }

            // Animate first card up to the last position
            $(this).animate({
                top: lastTop,
                opacity: 1
            }, 300);

            // Loop again
            kbCardsAnimationInterval = setTimeout(rotateCards, 3000);
        });
    }

    layoutCards();
    rotateCards();

    // Re-layout on window resize

    let resizeTimeout;

    $(window).on('resize', function () {
        clearTimeout(resizeTimeout); // clear previous timeout on every resize
        resizeTimeout = setTimeout(function () {
            // This runs only when resizing stops for 300ms
            clearTimeout(kbCardsAnimationInterval); // stop animation loop
            layoutCards();  // reposition cards
            rotateCards();  // restart animation
        }, 500); // wait 300ms after last resize event
    });


    adjustSlickCardHeight();
});
