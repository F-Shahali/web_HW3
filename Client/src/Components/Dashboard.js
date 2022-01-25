import React, {useState} from 'react';
import '../dash-style.css';
import {Layout, Menu, Input, Col, List} from 'antd';
import {UserOutlined, FileOutlined, EditOutlined, FormOutlined} from '@ant-design/icons';
import {Link, Navigate, useNavigate} from "react-router-dom";
import Row from "antd/es/descriptions/Row";
import ListOfNotes from "./ListOfNotes";
import Paragraph from "antd/lib/typography/Paragraph";
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { TextArea } = Input;

const Dashboard = ({setAuth}) => {
    const [note, setNote] = useState("");
    const navigate = useNavigate();

    const addNote = async e => {
        e.preventDefault();
        const server_port = 8080;
        try {
            const body = note;
            console.log(body);
            const response = await fetch(`http://localhost:${server_port}/notes/new`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json",
                        "token": localStorage.token
                    },
                    body: JSON.stringify({"text" : body})
                });
            console.log(response);
            // window.location = "/";
        } catch (err) {
            console.log(err.message);
        }
        setNote("");
    };

    const logout = () => {
        localStorage.removeItem("token");
        setAuth(false);
        navigate("/");
    }

    return(
        <Layout className="dashboard-body" style={{ minHeight: 668}}>
            <Header className="header">
                <div className="logo" />
                <Menu theme="dark" mode="horizontal">
                    <SubMenu key="sub1" icon={<UserOutlined />}>
                        <Menu.Item onClick={logout}>
                                Logout
                        </Menu.Item>
                    </SubMenu>
                    <center style={{marginLeft: "42%"}}>
                        <h4 style={{ marginTop:"15px", color: "beige", textAlign: "center"}}>Note Panel</h4>
                    </center>
                </Menu>
            </Header>
            <Layout>
                <Sider style={{marginLeft:"5%" ,marginTop: "5%"}} width={"40%"} className="site-layout-background" >
                    <ListOfNotes />
                </Sider>
                <Layout style={{ padding: '0 5% 0 0'}}>
                    {/*<ListOfNotes />*/}
                    <Content
                        className="site-layout-background content"

                    >
                        <form onSubmit={addNote}>
                            <Paragraph style={{
                                marginTop: "12%",
                                marginLeft: "54%",
                                fontWeight: "bold"
                            }}>Add your Note </Paragraph>
                            <TextArea showCount maxLength={200} style={{marginTop: "5%",
                                marginLeft: "30%",
                                width: "63%",
                                height: 180,
                                borderRadius: 10,
                                opacity: "50%"}}
                                      value={note}
                                      onChange={e => setNote(e.target.value)}
                            />
                            <button type="submit" className="dash-btn"> Add </button>
                        </form>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    )
}
//
export default Dashboard;


