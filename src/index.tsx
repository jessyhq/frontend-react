// Packages:
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'
import Color from 'color'
import registerServiceWorker from './registerServiceWorker'
import reportWebVitals from './reportWebVitals'


// Imports:
import store from './redux/store'


// Constants:
import { COLORS } from './styles/colors'
import ROUTES from './routes/routes'


// Components:
import Uptime from './components/global/Uptime'
import Navbar from './components/global/Navbar'
import ContextMenu from './components/global/ContextMenu'
import App from './views/App'
import Footer from './components/global/Footer'


// Styles:
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: 'Barlow Condensed', source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  ::selection {
    padding: 1em;
    background-color: ${ Color(COLORS.PRIMARY).saturate(1.5).alpha(0.35).toString() };
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  input, textarea {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
  }
`


// Functions:
ReactDOM.render(
  <React.StrictMode>
    <Provider store={ store }>
      <Router>
        <GlobalStyle />
        <Uptime />
        <Navbar />
        {/* <ContextMenu /> */}
        <Switch>
          <Route path={ ROUTES.INDEX } component={ App } />
          {/* <Route path={ ROUTES.REGISTER } component={ Register } /> */}
          {/* <Route exact path={ ROUTES._404 } component={ _404 } /> */}
          {/* <Route path={ ROUTES.WEBSITE } component={ Website } /> */}
          {/* <Route path={ ROUTES.PROFILE } component={ Profile } /> */}
        </Switch>
        <Footer />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('🎈')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
registerServiceWorker()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
