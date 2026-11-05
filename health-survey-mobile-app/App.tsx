import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Routes from './app/navigation';
import { restoreSecureTokens } from './app/store/authBootstrap';
import { persistStored, store } from './app/store';
import { colors } from './app/theme/colors';

const styles = StyleSheet.create({
  root: { flex: 1 },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const PersistLoader = () => (
  <View style={styles.loader}>
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <Provider store={store}>
        <PersistGate
          loading={<PersistLoader />}
          persistor={persistStored}
          onBeforeLift={async () => {
            await restoreSecureTokens(store.dispatch, store.getState);
          }}
        >
          <SafeAreaProvider>
            <StatusBar barStyle="dark-content" />
            <Routes />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
