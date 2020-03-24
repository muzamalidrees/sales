import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import SecuredAllReports from './SecuredAllReports';



class Reports extends Component {
    constructor() {
        super();
        this.state = {
            date: new Date(),
        };
    }


    render() {


        return (

            <Switch>
                <Route path="/reports/all" component={SecuredAllReports} />
            </Switch>

        )
    }
}


export default Reports