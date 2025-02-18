import { Redirect, Slot, useRouter, useSegments } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

const Layout = () => {
  const { isSignedIn } = useAuth();
  const segments = useSegments();
  const inAuthGroup = segments[1] === '(authenticated)';
  const router = useRouter();

  // Protect the inside area
  if (!isSignedIn && inAuthGroup) {
    router.replace('/');
    // return <Redirect href="/" />;
  }

  return <Slot />;
};

export default Layout;
