import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
/* eslint import/no-unresolved:0 */
/* eslint react/jsx-props-no-spreading:0 */
import SDK from '@js-sdk/library/devTmp/js-sdk.esm';
import { UserOutlined } from '@ant-design/icons';
import {
  Layout, Menu, Button, Row, Col,
} from 'antd';

import './App.scss';
import { Field } from './components/Field';

const { Header, Sider, Content } = Layout;
const sdk = new SDK({
  sdkOrigin: 'http://localhost:3000',
  elementsOrigin: 'http://localhost:3001',
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
  const [fields, setFields] = useState([
    { name: 'userName', label: 'User name' },
    { name: 'lastName', label: 'Last name' },
    { name: 'email', label: 'Email' },
    { name: 'cardNumber', label: 'Card number', className: 'cardNumber' },
    { name: 'cardVerificationCode', label: 'CVC', span: 1 },
    { name: 'cardExpirationDate', label: 'Expiration date', span: 2 },
  ]);
  const fieldsRefs = useRef({});
  const [appStatus, setAppStatus] = useState('preparing');
  const [formStatus, setFormStatus] = useState(null);

  useEffect(() => {
    fieldsRefs.current = {
      userName: sdk.createField('textInput', {
        name: 'user.name',
        placeholder: 'Mister',
        style: fieldStyle,
        validators: [
          SDK.VALIDATORS.REQUIRED,
        ],
      }),
      lastName: sdk.createField('textInput', {
        name: 'user.lastName',
        placeholder: 'X',
        style: fieldStyle,
      }),
      email: sdk.createField('textInput', {
        name: 'user.email',
        placeholder: 'email@example.com',
        style: fieldStyle,
        validators: [
          SDK.VALIDATORS.REQUIRED,
        ],
      }),
      cardNumber: sdk.createField('cardNumber', {
        name: 'card.number',
        style: fieldStyle,
        validators: [
          SDK.VALIDATORS.REQUIRED,
          SDK.VALIDATORS.CARD_NUMBER,
        ],
      }),
      cardVerificationCode: sdk.createField('cardVerificationCode', {
        name: 'card.cvc',
        placeholder: '***',
        style: fieldStyle,
        validators: [
          SDK.VALIDATORS.REQUIRED,
          SDK.VALIDATORS.CARD_VERIFICATION_CODE,
        ],
      }),
      cardExpirationDate: sdk.createField('cardExpirationDate', {
        name: 'card.expirationDate',
        style: fieldStyle,
        validators: [
          SDK.VALIDATORS.REQUIRED,
          SDK.VALIDATORS.CARD_EXPIRATION_DATE,
        ],
      }),
    };

    const resultForm = sdk.createForm({
      fields: [
        fieldsRefs.current.userName,
        fieldsRefs.current.lastName,
        fieldsRefs.current.email,
        fieldsRefs.current.cardNumber,
        fieldsRefs.current.cardVerificationCode,
        fieldsRefs.current.cardExpirationDate,
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

    form.current.submit('/pay', {
      data: {
        timestamp: Date.now(),
      },
      headers: {
        'x-header': 'some-x-header-value',
      },
    });
  }, [form]);

  const handleResetClick = useCallback((e) => {
    e.preventDefault();

    fieldsRefs.current.userName.clear();
    fieldsRefs.current.lastName.clear();
    fieldsRefs.current.email.clear();
    fieldsRefs.current.cardNumber.clear();
    fieldsRefs.current.cardVerificationCode.clear();
    fieldsRefs.current.cardExpirationDate.clear();
  }, [fieldsRefs]);

  const handleDelete = useCallback((fieldName) => {
    fieldsRefs.current[fieldName].destroy();

    setFields(
      fields.filter(
        (field) => field.name !== fieldName,
      ),
    );
  }, [fields]);

  const handleUpClick = useCallback((e) => {
    e.preventDefault();

    fieldsRefs.current.userName.focus();
  }, [fieldsRefs]);

  const handleDownClick = useCallback((e) => {
    e.preventDefault();

    fieldsRefs.current.userName.blur();
  }, [fieldsRefs]);

  const isFormReady = formStatus
    && formStatus.readiness === SDK.FORM_STATUSES.READINESS.READY;

  const isFormEnabled = isFormReady
    && formStatus.validation === SDK.FORM_STATUSES.VALIDATION.VALID;

  const isUserNameReady = fieldsRefs.current.userName
    && fieldsRefs.current.userName.getStatus().readiness === SDK.FIELD_STATUSES.READINESS.READY;

  return (
    <Layout>
      <Sider trigger={null} collapsible>
        <div className="logo">
          JS SDK Playground
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <UserOutlined />
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
          {
            fields.map((fieldProps) => (
              <Field
                key={fieldProps.name}
                {...fieldProps}
                field={fieldsRefs.current[fieldProps.name]}
                onDelete={handleDelete}
              />
            ))
          }
          <Row className="row">
            <Col span={2}>
              <Button
                type="default"
                disabled={appStatus === 'preparing'}
                loading={isFormReady ? false : { delay: 150 }}
                onClick={handleResetClick}
              >
                Reset
              </Button>
            </Col>
            <Col span={5}>
              <Button
                type="primary"
                disabled={appStatus === 'preparing' || !isFormEnabled}
                loading={isFormReady ? false : { delay: 150 }}
                onClick={handleSubmitClick}
              >
                Send
              </Button>
            </Col>
            <Col span={3}>
              <Button
                type="primary"
                disabled={appStatus === 'preparing' || !isUserNameReady}
                loading={isFormReady ? false : { delay: 150 }}
                onClick={handleUpClick}
              >
                Focus User name
              </Button>
            </Col>
            <Col span={2}>
              <Button
                type="primary"
                disabled={appStatus === 'preparing' || !isUserNameReady}
                loading={isUserNameReady ? false : { delay: 150 }}
                onClick={handleDownClick}
              >
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
