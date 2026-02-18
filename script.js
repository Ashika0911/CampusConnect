// Canvas Animation for Cinematic Lighting Effects
const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle system for subtle light effects
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.lifespan = Math.random() * 80 + 40;
        this.age = 0;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.age++;
        this.opacity = (1 - this.age / this.lifespan) * (Math.random() * 0.5 + 0.2);
    }

    draw(ctx) {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
        const colors = [
            `rgba(74, 222, 128, ${this.opacity * 0.85})`,
            `rgba(34, 197, 94, ${this.opacity * 0.55})`,
            `rgba(74, 222, 128, ${this.opacity * 0.2})`
        ];
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(0.5, colors[1]);
        gradient.addColorStop(1, colors[2]);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    isDead() {
        return this.age >= this.lifespan;
    }
}

let particles = [];

// Create particles periodically
function createParticles() {
    const rightSide = canvas.width * 0.65;
    const x = rightSide + Math.random() * canvas.width * 0.3;
    const y = canvas.height * 0.5 + (Math.random() - 0.5) * canvas.height * 0.5;
    
    particles.push(new Particle(x, y));
}

// Draw subtle gradient background
function drawGradientBackground() {
    const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient1.addColorStop(0, '#050a05');
    gradient1.addColorStop(0.3, '#0a1408');
    gradient1.addColorStop(0.5, '#0d1a0d');
    gradient1.addColorStop(0.7, '#08120a');
    gradient1.addColorStop(1, '#050a05');
    
    ctx.fillStyle = gradient1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add radial overlay for depth
    const radialGradient = ctx.createRadialGradient(canvas.width * 0.5, canvas.height * 0.5, 0, canvas.width * 0.5, canvas.height * 0.5, Math.max(canvas.width, canvas.height));
    radialGradient.addColorStop(0, 'rgba(74, 222, 128, 0.03)');
    radialGradient.addColorStop(0.4, 'rgba(34, 197, 94, 0.01)');
    radialGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = radialGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw animated gradient streaks
function drawGradientStreaks() {
    const time = Date.now() * 0.0002;
    
    // Center-based horizontal glow
    const streakGradient1 = ctx.createLinearGradient(0, canvas.height * 0.4, canvas.width, canvas.height * 0.4);
    streakGradient1.addColorStop(0, 'rgba(74, 222, 128, 0)');
    streakGradient1.addColorStop(0.3, `rgba(74, 222, 128, ${0.04 + Math.sin(time) * 0.02})`);
    streakGradient1.addColorStop(0.7, `rgba(34, 197, 94, ${0.03 + Math.sin(time + Math.PI) * 0.015})`);
    streakGradient1.addColorStop(1, 'rgba(74, 222, 128, 0)');
    
    ctx.fillStyle = streakGradient1;
    ctx.fillRect(0, canvas.height * 0.35, canvas.width, canvas.height * 0.1);
    
    // Vertical center glow
    const streakGradient2 = ctx.createLinearGradient(canvas.width * 0.5, 0, canvas.width * 0.5, canvas.height);
    streakGradient2.addColorStop(0, 'rgba(34, 197, 94, 0)');
    streakGradient2.addColorStop(0.25, 'rgba(34, 197, 94, 0)');
    streakGradient2.addColorStop(0.5, `rgba(74, 222, 128, ${0.04 + Math.cos(time) * 0.02})`);
    streakGradient2.addColorStop(0.75, 'rgba(34, 197, 94, 0)');
    streakGradient2.addColorStop(1, 'rgba(34, 197, 94, 0)');
    
    ctx.fillStyle = streakGradient2;
    ctx.fillRect(canvas.width * 0.45, 0, canvas.width * 0.1, canvas.height);
}

// Draw subtle noise pattern (minimal)
function addSubtleNoise() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
        const noise = (Math.random() - 0.5) * 1.5;
        data[i] += noise * 0.5;
        data[i + 1] += noise;
        data[i + 2] += noise * 0.6;
        data[i + 2] += noise * 0.8;
    }
    
    ctx.putImageData(imageData, 0, 0);
}

// Animation loop
let frameCount = 0;
function animate() {
    frameCount++;
    
    // Draw background
    drawGradientBackground();
    
    // Draw gradient streaks
    drawGradientStreaks();
    
    // Add subtle noise every 10 frames
    if (frameCount % 10 === 0) {
        addSubtleNoise();
    }
    
    // Create new particles
    if (frameCount % 5 === 0) {
        createParticles();
    }
    
    // Update and draw particles
    particles = particles.filter(p => !p.isDead());
    particles.forEach(p => {
        p.update();
        p.draw(ctx);
    });
    
    requestAnimationFrame(animate);
}

animate();
