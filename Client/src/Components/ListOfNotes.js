import React, {useEffect, useState} from 'react';
import {Table, Button, OverlayTrigger, Modal} from 'react-bootstrap';
import EditNote from "./EditNote";



const ListOfNotes = () => {

    const [data, setData] = useState([]);
    const [ModalShow, setModalShow] = useState(false);
    const handleClose = () => setModalShow(false);
    const handleShow = () => setModalShow(true);
    const port = 8080;

    const deleteModal = (id) => (
        <Modal
            backdrop="static"
            keyboard={false}
            show={ModalShow}
            onHide={handleClose}
        >
            <Modal.Body>are you sure?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    cancel
                </Button>
                <Button variant="primary" onClick={() => deleteNote(id)}>
                    ok
                </Button>
            </Modal.Footer>
        </Modal>
    );



    const deleteOnClick = (note_id) => {
        handleShow();
        deleteModal(note_id);
    }

    const deleteNote = async (id) => {
        handleClose();

        try {
            const deleteItem = await fetch(`http://localhost:${port}/notes/list/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'token': localStorage.token
                    },
                    params: id
                },
        );
            console.log(deleteItem);
            setData(data.filter(note => note.id !== id ));
        } catch (err) {
            console.error(err.message);
        }
    }

    // const getListOfNotes = async () => {
    //
    // };

    useEffect( async () => {
        const response = await fetch(`http://localhost:${port}/notes/list`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': localStorage.token
            },
        });
        const jsonData = (await response.json()).list;
        setData(jsonData);
        try {

        } catch (err) {
            console.error(err.message);
        }
    },[]);
    console.log(data);

    return (
        <Table striped bordered hover variant="dark" responsive="lg">
            <thead>
            <tr>
                <th style={{width: "60%"}}>
                    <center>note</center>
                </th>
                <th style={{width: "20%"}}>
                    <center>Edit</center>
                </th>
                <th style={{width: "20%"}}>
                    <center>Delete</center>
                </th>
            </tr>
            </thead>
            <tbody>
            {data.map(note => (
                <tr key={note.id}>
                    <td>
                        <center> {note.text}</center>
                    </td>
                    <td>
                        <center><EditNote note={note}/></center>
                    </td>
                    <td>
                        <center>
                            <Button style={{width: "80%", height: '50%'}}
                                        className="btn btn-danger"
                                        onClick={() => deleteOnClick(note.id)}>Delete</Button>
                        </center>

                    </td>
                </tr>
            ))}
            </tbody>
        </Table>

    );

}

export default ListOfNotes;