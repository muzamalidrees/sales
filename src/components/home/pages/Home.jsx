import React, { Component } from 'react';
import AllOrders from '../../orders/pages/AllOrders'
import { Can } from '../../../configs/Ability-context'


class Home extends Component {
    render() {
        return (
            // <Can I='read' a='order'>
                <AllOrders />
            // </Can>
        )
    }
}

export default Home