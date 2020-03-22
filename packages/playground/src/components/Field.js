import React, {
  memo, useCallback, useEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row } from 'antd';
import SDK from '@js-sdk/library/devTmp/js-sdk.esm';

const FieldComponent = ({
  name, label, field, form, className, span,
}) => {
  const fieldRef = useRef(null);
  const [fieldStatus, setFieldStatus] = useState(
    { validation: 'valid' },
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
      form.removeFields([field]);
      field.destroy();
    };
  }, [name, field, form, setFieldStatus]);

  const isDisabled = fieldStatus.enabling === SDK.FIELD_STATUSES.ENABLING.DISABLED;
  const toggleDisabledState = useCallback(
    (e) => {
      e.preventDefault();
      field.update({
        disabled: !isDisabled,
      });
    },
    [field, isDisabled],
  );

  if (!field) {
    return null;
  }

  return (
    <Row className="row" gutter={4}>
      <Col
        span={span === 12 ? 10 : span}
        className={
          fieldStatus.validation.status === SDK.FIELD_STATUSES.VALIDATION.INVALID ? 'ant-form-item-has-error' : ''
        }
      >
        <label>{label}</label>
        <div
          className={
            `ant-input ${
              isDisabled ? 'ant-input-disabled' : ''
            } ${
              fieldStatus.focus === SDK.FIELD_STATUSES.FOCUS.FOCUSED ? 'ant-input-focused' : ''
            } ${className}`
          }
          ref={fieldRef}
        />
      </Col>
      <Col span={2}>
        <label>&nbsp;</label>
        <div>
          <Button
            type="secondary"
            onClick={toggleDisabledState}
          >
            {isDisabled ? 'Enable' : 'Disable'}
          </Button>
        </div>
      </Col>
    </Row>
  );
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
