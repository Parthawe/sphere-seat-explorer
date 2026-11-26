import { Component, type ReactNode } from "react";

export default class AppBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <main className="app-recovery" role="alert">
      <h1>This view couldn’t load.</h1>
      <p>Try reloading the page. If the link still fails, return to the race calendar and choose your race again.</p>
      <div><button onClick={() => location.reload()}>Reload this view</button><a href="/">Open the race calendar</a></div>
    </main>;
  }
}
