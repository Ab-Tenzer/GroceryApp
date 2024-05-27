import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { Product, ProductModel } from "./Product"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { CartItemModel } from "./CartItem"

// export const CartItemModel = types.model("CartItem", {
//   product: types.reference(ProductModel),
//   quantity: types.number,
// })

export const ProductStoreModel = types
  .model("ProductStore")
  .props({
    products: types.array(ProductModel),
    cart: types.array(CartItemModel),
    // categorisedProducts: types.array(types.reference(ProductModel)),
    filterType: types.optional(types.string, ""),
    filtered: false,
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchProducts() {
      const response = await api.getGroceryItems()
      if (response.kind === "ok") {
        store.setProp("products", response.items)
      } else {
        console.error(`Error fetching products: ${JSON.stringify(response)}`)
      }
    },
    addToCart(product: Product) {
      if (product.quantity_available > 0) {
        const cartItem = store.cart.find((item) => item.product === product)
        if (cartItem) {
          cartItem.quantity += 1
        } else {
          const newCartItem = CartItemModel.create({ product, quantity: 1 })
          store.cart.push(newCartItem)
        }
      } else {
        console.log('Product is out of stock');
      }
    },

    reduceCart(product: Product) {
      const cartItem = store.cart.find((item) => item.product === product)
      if (cartItem) {
        cartItem.quantity -= 1
        if (cartItem.quantity <= 0) {
          store.cart.remove(cartItem)
        }
      }
    },

    removeFromCart(product: Product) {
      const cartItem = store.cart.find((item) => item.product === product)
      if (cartItem) {
        store.cart.remove(cartItem)
      }
    },

    setFilterType(type: string) {
      store.setProp("filterType", type)
      store.setProp("filtered", true)
    },
    clearFilter() {
      store.setProp("filterType", "")
      store.setProp("filtered", false)
    },
  }))
  .views((store) => ({
    get productsForList() {
      let products = store.products.filter((product) => product.quantity_available > 0);
      if (store.filterType) {
        products = products.filter((product) => product.type === store.filterType);
      }
      return products;
    },
    get cartItems() {
      return store.cart
    },
    get formattedTotalCartPrice() {
      const total = store.cart.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0,
      )
      // console.tron.log("total", total, store.cart)
      return total > 0 ? `R${total.toLocaleString()}` : undefined
    },
    get totalCartPrice() {
      return store.cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
    },
    get categorisedProducts() {
      return store.products.reduce((acc: Product[], product) => {
        if (!acc.find((p) => p.type === product.type)) {
          acc.push(product)
        }
        return acc
      }, [] as Product[])
    },
    get filterList() {
      return store.products.map((product) => product.type)
    },
  }))

export interface ProductStore extends Instance<typeof ProductStoreModel> {}
export interface ProductStoreSnapshot extends SnapshotOut<typeof ProductStoreModel> {}
