export interface Task {
    id: number
    title: string
    description?: string
    dueDate: string
    status: "pending" | "done"
    customerId?: number
    priority?: "high" | "medium" | "low"
    assignee?: string
    category?: string
    tags?: string[]
  }
  