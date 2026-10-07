export type UserRole = 'admin' | 'finance' | 'hr' | 'viewer'

export type EmployeeType = 'crew' | 'staff'

export type TransactionType = 'income' | 'expense'

export type PayrollStatus = 'draft' | 'calculated' | 'approved'

export interface Vessel {
  id: string
  name: string
  type: string
  capacity: string | null
  status: string
  created_at: string
}

export interface Employee {
  id: string
  name: string
  employee_type: EmployeeType
  vessel_id: string | null
  vessel?: Vessel | null
  position: string
  basic_salary: number
  join_date: string
  status: string
  created_at: string
}

export interface TransactionCategory {
  id: string
  name: string
  type: TransactionType
  created_at: string
}

export interface Transaction {
  id: string
  transaction_date: string
  category_id: string | null
  category?: TransactionCategory | null
  vessel_id: string | null
  vessel?: Vessel | null
  description: string | null
  amount: number
  type: TransactionType
  created_at: string
}

export interface SalaryComponent {
  id: string
  name: string
  type: 'earning' | 'deduction'
  is_taxable: boolean
  is_fixed: boolean
  default_amount: number
  created_at: string
}

export interface PayrollRun {
  id: string
  period_month: number
  period_year: number
  status: PayrollStatus
  created_at: string
}

export interface PayrollDetailItem {
  name: string
  type: 'earning' | 'deduction'
  amount: number
}

export interface PayrollDetail {
  id: string
  payroll_run_id: string
  employee_id: string
  employee?: Employee
  basic_salary: number
  total_earning: number
  total_deduction: number
  net_pay: number
  details: PayrollDetailItem[]
  created_at: string
}

export interface UserProfile {
  id: string
  full_name: string
  role: UserRole
  created_at: string
}
