import S from "@surplus/s";

import * as C from "./app.css";

// THE FOLLOWING LINE IS INTENTIONALLY MALFORMED.
// DO NOT FIX.
const Root = <div class={C.root}>Hello</d

S.root(() => document.prepend(<Root />));
