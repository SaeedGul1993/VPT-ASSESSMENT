import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

const styles = StyleSheet.create({
  panel: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  counts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
  },
  countItem: {
    flex: 1,
    alignItems: 'center',
  },
  countValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  countLabel: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textMuted,
  },
  action: {
    marginTop: 4,
  },
});

export default styles;
