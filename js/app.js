/**
 * Main application JavaScript
 * Handles background animation, analytics tracking, and UI interactions
 */

/**
 * Updates canvas dimensions to match viewport and content size
 */
let isUpdatingCanvas = false;

function updateCanvasSize() {
    if (isUpdatingCanvas) return;
    isUpdatingCanvas = true;

    const canvas = document.getElementById('box');
    if (!canvas) {
        isUpdatingCanvas = false;
        return;
    }

    // Force a reflow to get accurate dimensions
    document.body.offsetHeight;

    const whiteContainer = document.querySelector('.white-container');
    const containerHeight = whiteContainer ? whiteContainer.offsetHeight : 0;
    
    canvas.width = window.innerWidth;
    canvas.height = Math.max(
        window.innerHeight,
        document.documentElement.scrollHeight,
        containerHeight + 400 // Increased padding for better coverage
    );

    // Update the fluid background if it exists
    if (window.fluidBg && typeof window.fluidBg.resize === 'function') {
        window.fluidBg.resize();
    }

    isUpdatingCanvas = false;
}

// Initialize fluid background animation
document.addEventListener('DOMContentLoaded', function() {
    try {
        const canvas = document.getElementById('box');
        if (!canvas) {
            throw new Error('Canvas element not found');
        }

        // Initial size setup
        updateCanvasSize();

        // Set up event listeners for size updates
        window.addEventListener('load', () => {
            updateCanvasSize();
            
            // Additional checks after load
            [100, 500, 1000].forEach(delay => {
                setTimeout(updateCanvasSize, delay);
            });
        });

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateCanvasSize, 100);
        });

        // Configure and initialize fluid background
        const bg = new Color4Bg.AestheticFluidBg({
            canvas: canvas,
            colors: ["#2d5283", "#000000", "#2d5283", "#000000", "#2d5283", "#00000e"],
            loop: true,
            seed: 64783,
            speed: 0.5,
            scale: 1.2,
            noise: 35,
            animate: true
        });

        // Store reference for resize handling
        window.fluidBg = bg;

        // Start animation loop
        function animate() {
            bg.update();
            requestAnimationFrame(animate);
        }
        animate();

        // Update canvas when accordion state changes
        $('.accordion').on('down.zf.accordion up.zf.accordion', function() {
            setTimeout(updateCanvasSize, 300);
        });

        // Update size when Foundation is initialized
        $(document).on('initialized.zf', function() {
            updateCanvasSize();
        });

        console.log('Background initialized and animating');
    } catch (error) {
        console.error('Error initializing background:', error);
    }
});

/**
 * Initialize MixPanel Analytics
 * Loads MixPanel script and sets up tracking
 */
(function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src=("https:"===e.location.protocol?"https:":"http:")+'//cdn.mxpnl.com/libs/mixpanel-2.2.min.js';f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f);b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.increment people.append people.track_charge people.clear_charges people.delete_user".split(" ");for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2}})(document,window.mixpanel||[]);

/**
 * Document Ready Handler
 * Initializes UI components and sets up interactions
 */
$(document).ready(function() {
    // Initialize responsive text sizing
    jQuery('.mega').fitText(0.28);
    jQuery('.submega').fitText(0.34);

    // Set up Foundation accordion
    $('.accordion').attr('data-accordion', '');
    $('.accordion-item').attr('data-accordion-item', '');
    
    // Initialize Foundation framework
    $(document).foundation();

    // Configure accordion behavior
    const accordionOptions = new Foundation.Accordion($('.accordion'), {
        multiExpand: false,
        allowAllClosed: true
    });

    // Set up scroll animations using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.classList.add('fade-in-up');
                });
                observer.unobserve(entry.target);
            }
        });
    }

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    function initializeObservers() {
        document.querySelectorAll('section, .portfolio-grid .cell').forEach((element) => {
            element.classList.remove('fade-in-up');
            observer.observe(element);
        });
    }

    // Initialize observers after DOM is ready
    setTimeout(initializeObservers, 100);

    // Reinitialize on orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(initializeObservers, 100);
    });
});

/**
 * Analytics Configuration
 * Sets up MixPanel and CrazyEgg tracking
 */
// Initialize MixPanel with storage access check
if (typeof mixpanel !== 'undefined') {
    try {
        mixpanel.init("c92a5986631ed0a4b6c19404c128f2b0", {
            ignore_dnt: true,
            debug: false,
            track_pageview: true,
            persistence: 'cookie',  // Use cookies instead of localStorage
            cookie_expiration: 1,  // Set cookie expiration to 1 day
            cookie_domain: '',  // Current domain only
            api_transport: 'XHR',
            cross_site_cookie: false,
            cross_subdomain_cookie: false,
            secure_cookie: true,
            ip: false,  // Don't track IP addresses
            property_blacklist: ['$initial_referrer', '$initial_referring_domain']  // Minimize stored data
        });

        // Configure MixPanel event tracking
        const trackingEvents = {
            'a.js-getit-link': 'Email Click from Get It Done Section',
            'a.icon-plus': 'Email Click from Plus Icon', 
            'a.js-getintouch': 'Email Click from Large Get in Touch',
            'a.js-phone-link': 'Phone Number Click',
            'a.js-twitter-link': 'Twitter Visit',
            'a.js-aboutquinn-link': 'Email from About Quinn Section'
        };

        // Set up tracking for each event with error handling
        Object.entries(trackingEvents).forEach(([selector, event]) => {
            try {
                mixpanel.track_links(selector, event);
            } catch (e) {
                console.warn(`Failed to set up tracking for ${selector}:`, e);
            }
        });

        // Track page load after initialization
        try {
            mixpanel.track("Page View", {
                path: window.location.pathname,
                url: window.location.href
            });
        } catch (e) {
            console.warn('Failed to track page view:', e);
        }
    } catch (error) {
        console.warn('MixPanel initialization failed:', error);
    }
}

// Initialize CrazyEgg analytics
setTimeout(function(){
    const script = document.createElement("script");
    const firstScript = document.getElementsByTagName("script")[0];
    script.src = document.location.protocol + "//script.crazyegg.com/pages/scripts/0014/8176.js?" + 
                 Math.floor(new Date().getTime()/3600000);
    script.async = true;
    script.type = "text/javascript";
    firstScript.parentNode.insertBefore(script, firstScript);
}, 1);