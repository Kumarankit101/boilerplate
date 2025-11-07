import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
      <div className="rounded-lg border p-6">
        <h2 className="mb-2 text-xl font-semibold">
          Welcome, {user?.firstName || 'User'}!
        </h2>
        <p className="text-muted-foreground">
          Email: {user?.emailAddresses[0]?.emailAddress}
        </p>
        <p className="text-muted-foreground mt-2">User ID: {userId}</p>
      </div>
    </div>
  )
}
