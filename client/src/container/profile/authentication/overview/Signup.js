import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import { Form, Input, notification, Select } from 'antd';
import { AuthWrapper } from './style';
import { Button } from '../../../../components/buttons/buttons';
import { Checkbox } from '../../../../components/checkbox/checkbox';
import Heading from '../../../../components/heading/heading';
import { USER_ROLE } from '../../../../constants';
import Axios from 'axios';

const { Option } = Select;

const SignUp = () => {
  const [state, setState] = useState({
    values: null,
    checked: null,
    role: '',
    siteList: []
  });

  const { siteList } = state;
  // get site list
  useEffect(() => {
    Axios.get("/api/dashboard/getSiteIDs")
    .then( res => {
      if ( res.data.status === 'success' ) {
        setState({
          ...state,
          siteList: res.data.data
        }  )
      } else {
        notification['warning']({
          message: 'Warning!',
          description: 
            res.data.message
        })
      }
    })
    .catch( err => {
      notification['warning']({
        message: 'Warning!',
        description: 
          "Server Error!"
      })
    });
  }, []);

  const handleSubmit = values => {
    const url = '/api/auth/signup';
    Axios.post(url, { values })
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
    console.log(checked)
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
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please input your role!' }]}
          >
            <Select 
              style={{ height: '34px' }}
              onChange={ value => {
                setState({
                  ...state,
                  role: value
                })
              }}
            >
              {USER_ROLE.map( (item, index) => {
                return (
                  <Option value={ item } label={ item } key={ index }>{ item }</Option>
                );
              })}
            </Select>
          </Form.Item>
          {state.role === USER_ROLE[0] ? (
          <Form.Item
            label="Role"
            name="siteID"
          >
            <Select 
                mode="multiple"
                style={{ width: '100%', minHeight: '49px' }}
                maxTagCount={2}
                >
                {
                  siteList.map( (item, index) => {
                    return (
                      <Select.Option value={item} key={index}>{item}</Select.Option>
                    );
                  })
                }
              </Select>
          </Form.Item>
            ) : ''
          }
          <div className="auth-form-action">
            <Form.Item
              name="checkedPolicy"
              rules={[{ required: true, message: 'Please confirm this!' }]}
            >
              <Checkbox onChange={onChange} checked={state.checked}>
                Creating an account means you’re okay with our Terms of Service and Privacy Policy
              </Checkbox>
            </Form.Item>
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
