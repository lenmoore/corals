"use client";

import { Bloom, DepthOfField, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const BIRTHDAY_UTC = "2026-05-08T00:00:00Z";
const EMAIL = "hello@korals.global";

const CAMERA_FOV = 28;
const CAMERA_DISTANCE = 4;
const VIEW_HEIGHT_AT_ORIGIN = 2 * CAMERA_DISTANCE * Math.tan((CAMERA_FOV / 2) * (Math.PI / 180));
const FILL_RATIO = 0.7;

function isMesh(obj: THREE.Object3D): obj is THREE.Mesh {
  return (obj as THREE.Mesh).isMesh === true;
}

function CoralModel() {
  const gltf = useGLTF("/models/acropora_cervicornis.glb");

  const { object, scale, offset } = useMemo(() => {
    const cloned = gltf.scene.clone(true);

    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);

    const bottomCenter = new THREE.Vector3(
      (box.min.x + box.max.x) / 2,
      box.min.y,
      (box.min.z + box.max.z) / 2,
    );

    const target = VIEW_HEIGHT_AT_ORIGIN * FILL_RATIO;
    const longestSide = Math.max(size.x, size.y, size.z) || 1;
    const fitScale = target / longestSide;

    return {
      object: cloned,
      scale: fitScale,
      offset: bottomCenter.clone().multiplyScalar(-1),
    };
  }, [gltf.scene]);

  useEffect(() => {
    const specimenMaterial = new THREE.MeshPhysicalMaterial({
      color: "#F9ECE6",
      vertexColors: false,
      transparent: true,
      transmission: 0.93,
      opacity: 1,
      thickness: 1.05,
      roughness: 0.18,
      metalness: 0,
      clearcoat: 0.9,
      clearcoatRoughness: 0.12,
      emissive: "#FA7268",
      emissiveIntensity: 0.009,
      ior: 1.45,
      attenuationColor: "#FFD9CF",
      attenuationDistance: 2.2,
      sheen: 0.12,
      sheenColor: new THREE.Color("#FA7268"),
      sheenRoughness: 0.5,
      envMapIntensity: 1.3,
    });

    object.traverse((child) => {
      if (isMesh(child)) {
        child.material = specimenMaterial;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return () => {
      specimenMaterial.dispose();
    };
  }, [object]);

  return (
    <group scale={scale}>
      <primitive object={object} position={offset} />
    </group>
  );
}

function HeroModel() {
  return (
    <div
      className="relative aspect-square w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 50% 55%, #1A1A1F 0%, #0A0A0C 70%)",
      }}
    >
      <Canvas
        camera={{ fov: CAMERA_FOV, position: [0, 0.8, CAMERA_DISTANCE] }}
        dpr={[1, 2]}
        gl={{ alpha: true }}
        shadows
      >
        <ambientLight intensity={0.28} color="#FFFFFF" />
        <directionalLight position={[2, 3, 4]} intensity={1.9} color="#FFFFFF" castShadow />
        <directionalLight position={[-2, -0.5, -3]} intensity={0.45} color="#FA7268" />
        <Environment preset="night" />
        <CoralModel />
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.3}
          enableZoom={false}
          enablePan={false}
          target={[0, 0.5, 0]}
        />
        <EffectComposer>
          <Bloom intensity={0.95} luminanceThreshold={0.62} luminanceSmoothing={0.9} mipmapBlur />
          <DepthOfField focusDistance={0.006} focalLength={0.015} bokehScale={0.45} height={480} />
          <Vignette offset={0.3} darkness={0.6} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

function DaysCountdown() {
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const [pulseMinute, setPulseMinute] = useState<number>(0);

  useEffect(() => {
    const target = new Date(BIRTHDAY_UTC).getTime();
    const msPerDay = 1000 * 60 * 60 * 24;

    const update = () => {
      const now = Date.now();
      const remaining = target - now;
      const nextDays = Math.max(0, Math.ceil(remaining / msPerDay));
      setDaysLeft(nextDays);
    };

    update();
    const intervalId = window.setInterval(() => {
      update();
      setPulseMinute((prev) => prev + 1);
    }, 60000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <section className="flex flex-col items-start gap-2" aria-live="polite">
      <p
        key={pulseMinute}
        className="display-caps countdown-pulse text-[clamp(4rem,9vw,7.5rem)] leading-none text-[var(--coral)]"
      >
        {daysLeft}
      </p>
      <p className="label-copy">days until May 8 — David&apos;s 100th</p>
    </section>
  );
}

function EmailCopyLink() {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsCopied(false);
    }, 1300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isCopied]);

  const shownText = isCopied ? "copied!" : isHovered ? "copy email" : EMAIL;

  const onCopyClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(EMAIL);
      setIsCopied(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <a
      href={`mailto:${EMAIL}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onClick={onCopyClick}
      className="contact-line text-[var(--ink-mute)] transition-colors hover:text-[var(--coral)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
    >
      {shownText}
    </a>
  );
}

export default function HomePage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { amount: 0.2, once: true });

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--bg-alt)] focus:px-3 focus:py-2 focus:text-[var(--ink)]"
      >
        skip to main content
      </a>
      <main id="main-content" className="page-shell">
        <motion.section
          ref={sectionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="page-section"
        >
          <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="flex flex-col justify-center gap-8 lg:col-span-4">
              <blockquote className="border-l border-[var(--coral)] pl-5">
                <p className="body-copy quote-copy text-[clamp(1.15rem,2.2vw,1.6rem)] leading-[1.32]">
                  After almost 100 years on the planet, I now understand
                  the most important place on Earth is not on land, but at sea.
                </p>
                <footer className="label-copy mt-4">Sir David Attenborough</footer>
              </blockquote>
              <DaysCountdown />
              <EmailCopyLink />
            </div>

            <div className="relative lg:col-span-8">
              <HeroModel />
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}

useGLTF.preload("/models/acropora_cervicornis.glb");
