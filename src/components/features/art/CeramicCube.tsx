import { useRef, Suspense } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { TrackballControls } from '@react-three/drei';
import * as THREE from 'three';

const CUBE_SIZE = 3;
const TEXTURE_PATHS = Array.from({ length: 6 }, (_, i) => `/textures/${i + 1}.avif`);
const ROTATION = { y: 0.25, x: 0.1 } as const;

const Cube = ({ isDragging }: { isDragging: React.RefObject<boolean> }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current || isDragging.current) return;
    meshRef.current.rotation.y += delta * ROTATION.y;
    meshRef.current.rotation.x += delta * ROTATION.x;
  });

  const textures = useLoader(THREE.TextureLoader, TEXTURE_PATHS);
  textures.forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.generateMipmaps = true;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
      {textures.map((texture, i) => (
        <meshStandardMaterial key={i} attach={`material-${i}`} map={texture} roughness={0.15} metalness={0.05} />
      ))}
    </mesh>
  );
};

const wireframeFallback = (
  <mesh>
    <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
    <meshStandardMaterial color="#e5e5e5" wireframe />
  </mesh>
);

export default function CeramicCube() {
  const isDragging = useRef(false);

  return (
    <div
      className="w-full aspect-square rounded-xl overflow-hidden border border-border shadow-sm cursor-grab active:cursor-grabbing bg-gradient-to-br from-amber-100 via-orange-100 to-stone-200"
    >
      <Canvas camera={{ position: [5, 4, 5], fov: 45 }} gl={{ alpha: true }}>
        <Suspense fallback={wireframeFallback}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <directionalLight position={[-10, 10, -5]} intensity={0.5} />
          <Cube isDragging={isDragging} />
          <TrackballControls
            noPan
            noZoom={false}
            rotateSpeed={3}
            dynamicDampingFactor={0.4}
            onStart={() => { isDragging.current = true; }}
            onEnd={() => { isDragging.current = false; }}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}