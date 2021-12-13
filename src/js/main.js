// Utils
function delay(n = 2000) {
    return new Promise((done) => {
        setTimeout(() => {
            done();
        }, n);
    });
}

// Barba
function initBarba() {
    console.log('[Barba]', 'Init');

    barba.init({
        sync: true,
        transitions: [
            {
                async leave() {
                    console.log('[Barba]', 'Leave event');

                    const done = this.async();

                    pageTransition();

                    await delay(1000);

                    done();
                },

                async enter() {
                    console.log('[Barba]', 'Enter event');

                    contentAnimation();
                },

                async once() {
                    console.log('[Barba]', 'Once event');

                    contentAnimation();
                },
            },
        ],
        views: [
            {
                namespace: 'home',
                beforeLeave() {
                    console.log('[Barba][Home]', 'BeforeLeave');

                    // deinitScroll();
                },
                beforeEnter() {
                    console.log('[Barba][Home]', 'BeforeEnter');
                },
                afterEnter({ next }) {
                    console.log('[Barba][Home]', 'AfterEnter');

                    initPlugins(next);
                },
            },
            {
                namespace: 'speaker',
                afterEnter({ next }) {
                    console.log('[Barba][Speaker]', 'AfterEnter');

                    resetScroll();
                },
            },
        ],
    });
}

function pageTransition() {
    console.log('[Barba]', 'Transition');

    const tl = gsap.timeline();

    tl.to('.loading', {
        duration: 1.2,
        width: '100%',
        left: '0%',
        ease: 'Expo.easeInOut',
    });

    tl.to('.loading', {
        duration: 1,
        width: '100%',
        left: '100%',
        ease: 'Expo.easeInOut',
        delay: 0.3,
    });

    tl.set('.loading', { left: '-100%' });
}

function contentAnimation() {
    var tl = gsap.timeline();

    // tl.from('.animate', { x: -200, y: 0, duration: 1, ease: 'Expo.easeInOut', opacity: 0 });
}

// Init plugins
async function initPlugins(next) {
    // initScroll();
    initNavbar();
    initParallax();
    initSlider();
    initCarousel();
    initSpeakers();
    //initMarquee();
    initContact();

    if (next && next.url.hash) positionScroll(next.url.hash);
}

// ScrollSpy
function initScroll() {
    console.log('[Scroll]', 'Init');

    const nav = $('#nav-main');

    if (!nav.length) return;

    $('body').scrollspy({ target: `#${nav.attr('id')}`, offset: 74 });
}

async function resetScroll() {
    console.log('[Scroll]', `Reset`);

    await delay(100);

    window.scrollTo(0, 0);
}

async function positionScroll(id) {
    console.log('[Scroll]', `Position ${id}`);

    const anchor = $(`#${id}`);

    await delay(100);

    $('html,body').animate({ scrollTop: anchor.offset().top }, 500);
}

function deinitScroll() {
    console.log('[Scroll]', 'Dispose');

    $('body').scrollspy('dispose');
}

function initNavbar() {
    console.log('[Navbar]', 'Init');

    const nav = $('.navbar');

    if (!nav.length) return;

    $('.nav-link').on('click', () => {
        $('.navbar-collapse').collapse('hide');
    });
}

function refreshNavbar() {
    // console.log('[Navbar]', 'Refresh');

    const nav = $('.navbar');

    if (!nav.length) return;

    const scroll = $(window).scrollTop();

    if (scroll >= nav.height()) {
        nav.addClass('navbar-fixed');
    } else {
        nav.removeClass('navbar-fixed');
    }
}

function initParallax() {
    console.log('[Parallax]', 'Init');

    const parallax = $('.parallax');

    if (!parallax.length) return;

    parallax.parallax({
        invertX: true,
        invertY: true,
        scalarX: 10,
        frictionY: 0.1,
    });
}

function initSlider() {
    console.log('[Slider]', 'Init');

    const slider = $('.slider');

    if (!slider.length) return;

    tns({
        container: `.${slider.attr('class')}`,
        items: 2,
        slideBy: 1,
        loop: false,
        center: false,
        nav: false,
        mouseDrag: false,
        arrowKeys: false,
        controls: true,
        controlsText: [`<img src="${slider.attr('data-icon-left')}">`, `<img src="${slider.attr('data-icon-right')}">`],
        speed: 400,
        responsive: {
            768: {
                items: 3,
            },
            992: {
                items: 4,
            },
        },
    });
}

function initCarousel() {
    console.log('[Carousel]', 'Init');

    const carousel = $('.carousel');

    if (!carousel.length) return;

    tns({
        container: `.${carousel.attr('class')}`,
        items: 1,
        slideBy: 1,
        loop: true,
        center: true,
        navPosition: 'bottom',
        controls: false,
        mouseDrag: false,
        arrowKeys: false,
    });
}

function initSpeakers() {
    console.log('[Speakers]', 'Init');

    const speaker = $('.speaker');

    if (!speaker.length) return;

    const parallax = $('.parallax');
    const image = parallax.find('img');

    speaker.each(function () {
        const el = $(this);

        el.mouseenter(() => {
            speaker.removeClass('active');

            el.addClass('active');

            const nextImage = el.attr('data-image');

            const prevImage = image.attr('src');

            if (prevImage == nextImage) return;

            parallax.fadeOut(300, () => {
                image.attr('src', nextImage).bind('onreadystatechange load', function () {
                    if (this.complete) parallax.fadeIn(300);
                });
            });
        });
    });
}

function initMarquee() {
    console.log('[Marquee]', 'Init');

    const marquee = $('#marquee');

    if (!marquee.length) return;

    marquee.marquee({
        speed: 25,
        timeout: 0,
        divider: '',
    });
}

function initContact() {
    console.log('[Contact]', 'Init');

    const form = $('#contact-form');

    if (!form.length) return;

    form.on('submit', () => {
        const status = $('#status');
        status.text('Sending...');
        status.fadeIn();

        $.post({
            url: '/',
            dataType: 'json',
            data: form.serialize(),
            success: function (response) {
                if (response.success) {
                    status.text('Thank You!');
                    form[0].reset();
                } else {
                    status.text('An error occurred. Please try again.');
                }
            },
        });

        return false;
    });
}

$(document).ready(() => {
    console.log('[Page]', 'Ready');

    initBarba();
});

$(window).on('load', () => {
    console.log('[Page]', 'Load');
});

$(window)
    .on('scroll', () => {
        // console.log('[Page]', 'Scroll');
        refreshNavbar();
    })
    .trigger('scroll');
