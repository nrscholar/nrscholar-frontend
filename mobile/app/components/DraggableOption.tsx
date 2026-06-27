import React, { useRef } from 'react';
import { Animated, PanResponder, StyleSheet, Text } from 'react-native';

const C = {
  primary: "#141779",
  white: "#ffffff",
  surfaceContainerLowest: "#ffffff",
  onSurface: "#191c1e",
};

export function DraggableOption({ option, onDrop, disabled }: { option: string, onDrop: (opt: string, x: number, y: number) => void, disabled?: boolean }) {
  const pan = useRef(new Animated.ValueXY()).current;
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (e, gesture) => {
        if (!disabled) {
          onDrop(option, e.nativeEvent.pageX, e.nativeEvent.pageY);
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        }
      }
    })
  ).current;

  return (
    <Animated.View 
      {...panResponder.panHandlers} 
      style={[
        pan.getLayout(), 
        styles.draggableItem,
        disabled && { opacity: 0.5 }
      ]}
    >
      <Text style={styles.draggableText}>{option}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  draggableItem: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: 2,
    borderColor: C.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 10,
  },
  draggableText: {
    fontSize: 20,
    fontWeight: "700",
    color: C.onSurface,
  }
});
