import { memo, type ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import labels from '../../assets/labels';
import styles from './Header.style';

type Props = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: ReactNode;
};

const Header = ({ title, subtitle, showBack = false, right }: Props) => {
  const navigation = useNavigation();

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {showBack ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={10}
            style={styles.back}
          >
            <Text style={styles.backText}>← {labels.back}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backSpacer} />
        )}
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

export default memo(Header);
