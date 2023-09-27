import React from "react";
import Avatar from "../Avatar";
import { Row} from "reactstrap";

const ChatHeader = props => {

    return (
        <Row className="heading">
            <Avatar  />
            <div>جهات الإتصال</div>
            
        </Row>
    );
};

export default ChatHeader;
