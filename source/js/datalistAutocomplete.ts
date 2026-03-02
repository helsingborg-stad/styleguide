type DatalistPrimitive = string | number | boolean

type DatalistItem = {
  value?: unknown
  label?: unknown
  name?: unknown
  title?: unknown
  slug?: unknown
}

export function extractDatalistValues(payload: unknown, limit = 10): string[] {
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
    const minLength = Number.parseInt(input.dataset.datalistMinLength ?? '2', 10)
    const debounceMs = Number.parseInt(input.dataset.datalistDebounce ?? '180', 10)
    const maxItems = Number.parseInt(input.dataset.datalistMaxItems ?? '8', 10)

    let abortController: AbortController | null = null
    let debounceHandle: number | null = null

    const execute = async (): Promise<void> => {
      const query = input.value.trim()

      if (query.length < minLength) {
        this.renderOptions(datalistElement, [])
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
          return
        }

        const payload = (await response.json()) as DatalistItem[] | Record<string, unknown>
        const values = extractDatalistValues(payload, maxItems)
        this.renderOptions(datalistElement, values)
      } catch {
        this.renderOptions(datalistElement, [])
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
