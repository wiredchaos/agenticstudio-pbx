import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { DEVICES, thumb, type Device } from "./devices";

/* -------------------- Procedural panorama skybox -------------------- */
const PANORAMA_FRAG = /* glsl */ `
precision highp float;
varying vec3 vWorldDir;
uniform float uTime;
uniform float uEra; // 0..2  dawn -> dusk -> vapor

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
  vec2 u=f*f*(3.-2.*f);
  return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.02;a*=.5;}return v;}

void main(){
  vec3 d = normalize(vWorldDir);
  float lon = atan(d.x, -d.z);
  float lat = asin(clamp(d.y, -1., 1.));
  float su = lon / 6.2831853 + .5;
  float sv = lat / 3.1415926 + .5;

  float t = uTime * .03;
  float n1 = fbm(vec2(su*6.+t, sv*6.));
  float n2 = fbm(vec2(su*12.-t*.7, sv*12.+t*.5));
  float streak = pow(1.-abs(sv-.5)*2.,6.) * (.5+.5*sin(su*30.+t*2.+n1*4.));

  vec3 dawn  = vec3(0.79,0.65,0.23);
  vec3 dusk  = vec3(0.55,0.35,0.55);
  vec3 vapor = vec3(0.30,0.55,0.75);
  vec3 era = mix(dawn, dusk, clamp(uEra,0.,1.));
  era = mix(era, vapor, clamp(uEra-1.,0.,1.));

  vec3 bg = vec3(.012,.010,.018) + n1*0.05 + n2*0.025;
  vec3 col = bg + era * streak * 0.32;

  // soft horizon glow
  col += era * 0.04 * (1.0 - abs(sv-.5)*1.6);

  gl_FragColor = vec4(col, 1.0);
}
`;

const PANORAMA_VERT = /* glsl */ `
varying vec3 vWorldDir;
void main(){
  vWorldDir = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

function Skybox({ era }: { era: React.MutableRefObject<number> }) {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  useFrame(({ clock }) => {
    if (mat.current) {
      mat.current.uniforms.uTime.value = clock.elapsedTime;
      mat.current.uniforms.uEra.value = era.current;
    }
  });
  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 64, 32]} />
      <shaderMaterial
        ref={mat}
        side={THREE.BackSide}
        vertexShader={PANORAMA_VERT}
        fragmentShader={PANORAMA_FRAG}
        uniforms={{ uTime: { value: 0 }, uEra: { value: 0 } }}
      />
    </mesh>
  );
}

/* -------------------- Device card (one per video) -------------------- */
function DeviceCard({
  device,
  position,
  rotation,
  onOpen,
}: {
  device: Device;
  position: [number, number, number];
  rotation: [number, number, number];
  onOpen: (d: Device) => void;
}) {
  const tex = useLoader(THREE.TextureLoader, thumb(device.id));
  const ref = useRef<THREE.Group>(null!);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
  }, [tex]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // gentle float
    const t = clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.6 + position[0]) * 0.08;
    ref.current.rotation.z = rotation[2] + Math.sin(t * 0.4 + position[2]) * 0.02;
  });

  return (
    <group
      ref={ref}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onOpen(device);
      }}
    >
      {/* gold frame */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[3.4, 2.05]} />
        <meshBasicMaterial color={hover ? "#e8c66a" : "#c9a53a"} transparent opacity={0.85} />
      </mesh>
      {/* screen */}
      <mesh>
        <planeGeometry args={[3.2, 1.85]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      {/* subtle glow plane behind */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[3.8, 2.4]} />
        <meshBasicMaterial color="#c9a53a" transparent opacity={hover ? 0.25 : 0.1} />
      </mesh>
    </group>
  );
}

/* -------------------- Camera scroll rig -------------------- */
function ScrollRig({
  scroll,
  curve,
  era,
  mouse,
}: {
  scroll: React.MutableRefObject<number>;
  curve: THREE.CatmullRomCurve3;
  era: React.MutableRefObject<number>;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const tmpPos = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const t = Math.min(0.999, Math.max(0, scroll.current));
    curve.getPointAt(t, tmpPos);
    // mouse parallax
    tmpPos.x += mouse.current.x * 0.5;
    tmpPos.y += mouse.current.y * 0.3;
    camera.position.lerp(tmpPos, 0.08);

    const lookT = Math.min(0.999, t + 0.015);
    curve.getPointAt(lookT, target);
    camera.lookAt(target);

    // era 0..2 across the scroll
    era.current = t * 2.0;
  });
  return null;
}

/* -------------------- Public scene -------------------- */
export function ReelScene({
  scrollRef,
  onOpen,
}: {
  scrollRef: React.MutableRefObject<number>;
  onOpen: (d: Device) => void;
}) {
  const mouse = useRef({ x: 0, y: 0 });
  const era = useRef(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Build curved spline through 10 device positions
  const { curve, devicePositions } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const devPts: { pos: [number, number, number]; rot: [number, number, number] }[] = [];
    // Start point (hero)
    pts.push(new THREE.Vector3(0, 0, 0));

    DEVICES.forEach((_, i) => {
      // arrange devices along a winding S-curve, alternating sides
      const z = -8 - i * 7;
      const x = Math.sin(i * 0.9) * 4.5 + (i % 2 === 0 ? -1 : 1) * 0.6;
      const y = Math.cos(i * 0.7) * 1.2;
      const camOffsetX = i % 2 === 0 ? x + 4.5 : x - 4.5;
      const camOffsetY = y + 0.4;
      pts.push(new THREE.Vector3(camOffsetX, camOffsetY, z + 4));
      const yaw = i % 2 === 0 ? -0.45 : 0.45;
      devPts.push({ pos: [x, y, z], rot: [0, yaw, 0] });
    });

    // Outro: pull back
    pts.push(new THREE.Vector3(0, 6, -8 - DEVICES.length * 7 + 30));
    pts.push(new THREE.Vector3(0, 10, -8 - DEVICES.length * 7 + 60));

    const c = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
    return { curve: c, devicePositions: devPts };
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 60, near: 0.1, far: 1000, position: [0, 0, 0] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", touchAction: "pan-y" }}
    >
      <Skybox era={era} />
      <ambientLight intensity={0.6} />
      <ScrollRig scroll={scrollRef} curve={curve} era={era} mouse={mouse} />
      {DEVICES.map((d, i) => (
        <DeviceCard
          key={d.id}
          device={d}
          position={devicePositions[i].pos}
          rotation={devicePositions[i].rot}
          onOpen={onOpen}
        />
      ))}
    </Canvas>
  );
}
