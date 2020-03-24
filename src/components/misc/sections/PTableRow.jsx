import React, { Component } from 'react';
import { MDBBtn, MDBIcon } from 'mdbreact'


class PTableRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pRate: props.pRate,
            pQTY: props.pQTY,
            pPrice: props.pPrice,
            pChecked: props.pChecked
        };
        this.handleBlur = this.handleBlur.bind(this);
    }

    deleteRowfn(e) {
        let el = e.target
        let row = el.closest('tr')

        let i = row.rowIndex;
        let price = row.cells[5].innerHTML;
        let pChecked = row.cells[7].innerHTML;

        this.props.deleteProductFrmTbl(price, i, pChecked);

    }

    handleBlur = name => e => {

        this.props.minusFromTotal(this.state.pPrice);
        if (this.state.pChecked) {
            this.props.minusFromTotalValueAdded(this.state.pPrice);
        }
        var a = e.target.innerHTML
        this.setState({ [name]: a })
        this.setState(state => {
            var pPrice = [state.pRate * state.pQTY]
            return { pPrice }
        }, function () {
            this.props.addToTotal(parseInt(this.state.pPrice));
            if (this.state.pChecked) {
                this.props.addToTotalValueAdded(parseInt(this.state.pPrice));
            }
        })
    }
    onKeyPress = (e) => {
        if (isNaN(String.fromCharCode(e.which))) e.preventDefault();
        if ((e.which) === 32 || (e.which) === 13) e.preventDefault();
    }

    onKeyPressExtra = (e) => {
        if ((e.which) === 89 || (e.which) === 101 || (e.which) === 115 || (e.which) === 78 || (e.which) === 111) {

        } else e.preventDefault();
    }

    handleBlurExtra = (e) => {
        if (e.target.innerHTML === 'Yes') {
            if (this.state.pChecked !== true) {
                this.setState({ pChecked: true })
                this.props.addToTotalValueAdded(parseInt(this.state.pPrice));
            }
        }
        else if (this.state.pChecked !== false) {
            this.setState({ pChecked: false })
            this.props.minusFromTotalValueAdded(this.state.pPrice);
        }
    }

    render() {
        var { pName, pSKU, pRate, pQTY, pRemarks, index, id } = this.props
        var pChecked = (this.state.pChecked) ? 'Yes' : 'No';


        return (

            <tr >
                <td>{index}</td>
                <td suppressContentEditableWarning={true} contentEditable='true'>{pName}</td>
                <td suppressContentEditableWarning={true} contentEditable='true'>{pSKU}</td>
                <td suppressContentEditableWarning={true} onKeyPress={this.onKeyPress} onBlur={this.handleBlur('pRate')} contentEditable='true'>{pRate}</td>
                <td suppressContentEditableWarning={true} onKeyPress={this.onKeyPress} onBlur={this.handleBlur('pQTY')} contentEditable='true'>{pQTY}</td>
                <td >{this.state.pPrice}</td>
                <td suppressContentEditableWarning={true} contentEditable='true'>{pRemarks}</td>
                <td suppressContentEditableWarning={true} onKeyPress={this.onKeyPressExtra} onBlur={this.handleBlurExtra} contentEditable='true'>{pChecked}</td>
                {/* "id" needed when pTable row called from edit modal */}
                <td style={{ display: 'none' }}>{id}</td>
                <td>
                    <MDBBtn style={{ fontSize: '15px' }} onClick={this.deleteRowfn.bind(this)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>

                    {/* <button onClick={this.deleteRowfn.bind(this)} type='button' className=" btn-sm btn-danger mb-1">
                        <i className="fas fa-trash"></i>
                    </button> */}
                </td>
            </tr >
        );
    }
}


export default PTableRow