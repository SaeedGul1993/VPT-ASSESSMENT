import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../../../navigation/Types';
import { useCreateAssessmentMutation } from '../../../../services/AssessmentService';
import { getErrorMessage } from '../../../../utils/apiError';
import { showError, showSuccess } from '../../../../utils/toast';

type Route = RouteProp<AppStackParamList, 'AssessmentForm'>;
type Nav = NativeStackNavigationProp<AppStackParamList, 'AssessmentForm'>;

const parseOptionalNumber = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : null;
};

const useAssessmentForm = () => {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { memberId } = route.params;

  const [temperature, setTemperature] = useState('');
  const [systolicBp, setSystolicBp] = useState('');
  const [diastolicBp, setDiastolicBp] = useState('');
  const [notes, setNotes] = useState('');
  const [hasFever, setHasFever] = useState(false);
  const [hasCough, setHasCough] = useState(false);
  const [hasBreathingDifficulty, setHasBreathingDifficulty] = useState(false);
  const [flaggedForReview, setFlaggedForReview] = useState(false);

  const [createAssessment, { isLoading }] = useCreateAssessmentMutation();

  const submit = async () => {
    if (isLoading) return;

    const tempValue = parseOptionalNumber(temperature);
    const sysValue = parseOptionalNumber(systolicBp);
    const diaValue = parseOptionalNumber(diastolicBp);

    // Backend ranges: temp 30–45°C, systolic 50–300, diastolic 30–200
    if (tempValue !== null && (tempValue < 30 || tempValue > 45)) {
      showError('Temperature must be between 30 and 45 °C');
      return;
    }
    if (sysValue !== null && (sysValue < 50 || sysValue > 300)) {
      showError('Systolic BP must be between 50 and 300');
      return;
    }
    if (diaValue !== null && (diaValue < 30 || diaValue > 200)) {
      showError('Diastolic BP must be between 30 and 200');
      return;
    }

    try {
      const response = await createAssessment({
        memberId,
        body: {
          temperature: tempValue,
          systolicBp: sysValue,
          diastolicBp: diaValue,
          notes: notes.trim() || null,
          hasFever,
          hasCough,
          hasBreathingDifficulty,
          flaggedForReview,
        },
      }).unwrap();

      showSuccess(response.message);
      navigation.goBack();
    } catch (error) {
      showError(getErrorMessage(error, 'Could not save assessment'));
    }
  };

  return {
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
    isSubmitting: isLoading,
    submit,
  };
};

export default useAssessmentForm;
