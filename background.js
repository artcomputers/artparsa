/* =========================================================
   ArtParsa — background.js
   Chromatic wave-lines moiré, adapted from the standalone
   sketch to run as a site-wide background layer.

   HOW STRONG IT LOOKS is controlled in styles.css:
     --fx-opacity  (0 = invisible, 1 = full strength)

   Differences from the standalone version:
   - draws behind the page content (fixed, non-interactive)
   - no mouse / keyboard controls (warp + pitch fixed at the
     reference-matching values)
   - 30 fps cap to be kind to laptops and phones
   - honours "reduce motion": shows one still frame instead
     of animating
   ========================================================= */

(function () {
  const VERT = `
precision highp float;
attribute vec3 aPosition;
void main() {
  vec4 pos = vec4(aPosition, 1.0);
  pos.xy = pos.xy * 2.0 - 1.0;
  gl_Position = pos;
}`;

  const FRAG = `
precision highp float;

uniform float u_time;
uniform vec2  u_resolution;
uniform float u_warpDepth;
uniform float u_pitch;

float warp(vec2 p, float t) {
  float w = 0.0;
  w += 55.0 * sin(p.x * 0.011 + t * 0.31)        * sin(p.y * 0.006 - t * 0.23);
  w += 30.0 * sin(p.x * 0.021 - t * 0.17 + 1.7)  * cos(p.y * 0.012 + t * 0.29);
  w += 12.0 * sin(p.x * 0.005 + p.y * 0.004 + t * 0.41);
  return w;
}

float plate(vec2 p, float off, float gain, float t) {
  float phase = (p.y + warp(p, t) * u_warpDepth * gain + off) / u_pitch;
  float d = abs(fract(phase) - 0.5);
  return smoothstep(0.27, 0.27 - 0.06, d);
}

void main() {
  vec2 p = gl_FragCoord.xy;
  float t = u_time;

  const vec3 MAGENTA = vec3(1.00, 0.45, 0.93);
  const vec3 CYAN    = vec3(0.42, 0.80, 1.00);
  const vec3 YELLOW  = vec3(0.95, 0.95, 0.33);

  vec3 col = vec3(1.0);
  col *= mix(vec3(1.0), MAGENTA, plate(p, -1.4, 1.000, t));
  col *= mix(vec3(1.0), CYAN,    plate(p,  0.0, 1.018, t));
  col *= mix(vec3(1.0), YELLOW,  plate(p,  1.9, 1.040, t));

  gl_FragColor = vec4(col, 1.0);
}`;

  // container the canvas lives in (styled by styles.css)
  const host = document.createElement("div");
  host.id = "bgfx";
  host.setAttribute("aria-hidden", "true");
  document.body.prepend(host);

  const stillOnly = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const sketch = (p) => {
    let sh;

    p.setup = function () {
      p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL);
      p.pixelDensity(1);
      p.noSmooth();
      p.frameRate(30);
      sh = p.createShader(VERT, FRAG);
      if (stillOnly) p.noLoop(); // one static frame for reduce-motion users
    };

    p.draw = function () {
      p.shader(sh);
      sh.setUniform("u_time", (p.millis() / 1000) % 3600);
      sh.setUniform("u_resolution", [p.width, p.height]);
      sh.setUniform("u_warpDepth", 1.0); // reference-matching values
      sh.setUniform("u_pitch", 8.0);
      p.rect(0, 0, p.width, p.height);
    };

    p.windowResized = function () {
      p.resizeCanvas(window.innerWidth, window.innerHeight);
    };
  };

  /* p5 may not be loaded yet (gallery.js loads it right before this
     file); wait for it if needed. */
  function start() {
    if (window.p5) new window.p5(sketch, host);
    else setTimeout(start, 50);
  }
  start();
})();
