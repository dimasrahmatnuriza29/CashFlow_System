export {}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pxwhdqupdylmarfwqura.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_SERVICE_KEY) {
  console.error('Please set SUPABASE_SERVICE_ROLE_KEY in your .env.local')
  process.exit(1)
}

const headers = {
  'apikey': SUPABASE_SERVICE_KEY,
  'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
  'Content-Type': 'application/json',
}

const body = JSON.stringify({
  email: 'admin@caashflow.com',
  password: 'caashflow123',
  email_confirm: true,
  user_metadata: { full_name: 'Admin CaashFlow' },
})

async function main() {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers,
      body,
    })
    const data = await res.json()
    if (res.ok) {
      console.log('User created successfully:', data.email)
    } else {
      console.log('Response:', data.message || JSON.stringify(data))
    }
  } catch (err) {
    console.error('Error:', err)
  }
}

main()
