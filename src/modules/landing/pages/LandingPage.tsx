import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-sm font-bold text-white">
                R
              </div>
              <span className="text-xl font-semibold text-neutral-900">Responza AI</span>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                to="/auth?mode=login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 transition-all hover:bg-neutral-100 hover:text-neutral-900"
              >
                Sign in
              </Link>
              <Link
                to="/auth?mode=register"
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-neutral-800"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:py-24">
        <h1 className="max-w-4xl text-center text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl">
          Landing Page        </h1>
      </main>
    </div>
  )
}
