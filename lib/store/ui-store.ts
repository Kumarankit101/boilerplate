import { create } from 'zustand'

interface UIStore {
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  modalOpen: boolean
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setModalOpen: (open: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  theme: 'system',
  modalOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
  setModalOpen: (open) => set({ modalOpen: open }),
}))
