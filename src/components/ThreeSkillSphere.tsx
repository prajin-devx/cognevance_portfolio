import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

interface SkillNode {
  name: string;
  color: number;
  shape: 'box' | 'sphere' | 'octahedron' | 'icosahedron' | 'torus';
  desc: string;
}

export default function ThreeSkillSphere() {
  const { theme, themeStyles, accentStyles } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSkill, setActiveSkill] = useState<string>('Hover nodes to analyze topology');

  const skillsData: SkillNode[] = [
    { name: 'React.js Architecture', color: 0x00fbfb, shape: 'torus', desc: 'Complex interface engineering & system status synchronization' },
    { name: 'Generative AI Pipelines', color: 0xfe00fe, shape: 'icosahedron', desc: 'LLM orchestrations, multi-modal APIs & vector database schemas' },
    { name: 'DaVinci Resolve Pro', color: 0x3b82f6, shape: 'octahedron', desc: 'Cinematic video compositing, color matching & spatial workflows' },
    { name: 'CapCut Directing', color: 0x79ff5b, shape: 'sphere', desc: 'Dynamic visual pacing, modular storyboarding & micro-animations' },
    { name: 'Full Stack Integration', color: 0xffa500, shape: 'box', desc: 'Modular server structures, persistent Firestore, and secure API gateways' }
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Create scene
    const scene = new THREE.Scene();

    // Create camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 9.5;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Ambient and Point Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00fbfb, 1.8, 30);
    pointLight1.position.set(6, 6, 6);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xfe00fe, 1.8, 30);
    pointLight2.position.set(-6, -6, 6);
    scene.add(pointLight2);

    // Central Core Sphere (Double layer for high-tech complex core)
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner wireframe core
    const coreGeometry1 = new THREE.IcosahedronGeometry(1.0, 1);
    const coreMaterial1 = new THREE.MeshPhongMaterial({
      color: 0x00fbfb,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
      emissive: 0x00fbfb,
      emissiveIntensity: 0.2
    });
    const coreMesh1 = new THREE.Mesh(coreGeometry1, coreMaterial1);
    coreGroup.add(coreMesh1);

    // Outer core sphere ring
    const coreGeometry2 = new THREE.OctahedronGeometry(1.2, 1);
    const coreMaterial2 = new THREE.MeshPhongMaterial({
      color: 0xfe00fe,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
      emissive: 0xfe00fe,
      emissiveIntensity: 0.15
    });
    const coreMesh2 = new THREE.Mesh(coreGeometry2, coreMaterial2);
    coreGroup.add(coreMesh2);

    // Group to hold all orbit nodes
    const skillsGroup = new THREE.Group();
    scene.add(skillsGroup);

    // Multi-Axis Coordinate Orbit Rings (Concentric complex rings)
    const ringsGroup = new THREE.Group();
    scene.add(ringsGroup);

    const ringAngles = [Math.PI / 4, -Math.PI / 4, Math.PI / 2.2];
    const ringColors = [0x00fbfb, 0xfe00fe, 0x6366f1];
    const ringMeshes: THREE.Mesh[] = [];

    ringAngles.forEach((angle, idx) => {
      const ringGeom = new THREE.RingGeometry(2.8 + idx * 0.4, 2.82 + idx * 0.4, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColors[idx],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.15 - idx * 0.03,
        wireframe: true
      });
      const rMesh = new THREE.Mesh(ringGeom, ringMat);
      rMesh.rotation.x = angle;
      rMesh.rotation.y = idx * (Math.PI / 3);
      ringsGroup.add(rMesh);
      ringMeshes.push(rMesh);
    });

    // Floating Starfield / Quantum Dust Cloud
    const particlesCount = 100;
    const particlesGeom = new THREE.BufferGeometry();
    const positionsArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      positionsArray[i] = (Math.random() - 0.5) * 14;
    }
    particlesGeom.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3));
    
    const particlesMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x00fbfb,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const starfield = new THREE.Points(particlesGeom, particlesMat);
    scene.add(starfield);

    // Create Skill Meshes and Connection Line holders
    const nodeMeshes: THREE.Mesh[] = [];
    const connectionLines: THREE.Line[] = [];
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.35
    });

    skillsData.forEach((skill, index) => {
      let geometry: THREE.BufferGeometry;

      switch (skill.shape) {
        case 'box':
          geometry = new THREE.BoxGeometry(0.42, 0.42, 0.42);
          break;
        case 'octahedron':
          geometry = new THREE.OctahedronGeometry(0.38);
          break;
        case 'icosahedron':
          geometry = new THREE.IcosahedronGeometry(0.38, 0);
          break;
        case 'torus':
          geometry = new THREE.TorusGeometry(0.28, 0.09, 8, 24);
          break;
        default:
          geometry = new THREE.SphereGeometry(0.33, 16, 16);
      }

      const material = new THREE.MeshPhongMaterial({
        color: skill.color,
        shininess: 120,
        specular: 0xffffff,
        emissive: skill.color,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.9
      });

      const mesh = new THREE.Mesh(geometry, material);

      // Spherical orbital coordinates for a highly complex 3D orientation
      const angle = (index / skillsData.length) * Math.PI * 2;
      const radius = 3.2;
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.y = Math.sin(angle) * 1.6;
      mesh.position.z = Math.sin(angle) * radius * 0.7;

      // Attach custom telemetry parameters
      mesh.userData = {
        name: skill.name,
        desc: skill.desc,
        angle: angle,
        radius: radius,
        speed: 0.012 + index * 0.004,
        yOffset: Math.random() * Math.PI,
        rotationSpeedX: 0.015 + Math.random() * 0.01,
        rotationSpeedY: 0.015 + Math.random() * 0.01
      };

      skillsGroup.add(mesh);
      nodeMeshes.push(mesh);

      // Create a direct connection vector line from core (0,0,0) to node
      const points = [new THREE.Vector3(0, 0, 0), mesh.position.clone()];
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeom, lineMaterial);
      scene.add(line);
      connectionLines.push(line);
    });

    // Raycaster for Hover detection
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let dragVelocity = { x: 0.003, y: 0.001 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        skillsGroup.rotation.y += deltaX * 0.008;
        skillsGroup.rotation.x += deltaY * 0.008;
        ringsGroup.rotation.y += deltaX * 0.004;

        dragVelocity = { x: deltaX * 0.0015, y: deltaY * 0.0015 };
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch Support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;

        skillsGroup.rotation.y += deltaX * 0.008;
        skillsGroup.rotation.x += deltaY * 0.008;
        ringsGroup.rotation.y += deltaX * 0.004;

        dragVelocity = { x: deltaX * 0.0015, y: deltaY * 0.0015 };
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);

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
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Spin internal multi-layered cores
      coreMesh1.rotation.y = elapsedTime * 0.3;
      coreMesh1.rotation.x = elapsedTime * 0.15;
      coreMesh2.rotation.y = -elapsedTime * 0.15;
      coreMesh2.rotation.z = elapsedTime * 0.2;

      // Rotate Concentric Ring Helpers
      ringsGroup.rotation.y = elapsedTime * 0.08;
      ringMeshes.forEach((rm, i) => {
        rm.rotation.z = elapsedTime * (0.04 * (i + 1));
      });

      // Drifting Starfield particles
      starfield.rotation.y = elapsedTime * 0.015;
      starfield.rotation.x = Math.sin(elapsedTime * 0.1) * 0.05;

      // Inertia slide deceleration
      if (!isDragging) {
        skillsGroup.rotation.y += dragVelocity.x;
        skillsGroup.rotation.x += dragVelocity.y;
        dragVelocity.x *= 0.95;
        dragVelocity.y *= 0.95;

        // Base residual stellar spin
        skillsGroup.rotation.y += 0.0015;
      }

      // Individual orbiting node updates
      nodeMeshes.forEach((mesh, index) => {
        const data = mesh.userData;
        data.angle += data.speed * 0.15;

        // Floating multi-dimensional orbital math
        mesh.position.y = Math.sin(elapsedTime * 1.2 + data.yOffset) * 0.35 + Math.sin(data.angle) * 1.5;
        mesh.position.x = Math.cos(data.angle) * data.radius;
        mesh.position.z = Math.sin(data.angle) * data.radius * 0.7;

        // Spin node on its own axis
        mesh.rotation.x += data.rotationSpeedX * 0.5;
        mesh.rotation.y += data.rotationSpeedY * 0.5;

        // Synchronize and update the vector connection lines in real-time
        const line = connectionLines[index];
        if (line) {
          const positions = line.geometry.attributes.position.array as Float32Array;
          // Set index 1 vertex coordinates to match the current node position
          positions[3] = mesh.position.x;
          positions[4] = mesh.position.y;
          positions[5] = mesh.position.z;
          line.geometry.attributes.position.needsUpdate = true;
        }
      });

      // Raycast hover detection
      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        const hoveredMesh = intersects[0].object as THREE.Mesh;
        const name = hoveredMesh.userData.name;
        const desc = hoveredMesh.userData.desc;
        setActiveSkill(`SYSTEM_ACTIVE: [ ${name.toUpperCase()} ] // ${desc}`);

        hoveredMesh.scale.set(1.22, 1.22, 1.22);
        if (hoveredMesh.material instanceof THREE.MeshPhongMaterial) {
          hoveredMesh.material.emissiveIntensity = 0.9;
        }
      } else {
        nodeMeshes.forEach((mesh) => {
          mesh.scale.set(1.0, 1.0, 1.0);
          if (mesh.material instanceof THREE.MeshPhongMaterial) {
            mesh.material.emissiveIntensity = 0.4;
          }
        });
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup resources cleanly
    return () => {
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.domElement.removeEventListener('touchstart', onTouchStart);
        renderer.domElement.removeEventListener('touchmove', onTouchMove);
      }
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onMouseUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries & materials to avoid WebGL leak warnings
      coreGeometry1.dispose();
      coreMaterial1.dispose();
      coreGeometry2.dispose();
      coreMaterial2.dispose();
      nodeMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        if (mesh.material instanceof THREE.Material) {
          mesh.material.dispose();
        }
      });
      connectionLines.forEach((line) => {
        line.geometry.dispose();
      });
      ringMeshes.forEach((rm) => {
        rm.geometry.dispose();
        if (rm.material instanceof THREE.Material) {
          rm.material.dispose();
        }
      });
      lineMaterial.dispose();
      particlesGeom.dispose();
      particlesMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div 
        ref={containerRef} 
        className="w-full h-[320px] md:h-[400px] cursor-grab active:cursor-grabbing relative"
      />
      
      {/* Dynamic Status / Hover HUD */}
      <div className={`w-full max-w-lg px-4 py-3 border ${themeStyles.border} ${themeStyles.card} bg-opacity-85 backdrop-blur-md rounded-2xl mt-2 text-center shadow-lg`}>
        <div className={`text-[10px] font-sans font-bold ${accentStyles.text} uppercase tracking-widest flex items-center justify-center gap-1.5 mb-1 animate-pulse`}>
          <span className={`w-1.5 h-1.5 ${accentStyles.bg} rounded-full ${accentStyles.glow}`}></span>
          3D_Semiconductor_Constellation_Telemetry
        </div>
        <p className={`font-mono text-xs ${themeStyles.text} line-clamp-1`}>
          {activeSkill}
        </p>
      </div>
    </div>
  );
}
