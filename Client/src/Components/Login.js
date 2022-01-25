import React, {useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Form} from "react-bootstrap";
import {Alert} from "antd";
// import {Form} from "antd";
const Login = ({setAuth}) => {
    const [inputs, setInputs] = useState({
        username: "",
        password: ""
    });
    const [errorAlert, setErrorAlert] = useState(false);
    const [message, setMessage] = useState("");
    const server_port = 8080;

    const {username, password} = inputs;

    const onChange = (e) => {
        setInputs({...inputs, [e.target.name] : e.target.value});
    }

    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const body = {username, password};
            let response = null;
            await fetch(`http://localhost:${server_port}/auth/login`,
                {
                    method:"POST",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify(body)
                })
                .then(resp => {
                response = resp;
                return resp.json();
            }).then(data => {
                if(!response.ok)
                    throw new Error(data.error);
                localStorage.setItem("token", data.token);
                setAuth(true);
                navigate("/notes");
            }).catch(err => {
                setErrorAlert(true);
                setMessage(err.message);
            });
            setInputs({
                username: "",
                password: ""
            });
            setTimeout(() => {
                setMessage("");
                setErrorAlert(false);
            }, 3000);
        }catch (err){
            console.log(err.message);
        }

        // console.log(setAuth)
        // setAuth(true);
        // navigate("/notes");
    }

    return (
            <div className="login">
                <Form onSubmit={onSubmit}>
                    <label htmlFor="chk" aria-hidden="true">Login</label>
                    <input type="text" name="username" placeholder="username" required
                           value={username} onChange={onChange}/>
                    <input type="password" name="password" placeholder="Password" required
                           value={password} onChange={onChange}/>
                    <button type="submit" className="home-btn">Login</button>
                </Form>
                {errorAlert ?
                    <center>
                        <Alert type="error" showIcon message={message} style={{height: 50, width: '70%'}}/>
                    </center>
                    : null }
            </div>

    );
};
export default Login;
