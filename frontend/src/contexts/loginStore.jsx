import React, { useState } from "react";
import { loginContext } from "./loginContext";

function LoginStore({ children }) {
    let [currentTenant, setCurrentTenant] = useState(null);
    let [tenantLoginStatus, setTenantLoginStatus] = useState(false);
    let [currentOwner, setCurrentOwner] = useState(null);
    let [ownerLoginStatus, setOwnerLoginStatus] = useState(false);
    let [err, setErr] = useState("");

    async function loginUser(userCred) {
        try {
            let res = await fetch(`http://localhost:4000/registrations-api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userCred)
            });

            let result = await res.json();

            if (result.message === "Login success") {
                let user = result.user;
                sessionStorage.setItem("authToken", result.token); 
                
                if (user.role === "owner") {
                    setCurrentOwner(user);
                    setOwnerLoginStatus(true);
                } else {
                    setCurrentTenant(user);
                    setTenantLoginStatus(true);
                }
                setErr("");
            } else {
                setOwnerLoginStatus(false);
                setTenantLoginStatus(false);
                setErr(result.message);
            }
        } catch (error) {
            setErr(error.message);
        }
    }

    function logoutUser() {
        sessionStorage.removeItem("authToken"); 
        setCurrentOwner(null);
        setCurrentTenant(null);
        setOwnerLoginStatus(false);
        setTenantLoginStatus(false);
        setErr("");
    }

    return (
        <loginContext.Provider value={{ loginUser, logoutUser, ownerLoginStatus, tenantLoginStatus, err, currentOwner, currentTenant, setCurrentOwner, setCurrentTenant, setOwnerLoginStatus, setTenantLoginStatus }}>
            {children}
        </loginContext.Provider>
    );
}

export default LoginStore;
