import { useEffect } from 'react'

type PageMetaOptions = {
  readonly title: string
  readonly description?: string
}

export function usePageMeta({ title, description }: PageMetaOptions) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    const descriptionTag = document.querySelector('meta[name="description"]')
    const previousDescription = descriptionTag?.getAttribute('content') ?? null

    if (description !== undefined && descriptionTag !== null) {
      descriptionTag.setAttribute('content', description)
    }

    return () => {
      document.title = previousTitle
      if (description !== undefined && descriptionTag !== null && previousDescription !== null) {
        descriptionTag.setAttribute('content', previousDescription)
      }
    }
  }, [title, description])
}
