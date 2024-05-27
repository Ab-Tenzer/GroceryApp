import React, { ComponentType, FC, useEffect, useMemo } from "react"
import { observer } from "mobx-react-lite"
import { FontAwesome5 } from "@expo/vector-icons"
import {
  AccessibilityProps,
  Alert,
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  ImageStyle,
  Platform,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { type ContentStyle } from "@shopify/flash-list"
import { AppStackScreenProps } from "app/navigators"
import {
  AutoImage,
  Button,
  ButtonAccessoryProps,
  Card,
  EmptyState,
  Icon,
  ListView,
  Screen,
  Text,
  Toggle,
} from "../components"
import { isRTL, translate } from "../i18n"
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"
import { Product } from "app/models/Product"
import { colors, spacing, timing, typography } from "../theme"
import { delay } from "../utils/delay"
import { CartItem } from "app/models/CartItem"

const ICON_SIZE = 24

interface ProductListScreenProps extends AppStackScreenProps<"ProductList"> {}

export const ProductListScreen: FC<ProductListScreenProps> = observer(function ProductListScreen(
  _props,
) {
  const {
    authenticationStore: { logout },
    productStore,
  } = useStores()

  const [refreshing, setRefreshing] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [hasShownAlert, setHasShownAlert] = React.useState(false);


  // initially, kick off a background refresh without the refreshing UI
  useEffect(() => {
    ;(async function load() {
      setIsLoading(true)
      await productStore.fetchProducts()
      setIsLoading(false)
    })()

    if (productStore.totalCartPrice >= 10 && !hasShownAlert) {
      showFreeDeliveryAlert()
      setHasShownAlert(true);
    }
  }, [hasShownAlert, productStore.totalCartPrice])

  // simulating a longer refresh, if the refresh is too fast for UX
  async function manualRefresh() {
    setRefreshing(true)
    await Promise.all([productStore.fetchProducts(), delay(timing.medium)])
    setRefreshing(false)
  }
  function showFreeDeliveryAlert() {
    Alert.alert(
      "Free Delivery!",
      "You qualify for a free delivery. Continue shopping to get the best deals!",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false },
    )
  }

  const handlePress = (type: string) => {
    if (productStore.filterType === type) {
      productStore.clearFilter()
    } else {
      productStore.setFilterType(type)
    }
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$root}>
      <ListView<Product>
        contentContainerStyle={$listContentContainer}
        data={productStore.productsForList.slice()} // Returning a shallow copy of the array. Doing this to ensure that the component does not accidentally mutate the array in the store.
        extraData={productStore.products.length + productStore.cart.length}
        refreshing={refreshing}
        estimatedItemSize={50}
        onRefresh={manualRefresh}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator />
          ) : (
            <EmptyState
              preset="generic"
              style={$emptyState}
              headingTx={
                productStore.filtered ? "productListScreen.noFiltersEmptyState.heading" : undefined
              }
              contentTx={
                productStore.filtered ? "productListScreen.noFiltersEmptyState.content" : undefined
              }
              button={productStore.filtered ? "" : undefined}
              buttonOnPress={manualRefresh}
              imageStyle={$emptyStateImage}
              ImageProps={{ resizeMode: "contain" }}
            />
          )
        }
        ListHeaderComponent={
          <View>
            <View style={$listHeaderContainer}>
              <Icon
                icon="lock"
                size={ICON_SIZE}
                color={colors.palette.neutral800}
                onPress={logout}
              />
              <Text size="xl" style={$heading} tx="productListScreen.title" />
              <View style={$notificationBadgeIconContainer}>
                {productStore.totalCartPrice >= 10 ? (
                  <View style={$notificationBadge}></View>
                ) : null}
                <Icon
                  icon="bell"
                  size={ICON_SIZE}
                  color={colors.palette.neutral800}
                  onPress={() => {
                    if (productStore.totalCartPrice >= 10) {
                      showFreeDeliveryAlert();
                    }
                  }}
                />
              </View>
            </View> 
            <Text preset="formHelper" size="xs">Filter</Text>
            <View style={$listHeaderButtonContainer}>
             
              <TouchableOpacity style={$buttonImage} onPress={() => handlePress("dairy")}>
                <Image
                  style={$image}
                  resizeMode="contain"
                  source={require("assets/images/dairy.png")}
                />
              </TouchableOpacity>

              <TouchableOpacity style={$buttonImage} onPress={() => handlePress("fruit")}>
                <Image
                  style={$image}
                  resizeMode="contain"
                  source={require("assets/images/fruit.png")}
                />
              </TouchableOpacity>

              <TouchableOpacity style={$buttonImage} onPress={() => handlePress("vegetable")}>
                <Image
                  style={$image}
                  resizeMode="contain"
                  source={require("assets/images/vegetable.png")}
                />
              </TouchableOpacity>

              <TouchableOpacity style={$buttonImage} onPress={() => handlePress("meat")}>
                <Image
                  style={$image}
                  resizeMode="contain"
                  source={require("assets/images/meat.png")}
                />
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            addToCart={() => productStore.addToCart(item)}
            removeFromCart={() => productStore.reduceCart(item)}
            viewProduct={() => {
              // navigation.navigate("ProductDetail", { product: item })
            }}
            cart={productStore.cart}
          />
        )}
        numColumns={2}
      />
    </Screen>
  )
})

const ProductCard = observer(function ProductCard({
  product,
  addToCart,
  removeFromCart,
  viewProduct,
  cart,
}: {
  product: Product
  addToCart: () => void
  removeFromCart: () => void
  viewProduct: () => void
  cart: CartItem[]
}) {
  const cartItem = cart.find((item) => item.product.name === product.name)
  const quantity = cartItem ? cartItem.quantity : 0

  return (
    <Card
      heading={quantity.toString()}
      headingStyle={$productQuantity}
      ContentComponent={
        <AutoImage style={$cardImage} resizeMode="contain" source={{ uri: product.image }} />
      }
      style={$cardContentContainer}
      FooterComponent={
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "column" }}>
            <Text style={{ maxWidth: 100 }} text={product.name} />
            <Text text={product.displayedPrice} />
          </View>
          <View style={{ flexDirection: "column" }}>
            <TouchableOpacity style={$cartCountIcon} onPress={addToCart}>
              <FontAwesome5 name="plus" size={12} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...$cartCountIcon, marginTop: 4 }}
              onPress={removeFromCart}
            >
              <FontAwesome5 name="minus" size={12} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      }
      onPress={viewProduct}
      // onAddToCart={addToCart}
      // onRemoveFromCart={removeFromCart}
    />
  )
})

const $root: ViewStyle = {
  flex: 1,
}
const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.sm,
  paddingBottom: spacing.lg,
}

const $listHeaderButtonContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.lg,
  flexDirection: "row",
  justifyContent: "space-evenly",
  alignItems: "center",
  maxHeight: 150,
}

const $emptyState: ViewStyle = {
  marginTop: spacing.xxl,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const $listHeaderContainer: ViewStyle = {
  paddingTop: spacing.xs,
  paddingRight: spacing.xl,
  paddingBottom: spacing.lg,
  minWidth: "100%",
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
}

const $heading: TextStyle = {
  color: "#424242",
  textAlign: "center",
  fontFamily: typography.primary.bold,
}

const $notificationBadgeIconContainer: ViewStyle = {
  position: "relative",
}

const $notificationBadge: ViewStyle = {
  position: "absolute",
  top: -10,
  right: -5,
  height: 15,
  width: 15,
  borderRadius: 7,
  backgroundColor: "red",
  justifyContent: "center",
  alignItems: "center",
}

// Filter Button Styles
const $image: ImageStyle = {
  height: "70%",
  maxWidth: "100%",
}

const $buttonImage: ViewStyle = {
  width: "45%",
}

// Card Styles
const $cardImage: ImageStyle = {
  height: 80,
  marginVertical: spacing.md,
  maxWidth: "100%",
}

const $cardContentContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignContent: "center",
  marginHorizontal: spacing.md,
  marginVertical: spacing.md,
}

const $cartCountIcon: ViewStyle = {
  backgroundColor: colors.palette.primary400,
  borderRadius: 4,
  paddingLeft: spacing.xs,
  paddingRight: spacing.xs,
  padding: 4,
}

const $productQuantity: TextStyle = {
  color: "white",
  alignSelf: "center",
  backgroundColor: colors.palette.primary500,
  padding: 5,
  borderRadius: 15,
  width: 30,
  height: 30,
  textAlign: "center",
}
