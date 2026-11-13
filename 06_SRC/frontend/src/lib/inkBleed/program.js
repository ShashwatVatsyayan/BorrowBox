/**
 * WebGL2 program helper
 * Ported from https://github.com/codemure-official/ink-bleed-theme-changer
 */
function compile(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('createShader failed');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost()) {
    const log = gl.getShaderInfoLog(shader) ?? '';
    gl.deleteShader(shader);
    throw new Error(`Shader compile error:\n${log}`);
  }
  return shader;
}

export function createProgram(gl, vert, frag) {
  const program = gl.createProgram();
  if (!program) throw new Error('createProgram failed');
  const vs = compile(gl, gl.VERTEX_SHADER, vert);
  const fs = compile(gl, gl.FRAGMENT_SHADER, frag);
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS) && !gl.isContextLost()) {
    throw new Error(`Program link error:\n${gl.getProgramInfoLog(program) ?? ''}`);
  }

  const cache = new Map();
  return {
    program,
    uniform(name) {
      if (!cache.has(name)) cache.set(name, gl.getUniformLocation(program, name));
      return cache.get(name) ?? null;
    },
  };
}

