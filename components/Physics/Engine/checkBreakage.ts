import Matter from 'matter-js';

type MaterialConfig = Record<string, { maxStretch: number }>;

const MATERIAL_CONFIG: MaterialConfig = {
  wood: { maxStretch: 15 },
  steel: { maxStretch: 25 },
  cable: { maxStretch: 30 },
  road: { maxStretch: 40 },
};

/**
 * Kiểm tra các constraint xem có bị kéo dãn quá mức không.
 * Nếu quá maxStretch -> Xóa constraint khỏi world (Gãy).
 */
export function checkBreakage(engine: Matter.Engine) {
  const world = engine.world;
  const constraints = Matter.Composite.allConstraints(world);

  for (let i = 0; i < constraints.length; i++) {
    const c = constraints[i] as Matter.Constraint & { plugin?: any; render: any; id?: any; label?: string };

    // Chỉ kiểm tra các thanh dầm/dây cáp (có label hoặc plugin.materialType)
    const materialType = c.plugin?.materialType ?? c.label?.toLowerCase?.();
    
    // Bỏ qua nếu không phải vật liệu xây dựng (ví dụ: hệ thống treo xe)
    if (!materialType || !MATERIAL_CONFIG[materialType] && materialType !== 'beam') continue;
    
    const configKey = MATERIAL_CONFIG[materialType] ? materialType : 'wood';
    const cfg = MATERIAL_CONFIG[configKey] ?? { maxStretch: 20 };

    const pA = c.bodyA ? Matter.Vector.add(c.bodyA.position, c.pointA || { x: 0, y: 0 }) : c.pointA;
    const pB = c.bodyB ? Matter.Vector.add(c.bodyB.position, c.pointB || { x: 0, y: 0 }) : c.pointB;
    
    if (!pA || !pB) continue;

    const currentDist = Matter.Vector.magnitude(Matter.Vector.sub(pA as Matter.Vector, pB as Matter.Vector));
    const restingLength = c.length ?? currentDist;
    const stretch = Math.abs(currentDist - restingLength);
    const stressRatio = stretch / (cfg.maxStretch || 1);

    // Lưu stressRatio để render màu (0..1)
    c.render = c.render || {};
    c.render.stressRatio = Math.min(Math.max(stressRatio, 0), 1);

    // Gãy nếu vượt quá giới hạn
    if (stretch > cfg.maxStretch) {
      Matter.World.remove(world, c);

      if (typeof console !== 'undefined') {
        console.debug(`Constraint broke (id=${c.id ?? 'n/a'}): type=${materialType}, stretch=${stretch.toFixed(2)}`);
      }
    }
  }
}

export default checkBreakage;