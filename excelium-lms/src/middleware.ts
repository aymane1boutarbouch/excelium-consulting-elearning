import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/dashboard', '/mon-espace', '/profil']
const ADMIN_ROUTES = ['/admin']
const TRAINER_ROUTES = ['/formateur']
const AUTH_ROUTES = ['/connexion', '/inscription']

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          response = NextResponse.next({
            request: req,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname

  // Dev Demo Mode bypass if using placeholder Supabase URL
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
    return response
  }

  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!session) {
      const redirectUrl = new URL('/connexion', req.url)
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL('/connexion', req.url))
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || (profile as any).role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  if (TRAINER_ROUTES.some(route => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL('/connexion', req.url))
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['admin', 'trainer'].includes((profile as any).role)) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    if (session) {
      const redirectTo = req.nextUrl.searchParams.get('redirectTo') || '/dashboard'
      return NextResponse.redirect(new URL(redirectTo, req.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/webhooks|verify).*)',
  ],
}
