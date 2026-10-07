import { Client } from 'pg'

const connectionString = 'postgresql://postgres.pxwhdqupdylmarfwqura:%P@ssw0rD29!!!!!!@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'

async function runSQL() {
  const fs = await import('fs')
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })
  
  try {
    await client.connect()
    console.log('Connected to Supabase database')
    
    // Run schema
    const schema = fs.readFileSync('supabase/schema.sql', 'utf8')
    await client.query(schema)
    console.log('Schema executed successfully')
    
    // Run seed
    const seed = fs.readFileSync('supabase/seed.sql', 'utf8')
    await client.query(seed)
    console.log('Seed data executed successfully')
    
    // Verify
    const res = await client.query('SELECT COUNT(*) FROM vessels')
    console.log(`Vessels count: ${res.rows[0].count}`)
    
    const empRes = await client.query('SELECT COUNT(*) FROM employees')
    console.log(`Employees count: ${empRes.rows[0].count}`)
    
    const txnRes = await client.query('SELECT COUNT(*) FROM transactions')
    console.log(`Transactions count: ${txnRes.rows[0].count}`)
    
    const prRes = await client.query('SELECT COUNT(*) FROM payroll_details')
    console.log(`Payroll details count: ${prRes.rows[0].count}`)
    
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await client.end()
  }
}

runSQL()
