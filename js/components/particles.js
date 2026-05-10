export function initParticles() {
    const container = document.createElement('div');
    container.id = 'particles-container';
    document.body.prepend(container);

    const numParticles = 50;
    for (let i = 0; i < numParticles; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Shape generation
    const shapeType = Math.floor(Math.random() * 3);
    if (shapeType === 0) {
        particle.style.borderRadius = '50%';
    } else if (shapeType === 1) {
        particle.style.borderRadius = '2px';
    } else {
        particle.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
        particle.style.borderRadius = '0';
    }
    
    // Randomize properties
    const size = Math.random() * 4 + 2; // 2px to 6px
    const x = Math.random() * 100; // 0 to 100vw
    const y = Math.random() * 100; // 0 to 100vh
    const duration = Math.random() * 25 + 15; // 15s to 40s
    const delay = Math.random() * 20; // 0s to 20s
    const opacity = Math.random() * 0.4 + 0.1;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${x}vw`;
    particle.style.top = `${y}vh`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `-${delay}s`;
    particle.style.opacity = opacity;
    // Set a custom property to read in keyframes if needed
    particle.style.setProperty('--opacity', opacity);
    
    container.appendChild(particle);
}
