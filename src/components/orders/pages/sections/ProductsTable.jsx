import React, { Component } from 'react';
import PTableRow from '../../../misc/sections/PTableRow';
import { MDBTable, Animation, MDBTableHead, MDBTableBody, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBRow, MDBContainer } from 'mdbreact';
import LoaderModal from '../../../misc/sections/LoaderModal'

class ProductsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Rows: [],
            submitOrderBtn: false,
            index: 0
        }
        this.addProductToTbl = this.addProductToTbl.bind(this);
    }

    addProductToTbl = (pName, pSKU, pRate, pQTY, pPrice, pRemarks, pChecked, order_id) => {

        var row = [];
        let index = this.state.Rows.length + 1
        row.push(
            <PTableRow
                index={index}
                pName={pName}
                pSKU={pSKU}
                pRate={pRate}
                pQTY={pQTY}
                pPrice={pPrice}
                pRemarks={pRemarks}
                pChecked={pChecked}
                key={Math.random()}
                id={Math.random()}
                deleteProductFrmTbl={this.props.deleteProductFrmTbl}
                minusFromTotal={this.props.minusFromTotal}
                addToTotal={this.props.addToTotal}
                minusFromTotalValueAdded={this.props.minusFromTotalValueAdded}
                addToTotalValueAdded={this.props.addToTotalValueAdded}
            />
        );
        this.setState(state => {
            var Rows = [...state.Rows, row]
            return {
                Rows
            };
        });
        this.setState({ submitOrderBtn: true });
    }
    submitOrder = () => {
        // this.refs.loaderModal.setState({ modalShow: true })
        let allFormsValid = this.props.checkOrderDetailsValidity();
        // let allFormsValid = true
        if (allFormsValid) {
            let pTable = document.getElementById('productsTable');
            for (let index = 1; index < pTable.rows.length; index++) {
                const pName = pTable.rows[index].cells[1].innerHTML;
                const pSKU = pTable.rows[index].cells[2].innerHTML;
                const pRate = pTable.rows[index].cells[3].innerHTML;
                const pQTY = pTable.rows[index].cells[4].innerHTML;
                const pPrice = pTable.rows[index].cells[5].innerHTML;
                const pRemarks = pTable.rows[index].cells[6].innerHTML;
                const pChecked = pTable.rows[index].cells[7].innerHTML;
                // console.log(pName, pSKU, pRate, pQTY, pPrice, pRemarks, pChecked)
                this.props.saveOrderDetailsToDB(pName, pSKU, pRate, pQTY, pPrice, pRemarks, pChecked);
            }
            this.props.saveOrderToDB();
        }
        else {
            console.log('something wrong')
        }
        // this.refs.loaderModal.setState({ modalShow: false })
    }

    deleteRowsFromtbl = () => {
        let pTable = document.getElementById('productsTable');
        for (let index = pTable.rows.length - 1; index > 0; index--) {
            pTable.deleteRow(index);
        }
        this.setState({ submitOrderBtn: false })
        document.getElementById('pTableCard').style.display = 'none';
    }

    render() {


        return (
            <MDBContainer >
                <Animation type="slideInDown" duration="800ms" delay="1s">
                    <MDBRow center>
                        {/* <LoaderModal
                            ref='loaderModal'
                        /> */}
                        <MDBCard id='pTableCard' style={{ display: 'none' }} className=' m-0 p-0 col-9'>
                            <MDBCardHeader style={{ color: 'teal' }} tag="h4" className="text-center font-weight-bold">
                                Products to be added
                            </MDBCardHeader>
                            <MDBCardBody className='p-2'>
                                <MDBTable id='productsTable' ref={this.props.productsTable} striped responsive bordered >
                                    <caption>
                                        {this.state.submitOrderBtn ?
                                            <MDBBtn onClick={this.submitOrder} type='button' size='sm' className='p-2' >Submit</MDBBtn> :
                                            null}
                                    </caption>
                                    <MDBTableHead color='teal' textWhite >
                                        <tr>
                                            <th>Sr.</th>
                                            <th>Product</th>
                                            <th>SKU</th>
                                            <th>Rate</th>
                                            <th>QTY</th>
                                            <th>Price</th>
                                            <th>Remarks</th>
                                            <th>Extra Added?</th>
                                            <th>Action</th>
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody>
                                        {this.state.Rows}
                                    </MDBTableBody>
                                </MDBTable>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBRow>
                </Animation>
            </MDBContainer>
        );
    }

}

export default ProductsTable