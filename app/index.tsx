import { Text, View, Pressable, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useSSO, useUser } from '@clerk/clerk-expo';
import { useStrapi } from '@/providers/StrapiProvider';
import { randomUUID } from 'expo-crypto';
export default function Index() {
  const [loading, setLoading] = useState(false);
  const { startSSOFlow } = useSSO();
  const { createUser } = useStrapi();

  const handleSignInWithSSO = async (strategy: 'oauth_google' | 'oauth_apple') => {
    console.log('Sign in with Apple');

    try {
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy,
      });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId });

        const email = signUp?.emailAddress;
        const username = signUp?.emailAddress;
        const password = randomUUID();
        const id = signUp?.createdUserId;

        if (!email || !username || !password || !id) {
          throw new Error('Missing required fields');
        }

        const strapiUser = {
          email,
          username,
          password,
          clerkId: id,
        };

        await createUser(strapiUser);
      } else {
        console.log('No createdSessionId');

        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.log(err);
    }
  };

  return (
    <View className="flex-1 bg-[#132134] justify-center">
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <View className="w-full items-center gap-8 max-w-md mx-auto">
          <Image
            source={require('@/assets/images/intro.png')}
            className="w-full web:hidden h-96 md:h-9 aspect-auto object-fit"
          />
          <Text className="text-3xl font-bold text-white mb-2">Your journey starts here</Text>

          <View className="w-full gap-4 px-4">
            <Pressable
              className="w-full flex-row justify-center items-center bg-white py-3 rounded-lg hover:cursor-pointer hover:bg-gray-800 duration-300"
              onPress={() => handleSignInWithSSO('oauth_apple')}>
              <Ionicons name="logo-apple" size={24} color="black" className="mr-2" />
              <Text className="text-black text-center font-semibold ml-2">Continue with Apple</Text>
            </Pressable>

            <Pressable
              className="w-full flex-row justify-center items-center bg-white py-3 rounded-lg hover:cursor-pointer hover:bg-gray-800 duration-300"
              onPress={() => handleSignInWithSSO('oauth_google')}>
              <Ionicons name="logo-google" size={24} color="black" className="mr-2" />
              <Text className="text-black text-center font-semibold ml-2">
                Continue with Google
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
