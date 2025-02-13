import { Redirect, Slot, useRouter, useSegments } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

const Layout = () => {
  const { isSignedIn } = useAuth();
  const segments = useSegments();
  const inAuthGroup = segments[1] === '(authenticated)';
  const router = useRouter();

  // Protect the inside area
  if (!isSignedIn && inAuthGroup) {
    console.log('Redirecting to home');
    router.replace('/');
    // return <Redirect href="/" />;
  }

  console.log('isSignedIn simon', isSignedIn);

  return <Slot />;
};

export default Layout;
