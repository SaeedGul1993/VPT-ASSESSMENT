import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import labels from '../../../assets/labels';
import Button from '../../../components/button/Button';
import Header from '../../../components/header/Header';
import Input from '../../../components/input/Input';
import Screen from '../../../components/screen/Screen';
import ToggleRow from '../../../components/toggleRow/ToggleRow';
import useAssessmentForm from './hook/useAssessmentForm';
import styles from './AssessmentFormScreen.style';

const AssessmentFormScreen = () => {
  const {
    temperature,
    systolicBp,
    diastolicBp,
    notes,
    hasFever,
    hasCough,
    hasBreathingDifficulty,
    flaggedForReview,
    setTemperature,
    setSystolicBp,
    setDiastolicBp,
    setNotes,
    setHasFever,
    setHasCough,
    setHasBreathingDifficulty,
    setFlaggedForReview,
    isSubmitting,
    submit,
  } = useAssessmentForm();

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
          <Header title={labels.assessment} showBack />

          <View style={styles.form}>
            <Input
              label={labels.temperature}
              value={temperature}
              onChangeText={setTemperature}
              placeholder="e.g. 37.5 (30–45 °C)"
              keyboardType="decimal-pad"
            />
            <View style={styles.bpRow}>
              <Input
                label={labels.systolicBp}
                value={systolicBp}
                onChangeText={setSystolicBp}
                placeholder="120"
                keyboardType="number-pad"
                containerStyle={styles.bpField}
              />
              <Input
                label={labels.diastolicBp}
                value={diastolicBp}
                onChangeText={setDiastolicBp}
                placeholder="80"
                keyboardType="number-pad"
                containerStyle={styles.bpField}
              />
            </View>

            <View style={styles.toggles}>
              <ToggleRow
                label={labels.hasFever}
                value={hasFever}
                onChange={setHasFever}
              />
              <ToggleRow
                label={labels.hasCough}
                value={hasCough}
                onChange={setHasCough}
              />
              <ToggleRow
                label={labels.hasBreathingDifficulty}
                value={hasBreathingDifficulty}
                onChange={setHasBreathingDifficulty}
              />
              <ToggleRow
                label={labels.flaggedForReview}
                value={flaggedForReview}
                onChange={setFlaggedForReview}
              />
            </View>

            <Input
              label={labels.notes}
              value={notes}
              onChangeText={setNotes}
              placeholder="Optional notes"
              multiline
              inputStyle={styles.notes}
            />

            <Button
              title={labels.saveAssessment}
              onPress={submit}
              loading={isSubmitting}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default AssessmentFormScreen;
