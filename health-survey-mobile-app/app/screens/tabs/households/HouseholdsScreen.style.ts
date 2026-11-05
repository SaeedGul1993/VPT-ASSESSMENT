import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  addLink: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  search: {
    marginBottom: 8,
  },
  loader: {
    marginTop: 40,
  },
  errorBox: {
    marginTop: 24,
    gap: 12,
  },
  listContent: {
    paddingBottom: 28,
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowBody: {
    flex: 1,
    paddingRight: 8,
  },
  code: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  address: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  chevron: {
    fontSize: 22,
    color: colors.tabInactive,
  },
});

export default styles;
