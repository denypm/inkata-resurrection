import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Guard: Jika environment variables belum diset di Vercel, lewatkan proses session update
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')

  // Lindungi route dashboard & assessment jika tidak ada user
  if (
    !user &&
    !isAuthPage &&
    !isApiRoute &&
    request.nextUrl.pathname !== '/'
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  // Lapisan Ekstrem: Super Admin Role-Based Access Control (RBAC)
  if (user && request.nextUrl.pathname.startsWith('/superadmin')) {
    // Memeriksa metadata peran otentikasi. Jika bukan 'superadmin' dan BUKAN email Owner (denydenary@gmail.com), putuskan koneksi akses.
    const isOwnerTargetEmail = user.email === 'denydenary@gmail.com' || user.email?.includes('admin@inkata');
    const hasSuperAdminMetadata = user.user_metadata?.role === 'superadmin';
    
    if (!isOwnerTargetEmail && !hasSuperAdminMetadata) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }


  // Cegah user yang sudah login mengakses halaman auth
  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
