import { StyleSheet } from 'react-native';
import { colors } from '../../../../theme/colors';

const styles = StyleSheet.create({
  loader: {
    marginVertical: 12,
  },
  list: {
    gap: 10,
    marginTop: 4,
  },
  item: {
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  when: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  meta: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
  notes: {
    marginTop: 4,
    fontSize: 12,
    color: colors.text,
  },
  flag: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '700',
    color: colors.error,
  },
});

export default styles;
