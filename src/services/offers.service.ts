import NodeCache from 'node-cache'
import puppeteer from 'puppeteer'

interface IOffers {
  name: string | undefined
  image: string | undefined
  seller: string | undefined
  price: number | undefined
  oldprice: number | undefined
  discount: number | undefined
  last_scraped: string
}

const nodeCache = new NodeCache()

export class OffersService {
  constructor() {
    const pages = Number(process.env.PAGES_AMOUNT) || 42
    const interval: number =
      eval(process.env.INTERVAL_TO_UPDATE as string) || 10 * 1000 * 60 * 60

    const updateOffers = () => {
      this.getOffersByScrapping(pages).then(this.setOffers)
    }

    setInterval(() => updateOffers(), interval)
    updateOffers()
  }

  async setOffers(data: any) {
    try {
      const result: boolean = nodeCache.set('offers', data)

      if (!result) {
        throw new Error('Internal error')
      }

      return result
    } catch (error) {
      return error
    }
  }

  async getOffers() {
    try {
      const result: IOffers[] | undefined = nodeCache.get('offers')

      if (!result) {
        throw new Error('Loading...')
      }

      return result
    } catch (error) {
      return error
    }
  }

  async getOffersByScrapping(pageCount: number) {
    try {
      const selectors = {
        products: 'li.promotion-item',
        name: 'p.promotion-item__title',
        image: 'img.promotion-item__img',
        seller: 'span.promotion-item__seller',
        price: 'span.promotion-item__price',
        oldprice: 'span.promotion-item__oldprice',
        discount: 'span.promotion-item__discount'
      }

      const OFFERS_URL = 'https://www.mercadolivre.com.br/ofertas'

      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
      const page = await browser.newPage()

      await page.setJavaScriptEnabled(false)

      let result: IOffers[] = []

      for (let i = 1; i <= pageCount; i++) {
        await page.goto(`${OFFERS_URL}?page=${pageCount}`)

        await page.waitForSelector(selectors.products)

        const scrapOffers = async () => {
          // this functions only work inside browser
          return await page.evaluate((selectors) => {
            const items = document.querySelectorAll(selectors.products)
            if (!items) return []

            class Helpers {
              getPrice(product: Element) {
                const price = product.querySelector(selectors.price)
                if (!price) return

                const sup = price?.querySelector('sup')
                if (!sup) return price?.textContent

                return `${price.querySelector('span')?.textContent}.${
                  sup.textContent
                }`
              }

              normalizePrice(price: string) {
                if (!price) return

                return typeof price === 'string'
                  ? parseFloat(price.trim().replace('R$', ''))
                  : price
              }

              normalizeDiscount(discount: string) {
                if (!discount) return

                return typeof discount === 'string'
                  ? parseFloat(discount.trim().replace('16%', ''))
                  : discount
              }

              normalizeSeller(seller: string) {
                if (!seller) return

                return typeof seller === 'string'
                  ? seller.replace('por ', '')
                  : seller
              }
            }

            const helpers = new Helpers()
            const products: IOffers[] = [...items].map((product) => ({
              name:
                product.querySelector(selectors.name)?.textContent || undefined,
              image: product.querySelector(selectors.image)?.src || undefined,
              seller:
                helpers.normalizeSeller(
                  product.querySelector(selectors.seller)?.textContent
                ) || undefined,
              price:
                helpers.normalizePrice(helpers.getPrice(product)) || undefined,
              oldprice:
                helpers.normalizePrice(
                  product.querySelector(selectors.oldprice)?.textContent
                ) || undefined,
              discount:
                helpers.normalizeDiscount(
                  product.querySelector(selectors.discount)?.textContent
                ) || undefined,
              last_scraped: new Date().toISOString()
            }))

            return products
          }, selectors)
        }

        const data = await scrapOffers()

        result = result.concat(data)
      }

      await browser.close()

      return result
    } catch (error) {
      return error
    }
  }
}
