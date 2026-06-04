/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { TRANS_NODES } from "../types";

interface ThreeCanvasProps {
  activeScene: number;
}

export default function ThreeCanvas({ activeScene }: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    activeScene: 1,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
  });

  // Track coordinates of projected nodes to display crisp Tailwind speech tags on the UI overlay
  const [projectedPoints, setProjectedPoints] = useState<
    Array<{ id: number; x: number; y: number; visible: boolean; text: string; translated: string; lang: string }>
  >([]);

  // Update scene state ref
  useEffect(() => {
    stateRef.current.activeScene = activeScene;
  }, [activeScene]);

  // Track mouse movement for subtle interactive camera parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      stateRef.current.targetMouseX = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      stateRef.current.targetMouseY = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    // 1. Setup Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#FBFBFD");

    // 2. Setup Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight("#ffffff", 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight("#e0f2fe", 1.5);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight("#3b82f6", 1, 15);
    pointLight.position.set(0, 3, 3);
    scene.add(pointLight);

    // 5. Creating groups for organization
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    const globeGroup = new THREE.Group();
    masterGroup.add(globeGroup);

    const pathsGroup = new THREE.Group();
    globeGroup.add(pathsGroup);

    const nodesGroup = new THREE.Group();
    globeGroup.add(nodesGroup);

    const neuralGroup = new THREE.Group();
    masterGroup.add(neuralGroup);

    // Dynamic particles cluster: used for both ambiance, text-particles, and logo morphing
    const particleCount = 1200;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3); // For morphing back
    const characterIndices = new Float32Array(particleCount); // To store animation indices

    const colorBlue = new THREE.Color("#0066CC");
    const colorTeal = new THREE.Color("#1D1D1F");
    const colorWhite = new THREE.Color("#ffffff");

    for (let i = 0; i < particleCount; i++) {
      // Scatter in a sphere around scene initially
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const radius = 3.5 + Math.random() * 2;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      // Color gradients
      const mixRatio = Math.random();
      const resultingColor = mixRatio < 0.4 ? colorBlue : mixRatio < 0.8 ? colorTeal : colorWhite;
      colors[i * 3] = resultingColor.r;
      colors[i * 3 + 1] = resultingColor.g;
      colors[i * 3 + 2] = resultingColor.b;

      characterIndices[i] = i;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Custom Glowing Particle Shader Material
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const spaceParticles = new THREE.Points(particleGeometry, particleMaterial);
    masterGroup.add(spaceParticles);

    // ==========================================
    // MODULE 1: THE ROTATING WIREFRAME EARTH
    // ==========================================
    // Let's make a beautiful glowing transparent globe with custom dots of continents
    const globeRadius = 2.0;

    // Glowing wireframe Sphere
    const sphereGeo = new THREE.SphereGeometry(globeRadius, 36, 36);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: "#1D1D1F",
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const globeWire = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeWire);

    // Inner subtle solid color
    const innerGeo = new THREE.SphereGeometry(globeRadius * 0.98, 30, 30);
    const innerMat = new THREE.MeshBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.55,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(innerSphere);

    // Create discrete geographical grid dots representing cities/continents
    const gridDotCount = 450;
    const gridDotGeometry = new THREE.BufferGeometry();
    const gridDotPositions = new Float32Array(gridDotCount * 3);

    for (let i = 0; i < gridDotCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      gridDotPositions[i * 3] = globeRadius * Math.sin(phi) * Math.cos(theta);
      gridDotPositions[i * 3 + 1] = globeRadius * Math.sin(phi) * Math.sin(theta);
      gridDotPositions[i * 3 + 2] = globeRadius * Math.cos(phi);
    }
    gridDotGeometry.setAttribute("position", new THREE.BufferAttribute(gridDotPositions, 3));
    const gridDotMaterial = new THREE.PointsMaterial({
      color: "#1D1D1F",
      size: 0.04,
      transparent: true,
      opacity: 0.45,
    });
    const globeDots = new THREE.Points(gridDotGeometry, gridDotMaterial);
    globeGroup.add(globeDots);

    // ==========================================
    // MODULE 2: ARCS AND COMMUNICATION CHANNELS
    // ==========================================
    // Build beautiful Bezier Arcs connecting geographic centroids on the Globe
    const arcMaterials: THREE.LineBasicMaterial[] = [];
    const arcs: THREE.Line[] = [];
    const photonTrackers: Array<{
      curve: THREE.CatmullRomCurve3;
      photon: THREE.Mesh;
      speed: number;
      progress: number;
    }> = [];

    const nodePositions = TRANS_NODES.map((n) => {
      const v = new THREE.Vector3(n.coordinates[0], n.coordinates[1], n.coordinates[2]);
      return v.normalize().multiplyScalar(globeRadius);
    });

    // Node mesh helpers
    const nodeSpheres: THREE.Mesh[] = [];
    nodePositions.forEach((pos, idx) => {
      const nodeGeo = new THREE.SphereGeometry(0.06, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? "#1D1D1F" : "#0066CC",
        transparent: true,
        opacity: 0.9,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      nodesGroup.add(nodeMesh);
      nodeSpheres.push(nodeMesh);

      // Simple ring glow for nodes
      const ringGeo = new THREE.RingGeometry(0.08, 0.12, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? "#1D1D1F" : "#0066CC",
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(0, 0, 0); // Face core
      nodesGroup.add(ringMesh);
    });

    // Create 12 interactive curves between nodes
    for (let k = 0; k < 12; k++) {
      const startIdx = k % nodePositions.length;
      const endIdx = (k * 3 + 1) % nodePositions.length;
      if (startIdx === endIdx) continue;

      const pStart = nodePositions[startIdx];
      const pEnd = nodePositions[endIdx];

      // Calculate beautiful arc stretching outwards
      const midPoint = new THREE.Vector3().addVectors(pStart, pEnd).multiplyScalar(0.5);
      const dist = pStart.distanceTo(pEnd);
      // Rise above the surface based on distance
      const midPointHeight = globeRadius + dist * 0.45;
      midPoint.normalize().multiplyScalar(midPointHeight);

      const curve = new THREE.CatmullRomCurve3([pStart, midPoint, pEnd]);
      const points = curve.getPoints(35);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);

      const lineMat = new THREE.LineBasicMaterial({
        color: k % 2 === 0 ? "#0066CC" : "#1D1D1F",
        transparent: true,
        opacity: 0.15,
        blending: THREE.NormalBlending,
      });

      const line = new THREE.Line(lineGeo, lineMat);
      pathsGroup.add(line);
      arcs.push(line);

      // Beautiful glowing photon sphere riding along the Bezier curve
      const photonGeo = new THREE.SphereGeometry(0.025, 8, 8);
      const photonMat = new THREE.MeshBasicMaterial({
        color: k % 2 === 0 ? "#0066CC" : "#1D1D1F",
      });
      const photon = new THREE.Mesh(photonGeo, photonMat);
      globeGroup.add(photon);

      photonTrackers.push({
        curve,
        photon,
        speed: 0.005 + Math.random() * 0.012,
        progress: Math.random(),
      });
    }

    // ==========================================
    // MODULE 3: CHARACTER FLOATING TYPOGRAPHY STREAM
    // ==========================================
    // Creating floating characters (representing languages flow) to fly around in space
    const glyphs = ["あ", "A", "中", "안", "ع", "Ω", "ß", "ñ", "K", "海", "G", "旅", "漢", "어", "ツ", "♥"];
    const characterObjects: Array<{
      mesh: THREE.Mesh;
      speed: number;
      orbitRad: number;
      angle: number;
      height: number;
    }> = [];

    glyphs.forEach((gl, idx) => {
      // Create dynamically textured Canvas as material to render crisp 3D alphabets
      const textCanvas = document.createElement("canvas");
      textCanvas.width = 120;
      textCanvas.height = 120;
      const ctx = textCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.fillRect(0, 0, 120, 120);
        ctx.font = "bold 64px Space Grotesk, Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // Gradient color for typography
        const gradient = ctx.createLinearGradient(0, 0, 120, 120);
        gradient.addColorStop(0, "#0066CC");
        gradient.addColorStop(1, "#1D1D1F");
        ctx.fillStyle = gradient;
        ctx.fillText(gl, 60, 60);
      }

      const canvasTex = new THREE.CanvasTexture(textCanvas);
      const textMat = new THREE.MeshBasicMaterial({
        map: canvasTex,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.MultiplyBlending,
      });

      const planeGeo = new THREE.PlaneGeometry(0.4, 0.4);
      const textMesh = new THREE.Mesh(planeGeo, textMat);

      // Spawn in wide orbit around the system for language flow section
      const angle = (idx / glyphs.length) * Math.PI * 2;
      const radius = 3.0 + Math.random() * 1.5;
      const h = (Math.random() - 0.5) * 3;

      textMesh.position.set(Math.cos(angle) * radius, h, Math.sin(angle) * radius);
      masterGroup.add(textMesh);
      characterObjects.push({
        mesh: textMesh,
        speed: 0.003 + Math.random() * 0.006,
        orbitRad: radius,
        angle: angle,
        height: h,
      });
    });

    // ==========================================
    // MODULE 4: G.TRANS COGNITIVE AI NEURAL NETWORK
    // ==========================================
    // In Scene 4, we enter a neural network core consisting of float glassmorphism nodes
    const neuralNodeCount = 28;
    const neuralNodesArray: THREE.Mesh[] = [];
    const neuralLinesArray: THREE.Line[] = [];

    const neuralNodesGroup = new THREE.Group();
    neuralGroup.add(neuralNodesGroup);

    // Spread nodes in a tight, organic cloud
    for (let i = 0; i < neuralNodeCount; i++) {
      const nGeo = new THREE.SphereGeometry(0.04, 12, 12);
      const nMat = new THREE.MeshBasicMaterial({
        color: i === 0 ? "#0066CC" : i % 3 === 0 ? "#1D1D1F" : "#71717a",
        transparent: true,
        opacity: 0, // Starts completely hidden
      });
      const node = new THREE.Mesh(nGeo, nMat);
      // Coordinate array around the center of AI Engine
      const theta = Math.random() * Math.PI * 2;
      const r = 0.5 + Math.random() * 1.5;
      const y = (Math.random() - 0.5) * 1.8;
      node.position.set(Math.cos(theta) * r, y, Math.sin(theta) * r);
      neuralNodesGroup.add(node);
      neuralNodesArray.push(node);
    }

    // Connect close neural nodes using lines
    for (let i = 0; i < neuralNodeCount; i++) {
      const pA = neuralNodesArray[i].position;
      let connections = 0;
      for (let j = i + 1; j < neuralNodeCount; j++) {
        if (connections >= 2) break;
        const pB = neuralNodesArray[j].position;
        const dist = pA.distanceTo(pB);
        if (dist < 1.0) {
          const lGeo = new THREE.BufferGeometry().setFromPoints([pA, pB]);
          const lMat = new THREE.LineBasicMaterial({
            color: "#e2e8f0",
            transparent: true,
            opacity: 0,
          });
          const line = new THREE.Line(lGeo, lMat);
          neuralNodesGroup.add(line);
          neuralLinesArray.push(line);
          connections++;
        }
      }
    }

    // ==========================================
    // MODULE 5: G.TRANS DYNAMIC LOGO EMBLEM RENDERER
    // ==========================================
    // A torus geometry to represent the convergence ring logo of scene 7
    const logoTorus = new THREE.TorusGeometry(1.2, 0.12, 16, 100);
    const logoMat = new THREE.MeshStandardMaterial({
      color: "#0066CC",
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0, // hidden initially
      emissive: "#004999",
      emissiveIntensity: 0.4,
    });
    const logoMesh = new THREE.Mesh(logoTorus, logoMat);
    logoMesh.rotation.x = Math.PI / 4;
    scene.add(logoMesh);

    // Helper: Build precise array mapping torus coordinates for morphing space particles
    const logoPositionsArray: THREE.Vector3[] = [];
    const torusPointsCount = particleCount;
    // Generate evenly spaced points on torus
    for (let i = 0; i < torusPointsCount; i++) {
      const u = (i / torusPointsCount) * Math.PI * 2;
      const v = (i % 20 / 20) * Math.PI * 2;
      const R = 1.25;
      const r = 0.12;

      const x = (R + r * Math.cos(v)) * Math.cos(u);
      const y = (R + r * Math.cos(v)) * Math.sin(u);
      const z = r * Math.sin(v);

      // Rotate mapped coordinates to fit logo display angles
      const finalVec = new THREE.Vector3(x, y, z);
      finalVec.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 4);
      logoPositionsArray.push(finalVec);
    }


    // ==========================================
    // ANIMATION CONTROL LOGIC (GSAP SCENEFALLS)
    // ==========================================
    // Watch for activeScene change and trigger beautiful smooth cinematic orbits
    let currentAnim: gsap.core.Tween | null = null;

    const transitionScene = (newScene: number) => {
      if (currentAnim) currentAnim.kill();

      // Ensure groups elements default opacities
      const timeline = gsap.timeline();

      if (newScene === 1) {
        // SCENE 1: Global Connection Spinning Wireframe Globe
        timeline.to(camera.position, { x: 0, y: 0, z: 5.0, duration: 2.2, ease: "power3.out" });
        timeline.to(globeGroup.position, { x: 0, y: 0, z: 0, duration: 1.8, ease: "power3.out" });
        timeline.to(globeGroup.scale, { x: 1, y: 1, z: 1, duration: 1.8, ease: "power4.out" });
        timeline.to(globeGroup.rotation, { x: 0.2, duration: 1.8 });
        
        // Sphere elements fully visible
        (globeWire.material as any).opacity = 0.12;
        (innerSphere.material as any).opacity = 0.35;
        (globeDots.material as any).opacity = 0.65;
        
        // Hide neural networks
        neuralNodesArray.forEach((node) => {
          timeline.to(node.material, { opacity: 0, duration: 0.5 }, 0);
        });
        neuralLinesArray.forEach((line) => {
          timeline.to(line.material, { opacity: 0, duration: 0.5 }, 0);
        });

        // Hide logo
        timeline.to(logoMesh.material, { opacity: 0, duration: 0.8 }, 0);

        // Disperse morph particles back to starry space paths
        const posAttr = particleGeometry.getAttribute("position") as THREE.BufferAttribute;
        for (let i = 0; i < particleCount; i++) {
          timeline.to(
            posAttr.array,
            {
              [i * 3]: originalPositions[i * 3],
              [i * 3 + 1]: originalPositions[i * 3 + 1],
              [i * 3 + 2]: originalPositions[i * 3 + 2],
              duration: 2.0,
              ease: "power2.out",
              onUpdate: () => {
                posAttr.needsUpdate = true;
              }
            },
            0
          );
        }

      } else if (newScene === 2) {
        // SCENE 2: Human Connections Speech, Zoom to centroid
        // Target an orbit near node coordinate in East-Asia / Americas
        timeline.to(camera.position, { x: -1.2, y: 1.0, z: 2.8, duration: 2.0, ease: "power3.inOut" });
        timeline.to(globeGroup.scale, { x: 1.05, y: 1.05, z: 1.05, duration: 2.0, ease: "power3.inOut" });
        
        (globeWire.material as any).opacity = 0.08;
        (innerSphere.material as any).opacity = 0.22;
        (globeDots.material as any).opacity = 0.85;

        // Hide logo and neural
        timeline.to(logoMesh.material, { opacity: 0, duration: 0.5 }, 0);

      } else if (newScene === 3) {
        // SCENE 3: Language Flow stream
        // Camera flies directly into characters streams vortex orbit
        timeline.to(camera.position, { x: 0, y: 0.2, z: 4.5, duration: 2.2, ease: "power2.out" });
        timeline.to(globeGroup.scale, { x: 0.15, y: 0.15, z: 0.15, duration: 2.2, ease: "power2.out" });
        timeline.to(globeGroup.position, { x: -3.5, y: -1.5, z: -2.0, duration: 2.2, ease: "power2.out" });
        
        // Characters mesh sizing bloom
        characterObjects.forEach((co) => {
          timeline.to(co.mesh.scale, { x: 1.6, y: 1.6, z: 1.6, duration: 1.0, ease: "back.out" }, 0.2);
        });

        timeline.to(logoMesh.material, { opacity: 0, duration: 0.5 }, 0);

      } else if (newScene === 4) {
        // SCENE 4: Futuristic G.Trans Neural Network AI Engine
        timeline.to(camera.position, { x: 0, y: 0, z: 3.2, duration: 2.0, ease: "power3.inOut" });
        timeline.to(globeGroup.scale, { x: 0, y: 0, z: 0, duration: 1.5, ease: "power3.in" });

        // Highlight AI Neural paths and node mesh circles
        neuralNodesArray.forEach((node, idx) => {
          timeline.to(node.material, { opacity: 0.85, duration: 1.0, ease: "power2.out" }, idx * 0.02);
        });
        neuralLinesArray.forEach((line) => {
          timeline.to(line.material, { opacity: 0.45, duration: 1.2 }, 0.5);
        });

        // Neural group spin acceleration
        timeline.to(neuralGroup.rotation, { y: Math.PI * 2, duration: 15, repeat: -1, ease: "none" }, 0);
        timeline.to(logoMesh.material, { opacity: 0, duration: 0.5 }, 0);

      } else if (newScene === 5) {
        // SCENE 5: Expand Globe Network
        timeline.to(camera.position, { x: 1.6, y: -0.8, z: 5.5, duration: 2.2, ease: "power3.out" });
        timeline.to(globeGroup.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 2.0, ease: "power3.out" });
        timeline.to(globeGroup.position, { x: 0, y: 0, z: 0, duration: 2.0 });

        // Neural items fade back elegantly
        neuralNodesArray.forEach((node) => {
          timeline.to(node.material, { opacity: 0, duration: 0.8 }, 0);
        });
        neuralLinesArray.forEach((line) => {
          timeline.to(line.material, { opacity: 0, duration: 0.8 }, 0);
        });

        timeline.to(logoMesh.material, { opacity: 0, duration: 0.5 }, 0);

      } else if (newScene === 6) {
        // SCENE 6: Simple minimalist workspace (Left Side Globe spinning)
        timeline.to(camera.position, { x: -1.2, y: 0.3, z: 3.4, duration: 2.2, ease: "power3.inOut" });
        timeline.to(globeGroup.position, { x: -1.8, y: 0, z: 0, duration: 2.2, ease: "power3.inOut" });
        timeline.to(globeGroup.scale, { x: 0.85, y: 0.85, z: 0.85, duration: 2.2, ease: "power3.inOut" });

        (globeWire.material as any).opacity = 0.05;
        (innerSphere.material as any).opacity = 0.15;
        (globeDots.material as any).opacity = 0.5;

        timeline.to(logoMesh.material, { opacity: 0, duration: 0.5 }, 0);

        // Reset morph particles positions back to starry pathways if coming from 7
        const posAttr = particleGeometry.getAttribute("position") as THREE.BufferAttribute;
        for (let i = 0; i < particleCount; i++) {
          timeline.to(
            posAttr.array,
            {
              [i * 3]: originalPositions[i * 3],
              [i * 3 + 1]: originalPositions[i * 3 + 1],
              [i * 3 + 2]: originalPositions[i * 3 + 2],
              duration: 2.0,
              ease: "power2.out",
              onUpdate: () => {
                posAttr.needsUpdate = true;
              }
            },
            0
          );
        }

      } else if (newScene === 7) {
        // SCENE 7: Final Emblem Convergence morphing stars into a perfect glowing circle Logo
        timeline.to(camera.position, { x: 0, y: 0, z: 4.0, duration: 2.5, ease: "power3.inOut" });
        timeline.to(globeGroup.scale, { x: 0, y: 0, z: 0, duration: 1.8, ease: "power3.inOut" });

        // Fade in glowing central visual mesh logo torus
        timeline.to(logoMesh.material, { opacity: 0.95, duration: 2.0, ease: "power1.inOut" }, 0.5);

        // MORPH PARTICLES into Logo Torus Outline shape
        const posAttr = particleGeometry.getAttribute("position") as THREE.BufferAttribute;
        for (let i = 0; i < particleCount; i++) {
          const lPos = logoPositionsArray[i];
          if (!lPos) continue;

          timeline.to(
            posAttr.array,
            {
              [i * 3]: lPos.x,
              [i * 3 + 1]: lPos.y,
              [i * 3 + 2]: lPos.z,
              duration: 2.5,
              ease: "power3.inOut",
              onUpdate: () => {
                posAttr.needsUpdate = true;
              }
            },
            0
          );
        }
      }
    };

    transitionScene(activeScene);

    // ==========================================
    // RENDER LOOP & REAL-TIME PROJECTIONS
    // ==========================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Implement lazy mouse parallax filter smoothing
      stateRef.current.mouseX += (stateRef.current.targetMouseX - stateRef.current.mouseX) * 0.05;
      stateRef.current.mouseY += (stateRef.current.targetMouseY - stateRef.current.mouseY) * 0.05;

      // Apply subtle parallax to the camera perspective
      if (stateRef.current.activeScene !== 7) {
        masterGroup.rotation.y = elapsedTime * 0.08 + stateRef.current.mouseX * 0.2;
        masterGroup.rotation.x = stateRef.current.mouseY * 0.1;
      } else {
        masterGroup.rotation.y = elapsedTime * 0.05;
        masterGroup.rotation.x = stateRef.current.mouseY * 0.1;
        logoMesh.rotation.z = elapsedTime * 0.2;
      }

      // 1. Globe passive rotation
      globeWire.rotation.y = elapsedTime * 0.06;
      globeDots.rotation.y = elapsedTime * 0.06;

      // 2. Animate global communication photontrackers traversing quadratic curves
      photonTrackers.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1.0) {
          p.progress = 0;
          p.speed = 0.005 + Math.random() * 0.012; // randomize speed at wrap
        }
        const point = p.curve.getPointAt(p.progress);
        p.photon.position.copy(point);

        // Adjust scale slightly for speed impulse effect
        const scale = 0.8 + Math.abs(Math.sin(p.progress * Math.PI)) * 0.5;
        p.photon.scale.set(scale, scale, scale);
      });

      // 3. Animate Space particles fluttering/waving dynamically
      if (stateRef.current.activeScene !== 7) {
        const posAttr = particleGeometry.getAttribute("position") as THREE.BufferAttribute;
        for (let i = 0; i < particleCount; i++) {
          // Slight fluid Brownian flutter wave motion
          if (stateRef.current.activeScene < 7) {
            posAttr.array[i * 3 + 1] += Math.sin(elapsedTime * 1.5 + i) * 0.0015;
          }
        }
        posAttr.needsUpdate = true;
      }

      // 4. Floating Typography Orbit mechanics in Scene 3
      characterObjects.forEach((co, idx) => {
        if (stateRef.current.activeScene === 3) {
          // Accelerate typographic motion flow
          co.angle += co.speed * 2.2;
          co.mesh.position.x = Math.cos(co.angle) * co.orbitRad;
          co.mesh.position.z = Math.sin(co.angle) * co.orbitRad;
          co.mesh.position.y = co.height + Math.sin(elapsedTime * 2 + idx) * 0.15;
          
          // Face the viewport
          co.mesh.lookAt(camera.position);
          (co.mesh.material as any).opacity = 0.75 + Math.sin(elapsedTime * 3 + idx) * 0.15;
        } else {
          // Slow passive drifting
          co.angle += co.speed * 0.4;
          co.mesh.position.x = Math.cos(co.angle) * co.orbitRad;
          co.mesh.position.z = Math.sin(co.angle) * co.orbitRad;
          co.mesh.lookAt(camera.position);
          (co.mesh.material as any).opacity = 0.25;
        }
      });

      // 5. PROJECT 3D LANGUAGE NODES TO 2D SCREEN SPACE COORDS FOR TALWIND BUBBLE PLACEMENT
      // This maps Three.js coords to HTML window coordinates flawlessly
      if (stateRef.current.activeScene === 2) {
        const updatedPoints = nodeSpheres.map((sphere, idx) => {
          const nodeData = TRANS_NODES[idx];
          const tempV = new THREE.Vector3();
          sphere.getWorldPosition(tempV);
          tempV.project(camera);

          const screenX = (tempV.x * 0.5 + 0.5) * width;
          const screenY = (-(tempV.y * 0.5) + 0.5) * height;

          // Only display bubble if in front of camera
          const isBehind = tempV.z > 1.0;

          return {
            id: idx,
            x: screenX,
            y: screenY,
            visible: !isBehind && tempV.x > -0.95 && tempV.x < 0.95 && tempV.y > -0.95 && tempV.y < 0.95,
            text: nodeData.phrase,
            translated: nodeData.translated,
            lang: nodeData.language,
          };
        });
        setProjectedPoints(updatedPoints);
      } else {
        if (projectedPoints.length > 0) {
          setProjectedPoints([]);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Handle Resizes beautifully via ResizeObserver
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Cleanup resources
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      gridDotGeometry.dispose();
      gridDotMaterial.dispose();
      logoTorus.dispose();
      logoMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-auto" />

      {/* ===============================================================
          SCENE 2 FLUID SPEECH BUBBLES OVERLAY: Rendered via projected coordinates
          =============================================================== */}
      {projectedPoints.map(
        (pt) =>
          pt.visible && (
            <div
              key={pt.id}
              className="absolute left-0 top-0 transition-opacity duration-300 pointer-events-auto"
              style={{
                transform: `translate3d(${pt.x}px, ${pt.y}px, 0) translate(-50%, -100%)`,
                marginTop: "-20px",
              }}
            >
              <div className="relative group select-none">
                {/* Visual pulse signal */}
                <div className="absolute top-[100%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500/25 animate-ping" />
                <div className="absolute top-[100%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-600" />

                {/* Speech balloon glass container */}
                <div className="px-3.5 py-2 rounded-xl backdrop-filter backdrop-blur-md bg-white/80 border border-black/[0.08] shadow-lg text-slate-800 flex flex-col items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-blue-600 font-mono">
                      {pt.lang}
                    </span>
                  </div>
                  <span className="text-sm font-semibold tracking-tight text-slate-900 mt-0.5 whitespace-nowrap">
                    {pt.text}
                  </span>
                  
                  {/* Real-time Dynamic translation transition flow */}
                  <div className="text-slate-300 mt-1 mb-1 text-[10px]">↓</div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50/50 px-2.5 py-0.5 rounded-lg whitespace-nowrap animate-pulse">
                    {pt.translated}
                  </span>
                </div>
              </div>
            </div>
          )
      )}
    </div>
  );
}
