import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Test basic connection
    const timeResult = await pool.query('SELECT NOW() as current_time');
    
    // Test if tables exist
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    // Get counts from main tables
    const counts = await Promise.all([
      pool.query('SELECT COUNT(*) FROM profiles'),
      pool.query('SELECT COUNT(*) FROM jobs'),
      pool.query('SELECT COUNT(*) FROM categories'),
      pool.query('SELECT COUNT(*) FROM skills'),
    ]).then(results => ({
      profiles: parseInt(results[0].rows[0].count),
      jobs: parseInt(results[1].rows[0].count),
      categories: parseInt(results[2].rows[0].count),
      skills: parseInt(results[3].rows[0].count),
    })).catch(() => ({
      profiles: 'Table not found',
      jobs: 'Table not found',
      categories: 'Table not found',
      skills: 'Table not found',
    }));

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      serverTime: timeResult.rows[0].current_time,
      tables: tablesResult.rows.map(r => r.table_name),
      recordCounts: counts,
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        hint: 'Check your DATABASE_URL in .env.local',
      },
      { status: 500 }
    );
  }
}
