import React, { Fragment, useEffect, useRef } from 'react';
import SDK from '@js-sdk/library';

import appStyles from './App.module.scss';

const sdk = new SDK({
  authKey: 'some-auth-key',
});

function App() {
  const textInputNode = useRef();
  useEffect(() => {
    const textInput = sdk.createField('textInput', {
      style: {
        width: '100%',
        height: '20px',
      },
    });
    textInput.appendTo(textInputNode.current);
    const form = sdk.createForm({
      fields: [textInput],
    });
  }, []);
  return (
    <Fragment>
      <div>JS SDK playground</div>
      <label>User name</label>
      <div className={appStyles.textInput} ref={textInputNode} />
    </Fragment>
  );
}

export default App;
