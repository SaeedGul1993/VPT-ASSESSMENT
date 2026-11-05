import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    paddingTop: 8,
    paddingBottom: 10,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.tabInactive,
  },
  labelActive: {
    color: colors.primary,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.tabInactive,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
});

export default styles;
