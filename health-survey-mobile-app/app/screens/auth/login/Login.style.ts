import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

const styles = StyleSheet.create({
  brand: {
    marginBottom: 28,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  brandAccent: {
    color: colors.primary,
  },
  brandSubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  form: {
    gap: 16,
  },
  submit: {
    marginTop: 8,
  },
});

export default styles;
