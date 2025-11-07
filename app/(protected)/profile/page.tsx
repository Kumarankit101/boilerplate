'use client'

import { useUser } from '@/lib/hooks/use-user'
import { useUpdateUser } from '@/lib/hooks/use-update-user'
import { useUIStore } from '@/lib/store/ui-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

export default function ProfilePage() {
  const { data: user, isLoading, error } = useUser()
  const updateUser = useUpdateUser()
  const { theme } = useUIStore()
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUser.mutate({ name })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <p>Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <p className="text-red-500">Error loading profile</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl p-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-muted-foreground text-sm">
                Email cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder={user?.name || 'Enter your name'}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={updateUser.isPending}>
              {updateUser.isPending ? 'Saving...' : 'Save Changes'}
            </Button>

            {updateUser.isSuccess && (
              <p className="text-sm text-green-600">Profile updated!</p>
            )}
            {updateUser.isError && (
              <p className="text-sm text-red-600">Failed to update profile</p>
            )}
          </form>

          <div className="mt-6 space-y-2 rounded-lg border p-4">
            <p className="text-sm">
              <span className="font-semibold">User ID:</span> {user?.id}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Current Name:</span>{' '}
              {user?.name || 'Not set'}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Theme Preference:</span> {theme}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
