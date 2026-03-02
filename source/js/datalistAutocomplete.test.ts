import { extractDatalistValues, extractSearchResultLinks } from './datalistAutocomplete'

describe('datalistAutocomplete', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('extracts values from categorized API response', () => {
    const payload = {
      query: 'but',
      results: {
        components: [
          { name: 'Button', slug: 'button' },
          { label: 'Badge' }
        ],
        docs: [
          { title: 'Buttons guide' }
        ]
      }
    }

    const values = extractDatalistValues(payload, 5)

    expect(values).toEqual(['Button', 'button', 'Badge', 'Buttons guide'])
  })

  it('extracts clickable links from categorized API response', () => {
    const payload = {
      query: 'but',
      results: {
        components: [
          { name: 'Button', url: '/components/button' },
          { label: 'Badge', href: '/components/badge' }
        ]
      }
    }

    const links = extractSearchResultLinks(payload, 5)

    expect(links).toEqual([
      { label: 'Button', url: '/components/button' },
      { label: 'Badge', url: '/components/badge' }
    ])
  })

  it('creates datalist and options for input with data-datalist endpoint', async () => {
    jest.useFakeTimers()

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: {
          components: [
            { name: 'Button', url: '/components/button' },
            { name: 'Badge', url: '/components/badge' }
          ]
        }
      })
    })

    Object.defineProperty(global, 'fetch', {
      value: fetchMock,
      configurable: true,
      writable: true,
    })

    document.body.innerHTML = '<form><input name="s" data-datalist="/search" data-datalist-query-param="q" /></form>'

    await import('./datalistAutocomplete')

    const searchInput = document.querySelector('input[name="s"]') as HTMLInputElement
    searchInput.value = 'but'
    searchInput.dispatchEvent(new Event('input', { bubbles: true }))

    jest.advanceTimersByTime(220)
    await Promise.resolve()
    await Promise.resolve()

    const listId = searchInput.getAttribute('list')
    expect(listId).toBeTruthy()

    const datalistElement = document.getElementById(listId as string) as HTMLDataListElement
    expect(datalistElement).toBeTruthy()
    expect(Array.from(datalistElement.querySelectorAll('option')).map((option) => option.value)).toEqual(['Button', 'Badge'])

    const resultLinks = Array.from(document.querySelectorAll('.c-field__search-results-link')) as HTMLAnchorElement[]
    expect(resultLinks.map((link) => link.textContent)).toEqual(['Button', 'Badge'])
    expect(resultLinks.map((link) => link.getAttribute('href'))).toEqual(['/components/button', '/components/badge'])

    expect(fetchMock).toHaveBeenCalledTimes(1)

    jest.useRealTimers()
  })
})
