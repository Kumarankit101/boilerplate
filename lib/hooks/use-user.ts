import { useQuery } from '@tanstack/react-query'
import { userSchema, type User } from '@/lib/validations/user'

async function fetchUser(): Promise<User> {
  const response = await fetch('/api/user')
  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }
  const data = await response.json()
  return userSchema.parse(data)
}

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
