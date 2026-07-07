import { Bounds, Center, ContactShadows, OrbitControls, useAnimations, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';

// This component loads the GLB file and plays an animation
function DragonModel({ url = "/images/dragons/cute_dragon.glb" }) {
  const group = useRef<any>();
  // useGLTF automatically caches the model!
  const { scene, animations } = useGLTF(url);
  
  // Extract animations from the GLB file
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (names.length > 0) {
      // Fox has "Survey" (0), "Walk" (1), "Run" (2)
      // Let's play the first animation (Idle/Survey)
      const action = actions[names[0]];
      if (action) {
        action.reset().fadeIn(0.5).play();
      }
    }
  }, [actions, names]);

  return (
    <group ref={group} dispose={null}>
      {/* We removed the manual scaling so the Bounds component can auto-scale it! */}
      <primitive object={scene} />
    </group>
  );
}

interface InteractiveCompanionProps {
  scale?: number;
}

export default function InteractiveCompanion({ scale = 1 }: InteractiveCompanionProps) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas shadows camera={{ position: [0, 1.5, 4], fov: 45 }}>
        {/* Allows the child to spin the model with their finger! */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate
          autoRotateSpeed={1.5}
        />
        
        {/* Beautiful lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <directionalLight position={[-10, 10, -5]} intensity={0.5} color="#57fae9" />
        
        <React.Suspense fallback={null}>
          <Bounds fit clip observe margin={0.7}>
            <Center>
              <group scale={scale}>
                <DragonModel />
              </group>
            </Center>
          </Bounds>
          {/* A cool shadow underneath the model */}
          <ContactShadows resolution={512} scale={10} blur={2} opacity={0.4} far={10} color="#141779" position={[0, -1.5, 0]} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
