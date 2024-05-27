import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface SearchScreenProps extends AppStackScreenProps<"Search"> {}

// I'm not done with this additional screen yet

export const SearchScreen: FC<SearchScreenProps> = observer(function SearchScreen() {
  // const { productsStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$root}>
      <Text text="search" />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
