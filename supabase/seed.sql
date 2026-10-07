-- CaashFlow POC - Seed Data
-- Run this AFTER schema.sql in Supabase SQL Editor

-- ============================================
-- SEED: Vessels (3 Kapal)
-- ============================================
INSERT INTO vessels (name, type, capacity, status) VALUES
  ('MV Cendrawasih', 'Tugboat', '3000 HP', 'active'),
  ('MV Garuda', 'Barge', '8000 DWT', 'active'),
  ('MV Nusantara', 'Crew Boat', '40 PAX', 'active');

-- ============================================
-- SEED: Employees (20 Crew + 7 Staff = 27)
-- ============================================

-- Crew MV Cendrawasih (7 orang)
INSERT INTO employees (name, employee_type, vessel_id, position, basic_salary, join_date) VALUES
  ('Budi Santoso', 'crew', (SELECT id FROM vessels WHERE name='MV Cendrawasih'), 'Kapten', 15000000, '2023-01-15'),
  ('Ahmad Fauzi', 'crew', (SELECT id FROM vessels WHERE name='MV Cendrawasih'), 'Masinis', 12000000, '2023-02-01'),
  ('Rudi Hartono', 'crew', (SELECT id FROM vessels WHERE name='MV Cendrawasih'), 'OS (Ordinary Seaman)', 7000000, '2023-03-10'),
  ('Slamet Riyadi', 'crew', (SELECT id FROM vessels WHERE name='MV Cendrawasih'), 'AB (Able Seaman)', 8500000, '2023-01-20'),
  ('Joko Widodo', 'crew', (SELECT id FROM vessels WHERE name='MV Cendrawasih'), 'Cook', 6500000, '2023-04-01'),
  ('Eko Prasetyo', 'crew', (SELECT id FROM vessels WHERE name='MV Cendrawasih'), 'AB (Able Seaman)', 8500000, '2023-05-15'),
  ('Hendra Gunawan', 'crew', (SELECT id FROM vessels WHERE name='MV Cendrawasih'), 'OS (Ordinary Seaman)', 7000000, '2023-06-01');

-- Crew MV Garuda (7 orang)
INSERT INTO employees (name, employee_type, vessel_id, position, basic_salary, join_date) VALUES
  ('Sutrisno', 'crew', (SELECT id FROM vessels WHERE name='MV Garuda'), 'Kapten', 15000000, '2023-01-10'),
  ('Dedi Mulyadi', 'crew', (SELECT id FROM vessels WHERE name='MV Garuda'), 'Masinis', 12000000, '2023-02-15'),
  ('Agus Setiawan', 'crew', (SELECT id FROM vessels WHERE name='MV Garuda'), 'OS (Ordinary Seaman)', 7000000, '2023-03-20'),
  ('Bambang Wijaya', 'crew', (SELECT id FROM vessels WHERE name='MV Garuda'), 'AB (Able Seaman)', 8500000, '2023-01-25'),
  ('Wahyu Pratama', 'crew', (SELECT id FROM vessels WHERE name='MV Garuda'), 'Cook', 6500000, '2023-04-10'),
  ('Rizal Anwar', 'crew', (SELECT id FROM vessels WHERE name='MV Garuda'), 'AB (Able Seaman)', 8500000, '2023-05-20'),
  ('Tono Sugianto', 'crew', (SELECT id FROM vessels WHERE name='MV Garuda'), 'OS (Ordinary Seaman)', 7000000, '2023-06-15');

-- Crew MV Nusantara (6 orang)
INSERT INTO employees (name, employee_type, vessel_id, position, basic_salary, join_date) VALUES
  ('Faisal Akbar', 'crew', (SELECT id FROM vessels WHERE name='MV Nusantara'), 'Kapten', 15000000, '2023-01-05'),
  ('Yusuf Maulana', 'crew', (SELECT id FROM vessels WHERE name='MV Nusantara'), 'Masinis', 12000000, '2023-02-10'),
  ('Doni Kurniawan', 'crew', (SELECT id FROM vessels WHERE name='MV Nusantara'), 'OS (Ordinary Seaman)', 7000000, '2023-03-15'),
  ('Arif Budiman', 'crew', (SELECT id FROM vessels WHERE name='MV Nusantara'), 'AB (Able Seaman)', 8500000, '2023-01-30'),
  ('Surya Paloh', 'crew', (SELECT id FROM vessels WHERE name='MV Nusantara'), 'Cook', 6500000, '2023-04-20'),
  ('Reza Pahlevi', 'crew', (SELECT id FROM vessels WHERE name='MV Nusantara'), 'AB (Able Seaman)', 8500000, '2023-05-10');

-- Staff Office (7 orang)
INSERT INTO employees (name, employee_type, vessel_id, position, basic_salary, join_date) VALUES
  ('Andi Wijaya', 'staff', NULL, 'General Manager', 25000000, '2022-01-01'),
  ('Siti Rahayu', 'staff', NULL, 'Finance Manager', 18000000, '2022-03-15'),
  ('Dewi Lestari', 'staff', NULL, 'HR Manager', 15000000, '2022-06-01'),
  ('Rina Marlina', 'staff', NULL, 'Finance Staff', 8000000, '2023-01-10'),
  ('Tuti Handayani', 'staff', NULL, 'HR Staff', 7500000, '2023-02-01'),
  ('Ferry Gunawan', 'staff', NULL, 'Operations Manager', 17000000, '2022-04-01'),
  ('Maya Sari', 'staff', NULL, 'Admin', 6000000, '2023-03-01');

-- ============================================
-- SEED: Transaction Categories
-- ============================================
INSERT INTO transaction_categories (name, type) VALUES
  ('Charter Revenue', 'income'),
  ('Demurrage', 'income'),
  ('Other Income', 'income'),
  ('BBM (Fuel)', 'expense'),
  ('Crew Salary', 'expense'),
  ('Maintenance & Repair', 'expense'),
  ('Port Charges', 'expense'),
  ('Provisions', 'expense'),
  ('Insurance', 'expense'),
  ('Office Operational', 'expense'),
  ('Crew Allowance', 'expense'),
  ('Docking Fee', 'expense');

-- ============================================
-- SEED: Transactions (Jul-Sep 2026, ~45 transaksi)
-- ============================================

-- July 2026
INSERT INTO transactions (transaction_date, category_id, vessel_id, description, amount, type) VALUES
  ('2026-07-05', (SELECT id FROM transaction_categories WHERE name='Charter Revenue'), (SELECT id FROM vessels WHERE name='MV Cendrawasih'), 'Charter trip Cendrawasih - PT Samudra Jaya', 125000000, 'income'),
  ('2026-07-08', (SELECT id FROM transaction_categories WHERE name='BBM (Fuel)'), (SELECT id FROM vessels WHERE name='MV Cendrawasih'), 'Pembelian BBM Cendrawasih', 35000000, 'expense'),
  ('2026-07-10', (SELECT id FROM transaction_categories WHERE name='Port Charges'), (SELECT id FROM vessels WHERE name='MV Cendrawasih'), 'Port charges - Pelabuhan Belawan', 8500000, 'expense'),
  ('2026-07-12', (SELECT id FROM transaction_categories WHERE name='Charter Revenue'), (SELECT id FROM vessels WHERE name='MV Garuda'), 'Charter trip Garuda - PT Bahari Utama', 180000000, 'income'),
  ('2026-07-15', (SELECT id FROM transaction_categories WHERE name='BBM (Fuel)'), (SELECT id FROM vessels WHERE name='MV Garuda'), 'Pembelian BBM Garuda', 52000000, 'expense'),
  ('2026-07-18', (SELECT id FROM transaction_categories WHERE name='Provisions'), (SELECT id FROM vessels WHERE name='MV Garuda'), 'Provisions crew Garuda', 5000000, 'expense'),
  ('2026-07-20', (SELECT id FROM transaction_categories WHERE name='Charter Revenue'), (SELECT id FROM vessels WHERE name='MV Nusantara'), 'Charter trip Nusantara - PT Logistik Mandiri', 95000000, 'income'),
  ('2026-07-22', (SELECT id FROM transaction_categories WHERE name='BBM (Fuel)'), (SELECT id FROM vessels WHERE name='MV Nusantara'), 'Pembelian BBM Nusantara', 28000000, 'expense'),
  ('2026-07-25', (SELECT id FROM transaction_categories WHERE name='Maintenance & Repair'), (SELECT id FROM vessels WHERE name='MV Cendrawasih'), 'Service mesin Cendrawasih', 15000000, 'expense'),
  ('2026-07-28', (SELECT id FROM transaction_categories WHERE name='Office Operational'), NULL, 'Listrik & internet kantor', 3500000, 'expense'),
  ('2026-07-30', (SELECT id FROM transaction_categories WHERE name='Demurrage'), (SELECT id FROM vessels WHERE name='MV Garuda'), 'Demurrage Garuda - PT Bahari Utama', 25000000, 'income'),
  ('2026-07-30', (SELECT id FROM transaction_categories WHERE name='Insurance'), NULL, 'Premi asuransi bulanan', 18000000, 'expense');

-- August 2026
INSERT INTO transactions (transaction_date, category_id, vessel_id, description, amount, type) VALUES
  ('2026-08-03', (SELECT id FROM transaction_categories WHERE name='Charter Revenue'), (SELECT id FROM vessels WHERE name='MV Cendrawasih'), 'Charter trip Cendrawasih - PT Samudra Jaya', 130000000, 'income'),
  ('2026-08-05', (SELECT id FROM transaction_categories WHERE name='BBM (Fuel)'), (SELECT id FROM vessels WHERE name='MV Cendrawasih'), 'Pembelian BBM Cendrawasih', 36000000, 'expense'),
  ('2026-08-08', (SELECT id FROM transaction_categories WHERE name='Port Charges'), (SELECT id FROM vessels WHERE name='MV Cendrawasih'), 'Port charges - Belawan', 8200000, 'expense'),
  ('2026-08-10', (SELECT id FROM transaction_categories WHERE name='Charter Revenue'), (SELECT id FROM vessels WHERE name='MV Garuda'), 'Charter trip Garuda - PT Maritim Persada', 175000000, 'income'),
  ('2026-08-13', (SELECT id FROM transaction_categories WHERE name='BBM (Fuel)'), (SELECT id FROM vessels WHERE name='MV Garuda'), 'Pembelian BBM Garuda', 50000000, 'expense'),
  ('2026-08-15', (SELECT id FROM transaction_categories WHERE name='Provisions'), (SELECT id FROM vessels WHERE name='MV Garuda'), 'Provisions crew Garuda', 4800000, 'expense'),
  ('2026-08-17', (SELECT id FROM transaction_categories WHERE name='Charter Revenue'), (SELECT id FROM vessels WHERE name='MV Nusantara'), 'Charter trip Nusantara - PT Logistik Mandiri', 98000000, 'income'),
  ('2026-08-20', (SELECT id FROM transaction_categories WHERE name='BBM (Fuel)'), (SELECT id FROM vessels WHERE name='MV Nusantara'), 'Pembelian BBM Nusantara', 29000000, 'expense'),
  ('2026-08-22', (SELECT id FROM transaction_categories WHERE name='Maintenance & Repair'), (SELECT id FROM vessels WHERE name='MV Nusantara'), 'Ganti baling-bang Nusantara', 12000000, 'expense'),
  ('2026-08-25', (SELECT id FROM transaction_categories WHERE name='Docking Fee'), (SELECT id FROM vessels WHERE name='MV Cendrawasih'), 'Docking Cendrawasih - dok kering', 45000000, 'expense'),
  ('2026-08-28', (SELECT id FROM transaction_categories WHERE name='Office Operational'), NULL, 'Listrik & internet kantor', 3500000, 'expense'),
  ('2026-08-30', (SELECT id FROM transaction_categories WHERE name='Crew Allowance'), (SELECT id FROM vessels WHERE name='MV Cendrawasih'), 'Sea allowance crew Cendrawasih', 15000000, 'expense'),
  ('2026-08-30', (SELECT id FROM transaction_categories WHERE name='Crew Allowance'), (SELECT id FROM vessels WHERE name='MV Garuda'), 'Sea allowance crew Garuda', 17000000, 'expense'),
  ('2026-08-30', (SELECT id FROM transaction_categories WHERE name='Crew Allowance'), (SELECT id FROM vessels WHERE name='MV Nusantara'), 'Sea allowance crew Nusantara', 13000000, 'expense');

-- September 2026
INSERT INTO transactions (transaction_date, category_id, vessel_id, description, amount, type) VALUES
  ('2026-09-02', (SELECT id FROM transaction_categories WHERE name='Charter Revenue'), (SELECT id FROM vessels WHERE name='MV Cendrawasih'), 'Charter trip Cendrawasih - PT Samudra Jaya', 135000000, 'income'),
  ('2026-09-05', (SELECT id FROM transaction_categories WHERE name='BBM (Fuel)'), (SELECT id FROM vessels WHERE name='MV Cendrawasih'), 'Pembelian BBM Cendrawasih', 37000000, 'expense'),
  ('2026-09-08', (SELECT id FROM transaction_categories WHERE name='Port Charges'), (SELECT id FROM vessels WHERE name='MV Cendrawasih'), 'Port charges - Belawan', 8800000, 'expense'),
  ('2026-09-10', (SELECT id FROM transaction_categories WHERE name='Charter Revenue'), (SELECT id FROM vessels WHERE name='MV Garuda'), 'Charter trip Garuda - PT Bahari Utama', 185000000, 'income'),
  ('2026-09-12', (SELECT id FROM transaction_categories WHERE name='BBM (Fuel)'), (SELECT id FROM vessels WHERE name='MV Garuda'), 'Pembelian BBM Garuda', 53000000, 'expense'),
  ('2026-09-15', (SELECT id FROM transaction_categories WHERE name='Provisions'), (SELECT id FROM vessels WHERE name='MV Garuda'), 'Provisions crew Garuda', 5200000, 'expense'),
  ('2026-09-18', (SELECT id FROM transaction_categories WHERE name='Charter Revenue'), (SELECT id FROM vessels WHERE name='MV Nusantara'), 'Charter trip Nusantara - PT Logistik Mandiri', 100000000, 'income'),
  ('2026-09-20', (SELECT id FROM transaction_categories WHERE name='BBM (Fuel)'), (SELECT id FROM vessels WHERE name='MV Nusantara'), 'Pembelian BBM Nusantara', 30000000, 'expense'),
  ('2026-09-22', (SELECT id FROM transaction_categories WHERE name='Maintenance & Repair'), (SELECT id FROM vessels WHERE name='MV Garuda'), 'Service mesin Garuda', 18000000, 'expense'),
  ('2026-09-25', (SELECT id FROM transaction_categories WHERE name='Other Income'), NULL, 'Penjualan besi bekas', 5000000, 'income'),
  ('2026-09-28', (SELECT id FROM transaction_categories WHERE name='Office Operational'), NULL, 'Listrik & internet kantor', 3500000, 'expense'),
  ('2026-09-30', (SELECT id FROM transaction_categories WHERE name='Insurance'), NULL, 'Premi asuransi bulanan', 18000000, 'expense'),
  ('2026-09-30', (SELECT id FROM transaction_categories WHERE name='Crew Allowance'), (SELECT id FROM vessels WHERE name='MV Cendrawasih'), 'Sea allowance crew Cendrawasih', 15000000, 'expense'),
  ('2026-09-30', (SELECT id FROM transaction_categories WHERE name='Crew Allowance'), (SELECT id FROM vessels WHERE name='MV Garuda'), 'Sea allowance crew Garuda', 17000000, 'expense'),
  ('2026-09-30', (SELECT id FROM transaction_categories WHERE name='Crew Allowance'), (SELECT id FROM vessels WHERE name='MV Nusantara'), 'Sea allowance crew Nusantara', 13000000, 'expense');

-- ============================================
-- SEED: Salary Components
-- ============================================
INSERT INTO salary_components (name, type, is_taxable, is_fixed, default_amount) VALUES
  ('Basic Salary', 'earning', true, true, 0),
  ('Sea Allowance', 'earning', true, false, 2000000),
  ('Overtime', 'earning', true, false, 0),
  ('Meal Allowance', 'earning', false, true, 1500000),
  ('Transport Allowance', 'earning', false, true, 500000),
  ('BPJS Kesehatan', 'deduction', false, true, 200000),
  ('BPJS Ketenagakerjaan', 'deduction', false, true, 300000),
  ('PPh21 (Income Tax)', 'deduction', true, false, 0),
  ('Loan Deduction', 'deduction', false, false, 0);

-- ============================================
-- SEED: Payroll Run September 2026
-- ============================================
INSERT INTO payroll_runs (period_month, period_year, status) VALUES (9, 2026, 'approved');

-- Generate payroll details for all 27 employees
INSERT INTO payroll_details (payroll_run_id, employee_id, basic_salary, total_earning, total_deduction, net_pay, details)
SELECT
  pr.id,
  e.id,
  e.basic_salary,
  e.basic_salary + 3500000 + 1500000 + 500000 AS total_earning,
  500000 + (CASE WHEN e.basic_salary > 10000000 THEN e.basic_salary * 0.05 ELSE 0 END) AS total_deduction,
  e.basic_salary + 3500000 + 1500000 + 500000 - 500000 - (CASE WHEN e.basic_salary > 10000000 THEN e.basic_salary * 0.05 ELSE 0 END) AS net_pay,
  jsonb_build_array(
    jsonb_build_object('name', 'Basic Salary', 'type', 'earning', 'amount', e.basic_salary),
    jsonb_build_object('name', 'Sea Allowance', 'type', 'earning', 'amount', 2000000),
    jsonb_build_object('name', 'Meal Allowance', 'type', 'earning', 'amount', 1500000),
    jsonb_build_object('name', 'Transport Allowance', 'type', 'earning', 'amount', 500000),
    jsonb_build_object('name', 'BPJS Kesehatan', 'type', 'deduction', 'amount', 200000),
    jsonb_build_object('name', 'BPJS Ketenagakerjaan', 'type', 'deduction', 'amount', 300000),
    jsonb_build_object('name', 'PPh21', 'type', 'deduction', 'amount', CASE WHEN e.basic_salary > 10000000 THEN e.basic_salary * 0.05 ELSE 0 END)
  )
FROM employees e
CROSS JOIN payroll_runs pr
WHERE pr.period_month = 9 AND pr.period_year = 2026;
