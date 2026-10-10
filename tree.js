import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";
// Joins indexed geometries that share position, normal and uv attributes into one.
function mergeGeometries(parts) {
    let vertexCount = 0, indexCount = 0;
    for (const g of parts) {
        vertexCount += g.getAttribute("position").count;
        indexCount += g.getIndex().count;
    }
    const position = new Float32Array(vertexCount * 3), normal = new Float32Array(vertexCount * 3), uv = new Float32Array(vertexCount * 2);
    const index = new Uint32Array(indexCount);
    let v = 0, i = 0;
    for (const g of parts) {
        position.set(g.getAttribute("position").array, v * 3);
        normal.set(g.getAttribute("normal").array, v * 3);
        uv.set(g.getAttribute("uv").array, v * 2);
        const idx = g.getIndex().array;
        for (let k = 0; k < idx.length; k++)
            index[i + k] = idx[k] + v;
        v += g.getAttribute("position").count;
        i += idx.length;
    }
    const merged = new THREE.BufferGeometry();
    merged.setAttribute("position", new THREE.BufferAttribute(position, 3));
    merged.setAttribute("normal", new THREE.BufferAttribute(normal, 3));
    merged.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    merged.setIndex(new THREE.BufferAttribute(index, 1));
    return merged;
}
// The cherry tree from the first portfolio, mounted in the contact section.
// It turns as it scrolls past, sways in a light wind, and sheds petals.
//
// Look: curved, tapered limbs with cherry bark (horizontal lenticels), and a
// canopy made of thousands of small five-petal flower sprites. Each flower is
// shaded from its position in its clump, so the canopy reads as soft volume.
const GROUND_Y = -2.4;
const MAX_DEPTH = 6;
const FALLING_PETALS = 160;
const GROUND_PETALS = 900;
const MIST = "#efeee9";
// Seeded random so the tree has the same shape on every visit.
function mulberry32(seed) {
    let a = seed;
    return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
// ---------------------------------------------------------------------------
// Textures, drawn once on canvas
// ---------------------------------------------------------------------------
function canvasTexture(width, height, draw) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    draw(ctx);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}
// One sakura petal pointing up from (0,0): rounded, with the notch at the tip.
function petalPath(ctx, length) {
    const w = length * 0.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-w * 0.9, -length * 0.2, -w * 1.05, -length * 0.8, -w * 0.32, -length);
    ctx.lineTo(0, -length * 0.88);
    ctx.lineTo(w * 0.32, -length);
    ctx.bezierCurveTo(w * 1.05, -length * 0.8, w * 0.9, -length * 0.2, 0, 0);
    ctx.closePath();
}
function makeFlowerTexture() {
    return canvasTexture(128, 128, (ctx) => {
        ctx.translate(64, 64);
        for (let i = 0; i < 5; i++) {
            ctx.save();
            ctx.rotate((i / 5) * Math.PI * 2);
            const g = ctx.createLinearGradient(0, 0, 0, -58);
            g.addColorStop(0, "#e07a98");
            g.addColorStop(0.3, "#f5c6d3");
            g.addColorStop(1, "#fff7f9");
            petalPath(ctx, 58);
            ctx.fillStyle = g;
            ctx.fill();
            ctx.strokeStyle = "rgba(214, 120, 150, 0.35)";
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.restore();
        }
        // Stamens
        for (let i = 0; i < 14; i++) {
            const a = (i / 14) * Math.PI * 2 + 0.2;
            const r = 13 + (i % 3) * 3;
            ctx.strokeStyle = "rgba(200, 90, 120, 0.8)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            ctx.stroke();
            ctx.fillStyle = "#f1d58a";
            ctx.beginPath();
            ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 1.8, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = "#c4587a";
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
    });
}
function makePetalTexture() {
    return canvasTexture(64, 64, (ctx) => {
        ctx.translate(32, 60);
        const g = ctx.createLinearGradient(0, 0, 0, -56);
        g.addColorStop(0, "#eb9db3");
        g.addColorStop(0.45, "#f8d3dd");
        g.addColorStop(1, "#fff6f8");
        petalPath(ctx, 56);
        ctx.fillStyle = g;
        ctx.fill();
    });
}
function makeBarkTexture(rand) {
    const texture = canvasTexture(128, 256, (ctx) => {
        ctx.fillStyle = "#4f3d37";
        ctx.fillRect(0, 0, 128, 256);
        // Fibrous vertical grain
        for (let i = 0; i < 700; i++) {
            const light = rand() < 0.45;
            ctx.strokeStyle = light ? `rgba(122, 98, 88, ${0.15 + rand() * 0.3})` : `rgba(38, 28, 25, ${0.2 + rand() * 0.35})`;
            ctx.lineWidth = 0.6 + rand() * 1.6;
            const x = rand() * 128;
            const y = rand() * 256;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + (rand() - 0.5) * 3, y + 10 + rand() * 40);
            ctx.stroke();
        }
        // Lenticels: the horizontal bands cherry bark is known for
        for (let i = 0; i < 90; i++) {
            const x = rand() * 128;
            const y = rand() * 256;
            const w = 8 + rand() * 26;
            ctx.fillStyle = `rgba(168, 150, 140, ${0.35 + rand() * 0.35})`;
            ctx.fillRect(x, y, w, 1.5 + rand() * 1.5);
            ctx.fillStyle = "rgba(30, 22, 20, 0.35)";
            ctx.fillRect(x, y + 2.5, w, 1);
        }
    });
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}
function makeShadowTexture() {
    return canvasTexture(128, 128, (ctx) => {
        const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        g.addColorStop(0, "rgba(38, 38, 43, 0.55)");
        g.addColorStop(0.45, "rgba(38, 38, 43, 0.25)");
        g.addColorStop(1, "rgba(38, 38, 43, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 128, 128);
    });
}
const FLOWER_TINTS = [
    [1, 1, 1],
    [1, 0.95, 0.96],
    [1, 0.9, 0.93],
    [0.99, 0.84, 0.89],
];
const BUD_TINT = [0.93, 0.56, 0.68];
function pointAlong(points, t) {
    const f = t * (points.length - 1);
    const i = Math.min(Math.floor(f), points.length - 2);
    return points[i].clone().lerp(points[i + 1], f - i);
}
function growTree(rand) {
    const branches = [];
    const flowers = [];
    const UP = new THREE.Vector3(0, 1, 0);
    const randomPerpendicular = (dir, azimuth) => {
        const helper = Math.abs(dir.y) < 0.9 ? UP : new THREE.Vector3(1, 0, 0);
        return new THREE.Vector3().crossVectors(dir, helper).normalize().applyAxisAngle(dir, azimuth);
    };
    // A clump of flowers, fuller on top than underneath, like real blossom.
    const addClump = (center, radius, count) => {
        for (let i = 0; i < count; i++) {
            const u = rand() * Math.PI * 2;
            const v = Math.acos(2 * rand() - 1);
            const n = new THREE.Vector3(Math.sin(v) * Math.cos(u), Math.cos(v), Math.sin(v) * Math.sin(u));
            if (n.y < -0.35 && rand() < 0.55)
                continue;
            const r = radius * (0.5 + 0.5 * Math.pow(rand(), 0.6));
            const position = center.clone().add(new THREE.Vector3(n.x * r, n.y * r * 0.72, n.z * r));
            const bud = rand() < 0.07;
            flowers.push({
                position,
                normal: n,
                size: bud ? 0.06 : 0.11 + rand() * 0.06,
                tint: bud ? BUD_TINT : FLOWER_TINTS[Math.floor(rand() * FLOWER_TINTS.length)],
                rotation: rand() * Math.PI * 2,
            });
        }
    };
    const grow = (start, dir, length, r0, depth) => {
        const steps = depth <= 1 ? 6 : 4;
        const points = [start.clone()];
        const d = dir.clone();
        const p = start.clone();
        for (let i = 1; i <= steps; i++) {
            const wobble = depth <= 1 ? 0.24 : 0.18;
            d.x += (rand() - 0.5) * wobble;
            d.y += (rand() - 0.5) * wobble * 0.5;
            d.z += (rand() - 0.5) * wobble;
            // Outer twigs droop under the blossom; inner limbs reach up and out.
            d.y += depth >= 4 ? -0.06 : depth >= 2 ? 0.01 : 0.04;
            d.normalize();
            p.addScaledVector(d, length / steps);
            points.push(p.clone());
        }
        const terminal = depth >= MAX_DEPTH || r0 < 0.013;
        const r1 = terminal ? r0 * 0.08 : r0 * 0.64;
        branches.push({ points, r0, r1, flare: depth === 0 });
        if (depth >= 3) {
            const along = depth >= 5 ? 2 : 1;
            for (let i = 0; i < along; i++) {
                const c = pointAlong(points, 0.35 + rand() * 0.6);
                c.x += (rand() - 0.5) * 0.12;
                c.y += 0.04 + rand() * 0.08;
                c.z += (rand() - 0.5) * 0.12;
                addClump(c, 0.17 + rand() * 0.12, 18 + Math.floor(rand() * 12));
            }
        }
        const end = points[points.length - 1];
        if (terminal) {
            addClump(end.clone().add(new THREE.Vector3(0, 0.06, 0)), 0.28 + rand() * 0.12, 40 + Math.floor(rand() * 20));
            return;
        }
        // Side shoot partway along the limb
        if (depth >= 1 && depth <= 4 && rand() < 0.7) {
            const t = 0.4 + rand() * 0.35;
            const axis = randomPerpendicular(d, rand() * Math.PI * 2);
            const sideDir = d.clone().applyAxisAngle(axis, 0.7 + rand() * 0.35).normalize();
            const sideRadius = THREE.MathUtils.lerp(r0, r1, t) * 0.62;
            grow(pointAlong(points, t), sideDir, length * 0.6, sideRadius, depth + 1);
        }
        // Fork at the end. The trunk splits low into several wide limbs.
        const forks = depth === 0 ? 4 : rand() < 0.3 ? 3 : 2;
        const startAzimuth = rand() * Math.PI * 2;
        for (let i = 0; i < forks; i++) {
            const azimuth = startAzimuth + (i / forks) * Math.PI * 2 + (rand() - 0.5) * 0.7;
            const axis = randomPerpendicular(d, azimuth);
            const tilt = depth === 0 ? 0.7 + rand() * 0.25 : 0.32 + rand() * 0.4;
            const childDir = d.clone().applyAxisAngle(axis, tilt).normalize();
            const childLength = depth === 0 ? length * 1.25 : length * (0.72 + rand() * 0.1);
            grow(end, childDir, childLength, r1 * (forks > 2 ? 0.86 : 0.95), depth + 1);
        }
    };
    grow(new THREE.Vector3(0, GROUND_Y - 0.1, 0), new THREE.Vector3(0.05, 1, 0.02).normalize(), 1.25, 0.27, 0);
    // Surface roots spreading from the base
    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + rand() * 0.6;
        const start = new THREE.Vector3(Math.cos(a) * 0.08, GROUND_Y + 0.22, Math.sin(a) * 0.08);
        const end = new THREE.Vector3(Math.cos(a) * (0.55 + rand() * 0.25), GROUND_Y - 0.04, Math.sin(a) * (0.55 + rand() * 0.25));
        const mid = start.clone().lerp(end, 0.45);
        mid.y = GROUND_Y + 0.05;
        branches.push({ points: [start, mid, end], r0: 0.11, r1: 0.02, flare: false });
    }
    return { branches, flowers };
}
// A tapered tube along a smooth curve through the branch points.
function tubeGeometry(branch) {
    const curve = new THREE.CatmullRomCurve3(branch.points, false, "catmullrom", 0.5);
    const length = curve.getLength();
    const radial = THREE.MathUtils.clamp(Math.round(branch.r0 * 70), 5, 18);
    const segments = THREE.MathUtils.clamp(Math.round(length * 10), 4, 28);
    const frames = curve.computeFrenetFrames(segments, false);
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];
    const normal = new THREE.Vector3();
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const center = curve.getPointAt(t);
        let r = THREE.MathUtils.lerp(branch.r0, branch.r1, t);
        if (branch.flare)
            r += branch.r0 * 0.7 * Math.pow(1 - t, 6);
        for (let j = 0; j <= radial; j++) {
            const a = (j / radial) * Math.PI * 2;
            normal
                .copy(frames.normals[i])
                .multiplyScalar(Math.cos(a))
                .addScaledVector(frames.binormals[i], Math.sin(a))
                .normalize();
            positions.push(center.x + normal.x * r, center.y + normal.y * r, center.z + normal.z * r);
            normals.push(normal.x, normal.y, normal.z);
            uvs.push(j / radial, t * length * 1.4);
        }
    }
    for (let i = 0; i < segments; i++) {
        for (let j = 0; j < radial; j++) {
            const a = i * (radial + 1) + j;
            const b = a + radial + 1;
            indices.push(a, b, a + 1, b, b + 1, a + 1);
        }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    return geometry;
}
// ---------------------------------------------------------------------------
// Flower sprites: sized in world units, rotated, lit from their clump normal
// ---------------------------------------------------------------------------
const flowerVertex = /* glsl */ `
  uniform float uTime;
  uniform float uScale;
  uniform float uBloom;
  uniform float uWind;
  uniform vec3 uLightDir;
  attribute vec3 aNormal;
  attribute float aSize;
  attribute vec3 aTint;
  attribute float aRotation;
  attribute float aDelay;
  varying vec3 vColor;
  varying float vRotation;
  varying float vDepth;

  void main() {
    vec3 p = position;
    float sway = sin(uTime * 1.1 + position.x * 1.3 + position.z * 0.9) * 0.018
               + sin(uTime * 2.3 + position.y * 2.0) * 0.006;
    float reach = max(position.y + 1.2, 0.0);
    p.x += sway * reach * uWind;
    p.z += sway * 0.6 * reach * uWind;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float grow = clamp((uBloom - aDelay) / 0.45, 0.0, 1.0);
    grow = 1.0 - pow(1.0 - grow, 3.0);
    gl_PointSize = aSize * grow * uScale / -mv.z;
    gl_Position = projectionMatrix * mv;

    vec3 n = normalize(mat3(modelMatrix) * aNormal);
    float light = dot(n, uLightDir) * 0.5 + 0.5;
    float underside = smoothstep(-0.9, 0.4, aNormal.y);
    // Shadowed flowers turn a deeper rose rather than grey.
    vec3 shade = mix(vec3(0.74, 0.58, 0.66), vec3(1.05), light);
    vColor = aTint * shade * mix(vec3(0.86, 0.78, 0.83), vec3(1.0), underside);
    vRotation = aRotation + uTime * 0.05 * uWind;
    vDepth = -mv.z;
  }
`;
const flowerFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;
  varying vec3 vColor;
  varying float vRotation;
  varying float vDepth;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float c = cos(vRotation);
    float s = sin(vRotation);
    uv = mat2(c, -s, s, c) * uv + 0.5;
    vec4 tex = texture2D(uMap, uv);
    if (tex.a < 0.08) discard;
    vec3 color = tex.rgb * vColor;
    color = mix(color, uFogColor, smoothstep(uFogNear, uFogFar, vDepth));
    gl_FragColor = vec4(color, tex.a);
    #include <colorspace_fragment>
  }
`;
function flowerPoints(flowers, delays, material) {
    const count = flowers.length;
    const position = new Float32Array(count * 3);
    const normal = new Float32Array(count * 3);
    const tint = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const rotation = new Float32Array(count);
    const delay = new Float32Array(count);
    flowers.forEach((f, i) => {
        position.set([f.position.x, f.position.y, f.position.z], i * 3);
        normal.set([f.normal.x, f.normal.y, f.normal.z], i * 3);
        tint.set(f.tint, i * 3);
        size[i] = f.size;
        rotation[i] = f.rotation;
        delay[i] = delays[i] ?? 0;
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
    geometry.setAttribute("aNormal", new THREE.BufferAttribute(normal, 3));
    geometry.setAttribute("aTint", new THREE.BufferAttribute(tint, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    geometry.setAttribute("aRotation", new THREE.BufferAttribute(rotation, 1));
    geometry.setAttribute("aDelay", new THREE.BufferAttribute(delay, 1));
    return new THREE.Points(geometry, material);
}
function flowerMaterial(map, lightDir) {
    return new THREE.ShaderMaterial({
        uniforms: {
            uMap: { value: map },
            uTime: { value: 0 },
            uScale: { value: 1000 },
            uBloom: { value: 2 },
            uWind: { value: 1 },
            uLightDir: { value: lightDir },
            uFogColor: { value: new THREE.Color(MIST) },
            uFogNear: { value: 10 },
            uFogFar: { value: 30 },
        },
        vertexShader: flowerVertex,
        fragmentShader: flowerFragment,
        alphaToCoverage: true,
    });
}
// ---------------------------------------------------------------------------
function mountTree(container) {
    {
        if (!container)
            return;
        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        }
        catch {
            // No WebGL: the page still works without the tree.
            return;
        }
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const rand = mulberry32(2003);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.setAttribute("aria-hidden", "true");
        container.appendChild(renderer.domElement);
        const scene = new THREE.Scene();
        const fog = new THREE.Fog(MIST, 10, 30);
        scene.fog = fog;
        const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80);
        const lightDir = new THREE.Vector3(-0.45, 0.8, 0.55).normalize();
        scene.add(new THREE.HemisphereLight("#fff8f6", "#a99a9a", 1.5));
        const sun = new THREE.DirectionalLight("#fff1ea", 1.7);
        sun.position.copy(lightDir).multiplyScalar(10);
        scene.add(sun);
        const flowerTexture = makeFlowerTexture();
        const petalTexture = makePetalTexture();
        const barkTexture = makeBarkTexture(rand);
        const shadowTexture = makeShadowTexture();
        // The outer group spins on the vertical axis; the inner group centres the
        // canopy on that axis so the tree turns in place.
        const tree = new THREE.Group();
        scene.add(tree);
        const crown = new THREE.Group();
        tree.add(crown);
        const { branches, flowers } = growTree(rand);
        const branchParts = branches.map(tubeGeometry);
        const branchGeometry = mergeGeometries(branchParts);
        branchParts.forEach((g) => g.dispose());
        const barkMaterial = new THREE.MeshStandardMaterial({ map: barkTexture, roughness: 0.85, metalness: 0 });
        crown.add(new THREE.Mesh(branchGeometry, barkMaterial));
        // Bounds of the canopy, for centring, camera fit and petal spawn.
        const bounds = new THREE.Box3();
        flowers.forEach((f) => bounds.expandByPoint(f.position));
        bounds.expandByPoint(new THREE.Vector3(0, GROUND_Y, 0));
        const center = bounds.getCenter(new THREE.Vector3());
        const radius = bounds.getBoundingSphere(new THREE.Sphere()).radius;
        const canopyRadius = Math.max(bounds.max.x - center.x, bounds.max.z - center.z);
        crown.position.set(-center.x, 0, -center.z);
        // Bloom opens from the lowest flowers upward.
        const span = bounds.max.y - bounds.min.y || 1;
        const delays = flowers.map((f) => ((f.position.y - bounds.min.y) / span) * 0.5 + rand() * 0.2);
        const blossomMaterial = flowerMaterial(flowerTexture, lightDir);
        blossomMaterial.uniforms.uBloom.value = reduceMotion ? 2 : 0;
        blossomMaterial.uniforms.uWind.value = reduceMotion ? 0 : 1;
        const blossoms = flowerPoints(flowers, delays, blossomMaterial);
        crown.add(blossoms);
        // Petals already on the ground, denser near the trunk
        const fallen = [];
        for (let i = 0; i < GROUND_PETALS; i++) {
            const a = rand() * Math.PI * 2;
            const r = canopyRadius * 1.05 * Math.sqrt(rand()) * (0.35 + 0.65 * rand());
            fallen.push({
                position: new THREE.Vector3(center.x + Math.cos(a) * r, GROUND_Y + 0.01, center.z + Math.sin(a) * r),
                normal: new THREE.Vector3(0, 1, 0),
                size: 0.06 + rand() * 0.03,
                tint: FLOWER_TINTS[Math.floor(rand() * FLOWER_TINTS.length)],
                rotation: rand() * Math.PI * 2,
            });
        }
        const groundMaterial = flowerMaterial(petalTexture, lightDir);
        groundMaterial.uniforms.uWind.value = 0;
        const groundPetals = flowerPoints(fallen, [], groundMaterial);
        crown.add(groundPetals);
        // Soft shadow under the canopy
        const shadowGeometry = new THREE.PlaneGeometry(1, 1);
        const shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.5 });
        const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.set(center.x, GROUND_Y, center.z);
        shadow.scale.set(canopyRadius * 2.1, canopyRadius * 2.1, 1);
        crown.add(shadow);
        // Falling petals tumble through the air in world space. Unlit, so a petal
        // seen from behind stays pink instead of turning into a dark speck.
        const petalGeometry = new THREE.PlaneGeometry(0.085, 0.085);
        const petalMaterial = new THREE.MeshBasicMaterial({
            map: petalTexture,
            color: "#f6eef0",
            alphaTest: 0.4,
            side: THREE.DoubleSide,
        });
        const petalMesh = new THREE.InstancedMesh(petalGeometry, petalMaterial, FALLING_PETALS);
        const spawnPetal = (p, fromTop) => {
            const a = rand() * Math.PI * 2;
            const r = canopyRadius * Math.sqrt(rand());
            const top = bounds.max.y - 0.2;
            const low = center.y - 0.4;
            p.position.set(Math.cos(a) * r, fromTop ? low + rand() * (top - low) : GROUND_Y + rand() * (top - GROUND_Y), Math.sin(a) * r);
            p.fallSpeed = 0.2 + rand() * 0.28;
            p.swayPhase = rand() * Math.PI * 2;
            p.swayAmount = 0.2 + rand() * 0.4;
            p.spinAxis.set(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize();
            p.spinSpeed = 1 + rand() * 2.2;
            p.angle = rand() * Math.PI * 2;
            p.scale = 0.7 + rand() * 0.6;
        };
        const petals = Array.from({ length: FALLING_PETALS }, () => {
            const p = {
                position: new THREE.Vector3(),
                fallSpeed: 0,
                swayPhase: 0,
                swayAmount: 0,
                spinAxis: new THREE.Vector3(),
                spinSpeed: 0,
                angle: 0,
                scale: 1,
            };
            spawnPetal(p, false);
            return p;
        });
        petalMesh.visible = !reduceMotion;
        scene.add(petalMesh);
        // Size and camera fit
        const resize = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            if (!width || !height)
                return;
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            const vFov = THREE.MathUtils.degToRad(camera.fov);
            const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
            const distance = (radius / Math.sin(Math.min(vFov, hFov) / 2)) * 0.88;
            camera.position.set(0, center.y + radius * 0.18, distance);
            camera.lookAt(0, center.y - radius * 0.04, 0);
            camera.updateProjectionMatrix();
            fog.near = distance;
            fog.far = distance + radius * 3;
            // World-size to pixel-size factor for the flower sprites
            const scale = (height * renderer.getPixelRatio()) / 2 / Math.tan(vFov / 2);
            for (const m of [blossomMaterial, groundMaterial]) {
                m.uniforms.uScale.value = scale;
                m.uniforms.uFogNear.value = fog.near;
                m.uniforms.uFogFar.value = fog.far;
            }
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);
        resize();
        // The tree turns one full revolution while its box passes through the
        // viewport, and only renders while on screen.
        let targetTurn = 0;
        let turn = 0;
        let visible = false;
        const onScroll = () => {
            const rect = container.getBoundingClientRect();
            const span = window.innerHeight + rect.height;
            targetTurn = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / span));
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        turn = targetTurn;
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
        });
        io.observe(container);
        const clock = new THREE.Clock();
        const dummy = new THREE.Object3D();
        let elapsed = 0;
        let frame = 0;
        let bloomStart = -1;
        const animate = () => {
            frame = requestAnimationFrame(animate);
            const dt = Math.min(clock.getDelta(), 0.05);
            if (!visible)
                return;
            elapsed += dt;
            // The blossom opens the first time the tree comes into view.
            if (bloomStart < 0)
                bloomStart = clock.elapsedTime;
            const sinceBloom = clock.elapsedTime - bloomStart;
            turn += (targetTurn - turn) * (reduceMotion ? 1 : 0.07);
            tree.rotation.y = turn * Math.PI * 2;
            if (!reduceMotion) {
                blossomMaterial.uniforms.uTime.value = elapsed;
                // Opening bloom, timed on the wall clock so slow frames don't stretch it.
                if (sinceBloom < 3)
                    blossomMaterial.uniforms.uBloom.value = sinceBloom / 1.9;
                petals.forEach((p, i) => {
                    p.position.y -= p.fallSpeed * dt;
                    p.position.x += Math.sin(elapsed * 0.9 + p.swayPhase) * p.swayAmount * dt;
                    p.position.z += Math.cos(elapsed * 0.7 + p.swayPhase) * p.swayAmount * 0.5 * dt;
                    p.angle += p.spinSpeed * dt;
                    if (p.position.y < GROUND_Y)
                        spawnPetal(p, true);
                    dummy.position.copy(p.position);
                    dummy.quaternion.setFromAxisAngle(p.spinAxis, p.angle);
                    dummy.scale.setScalar(p.scale);
                    dummy.updateMatrix();
                    petalMesh.setMatrixAt(i, dummy.matrix);
                });
                petalMesh.instanceMatrix.needsUpdate = true;
            }
            renderer.render(scene, camera);
        };
        animate();
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll);
            io.disconnect();
            resizeObserver.disconnect();
            [branchGeometry, blossoms.geometry, groundPetals.geometry, shadowGeometry, petalGeometry].forEach((g) => g.dispose());
            [barkMaterial, blossomMaterial, groundMaterial, shadowMaterial, petalMaterial].forEach((m) => m.dispose());
            [flowerTexture, petalTexture, barkTexture, shadowTexture].forEach((t) => t.dispose());
            renderer.dispose();
            renderer.domElement.remove();
        };
    }
}
mountTree(document.getElementById("tree"));
