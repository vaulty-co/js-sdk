import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import SDK from '@js-sdk/library/devTmp/js-sdk.esm.js';

const FieldComponent = ({ name, label, field, form, className, span }) => {
  const fieldRef = useRef(null);
  const [fieldStatus, setFieldStatus] = useState(
    { validation: 'valid' }
  );

  useEffect(() => {
    if (!field) {
      return;
    }
    field.appendTo(fieldRef.current);
    field.on('status', (currentFieldStatus) => {
      setFieldStatus(currentFieldStatus);
    });

    return () => {
      form.removeFields([ field ]);
      field.destroy();
    }
  }, [name, field, form, setFieldStatus]);

  if (!field) {
    return null;
  }

  return (
    <Row className="row">
      <Col span={span} className={fieldStatus.validation.status === SDK.FIELD_STATUSES.VALIDATION.INVALID ? 'has-error' : ''}>
        <label>{label}</label>
        <div className={`ant-input ${className}`} ref={fieldRef} />
      </Col>
    </Row>
  )
};

FieldComponent.displayName = 'FieldComponent';

FieldComponent.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  field: PropTypes.object,
  form: PropTypes.object,
  className: PropTypes.string,
  span: PropTypes.number,
};

FieldComponent.defaultProps = {
  field: null,
  form: null,
  className: '',
  span: 12,
};

const Field = memo(FieldComponent);

export default Field;
export {
  Field,
};
