/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import type { ApiConfig, ApiProductResponse } from "./api.types"
import products from "../../../data/products.json"
import { ProductSnapshotIn } from "../../models/Product";

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Setting up API instance. Keeping this lightweight
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

    /**
   * Gets a list of grocery items.
   */
    async getGroceryItems(): Promise<{ kind: "ok"; items: ProductSnapshotIn[] } | GeneralApiProblem> {
      // make the mock api call
      const response: ApiResponse<ApiProductResponse> = await _getGroceryItems()
  
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
  
      // transform the data into the format we are expecting
      try {
        const rawData = response.data
  
        // This is where we transform the data into the shape we expect for our MST model.
        const items: any[] =
          rawData?.products.map((raw) => ({
            ...raw,
          })) ?? []
  
        return { kind: "ok", items }
      } catch (e) {
        if (__DEV__ && e instanceof Error) {
          console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
        }
        return { kind: "bad-data" }
      }
    }
}

/**
 * Mock function to simulate getting grocery items from an API
 */
async function _getGroceryItems(): Promise<ApiResponse<ApiProductResponse>> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        data: {status: "success", products},
        problem: null,
        originalError: null,
      });
    }, 1000);
  });
}

// Singleton instance of the API for convenience
export const api = new Api()
