import React, { Fragment, useEffect, useRef } from 'react';
import VaultySDK from 'vaulty-js-sdk/src/index';

import appStyles from './App.module.scss';

const vaultySDK = new VaultySDK({
  authKey: 'some-auth-key',
});

function App() {
  const textInputNode = useRef();
  useEffect(() => {
    const textInput = vaultySDK.createField('textInput', {
      style: {
        width: '100%',
        height: '20px',
      },
    });
    textInput.appendTo(textInputNode.current);
    const form = vaultySDK.createForm({
      fields: [textInput],
    });
  }, []);
  return (
    <Fragment>
      <div>VaultySDK playground</div>
      <label>User name</label>
      <div className={appStyles.textInput} ref={textInputNode} />
    </Fragment>
  );
}

export default App;
