import { Component } from "react"
export default class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(e) { return { error: e } }
  render() {
    if (this.state.error) return (
      <div style={{background:"red",color:"white",padding:"40px"}}>
        <h1>Erreur capturée</h1>
        <pre>{this.state.error.message}</pre>
        <pre>{this.state.error.stack}</pre>
      </div>
    )
    return this.props.children
  }
}
