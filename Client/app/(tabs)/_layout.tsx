import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarActiveTintColor: '#000',
      tabBarInactiveTintColor: '#ccc',
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopColor: '#ccc',
        borderTopWidth: 1,
      },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="splitpay" options={{ title: 'SplitPay' }} />
      <Tabs.Screen name="transaction" options={{ title: 'Transaction' }} />
      <Tabs.Screen name="retire" options={{ title: 'Retire' }} />
      <Tabs.Screen name="me" options={{ title: 'Me' }} />
      
    </Tabs>
  );
}
