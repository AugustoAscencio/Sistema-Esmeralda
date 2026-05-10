/**
 * GlobeHero.jsx — Globo 3D girando con puntos de parcelas en Latinoamérica
 * Sin datos externos — 100% estático, siempre carga
 */

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, OrbitControls, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Coordenadas lat/lon de parcelas demo en LATAM
const FARM_POINTS = [
  { lat: 12.64,  lon: -87.18 },
  { lat:  9.93,  lon: -84.08 },
  { lat: 14.09,  lon: -87.21 },
  { lat: -2.10,  lon: -79.90 },
  { lat: -15.78, lon: -47.93 },
  { lat: -34.60, lon: -58.38 },
  { lat:  4.71,  lon: -74.07 },
  { lat: 19.43,  lon: -99.13 },
  { lat: -12.05, lon: -77.04 },
  { lat: -23.55, lon: -46.63 },
]

function latLonToVec3(lat, lon, r = 1.02) {
  const phi   = (90 - lat)  * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  )
}

function GlobeScene() {
  const globeRef  = useRef()
  const pointsRef = useRef()

  useFrame((_, delta) => {
    if (globeRef.current)  globeRef.current.rotation.y  += delta * 0.08
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.08
  })

  const pointsGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = []
    FARM_POINTS.forEach(({ lat, lon }) => {
      const v = latLonToVec3(lat, lon)
      positions.push(v.x, v.y, v.z)
    })
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geo
  }, [])

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#1de98b" />
      <pointLight position={[-5, -3, -5]} intensity={0.4} color="#10b46c" />

      {/* Globo principal */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#0f2417"
          emissive="#0a2e1a"
          emissiveIntensity={0.3}
          distort={0.08}
          speed={1.5}
          roughness={0.6}
          metalness={0.2}
          wireframe={false}
        />
      </mesh>

      {/* Halo exterior */}
      <mesh>
        <sphereGeometry args={[1.08, 32, 32]} />
        <meshBasicMaterial
          color="#10b46c"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Puntos de parcelas activas */}
      <points ref={pointsRef} geometry={pointsGeometry}>
        <pointsMaterial
          color="#1de98b"
          size={0.05}
          sizeAttenuation
          transparent
          opacity={0.9}
        />
      </points>

      {/* Anillo orbital */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.15, 1.17, 64]} />
        <meshBasicMaterial color="#1de98b" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Segundo anillo inclinado */}
      <mesh rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <ringGeometry args={[1.22, 1.23, 64]} />
        <meshBasicMaterial color="#10b46c" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
      />
    </>
  )
}

export default function GlobeHero() {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.8], fov: 45 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <GlobeScene />
    </Canvas>
  )
}
