import React, { Component } from 'react';
import {
    MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBCard, MDBCardBody, MDBModalHeader,
    MDBRow, MDBCol, MDBIcon, MDBInput
} from 'mdbreact';
import Select from 'react-select';
import Notification from '../../misc/sections/Notification';



class EditUserModal extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            userId: '',
            role_id: '',
            role: '',
            name: '',
            email: '',
            cell: undefined || '',
            username: '',
            password: '',
            roles: '',
            roleOptions: [],
            message: '',
            notificationShow: false
        }
    }

    fetchData = (id) => {
        this._isMounted = true
        fetch('/getSpecificUser/' + id)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                var user = json.data
                if (this._isMounted === true) {
                    this.setState({
                        user: user,
                        userId: user.id,
                        role_id: user.role_id,
                        name: user.name,
                        email: user.email,
                        cell: user.cell,
                        username: user.username,
                        password: user.password,
                    })
                }
            })
            .catch((error) => console.log(error))
        fetch('/getAllRoles')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ roles: json.data })
                }
                this.setRoleOptions(json.data);
            })
            .catch((error) => console.log(error))
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }

    toggle = () => {
        this.setState({
            modalShow: !this.state.modalShow,

        });
    }

    setRoleOptions = (roles) => {
        let roleOptions = roles.map(role => ({ key: role.id, label: role.name, value: role.id }));
        let currentRole;
        roles.forEach(role => {
            if (role.id === this.state.user.role_id) {
                currentRole = { label: role.name, value: role.id }
            }
        });
        this.setState({
            roleOptions: roleOptions, role: currentRole,
        })
    }

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSelectChange = selectedOption => {
        this.setState({
            role: selectedOption
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let form = this.refs.updateUserForm
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else if (this.state.role === '' || this.state.role === null) {
            this.setState({ role: null })
            return
        }
        else {
            let { name, email, cell, username, password, role, userId } = this.state
            // console.log(userId, name, email, cell, username, password, role);
            let updatedUser = { id: userId, name: name, email: email, cell: cell, username: username, password: password, role: role.value }
            var options = {
                method: 'PUT',
                body: JSON.stringify(updatedUser),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/updateUser', options)
                .then((res) => res.json())
                .then((json) => {
                    // console.log(json)
                    if (this._isMounted === true) {
                        this.setState({ message: json.message, notificationShow: true })
                        setTimeout(() => this.setState({ notificationShow: false }), 1502);
                    }
                })
                .catch((error) => console.log(error))

            //closing edit modal
            this.toggle()

            // refreshing all records table
            // window.location.reload();
        }
    }



    render() {
        let { name, email, cell, username, password } = this.state
        let { role, roleOptions } = this.state
        const customStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : role !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
                borderTop: 'none',
                borderRight: 'none',
                borderLeft: 'none',
                borderRadius: 'none'
            })
        }


        return (
            <MDBContainer>
                <MDBModal isOpen={this.state.modalShow} toggle={this.toggle} size='lg' centered>
                    <MDBModalHeader toggle={this.toggle}>Edit User Details</MDBModalHeader>
                    <MDBModalBody>

                        <MDBCard className=' p-5'>
                            <MDBCardBody className='p-2'>

                                <form ref='updateUserForm' onSubmit={this.handleSubmit} noValidate>
                                    <div className="grey-text">
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={name}
                                            label="Name"
                                            name='name'
                                            icon="user"
                                            group
                                            type="text"
                                            validate
                                            error="wrong"
                                            success="right"
                                            required
                                        />
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={email}
                                            label="Email"
                                            name="email"
                                            icon="envelope"
                                            group
                                            type="email"
                                            validate
                                            error="wrong"
                                            success="right"
                                            required
                                        />
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={cell}
                                            label="Phone"
                                            name="cell"
                                            icon="phone"
                                            group
                                            type="text"
                                            validate
                                            error="wrong"
                                            success="right"
                                        />
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={username}
                                            label="Username"
                                            name="username"
                                            inputRef={el => { this.username = el }}
                                            icon="user"
                                            group
                                            type="text"
                                            validate
                                            required
                                        />
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={password}
                                            label="Password"
                                            name="password"
                                            icon="lock"
                                            group
                                            type="text"
                                            validate
                                            required>
                                        </MDBInput>
                                        <MDBRow className='mt-0 mb-2' >
                                            <MDBCol sm='1' middle className=''>
                                                <MDBIcon icon="user-tie" size='2x' />
                                            </MDBCol>
                                            <MDBCol className=''>
                                                <Select
                                                    styles={customStyles}
                                                    // defaultValue={currentRole}
                                                    value={this.state.role}
                                                    onChange={this.handleSelectChange}
                                                    options={roleOptions}
                                                    placeholder='Role'
                                                    isSearchable
                                                    isClearable
                                                    className='form-control-md pl-0'
                                                    isOptionDisabled={option => option.label === 'super_admin'}
                                                />
                                            </MDBCol>
                                        </MDBRow>
                                    </div>
                                    <div className='text-right'>
                                        <MDBBtn size='sm' className='px-2 font-weight-bold' color="secondary" onClick={this.toggle}>Close</MDBBtn>
                                        <MDBBtn size='sm' className='px-2 font-weight-bold' onClick={this.handleSubmit} outline color="primary">Save updates</MDBBtn>
                                    </div>
                                </form>
                            </MDBCardBody>
                            {
                                this.state.notificationShow ?
                                    <Notification
                                        message={this.state.message}
                                    />
                                    : null
                            }
                        </MDBCard>
                    </MDBModalBody>
                </MDBModal>
            </MDBContainer >
        );
    }
}

export default EditUserModal;