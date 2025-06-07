import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/contexts/ThemeContext';

export function PlanetScene() {
  const { colors } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planetRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const isAnimatingRef = useRef<boolean>(true);
  const timeRef = useRef<number>(0);
  const zoomStateRef = useRef<'out' | 'zooming-in' | 'in' | 'zooming-out'>('out');
  const mouseRef = useRef<{x: number, y: number}>({ x: 0, y: 0 });
  const targetRotationRef = useRef<{x: number, y: number}>({ x: 0, y: 0 });
  
  // Fonction d'initialisation
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Créer la scène
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Configurer la caméra
    const camera = new THREE.PerspectiveCamera(
      60, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 15;
    cameraRef.current = camera;
    
    // Configurer le renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limite pour de meilleures performances
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Créer la planète
    createPlanet();
    
    // Créer les particules
    createParticles();
    
    // Gestionnaire de redimensionnement
    const handleResize = () => {
      if (!camera || !renderer) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    // Gestionnaire de mouvement de souris
    const handleMouseMove = (event: MouseEvent) => {
      // Calculer les coordonnées normalisées de la souris (-1 à 1)
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Définir la rotation cible en fonction de la position de la souris
      targetRotationRef.current.x = mouseRef.current.y * 0.3; // Limiter la rotation
      targetRotationRef.current.y = mouseRef.current.x * 0.5;
    };
    
    // Gestionnaire de toucher pour appareils mobiles
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        mouseRef.current.x = (touch.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(touch.clientY / window.innerHeight) * 2 + 1;
        
        targetRotationRef.current.x = mouseRef.current.y * 0.3;
        targetRotationRef.current.y = mouseRef.current.x * 0.5;
      }
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    
    // Animation
    const animate = () => {
      if (!isAnimatingRef.current) return;
      
      requestAnimationFrame(animate);
      timeRef.current += 0.005;
      
      // Animation de la planète avec interaction de la souris
      if (planetRef.current) {
        // Rotation automatique de base
        planetRef.current.rotation.y += 0.002;
        
        // Interpolation en douceur vers la rotation cible
        if (targetRotationRef.current) {
          planetRef.current.rotation.x += (targetRotationRef.current.x - planetRef.current.rotation.x) * 0.05;
          planetRef.current.rotation.y += (targetRotationRef.current.y - planetRef.current.rotation.y) * 0.05;
        }
      }
      
      // Animation des particules
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.0005;
        
        // Faire suivre légèrement le mouvement de la souris par les particules
        if (targetRotationRef.current) {
          particlesRef.current.rotation.x += (targetRotationRef.current.x * 0.3 - particlesRef.current.rotation.x) * 0.01;
          particlesRef.current.rotation.z += (targetRotationRef.current.y * 0.3 - particlesRef.current.rotation.z) * 0.01;
        }
      }
      
      // Gestion du zoom
      handleZooming();
      
      // Rendu
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Nettoyage
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      isAnimatingRef.current = false;
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      
      if (particlesRef.current) {
        const particleGeometry = particlesRef.current.geometry;
        const particleMaterial = particlesRef.current.material as THREE.Material;
        
        particleGeometry.dispose();
        particleMaterial.dispose();
      }
      
      if (planetRef.current) {
        const planetGeometry = planetRef.current.geometry;
        const planetMaterial = planetRef.current.material as THREE.Material;
        
        planetGeometry.dispose();
        planetMaterial.dispose();
      }
    };
  }, []);

  // Recreate planet when theme changes
  useEffect(() => {
    if (planetRef.current && sceneRef.current) {
      // Remove old planet
      sceneRef.current.remove(planetRef.current);
      const oldGeometry = planetRef.current.geometry;
      const oldMaterial = planetRef.current.material as THREE.Material;
      oldGeometry.dispose();
      oldMaterial.dispose();
      
      // Create new planet with updated theme
      createPlanet();
    }
  }, [colors.primary, colors.secondary, colors.accent]);
  
  // Fonction pour gérer l'animation de zoom spectaculaire
  const handleZooming = () => {
    if (!cameraRef.current || !planetRef.current) return;
    
    const camera = cameraRef.current;
    const planet = planetRef.current;
    
    // État initial éloigné
    if (zoomStateRef.current === 'out') {
      if (timeRef.current > 3) { // Réduit le temps d'attente avant de zoomer
        zoomStateRef.current = 'zooming-in';
      }
    }
    // Animation de zoom avant - plus immersive et dynamique
    else if (zoomStateRef.current === 'zooming-in') {
      // Accélération progressive pour un effet plus spectaculaire
      const speed = 0.05 + (15 - camera.position.z) * 0.01;
      camera.position.z -= speed;
      
      // Rotation accentuée pendant le zoom
      planet.rotation.y += 0.005;
      planet.rotation.x += Math.sin(timeRef.current) * 0.002;
      
      // Effet de vibration légère à l'approche
      if (camera.position.z < 8) {
        camera.position.x += Math.sin(timeRef.current * 10) * 0.01;
        camera.position.y += Math.cos(timeRef.current * 15) * 0.01;
      }
      
      // Zoom plus profond pour l'effet immersif
      if (camera.position.z <= 3.5) {
        zoomStateRef.current = 'in';
        timeRef.current = 0;
      }
    }
    // État zoomé - plus proche avec léger mouvement orbital
    else if (zoomStateRef.current === 'in') {
      // Mouvement orbital subtil pendant la phase rapprochée
      const orbitRadius = 0.2;
      const orbitSpeed = 0.5;
      
      camera.position.x = Math.sin(timeRef.current * orbitSpeed) * orbitRadius;
      camera.position.y = Math.cos(timeRef.current * orbitSpeed) * orbitRadius * 0.5;
      
      // Reste en état zoomé pour une durée
      if (timeRef.current > 6) {
        zoomStateRef.current = 'zooming-out';
      }
    }
    // Animation de zoom arrière - avec effet de recul
    else if (zoomStateRef.current === 'zooming-out') {
      // Accélération initiale puis décélération
      let speed;
      if (camera.position.z < 8) {
        speed = 0.1 + (camera.position.z - 3) * 0.02; // Accélération
      } else {
        speed = 0.15 - (camera.position.z - 8) * 0.01; // Décélération
      }
      
      camera.position.z += speed;
      
      // Retour léger à la position normale
      camera.position.x *= 0.95;
      camera.position.y *= 0.95;
      
      // Retour à la position initiale
      if (camera.position.z >= 15) {
        zoomStateRef.current = 'out';
        timeRef.current = 0;
      }
    }
  };
  
  // Fonction pour créer la planète
  const createPlanet = () => {
    if (!sceneRef.current) return;
    
    // Convertir les couleurs hex du thème en RGB normalisé
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
      } : { r: 0.5, g: 0, b: 1 };
    };

    const primaryRgb = hexToRgb(colors.primary);
    const secondaryRgb = hexToRgb(colors.secondary);
    const accentRgb = hexToRgb(colors.accent);
    
    // Géométrie de la planète
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    
    // Créer un shader personnalisé pour la planète
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    
    const fragmentShader = `
      uniform float time;
      uniform vec3 primaryColor;
      uniform vec3 secondaryColor;
      uniform vec3 accentColor;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      // Couleur de base sombre
      vec3 nearBlack = vec3(0.03, 0.01, 0.05);       // Presque noir
      
      // Fonction de bruit pour créer des motifs organiques
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      // Fonction de turbulence pour créer des motifs plus complexes
      float turbulence(vec2 p) {
        float sum = 0.0;
        float freq = 1.0;
        float amp = 1.0;
        
        for(int i = 0; i < 4; i++) {
          sum += noise(p * freq) * amp;
          freq *= 2.0;
          amp *= 0.5;
        }
        
        return sum;
      }
      
      void main() {
        // Créer des motifs complexes
        float noiseValue = turbulence(vUv * 8.0 + time * 0.1);
        float pattern1 = sin(vUv.x * 40.0 + time) * sin(vUv.y * 40.0 + time * 0.7) * 0.5 + 0.5;
        float pattern2 = cos(vUv.x * 30.0 - time * 0.3) * cos(vUv.y * 35.0 + time * 0.2) * 0.5 + 0.5;
        
        // Combiner les motifs
        float finalPattern = mix(pattern1, pattern2, noiseValue);
        
        // Craters et reliefs
        float displacement = sin(vPosition.x * 10.0) * sin(vPosition.y * 10.0) * sin(vPosition.z * 10.0) * 0.1;
        finalPattern = mix(finalPattern, displacement, 0.3);
        
        // Effet de bord lumineux basé sur la normale
        float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 4.0);
        
        // Effet de latitude/longitude
        float latitude = asin(vNormal.y) / 3.14159 + 0.5;
        float longitude = atan(vNormal.x, vNormal.z) / (2.0 * 3.14159) + 0.5;
        float grid = 0.0;
        
        // Lignes de grille subtiles
        if (mod(latitude * 20.0, 1.0) < 0.05 || mod(longitude * 20.0, 1.0) < 0.05) {
          grid = 0.1;
        }
        
        // Mélange des couleurs avec les couleurs du thème
        vec3 darkTheme = primaryColor * 0.3;  // Version sombre de la couleur primaire
        vec3 baseColor = mix(darkTheme, primaryColor, finalPattern);
        baseColor = mix(baseColor, nearBlack, displacement * 2.0);
        baseColor = mix(baseColor, secondaryColor, grid);
        
        // Ajouter l'effet de lueur sur les bords
        vec3 finalColor = mix(baseColor, accentColor, rim * 0.9);
        
        // Ajouter une lueur pulsante
        float pulse = (sin(time) * 0.5 + 0.5) * 0.2;
        finalColor = mix(finalColor, accentColor, pulse * rim);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
    
    // Créer le matériau avec les shaders
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        primaryColor: { value: new THREE.Vector3(primaryRgb.r, primaryRgb.g, primaryRgb.b) },
        secondaryColor: { value: new THREE.Vector3(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b) },
        accentColor: { value: new THREE.Vector3(accentRgb.r, accentRgb.g, accentRgb.b) }
      },
      vertexShader,
      fragmentShader,
      side: THREE.FrontSide
    });
    
    // Créer la planète
    const planet = new THREE.Mesh(geometry, material);
    sceneRef.current.add(planet);
    planetRef.current = planet;
    
    // Ajouter une mise à jour pour l'animation du shader
    const updatePlanetShader = () => {
      if (isAnimatingRef.current && material.uniforms) {
        material.uniforms.time.value += 0.01;
        requestAnimationFrame(updatePlanetShader);
      }
    };
    
    updatePlanetShader();
  };
  
  // Fonction pour créer les particules
  const createParticles = () => {
    if (!sceneRef.current) return;
    
    // Nombre de particules
    const particleCount = 3500;
    
    // Géométrie pour les particules
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);
    const offsets = new Float32Array(particleCount);
    
    // Couleurs pour les particules
    const purpleColor = new THREE.Color(0x6e14aa);    // Violet principal
    const darkPurpleColor = new THREE.Color(0x3d0066); // Violet foncé
    const brightPurpleColor = new THREE.Color(0x9932CC); // Violet brillant
    const blackColor = new THREE.Color(0x0a0010);     // Presque noir
    
    // Distribution des particules dans différentes couches
    const particlesInInnerCloud = Math.floor(particleCount * 0.3);
    const particlesInMidCloud = Math.floor(particleCount * 0.4);
    const particlesInOuterCloud = particleCount - particlesInInnerCloud - particlesInMidCloud;
    
    let particleIndex = 0;
    
    // Couche interne - plus dense, proche de la planète
    for (let i = 0; i < particlesInInnerCloud; i++) {
      // Position aléatoire dans une coquille sphérique
      const radius = 3 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions[particleIndex * 3] = x;
      positions[particleIndex * 3 + 1] = y;
      positions[particleIndex * 3 + 2] = z;
      
      // Couleur - principalement violet foncé
      const color = darkPurpleColor.clone().lerp(purpleColor, Math.random() * 0.5);
      colors[particleIndex * 3] = color.r;
      colors[particleIndex * 3 + 1] = color.g;
      colors[particleIndex * 3 + 2] = color.b;
      
      // Taille variable - petites particules
      sizes[particleIndex] = 0.5 + Math.random() * 1.5;
      
      // Vitesse de déplacement et offset pour animation
      speeds[particleIndex] = 0.2 + Math.random() * 0.3;
      offsets[particleIndex] = Math.random() * Math.PI * 2;
      
      particleIndex++;
    }
    
    // Couche moyenne
    for (let i = 0; i < particlesInMidCloud; i++) {
      const radius = 6 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions[particleIndex * 3] = x;
      positions[particleIndex * 3 + 1] = y;
      positions[particleIndex * 3 + 2] = z;
      
      // Couleur - mélange de violet principal et violet brillant
      const colorMix = Math.random();
      const color = colorMix > 0.7 
        ? brightPurpleColor.clone().lerp(purpleColor, Math.random()) 
        : purpleColor.clone().lerp(darkPurpleColor, Math.random() * 0.7);
      
      colors[particleIndex * 3] = color.r;
      colors[particleIndex * 3 + 1] = color.g;
      colors[particleIndex * 3 + 2] = color.b;
      
      // Taille variable - particules moyennes
      sizes[particleIndex] = 1.0 + Math.random() * 2.0;
      
      // Vitesse et offset
      speeds[particleIndex] = 0.1 + Math.random() * 0.2;
      offsets[particleIndex] = Math.random() * Math.PI * 2;
      
      particleIndex++;
    }
    
    // Couche externe - plus éparse, loin de la planète
    for (let i = 0; i < particlesInOuterCloud; i++) {
      const radius = 11 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions[particleIndex * 3] = x;
      positions[particleIndex * 3 + 1] = y;
      positions[particleIndex * 3 + 2] = z;
      
      // Couleur - mélange avec du noir pour créer l'effet de profondeur
      const color = Math.random() > 0.7 
        ? brightPurpleColor.clone().lerp(blackColor, Math.random() * 0.6)
        : darkPurpleColor.clone().lerp(blackColor, Math.random() * 0.8);
      
      colors[particleIndex * 3] = color.r;
      colors[particleIndex * 3 + 1] = color.g;
      colors[particleIndex * 3 + 2] = color.b;
      
      // Taille variable - grosses particules pour l'effet de profondeur
      sizes[particleIndex] = 0.5 + Math.random() * 3.0;
      
      // Vitesse et offset
      speeds[particleIndex] = 0.05 + Math.random() * 0.1;
      offsets[particleIndex] = Math.random() * Math.PI * 2;
      
      particleIndex++;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particlesGeometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
    particlesGeometry.setAttribute('offset', new THREE.BufferAttribute(offsets, 1));
    
    // Shader avancé pour les particules
    const particleVertexShader = `
      attribute float size;
      attribute float speed;
      attribute float offset;
      
      uniform float time;
      
      varying vec3 vColor;
      varying float vAlpha;
      
      void main() {
        vColor = color;
        
        // Animation pulsante subtile basée sur le temps
        float pulseFactor = sin(time * speed + offset) * 0.2 + 0.8;
        
        // Animation de "respiration" pour les particules
        vec3 animatedPosition = position;
        float distanceFromCenter = length(position);
        float breathingEffect = sin(time * 0.2 + offset) * 0.05;
        animatedPosition *= (1.0 + breathingEffect);
        
        // Calcul de l'alpha basé sur la distance
        vAlpha = mix(1.0, 0.4, distanceFromCenter / 20.0);
        
        vec4 mvPosition = modelViewMatrix * vec4(animatedPosition, 1.0);
        
        // Taille variable avec pulsation
        gl_PointSize = size * pulseFactor * (400.0 / -mvPosition.z);
        
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
    
    const particleFragmentShader = `
      varying vec3 vColor;
      varying float vAlpha;
      
      void main() {
        // Forme de particule douce
        float dist = length(gl_PointCoord - vec2(0.5, 0.5));
        if (dist > 0.5) discard;
        
        // Effet de lueur interne
        float intensity = 1.0 - (dist * 1.8);
        intensity = pow(intensity, 1.5);
        
        // Couleur finale avec luminosité variable
        vec3 finalColor = vColor * intensity;
        
        gl_FragColor = vec4(finalColor, vAlpha * intensity);
      }
    `;
    
    // Matériau pour les particules
    const particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 }
      },
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    // Création des particules
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    sceneRef.current.add(particles);
    particlesRef.current = particles;
    
    // Mettre à jour l'animation du temps dans le shader
    const updateParticleTime = () => {
      if (isAnimatingRef.current && particlesMaterial.uniforms) {
        particlesMaterial.uniforms.time.value += 0.01;
        requestAnimationFrame(updateParticleTime);
      }
    };
    
    updateParticleTime();
  };

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'radial-gradient(circle at 50% 50%, #1a0030 0%, #000000 100%)' }}
    />
  );
}