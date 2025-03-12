const controller = new ScrollMagic.Controller();

gsap.from('.glass-card', {
    duration: 1.5,
    y: 100,
    opacity: 0,
    stagger: 0.3,
    ease: 'power4.out'
});

gsap.from('.btn', {
    duration: 1,
    scale: 0.8,
    opacity: 0,
    delay: 0.5,
    stagger: 0.2,
    ease: 'elastic.out(1, 0.5)'
});

const scene = new ScrollMagic.Scene({
    triggerElement: '.container',
    triggerHook: 0.8
})
.setTween(gsap.from('.title', { duration: 1, y: -50, opacity: 0, ease: 'power3.out' }))
.addTo(controller);
