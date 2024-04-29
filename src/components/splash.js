import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Title from "./title";

const Splash = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/login");
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return <Title style={{ padding: "40vh 0vh", textAlign: "center" }} />;
}

export default Splash