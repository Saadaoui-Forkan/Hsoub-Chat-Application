import React from "react";
import Avatar from "../Avatar";
import moment from 'moment';

const Contact = props => (
   <div className="contact">
       <div>
           <Avatar src={props.contact.avatar} />
       </div>
       <div className="w-50">
           <div className="name">{props.contact.name}</div>
           <div className="small last-message">
               {props.message ? props.message.content : 'انقر هنا لبدء المحادثة' }
           </div>
       </div>
       <div className="flex-grow-1 text-left">
           <div className="small text-muted">
               {props.message ? moment(props.message.date).format("hh:mm a") : ''}
           </div>
       </div>
   </div>
);

export default Contact;
