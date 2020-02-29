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
      name: 'user.cardNumber',
      style: fieldStyle,
      validators: [
        SDK.VALIDATORS.REQUIRED,
        SDK.VALIDATORS.CARD_NUMBER,
      ],
    });
    cardVerificationCode.current = sdk.createField('cardVerificationCode', {
      name: 'user.cvc',
      style: fieldStyle,
      validators: [
        SDK.VALIDATORS.REQUIRED,
        SDK.VALIDATORS.CARD_VERIFICATION_CODE,
      ],
    });
    cardExpirationDate.current = sdk.createField('cardExpirationDate', {
      name: 'user.expirationDate',
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
  }, []);

  const isFormEnabled = Boolean(formStatus)
    && formStatus.readiness === SDK.FORM_STATUSES.READINESS.READY
    && formStatus.validation === SDK.FORM_STATUSES.VALIDATION.VALID;

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
            <Col span={12}>
              <Button
                type="primary"
                disabled={appStatus === 'preparing' || !isFormEnabled}
                loading={formStatus && formStatus.readiness === SDK.FORM_STATUSES.READINESS.LOADING ? { delay: 150 } : false}
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
