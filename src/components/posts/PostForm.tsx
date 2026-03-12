'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createPost } from '@/lib/actions/posts'
import BeanTagSelector from './BeanTagSelector'
import ImageCropper from './ImageCropper'

type Bean = { id: string; name: string; roast_level: string | null }

const inputCls = "w-full bg-surface-raised border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder-text-dim focus:outline-none focus:border-bloom transition-colors"
const labelCls = "block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide"

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function PostForm({ beans }: { beans: Bean[] }) {
  const router = useRouter()
  const [rawImageUrl, setRawImageUrl] = useState<string | null>(null)
  const [croppedFile, setCroppedFile] = useState<File | null>(null)
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null)
  const [selectedBeans, setSelectedBeans] = useState<string[]>([])
  const [pending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setRawImageUrl(URL.createObjectURL(file))
    setCroppedFile(null)
    setCroppedPreview(null)
  }

  function handleCrop(file: File) {
    setCroppedFile(file)
    setCroppedPreview(URL.createObjectURL(file))
    setRawImageUrl(null)
  }

  function handleCropCancel() {
    setRawImageUrl(null)
    const input = formRef.current?.querySelector('input[type="file"]') as HTMLInputElement
    if (input) input.value = ''
  }

  function handleClear() {
    setCroppedFile(null)
    setCroppedPreview(null)
    setRawImageUrl(null)
    const input = formRef.current?.querySelector('input[type="file"]') as HTMLInputElement
    if (input) input.value = ''
  }

  // Bean tag drag reorder
  function handleDragStart(idx: number) {
    setDragIdx(idx)
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault()
    if (dragIdx === null || dragIdx === idx) return
    const reordered = [...selectedBeans]
    const [moved] = reordered.splice(dragIdx, 1)
    reordered.splice(idx, 0, moved)
    setSelectedBeans(reordered)
    setDragIdx(idx)
  }

  function handleDragEnd() {
    setDragIdx(null)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!croppedFile) return
    const formData = new FormData(e.currentTarget)
    formData.set('image', croppedFile, 'photo.jpg')
    selectedBeans.forEach(id => formData.append('bean_ids', id))
    startTransition(async () => {
      await createPost(formData)
      setSuccess(true)
      setTimeout(() => router.push('/feed'), 1500)
    })
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-20 h-20 rounded-full bg-bloom/20 flex items-center justify-center check-pop">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d4963f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <p className="font-display text-xl text-cream">Shared!</p>
        <p className="text-sm text-text-muted">Your post is live</p>
      </div>
    )
  }

  // Show cropper if raw image selected but not yet cropped
  if (rawImageUrl) {
    return (
      <div className="space-y-2">
        <label className={labelCls}>Crop your photo</label>
        <ImageCropper imageUrl={rawImageUrl} onCrop={handleCrop} onCancel={handleCropCancel} />
      </div>
    )
  }

  const beanMap = Object.fromEntries(beans.map(b => [b.id, b]))

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">

      {/* Image */}
      <div>
        <label className={labelCls}>Photo</label>
        {croppedPreview ? (
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={croppedPreview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-base/80 flex items-center justify-center text-text-muted hover:text-text text-lg leading-none"
            >
              ×
            </button>
            <button
              type="button"
              onClick={() => {
                // Re-enter crop mode — need original image
                // For simplicity, clear and re-select
                handleClear()
              }}
              className="absolute top-2 left-2 bg-base/80 text-text-muted hover:text-text text-xs px-2.5 py-1 rounded-full"
            >
              Re-crop
            </button>
            {croppedFile && (
              <div className="absolute bottom-2 right-2 bg-base/70 text-text-muted text-[10px] px-2 py-0.5 rounded-full">
                {formatBytes(croppedFile.size)}
              </div>
            )}
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-border bg-surface cursor-pointer hover:border-bloom-dim transition-colors">
            <span className="text-4xl mb-3">📷</span>
            <span className="text-sm text-text-muted">Tap to add photo</span>
            <span className="text-xs text-text-dim mt-1">You&apos;ll crop it next</span>
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

          {/* Draggable selected beans for reordering */}
          {selectedBeans.length > 1 && (
            <div className="mt-2">
              <p className="text-[10px] text-text-dim mb-1.5">Drag to reorder</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedBeans.map((id, idx) => {
                  const bean = beanMap[id]
                  if (!bean) return null
                  return (
                    <div
                      key={id}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragEnd={handleDragEnd}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium bg-bloom/20 text-bloom border border-bloom/30 cursor-grab active:cursor-grabbing select-none transition-opacity ${
                        dragIdx === idx ? 'opacity-50' : ''
                      }`}
                    >
                      {bean.name}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={pending || !croppedFile}
        className="w-full bg-bloom text-base font-semibold py-2.5 rounded-xl text-sm hover:bg-bloom-hover transition-colors disabled:opacity-50"
      >
        {pending ? 'Sharing…' : 'Share'}
      </button>
    </form>
  )
}
