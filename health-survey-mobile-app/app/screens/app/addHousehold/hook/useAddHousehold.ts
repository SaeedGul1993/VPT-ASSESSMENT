import { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import labels from '../../../../assets/labels';
import type { AppStackParamList } from '../../../../navigation/Types';
import { useCreateHouseholdMutation } from '../../../../services/HouseholdService';
import { getErrorMessage } from '../../../../utils/apiError';
import { showError, showSuccess } from '../../../../utils/toast';

type Nav = NativeStackNavigationProp<AppStackParamList, 'AddHousehold'>;

const useAddHousehold = () => {
  const navigation = useNavigation<Nav>();
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [createHousehold, { isLoading }] = useCreateHouseholdMutation();

  const canSubmit = useMemo(
    () => code.trim().length >= 2 && address.trim().length >= 3,
    [code, address],
  );

  const submit = async () => {
    if (!canSubmit || isLoading) return;

    try {
      const response = await createHousehold({
        code: code.trim().toUpperCase(),
        address: address.trim(),
      }).unwrap();

      showSuccess(response.message);
      navigation.replace('HouseholdDetail', {
        householdId: response.data.household.id,
      });
    } catch (error) {
      showError(getErrorMessage(error, 'Could not create household'));
    }
  };

  return {
    code,
    address,
    setCode,
    setAddress,
    canSubmit,
    isSubmitting: isLoading,
    submit,
  };
};

export default useAddHousehold;
