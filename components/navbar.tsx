'use client'

import Link from 'next/link'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            Boilerplate
          </Link>
          <div className="flex gap-4">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground"
            >
              Home
            </Link>
            <SignedIn>
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="text-muted-foreground hover:text-foreground"
              >
                Profile
              </Link>
            </SignedIn>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  )
}
