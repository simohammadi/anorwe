import * as THREE from "three"

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){float a=0.5,s=0.0;for(int i=0;i<5;i++){s+=a*snoise(p);p*=2.03;a*=0.5;}return s;}
`

// Gap bands of the Horizon logo, in sun-radius units above the centre (matches the SVG mark).
const STRIPES = /* glsl */ `
float horizonCut(float y, float k){
  if (abs(y-0.555) < 0.035*k) return 1.0;
  if (abs(y-0.365) < 0.05*k) return 1.0;
  if (abs(y-0.17) < 0.065*k) return 1.0;
  return 0.0;
}
`

const SUN_R = 1.55
const CAM_Z = 10000
const CORONA_SPAN = 3.6
const BURST_LEN = 1.6
const FLARE_LEN = 3.2

export interface SunTarget {
  x: number
  y: number
  r: number
  stripes: number
  calm: number
}

export interface SunHandle {
  /** Viewport pixels: x, y = centre, r = radius. Callers own any smoothing. */
  target: SunTarget
  /** Viewport y below which the sun is clipped; null disables clipping. */
  view: { horizon: number | null }
  intentOn(x: number, y: number): void
  intentOff(): void
  burst(): void
  dispose(): void
}

export function mountSun(container: HTMLElement): SunHandle {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const coarse = window.matchMedia("(pointer: coarse)").matches
  const renderer = new THREE.WebGLRenderer({ antialias: !coarse, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1.5 : 2))
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 20000)
  camera.position.set(0, 0, CAM_Z)

  const uniforms = {
    uTime: { value: 0 },
    uStripes: { value: 0 },
    uCalm: { value: 0 },
    uIntent: { value: 0 },
    uIntentAng: { value: Math.PI },
    uBurst: { value: 0 },
    uHorizon: { value: -1e6 },
    uEnergy: { value: 0 },
    uFlareAng: { value: 1.0 },
    uFlarePhase: { value: 0 },
  }

  const sunGroup = new THREE.Group()
  scene.add(sunGroup)

  const sunGeometry = new THREE.SphereGeometry(SUN_R, coarse ? 64 : 96, coarse ? 64 : 96)
  const sunMaterial = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec3 vPos; varying vec3 vN; varying float vWorldY;
      void main(){
        vPos = position;
        vN = normalize(normalMatrix*normal);
        vWorldY = (modelMatrix*vec4(position,1.0)).y;
        gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
      }`,
    fragmentShader: `
      uniform float uTime; uniform float uStripes; uniform float uCalm; uniform float uHorizon;
      uniform float uFlareAng; uniform float uFlarePhase; uniform float uIntent; uniform float uIntentAng; uniform float uBurst;
      varying vec3 vPos; varying vec3 vN; varying float vWorldY;
      ${NOISE}
      ${STRIPES}
      void main(){
        if (vWorldY < uHorizon) discard;
        if (horizonCut(vPos.y/${SUN_R.toFixed(2)}, uStripes) > 0.5) discard;
        vec3 p = normalize(vPos)*2.2;
        float n  = fbm(p + vec3(0.0, uTime*0.04, uTime*0.025));
        float n2 = fbm(p*3.5 - vec3(uTime*0.07));
        float t = clamp(0.6 + 0.3*n + 0.14*n2, 0.0, 1.0);
        vec3 deep=vec3(0.85,0.30,0.07), mid=vec3(0.98,0.58,0.14), hot=vec3(1.0,0.88,0.52);
        vec3 col = mix(deep, mid, smoothstep(0.15,0.55,t));
        col = mix(col, hot, smoothstep(0.62,0.95,t));
        float f = max(vN.z, 0.0);
        col *= mix(0.72, 1.08, pow(f, 0.45));
        col += vec3(1.0,0.45,0.12)*pow(1.0-f, 3.0)*0.5;
        float a = atan(vPos.y, vPos.x + 1e-5);
        float da = atan(sin(a-uFlareAng), cos(a-uFlareAng));
        col += vec3(1.0,0.8,0.5) * exp(-da*da*18.0) * pow(1.0-f, 1.5) * sin(3.14159*uFlarePhase) * 0.8;
        float di = atan(sin(a-uIntentAng), cos(a-uIntentAng));
        col += vec3(1.0,0.8,0.5) * exp(-di*di*10.0) * pow(1.0-f, 1.2) * uIntent * 0.7;
        col = mix(col, vec3(0.886,0.400,0.165), uCalm);
        float burstEnv = uBurst > 0.0 ? sin(3.14159*uBurst) : 0.0;
        col = mix(col, vec3(0.98,0.66,0.24), uCalm * max(uIntent*0.45, burstEnv*0.7));
        gl_FragColor = vec4(col, 1.0);
      }`,
  })
  sunGroup.add(new THREE.Mesh(sunGeometry, sunMaterial))

  const coronaSize = SUN_R * 2 * CORONA_SPAN
  const coronaGeometry = new THREE.PlaneGeometry(coronaSize, coronaSize)
  const coronaMaterial = new THREE.ShaderMaterial({
    uniforms: { ...uniforms, uR: { value: 1 / CORONA_SPAN } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      varying vec2 vUv; varying float vWorldY;
      void main(){
        vUv = uv;
        vWorldY = (modelMatrix*vec4(position,1.0)).y;
        gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
      }`,
    fragmentShader: `
      uniform float uTime; uniform float uR; uniform float uCalm; uniform float uEnergy; uniform float uHorizon;
      uniform float uIntent; uniform float uIntentAng; uniform float uBurst;
      uniform float uFlareAng; uniform float uFlarePhase;
      varying float vWorldY;
      varying vec2 vUv;
      ${NOISE}
      void main(){
        vec2 p = vUv*2.0-1.0; float r = length(p); float a = atan(p.y, p.x + 1e-5);
        float d = max(r - uR, 0.0) / uR;
        vec2 q = vec2(cos(a), sin(a));

        float n1 = fbm(vec3(q*1.7, uTime*0.07 - d*0.8));
        float n2 = fbm(vec3(q*4.5, uTime*0.13 - d*2.2));
        float streamers = smoothstep(-0.25 - uEnergy*0.2, 0.7, n1);
        float rays = smoothstep(0.05, 0.85, n2);

        float glow = exp(-d*5.0);
        float halo = exp(-d*1.3)*0.18;
        float s1 = exp(-d*(0.85 + 3.6*(1.0-streamers))) * streamers;
        float s2 = exp(-d*(1.8 + 6.0*(1.0-rays))) * rays * 0.6;
        float fringe = exp(-d*22.0) * (0.55 + 0.45*snoise(vec3(q*9.0, uTime*0.8)));

        float da = atan(sin(a-uFlareAng), cos(a-uFlareAng));
        float env = sin(3.14159*uFlarePhase);
        float lobe = exp(-da*da/(0.004 + 0.02*uFlarePhase));
        float filaments = smoothstep(-0.2, 0.8, snoise(vec3(da*28.0, d*2.5 - uTime*0.9, uTime*0.3)));
        float front = uFlarePhase*2.0;
        float reach = smoothstep(front + 0.35, front - 0.6, d);
        float burst = lobe * reach * exp(-d*0.9) * env * (0.35 + 0.9*filaments);
        burst += exp(-da*da/0.02) * exp(-d*5.0) * env * 0.8;

        float base = glow*0.9 + halo + s1*(0.85 + uEnergy) + s2 + fringe + burst*1.3;
        float burstEnv = uBurst > 0.0 ? sin(3.14159*uBurst) : 0.0;
        base *= max(1.0 - uCalm, max(burstEnv, uIntent*0.5));

        float di = atan(sin(a-uIntentAng), cos(a-uIntentAng));
        float lobeI = exp(-di*di/(0.01 + 0.04*uIntent));
        float core = exp(-di*di/0.004);
        float fil = smoothstep(-0.2, 0.8, snoise(vec3(di*24.0, d*2.0 - uTime*1.8, uTime*0.5)));
        float flicker = 0.85 + 0.15*sin(uTime*9.0) * sin(uTime*5.3);
        float jet = (lobeI * (0.35 + 0.9*fil) + core*0.8) * exp(-d*(2.4 - 1.6*uIntent)) * uIntent * flicker * 2.0;

        float ring = uBurst > 0.0 ? exp(-pow((d - uBurst*2.4)/0.12, 2.0)) * (1.0 - uBurst) * (0.5 + 0.7*rays) : 0.0;

        float alpha = base + jet + ring*1.3;
        alpha *= smoothstep(1.0, 0.7, r);
        if (vWorldY < uHorizon) alpha = 0.0;

        vec3 col = mix(vec3(1.0,0.36,0.10), vec3(1.0,0.86,0.55), clamp(exp(-d*3.2) + burst*0.4 + jet*0.3 + ring*0.4, 0.0, 1.0));
        gl_FragColor = vec4(col*alpha, alpha);
      }`,
  })
  const corona = new THREE.Mesh(coronaGeometry, coronaMaterial)
  corona.position.z = -SUN_R - 0.1
  sunGroup.add(corona)

  const target: SunTarget = { x: 0, y: 0, r: 0, stripes: 0, calm: 0 }
  const view: { horizon: number | null } = { horizon: null }
  const cur: SunTarget = { ...target }
  let primed = false

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return
    pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2
    pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2
  }
  window.addEventListener("pointermove", onPointerMove, { passive: true })

  let W = 1
  let H = 1
  let dirty = true
  // Resizing clears the canvas, so apply it inside a frame that renders straight after.
  let resizePending = true
  const resize = () => {
    resizePending = false
    W = container.clientWidth
    H = container.clientHeight
    renderer.setSize(W, H, false)
    camera.left = -W / 2
    camera.right = W / 2
    camera.top = H / 2
    camera.bottom = -H / 2
    camera.updateProjectionMatrix()
    dirty = true
  }
  const ro = new ResizeObserver(() => {
    if (container.clientWidth !== W || container.clientHeight !== H) resizePending = true
  })
  ro.observe(container)
  resize()

  const intent = { on: false, x: 0, y: 0, level: 0 }
  let burstStart = -10
  let nextFlare = 2.5
  let flareStart = -10

  const clock = new THREE.Clock()
  let last = 0
  let raf = 0
  let lastSig = ""

  const frame = () => {
    raf = requestAnimationFrame(frame)
    if (resizePending) resize()
    const t = reduced ? 12 : clock.getElapsedTime()
    const dt = Math.min(0.05, t - last || 0.016)
    last = t
    uniforms.uTime.value = t

    if (!primed) {
      Object.assign(cur, target)
      primed = true
    }
    const px = cur.x
    const py = cur.y
    Object.assign(cur, target)
    const speed = Math.hypot(cur.x - px, cur.y - py) / dt / Math.max(cur.r, 1)
    uniforms.uEnergy.value += (Math.min(speed * 0.15, 1) - uniforms.uEnergy.value) * 0.08
    uniforms.uStripes.value = cur.stripes
    uniforms.uCalm.value = cur.calm
    uniforms.uHorizon.value = view.horizon === null ? -1e6 : H / 2 - view.horizon

    if (!reduced && t > nextFlare && cur.calm < 0.05) {
      flareStart = t
      uniforms.uFlareAng.value = Math.random() * Math.PI * 2
      nextFlare = t + FLARE_LEN + 3 + Math.random() * 5
    }
    const fp = (t - flareStart) / FLARE_LEN
    uniforms.uFlarePhase.value = fp >= 0 && fp <= 1 ? fp : 0

    const attack = intent.on ? 1 - Math.pow(0.0005, dt) : 1 - Math.pow(0.05, dt)
    intent.level += ((intent.on ? 1 : 0) - intent.level) * attack
    if (!intent.on && intent.level < 0.001) intent.level = 0
    uniforms.uIntent.value = reduced ? 0 : intent.level
    if (intent.on) {
      let want = Math.atan2(-(intent.y - cur.y), intent.x - cur.x)
      if (cur.calm > 0.5 && want < 0.12) want = want < -Math.PI / 2 ? Math.PI - 0.12 : 0.12
      const ang = uniforms.uIntentAng.value
      const dAng = Math.atan2(Math.sin(want - ang), Math.cos(want - ang))
      uniforms.uIntentAng.value += intent.level < 0.05 ? dAng : dAng * 0.2
    }
    const bp = (t - burstStart) / BURST_LEN
    uniforms.uBurst.value = !reduced && bp > 0 && bp < 1 ? bp : 0

    pointer.x += (pointer.tx - pointer.x) * 0.03
    pointer.y += (pointer.ty - pointer.y) * 0.03
    const free = 1 - cur.calm
    const bob = reduced ? 0 : Math.sin(t * 0.6) * cur.r * 0.03 * free
    sunGroup.position.set(
      cur.x - W / 2 + pointer.x * cur.r * 0.06 * free,
      H / 2 - cur.y + bob - pointer.y * cur.r * 0.06 * free,
      0,
    )
    sunGroup.scale.setScalar(Math.max(cur.r, 0.001) / SUN_R)

    // Once docked as the logo the sun is flat and still, so skip redundant renders.
    const quiet = cur.calm >= 1 && uniforms.uIntent.value === 0 && uniforms.uBurst.value === 0
    corona.visible = !quiet
    const sig = quiet
      ? [cur.x, cur.y, cur.r, cur.stripes, view.horizon, W, H].join()
      : ""
    if (quiet && sig === lastSig && !dirty) return
    lastSig = sig
    dirty = false
    renderer.render(scene, camera)
  }
  frame()

  return {
    target,
    view,
    intentOn(x, y) {
      Object.assign(intent, { on: true, x, y })
    },
    intentOff() {
      intent.on = false
    },
    burst() {
      burstStart = clock.getElapsedTime()
    },
    dispose() {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener("pointermove", onPointerMove)
      sunGeometry.dispose()
      sunMaterial.dispose()
      coronaGeometry.dispose()
      coronaMaterial.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}
