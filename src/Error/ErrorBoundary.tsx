// ErrorBoundary.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("App crashed:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ marginBottom: 12 }}>Something went wrong.</Text>
          <Button title="Restart App" onPress={this.handleReset} />
        </View>
      );
    }

    return this.props.children;
  }
}
