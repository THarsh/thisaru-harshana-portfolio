import { useEffect, useRef, lazy, Suspense } from "react";
import * as THREE from "three";
import "./App.scss";

const PortfolioImage = lazy(() => import("./components/PortfolioImage"));

function WebGLBackground() {
  const mountRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Main glowing 3D shape
    const sphereGeometry = new THREE.IcosahedronGeometry(1.7, 2);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0xffc700,
      metalness: 0.35,
      roughness: 0.25,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(2.4, 0.2, 0);
    scene.add(sphere);

    // Inner soft glowing shape
    const innerGeometry = new THREE.SphereGeometry(1.15, 32, 32);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.08,
    });

    const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
    innerSphere.position.copy(sphere.position);
    scene.add(innerSphere);

    // Floating rings
    const ringGroup = new THREE.Group();

    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.TorusGeometry(
        2.1 + i * 0.28,
        0.01,
        16,
        100
      );
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: i === 1 ? 0xffffff : 0xffc700,
        transparent: true,
        opacity: 0.25,
      });

      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2.8 + i * 0.35;
      ring.rotation.y = i * 0.5;
      ringGroup.add(ring);
    }

    ringGroup.position.copy(sphere.position);
    scene.add(ringGroup);

    // Particles
    const particleCount = 900;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      particlePositions[i] = (Math.random() - 0.5) * 13;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.018,
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Small floating cubes
    const cubeGroup = new THREE.Group();

    for (let i = 0; i < 14; i++) {
      const cubeGeometry = new THREE.BoxGeometry(0.12, 0.12, 0.12);
      const cubeMaterial = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xffc700 : 0xffffff,
        transparent: true,
        opacity: 0.5,
      });

      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

      cube.position.set(
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4
      );

      cube.rotation.set(Math.random(), Math.random(), Math.random());
      cubeGroup.add(cube);
    }

    scene.add(cubeGroup);

    // Lights
    const pointLight = new THREE.PointLight(0xffc700, 1.6);
    pointLight.position.set(3, 3, 4);
    scene.add(pointLight);

    const whiteLight = new THREE.PointLight(0xffffff, 0.8);
    whiteLight.position.set(-4, -2, 3);
    scene.add(whiteLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationId;

    const animate = () => {
      sphere.rotation.x += 0.004;
      sphere.rotation.y += 0.006;

      innerSphere.rotation.x -= 0.002;
      innerSphere.rotation.y += 0.003;

      ringGroup.rotation.x += 0.002;
      ringGroup.rotation.y += 0.004;

      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0003;

      cubeGroup.rotation.x += 0.001;
      cubeGroup.rotation.y += 0.002;

      sphere.position.x = 2.4 + mouse.current.x * 0.25;
      sphere.position.y = 0.2 + mouse.current.y * 0.25;

      innerSphere.position.copy(sphere.position);
      ringGroup.position.copy(sphere.position);

      camera.position.x += (mouse.current.x * 0.35 - camera.position.x) * 0.03;
      camera.position.y += (mouse.current.y * 0.25 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);

      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);

      mount.removeChild(renderer.domElement);

      sphereGeometry.dispose();
      sphereMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();

      renderer.dispose();
    };
  }, []);

  return <div className="webgl-bg" ref={mountRef} />;
}

function App() {
  return (
    <main className="portfolio-page">
      <WebGLBackground />

      <section className="hero-section">
        <div className="hero-card">
          <div className="profile-area">
            <div className="profile-ring">
              <Suspense fallback={<div className="image-skeleton" />}>
                <PortfolioImage />
              </Suspense>
            </div>
          </div>

          <div className="content">
            <p className="hello-text">Hello, I’m</p>

            <h1>Harshana Hewage</h1>

            <h2>
              Frontend Software Engineer, React Native Developer, UI/UX
              Designer, FPV Pilot & Photographer
            </h2>

            <p className="description">
              I build modern, responsive and user-friendly digital experiences
              for web and mobile. My main passion is frontend engineering, UI/UX
              design and creating clean interfaces that feel simple, fast and
              meaningful.
            </p>

            <div className="tags">
              <span>React</span>
              <span>TypeScript</span>
              <span>React Native</span>
              <span>UI/UX Design</span>
              <span>Mobile Apps</span>
              <span>FPV Pilot</span>
              <span>Photography</span>
            </div>

            <div className="actions">
              <a href="mailto:thisaru.info@gmail.com" className="primary-btn">
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-card">
          <h3>Frontend Development</h3>
          <p>
            Fast, responsive and scalable web applications built with React,
            TypeScript, modern frontend technologies and clean reusable
            components.
          </p>
        </div>

        <div className="info-card">
          <h3>React Native Mobile Apps</h3>
          <p>
            Creating smooth cross-platform mobile applications with simple
            layouts, clean UI and strong user experience for both Android and
            iOS.
          </p>
        </div>

        <div className="info-card">
          <h3>UI/UX Design</h3>
          <p>
            Creating simple, attractive and user-focused interfaces with proper
            layout, spacing, color balance and smooth interaction flow.
          </p>
        </div>

        <div className="info-card">
          <h3>FPV & Photography</h3>
          <p>
            Beyond software, I’m passionate about photography and FPV flying. I
            build and troubleshoot quadcopters, bringing together creativity,
            motion, technical problem-solving and visual storytelling.
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;
