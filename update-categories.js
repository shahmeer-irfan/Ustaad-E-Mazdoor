const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.jiqlhixpflsdyblflywp:Fast_dbproject555@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
});

// Local service categories for Pakistan
const localCategories = [
  { name: 'Plumbing', slug: 'plumbing', icon: '🔧', description: 'Water pipes, drainage, bathroom fixtures' },
  { name: 'Carpentry', slug: 'carpentry', icon: '🪚', description: 'Furniture making, wood work, doors & windows' },
  { name: 'Electrician', slug: 'electrician', icon: '⚡', description: 'Wiring, fixtures, electrical repairs' },
  { name: 'Painting', slug: 'painting', icon: '🎨', description: 'House painting, wall decoration' },
  { name: 'AC & Refrigeration', slug: 'ac-refrigeration', icon: '❄️', description: 'AC installation, repair, refrigerator service' },
  { name: 'Construction', slug: 'construction', icon: '🏗️', description: 'Building, renovation, masonry' },
  { name: 'Cleaning', slug: 'cleaning', icon: '🧹', description: 'House cleaning, deep cleaning, office cleaning' },
  { name: 'Gardening', slug: 'gardening', icon: '🌱', description: 'Lawn care, plant maintenance, landscaping' },
  { name: 'Tailoring', slug: 'tailoring', icon: '✂️', description: 'Stitching, alterations, custom clothing' },
  { name: 'Auto Mechanic', slug: 'auto-mechanic', icon: '🔩', description: 'Car repair, bike service, vehicle maintenance' },
  { name: 'Welding', slug: 'welding', icon: '🔥', description: 'Metal work, grills, gates' },
  { name: 'Home Appliances', slug: 'home-appliances', icon: '🔌', description: 'Washing machine, microwave, appliance repair' },
];

async function updateCategories() {
  try {
    console.log('🔄 Updating categories to local services...\n');

    // Delete existing jobs first (since they reference old categories)
    const jobsResult = await pool.query('SELECT COUNT(*) as count FROM jobs');
    const jobCount = parseInt(jobsResult.rows[0].count);
    
    if (jobCount > 0) {
      console.log(`⚠️  Found ${jobCount} existing jobs. Deleting them first...`);
      await pool.query('DELETE FROM jobs');
      console.log('✅ Cleared old jobs\n');
    }

    // Delete old categories
    await pool.query('DELETE FROM categories');
    console.log('✅ Cleared old categories\n');

    // Insert new categories
    for (const category of localCategories) {
      await pool.query(
        `INSERT INTO categories (name, slug, description, icon, job_count)
         VALUES ($1, $2, $3, $4, 0)`,
        [category.name, category.slug, category.description, category.icon]
      );
      console.log(`✅ Added: ${category.icon} ${category.name}`);
    }

    console.log(`\n✅ Successfully added ${localCategories.length} local service categories!`);
    
    // Show all categories
    const result = await pool.query('SELECT name, slug, icon FROM categories ORDER BY name');
    console.log('\n📋 All Categories:');
    console.table(result.rows);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

updateCategories();
