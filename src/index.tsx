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
import reportWebVitals from './reportWebVitals'


// Imports:
import store from './redux/store'


// Constants:
import COLORS from './styles/colors'
import ROUTES from './routes/routes'


// Components:
import Navbar from './components/global/Navbar'
import App from './views/App'


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

  input {
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
        <Navbar />
        <Switch>
          <Route path={ ROUTES.INDEX } component={ App } />
          {/* <Route path={ ROUTES.REGISTER } component={ Register } /> */}
          {/* <Route exact path={ ROUTES._404 } component={ _404 } /> */}
          {/* <Route path={ ROUTES.WEBSITE } component={ Website } /> */}
          {/* <Route path={ ROUTES.PROFILE } component={ Profile } /> */}
        </Switch>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('jessy')
)

reportWebVitals()
