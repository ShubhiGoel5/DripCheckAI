import { useEffect, useRef } from "react";

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;

  vec3 palette(float t) {
    vec3 pink = vec3(1.0, 0.235, 0.674);
    vec3 purple = vec3(0.471, 0.294, 0.627);
    vec3 cyan = vec3(0.169, 1.0, 0.996);
    vec3 orange = vec3(1.0, 0.549, 0.259);
    vec3 yellow = vec3(1.0, 0.894, 0.369);
    vec3 a = mix(pink, purple, smoothstep(0.0, 0.45, t));
    vec3 b = mix(cyan, orange, smoothstep(0.25, 0.85, t));
    return mix(a, mix(b, yellow, 0.18), smoothstep(0.35, 1.0, t));
  }

  float wave(vec2 p, float speed, float scale) {
    return sin((p.x * 1.7 + p.y * 1.25) * scale + u_time * speed);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

    float aurora = 0.0;
    aurora += wave(p + vec2(sin(u_time * 0.08), cos(u_time * 0.05)) * 0.32, 0.42, 1.65) * 0.26;
    aurora += wave(p.yx + vec2(0.35, -0.2), -0.33, 2.85) * 0.18;
    aurora += sin(length(p - vec2(0.34, -0.12)) * 3.5 - u_time * 0.52) * 0.12;

    float beam = smoothstep(0.82, 0.08, abs(p.y + aurora * 0.78 - 0.04));
    float spotlight = smoothstep(1.05, 0.05, length(p - vec2(-0.58, -0.26)));
    float cyanLift = smoothstep(0.98, 0.1, length(p - vec2(0.7, 0.22)));
    float heat = smoothstep(0.78, 0.06, length(p - vec2(0.48, -0.62)));

    vec3 color = vec3(0.985, 0.985, 0.985);
    color = mix(color, palette(fract(aurora * 0.45 + uv.x * 0.8 + u_time * 0.025)), beam * 0.48);
    color += vec3(1.0, 0.235, 0.674) * spotlight * 0.22;
    color += vec3(0.169, 1.0, 0.996) * cyanLift * 0.18;
    color += vec3(1.0, 0.549, 0.259) * heat * 0.20;
    color += vec3(1.0, 0.894, 0.369) * pow(max(0.0, beam), 2.0) * 0.12;

    float vignette = smoothstep(1.36, 0.25, length(p * vec2(0.72, 0.92)));
    color = mix(vec3(1.0), color, vignette);

    gl_FragColor = vec4(color, 0.92);
  }
`;

const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
};

export const ShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { alpha: true, antialias: true });
    if (!canvas || !gl) return;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    let animationFrame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const render = (time: number) => {
      gl.useProgram(program);
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrame = window.requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrame);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#FAFAFA]" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full opacity-95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,60,172,0.18),transparent_28%),radial-gradient(circle_at_82%_24%,rgba(43,255,254,0.2),transparent_26%),radial-gradient(circle_at_72%_82%,rgba(255,140,66,0.18),transparent_26%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,250,250,0.18),rgba(250,250,250,0.82)_82%)]" />
    </div>
  );
};
