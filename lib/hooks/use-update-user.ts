import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UpdateUserInput } from '@/lib/validations/user'

async function updateUser(data: UpdateUserInput) {
  const response = await fetch('/api/user', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to update user')
  }

  return response.json()
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}
