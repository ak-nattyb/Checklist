import type { MaterialIcons } from "@expo/vector-icons";
import { router, useSegments } from "expo-router";
import { type ReactNode, useCallback, useEffect } from "react";
import {
  Animated,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { Header } from "@/components/Header";
import { SwipeBackContainer } from "@/components/SwipeBackContainer";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { useScrollIndicator } from "@/hooks/useScrollIndicator";
import { n } from "@/utils/scaling";

interface RightAction {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  show?: boolean;
}

interface LeftAction {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  show?: boolean;
}

interface ContentContainerProps {
  bottomPadding?: number;
  children?: ReactNode;
  contentGap?: number;
  contentWidth?: "wide" | "normal";
  footer?: ReactNode;
  headerTitle?: string;
  hideBackButton?: boolean;
  leftAction?: LeftAction;
  onBackPress?: () => void;
  onScrollIndicatorVisibilityChange?: (isVisible: boolean) => void;
  onTitlePress?: () => void;
  reserveScrollGutter?: boolean;
  rightAction?: RightAction;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function ContentContainer({
  headerTitle,
  children,
  bottomPadding,
  hideBackButton = false,
  leftAction,
  onBackPress,
  onScrollIndicatorVisibilityChange,
  onTitlePress,
  reserveScrollGutter = true,
  rightAction,
  scrollable = true,
  style,
  footer,
  contentWidth = "normal",
  contentGap = 47,
}: ContentContainerProps) {
  const segments = useSegments();
  const hasNavbar = segments?.[0] === "(tabs)";
  const { invertColors } = useInvertColors();
  const {
    handleScroll,
    scrollIndicatorHeight,
    scrollIndicatorPosition,
    setContentHeight,
    setScrollViewHeight,
  } = useScrollIndicator();

  const canSwipeBack = Boolean(headerTitle) && !hideBackButton;

  const handleBack = useCallback(() => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (router.canGoBack()) {
      router.back();
    }
  }, [onBackPress]);

  const hasScrollIndicator = scrollable && scrollIndicatorHeight > 0;

  useEffect(() => {
    onScrollIndicatorVisibilityChange?.(hasScrollIndicator);
  }, [hasScrollIndicator, onScrollIndicatorVisibilityChange]);

  const horizontalPadding = {
    paddingLeft: contentWidth === "wide" ? n(20) : n(37),
    paddingRight: contentWidth === "wide" ? n(20) : n(37),
  };
  const scrollGutter = scrollable && reserveScrollGutter ? n(16) : 0;
  const contentPadding = {
    ...horizontalPadding,
    gap: n(contentGap),
    paddingRight: horizontalPadding.paddingRight + scrollGutter,
  };
  const resolvedBottomPadding = bottomPadding ?? (hasNavbar ? 0 : 20);

  return (
    <SwipeBackContainer enabled={canSwipeBack} onSwipeBack={handleBack}>
      <View
        style={[
          styles.container,
          { backgroundColor: invertColors ? "white" : "black" },
        ]}
      >
        {headerTitle && (
          <Header
            headerTitle={headerTitle}
            hideBackButton={hideBackButton}
            leftAction={leftAction}
            onBackPress={handleBack}
            onTitlePress={onTitlePress}
            rightAction={rightAction}
          />
        )}
        <View style={styles.body}>
          <View
            style={[
              styles.scrollWrapper,
              { paddingBottom: footer ? 0 : n(resolvedBottomPadding) },
            ]}
          >
            {scrollable ? (
              <Animated.ScrollView
                onLayout={(event) =>
                  setScrollViewHeight(event.nativeEvent.layout.height)
                }
                onScroll={handleScroll}
                overScrollMode="never"
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
              >
                <View
                  onLayout={(event) =>
                    setContentHeight(event.nativeEvent.layout.height)
                  }
                  style={[styles.content, contentPadding, style]}
                >
                  {children ?? null}
                </View>
              </Animated.ScrollView>
            ) : (
              <View
                onLayout={(event) =>
                  setContentHeight(event.nativeEvent.layout.height)
                }
                style={[styles.staticContent, contentPadding, style]}
              >
                {children ?? null}
              </View>
            )}
            {hasScrollIndicator && (
              <View
                style={[
                  styles.scrollIndicatorTrack,
                  {
                    right: contentWidth === "wide" ? n(18) : n(34),
                    backgroundColor: invertColors ? "black" : "white",
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.scrollIndicatorThumb,
                    {
                      backgroundColor: invertColors ? "black" : "white",
                    },
                    {
                      height: scrollIndicatorHeight,
                      transform: [
                        {
                          translateY: scrollIndicatorPosition,
                        },
                      ],
                    },
                  ]}
                />
              </View>
            )}
          </View>
          {footer && (
            <View
              style={[
                styles.footer,
                horizontalPadding,
                { paddingBottom: n(resolvedBottomPadding) },
              ]}
            >
              {footer}
            </View>
          )}
        </View>
      </View>
    </SwipeBackContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    gap: n(14),
  },
  body: {
    flex: 1,
    width: "100%",
  },
  scrollWrapper: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    position: "relative",
  },
  content: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: n(37),
    gap: n(47),
  },
  footer: {
    width: "100%",
  },
  staticContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: n(37),
    gap: n(47),
    width: "100%",
  },
  scrollIndicatorTrack: {
    width: n(1),
    height: "100%",
    position: "absolute",
  },
  scrollIndicatorThumb: {
    width: n(5),
    position: "absolute",
    right: n(-2),
  },
});
