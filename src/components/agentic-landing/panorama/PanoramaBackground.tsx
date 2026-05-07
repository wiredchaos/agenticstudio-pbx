import { useEffect, useRef } from "react";
import { WGSL, GLSL_VERT, GLSL_FRAG } from "./shaders";

/**
 * WebGPU procedural 360° equirectangular panorama background.
 * - Drag to orbit (yaw/pitch)
 * - Scroll to dolly forward
 * - Mouse parallax when idle
 * - WebGL2 fallback, then static gradient
 */
export function PanoramaBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    const state = {
      yaw: 0, pitch: 0,
      targetYaw: 0, targetPitch: 0,
      mouseYaw: 0, mousePitch: 0,
      dolly: 0, targetDolly: 0,
      dragging: false,
      lastX: 0, lastY: 0,
      time: 0,
      raf: 0,
    };

    const resize = () => {
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      state.dragging = true;
      state.lastX = e.clientX; state.lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (state.dragging) {
        const dx = e.clientX - state.lastX;
        const dy = e.clientY - state.lastY;
        state.lastX = e.clientX; state.lastY = e.clientY;
        state.targetYaw += dx * 0.005;
        state.targetPitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, state.targetPitch + dy * 0.005));
      } else {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        state.mouseYaw = nx * 0.08;
        state.mousePitch = ny * 0.05;
      }
    };
    const onPointerUp = (e: PointerEvent) => {
      state.dragging = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch { /* */ }
    };
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      state.targetDolly = Math.min(1, window.scrollY / max);
    };
    const onResize = () => resize();

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    resize();

    let cleanup = () => {};
    let stopped = false;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // ---------- WebGPU ----------
    const tryWebGPU = async (): Promise<boolean> => {
      // @ts-ignore experimental
      if (!navigator.gpu) return false;
      try {
        // @ts-ignore
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) return false;
        const device = await adapter.requestDevice();
        const ctx = canvas.getContext("webgpu") as any;
        if (!ctx) return false;
        // @ts-ignore
        const format = navigator.gpu.getPreferredCanvasFormat();
        ctx.configure({ device, format, alphaMode: "opaque" });

        const module = device.createShaderModule({ code: WGSL });
        const pipeline = device.createRenderPipeline({
          layout: "auto",
          vertex: { module, entryPoint: "vs" },
          fragment: { module, entryPoint: "fs", targets: [{ format }] },
          primitive: { topology: "triangle-list" },
        });

        const uniformBuf = device.createBuffer({
          size: 32, // vec2 + vec2 + 4 floats = 32
          usage: 0x40 | 0x08, // UNIFORM | COPY_DST
        });
        const bindGroup = device.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [{ binding: 0, resource: { buffer: uniformBuf } }],
        });

        const start = performance.now();
        const frame = () => {
          if (stopped) return;
          state.time = (performance.now() - start) / 1000;
          state.yaw = lerp(state.yaw, state.targetYaw + state.mouseYaw, 0.08);
          state.pitch = lerp(state.pitch, state.targetPitch + state.mousePitch, 0.08);
          state.dolly = lerp(state.dolly, state.targetDolly, 0.05);

          const data = new Float32Array([
            canvas.width, canvas.height,
            state.yaw, state.pitch,
            state.time, state.dolly, 0, 0,
          ]);
          device.queue.writeBuffer(uniformBuf, 0, data.buffer);

          const enc = device.createCommandEncoder();
          const view = ctx.getCurrentTexture().createView();
          const pass = enc.beginRenderPass({
            colorAttachments: [{ view, clearValue: { r: 0, g: 0, b: 0, a: 1 }, loadOp: "clear", storeOp: "store" }],
          });
          pass.setPipeline(pipeline);
          pass.setBindGroup(0, bindGroup);
          pass.draw(3, 1, 0, 0);
          pass.end();
          device.queue.submit([enc.finish()]);
          state.raf = requestAnimationFrame(frame);
        };
        frame();
        cleanup = () => { stopped = true; cancelAnimationFrame(state.raf); };
        return true;
      } catch {
        return false;
      }
    };

    // ---------- WebGL2 ----------
    const tryWebGL2 = (): boolean => {
      const gl = canvas.getContext("webgl2");
      if (!gl) return false;
      const compile = (type: number, src: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src); gl.compileShader(s); return s;
      };
      const prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, GLSL_VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, GLSL_FRAG));
      gl.linkProgram(prog);
      gl.useProgram(prog);
      const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
      const uRes = gl.getUniformLocation(prog, "uResolution");
      const uYP  = gl.getUniformLocation(prog, "uYawPitch");
      const uT   = gl.getUniformLocation(prog, "uTime");
      const uD   = gl.getUniformLocation(prog, "uDolly");
      const start = performance.now();
      const frame = () => {
        if (stopped) return;
        state.time = (performance.now() - start) / 1000;
        state.yaw = lerp(state.yaw, state.targetYaw + state.mouseYaw, 0.08);
        state.pitch = lerp(state.pitch, state.targetPitch + state.mousePitch, 0.08);
        state.dolly = lerp(state.dolly, state.targetDolly, 0.05);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform2f(uYP, state.yaw, state.pitch);
        gl.uniform1f(uT, state.time);
        gl.uniform1f(uD, state.dolly);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        state.raf = requestAnimationFrame(frame);
      };
      frame();
      cleanup = () => { stopped = true; cancelAnimationFrame(state.raf); };
      return true;
    };

    (async () => {
      if (reduceMotion) return; // skip GPU loops
      const ok = await tryWebGPU();
      if (!ok) tryWebGL2();
    })();

    return () => {
      stopped = true;
      cancelAnimationFrame(state.raf);
      cleanup();
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {/* CSS gradient fallback (always rendered behind canvas) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(201,165,58,0.18) 0%, rgba(0,0,0,0) 55%), #000",
        }}
      />
      <canvas
        ref={canvasRef}
        className="pointer-events-auto absolute inset-0 h-full w-full"
        style={{ touchAction: "none" }}
      />
    </div>
  );
}
