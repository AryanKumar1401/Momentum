import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#007AFF',
                headerStyle: {
                    backgroundColor: '#4169E1',
                },
                headerShadowVisible: false,
                headerTintColor: '#fff',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                },
            }}
        >
            <Tabs.Screen name='index' options={{
                title: "Home",
                tabBarIcon: ({ color, focused }) => <Ionicons name={
                    focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />,
            }} />
            <Tabs.Screen name="reflection" options={{
                title: 'Reflection', tabBarIcon: ({ color, focused }) => <Ionicons name={
                    focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />,
            }} />
        </Tabs>
    )
}