import React, { Component } from 'react';
import { Redirect } from 'react-router'
import NewUser from './pages/NewUser';
import {Can} from '../../configs/Ability-context'


class SecuredNewUser extends Component {
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

            return <Redirect to='/home' />
        }
        else {
            return <Can I='create' a='user'>
                <NewUser />
            </Can>
        }

    }
}



export default SecuredNewUser