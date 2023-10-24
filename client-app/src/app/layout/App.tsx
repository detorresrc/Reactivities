import { Container } from "semantic-ui-react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";

import NavBar from "./NavBar";
import "semantic-ui-css/semantic.min.css";
import 'react-calendar/dist/Calendar.css'
import 'react-toastify/dist/ReactToastify.min.css'
import 'react-datepicker/dist/react-datepicker.css'
import "./styles.css";
import HomePage from "@/features/home/HomePage";
import { ToastContainer } from "react-toastify";
import ModalContainer from "../common/modals/ModalContainer";


function App() {
  const location = useLocation();

  return (
    <>
    <ScrollRestoration/>
    <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
    <ModalContainer />
    {location.pathname === '/' ? <HomePage /> : (
      <>
        <NavBar />
        <Container style={{ marginTop: "7em" }}>
          <Outlet />
        </Container>
      </>
    )}
    </>
  );
}

export default App;
