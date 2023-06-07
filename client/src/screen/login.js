import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Redux/Actions/UserActions";

export default function Login() {
    const dispatch = useDispatch();
    let navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email.toLowerCase(), password));
    };

    useEffect(() => {
        if (userInfo) {
            navigate(-1);
        }
    }, [userInfo, navigate]);

    return (
        <>
            <div className="login-container">
                <form
                    className="Login col-md-8 col-lg-4 col-11"
                    onSubmit={submitHandler}
                >
                    <input
                        type="email"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        value={password}
                        placeholder="Mot de Passe"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">connexion</button>
                    <p>
                        <Link to={"/register"}>Créé un compte</Link>
                    </p>
                </form>
            </div>
        </>
    );
}
