import Matter from 'matter-js';

/**
 * Tạo xe tải với khung (chassis) và 2 bánh xe kết nối bằng lò xo (constraint).
 */
export const createCar = (
  x: number,
  y: number,
  width = 120,
  height = 30,
  wheelSize = 12
): Matter.Composite => {
  const { Bodies, Body, Composite, Constraint } = Matter;

  const group = Body.nextGroup(true);

  // Thân xe
  const chassis = Bodies.rectangle(x, y - 12, width, height, {
    collisionFilter: { group },
    density: 0.002,
    friction: 0.02,
    label: 'CarChassis',
    render: { fillStyle: '#e74c3c' },
  });

  const wheelOpts = {
    collisionFilter: { group },
    friction: 0.9,
    density: 0.01,
    restitution: 0.1, // Nảy nhẹ
    label: 'CarWheel',
    render: { fillStyle: '#34495e' },
  };

  // 2 Bánh xe
  const wheelA = Bodies.circle(x + width * 0.33, y + height * 0.5, wheelSize, wheelOpts);
  const wheelB = Bodies.circle(x - width * 0.33, y + height * 0.5, wheelSize, wheelOpts);

  const suspensionDefaults = {
    stiffness: 0.2, // Lò xo mềm
    damping: 0.5,
    length: wheelSize + 6,
    render: { visible: false },
  };

  // Hệ thống treo (Suspension)
  const axleA = Constraint.create({
    ...suspensionDefaults,
    bodyA: chassis,
    pointA: { x: width * 0.33, y: height * 0.5 },
    bodyB: wheelA,
    pointB: { x: 0, y: 0 },
    label: 'CarSuspension',
    render: { strokeStyle: '#7f8c8d' },
  });

  const axleB = Constraint.create({
    ...suspensionDefaults,
    bodyA: chassis,
    pointA: { x: -width * 0.33, y: height * 0.5 },
    bodyB: wheelB,
    pointB: { x: 0, y: 0 },
    label: 'CarSuspension',
  });

  // Đóng gói vào Composite
  const comp = Composite.create({ label: 'CarComposite' });
  Composite.add(comp, chassis);
  Composite.add(comp, wheelA);
  Composite.add(comp, wheelB);
  Composite.add(comp, axleA);
  Composite.add(comp, axleB);

  return comp;
};

export default createCar;