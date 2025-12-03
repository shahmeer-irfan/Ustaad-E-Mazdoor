const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.jiqlhixpflsdyblflywp:Fast_dbproject555@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
});

async function checkProposalsTable() {
  try {
    console.log('📋 Checking proposals table...\n');
    
    // Check if table exists
    const tableCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'proposals'
      ORDER BY ordinal_position
    `);
    
    if (tableCheck.rows.length === 0) {
      console.log('❌ Proposals table does NOT exist!');
      console.log('\n Creating proposals table...\n');
      
      await pool.query(`
        CREATE TABLE IF NOT EXISTS proposals (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
          freelancer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
          cover_letter TEXT NOT NULL,
          proposed_budget DECIMAL(10, 2) NOT NULL,
          proposed_duration TEXT,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(job_id, freelancer_id)
        );
        
        CREATE INDEX IF NOT EXISTS idx_proposals_job_id ON proposals(job_id);
        CREATE INDEX IF NOT EXISTS idx_proposals_freelancer_id ON proposals(freelancer_id);
      `);
      
      console.log('✅ Proposals table created successfully!');
    } else {
      console.log('✅ Proposals table exists with columns:');
      console.table(tableCheck.rows);
    }
    
    // Count existing proposals
    const countResult = await pool.query('SELECT COUNT(*) as count FROM proposals');
    console.log(`\n📊 Total proposals: ${countResult.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

checkProposalsTable();
