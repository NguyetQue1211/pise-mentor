import { redirect } from 'next/navigation'

// Middleware handles the redirect for authenticated users (/ → /mentors)
// and unauthenticated users (/ → /login). This component is a fallback
// in case middleware doesn't run (e.g. static export).
export default function RootPage() {
  redirect('/mentors')
}
