const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.jiqlhixpflsdyblflywp:Fast_dbproject555@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
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
