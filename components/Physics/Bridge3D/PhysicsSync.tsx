import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Matter from 'matter-js';

type PhysicsSyncProps = {
  matterBody: Matter.Body | undefined;
  children: React.ReactElement;
  z?: number;
  offset?: [number, number, number];
  rotationOffset?: [number, number, number];
  scale?: [number, number, number];
};

/**
 * PhysicsSync
 * Đồng bộ vị trí và góc xoay từ Matter.Body (2D) sang Three.js Mesh (3D) mỗi frame.
 */
export const PhysicsSync: React.FC<PhysicsSyncProps> = ({ 
    matterBody, 
    children, 
    z = 0,
    offset = [0,0,0], 
    rotationOffset = [0,0,0], 
    scale=[1,1,1]
}) => {
  const groupRef = useRef<THREE.Group | null>(null);

  useFrame(() => {
    const body = matterBody;
    const group = groupRef.current;
    if (!body || !group) return;

    // Matter.js: Y tăng dần xuống dưới. Three.js: Y tăng dần lên trên.
    // Đảo ngược Y khi render.
    group.position.set(body.position.x, -body.position.y, z);

    // Matter angle: xoay quanh Z.
    group.rotation.z = -body.angle;
  }, 1); 

  return (
    <group ref={groupRef}>
        <group position={new THREE.Vector3(...offset)} rotation={new THREE.Euler(...rotationOffset)} scale={new THREE.Vector3(...scale)}>
            {children}
        </group>
    </group>
  );
};

export default PhysicsSync;