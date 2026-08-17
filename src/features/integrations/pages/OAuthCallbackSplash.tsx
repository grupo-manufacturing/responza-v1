import { Spinner } from '@/shared/ui/primitives/Spinner'

type OAuthCallbackSplashProps = {
  title: string
  className: string
}

export function OAuthCallbackSplash({ title, className }: OAuthCallbackSplashProps) {
  return (
    <div className={`flex min-h-screen items-center justify-center px-4 ${className}`}>
      <div className="text-center text-white">
        <Spinner size="lg" variant="white" />
        <h1 className="mt-4 text-xl font-semibold sm:text-2xl">{title}</h1>
        <p className="mt-1 text-sm text-white/90">Finishing setup. This window will close automatically.</p>
      </div>
    </div>
  )
}
