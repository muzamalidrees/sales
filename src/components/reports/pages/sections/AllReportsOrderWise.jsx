import React, { Component } from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon, MDBContainer, MDBRow, MDBCol, MDBInput } from 'mdbreact';
import { Can } from "../../../../configs/Ability-context";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';


class AllReports extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllOrders')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                let orders = json.data
                let completedOrders = orders.filter(order => order.status === 'completed')
                if (this._isMounted) {
                    this.setState({ completedOrders: completedOrders, selectedOrders: completedOrders })
                }
            })
            .catch((error) => console.log(error))
        this.state = {
            orders: [],
            selectedOrders: [],
            fromDate: new Date(),
            completedOrders: []
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }

    // handling date value and refreshing records

    handleDateChange = (value) => {
        this.setState({
            fromDate: value
        })

        let comingDate = value
        let _1day = 86400000 //miliseconds
        let date = new Date(comingDate - _1day);
        let selectedOrders = this.state.completedOrders.filter(order => new Date(order.date) > date)

        this.setState({
            selectedOrders: selectedOrders
        });

    }

    totalSales = () => {
        let Total = 0;
        this.state.selectedOrders.forEach(order => {
            Total = Total + Number(order.total)
        })
        return Total
    }

    totalValueAdded = () => {
        let Total = 0;
        this.state.selectedOrders.forEach(order => {
            Total = Total + Number(order.total_value_added)
        })
        return Total
    }

    render() {
        var { selectedOrders, fromDate } = this.state;

        var rows = [];
        var index = 0;
        if (selectedOrders !== undefined && selectedOrders !== [] && selectedOrders !== '') {
            selectedOrders.forEach((order) => {
                index = index + 1;
                let date;
                if (order.date === null) {
                    date = new Date("2019-07-09T00:00:00.000Z").toLocaleString('en-GB');
                }
                else {
                    // date = new Date(orderDetail.order_date).toLocaleDateString();
                    date = new Date(order.date).toLocaleString('en-GB');
                }
                rows.push(
                    {
                        order_id: order.order_id,
                        date: date,
                        cName: order.customer_name,
                        total: order.total,
                        total_value: order.total_value_added,
                        tracking: order.tracking_id,
                        status: order.status,
                    }
                );
            });
        }

        var data = {
            columns: [
                { label: 'Order_Id', field: 'order_id', },
                { label: 'Date', field: 'date', },
                { label: 'Customer Name', field: 'cName' },
                { label: 'Total', field: 'total', },
                { label: 'TVA', field: 'total_value', },
                { label: 'Tracking Id', field: 'tracking', },
                { label: 'Status', field: 'status', },
            ],
            rows: rows
        }


        return (
            <Can I='read' a='report'>
                <MDBCard className=' p-0'>
                    <MDBCardHeader tag="h4" style={{ color: 'teal' }} className="text-center font-weight-bold">
                        Order Reports
                            </MDBCardHeader>
                    <MDBCardBody className='p-2'>
                        <MDBRow>
                            <MDBCol>
                                <MDBInput type='text' label='Total Sales' className='font-weight-bold' value={this.totalSales()} disabled />
                            </MDBCol>
                            <MDBCol>
                                <MDBInput type='text' label='Total Value Added' className='font-weight-bold' value={this.totalValueAdded()} disabled />
                            </MDBCol>
                        </MDBRow>
                        <MDBRow className='m-0 p-0' >
                            <label>Select Date from which you want to fetch report.</label>
                            <MDBCol md='12' className='m-0 p-0' >
                                <MDBCol md='3' className='m-0 p-0'>
                                    <DatePicker
                                        id='datePicker'
                                        selected={fromDate}
                                        onChange={this.handleDateChange}
                                        className='form-control'
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        autoComplete='off'
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </MDBCol>
                            </MDBCol>
                        </MDBRow>

                        <MDBDataTable id='orderReportsTable' striped small hover theadColor="teal"
                            bordered btn entries={12} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                            data={data} theadTextWhite >
                        </MDBDataTable>


                    </MDBCardBody>
                </MDBCard>
            </Can>
        );
    }

}

export default AllReports