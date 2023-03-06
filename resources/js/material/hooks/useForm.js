import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import {
    Alert
} from "@material-tailwind/react";

export const useForm = () => {
    let navigate = useNavigate();

    const [errors, setErrors] = useState(null);
    const [message, setMessage] = useState('');

    function renderFieldError(field) {
        if(errors && errors.hasOwnProperty(field)) {
            return errors[field][0] ? (
                    <Alert color="red">{errors[field][0]}</Alert>
            ) : null;
        }
        // <span className="invalid-feedback" role="alert"><strong>{errors[field][0]}</strong></span>
        return null;
    }

    return {
        navigate,
        errors,
        setErrors,
        message,
        setMessage,
        renderFieldError
    }
}
