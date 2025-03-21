帮忙编写一个插件的通用代码，以及提供给webpack、rollup的插件导出。

该插件实现以下对代码做条件编译的功能。通过代码中的注释 /* #if */ /* #else */ 和 /* #endif */ 或者当前语言对应注释来实现对代码的修改。

例如一段javascript代码如下：

```JavaScript
/* #if IS_LINUX */
import { createServer } from './create-linux-server';
/* #else */
import { createServer } from './create-server';
/* #endif */
const a = createServer({ delay: /* #if IS_LINUX */ 600 /* #else */ 100 /* #endif */, });
```

当插件的配置提供 { IS_LINUX: false }, 则编译为：

```JavaScript
import { createServer } from './create-server';
const a = createServer({ delay: 100, });
```

也可以作用于 html、css 等文件中。