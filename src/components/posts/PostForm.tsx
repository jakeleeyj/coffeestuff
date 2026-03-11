'use client'

import { useState, useRef, useTransition } from 'react'
import { createPost } from '@/lib/actions/posts'
import BeanTagSelector from './BeanTagSelector'

type Bean = { id: string; name: string; roast_level: string | null }

const inputCls = "w-full bg-surface-raised border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder-text-dim focus:outline-none focus:border-bloom transition-colors"
const labelCls = "block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide"

const MAX_DIMENSION = 1920
const JPEG_QUALITY = 0.85

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img

      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round(height * MAX_DIMENSION / width)
          width = MAX_DIMENSION
        } else {
          width = Math.round(width * MAX_DIMENSION / height)
          height = MAX_DIMENSION
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        blob => resolve(blob ? new File([blob], 'photo.jpg', { type: 'image/jpeg' }) : file),
        'image/jpeg',
        JPEG_QUALITY
      )
    }
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
    img.src = url
  })
}

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function PostForm({ beans }: { beans: Bean[] }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [compressedFile, setCompressedFile] = useState<File | null>(null)
  const [compressing, setCompressing] = useState(false)
  const [fileSize, setFileSize] = useState<string | null>(null)
  const [selectedBeans, setSelectedBeans] = useState<string[]>([])
  const [pending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setCompressing(true)
    setPreviewUrl(null)
    setCompressedFile(null)

    const compressed = await compressImage(file)
    const preview = URL.createObjectURL(compressed)

    setCompressedFile(compressed)
    setPreviewUrl(preview)
    setFileSize(formatBytes(compressed.size))
    setCompressing(false)
  }

  function handleClear() {
    setPreviewUrl(null)
    setCompressedFile(null)
    setFileSize(null)
    // Reset file input
    const input = formRef.current?.querySelector('input[type="file"]') as HTMLInputElement
    if (input) input.value = ''
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!compressedFile) return
    const formData = new FormData(e.currentTarget)
    // Replace the raw file input with the compressed file
    formData.set('image', compressedFile, 'photo.jpg')
    selectedBeans.forEach(id => formData.append('bean_ids', id))
    startTransition(() => createPost(formData))
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">

      {/* Image */}
      <div>
        <label className={labelCls}>Photo</label>
        {compressing ? (
          <div className="flex flex-col items-center justify-center aspect-square rounded-2xl border border-border bg-surface">
            <div className="w-8 h-8 rounded-full border-2 border-bloom border-t-transparent animate-spin mb-3" />
            <span className="text-sm text-text-muted">Compressing…</span>
          </div>
        ) : previewUrl ? (
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-base/80 flex items-center justify-center text-text-muted hover:text-text text-lg leading-none"
            >
              ×
            </button>
            {fileSize && (
              <div className="absolute bottom-2 right-2 bg-base/70 text-text-muted text-[10px] px-2 py-0.5 rounded-full">
                {fileSize}
              </div>
            )}
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-border bg-surface cursor-pointer hover:border-bloom-dim transition-colors">
            <span className="text-4xl mb-3">📷</span>
            <span className="text-sm text-text-muted">Tap to add photo</span>
            <span className="text-xs text-text-dim mt-1">Auto-compressed · any size</span>
            <input
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Caption */}
      <div>
        <label className={labelCls}>Caption</label>
        <textarea
          name="caption"
          rows={3}
          placeholder="Tell us about this cup…"
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* Brew method */}
      <div>
        <label className={labelCls}>Brew method</label>
        <select name="brew_method" className={inputCls}>
          <option value="">Select…</option>
          <option value="espresso">Espresso</option>
          <option value="pour-over">Pour Over</option>
          <option value="aeropress">AeroPress</option>
          <option value="french-press">French Press</option>
          <option value="moka-pot">Moka Pot</option>
          <option value="cold-brew">Cold Brew</option>
          <option value="chemex">Chemex</option>
          <option value="v60">V60</option>
        </select>
      </div>

      {/* Recipe */}
      <div>
        <label className={labelCls}>Recipe <span className="text-text-dim normal-case">(optional)</span></label>
        <textarea
          name="recipe"
          rows={4}
          placeholder="Dose, ratio, water temp, grind size…"
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* Bean tags */}
      {beans.length > 0 && (
        <div>
          <label className={labelCls}>Beans <span className="text-text-dim normal-case">(optional)</span></label>
          <BeanTagSelector beans={beans} selected={selectedBeans} onChange={setSelectedBeans} />
        </div>
      )}

      <button
        type="submit"
        disabled={pending || !compressedFile || compressing}
        className="w-full bg-bloom text-base font-semibold py-2.5 rounded-xl text-sm hover:bg-bloom-hover transition-colors disabled:opacity-50"
      >
        {pending ? 'Sharing…' : 'Share'}
      </button>
    </form>
  )
}
