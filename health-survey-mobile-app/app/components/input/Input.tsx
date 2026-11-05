import { memo, useState } from 'react';
import {
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import styles from './Input.style';

type Props = Omit<TextInputProps, 'style'> & {
  label?: string;
  error?: boolean;
  helperText?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

const Input = ({
  label,
  error = false,
  helperText,
  secureTextEntry,
  containerStyle,
  inputStyle,
  ...rest
}: Props) => {
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));
  const isPassword = Boolean(secureTextEntry);

  return (
    <View style={[styles.wrap, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View>
        <TextInput
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPassword ? hidden : false}
          style={[styles.field, error && styles.fieldError, inputStyle]}
          {...rest}
        />
        {isPassword ? (
          <TouchableOpacity
            onPress={() => setHidden(current => !current)}
            style={styles.toggle}
            hitSlop={8}
          >
            <Text style={styles.toggleText}>{hidden ? 'Show' : 'Hide'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {helperText ? (
        <Text style={[styles.helper, error && styles.helperError]}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

export default memo(Input);
