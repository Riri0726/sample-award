import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Text, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Award Model Component
function AwardModel({ currentAward }) {
  const groupRef = useRef();
  const targetRotation = currentAward.angle;
  const [currentRotation, setCurrentRotation] = useState(0);
  const [cumulativeRotation, setCumulativeRotation] = useState(0);
  const prevSlideRef = useRef(0);
  
  // Try to load the GLB model
  const { scene: gltfScene, error } = useGLTF('/award.glb', true);
  const [useGltf, setUseGltf] = useState(true);
  
  // Handle loading error - use fallback model
  useEffect(() => {
    if (error) {
      console.warn('Failed to load award.glb, using fallback model:', error);
      setUseGltf(false);
    } else if (gltfScene) {
      console.log('Successfully loaded award.glb');
      setUseGltf(true);
    }
  }, [error, gltfScene]);

  // Update cumulative rotation when slide changes
  useEffect(() => {
    const currentSlide = currentAward.id;
    const prevSlide = prevSlideRef.current;
    
    // Calculate the step between slides
    const totalSlides = 5; // You can make this dynamic later
    const stepAngle = (Math.PI * 2) / totalSlides;
    
    // Always rotate forward (clockwise)
    const rotationStep = stepAngle;
    setCumulativeRotation(prev => prev + rotationStep);
    
    prevSlideRef.current = currentSlide;
  }, [currentAward.id]);
  
  // Animation loop
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Smooth interpolation towards cumulative rotation
    const rotationDiff = cumulativeRotation - currentRotation;
    
    // Smooth interpolation - always forward
    const newRotation = currentRotation + rotationDiff * 0.08;
    setCurrentRotation(newRotation);
    groupRef.current.rotation.y = newRotation;
    
    // Gentle floating animation
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });
  
  // Fallback Trophy Component
  const FallbackTrophy = () => (
    <group ref={groupRef} position={[0, 0, 0]} scale={1.5}>
      {/* Trophy cup */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.6, 1.2, 8]} />
        <meshStandardMaterial 
          color="#ffd700" 
          metalness={0.9} 
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Trophy base */}
      <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 0.3, 8]} />
        <meshStandardMaterial 
          color="#2c1810" 
          metalness={0.3} 
          roughness={0.7 }
        />
      </mesh>
      
      {/* Left handle */}
      <mesh position={[-0.9, 0.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.3, 0.05, 8, 16, Math.PI]} />
        <meshStandardMaterial 
          color="#ffd700" 
          metalness={0.9} 
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Right handle */}
      <mesh position={[0.9, 0.6, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <torusGeometry args={[0.3, 0.05, 8, 16, Math.PI]} />
        <meshStandardMaterial 
          color="#ffd700" 
          metalness={0.9} 
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Award text on base */}
      <Text
        position={[0, -0.05, 1.1]}
        rotation={[0, 0, 0]}
        fontSize={0.12}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Arial-Bold.ttf"
      >
        VALACE
      </Text>
    </group>
  );
  
  // GLB Model Component
  const GltfModel = () => {
    const modelRef = useRef();
    
    useEffect(() => {
      if (gltfScene && modelRef.current) {
        // Enable shadows for all meshes
        gltfScene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
      }
    }, [gltfScene]);
    
    return (
      <group ref={groupRef} position={[0, 0, 0]} scale={1.5}>
        <primitive ref={modelRef} object={gltfScene} />
      </group>
    );
  };
  
  return useGltf && gltfScene ? <GltfModel /> : <FallbackTrophy />;
}

// Lighting Setup Component
function Lighting() {
  return (
    <>
      {/* Environment for realistic reflections */}
      <Environment preset="city" />
      
      {/* Ambient light */}
      <ambientLight intensity={0.3} />
      
      {/* Main directional light */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill light from the side */}
      <directionalLight 
        position={[-3, 3, 2]} 
        intensity={0.4} 
        color="#87ceeb" 
      />
      
      {/* Spot light for dramatic effect */}
      <spotLight
        position={[0, 8, 0]}
        intensity={0.5}
        angle={Math.PI / 6}
        penumbra={0.5}
        castShadow
      />
      
      {/* Ground plane for shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
    </>
  );
}

// Particles background effect
function Particles() {
  const particlesRef = useRef();
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });
  
  const particlePositions = React.useMemo(() => {
    const positions = [];
    for (let i = 0; i < 50; i++) {
      positions.push([
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ]);
    }
    return positions;
  }, []);
  
  return (
    <group ref={particlesRef}>
      {particlePositions.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[0.02, 4, 4]} />
          <meshBasicMaterial color="#1e40af" opacity={0.3} transparent />
        </mesh>
      ))}
    </group>
  );
}

// Main AwardViewer Component
function AwardViewer({ currentSlide, currentAward }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [3, 2, 5], fov: 50 }}
        shadows
        style={{ width: '100%', height: '100%' }}
      >
        {/* Scene background */}
        <color attach="background" args={['#f8fafc']} />
        
        {/* Lighting */}
        <Lighting />
        
        {/* Particle effects */}
        <Particles />
        
        {/* Award Model */}
        <AwardModel currentAward={currentAward} />
        
        {/* Camera Controls */}
        <OrbitControls
          target={[0, 0, 0]}
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI * 0.75}
          minPolarAngle={Math.PI * 0.25}
          minDistance={3}
          maxDistance={12}
          enablePan={false}
        />
      </Canvas>
      
      {/* Trophy info overlay */}
      <div className="trophy-info">
        <h3>{currentAward.title}</h3>
        <p>Award {currentSlide + 1} of 5 • 2024</p>
      </div>
    </div>
  );
}

export default AwardViewer;
