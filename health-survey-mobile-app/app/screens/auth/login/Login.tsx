import { Text, View } from 'react-native';
import labels from '../../../assets/labels';
import Button from '../../../components/button/Button';
import Input from '../../../components/input/Input';
import Screen from '../../../components/screen/Screen';
import useAuthApi from './hook/useAuthApi';
import styles from './Login.style';

const Login = () => {
  const {
    email,
    password,
    setEmail,
    setPassword,
    canSubmit,
    isSubmitting,
    submit,
  } = useAuthApi();

  return (
    <Screen>
      <View style={styles.brand}>
        <Text style={styles.brandTitle}>
          <Text style={styles.brandAccent}>Health</Text> Survey
        </Text>
        <Text style={styles.brandSubtitle}>{labels.signInSubtitle}</Text>
      </View>

      <View style={styles.form}>
        <Input
          label={labels.email}
          value={email}
          onChangeText={setEmail}
          placeholder={labels.enterEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Input
          label={labels.password}
          value={password}
          onChangeText={setPassword}
          placeholder={labels.enterPassword}
          secureTextEntry
        />
        <Button
          title={labels.signIn}
          onPress={submit}
          loading={isSubmitting}
          disabled={!canSubmit}
          style={styles.submit}
        />
      </View>
    </Screen>
  );
};

export default Login;
