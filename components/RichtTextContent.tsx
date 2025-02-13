'use dom';
import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
import '@/global.css';
import { View } from 'react-native';

const RichtTextContent = ({ blockContent }: { blockContent: BlocksContent }) => {
  return (
    <View className="flex-1">
      <BlocksRenderer content={blockContent} />
    </View>
  );
};
export default RichtTextContent;
