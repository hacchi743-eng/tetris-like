export type Cell = {
  x: number;
  y: number;
};

export type Shape = Cell[];

export const SHAPES: Shape[] = [
  // I
  [
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
  ],

  // O
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],

  // T
  [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],

  // L
  [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],

  // J
  [
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],

  // S
  [
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],

  // Z
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
];

export class Piece {
  x = 3;

  y = 0;

  shape: Shape;

  isT = false;

  constructor(shape?: Shape, isT = false) {
    this.shape =
      shape ??
      structuredClone(
        SHAPES[
          Math.floor(
            Math.random() * SHAPES.length
          )
        ]
      );

    this.isT = isT;
  }

  static random() {
    const index = Math.floor(
      Math.random() * SHAPES.length
    );

    return new Piece(
      structuredClone(SHAPES[index]),
      index === 2
    );
  }

  rotate() {
    this.shape = this.shape.map((cell) => ({
      x: -cell.y,
      y: cell.x,
    }));

    const minX = Math.min(
      ...this.shape.map((c) => c.x)
    );

    const minY = Math.min(
      ...this.shape.map((c) => c.y)
    );

    this.shape = this.shape.map((cell) => ({
      x: cell.x - minX,
      y: cell.y - minY,
    }));
  }
}