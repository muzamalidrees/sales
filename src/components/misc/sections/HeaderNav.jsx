import React from 'react';
import {
    MDBNavbarNav, MDBNavItem, MDBNavLink, MDBCollapse, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu, MDBIcon, MDBDropdownItem
} from "mdbreact";
import { Can } from "../../../configs/Ability-context";
import { NavLink } from 'react-router-dom'


class Header extends React.Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.handleLogOut = this.handleLogOut.bind(this);
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    handleLogOut = () => {
        this.props.loggedOut();
    }



    render() {
        return (

            <MDBCollapse id="navbarCollapse3" isOpen={this.props.collapse} navbar>
                <MDBNavbarNav right id='mainNav' className=''>
                    {this.props.loggedIn ?
                        <React.Fragment>
                            <MDBNavItem >
                                <MDBNavLink to="/home"><MDBIcon icon="home" /> Home</MDBNavLink>
                            </MDBNavItem>
                            <Can I='read' a='report'>
                                <MDBNavItem >
                                    <MDBNavLink to="/reports/all"><MDBIcon icon="chart-line" /> Reports</MDBNavLink>
                                </MDBNavItem>
                            </Can>
                            <Can I='read' a='user'>
                                <MDBNavItem>
                                    <MDBDropdown>
                                        <MDBDropdownToggle nav caret>
                                            <MDBIcon icon="users" > </MDBIcon> Users
                                        </MDBDropdownToggle>
                                        <MDBDropdownMenu className="text-white">
                                            <Can I='create' a='user'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#008066' }} to="/users/new"><MDBIcon icon="plus" /> Create new User</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='read' a='user'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#008066' }} to="/users/all"><MDBIcon icon="eye" /> View Users</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='create' a='role'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#008066' }} to="/roles/new"><MDBIcon icon="plus" /> Create new Role</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='read' a='role'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#008066' }} to="/roles/all"><MDBIcon icon="eye" /> User's Roles</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='create' a='permission'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#008066' }} to="/permissions/new"><MDBIcon icon="plus" /> Create new Permission</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='read' a='permission'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#008066' }} to="/permissions/all"><MDBIcon icon="eye" /> Roles' Permissions</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='set' a='rolePermission'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#008066' }} to="/rolePermissioning/new"><MDBIcon icon="pencil-alt" /> Role Permissioning</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                        </MDBDropdownMenu>
                                    </MDBDropdown>
                                </MDBNavItem>
                            </Can>
                        </React.Fragment> :
                        null
                    }
                </MDBNavbarNav>
                <MDBNavbarNav right id='secondNav'>
                    <MDBNavItem id='profileBtn' style={{ display: '' }}>
                        <MDBDropdown>
                            <MDBDropdownToggle nav caret>
                                <MDBIcon icon="user" className="mr-1" />
                            </MDBDropdownToggle>
                            <MDBDropdownMenu className="dropdown-default" right>
                                {this.props.loggedIn ?
                                    <MDBDropdownItem>
                                        <NavLink style={{ color: '#008066' }} onClick={this.handleLogOut} to="/login">
                                            Log Out
                                        </NavLink>
                                    </MDBDropdownItem>
                                    :
                                    <MDBDropdownItem>
                                        <MDBNavLink style={{ color: '#008066' }} to="/login">
                                            Log In
                                        </MDBNavLink>
                                    </MDBDropdownItem>
                                }
                            </MDBDropdownMenu>
                        </MDBDropdown>
                    </MDBNavItem>
                </MDBNavbarNav>
            </MDBCollapse>

        );
    }
}

export default Header