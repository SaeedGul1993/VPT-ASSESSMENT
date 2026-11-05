import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import labels from '../../../assets/labels';
import Button from '../../../components/button/Button';
import Header from '../../../components/header/Header';
import Input from '../../../components/input/Input';
import OptionChips from '../../../components/optionChips/OptionChips';
import Screen from '../../../components/screen/Screen';
import useAddMember from './hook/useAddMember';
import styles from './AddMemberScreen.style';

const AddMemberScreen = () => {
  const {
    name,
    age,
    gender,
    relationship,
    setName,
    setAge,
    setGender,
    setRelationship,
    genderOptions,
    relationshipOptions,
    canSubmit,
    isSubmitting,
    submit,
  } = useAddMember();

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
          <Header title={labels.addMember} showBack />

          <View style={styles.form}>
            <Input
              label={labels.memberName}
              value={name}
              onChangeText={setName}
              placeholder="Member full name"
              autoCapitalize="words"
            />
            <Input
              label={labels.age}
              value={age}
              onChangeText={setAge}
              placeholder="0–120"
              keyboardType="number-pad"
            />
            <OptionChips
              label={labels.gender}
              options={genderOptions}
              value={gender}
              onChange={setGender}
            />
            <OptionChips
              label={labels.relationship}
              options={relationshipOptions}
              value={relationship}
              onChange={setRelationship}
            />
            <Button
              title={labels.saveMember}
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

export default AddMemberScreen;
