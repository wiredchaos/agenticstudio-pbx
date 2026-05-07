// Shared shader sources for WebGPU (WGSL) and WebGL2 (GLSL) panorama backgrounds.
// Procedural equirectangular sky: dark cinematic vignette + slow drifting volumetric
// gold light streaks (matches Agentic Studios reference) + subtle film grain.

export const WGSL = /* wgsl */ `
struct Info {
  resolution : vec2<f32>,
  yawPitch   : vec2<f32>,
  time       : f32,
  dolly      : f32,
  parallax   : f32,
  _pad       : f32,
};
@group(0) @binding(0) var<uniform> info : Info;

struct VsOut {
  @builtin(position) pos : vec4<f32>,
  @location(0) uv : vec2<f32>,
};

@vertex
fn vs(@builtin(vertex_index) vid : u32) -> VsOut {
  // Fullscreen triangle
  var p = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 3.0, -1.0),
    vec2<f32>(-1.0,  3.0)
  );
  var o : VsOut;
  o.pos = vec4<f32>(p[vid], 0.0, 1.0);
  o.uv  = (p[vid] + vec2<f32>(1.0, 1.0)) * 0.5;
  return o;
}

fn hash(p : vec2<f32>) -> f32 {
  let h = dot(p, vec2<f32>(127.1, 311.7));
  return fract(sin(h) * 43758.5453);
}

fn noise(p : vec2<f32>) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let a = hash(i);
  let b = hash(i + vec2<f32>(1.0, 0.0));
  let c = hash(i + vec2<f32>(0.0, 1.0));
  let d = hash(i + vec2<f32>(1.0, 1.0));
  let u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

fn fbm(p : vec2<f32>) -> f32 {
  var v = 0.0;
  var a = 0.5;
  var q = p;
  for (var i = 0; i < 5; i = i + 1) {
    v = v + a * noise(q);
    q = q * 2.02;
    a = a * 0.5;
  }
  return v;
}

@fragment
fn fs(@location(0) uv : vec2<f32>) -> @location(0) vec4<f32> {
  let aspect = info.resolution.x / info.resolution.y;
  let ndc = (uv - vec2<f32>(0.5, 0.5)) * vec2<f32>(aspect, 1.0);
  let fov = mix(1.2, 0.7, clamp(info.dolly, 0.0, 1.0));
  let dir = normalize(vec3<f32>(ndc * fov, -1.0));

  // Apply yaw / pitch
  let cy = cos(info.yawPitch.x);
  let sy = sin(info.yawPitch.x);
  let cp = cos(info.yawPitch.y);
  let sp = sin(info.yawPitch.y);
  let d1 = vec3<f32>(dir.x, dir.y * cp - dir.z * sp, dir.y * sp + dir.z * cp);
  let d2 = vec3<f32>(d1.x * cy + d1.z * sy, d1.y, -d1.x * sy + d1.z * cy);

  // Equirectangular projection
  let lon = atan2(d2.x, -d2.z);
  let lat = asin(clamp(d2.y, -1.0, 1.0));
  let su = lon / 6.2831853 + 0.5;
  let sv = lat / 3.1415926 + 0.5;

  let t = info.time * 0.04;
  // nebula
  let n1 = fbm(vec2<f32>(su * 6.0 + t, sv * 6.0));
  let n2 = fbm(vec2<f32>(su * 12.0 - t * 0.7, sv * 12.0 + t * 0.5));

  // gold streaks emanating from horizon vanishing point
  let streak = pow(1.0 - abs(sv - 0.5) * 2.0, 6.0)
             * (0.5 + 0.5 * sin(su * 30.0 + t * 2.0 + n1 * 4.0));

  let bg = vec3<f32>(0.015, 0.012, 0.020) + n1 * 0.06 + n2 * 0.03;
  let gold = vec3<f32>(0.79, 0.65, 0.23);
  var col = bg + gold * streak * 0.35;

  // vignette
  let r = length(uv - vec2<f32>(0.5, 0.5));
  col = col * (1.0 - smoothstep(0.4, 0.95, r) * 0.85);

  // film grain
  let grain = (hash(uv * info.resolution + info.time) - 0.5) * 0.05;
  col = col + vec3<f32>(grain, grain, grain);

  return vec4<f32>(col, 1.0);
}
`;

export const GLSL_VERT = /* glsl */ `#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2((gl_VertexID == 1) ? 3.0 : -1.0, (gl_VertexID == 2) ? 3.0 : -1.0);
  vUv = (p + 1.0) * 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`;

export const GLSL_FRAG = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform vec2 uResolution;
uniform vec2 uYawPitch;
uniform float uTime;
uniform float uDolly;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
  vec2 u=f*f*(3.-2.*f);
  return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.02;a*=.5;}return v;}

void main(){
  float aspect=uResolution.x/uResolution.y;
  vec2 ndc=(vUv-.5)*vec2(aspect,1.);
  float fov=mix(1.2,.7,clamp(uDolly,0.,1.));
  vec3 dir=normalize(vec3(ndc*fov,-1.));
  float cy=cos(uYawPitch.x), sy=sin(uYawPitch.x);
  float cp=cos(uYawPitch.y), sp=sin(uYawPitch.y);
  vec3 d1=vec3(dir.x, dir.y*cp - dir.z*sp, dir.y*sp + dir.z*cp);
  vec3 d2=vec3(d1.x*cy + d1.z*sy, d1.y, -d1.x*sy + d1.z*cy);
  float lon=atan(d2.x,-d2.z);
  float lat=asin(clamp(d2.y,-1.,1.));
  float su=lon/6.2831853+.5, sv=lat/3.1415926+.5;
  float t=uTime*.04;
  float n1=fbm(vec2(su*6.+t, sv*6.));
  float n2=fbm(vec2(su*12.-t*.7, sv*12.+t*.5));
  float streak=pow(1.-abs(sv-.5)*2.,6.)*(.5+.5*sin(su*30.+t*2.+n1*4.));
  vec3 bg=vec3(.015,.012,.020)+n1*.06+n2*.03;
  vec3 gold=vec3(.79,.65,.23);
  vec3 col=bg+gold*streak*.35;
  float r=length(vUv-.5);
  col*=1.-smoothstep(.4,.95,r)*.85;
  float grain=(hash(vUv*uResolution+uTime)-.5)*.05;
  col+=vec3(grain);
  outColor=vec4(col,1.);
}`;
