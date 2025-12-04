const { Pool } = require('pg');

// Load environment variables from .env.local
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const pool = new Pool({
  connectionString: envVars.DATABASE_URL,
});

const localServicesSkills = [
  // Plumbing Skills
  { name: 'Pipe Installation', slug: 'pipe-installation', category: 'plumbing' },
  { name: 'Leak Repair', slug: 'leak-repair', category: 'plumbing' },
  { name: 'Water Heater Installation', slug: 'water-heater-installation', category: 'plumbing' },
  { name: 'Bathroom Fitting', slug: 'bathroom-fitting', category: 'plumbing' },
  { name: 'Drain Cleaning', slug: 'drain-cleaning', category: 'plumbing' },
  { name: 'Faucet Repair', slug: 'faucet-repair', category: 'plumbing' },
  
  // Carpentry Skills
  { name: 'Furniture Making', slug: 'furniture-making', category: 'carpentry' },
  { name: 'Door Installation', slug: 'door-installation', category: 'carpentry' },
  { name: 'Cabinet Work', slug: 'cabinet-work', category: 'carpentry' },
  { name: 'Wood Finishing', slug: 'wood-finishing', category: 'carpentry' },
  { name: 'Window Frames', slug: 'window-frames', category: 'carpentry' },
  { name: 'Custom Woodwork', slug: 'custom-woodwork', category: 'carpentry' },
  
  // Electrician Skills
  { name: 'House Wiring', slug: 'house-wiring', category: 'electrician' },
  { name: 'Panel Installation', slug: 'panel-installation', category: 'electrician' },
  { name: 'Appliance Repair', slug: 'appliance-repair', category: 'electrician' },
  { name: 'Light Fixtures', slug: 'light-fixtures', category: 'electrician' },
  { name: 'Fan Installation', slug: 'fan-installation', category: 'electrician' },
  { name: 'Electrical Troubleshooting', slug: 'electrical-troubleshooting', category: 'electrician' },
  
  // Painting Skills
  { name: 'Interior Painting', slug: 'interior-painting', category: 'painting' },
  { name: 'Exterior Painting', slug: 'exterior-painting', category: 'painting' },
  { name: 'Wall Texturing', slug: 'wall-texturing', category: 'painting' },
  { name: 'Wood Staining', slug: 'wood-staining', category: 'painting' },
  { name: 'Spray Painting', slug: 'spray-painting', category: 'painting' },
  { name: 'Waterproofing', slug: 'waterproofing', category: 'painting' },
  
  // AC & Refrigeration Skills
  { name: 'AC Installation', slug: 'ac-installation', category: 'ac-refrigeration' },
  { name: 'AC Repair & Maintenance', slug: 'ac-repair-maintenance', category: 'ac-refrigeration' },
  { name: 'Refrigerator Repair', slug: 'refrigerator-repair', category: 'ac-refrigeration' },
  { name: 'Gas Charging', slug: 'gas-charging', category: 'ac-refrigeration' },
  { name: 'Cooling System Maintenance', slug: 'cooling-system-maintenance', category: 'ac-refrigeration' },
  { name: 'Duct Cleaning', slug: 'duct-cleaning', category: 'ac-refrigeration' },
  
  // Construction Skills
  { name: 'Masonry Work', slug: 'masonry-work', category: 'construction' },
  { name: 'Concrete Pouring', slug: 'concrete-pouring', category: 'construction' },
  { name: 'Brick Laying', slug: 'brick-laying', category: 'construction' },
  { name: 'Plastering', slug: 'plastering', category: 'construction' },
  { name: 'Tile Installation', slug: 'tile-installation', category: 'construction' },
  { name: 'Foundation Work', slug: 'foundation-work', category: 'construction' },
  
  // Cleaning Skills
  { name: 'Deep Cleaning', slug: 'deep-cleaning', category: 'cleaning' },
  { name: 'Floor Polishing', slug: 'floor-polishing', category: 'cleaning' },
  { name: 'Carpet Cleaning', slug: 'carpet-cleaning', category: 'cleaning' },
  { name: 'Window Cleaning', slug: 'window-cleaning', category: 'cleaning' },
  { name: 'Kitchen Cleaning', slug: 'kitchen-cleaning', category: 'cleaning' },
  { name: 'Bathroom Cleaning', slug: 'bathroom-cleaning', category: 'cleaning' },
  
  // Gardening Skills
  { name: 'Lawn Maintenance', slug: 'lawn-maintenance', category: 'gardening' },
  { name: 'Plant Care', slug: 'plant-care', category: 'gardening' },
  { name: 'Tree Trimming', slug: 'tree-trimming', category: 'gardening' },
  { name: 'Landscaping', slug: 'landscaping', category: 'gardening' },
  { name: 'Irrigation Setup', slug: 'irrigation-setup', category: 'gardening' },
  { name: 'Pest Control', slug: 'pest-control', category: 'gardening' },
  
  // Tailoring Skills
  { name: 'Suit Stitching', slug: 'suit-stitching', category: 'tailoring' },
  { name: 'Dress Making', slug: 'dress-making', category: 'tailoring' },
  { name: 'Alterations', slug: 'alterations', category: 'tailoring' },
  { name: 'Embroidery', slug: 'embroidery', category: 'tailoring' },
  { name: 'Curtain Making', slug: 'curtain-making', category: 'tailoring' },
  { name: 'Custom Fitting', slug: 'custom-fitting', category: 'tailoring' },
  
  // Auto Mechanic Skills
  { name: 'Engine Repair', slug: 'engine-repair', category: 'auto-mechanic' },
  { name: 'Brake Service', slug: 'brake-service', category: 'auto-mechanic' },
  { name: 'Oil Change', slug: 'oil-change', category: 'auto-mechanic' },
  { name: 'Tire Replacement', slug: 'tire-replacement', category: 'auto-mechanic' },
  { name: 'Battery Service', slug: 'battery-service', category: 'auto-mechanic' },
  { name: 'Car AC Repair', slug: 'car-ac-repair', category: 'auto-mechanic' },
  
  // Welding Skills
  { name: 'Arc Welding', slug: 'arc-welding', category: 'welding' },
  { name: 'Gas Welding', slug: 'gas-welding', category: 'welding' },
  { name: 'Metal Fabrication', slug: 'metal-fabrication', category: 'welding' },
  { name: 'Gate Making', slug: 'gate-making', category: 'welding' },
  { name: 'Grill Work', slug: 'grill-work', category: 'welding' },
  { name: 'Pipe Welding', slug: 'pipe-welding', category: 'welding' },
  
  // Home Appliances Skills
  { name: 'Washing Machine Repair', slug: 'washing-machine-repair', category: 'home-appliances' },
  { name: 'Microwave Repair', slug: 'microwave-repair', category: 'home-appliances' },
  { name: 'Oven Repair', slug: 'oven-repair', category: 'home-appliances' },
  { name: 'Dishwasher Repair', slug: 'dishwasher-repair', category: 'home-appliances' },
  { name: 'Vacuum Repair', slug: 'vacuum-repair', category: 'home-appliances' },
  { name: 'Iron Repair', slug: 'iron-repair', category: 'home-appliances' },
];

async function updateSkills() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting skills table update...\n');
    
    await client.query('BEGIN');
    
    // 1. Delete existing job_skills relationships
    console.log('1️⃣ Removing old job-skill relationships...');
    const jobSkillsResult = await client.query('DELETE FROM job_skills');
    console.log(`   ✓ Deleted ${jobSkillsResult.rowCount} job-skill relationships\n`);
    
    // 2. Delete existing freelancer_skills relationships
    console.log('2️⃣ Removing old freelancer-skill relationships...');
    const freelancerSkillsResult = await client.query('DELETE FROM freelancer_skills');
    console.log(`   ✓ Deleted ${freelancerSkillsResult.rowCount} freelancer-skill relationships\n`);
    
    // 3. Delete all old skills
    console.log('3️⃣ Removing old skills...');
    const oldSkillsResult = await client.query('DELETE FROM skills');
    console.log(`   ✓ Deleted ${oldSkillsResult.rowCount} old skills\n`);
    
    // 4. Insert new local services skills
    console.log('4️⃣ Inserting new local services skills...');
    let insertedCount = 0;
    
    for (const skill of localServicesSkills) {
      await client.query(
        'INSERT INTO skills (name, slug) VALUES ($1, $2)',
        [skill.name, skill.slug]
      );
      insertedCount++;
    }
    
    console.log(`   ✓ Inserted ${insertedCount} new skills\n`);
    
    await client.query('COMMIT');
    
    console.log('✅ Skills table successfully updated!\n');
    console.log('📊 Summary:');
    console.log(`   • Total skills: ${insertedCount}`);
    console.log(`   • Categories covered: 12 (all local services)`);
    console.log(`   • Skills per category: ~6 each\n`);
    
    // Display skills by category
    console.log('📋 New Skills by Category:\n');
    const categories = [...new Set(localServicesSkills.map(s => s.category))];
    categories.forEach(cat => {
      const categorySkills = localServicesSkills.filter(s => s.category === cat);
      console.log(`   ${cat.toUpperCase()}:`);
      categorySkills.forEach(s => console.log(`      • ${s.name}`));
      console.log('');
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error updating skills:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

updateSkills()
  .then(() => {
    console.log('✨ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
