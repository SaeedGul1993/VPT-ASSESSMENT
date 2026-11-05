import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMuted,
  },
  field: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.inputBg,
    color: colors.text,
    fontSize: 16,
  },
  fieldError: {
    borderColor: colors.error,
  },
  helper: {
    fontSize: 12,
    color: colors.textMuted,
  },
  helperError: {
    color: colors.error,
  },
  toggle: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  toggleText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default styles;
