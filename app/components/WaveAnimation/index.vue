<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let scene: THREE.Scene | null = null
let camera: THREE.Camera | null = null
let renderer: THREE.WebGLRenderer | null = null
let animationId: number | null = null
let particles: THREE.Points | null = null

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas)
    return

  // 初始化Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xFFFFFF)

  // 初始化Camera
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 80
  camera.position.y = 20

  // 初始化Renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(0xFFFFFF, 0)

  // 创建粒子几何体 - 生成网格状的粒子排列
  const particleCountX = 70
  const particleCountY = 30
  const particleCount = particleCountX * particleCountY
  const geometry = new THREE.BufferGeometry()

  const positions = new Float32Array(particleCount * 3)
  const originalPositions = new Float32Array(particleCount * 3)
  const scales = new Float32Array(particleCount)

  const spacingX = 10
  const spacingY = 3

  for (let y = 0; y < particleCountY; y++) {
    for (let x = 0; x < particleCountX; x++) {
      const idx = y * particleCountX + x

      const posX = (x - particleCountX / 2) * spacingX
      const posY = -20
      const posZ = (y - particleCountY / 2) * spacingY

      positions[idx * 3] = posX
      positions[idx * 3 + 1] = posY
      positions[idx * 3 + 2] = posZ

      originalPositions[idx * 3] = posX
      originalPositions[idx * 3 + 1] = posY
      originalPositions[idx * 3 + 2] = posZ

      scales[idx] = 1
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1))

  // 创建材质
  const material = new THREE.PointsMaterial({
    color: 0x108CF0,
    size: 1.2,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8,
    fog: false,
  })

  // 创建粒子系统
  particles = new THREE.Points(geometry, material)
  scene.add(particles)

  // 动画循环
  let time = 0
  const animate = () => {
    time += 0.012 // 约60fps，速度比之前快一些

    // 更新粒子位置 - 模拟海浪效果
    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute
    const pos = posAttr.array as Float32Array

    for (let y = 0; y < particleCountY; y++) {
      for (let x = 0; x < particleCountX; x++) {
        const idx = y * particleCountX + x

        const originX = originalPositions[idx * 3] ?? 0
        const originY = originalPositions[idx * 3 + 1] ?? 0
        const originZ = originalPositions[idx * 3 + 2] ?? 0

        // 海浪公式：多个正弦波的组合 - 幅度减小，速度减缓
        const wave1 = Math.sin(originZ * 0.08 + time * 0.8) * 14
        const wave2 = Math.sin(originZ * 0.04 + time * 0.5 + Math.PI / 4) * 10
        const wave3 = Math.cos(originX * 0.05 + time * 0.6) * 8

        // 合并波浪效果
        const waveHeight = wave1 + wave2 + wave3

        // 只保留Y方向的波浪运动，X和Z保持不变
        pos[idx * 3] = originX
        pos[idx * 3 + 1] = originY + waveHeight
        pos[idx * 3 + 2] = originZ
      }
    }

    posAttr.needsUpdate = true

    // 粒子系统的整体旋转
    if (particles) {
      particles.rotation.x = Math.sin(time * 0.2) * 0.15
      particles.rotation.z = Math.cos(time * 0.3) * 0.1
    }

    // 渲染
    if (renderer && scene && camera) {
      renderer.render(scene, camera)
    }

    animationId = requestAnimationFrame(animate)
  }

  animate()

  // 处理窗口缩放
  const handleResize = () => {
    const newWidth = canvas.clientWidth
    const newHeight = canvas.clientHeight

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
    }

    renderer?.setSize(newWidth, newHeight)
  }

  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    geometry.dispose()
    material.dispose()
    renderer?.dispose()
  })
})
</script>

<template>
  <div class="wave-animation">
    <canvas ref="canvasRef" />
  </div>
</template>

<style scoped lang="scss">
.wave-animation {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(16, 140, 240, 0.08));
  border-radius: 0 0 8px 8px;

  canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
