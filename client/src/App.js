import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DeleteUser from "./features/user/DeleteUser";
import EditUserForm from "./features/user/EditUserForm";
import LoginForm from "./features/user/LoginForm";
import SignUpForm from "./features/user/SignUpForm";
import Navbar from "./features/navbar/Navbar";
import SearchForm from "./features/searchForm/SearchForm";
import GoogleMap from "./features/googleMap/GoogleMap";
import { ErrorNotificationModal } from "./features/utilities/ErrorNotificationModal";
import { useSelector, useDispatch } from "react-redux";
import { clearError } from "./features/searchForm/SearchFormSlice";
import Banner from "./features/banner/Banner";
import Footer from "./features/footer/Footer";
import Loading from "./features/utilities/loading/Loading";
import Writeup from "./features/writeup/Writeup";

function App() {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.resorts2Display.error);
  const handleClose = () => {
    dispatch(clearError());
  };
  return (
    <div>
      <BrowserRouter>
        <Loading />
        <Navbar />
        <Banner />
        <Writeup />
        <SearchForm />
        <GoogleMap />
        <Routes>
          <Route path="/" exact element={<></>}></Route>
          <Route path="/user" exact element={<></>}></Route>
          <Route path="/user/delete" element={<DeleteUser />}></Route>
          <Route path="/user/login" element={<LoginForm />}></Route>
          <Route path="/user/signup" element={<SignUpForm />}></Route>
          <Route path="/user/edit" element={<EditUserForm />}></Route>
        </Routes>
        <Footer />
        <ErrorNotificationModal error={error} handleClose={handleClose} />
      </BrowserRouter>
    </div>
  );
}
export default App;
