import { Component, type ReactNode } from "react";
import { BrandMark } from "./Illustrations";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error("VRADR error boundary:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="app-err">
        <BrandMark size={48} />
        <h1 className="app-err-title">Something went wrong.</h1>
        <p className="app-err-desc">
          An unexpected error interrupted this view. No data was lost.
        </p>
        <button className="btn btn-primary" onClick={() => { this.setState({ hasError: false }); }}>
          Try again
        </button>
      </div>
    );
  }
}