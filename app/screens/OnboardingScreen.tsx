/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import React, { FC, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Animated, Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Icon, Text } from "app/components"
import { setOnboardFlag } from "app/services/asyncStorage"
import { colors, spacing, timing } from "../theme"
// import { useStores } from "app/models"

const meta = {
  0: {
    title: "Shop in 60 Seconds",
    image: require("../../assets/images/shop-in-seconds.png"),
    subtitle: "Conveniently grouped products make it faster to shop.",
  },
  1: {
    title: "Delivered in 60 Minutes",
    image: require("../../assets/images/delivered-in-minutes.png"),
    subtitle: "Save time, stay safe and shop from the comfort of your home.",
  },
  2: {
    title: "Checkers' famously low prices",
    image: require("../../assets/images/low-prices.png"),
    subtitle: "Delivered to your door, at the same low prices you love.",
  },
}

interface OnboardingScreenProps extends AppStackScreenProps<"Onboarding"> {}

export const OnboardingScreen: FC<OnboardingScreenProps> = observer(function OnboardingScreen(
  _props,
) {
  // const { someStore, anotherStore } = useStores()

  const { navigation } = _props
  const [index, setIndex] = useState(0)
  const [metaIndex, setMetaIndex] = useState(0)
  const animatedValue = useRef(new Animated.Value(0)).current

  const viewBgRange = [
    colors.palette.neutral800,
    colors.palette.neutral800,
    colors.palette.neutral800,
    colors.palette.neutral200,
    colors.palette.neutral200,
  ]
  const buttonBgRange = [
    colors.palette.neutral200,
    colors.palette.neutral200,
    colors.palette.neutral200,
    colors.palette.neutral800,
    colors.palette.neutral800,
  ]

  const animateSlider = () =>
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: timing.slow,
      useNativeDriver: false,
    })

  const onPress = () => {
    if (index >= 2) {
      ;(async () => {
        await setOnboardFlag()
        navigation.navigate("Demo", { screen: "DemoShowroom", params: {} })
      })()
      return
    }
    setIndex((value) => value + 1)
    setTimeout(() => {
      setMetaIndex((value) => value + 1)
    }, timing.medium)
    animateSlider().reset()
    animateSlider().start()
  }

  const isBgColorEven = index === 0 || index % 2 !== 0
  const isButtonColorEven = index === 0 || index % 2 === 0

  const inputRange = [0, 0.001, 0.5, 0.501, 1]

  const containerBg = animatedValue.interpolate({
    inputRange,
    outputRange: isBgColorEven ? buttonBgRange : viewBgRange,
  })
  const buttonBg = animatedValue.interpolate({
    inputRange,
    outputRange: isBgColorEven ? viewBgRange : buttonBgRange,
  })

  return (
    <View style={$root}>
      <Animated.View style={[$animatedViewContainer, { backgroundColor: containerBg }]}>
        <View style={$contentBox}>
          <Image
            resizeMode="contain"
            style={$image}
            source={meta[metaIndex || 0].image}
          />
          <Text style={[$title, { color: metaIndex === 1 ? "#FFFFFF" : "#222222" }]} size="xl">
            {meta[metaIndex || 0].title}
          </Text>
          <Text style={[$subtitle, { color: metaIndex === 1 ? "#FFFFFF" : "#222222" }]} size="xs">
            {meta[metaIndex || 0].subtitle}
          </Text>
        </View>
        <Animated.View
          style={[
            $animatedButtonContainer,
            {
              backgroundColor: buttonBg,
              transform: [
                {
                  perspective: 400,
                },
                {
                  rotateY: animatedValue.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: ["0deg", "-90deg", "-180deg"],
                  }),
                },
                {
                  translateX: animatedValue.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 100, 0],
                  }),
                },
                {
                  scale: animatedValue.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 10, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Button onPress={onPress} style={$nextButton}>
            <Animated.View
              style={{
                padding: 24,
                overflow: "visible",
                justifyContent: "center",
                alignItems: "center",
                opacity: animatedValue.interpolate({
                  inputRange: [0, 0.1, 0.8, 1],
                  outputRange: [1, 0, 0, 1],
                }),
                transform: [
                  {
                    rotateZ: animatedValue.interpolate({
                      inputRange: [0, 0.5, 0.5001, 1],
                      outputRange: ["0deg", "0deg", "180deg", "180deg"],
                    }),
                  },
                  {
                    translateX: animatedValue.interpolate({
                      inputRange: [0, 0.1, 0.499, 0.5, 0.8, 1],
                      outputRange: [0, 25, 25, -25, -25, 0],
                    }),
                  },
                ],
              }}
            >
              <Icon
                size={24}
                icon="caretRight"
                color={isButtonColorEven ? colors.palette.neutral200 : colors.palette.neutral800}
              />
            </Animated.View>
          </Button>
        </Animated.View>
      </Animated.View>
    </View>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
const $nextButton: ViewStyle = {
  aspectRatio: 1,
  borderRadius: 999999, // lazy
  backgroundColor: colors.palette.secondary500,
}

const $title: TextStyle = {
  paddingTop: spacing.xl,
  textAlign: "center",
}

const $subtitle: TextStyle = {
  paddingTop: spacing.sm,
  textAlign: "center",
}

const $contentBox: ViewStyle = {
  maxWidth: "80%",
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.xxl,
}

const $animatedButtonContainer: ViewStyle = {
  alignItems: "center",
  borderRadius: 100,
  height: 80,
  justifyContent: "center",
  width: 80,
}

const $animatedViewContainer: ViewStyle = {
  alignItems: "center",
  flex: 1,
  justifyContent: "space-between",
  paddingBottom: spacing.xxxl,
}

const $image: ImageStyle = {
  height: "70%",
  maxWidth: "100%",
}
