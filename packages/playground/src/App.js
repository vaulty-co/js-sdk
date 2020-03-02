import React, { useCallback, useEffect, useRef, useState } from 'react';
import SDK from '@js-sdk/library/devTmp/js-sdk.esm.js';
import { Layout, Menu, Icon, Button, Row, Col } from 'antd';

import './App.scss';
import { Field } from './components/Field';

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
  const form = useRef(null);
  const userName = useRef(null);
  const lastName = useRef(null);
  const email = useRef(null);
  const cardNumber = useRef(null);
  const cardVerificationCode = useRef(null);
  const cardExpirationDate = useRef(null);
  const [appStatus, setAppStatus] = useState('preparing');
  const [formStatus, setFormStatus] = useState(null);

  useEffect(() => {
    userName.current = sdk.createField('textInput', {
      name: 'user.name',
      style: fieldStyle,
      validators: [
        SDK.VALIDATORS.REQUIRED,
      ],
    });
    lastName.current = sdk.createField('textInput', {
      name: 'user.lastName',
      style: fieldStyle,
    });
    email.current = sdk.createField('textInput', {
      name: 'user.email',
      style: fieldStyle,
      validators: [
        SDK.VALIDATORS.REQUIRED,
      ],
    });
    cardNumber.current = sdk.createField('cardNumber', {
      name: 'card.number',
      style: fieldStyle,
      validators: [
        SDK.VALIDATORS.REQUIRED,
        SDK.VALIDATORS.CARD_NUMBER,
      ],
    });
    cardVerificationCode.current = sdk.createField('cardVerificationCode', {
      name: 'card.cvc',
      style: fieldStyle,
      validators: [
        SDK.VALIDATORS.REQUIRED,
        SDK.VALIDATORS.CARD_VERIFICATION_CODE,
      ],
    });
    cardExpirationDate.current = sdk.createField('cardExpirationDate', {
      name: 'card.expirationDate',
      style: fieldStyle,
      validators: [
        SDK.VALIDATORS.REQUIRED,
        SDK.VALIDATORS.CARD_EXPIRATION_DATE,
      ],
    });

    // FIXME - think about appendTo call method outside of form controller
    const resultForm = sdk.createForm({
      fields: [
        userName.current,
        lastName.current,
        email.current,
        cardNumber.current,
        cardVerificationCode.current,
        cardExpirationDate.current,
      ],
    });
    resultForm.on('status', (nextFormStatus) => {
      setFormStatus(nextFormStatus);
    });

    form.current = resultForm;

    setAppStatus('initialized');

    return () => {
      resultForm.destroy();
    };
  }, []);

  const handleSubmitClick = useCallback((e) => {
    e.preventDefault();

    form.current.submit();
  }, [form]);

  const handleResetClick = useCallback((e) => {
    e.preventDefault();

    userName.current.clear();
    lastName.current.clear();
    email.current.clear();
    cardNumber.current.clear();
    cardVerificationCode.current.clear();
    cardExpirationDate.current.clear();
  }, [userName, lastName, email, cardNumber, cardVerificationCode, cardExpirationDate]);

  const handleUpClick = useCallback((e) => {
    e.preventDefault();

    userName.current.focus();
  }, [userName]);

  const handleDownClick = useCallback((e) => {
    e.preventDefault();

    userName.current.blur();
  }, [userName]);

  const isFormReady = formStatus
    && formStatus.readiness === SDK.FORM_STATUSES.READINESS.READY;

  const isFormEnabled = isFormReady
    && formStatus.validation === SDK.FORM_STATUSES.VALIDATION.VALID;

  const isUserNameReady = userName.current
    && userName.current.getStatus().readiness === SDK.FIELD_STATUSES.READINESS.READY;

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
          <Field
            name="userName"
            label="User name"
            field={userName.current}
            form={form.current}
          />
          <Field
            name="lastName"
            label="Last name"
            field={lastName.current}
            form={form.current}
          />
          <Field
            name="email"
            label="Email"
            field={email.current}
            form={form.current}
          />
          <Field
            name="cardNumber"
            label="Card Number"
            field={cardNumber.current}
            form={form.current}
            className="cardNumber"
          />
          <Field
            name="cardVerificationCode"
            label="CVC"
            field={cardVerificationCode.current}
            form={form.current}
            span={1}
          />
          <Field
            name="cardExpirationDate"
            label="Expiration date"
            field={cardExpirationDate.current}
            form={form.current}
            span={2}
          />
          <Row className="row">
            <Col span={2}>
              <Button
                type="default"
                disabled={appStatus === 'preparing'}
                loading={isFormReady ? false : { delay: 150 }}
                onClick={handleResetClick}>
                Reset
              </Button>
            </Col>
            <Col span={5}>
              <Button
                type="primary"
                disabled={appStatus === 'preparing' || !isFormEnabled}
                loading={isFormReady ? false : { delay: 150 }}
                onClick={handleSubmitClick}>
                Send
              </Button>
            </Col>
            <Col span={3}>
              <Button
                type="primary"
                disabled={appStatus === 'preparing' || !isUserNameReady}
                loading={isFormReady ? false : { delay: 150 }}
                onClick={handleUpClick}>
                Focus User name
              </Button>
            </Col>
            <Col span={2}>
              <Button
                type="primary"
                disabled={appStatus === 'preparing' || !isUserNameReady}
                loading={isUserNameReady ? false : { delay: 150 }}
                onClick={handleDownClick}>
                Blur User name
              </Button>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
