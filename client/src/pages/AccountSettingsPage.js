import * as React from "react";
import PageLayout from "./PageLayout";
import AccountSettingsComponent from "../components/settings/AccountSettingsComponent";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { decodeToken } from "react-jwt";
import { Helmet } from "react-helmet";
const AccountSettingsPage = () => {
  const [user,setUser]=useState(null);
  const navigate = useNavigate();



  useEffect(() => {
    if(Cookies.get('admin_id')){
      let cookie = Cookies.get('admin_id');
      const decodedToken = decodeToken(cookie);
      setUser(JSON.parse(decodedToken.admin_id));
    }else{
      navigate("/login");
    }
 
  },[])

  return (
    <PageLayout headerTitle={"Account Settings"}>
      <Helmet>
        <title>Pasabili | Account Settings</title>
      </Helmet>
      <AccountSettingsComponent user={user} setUser={setUser}/>
    </PageLayout>
  );
};

export default AccountSettingsPage;