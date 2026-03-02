type DatalistPrimitive = string | number | boolean

type DatalistItem = {
  value?: unknown
  label?: unknown
  name?: unknown
  title?: unknown
  slug?: unknown
  href?: unknown
  url?: unknown
}

type SearchResultLink = {
  label: string
  url: string
}

export function extractSearchResultLinks(payload: unknown, limit = 10): SearchResultLink[] {
  const links: SearchResultLink[] = []
  const uniqueLinkKeys = new Set<string>()

  const addLink = (labelCandidate: unknown, urlCandidate: unknown): void => {
    if (links.length >= limit) {
      return
    }

    if (typeof urlCandidate !== 'string') {
      return
    }

    const normalizedUrl = urlCandidate.trim()
    if (normalizedUrl === '') {
      return
    }

    const normalizedLabel = typeof labelCandidate === 'string'
      ? labelCandidate.trim()
      : String(labelCandidate ?? '').trim()

    const label = normalizedLabel !== '' ? normalizedLabel : normalizedUrl
    const linkKey = `${label}::${normalizedUrl}`

    if (uniqueLinkKeys.has(linkKey)) {
      return
    }

    uniqueLinkKeys.add(linkKey)
    links.push({ label, url: normalizedUrl })
  }

  const tryExtractLink = (candidate: Record<string, unknown>): boolean => {
    const urlCandidate = candidate.url ?? candidate.href

    if (urlCandidate == null) {
      return false
    }

    const labelCandidate = candidate.label ?? candidate.name ?? candidate.title ?? candidate.value ?? candidate.slug ?? urlCandidate
    addLink(labelCandidate, urlCandidate)

    return true
  }

  const traverse = (candidate: unknown): void => {
    if (links.length >= limit || candidate == null) {
      return
    }

    if (Array.isArray(candidate)) {
      for (const child of candidate) {
        traverse(child)
        if (links.length >= limit) {
          return
        }
      }

      return
    }

    if (typeof candidate !== 'object') {
      return
    }

    const objectCandidate = candidate as Record<string, unknown>

    if ('results' in objectCandidate && objectCandidate.results && typeof objectCandidate.results === 'object') {
      traverse(objectCandidate.results)
      return
    }

    if ('data' in objectCandidate && objectCandidate.data && typeof objectCandidate.data === 'object') {
      traverse(objectCandidate.data)
      return
    }

    if (tryExtractLink(objectCandidate)) {
      return
    }

    for (const child of Object.values(objectCandidate)) {
      traverse(child)
      if (links.length >= limit) {
        return
      }
    }
  }

  traverse(payload)

  return links.slice(0, limit)
}

export function extractDatalistValues(payload: unknown, limit = 10): string[] {
  const extractedLinks = extractSearchResultLinks(payload, limit)
  if (extractedLinks.length > 0) {
    return extractedLinks.map((link) => link.label)
  }

  const values: string[] = []
  const uniqueValues = new Set<string>()

  const addValue = (candidate: unknown): void => {
    if (values.length >= limit) {
      return
    }

    if (typeof candidate === 'string' || typeof candidate === 'number' || typeof candidate === 'boolean') {
      const normalizedValue = String(candidate).trim()

      if (normalizedValue === '' || uniqueValues.has(normalizedValue)) {
        return
      }

      uniqueValues.add(normalizedValue)
      values.push(normalizedValue)
    }
  }

  const extractFromObject = (candidate: Record<string, unknown>): void => {
    if ('results' in candidate && candidate.results && typeof candidate.results === 'object') {
      traverse(candidate.results)
      return
    }

    if ('data' in candidate && candidate.data && typeof candidate.data === 'object') {
      traverse(candidate.data)
      return
    }

    const prioritizedKeys = ['value', 'label', 'name', 'title', 'slug']

    for (const key of prioritizedKeys) {
      if (key in candidate) {
        addValue(candidate[key])
        if (values.length >= limit) {
          return
        }
      }
    }

    for (const child of Object.values(candidate)) {
      traverse(child)
      if (values.length >= limit) {
        return
      }
    }
  }

  const traverse = (candidate: unknown): void => {
    if (values.length >= limit || candidate == null) {
      return
    }

    if (Array.isArray(candidate)) {
      for (const child of candidate) {
        traverse(child)
        if (values.length >= limit) {
          return
        }
      }

      return
    }

    if (typeof candidate === 'object') {
      extractFromObject(candidate as Record<string, unknown>)
      return
    }

    addValue(candidate as DatalistPrimitive)
  }

  traverse(payload)

  return values.slice(0, limit)
}

class DatalistAutocomplete {
  private observer: MutationObserver | null = null

  public init(): void {
    this.bindInputs(document)
    this.observeDomChanges()
  }

  private bindInputs(root: ParentNode): void {
    const inputs = root.querySelectorAll<HTMLInputElement>('input[data-datalist]')

    for (const input of Array.from(inputs)) {
      this.bindInput(input)
    }
  }

  private bindInput(input: HTMLInputElement): void {
    if (input.dataset.datalistBound === 'true') {
      return
    }

    const endpoint = (input.dataset.datalist ?? '').trim()
    if (endpoint === '') {
      return
    }

    const datalistId = this.resolveDatalistId(input)
    const datalistElement = this.ensureDatalistElement(input, datalistId)
    const searchResultsElement = this.ensureSearchResultsElement(input)
    const fieldInnerElement = input.closest('.c-field__inner')

    if (fieldInnerElement instanceof HTMLElement) {
      fieldInnerElement.classList.add('c-field__inner--datalist')
    }

    const minLength = Number.parseInt(input.dataset.datalistMinLength ?? '2', 10)
    const debounceMs = Number.parseInt(input.dataset.datalistDebounce ?? '180', 10)
    const maxItems = Number.parseInt(input.dataset.datalistMaxItems ?? '8', 10)

    let abortController: AbortController | null = null
    let debounceHandle: number | null = null

    const execute = async (): Promise<void> => {
      const query = input.value.trim()

      if (query.length < minLength) {
        this.renderOptions(datalistElement, [])
        this.renderSearchResults(searchResultsElement, [])
        return
      }

      abortController?.abort()
      abortController = new AbortController()

      try {
        const requestUrl = this.buildRequestUrl(input, endpoint, query)
        const response = await fetch(requestUrl, {
          headers: {
            Accept: 'application/json'
          },
          signal: abortController.signal
        })

        if (!response.ok) {
          this.renderOptions(datalistElement, [])
          this.renderSearchResults(searchResultsElement, [])
          return
        }

        const payload = (await response.json()) as DatalistItem[] | Record<string, unknown>
        const links = extractSearchResultLinks(payload, maxItems)
        const values = links.length > 0
          ? links.map((link) => link.label)
          : extractDatalistValues(payload, maxItems)

        this.renderSearchResults(searchResultsElement, links)
        this.renderOptions(datalistElement, values)
      } catch {
        this.renderOptions(datalistElement, [])
        this.renderSearchResults(searchResultsElement, [])
      }
    }

    input.addEventListener('input', () => {
      if (debounceHandle !== null) {
        window.clearTimeout(debounceHandle)
      }

      debounceHandle = window.setTimeout(() => {
        void execute()
      }, debounceMs)
    })

    input.dataset.datalistBound = 'true'

    input.addEventListener('blur', () => {
      window.setTimeout(() => {
        searchResultsElement.hidden = true
      }, 160)
    })

    input.addEventListener('focus', () => {
      if (searchResultsElement.childElementCount > 0) {
        searchResultsElement.hidden = false
      }
    })
  }

  private resolveDatalistId(input: HTMLInputElement): string {
    const currentListId = input.getAttribute('list')
    if (currentListId && currentListId.trim() !== '') {
      return currentListId
    }

    const fieldName = input.getAttribute('name') || 'field'
    return `datalist-${fieldName}-${Math.random().toString(36).slice(2, 10)}`
  }

  private ensureDatalistElement(input: HTMLInputElement, datalistId: string): HTMLDataListElement {
    let datalistElement = document.getElementById(datalistId) as HTMLDataListElement | null

    if (!datalistElement) {
      datalistElement = document.createElement('datalist')
      datalistElement.id = datalistId

      const parent = input.parentElement
      if (parent) {
        parent.appendChild(datalistElement)
      } else {
        document.body.appendChild(datalistElement)
      }
    }

    input.setAttribute('list', datalistId)

    return datalistElement
  }

  private ensureSearchResultsElement(input: HTMLInputElement): HTMLElement {
    const fieldElement = input.closest('.c-field')
    const hostElement = fieldElement instanceof HTMLElement
      ? fieldElement
      : (input.parentElement ?? document.body)

    if (fieldElement instanceof HTMLElement) {
      fieldElement.classList.add('c-field--search-results-enabled')
    }

    let resultsElement = hostElement.querySelector<HTMLElement>('.c-field__search-results')

    if (!resultsElement) {
      resultsElement = document.createElement('div')
      resultsElement.className = 'c-field__search-results'
      resultsElement.hidden = true
      hostElement.appendChild(resultsElement)
    }

    return resultsElement
  }

  private buildRequestUrl(input: HTMLInputElement, endpoint: string, query: string): string {
    if (endpoint.includes('{query}')) {
      return endpoint.replace('{query}', encodeURIComponent(query))
    }

    if (endpoint.includes('%s')) {
      return endpoint.replace('%s', encodeURIComponent(query))
    }

    const queryParam = (input.dataset.datalistQueryParam ?? 'q').trim() || 'q'

    try {
      const url = new URL(endpoint, window.location.origin)
      url.searchParams.set(queryParam, query)
      return url.toString()
    } catch {
      const separator = endpoint.includes('?') ? '&' : '?'
      return `${endpoint}${separator}${encodeURIComponent(queryParam)}=${encodeURIComponent(query)}`
    }
  }

  private renderOptions(datalistElement: HTMLDataListElement, values: string[]): void {
    datalistElement.innerHTML = ''

    for (const value of values) {
      const option = document.createElement('option')
      option.value = value
      datalistElement.appendChild(option)
    }
  }

  private renderSearchResults(resultsElement: HTMLElement, links: SearchResultLink[]): void {
    resultsElement.innerHTML = ''

    if (links.length === 0) {
      resultsElement.hidden = true
      return
    }

    const listElement = document.createElement('ul')
    listElement.className = 'c-field__search-results-list'

    for (const link of links) {
      const itemElement = document.createElement('li')
      itemElement.className = 'c-field__search-results-item'

      const anchorElement = document.createElement('a')
      anchorElement.className = 'c-field__search-results-link'
      anchorElement.href = link.url
      anchorElement.textContent = link.label

      itemElement.appendChild(anchorElement)
      listElement.appendChild(itemElement)
    }

    resultsElement.appendChild(listElement)
    resultsElement.hidden = false
  }

  private observeDomChanges(): void {
    if (this.observer) {
      return
    }

    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (!(node instanceof HTMLElement)) {
            continue
          }

          if (node instanceof HTMLInputElement && node.matches('input[data-datalist]')) {
            this.bindInput(node)
          }

          this.bindInputs(node)
        }
      }
    })

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }
}

const datalistAutocomplete = new DatalistAutocomplete()

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => datalistAutocomplete.init())
} else {
  datalistAutocomplete.init()
}

export default DatalistAutocomplete
