import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { ProductModel } from "./Product"

export const CartItemModel = types
  .model("CartItem")
  .props({
    product: types.reference(ProductModel),
    quantity: types.number,
  })
  .actions(withSetPropAction)
  .views((cartItem) => ({
    get total() {
      return cartItem.product.price * cartItem.quantity
    },
    get displayedTotal() {
      return `R${(cartItem.product.price * cartItem.quantity).toFixed(2)}`
    },
    get isProductFinished() {
      return cartItem.product.quantity_available < cartItem.quantity
    },
    get availableQuantity() {
        return cartItem.product.quantity_available - cartItem.quantity
        }   
  }))

export interface CartItem extends Instance<typeof CartItemModel> {}
export interface CartItemSnapshotIn extends SnapshotIn<typeof CartItemModel> {}
export interface CartItemSnapshotOut extends SnapshotOut<typeof CartItemModel> {}
