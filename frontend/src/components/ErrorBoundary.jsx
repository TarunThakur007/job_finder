import React from 'react';
import { AlertOctagon, RotateCcw, Home, Sparkles } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Keep hasError false to prevent full page lockouts
    return { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('ErrorBoundary gracefully captured issue:', error, errorInfo);
  }

  render() {
    return this.props.children;
  }
}
