const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing. Add it to .env.local or your shell environment.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function checkCategories() {
  try {
    console.log('📋 Checking categories in database...\n');
    
    const result = await pool.query('SELECT id, name, slug FROM categories ORDER BY name');
    
    console.log(`Found ${result.rows.length} categories:\n`);
    console.table(result.rows);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

checkCategories();
