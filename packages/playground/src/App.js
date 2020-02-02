import React, { useCallback, useEffect, useRef, useState } from 'react';
import SDK from '@js-sdk/library/devTmp/js-sdk.esm.js';
import { Layout, Menu, Icon, Button, Row, Col } from 'antd';

import './App.scss';

const { Header, Sider, Content } = Layout;
const sdk = new SDK({
  authKey: 'some-auth-key',
});

const fieldStyle = {
  width: '100%',
  height: '22px',
  fontSize: '14px',
  lineHeight: '22px',
  fontWeight: 'italic',
  fontFamily: 'sans-serif',
  padding: '0',
};

function App() {
  const userNameNode = useRef();
  const lastNameNode = useRef();
  const emailNode = useRef();
  const cardNode = useRef();
  const form = useRef();
  const [formStatus, setFormStatus] = useState(null);

  useEffect(() => {
    const userName = sdk.createField('textInput', {
      name: 'user.name',
      style: fieldStyle,
    });
    const lastName = sdk.createField('textInput', {
      name: 'user.lastName',
      style: fieldStyle,
    });
    const email = sdk.createField('textInput', {
      name: 'user.email',
      style: fieldStyle,
    });
    const card = sdk.createField('cardNumber', {
      name: 'user.cardNumber',
      style: fieldStyle,
    });

    userName.on('status', (userNameStatus) => {
      console.log('[UserName] field status:', userNameStatus);
    });

    userName.appendTo(userNameNode.current);
    lastName.appendTo(lastNameNode.current);
    email.appendTo(emailNode.current);
    card.appendTo(cardNode.current);

    // FIXME - think about appendTo call method outside of form controller
    const resultForm = sdk.createForm({
      fields: [userName, lastName, email, card],
    });
    resultForm.on('status', (nextFormStatus) => {
      setFormStatus(nextFormStatus);
    });

    form.current = resultForm;

    return () => {
      resultForm.destroy();
    };
  }, []);

  const handleSubmitClick = useCallback((e) => {
    e.preventDefault();

    form.current.submit();
  }, []);

  return (
    <Layout>
      <Sider trigger={null} collapsible>
        <div className="logo">
          JS SDK Playground
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Icon type="user" />
            <span>Simple example</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: '#fff',
            minHeight: 280,
          }}
        >
          <Row className="row">
            <Col span={12}>
              <label>User name</label>
              <div className="ant-input" ref={userNameNode} />
            </Col>
          </Row>
          <Row className="row">
            <Col span={12}>
              <label>Last name</label>
              <div className="ant-input" ref={lastNameNode} />
            </Col>
          </Row>
          <Row className="row">
            <Col span={12}>
              <label>Email</label>
              <div className="ant-input" ref={emailNode} />
            </Col>
          </Row>
          <Row className="row">
            <Col span={12}>
              <label>Card number</label>
              <div className="ant-input" ref={cardNode} />
            </Col>
          </Row>
          <Row className="row">
            <Col span={12}>
              <Button
                type="primary"
                disabled={formStatus !== sdk.FORM_STATUSES.READY}
                loading={formStatus !== sdk.FORM_STATUSES.READY ? { delay: 150 } : false}
                onClick={handleSubmitClick}>
                Send
              </Button>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
