"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { CameraControls, CameraControlsImpl, RoundedBox, useCursor } from "@react-three/drei";
import { cn } from "@/lib/cn";
import { roomState } from "./rooms";
import { drawSign, paintArt, type ArtKind } from "./artwork";
import {
  PLANS,
  SEATS,
  ZONES,
  formatNaira,
  offers,
  seatName,
  zoneSeatIds,
  type PlanId,
  type SeatGroup,
  type Zone,
} from "@/lib/workspace";

/**
 * The building as a lit 3D model you can look around and pick chairs in.
 *
 * Units are metres. The layout follows the hand sketch: the main floor on the
 * left with reception by the entrance, the two private offices along the top
 * right, a corridor, the bathroom and toilet, and the closed workspace in the
 * bottom-right corner. Walls are cut at 1.1m, like a dollhouse, so you can see in.
 *
 * Renders on demand only (no animation loop), so it costs nothing while idle.
 */

type Props = {
  plan: PlanId;
  booked: Set<string>;
  selected: Set<string>;
  loading: boolean;
  onToggleSeat: (seatId: string) => void;
  onToggleGroup: (seatIds: string[]) => void;
};

// ---------------------------------------------------------------------------
// The floor plan, in metres. Origin is the top-left (north-west) corner.
// ---------------------------------------------------------------------------

const W = 16;
const D = 10.5;
const WALL_H = 1.1;
/** Outside walls away from the camera stand full height, so art can hang on them. */
const WALL_TALL = 2.7;

type Rect = [x0: number, z0: number, x1: number, z1: number];
type FloorKind = "oak" | "stone" | "carpet" | "carpetDark" | "concrete" | "tile";

const FLOORS: Array<{ rect: Rect; kind: FloorKind }> = [
  { rect: [0, 0, 8.4, 5.6], kind: "oak" }, // main floor, top
  { rect: [3.9, 5.6, 8.4, 10.5], kind: "oak" }, // main floor, beside reception
  { rect: [0, 5.6, 3.9, 10.5], kind: "stone" }, // reception
  { rect: [8.4, 0, 12.2, 4], kind: "carpet" }, // private office 1
  { rect: [12.2, 0, 16, 4], kind: "carpet" }, // private office 2
  { rect: [8.4, 4, 16, 5.5], kind: "concrete" }, // corridor
  { rect: [8.4, 5.5, 10.3, 10.5], kind: "tile" }, // bathroom
  { rect: [10.3, 5.5, 12.2, 10.5], kind: "tile" }, // toilet
  { rect: [12.2, 5.5, 16, 10.5], kind: "carpetDark" }, // closed workspace
];

// Wall runs as [x0, z0, x1, z1, thickness]. Gaps between runs are doorways.
const WALLS: Array<[number, number, number, number, number]> = [
  // Outside walls
  [0, 0, 4.4, 0, 0.2], // north, then the door between the two big tables
  [5.4, 0, 16, 0, 0.2],
  [0, 10.5, 1.0, 10.5, 0.2], // south, then the entrance into reception
  [2.2, 10.5, 16, 10.5, 0.2],
  [0, 0, 0, 10.5, 0.2],
  [16, 0, 16, 10.5, 0.2],
  // Main floor | the rooms (open where the corridor starts)
  [8.4, 0, 8.4, 4, 0.12],
  [8.4, 5.5, 8.4, 10.5, 0.12],
  // Reception, with its door facing the tables
  [0, 5.6, 3.9, 5.6, 0.12],
  [3.9, 5.6, 3.9, 7.1, 0.12],
  [3.9, 8.3, 3.9, 10.5, 0.12],
  // Between the private offices
  [12.2, 0, 12.2, 4, 0.12],
  // Offices | corridor, with a door into each office
  [8.4, 4, 10.0, 4, 0.12],
  [10.9, 4, 13.6, 4, 0.12],
  [14.5, 4, 16, 4, 0.12],
  // Corridor | bathroom, toilet, closed workspace
  [8.4, 5.5, 8.9, 5.5, 0.12],
  [9.7, 5.5, 10.8, 5.5, 0.12],
  [11.6, 5.5, 14.2, 5.5, 0.12],
  [15.1, 5.5, 16, 5.5, 0.12],
  [10.3, 5.5, 10.3, 10.5, 0.12],
  [12.2, 5.5, 12.2, 10.5, 0.12],
];

/** Where each table or desk group sits (its centre). */
const PLACE: Record<string, { x: number; z: number }> = {
  "main-t1": { x: 1.95, z: 2.7 },
  "main-t2": { x: 6.2, z: 2.7 },
  "main-t3": { x: 8.04, z: 8.0 }, // against the main floor's east wall
  "office1-desks": { x: 10.3, z: 0.45 },
  "office2-desks": { x: 14.1, z: 0.45 },
  "quiet-t1": { x: 14.1, z: 6.75 },
  "quiet-t2": { x: 14.1, z: 7.85 },
  "quiet-t3": { x: 14.1, z: 9.25 },
};

/** Rooms the camera can fly to. */
/**
 * Rooms the camera can fly to, each from the angle that shows it best
 * (azimuth in radians; 0 looks in from the entrance side, + swings east).
 */
const FOCUS: Record<string, { label: string; rect: Rect; azimuth: number }> = {
  all: { label: "Whole floor", rect: [-0.3, -0.3, W + 0.3, D + 0.3], azimuth: 0 },
  main: { label: "Main", rect: [0, 0, 8.4, D], azimuth: 0.6 }, // windows on the west wall and the art on the back wall
  office1: { label: "Office 1", rect: [8.4, 0, 12.2, 4], azimuth: 0 },
  office2: { label: "Office 2", rect: [12.2, 0, 16, 4], azimuth: -0.45 }, // takes in the corner window
  quiet: { label: "Closed", rect: [12.2, 5.5, 16, D], azimuth: -0.4 }, // faces the painting
};
type FocusId = keyof typeof FOCUS;

/** Where a room's name tag floats: over the back wall, or the corridor, so no furniture is hidden. */
const TAGS: Record<string, [number, number]> = {
  main: [4.2, -0.35],
  office1: [10.3, -0.35],
  office2: [14.1, -0.35],
  quiet: [13.4, 4.75],
};

/**
 * Artwork, hung where people will actually see it: over the big tables, by the
 * doors, above the office desks, and the Forge sign behind reception.
 * `wall` is the index in WALLS; `at` is the position along it; y is the centre height.
 */
const ART: Array<{ wall: number; at: number; y: number; w: number; h: number; kind: ArtKind; frame?: "black" | "oak" }> = [
  { wall: 0, at: 2.0, y: 1.65, w: 1.7, h: 1.05, kind: "sunrise", frame: "black" }, // over Table 1
  { wall: 4, at: 2.85, y: 1.6, w: 0.6, h: 0.8, kind: "arc", frame: "oak" }, // pair on the side wall by Table 1
  { wall: 4, at: 3.75, y: 1.6, w: 0.6, h: 0.8, kind: "dots", frame: "oak" },
  { wall: 3, at: 6.2, y: 1.6, w: 0.85, h: 1.25, kind: "bauhaus", frame: "oak" }, // main floor, front wall (seen when turned)
  { wall: 4, at: 7.45, y: 1.8, w: 2.0, h: 0.62, kind: "sign" }, // reception: the brand wall
  { wall: 5, at: 8.0, y: 1.6, w: 1.0, h: 1.3, kind: "calm", frame: "oak" }, // closed workspace
  { wall: 5, at: 4.75, y: 1.6, w: 0.55, h: 0.75, kind: "ring", frame: "black" }, // end of the corridor
];

/**
 * Windows, each with a blackout roller blind: one in each corner of the main
 * space (reception has the south-west one), and the private offices'.
 * `drop` is how far the blind starts pulled down (0 open, 1 fully closed).
 */
const WINDOWS: Array<{ wall: number; at: number; w: number; drop: number; panes: number }> = [
  // One in each corner of the main space; the south-west corner is reception
  { wall: 4, at: 0.9, w: 1.3, drop: 0.1, panes: 2 }, // north-west, beside Table 1
  { wall: 1, at: 7.7, w: 1.2, drop: 0.15, panes: 2 }, // north-east, behind Table 2
  { wall: 3, at: 7.7, w: 1.2, drop: 0.1, panes: 2 }, // south-east, by the wall desk
  { wall: 4, at: 9.55, w: 1.3, drop: 0.2, panes: 2 }, // south-west: reception
  { wall: 1, at: 10.3, w: 3.0, drop: 0.35, panes: 3 }, // Private Office 1, above the desks
  { wall: 1, at: 14.1, w: 3.0, drop: 0.55, panes: 3 }, // Private Office 2, above the desks
  { wall: 5, at: 2.0, w: 2.2, drop: 0.2, panes: 2 }, // Private Office 2, corner window
];
const WINDOW_H = 1.3;
const WINDOW_Y = 1.7; // centre height; the sill sits just above desk monitors

// ---------------------------------------------------------------------------
// Turning a seat group into furniture
// ---------------------------------------------------------------------------

/** The way a seated person faces, i.e. towards their desk. */
type Facing = "+x" | "-x" | "+z" | "-z";
const TURN: Record<Facing, number> = { "-z": 0, "+z": Math.PI, "+x": -Math.PI / 2, "-x": Math.PI / 2 };

type TableSpot = { x: number; z: number; w: number; d: number };
type ChairSpot = { seatId: string; x: number; z: number; facing: Facing };

function furnish(group: SeatGroup): { tables: TableSpot[]; chairs: ChairSpot[] } {
  const p = PLACE[group.id];
  if (!p) return { tables: [], chairs: [] };
  const s = group.seats.map((seat) => seat.id);
  const { x, z } = p;

  switch (group.layout) {
    case "table4":
      return {
        tables: [{ x, z, w: 2, d: 0.9 }],
        chairs: [
          { seatId: s[0], x: x - 0.5, z: z - 0.78, facing: "+z" },
          { seatId: s[1], x: x + 0.5, z: z - 0.78, facing: "+z" },
          { seatId: s[2], x: x - 0.5, z: z + 0.78, facing: "-z" },
          { seatId: s[3], x: x + 0.5, z: z + 0.78, facing: "-z" },
        ],
      };
    case "table4v":
      return {
        tables: [{ x, z, w: 0.9, d: 2 }],
        chairs: [
          { seatId: s[0], x: x - 0.78, z: z - 0.5, facing: "+x" },
          { seatId: s[1], x: x - 0.78, z: z + 0.5, facing: "+x" },
          { seatId: s[2], x: x + 0.78, z: z - 0.5, facing: "-x" },
          { seatId: s[3], x: x + 0.78, z: z + 0.5, facing: "-x" },
        ],
      };
    case "table2":
      return {
        tables: [{ x, z, w: 1, d: 0.8 }],
        chairs: [
          { seatId: s[0], x, z: z - 0.72, facing: "+z" },
          { seatId: s[1], x, z: z + 0.72, facing: "-z" },
        ],
      };
    case "wall2":
      return {
        tables: [{ x, z, w: 0.6, d: 1.6 }],
        chairs: [
          { seatId: s[0], x: x - 0.68, z: z - 0.4, facing: "+x" },
          { seatId: s[1], x: x - 0.68, z: z + 0.4, facing: "+x" },
        ],
      };
    case "row": {
      const above = group.side === "above";
      return {
        tables: [{ x, z, w: s.length * 0.72 + 0.16, d: 0.7 }],
        chairs: s.map((seatId, i) => ({
          seatId,
          x: x + (i - (s.length - 1) / 2) * 0.72,
          z: above ? z - 0.62 : z + 0.62,
          facing: above ? "+z" : "-z",
        })),
      };
    }
    case "desks3":
      return {
        tables: [-1.2, 0, 1.2].map((dx) => ({ x: x + dx, z, w: 1.05, d: 0.65 })),
        chairs: s.map((seatId, i) => ({ seatId, x: x + (i - 1) * 1.2, z: z + 0.7, facing: "-z" })),
      };
  }
}

// ---------------------------------------------------------------------------
// Procedural floor textures (no image downloads). Seeded, so they're stable.
// ---------------------------------------------------------------------------

function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Metres covered by one repeat of each texture. */
const TILE_M: Record<FloorKind, number> = { oak: 2.4, stone: 1.6, carpet: 1, carpetDark: 1, concrete: 3, tile: 1 };

const textureCache = new Map<FloorKind, THREE.CanvasTexture>();

function floorTexture(kind: FloorKind): THREE.CanvasTexture {
  const cached = textureCache.get(kind);
  if (cached) return cached;

  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const g = canvas.getContext("2d")!;
  const rand = seeded(kind.length * 97 + 13);
  const speckle = (count: number, alpha: number, light: boolean) => {
    for (let i = 0; i < count; i++) {
      g.fillStyle = light ? `rgba(255,255,255,${rand() * alpha})` : `rgba(0,0,0,${rand() * alpha})`;
      g.fillRect(rand() * size, rand() * size, 1 + rand() * 2, 1 + rand() * 2);
    }
  };

  if (kind === "oak") {
    // Staggered planks, 14 rows per repeat (~14cm boards), each with its own tone and grain.
    const rows = 14;
    const h = size / rows;
    for (let r = 0; r < rows; r++) {
      let x = -rand() * size * 0.6;
      while (x < size) {
        const len = size * (0.45 + rand() * 0.5);
        const tone = 168 + rand() * 16;
        g.fillStyle = `rgb(${tone + 28}, ${tone - 4}, ${tone - 46})`;
        g.fillRect(x, r * h, len, h);
        const sheen = g.createLinearGradient(0, r * h, 0, r * h + h);
        sheen.addColorStop(0, "rgba(255,240,215,0.07)");
        sheen.addColorStop(1, "rgba(60,35,15,0.07)");
        g.fillStyle = sheen;
        g.fillRect(x, r * h, len, h);
        for (let k = 0; k < 4; k++) {
          g.strokeStyle = `rgba(90, 55, 25, ${0.05 + rand() * 0.08})`;
          g.lineWidth = 0.5 + rand() * 0.8;
          g.beginPath();
          const y = r * h + rand() * h;
          g.moveTo(x, y);
          g.bezierCurveTo(x + len * 0.3, y + (rand() - 0.5) * 6, x + len * 0.7, y + (rand() - 0.5) * 6, x + len, y);
          g.stroke();
        }
        g.fillStyle = "rgba(60, 35, 15, 0.35)";
        g.fillRect(x, r * h, 1, h); // board end
        x += len;
      }
      g.fillStyle = "rgba(60, 35, 15, 0.3)";
      g.fillRect(0, r * h, size, 1); // board edge
    }
  } else if (kind === "carpet" || kind === "carpetDark") {
    g.fillStyle = kind === "carpet" ? "#5a5f6b" : "#3f434c";
    g.fillRect(0, 0, size, size);
    speckle(9000, 0.18, true);
    speckle(9000, 0.25, false);
  } else if (kind === "concrete") {
    g.fillStyle = "#9a9792";
    g.fillRect(0, 0, size, size);
    for (let i = 0; i < 40; i++) {
      const grd = g.createRadialGradient(rand() * size, rand() * size, 0, rand() * size, rand() * size, 40 + rand() * 90);
      grd.addColorStop(0, `rgba(0,0,0,${rand() * 0.06})`);
      grd.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, size, size);
    }
    speckle(5000, 0.12, false);
  } else {
    // Square tiles with grout: 4 per repeat for tile, 2 for stone.
    const n = kind === "tile" ? 4 : 2;
    const step = size / n;
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        const tone = (kind === "tile" ? 218 : 200) + rand() * 14;
        g.fillStyle = kind === "tile" ? `rgb(${tone}, ${tone}, ${tone - 4})` : `rgb(${tone}, ${tone - 12}, ${tone - 30})`;
        g.fillRect(i * step, j * step, step, step);
      }
    speckle(3000, 0.06, false);
    g.fillStyle = kind === "tile" ? "#a9a69f" : "#9c907a";
    for (let i = 0; i <= n; i++) {
      g.fillRect(i * step - 1.5, 0, 3, size);
      g.fillRect(0, i * step - 1.5, size, 3);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  textureCache.set(kind, texture);
  return texture;
}

// ---------------------------------------------------------------------------
// Building shell
// ---------------------------------------------------------------------------

function Floor({ rect, kind }: { rect: Rect; kind: FloorKind }) {
  const [x0, z0, x1, z1] = rect;
  const w = x1 - x0;
  const d = z1 - z0;
  const map = useMemo(() => {
    const t = floorTexture(kind).clone();
    t.needsUpdate = true;
    t.repeat.set(w / TILE_M[kind], d / TILE_M[kind]);
    return t;
  }, [kind, w, d]);

  return (
    <mesh position={[x0 + w / 2, 0, z0 + d / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial map={map} roughness={kind === "tile" || kind === "stone" ? 0.35 : 0.85} />
    </mesh>
  );
}

const wallSide = new THREE.MeshStandardMaterial({ color: "#ecebe6", roughness: 0.9 });
const wallTop = new THREE.MeshStandardMaterial({ color: "#1b1b20", roughness: 0.6 });
// Box faces: +x, -x, +y (top), -y, +z, -z
const wallMaterials = [wallSide, wallSide, wallTop, wallSide, wallSide, wallSide];

/** Outward direction of each outside wall, by its index in WALLS (the first six). */
const OUTWARD: Array<[number, number]> = [
  [0, -1],
  [0, -1],
  [0, 1],
  [0, 1],
  [-1, 0],
  [1, 0],
];

/**
 * Dollhouse cutaway. Outside walls on the camera's side drop to a curb and the
 * far ones stand full height; inside walls running across the line of sight
 * drop to half height. No chair is ever hidden behind a wall, whichever way the
 * model is turned, and art only shows on a wall that is standing.
 */
function Walls() {
  const meshes = useRef<Array<THREE.Mesh | null>>([]);
  const art = useRef<Array<THREE.Group | null>>([]);
  const windows = useRef<Array<THREE.Group | null>>([]);
  const cam = useMemo(() => new THREE.Vector3(), []);
  const offset = useMemo(() => new THREE.Vector3(W / 2, 0, D / 2), []);
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }) => {
    // Camera in building coordinates, and the horizontal direction it looks in
    cam.copy(camera.position).add(offset);
    camera.getWorldDirection(look);
    const flat = Math.hypot(look.x, look.z) || 1;
    const lx = look.x / flat;
    const lz = look.z / flat;

    const heights = WALLS.map(([x0, z0, x1, z1], i) => {
      if (i < OUTWARD.length) {
        const [nx, nz] = OUTWARD[i];
        const outside = (cam.x - (x0 + x1) / 2) * nx + (cam.z - (z0 + z1) / 2) * nz > 0;
        return outside ? 0.18 : WALL_TALL;
      }
      return Math.abs(z0 === z1 ? lz : lx) > 0.6 ? 0.55 : WALL_H;
    });

    heights.forEach((height, i) => {
      const mesh = meshes.current[i];
      if (!mesh) return;
      mesh.scale.y = height / WALL_H;
      mesh.position.y = height / 2;
    });
    ART.forEach((piece, i) => {
      const group = art.current[i];
      if (group) group.visible = heights[piece.wall] >= WALL_TALL;
    });
    WINDOWS.forEach((win, i) => {
      const group = windows.current[i];
      if (group) group.visible = heights[win.wall] >= WALL_TALL;
    });
  });

  return (
    <group>
      {WALLS.map(([x0, z0, x1, z1, t], i) => {
        const across = z0 === z1;
        const len = Math.abs(across ? x1 - x0 : z1 - z0) + t; // overlap the corners
        return (
          <mesh
            key={i}
            ref={(m) => {
              meshes.current[i] = m;
            }}
            position={[(x0 + x1) / 2, WALL_H / 2, (z0 + z1) / 2]}
            material={wallMaterials}
            castShadow
            receiveShadow
          >
            <boxGeometry args={across ? [len, WALL_H, t] : [t, WALL_H, len]} />
          </mesh>
        );
      })}
      {WINDOWS.map((win, i) => (
        <group
          key={`window-${i}`}
          ref={(g) => {
            windows.current[i] = g;
          }}
        >
          <Window {...win} />
        </group>
      ))}
      {ART.map((piece, i) => (
        <group
          key={i}
          ref={(g) => {
            art.current[i] = g;
          }}
        >
          <Artwork {...piece} />
        </group>
      ))}
    </group>
  );
}

/** Position and turn for something hung on the inside face of an outside wall. */
function onWall(wall: number, at: number, y: number, out = 0.02) {
  const [x0, z0, , , t] = WALLS[wall];
  const [nx, nz] = OUTWARD[wall];
  const inset = t / 2 + out;
  const position: [number, number, number] = nz !== 0 ? [at, y, z0 - nz * inset] : [x0 - nx * inset, y, at];
  const rotationY = nz === -1 ? 0 : nz === 1 ? Math.PI : nx === -1 ? Math.PI / 2 : -Math.PI / 2;
  return { position, rotationY };
}

const frameMetal = new THREE.MeshStandardMaterial({ color: "#2a2b30", roughness: 0.35, metalness: 0.7 });
const sillStone = new THREE.MeshStandardMaterial({ color: "#e4e0d8", roughness: 0.5 });
const blindFabric = new THREE.MeshStandardMaterial({ color: "#1f2126", roughness: 0.95 });

/**
 * A window with a blackout roller blind. Click it to pull the blind all the
 * way down, click again to raise it back.
 */
function Window({ wall, at, w, drop, panes }: { wall: number; at: number; w: number; drop: number; panes: number }) {
  const invalidate = useThree((s) => s.invalidate);
  const glass = useMemo(() => paintArt("daylight", w / WINDOW_H), [w]);
  const [closed, setClosed] = useState(false);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const fabric = useRef<THREE.Mesh>(null);
  const rail = useRef<THREE.Mesh>(null);
  const current = useRef(drop);
  const target = closed ? 0.96 : drop;

  const h = WINDOW_H;
  const inner = w - 0.08;
  useFrame((_, delta) => {
    const diff = target - current.current;
    if (Math.abs(diff) > 0.001) {
      current.current += diff * Math.min(1, delta * 6);
      invalidate();
    } else {
      current.current = target;
    }
    const d = Math.max(0.02, current.current);
    if (fabric.current) {
      fabric.current.scale.y = d;
      fabric.current.position.y = h / 2 - (h * d) / 2;
    }
    if (rail.current) rail.current.position.y = h / 2 - h * d;
  });

  const { position, rotationY } = onWall(wall, at, WINDOW_Y, 0);
  const bar = 0.05;

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (e.delta >= DRAG_PX) return;
        setClosed((c) => !c);
        invalidate();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Daylight glass, set slightly back into the wall */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[inner, h - 0.08]} />
        <meshStandardMaterial map={glass} emissiveMap={glass} emissive="#ffffff" emissiveIntensity={0.85} roughness={0.15} metalness={0.1} />
      </mesh>
      {/* Frame and mullions */}
      <mesh position={[0, h / 2 - bar / 2, 0.03]} material={frameMetal} castShadow>
        <boxGeometry args={[w, bar, 0.06]} />
      </mesh>
      <mesh position={[0, -h / 2 + bar / 2, 0.03]} material={frameMetal}>
        <boxGeometry args={[w, bar, 0.06]} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[(side * (w - bar)) / 2, 0, 0.03]} material={frameMetal}>
          <boxGeometry args={[bar, h, 0.06]} />
        </mesh>
      ))}
      {Array.from({ length: panes - 1 }, (_, i) => (
        <mesh key={i} position={[-w / 2 + ((i + 1) * w) / panes, 0, 0.03]} material={frameMetal}>
          <boxGeometry args={[0.035, h, 0.05]} />
        </mesh>
      ))}
      {/* Sill */}
      <mesh position={[0, -h / 2 - 0.02, 0.07]} material={sillStone} castShadow receiveShadow>
        <boxGeometry args={[w + 0.12, 0.04, 0.16]} />
      </mesh>
      {/* Blackout roller blind: cassette, fabric and bottom rail */}
      <mesh position={[0, h / 2 + 0.05, 0.07]} material={frameMetal} castShadow>
        <boxGeometry args={[w + 0.04, 0.1, 0.1]} />
      </mesh>
      <mesh ref={fabric} position={[0, h / 2 - (h * drop) / 2, 0.075]} scale={[1, drop, 1]} material={blindFabric} castShadow>
        <boxGeometry args={[w - 0.02, h, 0.008]} />
      </mesh>
      <mesh ref={rail} position={[0, h / 2 - h * drop, 0.08]} material={frameMetal}>
        <boxGeometry args={[w - 0.01, 0.025, 0.025]} />
      </mesh>
    </group>
  );
}

/** One framed piece, hung flat on the inside face of its wall. */
function Artwork({
  wall,
  at,
  y,
  w,
  h,
  kind,
  frame,
}: {
  wall: number;
  at: number;
  y: number;
  w: number;
  h: number;
  kind: ArtKind;
  frame?: "black" | "oak";
}) {
  const invalidate = useThree((s) => s.invalidate);
  const map = useMemo(() => paintArt(kind, w / h), [kind, w, h]);

  useEffect(() => {
    if (kind === "sign") void drawSign(map).then(() => invalidate(), () => {});
  }, [kind, map, invalidate]);

  const { position, rotationY } = onWall(wall, at, y);
  const sign = kind === "sign";

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh castShadow>
        <boxGeometry args={[w, h, sign ? 0.05 : 0.035]} />
        <meshStandardMaterial
          color={sign ? "#17171b" : frame === "oak" ? "#b88a5a" : "#1a1a1f"}
          roughness={frame === "oak" ? 0.6 : 0.4}
          metalness={frame === "black" ? 0.3 : 0}
        />
      </mesh>
      <mesh position={[0, 0, sign ? 0.026 : 0.019]}>
        <planeGeometry args={sign ? [w, h] : [w - 0.06, h - 0.06]} />
        {sign ? (
          // Backlit lettering: the bright parts of the sign glow
          <meshStandardMaterial map={map} emissiveMap={map} emissive="#ffffff" emissiveIntensity={0.9} roughness={0.4} />
        ) : (
          <meshStandardMaterial map={map} roughness={0.85} />
        )}
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Furniture
// ---------------------------------------------------------------------------

/** Pointer travel (px) beyond which a press is a drag, not a click. */
const DRAG_PX = 8;

const metal = new THREE.MeshStandardMaterial({ color: "#1d1d22", roughness: 0.4, metalness: 0.6 });
const EMBER = "#facc15";

function Table({
  spot,
  selected,
  interactive,
  onClick,
  label,
}: {
  spot: TableSpot;
  selected: boolean;
  interactive: boolean;
  onClick: () => void;
  label: string;
}) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered && interactive);
  const { x, z, w, d } = spot;
  const legX = w / 2 - 0.06;
  const legZ = d / 2 - 0.06;

  return (
    <group position={[x, 0, z]}>
      <mesh
        position={[0, 0.74, 0]}
        castShadow
        receiveShadow
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          if (interactive && e.delta < DRAG_PX) onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        name={label}
      >
        <boxGeometry args={[w, 0.04, d]} />
        <meshStandardMaterial
          color={selected ? "#f3d27a" : "#d8b98f"}
          roughness={0.55}
          emissive={selected || (hovered && interactive) ? EMBER : "#000000"}
          emissiveIntensity={selected ? 0.25 : 0.12}
        />
      </mesh>
      {[
        [-legX, -legZ],
        [legX, -legZ],
        [-legX, legZ],
        [legX, legZ],
      ].map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.36, lz]} material={metal} castShadow>
          <boxGeometry args={[0.04, 0.72, 0.04]} />
        </mesh>
      ))}
    </group>
  );
}

type ChairState = "free" | "selected" | "booked" | "unavailable";

const FABRIC: Record<ChairState, string> = {
  free: "#2f3b4f",
  selected: EMBER,
  booked: "#3a3a40",
  unavailable: "#55555c",
};

const personMaterial = new THREE.MeshStandardMaterial({ color: "#8a94a6", roughness: 0.8 });

/** A seated figure: shows at a glance that a chair is taken. */
function Person() {
  return (
    <group>
      <mesh position={[0, 0.9, 0.06]} material={personMaterial} castShadow>
        <capsuleGeometry args={[0.15, 0.3, 6, 12]} />
      </mesh>
      <mesh position={[0, 1.32, 0.02]} material={personMaterial} castShadow>
        <sphereGeometry args={[0.11, 16, 12]} />
      </mesh>
      <mesh position={[0, 0.56, -0.14]} material={personMaterial} castShadow>
        <boxGeometry args={[0.32, 0.12, 0.36]} />
      </mesh>
      <mesh position={[0, 0.28, -0.3]} material={personMaterial} castShadow>
        <boxGeometry args={[0.28, 0.44, 0.1]} />
      </mesh>
    </group>
  );
}

function Chair({
  spot,
  state,
  interactive,
  onClick,
  onHover,
}: {
  spot: ChairSpot;
  state: ChairState;
  interactive: boolean;
  onClick: () => void;
  onHover: (seatId: string | null) => void;
}) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered && interactive);
  const lift = hovered && interactive ? 0.05 : 0;
  const fabric = FABRIC[state];
  const glow = state === "selected" ? 0.35 : hovered && interactive ? 0.15 : 0;

  return (
    <group
      position={[spot.x, lift, spot.z]}
      rotation={[0, TURN[spot.facing], 0]}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (interactive && e.delta < DRAG_PX) onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(spot.seatId);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
      }}
    >
      {/* A generous invisible hit area, so small chairs are easy to tap */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 1.2, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>

      <mesh position={[0, 0.03, 0]} material={metal} receiveShadow>
        <cylinderGeometry args={[0.26, 0.28, 0.04, 20]} />
      </mesh>
      <mesh position={[0, 0.25, 0]} material={metal} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 10]} />
      </mesh>
      <RoundedBox args={[0.5, 0.09, 0.48]} radius={0.035} smoothness={3} position={[0, 0.47, 0]} castShadow>
        <meshStandardMaterial color={fabric} roughness={0.85} emissive={glow ? EMBER : "#000000"} emissiveIntensity={glow} />
      </RoundedBox>
      <RoundedBox args={[0.46, 0.5, 0.07]} radius={0.035} smoothness={3} position={[0, 0.8, 0.23]} rotation={[0.12, 0, 0]} castShadow>
        <meshStandardMaterial color={fabric} roughness={0.85} emissive={glow ? EMBER : "#000000"} emissiveIntensity={glow} />
      </RoundedBox>

      {state === "booked" ? <Person /> : null}
      {state === "selected" ? (
        <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.36, 0.44, 40]} />
          <meshBasicMaterial color={EMBER} transparent opacity={0.85} toneMapped={false} />
        </mesh>
      ) : null}
    </group>
  );
}

function Plant({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.16, 0.4, 16]} />
        <meshStandardMaterial color="#2a2a2f" roughness={0.7} />
      </mesh>
      {[
        [0, 0.7, 0, 0.32],
        [0.14, 0.92, 0.06, 0.24],
        [-0.12, 0.88, -0.08, 0.22],
        [0.02, 1.1, -0.02, 0.18],
      ].map(([px, py, pz, r], i) => (
        <mesh key={i} position={[px, py, pz]} castShadow>
          <icosahedronGeometry args={[r, 1]} />
          <meshStandardMaterial color={i % 2 ? "#3f7a46" : "#356b3c"} roughness={0.8} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function Fixtures() {
  const white = <meshStandardMaterial color="#f4f4f2" roughness={0.25} />;
  return (
    <group>
      {/* Reception counter, an L facing the entrance */}
      <mesh position={[1.9, 0.53, 7.4]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 1.06, 0.55]} />
        <meshStandardMaterial color="#3a3530" roughness={0.6} />
      </mesh>
      <mesh position={[2.85, 0.53, 7.95]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 1.06, 0.6]} />
        <meshStandardMaterial color="#3a3530" roughness={0.6} />
      </mesh>
      <mesh position={[1.9, 1.075, 7.4]} castShadow>
        <boxGeometry args={[2.3, 0.03, 0.65]} />
        <meshStandardMaterial color="#efece6" roughness={0.25} />
      </mesh>
      {/* Bathroom: basin; toilet: WC */}
      {[9.35, 11.25].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.82, 10.2]} castShadow>
            <boxGeometry args={[0.55, 0.14, 0.4]} />
            {white}
          </mesh>
          <mesh position={[x - 0.45, 0.22, 6.0]} castShadow>
            <boxGeometry args={[0.4, 0.44, 0.55]} />
            {white}
          </mesh>
          <mesh position={[x - 0.45, 0.5, 5.75]} castShadow>
            <boxGeometry args={[0.42, 0.4, 0.16]} />
            {white}
          </mesh>
        </group>
      ))}
      <Plant x={0.45} z={0.45} />
      <Plant x={3.9} z={0.45} scale={0.85} />
      <Plant x={5.95} z={0.45} scale={0.85} />
      <Plant x={0.45} z={10.0} scale={0.9} />
      <Plant x={15.55} z={4.75} scale={0.8} />
      <Plant x={7.9} z={10.0} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Seats, tags and the camera
// ---------------------------------------------------------------------------

function Rooms({
  plan,
  booked,
  selected,
  loading,
  onToggleSeat,
  onToggleGroup,
  onHover,
}: Props & { onHover: (seatId: string | null) => void }) {

  return (
    <group>
      {ZONES.map((zone) => {
        const sold = offers(zone, plan);
        const isRoom = zone.bookAs === "room";
        const ids = zoneSeatIds(zone);
        const roomBooked = isRoom && ids.some((id) => booked.has(id));

        return (
          <group key={zone.id}>
            {zone.groups.map((group) => {
              const { tables, chairs } = furnish(group);
              const freeIds = isRoom ? ids : group.seats.map((s) => s.id).filter((id) => !booked.has(id));
              const groupOpen = sold && !loading && freeIds.length > 0 && !roomBooked;
              const groupSelected = groupOpen && freeIds.every((id) => selected.has(id));

              return (
                <group key={group.id}>
                  {tables.map((spot, i) => (
                    <Table
                      key={i}
                      spot={spot}
                      label={`${zone.name} ${group.name}`}
                      selected={groupSelected}
                      interactive={groupOpen}
                      onClick={() => onToggleGroup(freeIds)}
                    />
                  ))}
                  {chairs.map((spot) => {
                    const state: ChairState = booked.has(spot.seatId)
                      ? "booked"
                      : !sold || roomBooked
                        ? "unavailable"
                        : selected.has(spot.seatId)
                          ? "selected"
                          : "free";
                    return (
                      <Chair
                        key={spot.seatId}
                        spot={spot}
                        state={state}
                        interactive={!loading && (state === "free" || state === "selected")}
                        onHover={onHover}
                        onClick={() => (isRoom ? onToggleGroup(ids) : onToggleSeat(spot.seatId))}
                      />
                    );
                  })}
                </group>
              );
            })}
          </group>
        );
      })}

    </group>
  );
}

// ---------------------------------------------------------------------------
// Labels: ordinary DOM laid over the canvas, moved to follow 3D points
// ---------------------------------------------------------------------------

type Anchor = { id: string; x: number; y: number; z: number };

/** Building-space point to world space (the model is centred on the origin). */
const toWorld = (x: number, y: number, z: number): Anchor => ({ id: "", x: x - W / 2, y, z: z - D / 2 });

const FIXED_ANCHORS: Anchor[] = [
  ...Object.entries(TAGS).map(([id, [x, z]]) => ({ ...toWorld(x, id === "quiet" ? 1.7 : WALL_TALL + 0.45, z), id: `zone:${id}` })),
  { ...toWorld(1.9, 0.05, 9.2), id: "label:Reception" },
  { ...toWorld(10.0, 0.05, 4.75), id: "label:Corridor" },
  { ...toWorld(9.35, 0.05, 8.2), id: "label:Bathroom" },
  { ...toWorld(11.25, 0.05, 8.2), id: "label:Toilet" },
  { ...toWorld(1.6, 0.05, 10.85), id: "entrance" },
];

/** Each rendered frame, moves every label element to its anchor's screen position. */
function Projector({ anchors, els }: { anchors: Anchor[]; els: React.RefObject<Map<string, HTMLElement>> }) {
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, size }) => {
    for (const a of anchors) {
      const el = els.current.get(a.id);
      if (!el) continue;
      v.set(a.x, a.y, a.z).project(camera);
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
      el.style.visibility = v.z > 1 ? "hidden" : "visible";
    }
  });
  return null;
}

function RoomTag({ zone, state }: { zone: Zone; state: ReturnType<typeof roomState> }) {
  return (
    <div
      className={cn(
        "whitespace-nowrap rounded-xl border bg-ink-950/85 px-3 py-2 text-center shadow-lift backdrop-blur-md",
        state.roomSelected ? "border-ember-400/60" : "border-white/10"
      )}
    >
      <div className="text-xs font-semibold text-white">{zone.name}</div>
      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-ember-400">{state.price}</div>
      {state.status ? (
        <div className={cn("font-mono text-[10px] uppercase tracking-wider", state.warn ? "text-red-400" : "text-ink-400")}>
          {state.status}
        </div>
      ) : null}
    </div>
  );
}

function SeatTip({ seatId, plan, booked }: { seatId: string; plan: PlanId; booked: boolean }) {
  const info = SEATS[seatId];
  const rate = info.zone.rates[plan];
  return (
    <div className="whitespace-nowrap rounded-lg border border-white/15 bg-ink-900/95 px-2.5 py-1.5 text-xs text-white shadow-lift">
      {seatName(info)}
      <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-ember-400">
        {booked
          ? "Booked"
          : rate === undefined
            ? `Not on a ${PLANS[plan].unit} pass`
            : `${formatNaira(rate)} / ${PLANS[plan].unit}${info.zone.bookAs === "room" ? " · whole room" : ""}`}
      </span>
    </div>
  );
}

function seatAnchor(seatId: string): Anchor | null {
  const spot = furnish(SEATS[seatId].group).chairs.find((c) => c.seatId === seatId);
  return spot ? { ...toWorld(spot.x, 1.75, spot.z), id: "tip" } : null;
}

/** Building-space rect to a world-space box (the model is centred on the origin). */
function boxFor([x0, z0, x1, z1]: Rect) {
  // Tall enough to include the name tags floating above the back wall
  return new THREE.Box3(new THREE.Vector3(x0 - W / 2, 0, z0 - D / 2), new THREE.Vector3(x1 - W / 2, WALL_TALL + 0.8, z1 - D / 2));
}

/**
 * How far back the camera must sit, looking from (azimuth, polar), for every
 * corner of `box` to be on screen. camera-controls' own fitToBox snaps the view
 * to the nearest 90°, which loses the three-quarter angle.
 */
function fitDistance(box: THREE.Box3, azimuth: number, polar: number, camera: THREE.PerspectiveCamera) {
  const center = box.getCenter(new THREE.Vector3());
  const toCamera = new THREE.Vector3().setFromSphericalCoords(1, polar, azimuth);
  const forward = toCamera.clone().negate();
  const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
  const up = new THREE.Vector3().crossVectors(right, forward).normalize();
  const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const tanH = tanV * camera.aspect;

  let distance = 0;
  const p = new THREE.Vector3();
  for (const x of [box.min.x, box.max.x])
    for (const y of [box.min.y, box.max.y])
      for (const z of [box.min.z, box.max.z]) {
        p.set(x, y, z).sub(center);
        const depth = p.dot(forward);
        distance = Math.max(distance, Math.abs(p.dot(right)) / tanH - depth, Math.abs(p.dot(up)) / tanV - depth);
      }
  return { center, toCamera, distance };
}

/** Looking in from the entrance side, about 40° above the floor. */
const START = { azimuth: 0, polar: 0.88 };

function CameraRig({
  controls,
  focus,
  calm,
}: {
  controls: React.RefObject<CameraControlsImpl | null>;
  focus: FocusId;
  calm: boolean;
}) {
  const invalidate = useThree((s) => s.invalidate);
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const connected = useThree((s) => s.events.connected) as HTMLElement | undefined;
  const first = useRef(true);

  // camera-controls claims every touch on the canvas (touch-action: none), which
  // traps the page. Hand one-finger vertical swipes back to the browser so the
  // page scrolls, and stop two-finger moves scrolling it so they pinch and pan
  // the model instead. Sideways one-finger swipes turn the model.
  // On laptops, a trackpad pinch (a wheel event with ctrlKey) zooms; a plain
  // wheel still scrolls the page.
  useEffect(() => {
    const el = connected ?? gl.domElement;
    el.style.setProperty("touch-action", "pan-y");
    const keepTwoFingers = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    const trackpadPinch = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      void controls.current?.dolly(-e.deltaY * 0.05, false);
    };
    el.addEventListener("touchmove", keepTwoFingers, { passive: false });
    el.addEventListener("wheel", trackpadPinch, { passive: false });
    return () => {
      el.removeEventListener("touchmove", keepTwoFingers);
      el.removeEventListener("wheel", trackpadPinch);
    };
  }, [connected, gl, controls]);

  useEffect(() => {
    const c = controls.current;
    if (!c || !(camera instanceof THREE.PerspectiveCamera)) return;
    const animate = !first.current && !calm;
    const azimuth = first.current && focus === "all" ? START.azimuth : FOCUS[focus].azimuth;
    const polar = first.current ? START.polar : c.polarAngle;
    first.current = false;

    const { center, toCamera, distance } = fitDistance(boxFor(FOCUS[focus].rect), azimuth, polar, camera);
    // A little extra room for the room shortcuts across the top
    const d = distance * 1.15;
    void c.setLookAt(
      center.x + toCamera.x * d,
      center.y + toCamera.y * d,
      center.z + toCamera.z * d,
      center.x,
      center.y,
      center.z,
      animate
    );
    invalidate();
  }, [controls, camera, focus, calm, invalidate]);

  const A = CameraControlsImpl.ACTION;
  return (
    <CameraControls
      ref={controls}
      makeDefault
      minPolarAngle={0.2}
      maxPolarAngle={1.3}
      minDistance={3}
      maxDistance={40}
      smoothTime={0.35}
      mouseButtons={{ left: A.ROTATE, middle: A.DOLLY, right: A.TRUCK, wheel: A.NONE }}
      touches={{ one: A.TOUCH_ROTATE, two: A.TOUCH_DOLLY_TRUCK, three: A.TOUCH_TRUCK }}
    />
  );
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

const coarseQuery = "(pointer: coarse)";
const calmQuery = "(prefers-reduced-motion: reduce)";
const subscribeTo = (query: string) => (cb: () => void) => {
  const m = window.matchMedia(query);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const narrowQuery = "(max-width: 767px)";
const subscribeCoarse = subscribeTo(coarseQuery);
const subscribeCalm = subscribeTo(calmQuery);
const subscribeNarrow = subscribeTo(narrowQuery);

export default function Building3D(props: Props) {
  const touch = useSyncExternalStore(subscribeCoarse, () => window.matchMedia(coarseQuery).matches, () => false);
  const calm = useSyncExternalStore(subscribeCalm, () => window.matchMedia(calmQuery).matches, () => false);
  const narrow = useSyncExternalStore(subscribeNarrow, () => window.matchMedia(narrowQuery).matches, () => false);
  // On a phone the whole floor makes chairs too small to tap, so start on the main room.
  const [focus, setFocus] = useState<FocusId>(narrow ? "main" : "all");
  const controls = useRef<CameraControlsImpl | null>(null);
  const [hoverSeat, setHoverSeat] = useState<string | null>(null);
  const [gestureHint, setGestureHint] = useState(touch);
  useEffect(() => {
    if (!gestureHint) return;
    const t = setTimeout(() => setGestureHint(false), 7000);
    return () => clearTimeout(t);
  }, [gestureHint]);
  const labelEls = useRef(new Map<string, HTMLElement>());
  const tip = hoverSeat ? seatAnchor(hoverSeat) : null;
  const anchors = useMemo(() => (tip ? [...FIXED_ANCHORS, tip] : FIXED_ANCHORS), [tip]);
  const place = (id: string) => (el: HTMLElement | null) => {
    if (el) labelEls.current.set(id, el);
    else labelEls.current.delete(id);
  };

  const turn = (angle: number) => void controls.current?.rotate(angle, 0, !calm);
  const zoom = (distance: number) => void controls.current?.dolly(distance, !calm);

  return (
    <div className="relative h-[460px] overflow-hidden rounded-xl bg-[radial-gradient(ellipse_at_50%_35%,#24242b_0%,#0d0d10_70%)] sm:h-[540px] lg:h-[620px]">
      <p className="sr-only">
        A 3D model of the building. To pick seats with a keyboard or screen reader, switch to the floor plan view.
      </p>

      <Canvas
        shadows="soft"
        frameloop="demand"
        dpr={[1, 1.75]}
        camera={{ position: [0, 12, 16], fov: 34, near: 0.1, far: 200 }}
        gl={{ antialias: true }}
        aria-hidden="true"
      >
        <hemisphereLight args={["#fff6e6", "#20202a", 0.9]} />
        <ambientLight intensity={0.25} />
        <directionalLight
          position={[-7, 15, 9]}
          intensity={2.4}
          color="#fff3df"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0005}
          shadow-normalBias={0.02}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          shadow-camera-near={1}
          shadow-camera-far={45}
        />
        <directionalLight position={[9, 8, -6]} intensity={0.75} color="#c9d6ff" />

        <group position={[-W / 2, 0, -D / 2]}>
          {/* Plinth the model stands on */}
          <mesh position={[W / 2, -0.13, D / 2]} receiveShadow>
            <boxGeometry args={[W + 0.6, 0.25, D + 0.6]} />
            <meshStandardMaterial color="#16161b" roughness={0.9} />
          </mesh>
          {FLOORS.map((f, i) => (
            <Floor key={i} rect={f.rect} kind={f.kind} />
          ))}
          <Walls />
          <Fixtures />
          <Rooms {...props} onHover={setHoverSeat} />
        </group>

        <Projector anchors={anchors} els={labelEls} />
        <CameraRig controls={controls} focus={focus} calm={calm} />
      </Canvas>

      {/* Labels, positioned by <Projector> each frame */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {ZONES.filter((z) => TAGS[z.id]).map((zone) => (
          <div key={zone.id} ref={place(`zone:${zone.id}`)} className="invisible absolute left-0 top-0">
            <RoomTag zone={zone} state={roomState(zone, props.plan, props.booked, props.selected, props.loading)} />
          </div>
        ))}
        {["Reception", "Corridor", "Bathroom", "Toilet"].map((text) => (
          <div
            key={text}
            ref={place(`label:${text}`)}
            className="invisible absolute left-0 top-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-ink-700"
          >
            {text}
          </div>
        ))}
        <div
          ref={place("entrance")}
          className="invisible absolute left-0 top-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-ember-400"
        >
          ↑ Entrance
        </div>
        {hoverSeat ? (
          <div ref={place("tip")} className="invisible absolute left-0 top-0 z-10">
            <SeatTip seatId={hoverSeat} plan={props.plan} booked={props.booked.has(hoverSeat)} />
          </div>
        ) : null}
      </div>

      {gestureHint ? (
        <div className="pointer-events-none absolute inset-x-3 top-14 flex justify-center">
          <p className="rounded-full border border-white/15 bg-ink-950/85 px-3 py-1.5 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-ink-200 backdrop-blur-md">
            Pinch to zoom · two fingers to move · swipe sideways to turn
          </p>
        </div>
      ) : null}

      {/* Room shortcuts */}
      <div className="scrollbar-none absolute inset-x-0 top-0 flex gap-1.5 overflow-x-auto p-3">
        {(Object.keys(FOCUS) as FocusId[]).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setFocus(id)}
            aria-pressed={focus === id}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-md transition-colors",
              focus === id
                ? "border-white bg-white text-ink-950"
                : "border-white/15 bg-ink-950/70 text-ink-200 hover:border-white/30 hover:text-white"
            )}
          >
            {FOCUS[id].label}
          </button>
        ))}
      </div>

      {/* Turn and zoom */}
      <div className="absolute bottom-3 right-3 flex gap-1.5">
        <ViewButton label="Turn left" onClick={() => turn(Math.PI / 4)}>
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />
        </ViewButton>
        <ViewButton label="Turn right" onClick={() => turn(-Math.PI / 4)}>
          <path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" />
        </ViewButton>
        <ViewButton label="Zoom in" onClick={() => zoom(2.5)}>
          <path d="M12 5v14M5 12h14" />
        </ViewButton>
        <ViewButton label="Zoom out" onClick={() => zoom(-2.5)}>
          <path d="M5 12h14" />
        </ViewButton>
      </div>

      <p className="pointer-events-none absolute right-4 top-5 hidden font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400 lg:block">
        {touch ? "Tap a chair to pick it" : "Drag to look around · click a chair to pick it"}
      </p>
    </div>
  );
}

function ViewButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-ink-950/75 text-ink-200 backdrop-blur-md transition-colors hover:border-white/30 hover:text-white"
    >
      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  );
}
