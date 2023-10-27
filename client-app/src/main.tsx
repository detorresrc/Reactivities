import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/Router";
import { enableMapSet } from "immer";
import RefreshToken from "./app/common/auth/RefreshToken";

enableMapSet();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <RefreshToken/>
    <React.StrictMode>
      <RouterProvider router={router}/>
    </React.StrictMode>
  </> 
);
