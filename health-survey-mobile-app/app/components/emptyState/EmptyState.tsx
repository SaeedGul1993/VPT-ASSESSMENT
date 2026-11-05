import { memo } from 'react';
import { Text, View } from 'react-native';
import styles from './EmptyState.style';

type Props = {
  message: string;
};

const EmptyState = ({ message }: Props) => (
  <View style={styles.wrap}>
    <Text style={styles.text}>{message}</Text>
  </View>
);

export default memo(EmptyState);
