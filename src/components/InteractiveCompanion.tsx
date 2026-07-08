import { Bounds, OrbitControls, useAnimations, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import React, { useEffect, useRef, Component, ErrorInfo, ReactNode } from 'react';
import { Box3, Vector3 } from 'three';

// Error boundary to catch glTF loading failures (e.g. 404 missing assets)
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("R3F loading error caught by boundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// This component loads the GLB file and plays an animation
function DragonModel({ url = "/images/dragons/baby_dragon.glb" }) {
  const group = useRef<any>();
  // useGLTF automatically caches the model!
  const { scene, animations } = useGLTF(url);
  
  // Extract animations from the GLB file
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (scene) {
      const box = new Box3().setFromObject(scene);
      const center = new Vector3();
      box.getCenter(center);
      scene.position.set(-center.x, -center.y, -center.z);
    }
  }, [scene, url]);

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

  // Spin the model smoothly on its own vertical axis (axial rotation)
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.5; // constant speed rotation
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

interface InteractiveCompanionProps {
  scale?: number;
  url?: string;
  fallbackImage?: string;
}

export default function InteractiveCompanion({ 
  scale = 1, 
  url = "/images/dragons/baby_dragon.glb",
  fallbackImage = "/images/dragons/baby.png"
}: InteractiveCompanionProps) {
  const fallbackEl = (
    <img 
      src={fallbackImage} 
      alt="Dragon Stage Fallback" 
      className="w-full h-full object-cover rounded-full select-none pointer-events-none"
    />
  );

  // Since <Bounds> auto-fits the camera, we adjust the margin prop to control the actual visual zoom/scale
  const margin = 1.3 / scale;

  return (
    <ErrorBoundary fallback={fallbackEl}>
      <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden rounded-full">
        <Canvas shadows camera={{ position: [0, 1.5, 4], fov: 10 }}>
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
            <Bounds fit clip observe margin={margin}>
              <group scale={scale}>
                <DragonModel url={url} />
              </group>
            </Bounds>
          </React.Suspense>
        </Canvas>
      </div>
    </ErrorBoundary>
  );
}
