import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import SDK from '@js-sdk/library/devTmp/js-sdk.esm.js';

import appStyles from './App.module.scss';

const sdk = new SDK({
  authKey: 'some-auth-key',
});

function App() {
  const userNameNode = useRef();
  const lastNameNode = useRef();
  const emailNode = useRef();
  const form = useRef();
  const [formStatus, setFormStatus] = useState(null);

  useEffect(() => {
    const userName = sdk.createField('textInput');
    const lastName = sdk.createField('textInput');
    const email = sdk.createField('textInput');

    userName.appendTo(userNameNode.current);
    lastName.appendTo(lastNameNode.current);
    email.appendTo(emailNode.current);

    // FIXME - think about appendTo call method outside of form controller
    const resultForm = sdk.createForm({
      fields: [userName, lastName, email],
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
    <Fragment>
      <div>JS SDK playground</div>
      <label>User name</label>
      <div className={appStyles.textInput} ref={userNameNode} />
      <label>Last name</label>
      <div className={appStyles.textInput} ref={lastNameNode} />
      <label>Email</label>
      <div className={appStyles.textInput} ref={emailNode} />
      <hr />
      <input type="submit" disabled={formStatus !== sdk.FORM_STATUSES.READY} onClick={handleSubmitClick}/>
    </Fragment>
  );
}

export default App;
