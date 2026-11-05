import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  label: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingRight: 12,
  },
});

export default styles;
