import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export async function initHero3D() {
  // Dynamic imports -> Rolldown emits these as separate, deferred chunks
  const THREE = await import('three');
  const { Timer } = THREE;
  const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
  const { DRACOLoader } = await import('three/addons/loaders/DRACOLoader.js');

  const hero = document.querySelector('.hero-section') || document.body;
  const canvas = document.getElementById('universe');

  // ---- Capability gates -------------------------------------------------
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection?.saveData === true;
  const webgl2 = (() => {
    try { return !!document.createElement('canvas').getContext('webgl2'); }
    catch { return false; }
  })();
  const lowPower = innerWidth < 900 || (navigator.hardwareConcurrency || 4) <= 4;

  // Smooth scroll only for people who want motion
  if (!reduceMotion) {
    const Lenis = (await import('lenis')).default;
    const lenis = new Lenis({ anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // No canvas / no WebGL2 / reduced motion / data saver -> CSS gradient fallback, zero downloads
  if (!canvas || !webgl2 || reduceMotion || saveData) {
    canvas?.remove();
    return;
  }

  const loadScene = () => {
    try {
      const renderer = new THREE.WebGLRenderer({
        canvas, alpha: true, antialias: !lowPower, powerPreference: 'high-performance'
      });

      // ✅ Capped at 1.5 on mobile so CSS scale(1.35) stays sharp without overworking the GPU
      const maxPixelRatio = lowPower ? 1.5 : 1.75;
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, maxPixelRatio));
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

      scene.add(new THREE.AmbientLight(0xffffff, 2.0));
      const keyLight = new THREE.DirectionalLight(0xffffff, 5);
      keyLight.position.set(5, 10, 5);
      scene.add(keyLight);
      const rimLight = new THREE.DirectionalLight(0x00d4ff, 5);
      rimLight.position.set(-5, 0, -5);
      scene.add(rimLight);

      // Fade the canvas in once the model is ready
      canvas.style.opacity = '0';
      canvas.style.transition = 'opacity .8s ease';

      let avatar = null; // wrapper group

      // Responsive layout, re-applied on every resize
      const isMobile = () => innerWidth < 900;
      const applyLayout = () => {
        camera.position.z = isMobile() ? 14 : 10;
        if (!avatar) return;
        if (isMobile()) {
          avatar.scale.setScalar(3.0);
          avatar.position.set(0, -2, 0);
        } else {
          avatar.scale.setScalar(2.5);
          avatar.position.set(2.5, -1, 0);
        }
        avatar.userData.baseY = avatar.position.y;
      };

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);

      loader.load(
        '/assets/avatar.glb',
        (gltf) => {
          const model = gltf.scene;
          const center = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3());
          model.position.sub(center);

          avatar = new THREE.Group();
          avatar.add(model);
          scene.add(avatar);
          applyLayout();
          dracoLoader.dispose();               // free decoder workers
          canvas.style.opacity = '1';          // fade in
        },
        undefined,
        (err) => {                              // load failed -> fallback gradient stays
          console.info('Avatar failed to load, using CSS background.', err);
          canvas.remove();
          stop();
        }
      );

      // ResizeObserver beats window resize (also fires on layout changes)
      const resize = () => {
        const w = canvas.clientWidth, h = canvas.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        applyLayout();
      };
      new ResizeObserver(resize).observe(canvas);
      resize();

      // Pointer parallax (skip on touch, no pointer to track)
      let px = 0, py = 0;
      if (matchMedia('(pointer: fine)').matches) {
        addEventListener('pointermove', (e) => {
          px = (e.clientX / innerWidth) * 2 - 1;
          py = (e.clientY / innerHeight) * 2 - 1;
        }, { passive: true });
      }

      gsap.to(camera.position, {
        z: isMobile() ? 8 : 4,
        y: 2,
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom top', scrub: 1 }
      });

      // ---- Render loop that can actually restart --------------------
      const timer = new Timer();
      timer.connect(document);
      let rafId = 0;

      const frame = () => {
        timer.update();
        const t = timer.getElapsed();
        if (avatar) {
          avatar.position.y = avatar.userData.baseY + Math.sin(t * 1.5) * 0.1;
          avatar.rotation.y += (px * 0.5 - avatar.rotation.y) * 0.05;
          avatar.rotation.x += (-py * 0.2 - avatar.rotation.x) * 0.05;
        }
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(frame);
      };
      function start() { if (!rafId) rafId = requestAnimationFrame(frame); }
      function stop()  { cancelAnimationFrame(rafId); rafId = 0; }

      new IntersectionObserver(([entry]) => {
        entry.isIntersecting ? start() : stop();
      }, { threshold: 0.01 }).observe(canvas);

    } catch (error) {
      console.info('Using the lightweight CSS background.', error);
      canvas.remove();
    }
  };

  // Don't touch Three/Draco/GLB until the hero is near the viewport
  const lazy = new IntersectionObserver(([entry], self) => {
    if (!entry.isIntersecting) return;
    self.disconnect();
    // Let first paint and text finish before the heavy work
    (window.requestIdleCallback || ((fn) => setTimeout(fn, 200)))(loadScene);
  }, { rootMargin: '120px' });
  lazy.observe(hero);
}