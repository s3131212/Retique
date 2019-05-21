import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router'
import './App.css';
import Home from './pages/Home';
import Room from './pages/Room';
import Create from './pages/Create';
import Footer from './components/Footer';

class App extends Component {
  render() {
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/create' component={Create}/>
          <Redirect exact from='/room' to='/' />
          <Route path='/room/*' component={Room}/>
        </Switch>
        <Footer />
      </div>
    )
    return (
      <Switch>
        <App/>
      </Switch>
    );
  }
}

export default App;
