// Simple CLI to check Supabase connectivity
// Usage: node scripts/check-supabase.js

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load .env manually if present. Try .env.local first, then .env
const dotenv = require('dotenv')
const candidateFiles = ['.env.local', '.env']
let loaded = false
for (const f of candidateFiles) {
    const pth = path.resolve(process.cwd(), f)
    if (fs.existsSync(pth)) {
        dotenv.config({ path: pth })
        console.log(`[dotenv] injecting env from ${f}`)
        loaded = true
        break
    }
}
if (!loaded) {
    console.warn('No .env file found (checked .env.local and .env)')
}

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
    process.exit(2)
}

const supabase = createClient(url, key)

async function check() {
    try {
        const { data, error } = await supabase.from('users').select('id').limit(1)
        if (error) {
            console.error('Connection test failed:', error.message || error)
            process.exit(1)
        }
        console.log('Connection OK — reachable and credentials accepted')
        process.exit(0)
    } catch (err) {
        console.error('Unexpected error during connection test:', err.message || err)
        process.exit(1)
    }
}

check()
