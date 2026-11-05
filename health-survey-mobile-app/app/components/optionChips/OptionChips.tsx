import { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './OptionChips.style';

type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  label?: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

function OptionChipsInner<T extends string>({
  label,
  options,
  value,
  onChange,
}: Props<T>) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        {options.map(option => {
          const selected = option.value === value;
          return (
            <TouchableOpacity
              key={option.value}
              activeOpacity={0.85}
              onPress={() => onChange(option.value)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text
                style={[styles.chipText, selected && styles.chipTextSelected]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const OptionChips = memo(OptionChipsInner) as typeof OptionChipsInner;

export default OptionChips;
