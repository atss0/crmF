export type OpportunityStage = "contacted" | "meeting" | "proposal" | "won" | "lost"

export interface Opportunity {
  id: number
  title: string
  customerName: string
  value: number
  stage: OpportunityStage
  note?: string
  contactDate?: string
  expectedCloseDate?: string
  probability?: number
  source?: string
}
