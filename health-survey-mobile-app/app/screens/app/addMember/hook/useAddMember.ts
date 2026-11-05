import { useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  genderOptions,
  relationshipOptions,
} from '../../../../constants/Survey.constants';
import type { AppStackParamList } from '../../../../navigation/Types';
import { useCreateMemberMutation } from '../../../../services/MemberService';
import type { Gender, Relationship } from '../../../../types/models';
import { getErrorMessage } from '../../../../utils/apiError';
import { showError, showSuccess } from '../../../../utils/toast';

type Route = RouteProp<AppStackParamList, 'AddMember'>;
type Nav = NativeStackNavigationProp<AppStackParamList, 'AddMember'>;

const useAddMember = () => {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const householdId = route.params.householdId;

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('MALE');
  const [relationship, setRelationship] = useState<Relationship>('HEAD');
  const [createMember, { isLoading }] = useCreateMemberMutation();

  const ageNumber = Number(age);
  const canSubmit = useMemo(
    () =>
      name.trim().length >= 2 &&
      Number.isInteger(ageNumber) &&
      ageNumber >= 0 &&
      ageNumber <= 120,
    [name, ageNumber],
  );

  const submit = async () => {
    if (!canSubmit || isLoading) return;

    try {
      const response = await createMember({
        householdId,
        body: {
          name: name.trim(),
          age: ageNumber,
          gender,
          relationship,
        },
      }).unwrap();

      showSuccess(response.message);
      navigation.goBack();
    } catch (error) {
      showError(getErrorMessage(error, 'Could not add member'));
    }
  };

  return {
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
    isSubmitting: isLoading,
    submit,
  };
};

export default useAddMember;
