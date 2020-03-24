import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import SecuredLogin from '../auth/SecuredLogin';
import SecuredHome from '../home/SecuredHome';
import Users from '../users/Users';
import Roles from '../roles/Roles';
import Reports from '../reports/Reports';
import Orders from '../orders/Orders';
import Permissions from '../permissions/Permissions';
import RolePermissioning from '../rolePermissioning/RolePermissioning';



class Routes extends Component {
    constructor() {
        super();
        this.state = {
            date: new Date(),
        };
    }


    // componentDidMount() {
    //     this.timerID = setInterval(() => this.tick(), 1000);
    // }
    // componentWillUnmount() {
    //     clearInterval(this.timerID);
    // }
    // tick = () => {
    //     this.setState({ date: new Date() });
    // }

    render() {


        return (

            <div className="m-0 p-0 container-fluid">
                <Switch>
                    <Route exact path="/" render={() => (<SecuredLogin changeUser={this.props.changeUser} />)} />
                    <Route exact path="/login" render={() => (<SecuredLogin changeUser={this.props.changeUser} />)} />
                    <Route path="/home" component={SecuredHome} />
                    <Route path="/orders" component={Orders} />
                    <Route path="/permissions" component={Permissions} />
                    <Route path="/rolePermissioning" component={RolePermissioning} />
                    <Route path="/users" component={Users} />
                    <Route path="/roles" component={Roles} />
                    <Route path="/reports" component={Reports} />
                    <Route path='/' component={NotFound} pt='186px' pb='185px' class={'sol-sm-12'} />
                </Switch>
            </div>

        )
    }
}


export default Routes