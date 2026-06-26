import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 8;
    camera.position.y = 1.5;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle field
    const particlesCount = 350;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Position particles in a large sphere / cloud around the camera
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const distance = 5 + Math.random() * 15;

      positions[i] = Math.sin(phi) * Math.cos(theta) * distance;
      positions[i + 1] = Math.sin(phi) * Math.sin(theta) * distance;
      positions[i + 2] = Math.cos(phi) * distance;

      // Color nodes: Cyan (0, 251, 251), Magenta (254, 0, 254), or deep blue
      const rand = Math.random();
      if (rand > 0.6) {
        // Cyan
        colors[i] = 0.0;
        colors[i + 1] = 0.98;
        colors[i + 2] = 0.98;
      } else if (rand > 0.3) {
        // Magenta/Pink
        colors[i] = 0.99;
        colors[i + 1] = 0.4;
        colors[i + 2] = 0.95;
      } else {
        // Muted teal/blue
        colors[i] = 0.1;
        colors[i + 1] = 0.3;
        colors[i + 2] = 0.6;
      }
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom glowing particle material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    });

    const starParticles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(starParticles);

    // Dynamic grid plane at the bottom
    const gridHelper = new THREE.GridHelper(40, 40, 0x00fbfb, 0x1c1b1b);
    gridHelper.position.y = -3;
    // Cast to any to safely adjust material parameters
    const gridMaterial = gridHelper.material as THREE.Material;
    gridMaterial.transparent = true;
    gridMaterial.opacity = 0.15;
    scene.add(gridHelper);

    // Light source
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00fbfb, 1, 50);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    // Mouse movement tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse positions between -1 and 1
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Handle resizing
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation (ease-out lerp)
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      camera.position.x = mouseX * 2;
      camera.position.y = 1.5 + (mouseY * 0.8);
      camera.lookAt(new THREE.Vector3(0, 0.5, -5));

      // Slow rotation of particles
      starParticles.rotation.y = elapsedTime * 0.02;
      starParticles.rotation.x = elapsedTime * 0.005;

      // Slight wavy motion on grid helper (simulated)
      gridHelper.rotation.y = Math.sin(elapsedTime * 0.1) * 0.02;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      // Dispose geometries & materials
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      gridHelper.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden" 
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
