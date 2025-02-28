export interface Gathering {
  id: string
  title: string
  description?: string | null
  location: string
  date: string
  capacity: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

