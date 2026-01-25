export type UserRole = 'master_admin' | 'org_admin' | 'org_member'
export type InvitationStatus = 'pending' | 'accepted' | 'expired'
export type OrgMemberRole = 'admin' | 'member'

export interface Organization {
  id: string
  name: string
  rut: string
  country: string
  employee_count: string
  status?: 'active' | 'inactive' | 'suspended'
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  organization_id: string | null
  email: string
  full_name: string
  phone: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Invitation {
  id: string
  email: string
  organization_id: string | null
  invited_by: string
  role: UserRole
  token: string
  status: InvitationStatus
  expires_at: string
  metadata?: {
    company_name?: string
    plan?: string
    notes?: string
  }
  created_at: string
}

export interface OrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role: OrgMemberRole
  created_at: string
}

export interface Project {
  id: string
  organization_id: string
  name: string
  description: string | null
  status: 'active' | 'paused' | 'completed' | 'cancelled'
  type: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  metadata: Record<string, any>
}

export interface Invoice {
  id: string
  organization_id: string
  invoice_number: string
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  issue_date: string
  due_date: string
  paid_date: string | null
  description: string | null
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  company: string
  phone: string | null
  service: string
  message: string | null
  created_at: string
}
