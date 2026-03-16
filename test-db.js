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
  ssl: { rejectUnauthorized: false }
});

async function testDB() {
  try {
    // Check column names
    const columns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'jobs' 
      ORDER BY ordinal_position
    `);
    console.log('Job table columns:', columns.rows.map(r => r.column_name));

    // Test the actual API query
    const jobs = await pool.query(`
      SELECT 
        j.id,
        j.title,
        j.description,
        j.budget_min,
        j.budget_max,
        j.budget_type,
        j.location,
        j.duration,
        j.created_at,
        j.proposals_count,
        c.name as category,
        c.slug as category_slug
      FROM jobs j
      LEFT JOIN categories c ON j.category_id = c.id
      WHERE j.status = 'open'
      LIMIT 5
    `);
    console.log('\nJobs found:', jobs.rows.length);
    console.log('First job:', jobs.rows[0]);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

testDB();
