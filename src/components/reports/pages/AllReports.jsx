import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol } from 'mdbreact'
// import { Can } from "../../configs/Ability-context";
import AllReportsDetailWise from './sections/AllReportsDetailWise';
import AllReportsOrderWise from './sections/AllReportsOrderWise';



class Reports extends Component {
    constructor() {
        super();
        this.state = {
            date: new Date(),
        };
    }


    render() {


        return (
            <MDBContainer fluid style={{ marginTop: '80px' }}>
                <MDBRow >
                    <MDBCol md='6'>
                        <AllReportsOrderWise />
                    </MDBCol>
                    <MDBCol md='6'>
                        <AllReportsDetailWise />
                    </MDBCol>
                </MDBRow>
            </MDBContainer>

        )
    }
}


export default Reports