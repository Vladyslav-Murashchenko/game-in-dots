import React from 'react';
import ReactDOM from 'react-dom';

const HelloMessage = () => <h1>Hi!</h1>;

ReactDOM.render(<HelloMessage name="Jane" />, document.getElementById('root'));
