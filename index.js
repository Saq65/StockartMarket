import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { store } from './src/store';
import { name as appName } from './app.json';

const queryClient = new QueryClient();

function Root() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => Root);