import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCardBody, MDBCardHeader, MDBCard } from 'mdbreact';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import chroma from 'chroma-js';
import Notification from '../../misc/sections/Notification';
import { Can } from '../../../configs/Ability-context'
import LoaderModal from '../../misc/sections/LoaderModal'


class SetRolesPermissions extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllPermissions')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ permissions: json.data })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getAllRoles')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ roles: json.data })
                }
            })
            .catch((error) => console.log(error))
        this.state = {
            permissions: [],
            roles: [],
            role: '',
            permission: '',
            notificationMessage: '',
            notificationShow: false
        };
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handleSelectChange = name => selectedOption => {

        this.setState({
            [name]: selectedOption
        })
    }


    handleSubmit = (e) => {

        e.preventDefault();
        if (this.state.role === '' || this.state.role === null) {
            this.setState({ role: null })
            return
        }
        else if (this.state.permission === [] || this.state.permission === null || this.state.permission === '') {
            this.setState({ permission: null })
            return
        }
        else {
            this.refs.loaderModal.setState({ modalShow: true })
            let { role, permission } = this.state
            let roleId = role.value
            let Permissions = []
            permission.forEach(Permission => {
                let permissionId = Permission.value
                Permissions.push({ role_id: roleId, permission_id: permissionId })
            })
            // console.log(Permissions);

            let rolePermissions = { Permissions: Permissions }
            var options = {
                method: 'POST',
                body: JSON.stringify(rolePermissions),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/addNewRolePermissions', options)
                .then((res) => res.json())
                .then((json) => {
                    console.log(json)
                    if (this._isMounted) {
                        this.setState({
                            role: '',
                            permission: []
                        })
                        // window.location.reload()
                    }
                })
                .catch((error) => console.log(error))
            this.refs.loaderModal.setState({ modalShow: false })
        }
    }

    render() {

        const { role, roles, permission, permissions } = this.state
        const animatedComponents = makeAnimated();
        const roleStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : role !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
                borderTop: 'none',
                borderRight: 'none',
                borderLeft: 'none',
                borderRadius: 'none',
            })
        }
        const permissionStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : permission !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
                backgroundColor: 'white',
                borderTop: 'none',
                borderRight: 'none',
                borderLeft: 'none',
                borderRadius: 'none',
            }),
            option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                const color = chroma(data.color);
                return {
                    ...styles,
                    backgroundColor: isDisabled
                        ? null
                        : isSelected
                            ? data.color
                            : isFocused
                                ? color.alpha(0.1).css()
                                : null,
                    color: isDisabled
                        ? '#ccc'
                        : isSelected
                            ? chroma.contrast(color, 'white') > 2
                                ? 'white'
                                : 'black'
                            : data.color,
                    cursor: isDisabled ? 'not-allowed' : 'default',

                    ':active': {
                        ...styles[':active'],
                        backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
                    },
                };
            },
            multiValue: (styles, { data }) => {
                const color = chroma(data.color);
                return {
                    ...styles,
                    backgroundColor: color.alpha(0.1).css(),
                };
            },
            multiValueLabel: (styles, { data }) => ({
                ...styles,
                color: data.color,
            }),
            multiValueRemove: (styles, { data }) => ({
                ...styles,
                color: data.color,
                ':hover': {
                    backgroundColor: data.color,
                    color: 'white',
                },
            }),
        }
        let roleOptions, permissionOptions

        roleOptions = roles.map(role => ({
            key: role.id,
            label: role.name,
            value: role.id,
        }));
        permissionOptions = permissions.map(permission => ({
            key: permission.id,
            label: permission.slug,
            value: permission.id,
            color: permission.id % 2 === 0 ?
                '#2BBBAD' : '#01579b'
        }));



        return (
            <Can I='set' a='rolePermission' >
                <MDBContainer className='p-0' style={{ marginTop: '80px' }}>
                    <MDBRow center>
                        <MDBCol md="7">
                            <MDBCard className='p-3'>
                                <MDBCardHeader tag="h4" style={{ color: 'teal' }} className="mb-5 text-center font-weight-bold">
                                    Set Roles' Permissions
                                </MDBCardHeader>
                                <MDBCardBody className='p-0 text-center'>

                                    <form onSubmit={this.handleSubmit} ref='setRolePermissionsForm' className='' noValidate>
                                        <MDBRow around className='m-0 p-0 grey-text'>
                                            <MDBCol sm='6' className='m-0 p-0'>
                                                <Select
                                                    styles={roleStyles}
                                                    value={role}
                                                    onChange={this.handleSelectChange('role')}
                                                    options={roleOptions}
                                                    placeholder='Role'
                                                    isSearchable
                                                    isClearable
                                                    className='form-control-lg px-0 mb-1'
                                                />
                                            </MDBCol>
                                            <MDBCol sm='4' className='m-0 p-0'>
                                                <MDBBtn className='mt-3 p-0 form-control' color="default" outline type='submit'>Submit</MDBBtn>
                                            </MDBCol>
                                        </MDBRow>
                                        <MDBRow around className='my-4 p-0 mx-0'>
                                            <MDBCol className='m-0 pl-4'>
                                                <label ref='label' style={{ fontFamily: 'monospace', color: 'teal' }}>{this.state.permission ? this.state.permission.length : 0} permissions selected</label>
                                                <Select
                                                    isMulti
                                                    styles={permissionStyles}
                                                    value={permission}
                                                    onChange={this.handleSelectChange('permission')}
                                                    options={permissionOptions}
                                                    placeholder='Permissions'
                                                    isSearchable
                                                    isClearable
                                                    className='form-control-lg px-0'
                                                    components={animatedComponents}
                                                    closeMenuOnSelect={false}
                                                />
                                            </MDBCol>
                                        </MDBRow>
                                    </form>
                                    <Can I='read' a='rolePermission'>
                                        <Link to='/rolePermissioning/all'>All Roles' Permissions...</Link>
                                    </Can>
                                </MDBCardBody>
                            </MDBCard>
                            {
                                this.state.notificationShow ?
                                    <Notification
                                        message={this.state.notificationMessage}
                                    /> : null
                            }
                        </MDBCol>
                    </MDBRow>
                    <LoaderModal
                        ref='loaderModal'
                    />
                </MDBContainer>
            </Can >
        );
    }
}


export default SetRolesPermissions