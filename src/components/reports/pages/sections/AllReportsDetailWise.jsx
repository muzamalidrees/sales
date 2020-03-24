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
                completedOrders.forEach(order => {
                    fetch('/getSpecificAllOrderDetails/' + order.order_id)
                        .then((res) => res.json())
                        .then((json) => {
                            // console.log(json);
                            json.data.forEach(data => {
                                this.setState(state => {
                                    var completedOrderDetails = [...state.completedOrderDetails, data]
                                    var selectedOrderDetails = completedOrderDetails
                                    return {
                                        completedOrderDetails, selectedOrderDetails
                                    };
                                });
                            })
                        })
                        .catch((err) => console.log(err))
                })
            })
            .catch((error) => console.log(error))
        this.state = {
            selectedOrderDetails: [],
            fromDate: new Date(),
            completedOrderDetails: []
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
        let selectedOrderDetails = this.state.completedOrderDetails.filter(orderDetail => new Date(orderDetail.order_date) > date)
        this.setState({
            selectedOrderDetails: selectedOrderDetails
        });

    }

    totalSales = () => {
        let Total = 0;
        this.state.selectedOrderDetails.forEach(orderDetail => {
            Total = Total + Number(orderDetail.product_price)
        })
        return Total
    }

    totalValueAdded = () => {
        let Total = 0;
        let details = this.state.selectedOrderDetails.filter(orderDetail => orderDetail.product_extra_added === 'Yes')
        details.forEach(detail => {
            Total = Total + Number(detail.product_price)
        })
        return Total

    }

    render() {
        var { selectedOrderDetails, fromDate } = this.state;

        var rows = [];
        var index = 0;
        if (selectedOrderDetails !== '' || selectedOrderDetails !== null || selectedOrderDetails !== undefined) {
            selectedOrderDetails.forEach((orderDetail) => {
                index = index + 1;
                let date;
                if (orderDetail.order_date === null) {
                    date = new Date("2000-07-08T00:00:00.000Z").toLocaleString('en-GB');
                }
                else {
                    // date = new Date(orderDetail.order_date).toLocaleDateString();
                    date = new Date(orderDetail.order_date).toLocaleString('en-GB');
                }
                rows.push(
                    {
                        product_name: orderDetail.product_name,
                        product_rate: orderDetail.product_rate,
                        product_qty: orderDetail.product_qty,
                        product_price: orderDetail.product_price,
                        product_remarks: orderDetail.product_remarks,
                        product_extra_added: orderDetail.product_extra_added,
                        order_date: date,
                    }
                );
            });

            var data = {
                columns: [
                    { label: 'Name', field: 'product_name' },
                    { label: 'Rate', field: 'product_rate' },
                    { label: 'QTY', field: 'product_qty' },
                    { label: 'Price', field: 'product_price' },
                    { label: 'Remarks', field: 'product_remarks' },
                    { label: 'Extra Added', field: 'product_extra_added' },
                    { label: 'Date', field: 'order_date' }
                ],
                rows: rows
            }
        }



        return (
            <Can I='read' a='report'>
                <MDBCard className=' p-0'>
                    <MDBCardHeader tag="h4" style={{ color: 'teal' }} className="text-center font-weight-bold">
                        Order-details Reports
                    </MDBCardHeader>
                    <MDBCardBody className='p-2'>
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

                        <MDBDataTable id='orderDetailReportsTable' striped small hover theadColor="teal"
                            bordered btn entries={12} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                            data={data} theadTextWhite >
                        </MDBDataTable>
                        <MDBRow>
                            <MDBCol>
                                <MDBInput type='text' label='Total Sales' value={this.totalSales()} disabled />
                            </MDBCol>
                            <MDBCol>
                                <MDBInput type='text' label='Total Value Added' value={this.totalValueAdded()} disabled />
                            </MDBCol>
                        </MDBRow>


                    </MDBCardBody>
                </MDBCard>
            </Can>
        );
    }

}

export default AllReports