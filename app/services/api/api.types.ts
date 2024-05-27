/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */

export interface ProductItem {
  name: string
  price: number
  quantity_available: number
  image: string
  type: string
}

export interface ApiProductResponse {
  status: string
  products: ProductItem[]
}


/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}
