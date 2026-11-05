import { Text, View } from 'react-native';
import styles from './PlaceholderContent.style';

type Props = {
  title: string;
  subtitle?: string;
};

const PlaceholderContent = ({
  title,
  subtitle = 'Coming soon',
}: Props) => (
  <View style={styles.wrap}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
);

export default PlaceholderContent;
