"use client";

import { Bloom, DepthOfField, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EMAIL = "helena@korals.global";
const MEETING_URL = "https://calendar.app.google/BPQZtVt4LrxVoLkAA";
const BUSINESS_URL = "https://okredo.com/en-ee/company/korals-ou-17580021";

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
    <div className="relative h-full w-full overflow-hidden">
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
      <main id="main-content">
        <section ref={sectionRef} className="relative min-h-svh overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(58% 62% at 70% 50%, #1C1C21 0%, #101014 45%, #0A0A0C 75%)",
            }}
          />
          <div className="absolute inset-y-0 right-0 w-full lg:w-[64%]">
            <HeroModel />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden lg:block"
            style={{
              background:
                "linear-gradient(100deg, var(--bg) 8%, rgba(10,10,12,0.9) 34%, rgba(10,10,12,0.3) 60%, rgba(10,10,12,0) 78%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 lg:hidden"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,10,12,0.92) 0%, rgba(10,10,12,0.82) 45%, rgba(10,10,12,0.93) 100%)",
            }}
          />

          <div className="pointer-events-none relative mx-auto flex min-h-svh w-[min(1440px,100%)] flex-col justify-between px-6 py-14 lg:px-20 lg:py-16">
            <motion.a
              href={BUSINESS_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT }}
              className="label-copy pointer-events-auto self-start transition-colors hover:text-[var(--coral)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
            >
              korals oü
            </motion.a>

            <div className="flex max-w-[34rem] flex-col gap-7">
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
                className="flex flex-col"
              >
                <span className="display-caps font-black text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.92] tracking-[-0.03em] text-[var(--coral)]">
                  Korals
                </span>
                <span className="mt-4 max-w-[26rem] font-(family-name:--font-display) font-black text-[clamp(1.2rem,2.1vw,1.65rem)] leading-[1.25] text-pretty text-[var(--ink)]">
                  is a boutique web studio for ambitious teams.
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.22 }}
                className="flex flex-col items-start gap-4"
              >
                <p className="label-copy">booked until November</p>
                <a
                  href={MEETING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group pointer-events-auto inline-flex items-center gap-3 border-b border-[var(--coral)] pb-2 text-[var(--coral)] transition-colors hover:border-[var(--coral-glow)] hover:text-[var(--coral-glow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
                >
                  <span className="contact-line text-[15px]">book a meeting</span>
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.46 }}
              className="pointer-events-auto self-start"
            >
              <EmailCopyLink />
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}

useGLTF.preload("/models/acropora_cervicornis.glb");
