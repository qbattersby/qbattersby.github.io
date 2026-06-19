(function () {
    var background = document.querySelector('.site-blue-background');

    if (!background || !window.matchMedia) {
        return;
    }

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var finePointer = window.matchMedia('(pointer: fine)');
    var root = document.documentElement;
    var hasHeroImage = Boolean(document.querySelector('.floating-mp'));

    if (reducedMotion.matches || !finePointer.matches) {
        return;
    }

    var currentX = 50;
    var currentY = 42;
    var targetX = currentX;
    var targetY = currentY;
    var rafId = null;

    function setPointerVars() {
        root.style.setProperty('--bg-pointer-x', currentX.toFixed(2) + '%');
        root.style.setProperty('--bg-pointer-y', currentY.toFixed(2) + '%');

        if (hasHeroImage) {
            var heroX = (currentX - 50) * 0.16;
            var heroY = (currentY - 50) * 0.1;

            root.style.setProperty('--hero-parallax-x', heroX.toFixed(2) + 'px');
            root.style.setProperty('--hero-parallax-y', heroY.toFixed(2) + 'px');
            root.style.setProperty('--hero-shadow-x', (-heroX * 0.7).toFixed(2) + 'px');
        }
    }

    function animatePointer() {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        setPointerVars();

        if (Math.abs(targetX - currentX) > 0.03 || Math.abs(targetY - currentY) > 0.03) {
            rafId = window.requestAnimationFrame(animatePointer);
            return;
        }

        currentX = targetX;
        currentY = targetY;
        setPointerVars();
        rafId = null;
    }

    function handlePointerMove(event) {
        targetX = Math.max(0, Math.min(100, (event.clientX / window.innerWidth) * 100));
        targetY = Math.max(0, Math.min(100, (event.clientY / window.innerHeight) * 100));

        if (!rafId) {
            rafId = window.requestAnimationFrame(animatePointer);
        }
    }

    function handleVisibilityChange() {
        if (document.hidden && rafId) {
            window.cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
}());
