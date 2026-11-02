import { useEffect } from 'react'

import { SITE_URL } from '@/shared/seo/seo.constants'

type PageMetaOptions = {
  readonly title: string
  readonly description?: string
  /** Site-relative path; used for the canonical link and og:url. */
  readonly path?: string
  readonly noindex?: boolean
}

type Restore = () => void

/**
 * Sets (or removes, when `value` is null) one attribute-valued tag in <head>, creating the tag if needed.
 * Returns a function that puts <head> back the way it was.
 */
function setHeadTag(
  tagName: 'meta' | 'link',
  identity: Readonly<Record<string, string>>,
  valueAttribute: 'content' | 'href',
  value: string | null,
): Restore {
  const selector = `${tagName}${Object.entries(identity)
    .map(([key, val]) => `[${key}="${val}"]`)
    .join('')}`
  const existing = document.head.querySelector(selector)

  if (value === null) {
    if (existing === null) return () => {}
    const nextSibling = existing.nextSibling
    existing.remove()
    return () => {
      document.head.insertBefore(existing, nextSibling)
    }
  }

  if (existing !== null) {
    const previous = existing.getAttribute(valueAttribute)
    existing.setAttribute(valueAttribute, value)
    return () => {
      if (previous === null) existing.removeAttribute(valueAttribute)
      else existing.setAttribute(valueAttribute, previous)
    }
  }

  const created = document.createElement(tagName)
  for (const [key, val] of Object.entries(identity)) created.setAttribute(key, val)
  created.setAttribute(valueAttribute, value)
  document.head.appendChild(created)
  return () => created.remove()
}

export function usePageMeta({ title, description, path, noindex = false }: PageMetaOptions) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    const url = path !== undefined ? new URL(path, SITE_URL).href : undefined
    const restores: Restore[] = [
      setHeadTag('meta', { property: 'og:title' }, 'content', title),
      setHeadTag('meta', { name: 'twitter:title' }, 'content', title),
      setHeadTag('meta', { name: 'robots' }, 'content', noindex ? 'noindex' : null),
    ]

    if (description !== undefined) {
      restores.push(
        setHeadTag('meta', { name: 'description' }, 'content', description),
        setHeadTag('meta', { property: 'og:description' }, 'content', description),
        setHeadTag('meta', { name: 'twitter:description' }, 'content', description),
      )
    }

    if (url !== undefined) {
      restores.push(setHeadTag('meta', { property: 'og:url' }, 'content', url))
    }
    const indexableUrl = noindex || url === undefined ? null : url
    restores.push(
      setHeadTag('link', { rel: 'canonical' }, 'href', indexableUrl),
      setHeadTag('link', { rel: 'alternate', hreflang: 'en-IN' }, 'href', indexableUrl),
      setHeadTag('link', { rel: 'alternate', hreflang: 'x-default' }, 'href', indexableUrl),
    )

    return () => {
      document.title = previousTitle
      for (const restore of restores.reverse()) restore()
    }
  }, [title, description, path, noindex])
}
