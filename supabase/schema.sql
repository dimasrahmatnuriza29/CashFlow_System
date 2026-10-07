-- CaashFlow POC - Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- MASTER DATA: Vessels (Kapal)
-- ============================================
CREATE TABLE IF NOT EXISTS vessels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Tugboat',
  capacity TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- MASTER DATA: Employees (Crew + Staff)
-- ============================================
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  employee_type TEXT NOT NULL CHECK (employee_type IN ('crew', 'staff')),
  vessel_id UUID REFERENCES vessels(id) ON DELETE SET NULL,
  position TEXT NOT NULL,
  basic_salary NUMERIC(12,2) NOT NULL DEFAULT 0,
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- MASTER DATA: Transaction Categories
-- ============================================
CREATE TABLE IF NOT EXISTS transaction_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TRANSACTIONS: Cashflow
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_date DATE NOT NULL,
  category_id UUID REFERENCES transaction_categories(id) ON DELETE SET NULL,
  vessel_id UUID REFERENCES vessels(id) ON DELETE SET NULL,
  description TEXT,
  amount NUMERIC(14,2) NOT NULL CHECK (amount >= 0),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_vessel ON transactions(vessel_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

-- ============================================
-- MASTER DATA: Salary Components
-- ============================================
CREATE TABLE IF NOT EXISTS salary_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earning', 'deduction')),
  is_taxable BOOLEAN NOT NULL DEFAULT true,
  is_fixed BOOLEAN NOT NULL DEFAULT false,
  default_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- PAYROLL: Run (per periode)
-- ============================================
CREATE TABLE IF NOT EXISTS payroll_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_month INT NOT NULL CHECK (period_month BETWEEN 1 AND 12),
  period_year INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'calculated', 'approved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(period_month, period_year)
);

-- ============================================
-- PAYROLL: Detail (per employee per run)
-- ============================================
CREATE TABLE IF NOT EXISTS payroll_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_run_id UUID NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  basic_salary NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_earning NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_deduction NUMERIC(12,2) NOT NULL DEFAULT 0,
  net_pay NUMERIC(12,2) NOT NULL DEFAULT 0,
  details JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(payroll_run_id, employee_id)
);

-- ============================================
-- USER PROFILES (extend Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'finance', 'hr', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE vessels ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read all master data
CREATE POLICY "Authenticated can read vessels" ON vessels FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read employees" ON employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read categories" ON transaction_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read salary_components" ON salary_components FOR SELECT TO authenticated USING (true);

-- Policy: Admin & Finance can manage transactions
CREATE POLICY "Authenticated can read transactions" ON transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can insert transactions" ON transactions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update transactions" ON transactions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete transactions" ON transactions FOR DELETE TO authenticated USING (true);

-- Policy: Payroll access
CREATE POLICY "Authenticated can read payroll_runs" ON payroll_runs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read payroll_details" ON payroll_details FOR SELECT TO authenticated USING (true);
CREATE POLICY "HR can manage payroll_runs" ON payroll_runs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "HR can manage payroll_details" ON payroll_details FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Policy: User profiles
CREATE POLICY "Users can read own profile" ON user_profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can read all profiles" ON user_profiles FOR SELECT TO authenticated USING (true);

-- Policy: Admin & Finance can manage master data
CREATE POLICY "Admin can manage vessels" ON vessels FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can manage employees" ON employees FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can manage categories" ON transaction_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can manage salary_components" ON salary_components FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- TRIGGER: Auto-create user profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'), 'viewer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
