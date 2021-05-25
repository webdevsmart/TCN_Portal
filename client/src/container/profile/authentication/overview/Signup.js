import React, { useState } from 'react';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import { Form, Input, Button, notification } from 'antd';
import axios from 'axios';
import { AuthWrapper } from './style';
import { Checkbox } from '../../../../components/checkbox/checkbox';
import Heading from '../../../../components/heading/heading';

const SignUp = () => {
  const [state, setState] = useState({
    values: null,
    checked: null,
  });

  const handleSubmit = values => {
    const url = '/api/auth/signup';
    axios.post(url, { values })
    .then(res => {
      if (res.data.status === "success") {
        notification["success"]({
          message: 'Success',
          description:
            "Welcome signup!",
        });
      } else {
        notification["warning"]({
          message: 'Warning',
          description: 
          res.data.message,
        });
      }
    })
    .catch(err => {
      console.log(err)
    });
    setState({ ...state, values });
  };

  const onChange = checked => {
    setState({ ...state, checked });
  };

  return (
    <AuthWrapper>
      <p className="auth-notice">
        Already have an account? <NavLink to="/">Sign In</NavLink>
      </p>
      <div className="auth-contents">
        <Form name="register" onFinish={handleSubmit} layout="vertical">
          <Heading as="h3">
            Sign Up to <span className="color-secondary">Admin</span>
          </Heading>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your Full name!' }]}>
            <Input placeholder="Full name" />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
          >
            <Input placeholder="Address" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email Address"
            rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
          >
            <Input placeholder="name@example.com" />
          </Form.Item>
          <Form.Item
            name="phonenumber"
            label="Phone Number"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <div className="auth-form-action">
            <Checkbox onChange={onChange}>
              Creating an account means you’re okay with our Terms of Service and Privacy Policy
            </Checkbox>
          </div>
          <Form.Item>
            <Button className="btn-create" htmlType="submit" type="primary" size="large">
              Create Account
            </Button>
          </Form.Item>
        </Form>
      </div>
    </AuthWrapper>
  );
};

export default SignUp;
