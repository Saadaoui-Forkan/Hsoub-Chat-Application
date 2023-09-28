import React from "react";
import Avatar from "../Avatar";
import { Row} from "reactstrap";

const ChatHeader = props => {

    return (
        <Row className="heading">
            <Avatar  />
            <div>جهات الإتصال</div>
            <div className="mr-auto nav-link" onClick={props.toggle}>
                <i className="fa fa-bars" />
            </div>
        </Row>
    );
};

export default ChatHeader;
