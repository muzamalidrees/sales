import React, { Component } from 'react';
import { MDBInput, MDBBtn, MDBRow, MDBCol, MDBContainer } from 'mdbreact';
import Select from 'react-select';
import CreateableSelect from '../../../misc/sections/CreatableAdvancedSelect';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const sourceOptions = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'whatsapp1', label: 'WhatsApp 1' },
    { value: 'whatsapp2', label: 'WhatsApp 2' },
    { value: 'phone1', label: 'Phone 1' },
    { value: 'phone2', label: 'Phone 2' },
    { value: 'website', label: 'Website' },
    { value: 'imo', label: 'Imo' },
];


class OrderDetails extends Component {
    constructor(props) {
        super(props);
        this.orderId = '';
        this.state = {
            orderTotal: 0,
            totalValueAdded: 0,
            order_id: '',
            orderDate: '',
            orderSource: '',
            orderStatus: '',
            orderTracking: '',
            orderNote: '',
            cName: '',
            cContact: '',
            cAddress: '',
            pName: '',
            pSKU: '',
            pRate: '',
            pQTY: '',
            pRemarks: '',
            orderId: 1,
        }
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleAddProduct = this.handleAddProduct.bind(this);
        this.setOrderFormsEmpty = this.setOrderFormsEmpty.bind(this);
        this.orderStatus = this.orderStatus.bind(this)
        this.orderDetailsValidity = this.orderDetailsValidity.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    minusTotalValue = (value) => {
        this.setState({
            orderTotal: this.state.orderTotal - parseInt(value)
        })
    }
    minusTotalValueAdded = (value) => {
        this.setState({
            totalValueAdded: this.state.totalValueAdded - parseInt(value)
        })
    }

    addTotalValue = (value) => {
        this.setState({
            orderTotal: this.state.orderTotal + parseInt(value)
        })
    }
    addTotalValueAdded = (value) => {
        this.setState({
            totalValueAdded: this.state.totalValueAdded + parseInt(value)
        })
    }

    // componentDidMount() {
    //     this.fetchOrderId();
    // }

    // fetchOrderId = () => {
    //     let currentComponent = this;
    //     fetch('/getLastOrderID')
    //         .then((res) => res.json())
    //         .then(function (json) {
    //             // console.log(json)
    //             if (json.data.length !== 0) {
    //                 var lastOrderID = json.data.shift();
    //                 let id = lastOrderID.id;
    //                 currentComponent.setState({ orderId: id + 1, showOrderDetails: true })
    //             }
    //             else {
    //                 currentComponent.setState({ orderId: 1, showOrderDetails: true })
    //             }
    //         })
    //         .catch((error) => console.log(error));
    // }

    handleDateChange = (value) => {
        this.setState({
            orderDate: value
        });
    }

    handleSelectChange = selectedOption => {
        this.setState({
            orderSource: selectedOption
        })
    }

    orderStatus = (newValue) => {
        this.setState({
            orderStatus: newValue
        })
    }

    onKeyPress = (e) => {
        if ((e.which) === 101 || (e.which) === 45) e.preventDefault();
    }

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleAddProduct = (e) => {
        e.preventDefault();
        let form = this.refs.productForm;
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else {
            document.getElementById('pTableCard').style.display = '';
            let { pName, pSKU, pRate, pQTY, pRemarks, order_id } = this.state
            let pPrice = this.pPrice.value;
            let pChecked = (this.checkbox.checked) ? true : false
            // console.log(pName, pSKU, pRate, pQTY, pPrice, pRemarks, pChecked);
            this.props.addProductToTbl(pName, pSKU, pRate, pQTY, pPrice, pRemarks, pChecked);
            this.addTotalValue(pPrice)
            if (pChecked) {
                this.addTotalValueAdded(pPrice)
            }
            this.setState({
                pName: '',
                pSKU: '',
                pRate: '',
                pQTY: '',
                pRemarks: ''
            })
            this.checkbox.checked = false;
        }
    }

    orderDetailsValidity = () => {
        if (this.state.orderSource === '' || this.state.orderSource === null) {
            this.setState({
                orderSource: null
            })
            return false;
        }
        else if (this.state.orderStatus === '' || this.state.orderStatus === null) {
            this.refs.createableSelect.setState({ value: null })
            return false;
        }
        else {
            return true;
        }
    }

    saveOrderToDB = () => {
        let {
            order_id, orderDate, orderSource, orderStatus, orderTracking, orderNote,
            orderTotal, totalValueAdded, cName, cContact, cAddress
        } = this.state
        let newOrder = {
            order_id: order_id, date: orderDate, source: orderSource.value, status: orderStatus.value,
            tracking: orderTracking, note: orderNote, total: orderTotal, totalAddedValue: totalValueAdded,
            cName: cName, cContact: cContact, cAddress: cAddress
        }
        // console.log(
        //     'order_id', order_id, 'date', date, 'source', source, 'status', status, 'tracking', tracking,
        //     'note', note, 'total', total, 'totalAddedValue', totalAddedValue,
        //     'cName', cName, 'cContact', cContact, 'cAddress', cAddress
        // );
        var options = {
            method: 'POST',
            body: JSON.stringify(newOrder),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/addNewOrder', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (json.success === true) {
                    this.setOrderFormsEmpty();
                }
                else {
                    alert(json.message)
                }
            })
            .catch((error) => console.log(error))
    }

    setOrderFormsEmpty = () => {
        this.setState({
            order_id: '',
            orderDate: '',
            orderId: '',
            cName: '',
            cContact: '',
            cAddress: '',
            orderSource: '',
            orderStatus: '',
            orderTracking: '',
            orderNote: '',
            orderTotal: 0,
            totalValueAdded: 0,
        })
        this.props.deleteRowsFromtbl();
        this.refs.createableSelect.setState({ value: '' })
    }




    render() {

        const {
            order_id, orderSource, orderDate, orderTracking, orderNote, cName, cContact, cAddress,
            pName, pSKU, pRate, pQTY, pRemarks
        } = this.state
        const { orderForm, customerForm } = this.props

        const customStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : orderSource !== null ?
                        '#ddd' : 'red',
                width: '207px',
                // float: 'left'
            })
        }
        return (
            <MDBContainer >
                <MDBRow center>
                    <MDBCol md="9" className='m-0 p-0'>
                        <p style={{ color: 'teal' }} className="h4 text-center mb-2">Order Details</p>

                        <form className='m-0 p-0' ref={orderForm} noValidate>
                            <fieldset className='legend-border'>
                                <legend className='legend-border'>Order:</legend>
                                <MDBRow className='m-0 p-0'>
                                    <MDBCol size='5' className='m-0' >
                                        <MDBRow >
                                            <MDBCol lg='4' className=' m-0' middle >
                                                <MDBInput
                                                    name='order_id'
                                                    onInput={this.handleInput}
                                                    className='m-0'
                                                    value={order_id}
                                                    label='Id'
                                                    outline
                                                    required
                                                    validate
                                                />
                                            </MDBCol>
                                            <MDBCol lg='8' className='' middle >
                                                <DatePicker
                                                    id='datePicker'
                                                    selected={orderDate}
                                                    placeholderText='Date'
                                                    onChange={this.handleDateChange}
                                                    className='form-control'
                                                    peekNextMonth
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    dateFormat="dd/MM/yy"
                                                    autoComplete='off'
                                                    required
                                                />
                                            </MDBCol>
                                        </MDBRow>
                                    </MDBCol>
                                    <MDBCol size='7' className='m-0' middle >
                                        <MDBRow >
                                            <MDBCol lg='6' className=''  >
                                                <React.Fragment>
                                                    <Select
                                                        styles={customStyles}
                                                        value={orderSource}
                                                        onChange={this.handleSelectChange}
                                                        options={sourceOptions}
                                                        placeholder='Source'
                                                        isSearchable
                                                        isClearable
                                                    />
                                                </React.Fragment>
                                            </MDBCol>
                                            <MDBCol lg='6' className=''   >
                                                <React.Fragment>
                                                    <CreateableSelect
                                                        ref='createableSelect'
                                                        orderStatus={this.orderStatus}
                                                    />
                                                </React.Fragment>
                                            </MDBCol>
                                        </MDBRow>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow className='m-0 p-0' >
                                    <MDBCol sm='4' className='m-0 '>
                                        <MDBInput
                                            label="Tracking Id"
                                            name="orderTracking"
                                            onInput={this.handleInput}
                                            value={orderTracking}
                                            outline
                                            className='my-0'
                                            style={{ marginRight: '4px' }}
                                        />
                                    </MDBCol>
                                    <MDBCol sm='8' className='m-0 '>
                                        <MDBInput
                                            type='textarea'
                                            rows='1'
                                            label="Note"
                                            name="orderNote"
                                            onInput={this.handleInput}
                                            value={orderNote}
                                            outline
                                            className='my-0'
                                            style={{ marginRight: '4px' }}
                                        />
                                    </MDBCol>
                                </MDBRow>
                            </fieldset>
                        </form>

                        <form className='m-0 p-0' ref={customerForm} >
                            <fieldset className='legend-border'>
                                <legend className='legend-border'>Customer:</legend>
                                <MDBRow className='m-0 p-0'>
                                    <MDBCol sm='4' className='m-0'>
                                        <MDBInput
                                            value={cName}
                                            className='my-0'
                                            style={{ marginRight: '4px' }}
                                            label="Name"
                                            name="cName"
                                            onInput={this.handleInput}
                                            required
                                            validate
                                            outline />
                                    </MDBCol>
                                    <MDBCol sm='4' className='m-0'>
                                        <MDBInput
                                            value={cContact}
                                            className='my-0'
                                            style={{ marginRight: '4px' }}
                                            label="Contact"
                                            name="cContact"
                                            onInput={this.handleInput}
                                            required
                                            validate
                                            outline />
                                    </MDBCol>
                                    <MDBCol sm='4' className='m-0'>
                                        <MDBInput
                                            value={cAddress}
                                            className='my-0'
                                            type='textarea'
                                            rows='1'
                                            style={{ marginRight: '4px' }}
                                            label="Address"
                                            name="cAddress"
                                            onInput={this.handleInput}
                                            required
                                            validate
                                            outline />
                                    </MDBCol>

                                </MDBRow>
                            </fieldset>
                        </form>

                        <form className='m-0 p-0' ref='productForm' onSubmit={this.handleAddProduct} noValidate>
                            <fieldset className='legend-border'>
                                <legend className='legend-border'>Product:</legend>
                                <MDBRow className='m-0 p-0'>
                                    <MDBCol sm='4' className='m-0'>
                                        <MDBInput
                                            value={pName}
                                            type='text'
                                            label="Name"
                                            name="pName"
                                            onInput={this.handleInput}
                                            required
                                            validate
                                            outline
                                            className='my-0'
                                            style={{ marginRight: '4px' }}
                                        />
                                    </MDBCol>
                                    <MDBCol sm='4' className='m-0'>
                                        <MDBInput
                                            value={pSKU}
                                            type='text'
                                            label="SKU"
                                            name="pSKU"
                                            onInput={this.handleInput}
                                            outline
                                            className='my-0'
                                            style={{ marginRight: '4px' }}
                                        />
                                    </MDBCol>
                                    <MDBCol sm='4' className='m-0'>
                                        <MDBInput
                                            value={pRate}
                                            type='number'
                                            label="Rate"
                                            name="pRate"
                                            onKeyPress={this.onKeyPress}
                                            onInput={this.handleInput}
                                            required
                                            validate
                                            outline
                                            min='0'
                                            className='my-0'
                                            style={{ marginRight: '4px' }}
                                        />
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow className='m-0 p-0'>
                                    <MDBCol sm='4' className='m-0'>
                                        <MDBInput
                                            value={pQTY}
                                            type='number'
                                            label="Qty"
                                            name="pQTY"
                                            onKeyPress={this.onKeyPress}
                                            onInput={this.handleInput}
                                            required
                                            validate
                                            outline
                                            className='my-0'
                                            style={{ marginRight: '4px' }}
                                        />
                                    </MDBCol>
                                    <MDBCol sm='4' className='m-0'>
                                        <MDBInput
                                            value={pRate * pQTY}
                                            type='number'
                                            label='Price'
                                            hint="Price"
                                            inputRef={e => { this.pPrice = e }}
                                            disabled
                                            outline
                                            className='my-0'
                                            style={{ marginRight: '4px' }}
                                        />
                                    </MDBCol>
                                    <MDBCol sm='4' className='m-0'>
                                        <MDBInput
                                            value={pRemarks}
                                            type='textarea'
                                            rows='1'
                                            label="Remarks"
                                            name="pRemarks"
                                            onInput={this.handleInput}
                                            outline
                                            className='my-0'
                                            style={{ marginRight: '4px' }}
                                        />
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow className='m-0 p-0' end>
                                    <MDBCol sm='4' className='m-0'>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" ref={e => { this.checkbox = e }} />
                                            <label className="form-check-label" >
                                                Is extra added?
                                    </label>
                                        </div>
                                    </MDBCol>
                                    <MDBCol sm='4' className='m-0' >
                                        <MDBBtn
                                            type='submit'
                                            size='sm'
                                            className='mx-auto'
                                            style={{ fontWeight: 'bold', fontSize: '11px' }}
                                            outline
                                        >
                                            Add Product
                                        </MDBBtn>
                                    </MDBCol>
                                </MDBRow>
                            </fieldset>
                        </form>

                        <MDBRow end className='m-0 p-0' >
                            <MDBCol sm='4' className='m-0'>
                                <MDBInput
                                    value={this.state.orderTotal}
                                    label="Total"
                                    hint="Total"
                                    disabled
                                    className='m-0'
                                    style={{ fontWeight: 'bold' }}
                                />
                            </MDBCol>
                            <MDBCol sm='4' className='m-0'>
                                <MDBInput
                                    value={this.state.totalValueAdded}
                                    className='m-0'
                                    style={{ fontWeight: 'bold' }}
                                    label="Total value added"
                                    hint="Total value added"
                                    disabled
                                />
                            </MDBCol>
                        </MDBRow>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>

        );
    }

}

export default OrderDetails