
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
// https://salamina.tech/blog/post/custom-tab-bar-tab-navigation-expo-react-native/
export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [tabBarWidth, setTabBarWidth] = useState(0);
  const tabWidth = tabBarWidth / state.routes.length;
  // Initialize simple shared value. Warning: ensure Reanimated is configured correctly in babel.config.js
  const translateX = useSharedValue(0);

  const indicatorPadding = 20; // px
  // Ensure indicatorWidth is valid number to avoid nan/infinity crashing animation logic
  const indicatorWidth = (tabWidth && tabWidth > 2 * indicatorPadding) ? tabWidth - 2 * indicatorPadding : (tabWidth ? tabWidth : 0);

  // Update position when index changes
  useEffect(() => {
    // Only animate if widths are calculated
    if (tabWidth > 0 && !isNaN(tabWidth)) {
        translateX.value = withTiming(state.index * tabWidth + indicatorPadding, { duration: 250 });
    }
  }, [state.index, tabWidth, translateX, indicatorPadding]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: indicatorWidth
  }));

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 25,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 25,
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      }}
      onLayout={(e) => setTabBarWidth(e.nativeEvent.layout.width)}>
      
      {/* Animated Tab Indicator */}
      {tabBarWidth > 0 && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              height: 4,
              backgroundColor: '#2563EB', // blue-600
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4,
            },
            indicatorStyle
          ]}
        />
      )}

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, height: '100%' }}
          >
            {options.tabBarIcon &&
              options.tabBarIcon({
                focused: isFocused,
                color: isFocused ? '#2563EB' : '#9CA3AF',
                size: 24,
              })}
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: isFocused ? '#2563EB' : '#9CA3AF'
              }}>
              {typeof options.title === 'string' ? options.title : route.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
