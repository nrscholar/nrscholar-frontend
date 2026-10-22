// Ambient type declarations for React Native and Expo modules

declare module 'react-native' {
  export const View: any;
  export const StyleSheet: any;
  export const ActivityIndicator: any;
  export const BackHandler: any;
  export const Animated: any;
  export const Text: any;
  export const TouchableOpacity: any;
  export const Platform: any;
  export const Dimensions: any;
  export const Image: any;
  export const TextInput: any;
  export const ScrollView: any;
  export const FlatList: any;
  export const Alert: any;
  export const Modal: any;
  export const Pressable: any;
  export const SafeAreaView: any;
  export const StatusBar: any;
  export const KeyboardAvoidingView: any;
  export const TouchableWithoutFeedback: any;
  export const Keyboard: any;
  export const RefreshControl: any;
  export const SectionList: any;
  export const Switch: any;
  export const Linking: any;
  export const AppState: any;
  export type ViewStyle = any;
  export type TextStyle = any;
  export type ImageStyle = any;
  export type StyleProp<T> = any;
  export type ViewProps = any;
  export type TextProps = any;
  export type OpaqueColorValue = any;
  export type NativeSyntheticEvent<T> = any;
  const content: any;
  export default content;
}

declare module 'react-native-webview' {
  export const WebView: any;
  export type WebView = any;
  export interface WebViewNavigation {
    url?: string;
    title?: string;
    loading?: boolean;
    canGoBack?: boolean;
    canGoForward?: boolean;
    [key: string]: any;
  }
  export interface WebViewErrorEvent {
    nativeEvent: {
      description?: string;
      domain?: string;
      code?: number;
      [key: string]: any;
    };
  }
  const content: any;
  export default content;
}

declare module 'expo-router' {
  export function useRouter(): any;
  export function useFocusEffect(callback: any): void;
  export function useLocalSearchParams<T = any>(): T;
  export function usePathname(): string;
  export function useSegments(): string[];
  export type Href = any;
  export const Link: any;
  export const Stack: any;
  export const Tabs: any;
  export const Slot: any;
  export const Redirect: any;
  export const SplashScreen: any;
}

declare module '@expo/vector-icons' {
  export const MaterialIcons: any;
  export const Ionicons: any;
  export const FontAwesome: any;
  export const Feather: any;
  export const AntDesign: any;
  export const MaterialCommunityIcons: any;
  export const SimpleLineIcons: any;
  export const Octicons: any;
  export const Entypo: any;
  export const Zocial: any;
  export const Foundation: any;
  export const EvilIcons: any;
}

declare module '@expo/vector-icons/*' {
  const content: any;
  export default content;
}

declare module 'expo-haptics' {
  export enum ImpactFeedbackStyle {
    Light = 'light',
    Medium = 'medium',
    Heavy = 'heavy',
  }
  export enum NotificationFeedbackType {
    Success = 'success',
    Warning = 'warning',
    Error = 'error',
  }
  export function impactAsync(style?: ImpactFeedbackStyle): Promise<void>;
  export function notificationAsync(type?: NotificationFeedbackType): Promise<void>;
  export function selectionAsync(): Promise<void>;
}

declare module 'expo-linear-gradient' {
  export const LinearGradient: any;
}

declare module 'expo-symbols' {
  export type SymbolViewProps = any;
  export type SymbolWeight = any;
  export const SymbolView: any;
}

declare module 'expo-web-browser' {
  export function openBrowserAsync(url: string, options?: any): Promise<any>;
  export function dismissBrowser(): void;
}

declare module '@react-navigation/bottom-tabs' {
  export type BottomTabBarButtonProps = any;
}

declare module '@react-navigation/elements' {
  export const PlatformPressable: any;
}

declare module 'react-native-reanimated' {
  export const Animated: any;
  export default Animated;
}

declare module 'expo-blur';
declare module 'expo-camera';
declare module 'expo-constants';
declare module 'expo-file-system';
declare module 'expo-font';
declare module 'expo-image';
declare module 'expo-image-picker';
declare module 'expo-linking';
declare module 'expo-notifications';
declare module 'expo-print';
declare module 'expo-secure-store';
declare module 'expo-sharing';
declare module 'expo-splash-screen';
declare module 'expo-status-bar';
declare module 'expo-system-ui';
declare module '@react-native-async-storage/async-storage';
declare module '@react-navigation/*';
declare module '@react-navigation/native' {
  export const useFocusEffect: (callback: () => void | (() => void)) => void;
  export const useNavigation: <T = any>() => T;
  export const useRoute: <T = any>() => T;
  export const useIsFocused: () => boolean;
  export const NavigationContainer: any;
}
declare module 'react-native-safe-area-context';
declare module 'react-native-screens';
declare module 'react-native-svg';
declare module 'react-native-toast-message';
declare module 'react-native-gesture-handler';
declare module 'react-native-worklets';
declare module 'lottie-react-native';
declare module 'nativewind';
