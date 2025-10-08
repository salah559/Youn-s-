
import * as THREE from '../node_modules/three/build/three.module.js';

let scene, camera, renderer, particles, barberIcons;
let mouseX = 0, mouseY = 0;

function init() {
    try {
        scene = new THREE.Scene();
        
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 500;
        
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0);
    
        const canvas = renderer.domElement;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '0';
        canvas.style.pointerEvents = 'none';
        document.body.insertBefore(canvas, document.body.firstChild);
    
        // Golden particles
        const particlesGeometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        
        const goldColor = new THREE.Color(0xcaa43c);
        const darkGoldColor = new THREE.Color(0x8b6a2f);
        
        for (let i = 0; i < 2000; i++) {
            const x = Math.random() * 2000 - 1000;
            const y = Math.random() * 2000 - 1000;
            const z = Math.random() * 2000 - 1000;
            vertices.push(x, y, z);
            
            const mixColor = goldColor.clone().lerp(darkGoldColor, Math.random());
            colors.push(mixColor.r, mixColor.g, mixColor.b);
        }
        
        particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        particlesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);
        
        // Create barber shop icons (scissors, razors, combs)
        createBarberIcons();
        
        const ambientLight = new THREE.AmbientLight(0xcaa43c, 0.5);
        scene.add(ambientLight);
        
        window.addEventListener('resize', onWindowResize);
        document.addEventListener('mousemove', onMouseMove);
        
        animate();
    } catch (error) {
        console.log('WebGL not available, using fallback background');
    }
}

function createBarberIcons() {
    const iconGroup = new THREE.Group();
    const goldMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xcaa43c, 
        transparent: true, 
        opacity: 0.4,
        side: THREE.DoubleSide
    });
    
    // Create scissors shape
    const scissorsShape = new THREE.Shape();
    scissorsShape.moveTo(0, -8);
    scissorsShape.lineTo(15, -3);
    scissorsShape.lineTo(15, 3);
    scissorsShape.lineTo(0, 8);
    scissorsShape.lineTo(-2, 4);
    scissorsShape.lineTo(-2, -4);
    scissorsShape.lineTo(0, -8);
    
    const scissorsGeometry = new THREE.ShapeGeometry(scissorsShape);
    
    // Create comb shape
    const combShape = new THREE.Shape();
    combShape.moveTo(-10, -3);
    combShape.lineTo(10, -3);
    combShape.lineTo(10, 3);
    combShape.lineTo(-10, 3);
    combShape.lineTo(-10, -3);
    
    const combGeometry = new THREE.ShapeGeometry(combShape);
    
    // Create razor shape
    const razorShape = new THREE.Shape();
    razorShape.moveTo(-12, -2);
    razorShape.lineTo(12, -2);
    razorShape.lineTo(10, 2);
    razorShape.lineTo(-10, 2);
    razorShape.lineTo(-12, -2);
    
    const razorGeometry = new THREE.ShapeGeometry(razorShape);
    
    // Add multiple icons throughout the scene
    const iconTypes = [
        { geo: scissorsGeometry, name: 'scissors' },
        { geo: combGeometry, name: 'comb' },
        { geo: razorGeometry, name: 'razor' }
    ];
    
    for (let i = 0; i < 30; i++) {
        const iconType = iconTypes[Math.floor(Math.random() * iconTypes.length)];
        const icon = new THREE.Mesh(iconType.geo.clone(), goldMaterial.clone());
        
        icon.position.x = Math.random() * 1400 - 700;
        icon.position.y = Math.random() * 1400 - 700;
        icon.position.z = Math.random() * 800 - 400;
        
        icon.rotation.z = Math.random() * Math.PI * 2;
        icon.scale.set(1.5, 1.5, 1.5);
        
        // Store rotation speed
        icon.userData.rotationSpeed = (Math.random() - 0.5) * 0.02;
        icon.userData.driftSpeed = {
            x: (Math.random() - 0.5) * 0.3,
            y: (Math.random() - 0.5) * 0.3
        };
        
        iconGroup.add(icon);
    }
    
    barberIcons = iconGroup;
    scene.add(barberIcons);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.1;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.1;
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particles
    particles.rotation.x += 0.0002;
    particles.rotation.y += 0.0003;
    
    // Animate barber icons
    if (barberIcons) {
        barberIcons.children.forEach(icon => {
            icon.rotation.z += icon.userData.rotationSpeed;
            icon.position.x += icon.userData.driftSpeed.x;
            icon.position.y += icon.userData.driftSpeed.y;
            
            // Wrap around screen bounds
            if (Math.abs(icon.position.x) > 800) {
                icon.position.x = -Math.sign(icon.position.x) * 800;
            }
            if (Math.abs(icon.position.y) > 800) {
                icon.position.y = -Math.sign(icon.position.y) * 800;
            }
        });
    }
    
    // Smooth camera follow
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
