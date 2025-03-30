import * as React from 'react'
import * as Server from 'react-dom/server'

let Greet = () => <>
  <h1>Hello World</h1>
  {__IS_LINUX__ ? <p>This is a Linux system.</p> : <p>This is not a Linux system.</p>}
  {/* #if IS_PRODUCTION */}
  <p>This is production-specific code.</p>
  {/* #else */}
  <p>This is development-specific code.</p>
  {/* #endif */}
</>
console.log(Server.renderToString(<Greet />))
