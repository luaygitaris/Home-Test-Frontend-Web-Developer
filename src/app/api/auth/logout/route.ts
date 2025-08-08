// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    // Hapus cookie auth jika menggunakan cookie
    const cookieStore = await cookies();
    cookieStore.delete('authToken');
    cookieStore.delete('userRole');
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    )
  }
}