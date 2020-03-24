import React, { Component } from 'react';
import Home from './pages/Home';
import { Redirect } from 'react-router'


class SecuredHome extends Component {
    loggedIn
    constructor() {
        super()
        this.user = localStorage.getItem('ui')

        if (this.user !== null) {
            this.loggedIn = true
        }
        else {
            this.loggedIn = false
        }
    }

    render() {
        if (this.loggedIn === false) {

            return <Redirect to='/login' />
        }
        else {
            return <Home />
        }

    }
}



export default SecuredHome