import { View, Text } from 'react-native';

const Page = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black p-4">
      <View className="max-w-md">
        <Text className="text-4xl font-bold text-center mb-4">Thanks for joining!</Text>
        <Text className="text-lg text-gray-600 dark:text-gray-300 text-center mb-8">
          We've added you to our waitlist and will notify you as soon as we're ready to welcome you
          to the app.
        </Text>
      </View>
    </View>
  );
};

export default Page;
