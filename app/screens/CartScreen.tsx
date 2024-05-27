import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import {
  ActivityIndicator,
  ImageStyle,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"
import { AppStackScreenProps } from "app/navigators"
import { AutoImage, Button, Card, EmptyState, Icon, ListView, Screen, Text } from "../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"
import { Product } from "app/models/Product"
import { CartItem } from "app/models/CartItem"
import { isRTL, translate } from "../i18n"
import { FlashListProps } from "app/components"
import { delay } from "app/utils/delay"
import { colors, spacing, timing, typography } from "app/theme"

const ICON_SIZE = 24

interface CartScreenProps extends AppStackScreenProps<"Cart"> {}

export const CartScreen: FC<CartScreenProps> = observer(function CartScreen() {
  const {
    authenticationStore: { logout },
    productStore,
  } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()

  const [refreshing, setRefreshing] = React.useState(false)

  // simulating a longer refresh, if the refresh is too fast for UX
  async function manualRefresh() {
    setRefreshing(true)
    await Promise.all([productStore.fetchProducts(), delay(timing.medium)])
    setRefreshing(false)
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$root}>
      <ListView<CartItem>
        contentContainerStyle={$listContentContainer}
        data={productStore.cart.slice()}
        estimatedItemSize={50}
        ListEmptyComponent={
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
        }
        ListHeaderComponent={
          <View style={$listHeaderContainer}>
            <Icon icon="lock" size={ICON_SIZE} color={colors.palette.neutral800} onPress={logout} />
            <Text size="xl" style={$heading} text="Cart" />
            <View style={$notificationBadgeIconContainer}>
              {productStore.totalCartPrice >= 10 ? <View style={$notificationBadge}></View> : null}
              <Icon
                icon="bell"
                size={ICON_SIZE}
                color={colors.palette.neutral800}
                onPress={() => {
                  return null
                }}
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <CartCard
            cartItem={item}
            increaseCart={() => productStore.addToCart(item.product)}
            reduceCart={() => productStore.reduceCart(item.product)}
            removeFromCart={() => productStore.removeFromCart(item.product)}
          />
        )}
      />

      <View style={$totalContainer}>
        <Text size="xl" style={$heading}>
          Total
        </Text>
        <Text size="xl" style={$heading}>
          {productStore.formattedTotalCartPrice}
        </Text>
      </View>
      <View style={$buttonContainer}>
        <Button
          text="Checkout"
          style={[
            $checkoutButton,
            productStore.totalCartPrice < 5
              ? { backgroundColor: colors.palette.secondary100 }
              : { backgroundColor: colors.palette.neutral800 },
          ]}
          textStyle={$buttonText}
          disabled={productStore.totalCartPrice < 5} // Assessment requirement met
          onPress={() => {
            return null
          }}
        />
      </View>
    </Screen>
  )
})

const CartCard: FC<FlashListProps> = observer(function CartCard({
  cartItem,
  increaseCart,
  reduceCart,
  removeFromCart,
}: {
  cartItem: CartItem
  increaseCart: () => void
  reduceCart: () => void
  removeFromCart: () => void
}) {
  return (
    <Card
      style={$cardContainer}
      verticalAlignment="space-between"
      LeftComponent={
        <AutoImage
          style={$cardImage}
          resizeMode="contain"
          source={{ uri: cartItem.product.image }}
        />
      }
      RightComponent={
        <Icon icon="x" size={ICON_SIZE} color={colors.tint} onPress={removeFromCart} />
      }
      heading={cartItem.product.name}
      HeadingTextProps={{ weight: "bold" }}
      ContentComponent={
        <View style={$cartControlContainer}>
          <TouchableOpacity style={$cartCountIcon} onPress={increaseCart}>
            <FontAwesome5 name="plus" size={12} color="#FFFFFF" />
          </TouchableOpacity>
          <Text text={`${cartItem.quantity}`} />
          <TouchableOpacity style={$cartCountIcon} onPress={reduceCart}>
            <FontAwesome5 name="minus" size={12} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      }
      contentStyle={{ color: "#a511dc" }}
      ContentTextProps={{ weight: "light" }}
      footer={
        cartItem.availableQuantity > 0 ? `Available: ${cartItem.availableQuantity}` : "Out of Stock"
      }
      footerStyle={{ color: colors.palette.neutral300 }}
      FooterTextProps={{ weight: "medium" }}
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

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const $emptyState: ViewStyle = {
  marginTop: spacing.xxl,
}

// Card Styles
const $cardContainer: ViewStyle = {
  marginVertical: spacing.md,
}
const $cardImage: ImageStyle = {
  height: 100,
  marginVertical: spacing.xs,
  maxWidth: "30%",
  // maxHeight: "60%"
}
const $cartCountIcon: ViewStyle = {
  backgroundColor: colors.palette.primary400,
  borderRadius: 4,
  paddingLeft: spacing.xs,
  paddingRight: spacing.xs,
  padding: 4,
}
const $cartControlContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  maxWidth: "40%",
}

//Screen Footer

const $totalContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.lg,
}

const $buttonContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
}

const $checkoutButton: ViewStyle = {
  backgroundColor: colors.palette.neutral800,
  padding: spacing.lg,
  borderRadius: 10,
}

const $buttonText: TextStyle = {
  color: colors.palette.neutral100,
  fontFamily: typography.primary.bold,
}
