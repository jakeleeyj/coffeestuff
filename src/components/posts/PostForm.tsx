'use client'

import { useState, useTransition } from 'react'
import { createPost } from '@/lib/actions/posts'
import BeanTagSelector from './BeanTagSelector'

type Bean = { id: string; name: string; roast_level: string | null }

const inputCls = "w-full bg-surface-raised border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder-text-dim focus:outline-none focus:border-bloom transition-colors"
const labelCls = "block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide"

export default function PostForm({ beans }: { beans: Bean[] }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [hasImage, setHasImage] = useState(false)
  const [selectedBeans, setSelectedBeans] = useState<string[]>([])
  const [pending, startTransition] = useTransition()

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setHasImage(true)
    setPreviewUrl(URL.createObjectURL(file))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    selectedBeans.forEach(id => formData.append('bean_ids', id))
    startTransition(() => createPost(formData))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Image */}
      <div>
        <label className={labelCls}>Photo</label>
        {previewUrl ? (
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => { setPreviewUrl(null); setHasImage(false) }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-base/80 flex items-center justify-center text-text-muted hover:text-text text-lg leading-none"
            >
              ×
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-border bg-surface cursor-pointer hover:border-bloom-dim transition-colors">
            <span className="text-4xl mb-3">📷</span>
            <span className="text-sm text-text-muted">Tap to add photo</span>
            <span className="text-xs text-text-dim mt-1">JPEG, PNG or WebP · max 5MB</span>
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
        disabled={pending || !hasImage}
        className="w-full bg-bloom text-base font-semibold py-2.5 rounded-xl text-sm hover:bg-bloom-hover transition-colors disabled:opacity-50"
      >
        {pending ? 'Sharing…' : 'Share'}
      </button>
    </form>
  )
}
