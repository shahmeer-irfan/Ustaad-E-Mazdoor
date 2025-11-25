import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      category,
      description,
      budget,
      budgetType,
      location,
      duration,
      skillsRequired,
    } = body;

    // Validate required fields
    if (!title || !category || !description || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get profile ID from clerk_id
    const profileQuery = 'SELECT id FROM profiles WHERE clerk_id = $1';
    const profileResult = await pool.query(profileQuery, [userId]);

    if (profileResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    const clientId = profileResult.rows[0].id;

    // Get category ID
    const categoryQuery = 'SELECT id FROM categories WHERE slug = $1';
    const categoryResult = await pool.query(categoryQuery, [category]);

    if (categoryResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    const categoryId = categoryResult.rows[0].id;

    // Parse budget (e.g., "50000-80000" or "2500")
    let budgetMin, budgetMax;
    if (budget.includes('-')) {
      [budgetMin, budgetMax] = budget.split('-').map((b: string) => parseFloat(b.trim()));
    } else {
      budgetMin = budgetMax = parseFloat(budget);
    }

    // Insert job
    const insertJobQuery = `
      INSERT INTO jobs (
        client_id, title, description, category_id, 
        budget_min, budget_max, budget_type, location, duration
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `;

    const jobResult = await pool.query(insertJobQuery, [
      clientId,
      title,
      description,
      categoryId,
      budgetMin,
      budgetMax,
      budgetType,
      location,
      duration,
    ]);

    const jobId = jobResult.rows[0].id;

    // Insert skills if provided
    if (skillsRequired && skillsRequired.length > 0) {
      const skills = skillsRequired.split(',').map((s: string) => s.trim());

      for (const skillName of skills) {
        // Get or create skill
        const skillQuery = `
          INSERT INTO skills (name, slug)
          VALUES ($1, $2)
          ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
          RETURNING id
        `;
        const slug = skillName.toLowerCase().replace(/\s+/g, '-');
        const skillResult = await pool.query(skillQuery, [skillName, slug]);
        const skillId = skillResult.rows[0].id;

        // Link skill to job
        await pool.query(
          'INSERT INTO job_skills (job_id, skill_id) VALUES ($1, $2)',
          [jobId, skillId]
        );
      }
    }

    // Update category job count
    await pool.query(
      'UPDATE categories SET job_count = job_count + 1 WHERE id = $1',
      [categoryId]
    );

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Job posted successfully',
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to post job' },
      { status: 500 }
    );
  }
}
