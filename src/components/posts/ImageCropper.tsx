'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

type Props = {
  imageUrl: string
  onCrop: (file: File) => void
  onCancel: () => void
}

const OUTPUT_SIZE = 1080
const MIN_ZOOM = 1
const MAX_ZOOM = 3

export default function ImageCropper({ imageUrl, onCrop, onCancel }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 })
  const dragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const pinchDist = useRef<number | null>(null)
  const pinchZoom = useRef(1)

  // Load image dimensions
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      setImgSize({ w: img.naturalWidth, h: img.naturalHeight })
      // Default zoom: fill the square
      const minSide = Math.min(img.naturalWidth, img.naturalHeight)
      const maxSide = Math.max(img.naturalWidth, img.naturalHeight)
      const fillZoom = maxSide / minSide
      setZoom(Math.min(fillZoom, MAX_ZOOM))
    }
    img.src = imageUrl
  }, [imageUrl])

  const clampOffset = useCallback((ox: number, oy: number, z: number) => {
    if (!imgSize.w || !imgSize.h) return { x: 0, y: 0 }
    const aspect = imgSize.w / imgSize.h
    // Image is rendered to fill square; figure out base dimensions
    let baseW: number, baseH: number
    if (aspect >= 1) {
      // Landscape: height fills container, width overflows
      baseH = 1
      baseW = aspect
    } else {
      // Portrait: width fills container, height overflows
      baseW = 1
      baseH = 1 / aspect
    }
    const scaledW = baseW * z
    const scaledH = baseH * z
    const maxX = Math.max(0, (scaledW - 1) / 2)
    const maxY = Math.max(0, (scaledH - 1) / 2)
    return {
      x: Math.max(-maxX, Math.min(maxX, ox)),
      y: Math.max(-maxY, Math.min(maxY, oy)),
    }
  }, [imgSize])

  // Pointer events for drag
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return // handled by touch events
    dragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || e.pointerType === 'touch') return
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const dx = (e.clientX - lastPos.current.x) / rect.width
    const dy = (e.clientY - lastPos.current.y) / rect.height
    lastPos.current = { x: e.clientX, y: e.clientY }
    setOffset(prev => clampOffset(prev.x + dx, prev.y + dy, zoom))
  }, [zoom, clampOffset])

  const onPointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  // Touch events for drag + pinch zoom
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      dragging.current = true
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    } else if (e.touches.length === 2) {
      dragging.current = false
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      pinchDist.current = Math.hypot(dx, dy)
      pinchZoom.current = zoom
    }
  }, [zoom])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()

    if (e.touches.length === 1 && dragging.current) {
      const dx = (e.touches[0].clientX - lastPos.current.x) / rect.width
      const dy = (e.touches[0].clientY - lastPos.current.y) / rect.height
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      setOffset(prev => clampOffset(prev.x + dx, prev.y + dy, zoom))
    } else if (e.touches.length === 2 && pinchDist.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.hypot(dx, dy)
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, pinchZoom.current * (dist / pinchDist.current)))
      setZoom(newZoom)
      setOffset(prev => clampOffset(prev.x, prev.y, newZoom))
    }
  }, [zoom, clampOffset])

  const onTouchEnd = useCallback(() => {
    dragging.current = false
    pinchDist.current = null
  }, [])

  // Mouse wheel zoom
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom - e.deltaY * 0.002))
    setZoom(newZoom)
    setOffset(prev => clampOffset(prev.x, prev.y, newZoom))
  }, [zoom, clampOffset])

  // Crop and export
  const handleCrop = useCallback(() => {
    const img = imgRef.current
    if (!img) return

    const canvas = document.createElement('canvas')
    canvas.width = OUTPUT_SIZE
    canvas.height = OUTPUT_SIZE
    const ctx = canvas.getContext('2d')!

    const aspect = img.naturalWidth / img.naturalHeight
    let baseW: number, baseH: number
    if (aspect >= 1) {
      baseH = OUTPUT_SIZE
      baseW = OUTPUT_SIZE * aspect
    } else {
      baseW = OUTPUT_SIZE
      baseH = OUTPUT_SIZE / aspect
    }

    const drawW = baseW * zoom
    const drawH = baseH * zoom
    const drawX = (OUTPUT_SIZE - drawW) / 2 + offset.x * OUTPUT_SIZE
    const drawY = (OUTPUT_SIZE - drawH) / 2 + offset.y * OUTPUT_SIZE

    ctx.drawImage(img, drawX, drawY, drawW, drawH)

    canvas.toBlob(
      blob => {
        if (blob) onCrop(new File([blob], 'photo.jpg', { type: 'image/jpeg' }))
      },
      'image/jpeg',
      0.9
    )
  }, [zoom, offset, onCrop])

  // Compute CSS transform
  const aspect = imgSize.w && imgSize.h ? imgSize.w / imgSize.h : 1
  let objectFit: string
  if (aspect >= 1) {
    objectFit = `auto 100%`
  } else {
    objectFit = `100% auto`
  }

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="relative aspect-square rounded-2xl overflow-hidden bg-base cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Crop preview"
          draggable={false}
          className="absolute top-1/2 left-1/2 select-none pointer-events-none"
          style={{
            width: objectFit.split(' ')[0],
            height: objectFit.split(' ')[1],
            transform: `translate(-50%, -50%) translate(${offset.x * 100}%, ${offset.y * 100}%) scale(${zoom})`,
            transformOrigin: 'center',
          }}
        />
        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/10" />
          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/10" />
          <div className="absolute top-1/3 left-0 right-0 h-px bg-white/10" />
          <div className="absolute top-2/3 left-0 right-0 h-px bg-white/10" />
        </div>
      </div>

      {/* Zoom slider */}
      <div className="flex items-center gap-3 px-1">
        <span className="text-xs text-text-dim">−</span>
        <input
          type="range"
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={0.01}
          value={zoom}
          onChange={e => {
            const z = parseFloat(e.target.value)
            setZoom(z)
            setOffset(prev => clampOffset(prev.x, prev.y, z))
          }}
          className="flex-1 accent-bloom h-1"
        />
        <span className="text-xs text-text-dim">+</span>
      </div>

      <p className="text-[10px] text-text-dim text-center">Drag to reposition · pinch or scroll to zoom</p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium text-text-muted border border-border hover:border-bloom-dim transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCrop}
          className="flex-1 bg-bloom text-base py-2.5 rounded-xl text-sm font-semibold hover:bg-bloom-hover transition-colors"
        >
          Crop
        </button>
      </div>
    </div>
  )
}
