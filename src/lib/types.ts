export type PostWithRelations = {
  id: string
  image_url: string
  caption: string | null
  brew_method: string | null
  created_at: string
  user_id?: string
  recipe?: string | null
  profiles: {
    id: string
    username: string
    avatar_url: string | null
  } | null
  post_beans: {
    beans: {
      id: string
      name: string
      roast_level: string | null
    } | null
  }[]
}
