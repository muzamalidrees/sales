import React from 'react';
import ProductsTable from './sections/ProductsTable';
import OrderDetails from './sections/OrderDetails';
import { MDBRow } from 'mdbreact';


class NewOrder extends React.Component {
  constructor() {
    super();

    this.state = {
      showOrderDetails: false
    };
    this.addProductToTbl = this.addProductToTbl.bind(this);
    this.deleteProductFrmTbl = this.deleteProductFrmTbl.bind(this);
    this.saveOrderDetailsToDB = this.saveOrderDetailsToDB.bind(this);
    this.saveOrderToDB = this.saveOrderToDB.bind(this);
  }

  addProductToTbl = (pName, pSKU, pRate, pQTY, pPrice, pRemarks, pChecked) => {

    this.refs.productsTable.addProductToTbl(pName, pSKU, pRate, pQTY, pPrice, pRemarks, pChecked);
  }

  deleteProductFrmTbl = (price, i, pChecked) => {

    this.refs.orderDetails.minusTotalValue(price);
    if (pChecked === 'Yes') {
      this.refs.orderDetails.minusTotalValueAdded(price);
    }
    let table = document.getElementById('productsTable');
    table.deleteRow(i);
    if (table.rows.length === 1) {
      document.getElementById('pTableCard').style.display = 'none'
      this.refs.productsTable.setState({ submitOrderBtn: false })
    }
  }

  checkOrderDetailsValidity = () => {
    var orderDetailsValidity = this.refs.orderDetails.orderDetailsValidity();
    if (this.orderForm.checkValidity() === false) {
      this.orderForm.classList.add('was-validated');
      return false;
    }
    else if (!orderDetailsValidity) {
      return false;
    }
    else if (this.customerForm.checkValidity() === false) {
      this.customerForm.classList.add('was-validated');
      return false;
    }
    else {
      return true;
    }

  }

  saveOrderDetailsToDB = (pName, pSKU, pRate, pQTY, pPrice, pRemarks, pChecked) => {
    let orderDate = this.refs.orderDetails.state.orderDate
    let order_id = this.refs.orderDetails.state.order_id
    let orderDetail = {
      order_id: order_id, order_date: orderDate, pName: pName, pSKU: pSKU,
      pRate: pRate, pQTY: pQTY, pPrice: pPrice, pRemarks: pRemarks, pChecked: pChecked
    }
    let options = {
      method: 'POST',
      body: JSON.stringify(orderDetail),
      headers: { 'Content-Type': 'application/json' }
    }
    fetch('/addNewOrderDetails', options)
      .then((res) => res.json())
      .then((json) => {
        console.log(json)
      })
      .catch((error) => console.log(error))
  }

  saveOrderToDB = () => {
    this.refs.orderDetails.saveOrderToDB();
  }

  deleteRowsFromtbl = () => {
    this.refs.productsTable.deleteRowsFromtbl();
  }

  minusFromTotal = (pPrice) => {
    this.refs.orderDetails.minusTotalValue(pPrice)
  }
  addToTotal = (pPrice) => {
    this.refs.orderDetails.addTotalValue(pPrice)
  }
  minusFromTotalValueAdded = (pPrice) => {
    this.refs.orderDetails.minusTotalValueAdded(pPrice);
  }
  addToTotalValueAdded = (pPrice) => {
    this.refs.orderDetails.addTotalValueAdded(pPrice);
  }

  render() {

    return (
      <React.Fragment>
        <MDBRow style={{ marginTop: '78px' }}>
          <OrderDetails
            ref='orderDetails'
            orderForm={el => (this.orderForm = el)}
            customerForm={el => (this.customerForm = el)}
            addProductToTbl={this.addProductToTbl}
            deleteRowsFromtbl={this.deleteRowsFromtbl}
          />
        </MDBRow>
        <MDBRow className='mt-3'>
          <ProductsTable
            ref='productsTable'
            refreshOrdersTable={this.refreshOrdersTable}
            deleteProductFrmTbl={this.deleteProductFrmTbl}
            saveOrderDetailsToDB={this.saveOrderDetailsToDB}
            saveOrderToDB={this.saveOrderToDB}
            checkOrderDetailsValidity={this.checkOrderDetailsValidity}
            productsTable={el => (this.productsTable = el)}
            minusFromTotal={this.minusFromTotal}
            addToTotal={this.addToTotal}
            minusFromTotalValueAdded={this.minusFromTotalValueAdded}
            addToTotalValueAdded={this.addToTotalValueAdded}
          />
        </MDBRow>
      </React.Fragment>
    );
  }
}

export default NewOrder;