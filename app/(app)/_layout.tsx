import { Redirect, Slot, useSegments } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { RevenueCatProvider } from '@/providers/RevenueCatProvider';

const Layout = () => {
  const { isSignedIn } = useAuth();
  const segments = useSegments();
  const inAuthGroup = segments[1] === '(authenticated)';

  // Protect the inside area
  if (!isSignedIn && inAuthGroup) {
    return <Redirect href="/login" />;
  }

  return (
    <RevenueCatProvider>
      <Slot />
    </RevenueCatProvider>
  );
};

export default Layout;
