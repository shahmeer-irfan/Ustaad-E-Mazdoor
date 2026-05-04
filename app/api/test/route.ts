import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT NOW()');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      timestamp: result.rows[0].now
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Connection failed',
        error: error.message
      },
      { status: 500 }
    );
  }
}