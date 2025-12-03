const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.jiqlhixpflsdyblflywp:Fast_dbproject555@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
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
