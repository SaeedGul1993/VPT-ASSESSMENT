import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  loader: {
    marginTop: 40,
  },
  summary: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  address: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  meta: {
    marginTop: 6,
    fontSize: 12,
    color: colors.textMuted,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  addLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  memberBlock: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  memberBody: {
    flex: 1,
    paddingRight: 8,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  memberMeta: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textMuted,
  },
  chevron: {
    fontSize: 18,
    color: colors.tabInactive,
  },
  memberActions: {
    paddingBottom: 14,
  },
  assessBtn: {
    marginBottom: 12,
  },
  assessmentsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
});

export default styles;
