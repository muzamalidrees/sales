import React from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon, MDBNavLink } from 'mdbreact';
// import { Link } from 'react-router-dom'
import ViewOrderModal from './sections/ViewOrderModal';
import EditOrderModal from './sections/EditOrderModal';
import DeleteModal from '../../misc/sections/DeleteModal';
import { Can } from '../../../configs/Ability-context'


class AllOrders extends React.Component {
  _isMounted = false
  constructor() {
    super();
    this._isMounted = true
    fetch('/getAllOrders',
    )
      .then((res) => res.json())
      .then((json) => {
        // console.log(json)
        if (this._isMounted) {
          this.setState({ orders: json.data })
        }
      })
      .catch((error) => console.log(error))
    this.state = {
      orders: [],
      rowToBeDeleted: '',
      dRowValue: '',
      dOrder_id: '',
    }
  }

  componentWillUnmount = () => {
    this._isMounted = false
  }

  handleView = (id, order_id) => e => {
    // let el = e.target
    // let row = el.closest('tr')
    this.refs.viewOrderModal.setState({
      modalShow: true
    })
    this.refs.viewOrderModal.fetchData(id, order_id);
  }

  handleEdit = (id, order_id) => e => {
    // let el = e.target
    // let row = el.closest('tr')
    this.refs.editOrderModal.setState({
      modalShow: true
    })
    this.refs.editOrderModal.fetchData(id, order_id);
  }

  handleDelete = (id, order_id) => e => {
    let el = e.target
    let row = el.closest('tr')
    var i = row.rowIndex;
    this.setState({
      rowToBeDeleted: i,
      dRowValue: id,
      dOrder_id: order_id,
    })
    this.refs.deleteModal.setState({
      modalShow: true,
    })
  }

  deleteOrder = () => {
    let rowToBeDeleted = this.state.rowToBeDeleted
    let dRowValue = this.state.dRowValue
    document.getElementById('ordersTable').deleteRow(rowToBeDeleted)
    let orderDetail = { orderId: this.state.dOrder_id }
    let order = { value: dRowValue }

    var options = {
      method: 'DELETE',
      body: JSON.stringify(order),
      headers: { 'Content-Type': 'application/json' }
    }
    var options2 = {
      method: 'DELETE',
      body: JSON.stringify(orderDetail),
      headers: { 'Content-Type': 'application/json' }
    }


    fetch('/deleteOrder', options)
      .then((res) => res.json())
      .then((json) => {
        // console.log(json)
      })
      .catch((error) => console.log(error))

    fetch('/deleteOrderDetails', options2)
      .then((res) => res.json())
      .then((json) => {
        // console.log(json)
      })
      .catch((error) => console.log(error))
  }



  render() {
    var { orders } = this.state;
    var rows = [];
    var index = 0;
    if (orders !== null && orders !== '' && orders !== undefined) {

      orders.forEach((order) => {

        index = index + 1;
        let orderDate;
        if (order.date === null) {
          orderDate = '';
        }
        else {
          orderDate = new Date(order.date).toLocaleDateString();
        }
        rows.push(
          {
            index: index,
            order_id: order.order_id,
            date: orderDate,
            cName: order.customer_name,
            cContact: order.customer_contact,
            cAddress: order.customer_address,
            total: order.total,
            tracking: order.tracking_id,
            note: order.note,
            status: order.status,
            buttons: <React.Fragment>
              <Can I='read' a='order'>
                <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleView(order.id, order.order_id)} className='m-1 py-1 px-2' outline color='info' size="sm"><MDBIcon icon="eye" /></MDBBtn>
              </Can>
              <Can I='update' a='order'>
                <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleEdit(order.id, order.order_id)} className='m-1 py-1 px-2' outline color='teal' size="sm"><MDBIcon icon="pencil-alt" /></MDBBtn>
              </Can>
              <Can I='delete' a='order'>
                <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleDelete(order.id, order.order_id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
              </Can>
            </React.Fragment>
          }
        );
      });

    }
    var data = {
      columns: [
        { label: '#', field: 'index', }, { label: 'Order_Id', field: 'order_id', }, { label: 'Date', field: 'date', },
        { label: 'Customer Name', field: 'cName' }, { label: 'Customer Contact', field: 'cContact', },
        { label: 'Customer Address', field: 'cAddress', }, { label: 'Total', field: 'total', },
        { label: 'Tracking Id', field: 'tracking', }, { label: 'Note', field: 'note', },
        { label: 'Status', field: 'status', }, { label: 'Action', field: 'buttons' }
      ],
      rows: rows
    }


    return (

      <MDBCard className=' p-0' style={{ marginTop: '70px' }}>
        <MDBCardHeader tag="h4" style={{ color: 'teal' }} className="text-center font-weight-bold">
          Orders
        </MDBCardHeader>
        <MDBCardBody className='p-2'>
          <Can I='create' a='order'>
            <MDBBtn size='sm' className='m-0 p-0 font-weight-bold' color='info ' >
              <MDBNavLink to='/orders/new' className='m-0' style={{ fontSize: '16px', color: 'white' }}>
                Add New Order
              </MDBNavLink>
            </MDBBtn>
          </Can>
          <MDBDataTable id='ordersTable' striped small hover theadColor="teal"
            bordered btn entries={15} entriesOptions={[10, 20, 35, 55, 70, 100, 135]} responsive
            data={data} theadTextWhite >
          </MDBDataTable>
          <ViewOrderModal
            ref='viewOrderModal'
          />
          <EditOrderModal
            ref='editOrderModal'
          />
          <DeleteModal
            ref='deleteModal'
            deleteEntry={this.deleteOrder}
          />
        </MDBCardBody>
      </MDBCard>
    );
  }


}

export default AllOrders;