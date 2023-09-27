import React from "react";
import { withRouter } from "react-router-dom";
import Avatar from "../Avatar";
import { Row, DropdownItem, DropdownMenu, DropdownToggle, Nav, UncontrolledDropdown} from "reactstrap";
import Auth from "../../Auth";

const ChatHeader = props => {

    const logout = () => {
        Auth.logout()
        props.history.push('/')
    }

    return (
        <Row className="heading m-0">
            <Avatar src={props.contact.avatar} />
            <div className="text-right">
                <div>{props.contact ? props.contact.name : ''}</div>
           </div>
            <Nav className="mr-auto" navbar>
                <UncontrolledDropdown>
                    <DropdownToggle tag="a" className="nav-link">
                        <i className="fa fa-ellipsis-v" />
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={e => props.history.push('/password')}>تغيير كلمة المرور</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={logout}>تسجيل الخروج</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </Nav>
        </Row>
    );
};

export default withRouter(ChatHeader);