import { prisma } from '@/lib/prisma'

export async function getUserByClerkId(clerkUserId: string) {
  try {
    return await prisma.user.findUnique({
      where: { clerkUserId },
    })
  } catch (error) {
    console.error('Error fetching user by Clerk ID:', error)
    return null
  }
}

export async function createUser(data: {
  clerkUserId: string
  email: string
  name?: string
}) {
  try {
    return await prisma.user.create({
      data,
    })
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export async function updateUser(
  clerkUserId: string,
  data: { name?: string; email?: string }
) {
  try {
    return await prisma.user.update({
      where: { clerkUserId },
      data,
    })
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}
