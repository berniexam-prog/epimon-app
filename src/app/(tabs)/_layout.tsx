import { Tabs, usePathname, useRouter } from 'expo-router';
import { Platform, View } from 'react-native';
import { color } from '../../theme';
import { TabBar } from '../../ui';

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.includes('/plan')) return 1;
    if (pathname.includes('/focus')) return 2;
    if (pathname.includes('/insights')) return 3;
    return 0;
  };

  const handleTabChange = (index: number) => {
    const routes = ['/','/plan','/focus','/insights'];
    router.replace(routes[index] as any);
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: 'none',
          backgroundColor: color.night,
          borderTopColor: color.line,
          height: Platform.OS === 'ios' ? 88 : 72,
        },
      }}
      tabBar={() => (
        <View style={{ paddingBottom: Platform.OS === 'ios' ? 18 : 8 }}>
          <TabBar activeTab={getActiveTab()} onChange={handleTabChange} />
        </View>
      )}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="plan" />
      <Tabs.Screen name="focus" />
      <Tabs.Screen name="insights" />
    </Tabs>
  );
}
