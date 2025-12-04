import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Matter from 'matter-js';
import { MaterialType } from '../Materials';

type BridgeBeamProps = {
  constraint?: any; 
  startBody: Matter.Body;
  endBody: Matter.Body;
  material: MaterialType;
  z?: number;
};

/**
 * BridgeBeam
 * Render một thanh nối (Box) giữa 2 body.
 * Scale chiều dài (Y) theo khoảng cách thực tế giữa 2 điểm.
 */
export const BridgeBeam: React.FC<BridgeBeamProps> = ({
  constraint,
  startBody,
  endBody,
  material,
  z = 0,
}) => {
  const meshRef = useRef<THREE.Mesh | null>(null);

  // Reuse vectors để tối ưu GC
  const tmpStart = useMemo(() => new THREE.Vector3(), []);
  const tmpEnd = useMemo(() => new THREE.Vector3(), []);
  const tmpDir = useMemo(() => new THREE.Vector3(), []);
  const Y_AXIS = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  // Tính màu dựa trên độ căng (stress)
  const color = useMemo(() => {
    const stress = constraint?.render?.stressRatio ?? 0;
    // Nếu stress > 5%, chuyển dần từ xanh -> đỏ
    if (typeof stress === 'number' && stress > 0.05) {
      const hue = Math.max(0, Math.min(120, (1 - stress) * 120));
      return `hsl(${hue}, 90%, 50%)`;
    }
    return material.renderColor;
  }, [constraint?.render?.stressRatio, material.renderColor]);

  // Kích thước hình học
  const thickness = material.type === 'road' ? 12 : (material.type === 'cable' ? 3 : 8);
  const depth = material.type === 'road' ? 40 : 8;

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh || !startBody || !endBody) return;

    tmpStart.set(startBody.position.x, -startBody.position.y, z);
    tmpEnd.set(endBody.position.x, -endBody.position.y, z);

    tmpDir.copy(tmpEnd).sub(tmpStart);
    const distance = tmpDir.length();
    if (distance === 0) return;

    const center = tmpStart.clone().add(tmpDir.clone().multiplyScalar(0.5));

    // Đặt vị trí vào trung điểm
    mesh.position.copy(center);

    // Scale mesh theo khoảng cách (Geometry gốc cao 1 đơn vị)
    mesh.scale.set(1, distance, 1);

    // Xoay mesh theo hướng vector
    mesh.quaternion.setFromUnitVectors(Y_AXIS, tmpDir.normalize());
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[thickness, 1, depth]} />
      <meshStandardMaterial 
        color={color} 
        metalness={material.metalness || 0.1} 
        roughness={material.roughness || 0.8} 
      />
    </mesh>
  );
};

export default BridgeBeam;