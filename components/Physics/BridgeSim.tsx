
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';
import { MATERIALS, MaterialType } from './Materials';
import { useBridgeStore, LEVEL_CONSTANTS, PNode, PEdge } from './BridgeStore';
import { Play, RotateCcw, Truck, Hammer, AlertTriangle, ArrowLeft, Eraser, MousePointer2, Save, Loader2, Move, Grid3X3, ZoomIn, CircleDot } from 'lucide-react';
import { UserProfile } from '../../types';
import { supabase } from '../../lib/supabase';

const SIMULATION_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
// Define world boundaries for camera clamping
const WORLD_HEIGHT = 2000; 
// TDD: Max length for stability to prevent "jittering"
const MAX_BEAM_LENGTH = 300; 

interface BridgeSimProps {
  onBack: () => void;
  user?: UserProfile;
}

const BridgeSim = ({ onBack, user }: BridgeSimProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const staticCanvasRef = useRef<HTMLCanvasElement>(null);
  const dynamicCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Physics Initialization
  const engineRef = useRef<Matter.Engine | null>(null);
  const animationFrameRef = useRef<number>(0);
  const simIntervalRef = useRef<any>(null);
  
  // Interaction Refs
  const isDraggingCamera = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const dragStartNode = useRef<PNode | null>(null);
  const currentCursorPos = useRef({ x: 0, y: 0 });

  // Zustand
  const { 
    setNodes, setEdges, addNode, addEdge, removeNode, setBudget,
    setMaterial, setTool, setSimulationState, setCamera, 
    budget, selectedMaterial, activeTool, simulationState, camera, nodes
  } = useBridgeStore();

  const [isSaving, setIsSaving] = useState(false);

  // --- UTILS ---
  const getDPR = () => typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  const screenToWorld = (sx: number, sy: number) => {
    const cam = useBridgeStore.getState().camera;
    return {
      x: (sx - cam.x) / cam.scale,
      y: (sy - cam.y) / cam.scale
    };
  };

  const snapToGrid = (wx: number, wy: number) => {
    const GRID = 20; // TDD: 20px grid
    return {
      x: Math.round(wx / GRID) * GRID,
      y: Math.round(wy / GRID) * GRID
    };
  };

  // --- CAMERA LOGIC ---
  const clampCamera = useCallback((x: number, y: number, scale: number) => {
    if (!containerRef.current) return { x, y, scale };
    
    const viewW = containerRef.current.clientWidth;
    const viewH = containerRef.current.clientHeight;

    const minScaleX = viewW / LEVEL_CONSTANTS.WORLD_WIDTH;
    const minScale = Math.max(0.3, Math.min(minScaleX, 2)); 
    const constrainedScale = Math.max(minScale, Math.min(scale, 3)); 

    const contentW = LEVEL_CONSTANTS.WORLD_WIDTH * constrainedScale;
    const contentH = WORLD_HEIGHT * constrainedScale;

    const minX = viewW - contentW; 
    const maxX = 0; 
    
    const constrainedX = contentW < viewW 
        ? (viewW - contentW) / 2 
        : Math.max(minX, Math.min(maxX, x));

    const minY = viewH - contentH;
    const maxY = 100; 
    
    const constrainedY = contentH < viewH
        ? (viewH - contentH) / 2
        : Math.max(minY, Math.min(maxY, y));

    return { x: constrainedX, y: constrainedY, scale: constrainedScale };
  }, []);

  // --- LIFECYCLE ---
  useEffect(() => {
    if (!engineRef.current) {
        engineRef.current = Matter.Engine.create();
    }

    if (containerRef.current) {
        const { x, y, scale } = clampCamera(0, 0, 0.6); 
        setCamera({ x, y, scale });
    }

    if (user) {
        supabase.from('user_progress')
        .select('current_state')
        .eq('user_id', user.id)
        .eq('simulation_id', SIMULATION_ID)
        .single()
        .then(({ data }) => {
            if (data?.current_state) {
                const loaded = data.current_state as any;
                if (loaded.nodes && loaded.edges) {
                    setNodes(loaded.nodes);
                    setEdges(loaded.edges);
                    if (loaded.budget) setBudget(loaded.budget);
                }
            }
        });
    }

    const handleResize = () => {
        if (!containerRef.current || !staticCanvasRef.current || !dynamicCanvasRef.current) return;
        
        const { clientWidth, clientHeight } = containerRef.current;
        const dpr = getDPR();

        [staticCanvasRef.current, dynamicCanvasRef.current].forEach(canvas => {
            canvas.width = clientWidth * dpr;
            canvas.height = clientHeight * dpr;
            canvas.style.width = `${clientWidth}px`;
            canvas.style.height = `${clientHeight}px`;
            canvas.getContext('2d')?.scale(dpr, dpr);
        });
        
        const currentCam = useBridgeStore.getState().camera;
        const clamped = clampCamera(currentCam.x, currentCam.y, currentCam.scale);
        setCamera(clamped);

        drawStaticLayer(); 
    };
    
    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 100); 

    return () => {
        window.removeEventListener('resize', handleResize);
        if (simIntervalRef.current) clearInterval(simIntervalRef.current);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (engineRef.current) {
            Matter.World.clear(engineRef.current.world, false);
            Matter.Engine.clear(engineRef.current);
        }
    };
  }, [clampCamera]);

  const handleSave = async () => {
      if (!user) { alert("Vui lòng đăng nhập!"); return; }
      setIsSaving(true);
      try {
          const state = useBridgeStore.getState();
          const { error } = await supabase.from('user_progress').upsert({
              user_id: user.id,
              simulation_id: SIMULATION_ID,
              current_state: { nodes: state.nodes, edges: state.edges, budget: state.budget },
              last_played_at: new Date()
          }, { onConflict: 'user_id,simulation_id' });
          if (error) throw error;
          alert("Đã lưu thiết kế!");
      } catch (e: any) {
          alert("Lỗi: " + e.message);
      } finally { setIsSaving(false); }
  };

  // --- RENDER LOOP ---
  const drawStaticLayer = () => {
      const ctx = staticCanvasRef.current?.getContext('2d');
      if (!ctx || !containerRef.current) return;
      
      const { camera } = useBridgeStore.getState();
      const dpr = getDPR();
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); 
      ctx.clearRect(0, 0, width, height);
      
      ctx.translate(camera.x, camera.y);
      ctx.scale(camera.scale, camera.scale);
      
      drawGrid(ctx);
      drawTerrain(ctx);
  };

  useEffect(() => { drawStaticLayer(); }, [camera]);

  useEffect(() => {
    const loop = () => {
        const ctx = dynamicCanvasRef.current?.getContext('2d');
        if (!ctx || !containerRef.current) return;

        const state = useBridgeStore.getState();
        const dpr = getDPR();
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);
        
        ctx.translate(state.camera.x, state.camera.y);
        ctx.scale(state.camera.scale, state.camera.scale);

        if (state.simulationState === 'design') {
            drawBlueprint(ctx, state);
            drawInteraction(ctx); 
        } else {
            drawSimulation(ctx);
        }

        animationFrameRef.current = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, []);

  // --- DRAWING HELPERS ---
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = '#334155';
      const GRID = 20; 
      for(let x=0; x<=LEVEL_CONSTANTS.WORLD_WIDTH; x+=GRID*2) {
          for(let y=0; y<=WORLD_HEIGHT; y+=GRID*2) { 
              ctx.beginPath();
              ctx.arc(x, y, 1.5, 0, Math.PI*2);
              ctx.fill();
          }
      }
  };

  const drawTerrain = (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(0, LEVEL_CONSTANTS.CLIFF_Y, LEVEL_CONSTANTS.CLIFF_WIDTH, 1000);
      ctx.fillRect(LEVEL_CONSTANTS.WORLD_WIDTH - LEVEL_CONSTANTS.CLIFF_WIDTH, LEVEL_CONSTANTS.CLIFF_Y, LEVEL_CONSTANTS.CLIFF_WIDTH, 1000);
      ctx.fillStyle = '#0ea5e940';
      ctx.fillRect(LEVEL_CONSTANTS.CLIFF_WIDTH, LEVEL_CONSTANTS.CLIFF_Y + 200, LEVEL_CONSTANTS.GAP_WIDTH, 800);
      // Flag
      const fx = LEVEL_CONSTANTS.WORLD_WIDTH - LEVEL_CONSTANTS.CLIFF_WIDTH + 50;
      const fy = LEVEL_CONSTANTS.CLIFF_Y;
      ctx.fillStyle = '#10B981';
      ctx.fillRect(fx, fy-60, 4, 60);
      ctx.beginPath(); ctx.moveTo(fx+4, fy-60); ctx.lineTo(fx+40, fy-45); ctx.lineTo(fx+4, fy-30); ctx.fill();
  };

  const drawBlueprint = (ctx: CanvasRenderingContext2D, state: any) => {
      // Edges (Beams)
      state.edges.forEach((e: PEdge) => {
          const n1 = state.nodes.find((n: PNode) => n.id === e.startNodeId);
          const n2 = state.nodes.find((n: PNode) => n.id === e.endNodeId);
          if(!n1 || !n2) return;
          
          const angle = Math.atan2(n2.y - n1.y, n2.x - n1.x);
          const len = Math.hypot(n2.x - n1.x, n2.y - n1.y);
          
          ctx.save();
          ctx.translate(n1.x, n1.y);
          ctx.rotate(angle);
          
          if (e.material.type === 'road') {
              ctx.fillStyle = e.material.renderColor;
              ctx.fillRect(0, -6, len, 12); 
              ctx.fillStyle = '#ffffff30';
              ctx.fillRect(0, -6, len, 4); // Line marking
          } else {
              // Beams/Supports
              ctx.fillStyle = e.material.renderColor;
              ctx.fillRect(0, -4, len, 8); // Thinner than road
              
              // Detail
              ctx.fillStyle = '#00000030';
              ctx.fillRect(2, -2, len-4, 4);
          }
          ctx.restore();
      });

      // Nodes
      state.nodes.forEach((n: PNode) => {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.isAnchor ? 8 : 5, 0, Math.PI*2);
          ctx.fillStyle = n.isAnchor ? '#FCEE0C' : '#fff';
          ctx.fill();
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          ctx.stroke();
      });
  };

  const drawInteraction = (ctx: CanvasRenderingContext2D) => {
      const { x, y } = currentCursorPos.current;
      const { activeTool } = useBridgeStore.getState();

      if (activeTool === 'node') {
          ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI*2);
          ctx.fillStyle = '#00FF9F'; ctx.fill();
          ctx.font = '12px monospace';
          ctx.fillText(`-$${LEVEL_CONSTANTS.NODE_COST}`, x + 10, y - 10);
      } else if (dragStartNode.current) {
          const start = dragStartNode.current;
          const dist = Math.hypot(x - start.x, y - start.y);
          const isTooLong = dist > MAX_BEAM_LENGTH;

          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(x, y);
          ctx.lineWidth = 2;
          ctx.strokeStyle = isTooLong ? '#EF4444' : '#fff'; 
          ctx.setLineDash([8, 8]);
          ctx.stroke();
          ctx.setLineDash([]);

          if (isTooLong) {
            ctx.fillStyle = '#EF4444';
            ctx.font = '12px monospace';
            ctx.fillText('TOO LONG', (start.x + x)/2, (start.y + y)/2 - 10);
          }
      }
      ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI*2);
      ctx.strokeStyle = '#00FF9F'; ctx.lineWidth = 2; ctx.stroke();
  };

  const drawSimulation = (ctx: CanvasRenderingContext2D) => {
      if (!engineRef.current) return;
      const world = engineRef.current.world;
      
      const constraints = Matter.Composite.allConstraints(world);
      constraints.forEach(c => {
          const constraint = c as any;
          if (!constraint.plugin || !constraint.plugin.type) return;
          
          const pA = c.bodyA!.position;
          const pB = c.bodyB!.position;
          // IMPORTANT: Re-calculate visual position for rendering
          const curLen = Math.hypot(pB.x - pA.x, pB.y - pA.y);
          const angle = Math.atan2(pB.y - pA.y, pB.x - pA.x);
          
          // Stress Calculation
          const restLen = constraint.plugin.originalLength;
          const strain = Math.abs(curLen - restLen);
          const maxStrain = constraint.plugin.strength || 20;
          
          let color = '#555';
          // Check if "Broken" (low stiffness)
          if (c.stiffness < 0.1) {
              color = '#EF4444'; // Red for broken
          } else {
             const forceRatio = Math.min(strain / maxStrain, 1.0);
             const hue = (1 - forceRatio) * 120;
             color = `hsl(${hue}, 100%, 50%)`;
          }

          ctx.save();
          ctx.translate(pA.x, pA.y);
          ctx.rotate(angle);

          if (constraint.plugin.type === 'road') {
               // Road Logic handled by Body, but we draw overlay here if needed
               // Actually for road, we see the RoadDeck body.
               // We only draw stress line for road constraints if we want
          } else {
              // Support Beams (Wood/Steel)
              ctx.fillStyle = color;
              if (c.stiffness < 0.1) {
                  // Broken visual
                  ctx.globalAlpha = 0.5;
                  ctx.fillRect(0, -3, curLen/2 - 5, 6);
                  ctx.fillRect(curLen/2 + 5, -3, curLen/2 - 5, 6);
                  ctx.globalAlpha = 1;
              } else {
                  ctx.fillRect(0, -4, curLen, 8);
              }
          }
          ctx.restore();
      });

      const bodies = Matter.Composite.allBodies(world);
      bodies.forEach(b => {
          if (b.label === 'RoadDeck') {
              ctx.save();
              ctx.translate(b.position.x, b.position.y);
              ctx.rotate(b.angle);
              ctx.fillStyle = '#334155';
              ctx.fillRect(-b.bounds.max.x + b.position.x, -6, (b.bounds.max.x - b.bounds.min.x), 12);
              ctx.fillStyle = '#ffffff30';
              ctx.fillRect(-b.bounds.max.x + b.position.x, -6, (b.bounds.max.x - b.bounds.min.x), 4);
              ctx.restore();
          }
          else if (b.label === 'CarChassis') {
              ctx.save();
              ctx.translate(b.position.x, b.position.y);
              ctx.rotate(b.angle);
              ctx.fillStyle = '#e74c3c'; 
              ctx.shadowColor = 'black';
              ctx.shadowBlur = 10;
              ctx.beginPath();
              ctx.rect(-50, -15, 100, 30);
              ctx.fill();
              ctx.restore();
          } else if (b.label === 'CarWheel') {
              ctx.beginPath();
              ctx.arc(b.position.x, b.position.y, 15, 0, Math.PI*2);
              ctx.fillStyle = '#34495e'; 
              ctx.fill();
              ctx.beginPath();
              ctx.arc(b.position.x, b.position.y, 6, 0, Math.PI*2);
              ctx.fillStyle = '#555';
              ctx.fill();
          } else if (b.label === 'Node') {
              ctx.beginPath();
              ctx.arc(b.position.x, b.position.y, 4, 0, Math.PI*2);
              ctx.fillStyle = '#fff';
              ctx.fill();
          }
      });
  };

  // --- PHYSICS ENGINE ---
  const startSimulation = () => {
      if (!engineRef.current) return;
      Matter.World.clear(engineRef.current.world, false);
      Matter.Engine.clear(engineRef.current);
      const world = engineRef.current.world;
      engineRef.current.gravity.y = 1.5; 
      
      const { nodes, edges } = useBridgeStore.getState();

      const groundLeft = Matter.Bodies.rectangle(LEVEL_CONSTANTS.CLIFF_WIDTH/2, LEVEL_CONSTANTS.CLIFF_Y + 500, LEVEL_CONSTANTS.CLIFF_WIDTH, 1000, { isStatic: true, label: 'Ground', friction: 1 });
      const groundRight = Matter.Bodies.rectangle(LEVEL_CONSTANTS.WORLD_WIDTH - LEVEL_CONSTANTS.CLIFF_WIDTH/2, LEVEL_CONSTANTS.CLIFF_Y + 500, LEVEL_CONSTANTS.CLIFF_WIDTH, 1000, { isStatic: true, label: 'Ground', friction: 1 });
      Matter.World.add(world, [groundLeft, groundRight]);

      const nodeMap = new Map<string, Matter.Body>();
      nodes.forEach(n => {
          const b = Matter.Bodies.circle(n.x, n.y, 6, {
              isStatic: n.isAnchor,
              density: 0.05,
              friction: 0.8,
              label: 'Node',
              collisionFilter: { group: -1 } 
          });
          nodeMap.set(n.id, b);
          Matter.World.add(world, b);
      });

      edges.forEach(e => {
          const nA = nodeMap.get(e.startNodeId);
          const nB = nodeMap.get(e.endNodeId);
          if(!nA || !nB) return;
          const len = Math.hypot(nA.position.x - nB.position.x, nA.position.y - nB.position.y);

          if (e.material.type === 'road') {
              // ROAD: Creates a physical BODY to drive on
              const midX = (nA.position.x + nB.position.x)/2;
              const midY = (nA.position.y + nB.position.y)/2;
              const deck = Matter.Bodies.rectangle(midX, midY, len, 12, {
                  angle: Math.atan2(nB.position.y - nA.position.y, nB.position.x - nA.position.x),
                  density: e.material.density, // Heavy
                  friction: 1.0, 
                  collisionFilter: { category: 0x0002 },
                  label: 'RoadDeck'
              });
              
              // Attach Deck to Nodes (Hinges)
              const pA = Matter.Constraint.create({ bodyA: nA, bodyB: deck, pointB: {x: -len/2, y:0}, stiffness: 1, length: 0, damping: 0.1 });
              const pB = Matter.Constraint.create({ bodyA: nB, bodyB: deck, pointB: {x: len/2, y:0}, stiffness: 1, length: 0, damping: 0.1 });
              
              // Internal Truss for Strength logic (Invisible)
              const truss = Matter.Constraint.create({
                  bodyA: nA, bodyB: nB, length: len, stiffness: 0.9, damping: 0.1, 
                  render: { visible: false },
                  plugin: { type: 'road', originalLength: len, strength: e.material.strength, roadBody: deck }
              } as any);
              
              Matter.World.add(world, [deck, pA, pB, truss]);
          } else {
              // SUPPORT (Wood/Steel): Just a Constraint, no body collisions
              const truss = Matter.Constraint.create({
                  bodyA: nA, bodyB: nB, length: len, stiffness: e.material.stiffness, damping: 0.1, 
                  render: { visible: false },
                  plugin: { type: e.material.type, originalLength: len, strength: e.material.strength }
              } as any);
              Matter.World.add(world, truss);
          }
      });

      createCar(world);
      setSimulationState('running');
      
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      simIntervalRef.current = setInterval(() => {
          if (useBridgeStore.getState().simulationState !== 'running' || !engineRef.current) return;
          
          Matter.Engine.update(engineRef.current, 1000/120);
          Matter.Engine.update(engineRef.current, 1000/120);
          
          const constraints = Matter.Composite.allConstraints(world);
          for(const c of constraints) {
              const cons = c as any;
              if (cons.plugin?.strength) {
                  const dist = Math.hypot(c.bodyA!.position.x - c.bodyB!.position.x, c.bodyA!.position.y - c.bodyB!.position.y);
                  
                  const stretch = Math.abs(dist - cons.plugin.originalLength);
                  // REALISTIC BREAKAGE: Do not remove, just make it floppy
                  if (stretch > cons.plugin.strength && c.stiffness > 0.1) {
                      // Break the joint
                      c.stiffness = 0.02; // Very loose
                      
                      // If it's a road, we DO need to detach the road body to simulate collapse
                      if (cons.plugin.roadBody) {
                          // We don't remove the body (so it falls), but we might want to detach one end?
                          // For simplicity, let's keep the body but make the main truss floppy
                      }
                  }
              }
          }
          
          const car = world.bodies.find(b => b.label === 'CarChassis');
          if (car) {
              if (car.position.y > LEVEL_CONSTANTS.CLIFF_Y + 500) setSimulationState('collapsed');
              if (car.position.x > LEVEL_CONSTANTS.WORLD_WIDTH - LEVEL_CONSTANTS.CLIFF_WIDTH + 50) setSimulationState('success');
          }
      }, 1000/60);
  };

  const createCar = (world: Matter.World) => {
      const x = LEVEL_CONSTANTS.CLIFF_WIDTH - 150;
      const y = LEVEL_CONSTANTS.CLIFF_Y - 20;
      const width = 100;
      const height = 30;
      const wheelSize = 15;

      const group = Matter.Body.nextGroup(true);
      
      const chassis = Matter.Bodies.rectangle(x, y, width, height, { 
          collisionFilter: { group }, 
          density: 0.002, 
          friction: 0.01, 
          label: 'CarChassis',
          render: { fillStyle: '#e74c3c' }
      });

      const w1 = Matter.Bodies.circle(x + width * 0.35, y + height / 2, wheelSize, { 
          collisionFilter: { group },
          friction: 0.9, 
          density: 0.01, 
          label: 'CarWheel',
          render: { fillStyle: '#34495e' }
      });
      const w2 = Matter.Bodies.circle(x - width * 0.35, y + height / 2, wheelSize, { 
          collisionFilter: { group },
          friction: 0.9, 
          density: 0.01, 
          label: 'CarWheel',
          render: { fillStyle: '#34495e' }
      });

      const ax1 = Matter.Constraint.create({ 
          bodyA: chassis, 
          bodyB: w1, 
          pointA: {x: width * 0.35, y: height / 2}, 
          pointB: {x: 0, y: 0},
          stiffness: 0.2, 
          damping: 0.5, 
          length: wheelSize + 5 
      });
      const ax2 = Matter.Constraint.create({ 
          bodyA: chassis, 
          bodyB: w2, 
          pointA: {x: -width * 0.35, y: height / 2}, 
          pointB: {x: 0, y: 0},
          stiffness: 0.2, 
          damping: 0.5, 
          length: wheelSize + 5 
      });
      
      Matter.World.add(world, [chassis, w1, w2, ax1, ax2]);
      
      if (engineRef.current) {
          Matter.Events.on(engineRef.current, 'beforeUpdate', () => {
              if (chassis.position.x < LEVEL_CONSTANTS.WORLD_WIDTH - 200) {
                  Matter.Body.setAngularVelocity(w1, 0.35);
                  Matter.Body.setAngularVelocity(w2, 0.35);
              }
          });
      }
  };

  const stopSimulation = () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      setSimulationState('design');
  };

  // --- INTERACTION ---
  const handleMouseDown = (e: React.MouseEvent) => {
      const { x, y } = currentCursorPos.current;
      const { activeTool, nodes, budget, addNode } = useBridgeStore.getState();

      if (e.button === 1 || activeTool === 'pan') {
          isDraggingCamera.current = true;
          lastMousePos.current = { x: e.clientX, y: e.clientY };
          return;
      }
      if (useBridgeStore.getState().simulationState !== 'design') return;

      if (activeTool === 'eraser') {
          const n = nodes.find(n => Math.hypot(n.x - x, n.y - y) < 15);
          if(n && !n.isAnchor) removeNode(n.id);
          return;
      }

      // === NEW: Joint/Node Tool ===
      if (activeTool === 'node') {
          // Check overlapping with existing nodes
          const nearby = nodes.find(n => Math.hypot(n.x - x, n.y - y) < 20);
          if (nearby) return; // Too close

          // Check Budget
          if (budget < LEVEL_CONSTANTS.NODE_COST) {
              alert("Không đủ tiền!");
              return;
          }

          addNode({ id: `node_${Date.now()}`, x, y, isAnchor: false });
          return;
      }

      // === Beam Tool ===
      let target = nodes.find(n => Math.hypot(n.x - x, n.y - y) < 15); 
      
      if (!target) {
          // If clicked in void with Beam tool, DO NOTHING (Requirement: Must start from node)
          return;
      }
      
      dragStartNode.current = target;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (isDraggingCamera.current) {
          const dx = e.clientX - lastMousePos.current.x;
          const dy = e.clientY - lastMousePos.current.y;
          const cam = useBridgeStore.getState().camera;
          
          const newX = cam.x + dx;
          const newY = cam.y + dy;
          
          const clamped = clampCamera(newX, newY, cam.scale);
          
          setCamera({ x: clamped.x, y: clamped.y });
          lastMousePos.current = { x: e.clientX, y: e.clientY };
          return;
      }

      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const raw = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
      const snapped = snapToGrid(raw.x, raw.y);
      currentCursorPos.current = snapped; 
  };

  const handleMouseUp = () => {
      isDraggingCamera.current = false;
      const start = dragStartNode.current;
      if (!start) return;

      const { x, y } = currentCursorPos.current;
      const { nodes, selectedMaterial, addEdge, budget } = useBridgeStore.getState();

      const curDist = Math.hypot(x - start.x, y - start.y);
      if (curDist > MAX_BEAM_LENGTH) {
          dragStartNode.current = null;
          return;
      }

      let end = nodes.find(n => Math.hypot(n.x - x, n.y - y) < 15);
      // Auto-join if close (Magnetic)
      
      // If we are just dragging to a node, connect.
      // We removed "create new node on drag end" logic to enforce using the Node Tool or connecting existing nodes.
      // UNLESS: It's a design choice. Let's keep "Drag to void = cancel" to force using Node Tool?
      // Re-reading user request: "tạo node trên thanh xây dựng... tạo từ mấy cái node có sẵn nó khó".
      // So, if they use BEAM tool, they connect existing nodes. If they want new node, use NODE tool.
      
      if (end && start.id !== end.id) {
          const dist = Math.hypot(start.x - end.x, start.y - end.y);
          if (dist > 20) {
              if (budget >= selectedMaterial.cost) {
                  addEdge({
                      id: `edge_${Date.now()}`,
                      startNodeId: start.id,
                      endNodeId: end.id,
                      material: selectedMaterial
                  });
              } else {
                  alert("Không đủ tiền!");
              }
          }
      }
      dragStartNode.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
      const cam = useBridgeStore.getState().camera;
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const worldX = (mouseX - cam.x) / cam.scale;
      const worldY = (mouseY - cam.y) / cam.scale;

      const zoomFactor = e.deltaY * -0.001;
      const tentativeScale = cam.scale + zoomFactor;
      
      const { scale: newScale } = clampCamera(cam.x, cam.y, tentativeScale);

      const newCamX = mouseX - (worldX * newScale);
      const newCamY = mouseY - (worldY * newScale);

      const finalCam = clampCamera(newCamX, newCamY, newScale);

      setCamera(finalCam);
  };

  return (
    <div className="flex flex-col h-screen bg-[#080911] text-white font-mono overflow-hidden">
        {/* Header - Stays Full Width */}
        <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#0F172A] z-20 flex-none">
             <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg"><ArrowLeft size={18} /></button>
                <span className="font-bold text-cyber-neon flex items-center gap-2"><Hammer size={18} /> BridgeSim v2.3</span>
            </div>
            <div className="flex bg-black/40 rounded-lg p-1 gap-1">
                 <button onClick={() => setTool('pan')} title="Di chuyển Camera" className={`p-2 rounded ${activeTool==='pan' ? 'bg-blue-600' : 'text-gray-400'}`}><Move size={16}/></button>
                 <button onClick={() => setTool('node')} title="Tạo Khớp Nối ($10)" className={`p-2 rounded ${activeTool==='node' ? 'bg-cyber-neon text-black' : 'text-gray-400'}`}><CircleDot size={16}/></button>
                 <button onClick={() => setTool('beam')} title="Vẽ Thanh/Dây" className={`p-2 rounded ${activeTool==='beam' ? 'bg-cyber-neon text-black' : 'text-gray-400'}`}><MousePointer2 size={16}/></button>
                 <button onClick={() => setTool('eraser')} title="Xóa" className={`p-2 rounded ${activeTool==='eraser' ? 'bg-red-500' : 'text-gray-400'}`}><Eraser size={16}/></button>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-cyber-acid font-bold">$ {budget}</div>
                {simulationState === 'design' ? (
                    <button onClick={startSimulation} className="bg-cyber-neon text-black px-4 py-1.5 rounded font-bold hover:bg-[#00CC80] flex gap-2"><Play size={16}/> RUN</button>
                ) : (
                    <button onClick={stopSimulation} className="bg-orange-500 text-white px-4 py-1.5 rounded font-bold hover:bg-orange-600 flex gap-2"><RotateCcw size={16}/> EDIT</button>
                )}
                <button onClick={handleSave} className="p-2 text-gray-400 hover:text-white">{isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}</button>
            </div>
        </div>

        {/* Main Layout Area - Strict Flexbox Separation */}
        <div className="flex flex-1 flex-row relative overflow-hidden">
            
            {/* Sidebar (Fixed Width, Flex-None) */}
            <div className="w-72 bg-[#0F172A] border-r border-white/10 p-4 flex flex-col gap-2 z-20 flex-none shadow-xl">
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Vật liệu</h3>
                 {Object.values(MATERIALS).map(mat => (
                     <button key={mat.id} onClick={() => setMaterial(mat)}
                        className={`p-3 rounded-lg border text-left transition-all ${selectedMaterial.id === mat.id ? 'bg-white/10 border-cyber-neon' : 'bg-black/20 border-transparent hover:bg-white/5'}`}>
                        <div className="flex justify-between items-center mb-1">
                           <div className="font-bold text-sm text-white">{mat.name}</div>
                           <div className="text-xs text-cyber-acid font-mono">${mat.cost}/m</div>
                        </div>
                        <div className="text-[10px] text-gray-500 mb-2">Độ bền: {mat.strength}px | KL: {mat.density * 1000}</div>
                        <div className="h-1.5 w-full rounded-full" style={{ background: mat.renderColor }}></div>
                     </button>
                 ))}
                 
                 <div className="mt-auto">
                    <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg">
                       <h4 className="text-xs text-blue-400 font-bold mb-1 flex items-center gap-2"><ZoomIn size={12} /> Hướng dẫn</h4>
                       <ul className="text-[10px] text-gray-400 list-disc ml-3 space-y-1">
                          <li>Dùng <b>Road</b> để làm mặt đường cho xe chạy.</li>
                          <li>Dùng <b>Wood/Steel</b> để gia cố (Truss).</li>
                          <li>Dùng công cụ <b>Node</b> để tạo thêm khớp nối.</li>
                          <li>Chuột giữa để di chuyển Camera.</li>
                       </ul>
                    </div>
                 </div>
            </div>

            {/* Canvas Container (Flex-1) */}
            <div 
                ref={containerRef}
                className="flex-1 relative bg-[#080911] cursor-crosshair overflow-hidden touch-none z-10 min-w-0"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onWheel={handleWheel}
                onContextMenu={e => e.preventDefault()}
            >
                {/* Canvas Layers */}
                <canvas ref={staticCanvasRef} className="absolute top-0 left-0 pointer-events-none" />
                <canvas ref={dynamicCanvasRef} className="absolute top-0 left-0" />

                {/* Overlays */}
                {simulationState === 'collapsed' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 animate-in zoom-in">
                        <div className="bg-[#0F172A] border border-red-500 p-8 rounded-2xl text-center shadow-2xl">
                            <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
                            <h2 className="text-2xl font-bold text-white mb-2">Cầu Hỏng!</h2>
                            <p className="text-gray-400 mb-6">Kết cấu bị gãy do quá tải.</p>
                            <button onClick={stopSimulation} className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200 w-full">Sửa lại</button>
                        </div>
                    </div>
                )}
                {simulationState === 'success' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 animate-in zoom-in">
                        <div className="bg-[#0F172A] border border-green-500 p-8 rounded-2xl text-center shadow-2xl">
                            <Truck className="mx-auto text-green-500 mb-4" size={48} />
                            <h2 className="text-2xl font-bold text-white mb-2">Thành Công!</h2>
                             <p className="text-gray-400 mb-6">Xe đã qua cầu an toàn.</p>
                            <button onClick={stopSimulation} className="bg-cyber-neon text-black px-6 py-2 rounded font-bold hover:bg-[#00CC80] w-full">Tuyệt vời</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default BridgeSim;
