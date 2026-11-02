import { useEffect } from 'react'

type PageMetaOptions = {
  readonly title: string
  readonly description?: string
  readonly noindex?: boolean
}

export function usePageMeta({ title, description, noindex = false }: PageMetaOptions) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    const descriptionTag = document.querySelector('meta[name="description"]')
    const previousDescription = descriptionTag?.getAttribute('content') ?? null

    if (description !== undefined && descriptionTag !== null) {
      descriptionTag.setAttribute('content', description)
    }

    let addedRobotsTag: HTMLMetaElement | null = null
    if (noindex && document.querySelector('meta[name="robots"]') === null) {
      addedRobotsTag = document.createElement('meta')
      addedRobotsTag.name = 'robots'
      addedRobotsTag.content = 'noindex'
      document.head.appendChild(addedRobotsTag)
    }

    return () => {
      document.title = previousTitle
      if (description !== undefined && descriptionTag !== null && previousDescription !== null) {
        descriptionTag.setAttribute('content', previousDescription)
      }
      addedRobotsTag?.remove()
    }
  }, [title, description, noindex])
}
