import React from "react";
import { useNavigate } from "react-router-dom";

function BackButton(){

    const navigate = useNavigate();

    return(
        <button
        onClick={()=>navigate(-1)}
        style={styles.button}
        >
        ⬅ Back
        </button>
    );
}


const styles={

button:{
    position:"fixed",
    top:"20px",
    left:"20px",
    background:"red",
    color:"white",
    padding:"10px 20px",
    border:"none",
    borderRadius:"8px",
    cursor:"pointer",
    fontSize:"16px",
    zIndex:1000
}

};


export default BackButton;