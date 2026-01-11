import S from "@surplus/s";

import * as C from "./app.css";

const Root = <div class={C.root}>Hello</div>;

S.root(() => document.prepend(<Root />));
