'use client'
import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallbackTitle?: string
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  reset = () => this.setState({ error: null })

  render() {
    if (this.state.error) {
      return (
        <div className="bg-canvas rounded-2xl border border-line shadow-sm p-5 mb-4">
          <p className="text-sm font-semibold text-ink mb-1">
            {this.props.fallbackTitle ?? 'This section could not be displayed'}
          </p>
          <p className="text-xs text-ink-faint mb-3">
            {this.state.error.message}
          </p>
          <button
            onClick={this.reset}
            className="text-xs text-accent hover:underline"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
