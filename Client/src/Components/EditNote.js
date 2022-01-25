import React, {useState} from 'react';
import { Button, Modal} from 'react-bootstrap';
import TextArea from "antd/es/input/TextArea";

const EditNote = ({ note }) => {
    const [noteText, setNoteText] = useState(note.text);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button style={{width: "80%", height: '50%'}} variant="warning" onClick={handleShow}>
                Edit
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Body>
                    <TextArea value={note}>

                    </TextArea>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        cancel
                    </Button>
                    <Button variant="primary">ok</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditNote;