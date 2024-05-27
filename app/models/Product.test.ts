import { ProductModel } from "./Product"

const data = {
  name: "Apple",
  price: 1.5,
  quantity_available: 10,
  image: "https://example.com/apple.jpg",
  type: "fruit",
}

const product = ProductModel.create(data)

test("product name", () => {
  expect(product.name).toBe("Apple")
})

test("product price", () => {
  expect(product.price).toBe(1.5)
})

test("product quantity available", () => {
  expect(product.quantity_available).toBe(10)
})

test("product image", () => {
  expect(product.image).toBe("https://example.com/apple.jpg")
})

test("product type", () => {
  expect(product.type).toBe("fruit")
})