import React from 'react';
import { Box, Plane } from '@react-three/drei';
import { LEVEL_CONSTANTS } from '../BridgeStore';

/**
 * TerrainMesh
 * Procedural implementation to ensure stability without external assets.
 * Renders cliffs, decorative trees, and water.
 */
export const TerrainMesh: React.FC = () => {
  const cliffY = -LEVEL_CONSTANTS.CLIFF_Y;
  
  return (
    <group>
        {/* --- Left Cliff (Start Point) --- */}
        <group position={[LEVEL_CONSTANTS.CLIFF_WIDTH/2, cliffY, 0]}>
            {/* Main Cliff Block */}
            <Box args={[LEVEL_CONSTANTS.CLIFF_WIDTH, 1200, 400]} position={[0, -200, 0]}>
                <meshStandardMaterial color="#334155" roughness={0.9} />
            </Box>
            
            {/* Decorative Trees (Simple Cones) */}
            <group position={[0, 400, 0]}>
                <mesh position={[0, 40, 80]}>
                    <coneGeometry args={[20, 80, 8]} />
                    <meshStandardMaterial color="#166534" />
                </mesh>
                <mesh position={[0, 10, 80]}>
                    <cylinderGeometry args={[5, 5, 20]} />
                    <meshStandardMaterial color="#3f2c20" />
                </mesh>

                <mesh position={[-50, 30, -80]}>
                    <coneGeometry args={[15, 60, 8]} />
                    <meshStandardMaterial color="#15803d" />
                </mesh>
                 <mesh position={[-50, 0, -80]}>
                    <cylinderGeometry args={[4, 4, 15]} />
                    <meshStandardMaterial color="#3f2c20" />
                </mesh>
            </group>
        </group>
        
        {/* --- Right Cliff (End Point) --- */}
        <group position={[LEVEL_CONSTANTS.WORLD_WIDTH - LEVEL_CONSTANTS.CLIFF_WIDTH/2, cliffY, 0]}>
            <Box args={[LEVEL_CONSTANTS.CLIFF_WIDTH, 1200, 400]} position={[0, -200, 0]}>
                <meshStandardMaterial color="#334155" roughness={0.9} />
            </Box>

            <group position={[0, 400, 0]}>
                 <mesh position={[50, 45, -50]}>
                    <coneGeometry args={[22, 90, 8]} />
                    <meshStandardMaterial color="#14532d" />
                </mesh>
                <mesh position={[50, 10, -50]}>
                    <cylinderGeometry args={[6, 6, 20]} />
                    <meshStandardMaterial color="#3f2c20" />
                </mesh>
            </group>
        </group>

        {/* --- Water --- */}
        <mesh position={[LEVEL_CONSTANTS.WORLD_WIDTH/2, cliffY - 600, 0]} rotation={[-Math.PI/2, 0, 0]}>
             <planeGeometry args={[LEVEL_CONSTANTS.GAP_WIDTH + 800, 1000]} />
             <meshStandardMaterial 
                color="#0ea5e9" 
                transparent 
                opacity={0.7} 
                metalness={0.8} 
                roughness={0.2}
             />
        </mesh>
        
        {/* --- Abyss Background --- */}
        <Plane args={[20000, 20000]} position={[LEVEL_CONSTANTS.WORLD_WIDTH/2, cliffY - 800, -500]} rotation={[-Math.PI/2, 0, 0]}>
            <meshStandardMaterial color="#0f172a" />
        </Plane>
    </group>
  );
};

export default TerrainMesh;