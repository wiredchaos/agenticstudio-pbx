import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { thumb, type Device } from "./devices";

/* -------------------- Procedural panorama skybox -------------------- */
const PANORAMA_FRAG = /* glsl */ `
precision highp float;
varying vec3 vWorldDir;
uniform float uTime;
uniform float uEra;

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
  restYaw,
  segmentCenter,
  scrollRef,
  onOpen,
  accent,
  lightAccent,
}: {
  device: Device;
  position: [number, number, number];
  restYaw: number;
  segmentCenter: number;
  scrollRef: React.MutableRefObject<number>;
  onOpen: (d: Device) => void;
  accent: string;
  lightAccent: string;
}) {
  const tex = useLoader(THREE.TextureLoader, thumb(device.id));
  const ref = useRef<THREE.Group>(null!);
  const titleRef = useRef<any>(null);
  const subtitleRef = useRef<any>(null);
  const glowMatRef = useRef<THREE.MeshBasicMaterial>(null!);
  const [hover, setHover] = useState(false);
  const { camera } = useThree();

  const tmpObj = useMemo(() => new THREE.Object3D(), []);
  const restQuat = useMemo(
    () => new THREE.Quaternion().setFromEuler(new THREE.Euler(0, restYaw, 0)),
    [restYaw]
  );
  const faceQuat = useMemo(() => new THREE.Quaternion(), []);

  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
  }, [tex]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;

    // proximity 0..1 — peaks when scroll is at this device's segment center
    const dist = Math.abs(scrollRef.current - segmentCenter);
    const proximity = Math.max(0, 1 - dist * 6);

    // billboard: blend rest yaw -> facing camera by proximity
    tmpObj.position.set(position[0], position[1], position[2]);
    tmpObj.lookAt(camera.position);
    faceQuat.copy(tmpObj.quaternion);
    ref.current.quaternion.slerpQuaternions(restQuat, faceQuat, proximity);

    // float (damped near hero)
    const calm = 1 - proximity * 0.8;
    ref.current.position.y = position[1] + Math.sin(t * 0.6 + position[0]) * 0.08 * calm;

    // scale up at hero moment
    const s = 1 + proximity * 0.18 + (hover ? 0.04 : 0);
    ref.current.scale.setScalar(s);

    // title fade
    if (titleRef.current) {
      titleRef.current.fillOpacity = proximity;
      titleRef.current.outlineOpacity = proximity * 0.9;
    }
    if (subtitleRef.current) {
      subtitleRef.current.fillOpacity = proximity * 0.85;
    }
    if (glowMatRef.current) {
      glowMatRef.current.opacity = 0.08 + proximity * 0.22 + (hover ? 0.08 : 0);
    }
  });

  return (
    <group
      ref={ref}
      position={position}
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
        <meshBasicMaterial color={hover ? lightAccent : accent} transparent opacity={0.9} />
      </mesh>
      {/* screen */}
      <mesh>
        <planeGeometry args={[3.2, 1.85]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      {/* glow */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[3.8, 2.4]} />
        <meshBasicMaterial ref={glowMatRef} color={accent} transparent opacity={0.1} />
      </mesh>
      {/* 3D title above the card */}
      <Text
        ref={titleRef as any}
        position={[0, 1.55, 0.01]}
        fontSize={0.42}
        color={accent}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.012}
        outlineColor="#000000"
        maxWidth={6}
        textAlign="center"
        fillOpacity={0}
        outlineOpacity={0}
      >
        {device.title}
      </Text>
      <Text
        ref={subtitleRef as any}
        position={[0, 1.18, 0.01]}
        fontSize={0.16}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.18}
        fillOpacity={0}
      >
        {device.role.toUpperCase()}
      </Text>
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
    tmpPos.x += mouse.current.x * 0.5;
    tmpPos.y += mouse.current.y * 0.3;
    camera.position.lerp(tmpPos, 0.08);

    const lookT = Math.min(0.999, t + 0.015);
    curve.getPointAt(lookT, target);
    camera.lookAt(target);

    era.current = t * 2.0;
  });
  return null;
}

/* -------------------- Camera-locked active title (HUD) -------------------- */
function ActiveTitleHUD({
  scrollRef,
  segments,
}: {
  scrollRef: React.MutableRefObject<number>;
  segments: { title: string; center: number }[];
}) {
  const { camera } = useThree();
  const grpRef = useRef<THREE.Group>(null!);
  const textRef = useRef<any>(null);
  const [active, setActive] = useState(0);
  const fade = useRef(0);

  useFrame(() => {
    if (!grpRef.current) return;
    // place 6 units in front of camera
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    grpRef.current.position
      .copy(camera.position)
      .add(fwd.multiplyScalar(6))
      .add(new THREE.Vector3(0, -1.6, 0));
    grpRef.current.quaternion.copy(camera.quaternion);

    // find nearest segment
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < segments.length; i++) {
      const d = Math.abs(scrollRef.current - segments[i].center);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    if (best !== active) setActive(best);

    // fade in/out as it moves between segments — strongest near a segment center
    const target = Math.max(0, 1 - bestD * 12);
    fade.current += (target - fade.current) * 0.08;
    if (textRef.current) textRef.current.fillOpacity = fade.current * 0.65;
  });

  return (
    <group ref={grpRef}>
      <Text
        ref={textRef as any}
        fontSize={0.22}
        color="#c9a53a"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.25}
        fillOpacity={0}
      >
        {segments[active]?.title.toUpperCase() ?? ""}
      </Text>
    </group>
  );
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

  const { curve, devicePositions, segments } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const devPts: { pos: [number, number, number]; restYaw: number; center: number }[] = [];
    pts.push(new THREE.Vector3(0, 0, 0));

    const total = DEVICES.length + 2; // hero + outro
    DEVICES.forEach((_, i) => {
      const z = -8 - i * 7;
      const x = Math.sin(i * 0.9) * 4.5 + (i % 2 === 0 ? -1 : 1) * 0.6;
      const y = Math.cos(i * 0.7) * 1.2;
      const camOffsetX = i % 2 === 0 ? x + 4.5 : x - 4.5;
      const camOffsetY = y + 0.4;
      pts.push(new THREE.Vector3(camOffsetX, camOffsetY, z + 4));
      const restYaw = i % 2 === 0 ? -0.45 : 0.45;
      const center = (i + 1) / (total - 1);
      devPts.push({ pos: [x, y, z], restYaw, center });
    });

    pts.push(new THREE.Vector3(0, 6, -8 - DEVICES.length * 7 + 30));
    pts.push(new THREE.Vector3(0, 10, -8 - DEVICES.length * 7 + 60));

    const c = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
    const segs = devPts.map((d, i) => ({ title: DEVICES[i].title, center: d.center }));
    return { curve: c, devicePositions: devPts, segments: segs };
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 60, near: 0.1, far: 1000, position: [0, 0, 0] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", touchAction: "pan-y" }}
    >
      <Skybox era={era} />
      <ambientLight intensity={0.6} />
      <ScrollRig scroll={scrollRef} curve={curve} era={era} mouse={mouse} />
      {DEVICES.map((d, i) => (
        <DeviceCard
          key={d.id}
          device={d}
          position={devicePositions[i].pos}
          restYaw={devicePositions[i].restYaw}
          segmentCenter={devicePositions[i].center}
          scrollRef={scrollRef}
          onOpen={onOpen}
        />
      ))}
      <ActiveTitleHUD scrollRef={scrollRef} segments={segments} />
    </Canvas>
  );
}
