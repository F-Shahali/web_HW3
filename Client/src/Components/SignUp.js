import React, {useCallback, useState} from 'react';
import {Alert} from "antd";
// import dotenv from 'dotenv';

// dotenv.config();

const SignUp = () => {
    const [inputs, setInputs] = useState({username: "", email: "", password: ""});
    const [ErrorAlert, setErrorAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const [message, setMessage] = useState("");
    const server_port = 8080;
    const {username, email, password} = inputs;

    const onChange = e => {
        setInputs({...inputs, [e.target.name] : e.target.value});
    };

    const onSubmit = async e => {
        console.log(username, password, email);

        e.preventDefault();

        try {
            const body = {username, email, password};
            let response = null;
            await fetch(`http://localhost:${server_port}/auth/signup`,
                {
                    method:"POST",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify(body)
            }).then(resp => {
                response = resp;
                return resp.json();
            }).then(data => {
                if(!response.ok)
                    throw new Error(data.error);
                setMessage("Done successfully :)");
                setSuccessAlert(true)
            }).catch(err => {
                setErrorAlert(true)
                setMessage(err.message);
            });
            setTimeout(() => {
                setMessage("");
                setErrorAlert(false);
                setSuccessAlert(false);
            }, 3500);


        }catch (err){
            console.error(err.message);
        }
        setInputs({
            username: "",
            email: "",
            password: ""
        });
    }

    return (
        <div className="signup">
            <div>
                <label htmlFor="chk" aria-hidden="true">Sign up</label>
                <form onSubmit={onSubmit}>
                    <input type="text" name="username" placeholder="Username" value={username}
                           onChange={onChange} required />
                    <input type="email" name="email" placeholder="Email" value={email}
                           onChange={onChange} required />
                    <input type="password" name="password" placeholder="Password" value={password}
                           onChange={onChange} required />
                    <button type="submit" className="home-btn">Sign up</button>
                </form>
                <center>
                    {ErrorAlert ?
                        <Alert type="error" showIcon message={message} style={{
                            height: 40,
                            width: '70%',
                            textAlign: 'center'
                        }}/>
                        : null }
                    {successAlert ?
                        <Alert message={message} type="success" showIcon style={{
                            height: 40,
                            width: '70%',
                            textAlign: 'center'
                        }} />
                        : null }
                </center>
            </div>
        </div>
    );
};
export default SignUp;
