import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colours';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/HomeScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import Scanner from '../screens/Scanner';
import NewsScreen from '../screens/NewsScreen';
import StockDetailScreen from '../screens/StockDetailScreen';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import ChartScreen from '../screens/ChartScreen';
import AlertScreen from '../screens/AlertScreen';
import NotificationScreen from '../screens/NotificationScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabIcon = ({ name, color, size = 24 }) => (
    <Icon name={name} size={size} color={color} />
);

function BottomTabs() {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.surface,
                    borderTopColor: Colors.border,
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom || 12,
                    paddingTop: responsiveHeight(1),
                },
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textMuted,
                tabBarShowLabel: true,
            }}>
            <Tab.Screen name="Home" options={{ tabBarIcon: (props) => <TabIcon name="home" {...props} /> }} component={HomeScreen} />
            <Tab.Screen name='Alert' options={{ tabBarIcon: (props) => <TabIcon name="alarm" {...props} /> }} component={AlertScreen} />
            <Tab.Screen name="Watchlist" options={{ tabBarIcon: (props) => <TabIcon name="favorite" {...props} /> }} component={WatchlistScreen} />
            <Tab.Screen name="Scanner" options={{ tabBarIcon: (props) => <TabIcon name="search" {...props} /> }} component={Scanner} />
            <Tab.Screen name="News" options={{ tabBarIcon: (props) => <TabIcon name="article" {...props} /> }} component={NewsScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Main" component={BottomTabs} />
                    <Stack.Screen name="StockDetail" component={StockDetailScreen} />
                    <Stack.Screen name="Chart" component={ChartScreen} />
                    <Stack.Screen name='Notification' component={NotificationScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}