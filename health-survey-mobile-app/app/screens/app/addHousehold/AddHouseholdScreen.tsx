import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import labels from '../../../assets/labels';
import Button from '../../../components/button/Button';
import Header from '../../../components/header/Header';
import Input from '../../../components/input/Input';
import Screen from '../../../components/screen/Screen';
import useAddHousehold from './hook/useAddHousehold';
import styles from './AddHouseholdScreen.style';

const AddHouseholdScreen = () => {
  const {
    code,
    address,
    setCode,
    setAddress,
    canSubmit,
    isSubmitting,
    submit,
  } = useAddHousehold();

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <Header title={labels.addHousehold} showBack />

          <View style={styles.form}>
            <Input
              label={labels.householdCode}
              value={code}
              onChangeText={setCode}
              placeholder={labels.enterCode}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <Input
              label={labels.address}
              value={address}
              onChangeText={setAddress}
              placeholder={labels.enterAddress}
              multiline
              inputStyle={styles.addressInput}
            />
            <Button
              title={labels.saveHousehold}
              onPress={submit}
              loading={isSubmitting}
              disabled={!canSubmit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default AddHouseholdScreen;
