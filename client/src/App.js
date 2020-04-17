import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import { AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute';

import MenuBar from './components/MenuBar';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import RateCourse from './pages/RateCourse';
import RateProf from './pages/RateProf';
import Search from './pages/Search';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
            <AuthRoute exact path="/login" component={Login} />
            <AuthRoute exact path="/register" component={Register} />
            <Route exact path="/search/:input" component={Search} />
            <Route exact path="/rateProf/:name" component={RateProf} />
            <Route exact path="/rateCourse/:id" component={RateCourse} />
            <Route>{NotFound}</Route>
          </Switch>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
