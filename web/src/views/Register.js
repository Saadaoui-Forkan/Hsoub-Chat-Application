import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Card, Form, Input, Button } from 'reactstrap';
import Error from '../components/Error';

export default class Register extends Component {
    state = {name: '', username: '', password: '', error: ''}

    onChange = e => this.setState({
        [e.target.name]: e.target.value, error: null
    })

    onSubmit = e => {};
  render() {
    return (
        <Card className="auth col-lg-3 col-sm-6">
        <Form onSubmit={this.onSubmit}>
            <h5 className="mb-4">إنشاء حساب جديد</h5>
            <Error error={this.state.error}/>
            <Input value={this.state.name} name="name" onChange={this.onChange} placeholder="الاسم" required autoFocus />
            <Input value={this.state.username} name="username" onChange={this.onChange} placeholder="اسم المستخدم" required />
            <Input type="password" value={this.state.password} name="password" onChange={this.onChange} placeholder="كلمة المرور" required />
            <Button color="primary" block className="mb-3"> إنشاء </Button>
            <small><Link to="/login">تسجيل الدخول</Link></small>
            <p className="m-3 text-muted">&copy; 2023</p>
        </Form>
    </Card>
    )
  }
}
