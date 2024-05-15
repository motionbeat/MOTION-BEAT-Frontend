import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { Provider } from "react-redux";
import Store from "./redux/store.js";

// 경원님 조언: 규칙을 빡세게 하는 게 문제가 생길 수 있음 (StrictMode)
// -> 때에 따라 함수가 두 번 호출되게 함
ReactDOM.render(
  <React.StrictMode>
    <Provider store={Store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
