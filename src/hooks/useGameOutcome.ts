import { useRef, useCallback } from 'react';
import Matter from 'matter-js';
import { useBridgeStore } from '../components/Physics/BridgeStore';

interface UseGameOutcomeProps {
  engineRef: React.MutableRefObject<Matter.Engine | null>;
  levelConstants: {
    WORLD_WIDTH: number;
    CLIFF_WIDTH: number;
    CLIFF_Y: number;
  };
}

export const useGameOutcome = ({ engineRef, levelConstants }: UseGameOutcomeProps) => {
  const { setSimulationState } = useBridgeStore();
  const outcomeRef = useRef<'win' | 'lose' | null>(null);

  const checkOutcome = useCallback(() => {
    if (!engineRef.current) return null;
    if (outcomeRef.current) return outcomeRef.current; // Already decided

    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    const chassis = bodies.find((b) => b.label === 'CarChassis');

    if (!chassis) return null;

    const { position } = chassis;
    
    // Win Condition: Car reaches the right cliff
    // Threshold: World Width - Cliff Width (start of right cliff) + Margin
    const winX = levelConstants.WORLD_WIDTH - levelConstants.CLIFF_WIDTH + 50;
    if (position.x > winX) {
      outcomeRef.current = 'win';
      setSimulationState('success');
      return 'win';
    }

    // Loss Condition: Car falls into the water
    // Threshold: Cliff Y + 300 (deep enough)
    const loseY = levelConstants.CLIFF_Y + 400;
    if (position.y > loseY) {
      outcomeRef.current = 'lose';
      setSimulationState('collapsed');
      return 'lose';
    }

    return null;
  }, [engineRef, levelConstants, setSimulationState]);

  const resetOutcome = useCallback(() => {
    outcomeRef.current = null;
  }, []);

  return { checkOutcome, resetOutcome };
};