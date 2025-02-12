import { View, Text, Button } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
const Page = () => {
  const { signOut } = useAuth();
  return (
    <View>
      <Text>Profile</Text>
      <Button title="Sign Out" onPress={() => signOut()} />
    </View>
  );
};
export default Page;
