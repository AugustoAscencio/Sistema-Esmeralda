/**
 * GlobeHero v4 — Massive green aura, 300+ visible points, white-visible
 */
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function genPoints() {
  const pts = []
  const regions = [
    { latMin: 15, latMax: 32, lonMin: -118, lonMax: -87, n: 40 },
    { latMin: 7, latMax: 18, lonMin: -92, lonMax: -77, n: 30 },
    { latMin: 8, latMax: 22, lonMin: -85, lonMax: -60, n: 20 },
    { latMin: 0, latMax: 12, lonMin: -80, lonMax: -60, n: 35 },
    { latMin: -18, latMax: 2, lonMin: -82, lonMax: -68, n: 25 },
    { latMin: -33, latMax: 5, lonMin: -74, lonMax: -35, n: 70 },
    { latMin: -25, latMax: -10, lonMin: -68, lonMax: -55, n: 20 },
    { latMin: -55, latMax: -22, lonMin: -73, lonMax: -53, n: 40 },
    { latMin: 12, latMax: 14, lonMin: -88, lonMax: -83, n: 15 },
    // Africa & other
    { latMin: -5, latMax: 15, lonMin: -10, lonMax: 40, n: 20 },
    { latMin: 5, latMax: 30, lonMin: 70, lonMax: 100, n: 15 },
  ]
  const s = (i) => ((i * 9301 + 49297) % 233280) / 233280
  let idx = 0
  for (const r of regions) {
    for (let i = 0; i < r.n; i++) {
      pts.push({ lat: r.latMin + s(idx++) * (r.latMax - r.latMin), lon: r.lonMin + s(idx++) * (r.lonMax - r.lonMin) })
    }
  }
  return pts
}

function ll2v(lat, lon, r = 1.02) {
  const p = (90 - lat) * Math.PI / 180, t = (lon + 180) * Math.PI / 180
  return new THREE.Vector3(-r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t))
}

function Scene() {
  const gRef = useRef(), pRef = useRef()
  useFrame((_, d) => { if (gRef.current) gRef.current.rotation.y += d * 0.06; if (pRef.current) pRef.current.rotation.y += d * 0.06 })
  const pts = useMemo(() => genPoints(), [])
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const p = []; pts.forEach(({ lat, lon }) => { const v = ll2v(lat, lon); p.push(v.x, v.y, v.z) })
    g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3))
    return g
  }, [pts])

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} color="#34d399" />
      <pointLight position={[-3, 2, -3]} intensity={0.8} color="#10b981" />
      <directionalLight position={[-3, 5, -3]} intensity={0.6} />

      {/* MASSIVE outer glow */}
      <mesh>
        <sphereGeometry args={[1.45, 32, 32]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.15, 32, 32]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.06, 32, 32]} />
        <meshBasicMaterial color="#6ee7b7" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>

      {/* Globe */}
      <mesh ref={gRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#065f46" emissive="#047857" emissiveIntensity={0.25} roughness={0.6} metalness={0.15} />
      </mesh>

      {/* Farm points — BIGGER */}
      <points ref={pRef} geometry={geo}>
        <pointsMaterial color="#34d399" size={0.04} sizeAttenuation transparent opacity={0.95} />
      </points>
      {/* Bright layer */}
      <points geometry={geo}>
        <pointsMaterial color="#ffffff" size={0.02} sizeAttenuation transparent opacity={0.6} />
      </points>

      {/* Orbital ring */}
      <mesh rotation={[Math.PI / 2.2, 0.15, 0]}>
        <ringGeometry args={[1.2, 1.23, 128]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false}
        minPolarAngle={Math.PI / 3} maxPolarAngle={(2 * Math.PI) / 3} />
    </>
  )
}

export default function GlobeHero() {
  return (
    <Canvas camera={{ position: [0, 0, 2.8], fov: 45 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}>
      <Scene />
    </Canvas>
  )
}
