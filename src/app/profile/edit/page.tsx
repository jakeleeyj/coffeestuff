'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { updateProfile } from '@/lib/actions/profile'

export default function EditProfilePage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('bio, avatar_url, display_name')
        .eq('id', user.id)
        .single()

      if (profile) {
        setDisplayName(profile.display_name ?? '')
        setBio(profile.bio ?? '')
        setAvatarUrl(profile.avatar_url)
      }
      setLoading(false)
    }
    load()
  }, [router])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  async function handleSubmit(formData: FormData) {
    setSubmitting(true)
    await updateProfile(formData)
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-8">
        <div className="animate-pulse space-y-4">
          <div className="w-20 h-20 rounded-full bg-surface-raised mx-auto" />
          <div className="h-4 bg-surface-raised rounded w-1/2 mx-auto" />
          <div className="h-24 bg-surface-raised rounded" />
        </div>
      </div>
    )
  }

  const displayAvatar = preview ?? avatarUrl

  return (
    <div className="max-w-lg mx-auto px-4 pt-8 pb-8">
      <h1 className="font-display text-2xl text-text mb-6 text-center">Edit Profile</h1>

      <form action={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-border hover:border-bloom transition-colors group"
          >
            {displayAvatar ? (
              <Image
                src={displayAvatar}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-surface-raised flex items-center justify-center text-bloom text-2xl font-semibold">
                ?
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-medium">Change</span>
            </div>
          </button>
          <input
            ref={fileRef}
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-sm text-bloom hover:text-bloom-hover transition-colors"
          >
            Change photo
          </button>
        </div>

        {/* Display Name */}
        <div>
          <label htmlFor="display_name" className="block text-sm font-medium text-text-muted mb-1">
            Display Name
          </label>
          <input
            id="display_name"
            name="display_name"
            type="text"
            maxLength={30}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your nickname..."
            className="w-full bg-white/5 border border-glass-border rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-bloom transition-colors"
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-text-muted mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            maxLength={160}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about your coffee journey..."
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-bloom transition-colors resize-none"
          />
          <p className="text-xs text-text-muted mt-1 text-right">{bio.length}/160</p>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-2.5 text-sm font-medium text-text-muted border border-border rounded-lg hover:bg-surface-raised transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-2.5 text-sm font-medium bg-bloom text-base rounded-lg hover:bg-bloom-hover transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
