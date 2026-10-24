/* SPDX-License-Identifier: MIT — original pearl-point material; no dependencies. */
(() => {
  "use strict";
  const vertex = `
    precision mediump float;
    attribute vec2 position;
    attribute float size;
    attribute vec3 color;
    attribute float variation;
    uniform float pixelRatio;
    uniform float mirror;
    uniform mediump float glow;
    varying mediump vec3 pigment;
    varying mediump float seed;
    varying mediump float reflection;
    void main() {
      gl_Position = vec4(position.x, mix(position.y, -1.55-position.y, mirror), 0.0, 1.0);
      reflection = mirror;
      gl_PointSize = size * pixelRatio * mix(1.0, 4.0, glow);
      pigment = color;
      seed = variation;
    }`;
  const fragment = `
    precision mediump float;
    uniform mediump float glow;
    varying mediump vec3 pigment;
    varying mediump float seed;
    varying mediump float reflection;
    void main() {
      vec2 uv = gl_PointCoord * 2.0 - 1.0;
      float r = dot(uv, uv);
      if (r > 1.0) discard;
      if (glow > 0.5) {
        if (seed < 0.94) discard;
        gl_FragColor = vec4(pigment, exp(-r * 4.0) * 0.10 * (1.0-reflection*.9));
      } else {
        vec3 n = vec3(uv.x, -uv.y, sqrt(max(0.0, 1.0 - r)));
        vec3 light = normalize(vec3(-0.5, 0.7, 1.3));
        float diffuse = max(0.0, dot(n, light));
        float specular = pow(max(0.0, dot(n, normalize(vec3(-0.32, 0.42, 1.0)))), 22.0);
        float rim = pow(1.0 - n.z, 2.0);
        vec3 silver = pigment * (0.20 + diffuse * 0.79) + vec3(0.85, 0.91, 0.83) * specular * 0.65 + pigment * rim * 0.15;
        float alpha = 1.0 - smoothstep(0.72, 1.0, r);
        gl_FragColor = vec4(silver, alpha * (1.0-reflection*.9));
      }
    }`;
  const lineVertex = `precision mediump float; attribute vec2 position; attribute vec4 color; varying mediump vec4 pigment;
    void main() { gl_Position=vec4(position,0.0,1.0); pigment=color; }`;
  const lineFragment = `precision mediump float; varying mediump vec4 pigment; void main() { gl_FragColor=pigment; }`;

  function webgl(canvas, gl) {
    let material, wireMaterial, pointBuffer, wireBuffer;
    let ratio = 1;
    const attributeCount = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    const programs = [];
    const buffers = [];
    function program(v, f) {
      const shaders = [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].map((type, i) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, i ? f : v); gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { const error=gl.getShaderInfoLog(shader); gl.deleteShader(shader); throw new Error(error); }
        return shader;
      });
      const p = gl.createProgram(); shaders.forEach(s => gl.attachShader(p, s)); gl.linkProgram(p);
      shaders.forEach(s => gl.deleteShader(s));
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { const error=gl.getProgramInfoLog(p); gl.deleteProgram(p); throw new Error(error); }
      programs.push(p);
      return p;
    }
    function attribute(p, name, width, stride, offset) {
      const id=gl.getAttribLocation(p,name); gl.enableVertexAttribArray(id); gl.vertexAttribPointer(id,width,gl.FLOAT,false,stride,offset);
    }
    function resetAttributes() { for(let i=0;i<attributeCount;i++) gl.disableVertexAttribArray(i); }
    function release() { resetAttributes(); programs.splice(0).forEach(p=>{ if(gl.isProgram(p)) gl.deleteProgram(p); }); buffers.splice(0).forEach(b=>{ if(gl.isBuffer(b)) gl.deleteBuffer(b); }); }
    function init() {
      release();
      material=program(vertex,fragment); wireMaterial=program(lineVertex,lineFragment);
      pointBuffer=gl.createBuffer(); wireBuffer=gl.createBuffer(); buffers.push(pointBuffer,wireBuffer);
      gl.disable(gl.DEPTH_TEST); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0,0,0,0);
    }
    init();
    return {
      kind: "webgl-pearl",
      resize(pixelRatio) { ratio=pixelRatio; gl.viewport(0,0,canvas.width,canvas.height); },
      draw(points, wires) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (wires.length) {
          resetAttributes(); gl.useProgram(wireMaterial); gl.bindBuffer(gl.ARRAY_BUFFER,wireBuffer); gl.bufferData(gl.ARRAY_BUFFER,wires,gl.DYNAMIC_DRAW);
          attribute(wireMaterial,'position',2,24,0); attribute(wireMaterial,'color',4,24,8); gl.drawArrays(gl.LINES,0,wires.length/6);
        }
        resetAttributes(); gl.useProgram(material); gl.bindBuffer(gl.ARRAY_BUFFER,pointBuffer); gl.bufferData(gl.ARRAY_BUFFER,points,gl.DYNAMIC_DRAW);
        attribute(material,'position',2,28,0); attribute(material,'size',1,28,8); attribute(material,'color',3,28,12); attribute(material,'variation',1,28,24);
        gl.uniform1f(gl.getUniformLocation(material,'pixelRatio'),ratio);
        const mirror=gl.getUniformLocation(material,'mirror'); gl.uniform1f(mirror,0);
        const glow=gl.getUniformLocation(material,'glow'); gl.uniform1f(glow,1); gl.drawArrays(gl.POINTS,0,points.length/7);
        gl.uniform1f(glow,0); gl.drawArrays(gl.POINTS,0,points.length/7);
        gl.uniform1f(mirror,1); gl.drawArrays(gl.POINTS,0,points.length/7); gl.uniform1f(mirror,0);
      },
      restore() { init(); },
      dispose() { release(); }
    };
  }
  function canvas2d(canvas, context) {
    let ratio=1;
    return {
      kind: "canvas-pearl-fallback",
      resize(pixelRatio) { ratio=pixelRatio; context.setTransform(ratio,0,0,ratio,0,0); },
      draw(points,wires) {
        const w=canvas.width/ratio,h=canvas.height/ratio;context.clearRect(0,0,w,h);
        context.lineWidth=.6;
        for(let i=0;i<wires.length;i+=12) {
          context.strokeStyle=`rgba(137,193,183,${wires[i+5]})`;context.beginPath();context.moveTo((wires[i]+1)*w/2,(1-wires[i+1])*h/2);context.lineTo((wires[i+6]+1)*w/2,(1-wires[i+7])*h/2);context.stroke();
        }
        for(let i=0;i<points.length;i+=7) {
          const x=(points[i]+1)*w/2,y=(1-points[i+1])*h/2,r=points[i+2]/2;
          context.fillStyle=`rgb(${Math.round(points[i+3]*235)},${Math.round(points[i+4]*240)},${Math.round(points[i+5]*230)})`;context.beginPath();context.arc(x,y,r,0,Math.PI*2);context.fill();
          if(points[i+6]>.8){context.fillStyle='rgba(255,255,235,.7)';context.fillRect(x-r*.3,y-r*.4,Math.max(.5,r*.4),Math.max(.5,r*.4));}
        }
      },
      restore() {}, dispose() {}
    };
  }
  window.TactParticleRenderer = Object.freeze({
    create(canvas) {
      const gl=canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:false,preserveDrawingBuffer:true});
      if(gl) return webgl(canvas,gl);
      const context=canvas.getContext('2d');
      return context ? canvas2d(canvas,context) : null;
    }
  });
})();
