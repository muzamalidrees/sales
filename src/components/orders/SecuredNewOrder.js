import React, { Component } from 'react';
import NewOrder from './pages/NewOrder';
import { Redirect } from 'react-router'
import { Can } from '../../configs/Ability-context'


class SecuredNewOrder extends Component {
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
            return <Can I='create' a='order'>
                <NewOrder />
            </Can>
        }

    }
}



export default SecuredNewOrder