import { Slot, Link, usePathname } from 'expo-router';

import { Text, View } from 'react-native';

function AppHeader() {
  const pathname = usePathname();
  const activeTab = pathname.split('/')[0];

  return (
    <View className="flex-row items-center justify-between p-4 border-b border-gray-200 bg-white">
      <View className="flex-row items-center gap-8">
        <Link href="/" className="text-primary font-bold text-xl">
          <Text>My Studio</Text>
        </Link>
        <Link
          href="/courses"
          className={`text-gray-600 hover:text-primary ${
            activeTab === 'courses' ? 'text-primary' : ''
          }`}>
          <Text>Browse Courses</Text>
        </Link>
        <Link
          href="/my-content"
          className={`text-gray-600 hover:text-primary ${
            activeTab === 'my-content' ? 'text-primary' : ''
          }`}>
          <Text>My Courses</Text>
        </Link>
      </View>
      <Link
        href="/profile"
        className={`text-gray-600 hover:text-primary ${
          activeTab === 'profile' ? 'text-primary' : ''
        }`}>
        <Text>Profile</Text>
      </Link>
    </View>
  );
}

export default function Layout() {
  return (
    <View className="flex-1">
      <AppHeader />
      <Slot />
    </View>
  );
}
