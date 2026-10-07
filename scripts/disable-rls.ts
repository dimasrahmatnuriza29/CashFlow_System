import { Client } from 'pg'

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres.pxwhdqupdylmarfwqura:%P@ssw0rD29!!!!!!@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false },
  })
  await client.connect()
  const tables = ['vessels','employees','transaction_categories','transactions','salary_components','payroll_runs','payroll_details','user_profiles']
  for (const t of tables) {
    await client.query(`ALTER TABLE ${t} DISABLE ROW LEVEL SECURITY`)
    console.log('RLS disabled: ' + t)
  }
  await client.end()
  console.log('Done')
}

main()
