import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT 
        id,
        name,
        slug,
        icon,
        job_count
      FROM categories
      ORDER BY job_count DESC
    `;

    const result = await pool.query(query);

    const categories = result.rows.map(row => ({
      id: row.id,
      title: row.name,
      slug: row.slug,
      icon: row.icon,
      count: `${row.job_count} jobs`,
    }));

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
