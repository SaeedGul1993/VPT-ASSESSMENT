import { Alert } from 'react-native';

export const showSuccess = (message?: string) => {
  if (!message) return;
  Alert.alert('Success', message);
};

export const showError = (message?: string) => {
  Alert.alert('Error', message || 'Something went wrong');
};
