/**
 * ScoreSphere.jsx — Esfera 3D animada que refleja el Score de Resiliencia
 * Props: score (0–100), size (px, default 200)
 */

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function scoreToStyle(score) {
  if (score >= 75) return { color: '#10b46c', emissive: '#0a4a28', distort: 0.12, speed: 1.2, pulse: 0.005 }
  if (score >= 55) return { color: '#3db87a', emissive: '#1a4530', distort: 0.20, speed: 1.8, pulse: 0.008 }
  if (score >= 35) return { color: '#f59e0b', emissive: '#4a2e00', distort: 0.32, speed: 2.5, pulse: 0.015 }
  return               { color: '#f04040', emissive: '#4a0a0a', distort: 0.48, speed: 3.5, pulse: 0.025 }
}

function SphereScene({ score }) {
  const meshRef = useRef()
  const ringRef = useRef()
  const style   = useMemo(() => scoreToStyle(score), [score])
  const progress = score / 100

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    meshRef.current.rotation.y = t * 0.3
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.1
    const pulse = 1 + Math.sin(t * 3) * style.pulse
    meshRef.current.scale.setScalar(pulse)
    if (ringRef.current) ringRef.current.rotation.z = t * 0.5
  })

  const ringProgress = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, 0.72, 0.72, 0, progress * Math.PI * 2, false)
    const points = curve.getPoints(64)
    const geo = new THREE.BufferGeometry().setFromPoints(points)
    return geo
  }, [progress])

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 2, 2]} intensity={1.5} color={style.color} />
      <pointLight position={[-2, -2, -2]} intensity={0.5} color="#ffffff" />

      {/* Esfera principal */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.6, 48, 48]} />
        <MeshDistortMaterial
          color={style.color}
          emissive={style.emissive}
          emissiveIntensity={0.6}
          distort={style.distort}
          speed={style.speed}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* Halo suave */}
      <mesh>
        <sphereGeometry args={[0.68, 32, 32]} />
        <meshBasicMaterial color={style.color} transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>

      {/* Anillo de progreso */}
      <line ref={ringRef} geometry={ringProgress} rotation={[-Math.PI / 2, 0, 0]}>
        <lineBasicMaterial color={style.color} linewidth={2} transparent opacity={0.8} />
      </line>

      {/* Anillo base (track) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.70, 0.73, 64]} />
        <meshBasicMaterial color="#1a3d26" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}

export default function ScoreSphere({ score = 0, size = 200 }) {
  const scoreColor = score >= 55 ? 'var(--esmeralda-bright)' : score >= 35 ? '#fde047' : '#f87171'

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 1.8], fov: 45 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <SphereScene score={score} />
      </Canvas>

      {/* Score number overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: size * 0.22 + 'px',
          fontWeight: 800,
          color: scoreColor,
          lineHeight: 1,
          textShadow: '0 0 20px currentColor',
        }}>
          {score}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: size * 0.07 + 'px',
          color: 'var(--text-secondary)',
          marginTop: '4px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          resiliencia
        </span>
      </div>
    </div>
  )
}
