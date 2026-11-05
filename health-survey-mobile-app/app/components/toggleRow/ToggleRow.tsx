import { memo } from 'react';
import { Switch, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import styles from './ToggleRow.style';

type Props = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

const ToggleRow = ({ label, value, onChange }: Props) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: colors.border, true: colors.secondary }}
      thumbColor={value ? colors.primary : colors.disabled}
    />
  </View>
);

export default memo(ToggleRow);
