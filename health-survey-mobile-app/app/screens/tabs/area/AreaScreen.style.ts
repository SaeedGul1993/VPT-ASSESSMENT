import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

const styles = StyleSheet.create({
  panel: {
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  panelLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  panelValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  panelMeta: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textMuted,
  },
  stat: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  loader: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  retry: {
    marginTop: 12,
  },
  primaryAction: {
    marginTop: 8,
  },
  logout: {
    marginTop: 12,
  },
});

export default styles;
