import * as React from 'react'
import * as Server from 'react-dom/server'

let Greet = () => <>
  <h1>Hello World</h1>
  {__IS_LINUX__ ? <p>This is a Linux system.</p> : <p>This is not a Linux system.</p>}
  {__IS_PRODUCTION__ ? <p>Production mode is enabled.</p> : <p>Development mode is enabled.</p>}
</>
console.log(Server.renderToString(<Greet />))
