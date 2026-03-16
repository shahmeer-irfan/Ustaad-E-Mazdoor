// Script to manually sync existing Clerk users to PostgreSQL
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

// Add your existing users here
const users = [
  {
    clerk_id: 'clerk_client_2',
    email: 'client2@example.com',
    full_name: 'Digital Marketing Agency',
    user_type: 'client'
  },
  {
    clerk_id: 'clerk_freelancer_3',
    email: 'ali.raza@example.com',
    full_name: 'Ali Raza',
    user_type: 'freelancer'
  },
  {
    clerk_id: 'clerk_freelancer_2',
    email: 'fatima.khan@example.com',
    full_name: 'Fatima Khan',
    user_type: 'freelancer'
  },
  {
    clerk_id: 'clerk_client_1',
    email: 'client1@example.com',
    full_name: 'Tech Solutions Pvt Ltd',
    user_type: 'client'
  },
  {
    clerk_id: 'clerk_freelancer_1',
    email: 'ahmed.hassan@example.com',
    full_name: 'Ahmed Hassan',
    user_type: 'freelancer'
  },
];

async function syncUsers() {
  try {
    console.log('🔄 Starting user sync...\n');

    for (const user of users) {
      try {
        const result = await pool.query(
          `INSERT INTO profiles (id, clerk_id, email, full_name, user_type, created_at, updated_at)
           VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
           ON CONFLICT (clerk_id) DO UPDATE 
           SET email = EXCLUDED.email, 
               full_name = EXCLUDED.full_name,
               user_type = EXCLUDED.user_type,
               updated_at = NOW()
           RETURNING id, email, user_type`,
          [user.clerk_id, user.email, user.full_name, user.user_type]
        );

        console.log(`✅ Synced: ${user.email} (${user.user_type})`);
      } catch (error) {
        console.error(`❌ Failed to sync ${user.email}:`, error.message);
      }
    }

    console.log('\n✅ User sync completed!');
    
    // Show all profiles
    const allProfiles = await pool.query('SELECT clerk_id, email, full_name, user_type FROM profiles ORDER BY created_at DESC');
    console.log('\n📋 All profiles in database:');
    console.table(allProfiles.rows);

  } catch (error) {
    console.error('❌ Sync error:', error);
  } finally {
    await pool.end();
  }
}

syncUsers();
