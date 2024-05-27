/*
 * This file defines a ProductModel using mobx-state-tree, with properties for name, 
 * price, quantity_available, image, and type. It also includes two views: isAvailable 
 * and isOutOfStock, which return boolean values based on the quantity_available property.
 */
import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

interface ProductItem {
    name: string
    price: number
    quantity_available: number
    image: string
    type: string
}

/**
 * This represents a product in the store.
 */
export const ProductModel = types
  .model("Product")
  .props({
    name: types.identifier,
    price: types.number,
    quantity_available: types.number,
    image: types.string,
    type: types.string,
  })
  .actions(withSetPropAction)
  .views((product) => ({
    get isAvailable() {
      return product.quantity_available > 0
    },
    get isOutOfStock() {
      return product.quantity_available === 0
    },
    get displayedPrice() {
      return `R${product.price.toFixed(2)}`
    }
  }))

export interface Product extends Instance<typeof ProductModel> {}
export interface ProductSnapshotOut extends SnapshotOut<typeof ProductModel> {}
export interface ProductSnapshotIn extends SnapshotIn<typeof ProductModel> {}