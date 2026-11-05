import { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './Screen.style';

type Props = {
  children: ReactNode;
  padded?: boolean;
};

const Screen = ({ children, padded = true }: Props) => (
  <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
    <View style={padded ? styles.content : styles.root}>{children}</View>
  </SafeAreaView>
);

export default Screen;
