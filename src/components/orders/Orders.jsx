import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import SecuredNewOrder from './SecuredNewOrder';
import SecuredAllOrders from './SecuredAllOrders';



class Orders extends Component {
    constructor() {
        super();
        this.state = {
            date: new Date(),
        };
    }


    render() {

        return (
            <Switch>
                <Route path="/orders/new" component={SecuredNewOrder} />
                <Route path="/orders/all" component={SecuredAllOrders} />
            </Switch>

        )
    }
}


export default Orders