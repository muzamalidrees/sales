import React from 'react';
import './App.css';
import Header from './components/misc/Header';
import Footer from './components/misc/Footer';
import Routes from "./components/misc/Routes";
import { BrowserRouter, Redirect } from 'react-router-dom';
import { AbilityContext } from "./configs/Ability-context";
import defineRulesFor from "./configs/Ability";
import { Ability } from "@casl/ability";


const ability = new Ability();

class App extends React.Component {
  _isMounted = false
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: '',
      roles: [],
      user: '',
    }
    let a = fetch('/getAllRoles')
      .then((res) => res.json())
      .then((json) => {
        // console.log(json)
        this.setState({ roles: json.data })
      })
      .catch((err => {
        console.log(err);
      }))

    let b = fetch('/isAuth')
      .then((res) => res.json())
      .then((json) => {
        // console.log(json)
        this.setState({ loggedIn: json.loggedIn, user: json.user }, function () {
          // console.log('ok');
          if (json.loggedIn === false) {
            if (localStorage.getItem('ui') || localStorage.getItem('uri')) {
              localStorage.removeItem('ui')
              localStorage.removeItem('uri')
            }
          }
        })
      })
      .catch((err => {
        // console.log(err);
      }))

    Promise.all([a, b]).then(() => {
      let { user } = this.state
      if (user !== undefined && user !== null) {
        this.changeUser(user);
      }
    })
  }
  componentWillUnmount() {
    this._isMounted = false
  }

  loggedOut = () => {

    fetch('/logout')
      .then((res) => res.json())
      .then((json) => {
        // console.log(json)
        this.setState({
          loggedIn: false
        }, function () {
          localStorage.removeItem('ui')
          localStorage.removeItem('uri')
        })
      })
      .catch((err) => console.log(err))
  }

  changeUser = (user) => {
    // console.log(user);

    let userRole;
    if (this.state.roles) {
      this.state.roles.forEach(role => {
        // console.log(role.id);
        // console.log(user.role_id);

        if (role.id === user.role_id) {
          userRole = role.name
        }
      });
    }
    // console.log(userRole);


    const rules = defineRulesFor(userRole);
    ability.update(rules);
    this.setState({ loggedIn: true })
  }


  render() {

    return (
      <BrowserRouter>
        <AbilityContext.Provider value={ability}>
          {this.state.loggedIn === false ? <Redirect to='/login' /> : null}
          <div>
            <Header
              loggedIn={this.state.loggedIn}
              loggedOut={this.loggedOut}
            />
            <Routes
              changeUser={this.changeUser}
            />
            {/* <Footer /> */}

          </div >
        </AbilityContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
