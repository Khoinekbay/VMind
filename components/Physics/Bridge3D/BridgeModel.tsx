import React, { useEffect, useMemo, useState } from 'react';
import { useGLTF } from '@react-three/drei';

const DEFAULT_MODEL_PATH = '/models/custom_bridge.glb';
const LEVEL_OFFSET = 300;

type BridgeModelProps = {
  path?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  fallback?: React.ReactNode;
};

const ProceduralBridgeFallback = () => (
  <group>
    <mesh position={[0, -LEVEL_OFFSET, 0]}>
      <boxGeometry args={[400, 40, 200]} />
      <meshStandardMaterial color="#475569" metalness={0.2} roughness={0.8} />
    </mesh>
    <mesh position={[-250, -LEVEL_OFFSET + 180, 0]}>
      <cylinderGeometry args={[60, 80, 400, 12]} />
      <meshStandardMaterial color="#334155" roughness={0.9} />
    </mesh>
    <mesh position={[250, -LEVEL_OFFSET + 180, 0]}>
      <cylinderGeometry args={[60, 80, 400, 12]} />
      <meshStandardMaterial color="#334155" roughness={0.9} />
    </mesh>
  </group>
);

type PrimitiveProps = BridgeModelProps & { path: string };

const GLTFPrimitive: React.FC<PrimitiveProps> = ({ path, position, rotation, scale }) => {
  const { scene } = useGLTF(path);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  return (
    <primitive
      object={cloned}
      position={position ?? [0, -LEVEL_OFFSET, 0]}
      rotation={rotation ?? [0, Math.PI, 0]}
      scale={scale ?? [50, 50, 50]}
      castShadow
      receiveShadow
    />
  );
};

export const BridgeModel: React.FC<BridgeModelProps> = ({
  path = DEFAULT_MODEL_PATH,
  fallback = <ProceduralBridgeFallback />,
  position,
  rotation,
  scale,
}) => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const verify = async () => {
      try {
        const response = await fetch(path, { method: 'HEAD' });
        if (!cancelled) setIsAvailable(response.ok);
      } catch {
        if (!cancelled) setIsAvailable(false);
      }
    };
    verify();
    return () => {
      cancelled = true;
    };
  }, [path]);

  if (isAvailable === false) {
    return <>{fallback}</>;
  }

  if (isAvailable === null) {
    return null;
  }

  return <GLTFPrimitive path={path} position={position} rotation={rotation} scale={scale} />;
};

useGLTF.preload(DEFAULT_MODEL_PATH);

export default BridgeModel;

