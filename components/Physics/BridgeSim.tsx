import React, { useEffect, useRef, useState, Suspense } from 'react';
import Matter from 'matter-js';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Sphere, Plane, useCursor } from '@react-three/drei';
import { MATERIALS, MaterialType } from './Materials';
import { useBridgeStore, LEVEL_CONSTANTS, PNode, PEdge } from './BridgeStore';
import { Play, RotateCcw, Hammer, ArrowLeft, Eraser, MousePointer2, Move, CircleDot } from 'lucide-react';
import { UserProfile } from '../../types';

// Import Modular Components
import TerrainMesh from './Bridge3D/TerrainMesh';
import BridgeBeam from './Bridge3D/BridgeBeam';
import PhysicsSync from './Bridge3D/PhysicsSync';
import BridgeModel from './Bridge3D/BridgeModel';
import createCar from './Engine/createCar';
import checkBreakage from './Engine/checkBreakage';

// New Imports (point directly to src assets to avoid missing module resolution)
import WinLossOverlay from '../../src/components/ui/WinLossOverlay';
import SaveLoadControls from '../../src/components/ui/SaveLoadControls';
import FireworksCanvas, { triggerFireworks } from '../../src/components/vfx/FireworksCanvas';
import SplashParticles, { triggerSplash } from '../../src/components/vfx/SplashParticles';
import { useSfx } from '../../src/hooks/useSfx';
import { useGameOutcome } from '../../src/hooks/useGameOutcome';

const MAX_BEAM_LENGTH = 300; 
const NODE_RADIUS = 6; 

// --- ASSET COMPONENTS ---

const Car3D = ({ engine }: { engine: Matter.Engine }) => {
    // Procedural Car implementation (Fallback if GLB missing)
    const [bodies, setBodies] = useState<{chassis: Matter.Body, wheels: Matter.Body[]} | null>(null);

    useFrame(() => {
        if (!bodies || !bodies.chassis || !engine.world.bodies.includes(bodies.chassis)) {
            const allBodies = Matter.Composite.allBodies(engine.world);
            const chassis = allBodies.find(b => b.label === 'CarChassis');
            const wheels = allBodies.filter(b => b.label === 'CarWheel');
            if (chassis && wheels.length > 0) {
                setBodies({ chassis, wheels });
            } else {
                setBodies(null);
            }
        }
    });

    if (!bodies) return null;

    return (
        <group>
            {/* Chassis */}
            <PhysicsSync matterBody={bodies.chassis}> 
                <mesh>
                    <boxGeometry args={[120, 30, 40]} />
                    <meshStandardMaterial color="#e74c3c" metalness={0.6} roughness={0.4} />
                    {/* Cabin detail */}
                    <mesh position={[30, 20, 0]}>
                        <boxGeometry args={[40, 20, 38]} />
                        <meshStandardMaterial color="#c0392b" />
                    </mesh>
                    {/* Windshield */}
                    <mesh position={[40, 20, 0]}>
                        <boxGeometry args={[22, 18, 40]} />
                        <meshStandardMaterial color="#87CEEB" metalness={0.9} roughness={0.1} />
                    </mesh>
                </mesh>
            </PhysicsSync>

            {/* Wheels */}
            {bodies.wheels.map((wheel, i) => (
                <PhysicsSync key={wheel.id} matterBody={wheel}>
                    <mesh rotation={[Math.PI/2, 0, 0]}>
                        <cylinderGeometry args={[12, 12, 10, 16]} />
                        <meshStandardMaterial color="#1e293b" />
                        {/* Rim detail */}
                        <mesh position={[0, 0.1, 0]}>
                            <cylinderGeometry args={[6, 6, 11, 8]} />
                            <meshStandardMaterial color="#94a3b8" />
                        </mesh>
                    </mesh>
                </PhysicsSync>
            ))}
        </group>
    )
}

// --- INTERACTION PLANE ---
const InteractionPlane = ({ onInteract, onMove }: { onInteract: (pt: THREE.Vector3, type: 'down' | 'up') => void, onMove: (pt: THREE.Vector3) => void }) => {
  const [hovered, setHover] = useState(false);
  useCursor(hovered); 
  return (
    <Plane 
      args={[LEVEL_CONSTANTS.WORLD_WIDTH * 2, LEVEL_CONSTANTS.WORLD_HEIGHT * 2]} 
      position={[LEVEL_CONSTANTS.WORLD_WIDTH / 2, -LEVEL_CONSTANTS.WORLD_HEIGHT / 2, 0]} 
      visible={false} 
      onPointerDown={(e) => { e.stopPropagation(); onInteract(e.point, 'down'); }}
      onPointerUp={(e) => { e.stopPropagation(); onInteract(e.point, 'up'); }}
      onPointerMove={(e) => { e.stopPropagation(); onMove(e.point); setHover(true); }}
      onPointerOut={() => setHover(false)}
    />
  );
};

// --- PREVIEW LINE COMPONENT ---
const PreviewLine = ({ startRef, endRef, color }: { startRef: React.MutableRefObject<PNode | null>, endRef: React.MutableRefObject<THREE.Vector3>, color: string }) => {
  const lineRef = useRef<THREE.Line>(null);
  useFrame(() => {
     if (lineRef.current) {
        if (startRef.current) {
            const positions = lineRef.current.geometry.attributes.position.array as Float32Array;
            positions[0] = startRef.current.x;
            positions[1] = -startRef.current.y;
            positions[2] = 0;
            positions[3] = endRef.current.x;
            positions[4] = endRef.current.y;
            positions[5] = 0;
            lineRef.current.geometry.attributes.position.needsUpdate = true;
            lineRef.current.visible = true;
        } else {
            lineRef.current.visible = false;
        }
     }
  });
  return (
    <line ref={lineRef as any}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={2} array={new Float32Array(6)} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color={color} />
    </line>
  )
}

// --- PROJECTOR FOR SPLASH VFX ---
const VfxProjector = ({ engineRef }: { engineRef: React.MutableRefObject<Matter.Engine | null> }) => {
    // This component helps map 3D events to screen space if needed, 
    // currently splash is handled by simple screen center fallback 
    // or we can implement full projection here.
    return null;
}

// --- MAIN PAGE ---

const BridgeSim = ({ onBack, user }: { onBack: () => void, user?: UserProfile }) => {
  const engineRef = useRef<Matter.Engine>(Matter.Engine.create());
  const runRef = useRef<any>(null);
  const worldRef = useRef(new Map<string, Matter.Body>()); 
  const currentCursorPos = useRef(new THREE.Vector3());
  const dragStartNode = useRef<PNode | null>(null);

  const { 
    nodes, edges, budget, activeTool, selectedMaterial, simulationState,
    addNode, addEdge, removeNode, setSimulationState, setTool, setMaterial
  } = useBridgeStore();

  const { play: playSfx, stop: stopSfx } = useSfx();
  const { checkOutcome, resetOutcome } = useGameOutcome({ engineRef, levelConstants: LEVEL_CONSTANTS });
  const [outcome, setOutcome] = useState<'win' | 'lose' | null>(null);

  // Initialize Engine & Level
  useEffect(() => {
    const engine = engineRef.current;
    engine.gravity.y = 1.5;
    
    Matter.World.clear(engine.world, false);
    worldRef.current.clear();

    const groundLeft = Matter.Bodies.rectangle(
        LEVEL_CONSTANTS.CLIFF_WIDTH/2, 
        LEVEL_CONSTANTS.CLIFF_Y + 500, 
        LEVEL_CONSTANTS.CLIFF_WIDTH, 
        1000, 
        { isStatic: true, label: 'Ground', friction: 1 }
    );
    const groundRight = Matter.Bodies.rectangle(
        LEVEL_CONSTANTS.WORLD_WIDTH - LEVEL_CONSTANTS.CLIFF_WIDTH/2, 
        LEVEL_CONSTANTS.CLIFF_Y + 500, 
        LEVEL_CONSTANTS.CLIFF_WIDTH, 
        1000, 
        { isStatic: true, label: 'Ground', friction: 1 }
    );
    Matter.World.add(engine.world, [groundLeft, groundRight]);

    nodes.forEach(n => {
      const b = Matter.Bodies.circle(n.x, n.y, 6, {
          isStatic: n.isAnchor,
          density: 0.05,
          friction: 0.8,
          label: 'Node',
          collisionFilter: { group: -1 } 
      });
      worldRef.current.set(n.id, b);
      Matter.World.add(engine.world, b);
    });

    edges.forEach(e => {
        const nA = worldRef.current.get(e.startNodeId);
        const nB = worldRef.current.get(e.endNodeId);
        if(!nA || !nB) return;
        const len = Math.hypot(nA.position.x - nB.position.x, nA.position.y - nB.position.y);
        
        if (e.material.type === 'road') {
             const midX = (nA.position.x + nB.position.x)/2;
             const midY = (nA.position.y + nB.position.y)/2;
             const angle = Math.atan2(nB.position.y - nA.position.y, nB.position.x - nA.position.x);
             const roadBody = Matter.Bodies.rectangle(midX, midY, len, 10, {
                 angle: angle,
                 collisionFilter: { group: Matter.Body.nextGroup(true) }, 
                 label: 'RoadPart',
                 plugin: { materialType: 'road' }
             });
             const c1 = Matter.Constraint.create({ bodyA: nA, bodyB: roadBody, pointB: {x: -len/2, y: 0}, stiffness: 1, length: 0, label: 'RoadConnection' });
             const c2 = Matter.Constraint.create({ bodyA: nB, bodyB: roadBody, pointB: {x: len/2, y: 0}, stiffness: 1, length: 0, label: 'RoadConnection' });
             Matter.World.add(engine.world, [roadBody, c1, c2]);
        } else {
            const constraint = Matter.Constraint.create({
                bodyA: nA, bodyB: nB, length: len, stiffness: e.material.stiffness, damping: 0.1,
                label: e.material.id,
                plugin: { materialType: e.material.id }
            } as any);
            Matter.World.add(engine.world, constraint);
        }
    });

    return () => {
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
    };
  }, [nodes, edges, simulationState]); 

  // Simulation Loop
  useEffect(() => {
    if (simulationState === 'running') {
        const engine = engineRef.current;
        const world = engine.world;
        resetOutcome();
        setOutcome(null);
        
        const carComposite = createCar(LEVEL_CONSTANTS.CLIFF_WIDTH / 2, LEVEL_CONSTANTS.CLIFF_Y - 50);
        Matter.World.add(world, carComposite);
        const wheels = Matter.Composite.allBodies(carComposite).filter(b => b.label === 'CarWheel');
        
        playSfx('engine', { loop: true, volume: 0.5 });

        runRef.current = setInterval(() => {
            Matter.Engine.update(engineRef.current, 1000 / 60);
            checkBreakage(engineRef.current);
            
            const chassis = Matter.Composite.allBodies(carComposite).find(b => b.label === 'CarChassis');
            if (chassis && chassis.position.y < LEVEL_CONSTANTS.CLIFF_Y + 200) {
                 wheels.forEach(w => Matter.Body.setAngularVelocity(w, 0.25));
            }

            // Check Win/Loss
            const result = checkOutcome();
            if (result) {
                setOutcome(result);
                stopSfx('engine');
                
                if (result === 'win') {
                    playSfx('win');
                    triggerFireworks();
                } else {
                    playSfx('break');
                    playSfx('splash');
                    // Simple screen center splash for now
                    triggerSplash(window.innerWidth / 2, window.innerHeight / 2);
                }
                
                // Stop physics after a short delay
                setTimeout(() => {
                    clearInterval(runRef.current);
                }, 2000);
            }
        }, 1000 / 60);
    } else {
        stopSfx('engine');
        if (runRef.current) clearInterval(runRef.current);
    }
    return () => {
        stopSfx('engine');
        clearInterval(runRef.current);
    };
  }, [simulationState, playSfx, stopSfx, checkOutcome, resetOutcome]);

  const handleInteract = (point: THREE.Vector3, type: 'down' | 'up') => {
    if (simulationState !== 'design') return;
    
    const matterX = point.x;
    const matterY = -point.y; 
    const GRID = 20;
    const x = Math.round(matterX / GRID) * GRID;
    const y = Math.round(matterY / GRID) * GRID;

    if (type === 'down') {
      playSfx('click', { volume: 0.2 });
      if (activeTool === 'eraser') {
        const target = nodes.find(n => Math.hypot(n.x - x, n.y - y) < 20);
        if (target && !target.isAnchor) {
            removeNode(target.id);
            playSfx('delete');
        }
        return;
      }
      if (activeTool === 'node') {
        const nearby = nodes.find(n => Math.hypot(n.x - x, n.y - y) < 20);
        if (!nearby && budget >= LEVEL_CONSTANTS.NODE_COST) {
           addNode({ id: `node_${Date.now()}`, x, y, isAnchor: false });
           playSfx('place');
        }
        return;
      }
      if (activeTool === 'beam') {
        const target = nodes.find(n => Math.hypot(n.x - x, n.y - y) < 20);
        if (target) dragStartNode.current = target;
      }
    } else if (type === 'up') {
      if (activeTool === 'beam' && dragStartNode.current) {
        const endNode = nodes.find(n => Math.hypot(n.x - x, n.y - y) < 20);
        if (endNode && endNode.id !== dragStartNode.current.id) {
           const dist = Math.hypot(dragStartNode.current.x - endNode.x, dragStartNode.current.y - endNode.y);
           if (dist <= MAX_BEAM_LENGTH && budget >= selectedMaterial.cost) {
             addEdge({
               id: `edge_${Date.now()}`,
               startNodeId: dragStartNode.current.id,
               endNodeId: endNode.id,
               material: selectedMaterial
             });
             playSfx('place');
           }
        }
        dragStartNode.current = null;
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#080911] text-white font-mono overflow-hidden relative">
      <FireworksCanvas />
      <SplashParticles />
      <WinLossOverlay 
        outcome={outcome} 
        onRetry={() => { setSimulationState('design'); setOutcome(null); }} 
        onSave={() => Promise.resolve()} 
      />

      <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#0F172A] z-20 flex-none">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg"><ArrowLeft size={18} /></button>
          <span className="font-bold text-cyber-neon flex items-center gap-2"><Hammer size={18} /> BridgeSim 3D</span>
        </div>
        <div className="flex bg-black/40 rounded-lg p-1 gap-1">
            <button onClick={() => setTool('pan')} title="Xoay Camera" className={`p-2 rounded ${activeTool==='pan' ? 'bg-blue-600' : 'text-gray-400'}`}><Move size={16}/></button>
            <button onClick={() => setTool('node')} title="Tạo Khớp Nối ($10)" className={`p-2 rounded ${activeTool==='node' ? 'bg-cyber-neon text-black' : 'text-gray-400'}`}><CircleDot size={16}/></button>
            <button onClick={() => setTool('beam')} title="Vẽ Thanh/Dây" className={`p-2 rounded ${activeTool==='beam' ? 'bg-cyber-neon text-black' : 'text-gray-400'}`}><MousePointer2 size={16}/></button>
            <button onClick={() => setTool('eraser')} title="Xóa" className={`p-2 rounded ${activeTool==='eraser' ? 'bg-red-500' : 'text-gray-400'}`}><Eraser size={16}/></button>
            <div className="w-px bg-white/10 mx-1"></div>
            <SaveLoadControls userId={user?.id} simId="bridge_01" />
        </div>
        <div className="flex items-center gap-4">
            <div className="text-cyber-acid font-bold">$ {budget}</div>
            <button onClick={() => setSimulationState(simulationState === 'design' ? 'running' : 'design')} 
                className={`px-4 py-1.5 rounded font-bold flex gap-2 ${simulationState === 'design' ? 'bg-cyber-neon text-black hover:bg-[#00CC80]' : 'bg-orange-500 text-white'}`}>
                {simulationState === 'design' ? <><Play size={16}/> RUN</> : <><RotateCcw size={16}/> EDIT</>}
            </button>
        </div>
      </div>

      <div className="flex flex-1 flex-row relative overflow-hidden">
        <div className="w-72 bg-[#0F172A] border-r border-white/10 p-4 flex flex-col gap-2 z-20 flex-none shadow-xl">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Vật liệu</h3>
            {Object.values(MATERIALS).map((mat: MaterialType) => (
                <button key={mat.id} onClick={() => setMaterial(mat)}
                  className={`p-3 rounded-lg border text-left transition-all ${selectedMaterial.id === mat.id ? 'bg-white/10 border-cyber-neon' : 'bg-black/20 border-transparent hover:bg-white/5'}`}>
                  <div className="flex justify-between items-center mb-1">
                      <div className="font-bold text-sm text-white">{mat.name}</div>
                      <div className="text-xs text-cyber-acid font-mono">${mat.cost}/m</div>
                  </div>
                  <div className="text-[10px] text-gray-500 mb-2">Độ bền: {mat.strength}px</div>
                  <div className="h-1.5 w-full rounded-full" style={{ background: mat.renderColor }}></div>
                </button>
            ))}
        </div>

        <div className="flex-1 relative bg-slate-900">
          <Canvas
            shadows
            camera={{ position: [LEVEL_CONSTANTS.WORLD_WIDTH/2, -LEVEL_CONSTANTS.WORLD_HEIGHT/2, 2000], fov: 35, near: 10, far: 10000 }}
            className="w-full h-full"
            frameloop={simulationState === 'running' ? 'always' : 'demand'}
          >
            <color attach="background" args={['#0F172A']} />
            <fog attach="fog" args={['#0F172A', 1500, 5000]} />
            <ambientLight intensity={0.6} />
            <directionalLight position={[1000, 2000, 1000]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
            <Environment preset="city" />
            <OrbitControls 
              makeDefault 
              enabled={activeTool === 'pan'} 
              target={[LEVEL_CONSTANTS.WORLD_WIDTH/2, -LEVEL_CONSTANTS.CLIFF_Y, 0]}
              maxPolarAngle={Math.PI / 2 - 0.05}
              minDistance={200}
              maxDistance={4000}
            />
            <InteractionPlane onInteract={handleInteract} onMove={(pt) => currentCursorPos.current.copy(pt)} />
            <Suspense fallback={null}>
                <TerrainMesh />
                <BridgeModel />
                {simulationState === 'running' && <Car3D engine={engineRef.current} />}
            </Suspense>
            <group>
              {nodes.map(node => {
                const body = worldRef.current.get(node.id);
                const pos = (simulationState === 'running' && body) 
                    ? new THREE.Vector3(body.position.x, -body.position.y, 0)
                    : new THREE.Vector3(node.x, -node.y, 0);
                return (
                  <Sphere key={node.id} position={pos} args={[NODE_RADIUS, 16, 16]} castShadow>
                     <meshStandardMaterial color={node.isAnchor ? '#FCEE0C' : '#ffffff'} metalness={0.8} roughness={0.2} />
                  </Sphere>
                );
              })}
              {edges.map(edge => {
                const n1 = nodes.find(n => n.id === edge.startNodeId);
                const n2 = nodes.find(n => n.id === edge.endNodeId);
                if (!n1 || !n2) return null;
                const b1 = worldRef.current.get(n1.id);
                const b2 = worldRef.current.get(n2.id);
                const constraint = simulationState === 'running' 
                    ? Matter.Composite.allConstraints(engineRef.current.world).find(c => c.label === edge.material.id && (
                        (c.bodyA === b1 && c.bodyB === b2) || (c.bodyA === b2 && c.bodyB === b1)
                    ))
                    : undefined;
                if (simulationState === 'running' && !constraint && edge.material.type !== 'road') {
                    return null;
                }
                return (
                    <BridgeBeam 
                        key={edge.id} 
                        startBody={b1 || { position: { x: n1.x, y: n1.y } } as any} 
                        endBody={b2 || { position: { x: n2.x, y: n2.y } } as any} 
                        material={edge.material}
                        constraint={constraint}
                    />
                );
              })}
            </group>
            <PreviewLine startRef={dragStartNode} endRef={currentCursorPos} color={activeTool === 'beam' ? selectedMaterial.renderColor : '#fff'} />
            <VfxProjector engineRef={engineRef} />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default BridgeSim;