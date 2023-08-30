import React, { useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function TubeTypesAdd({ show, onClose, children }) {
    const nameElement = useRef()
    const minElement = useRef()
    const maxElement = useRef()

    const handleSave = () => {
        const data = {
            name: nameElement.current.value,
            min: minElement.current.value,
            max: maxElement.current.value,
        }
        fetch(`${process.env.REACT_APP_BACKEND_ROUTE}/tubes/types`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((response) => {
                alert("The new tube has been saved")
            })
            .catch(error => {
                alert("Something wrong happend, check the console log")
            })

    }

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Tube Type</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate>
                    <Form.Group>
                        <Form.Label>
                            Name:
                            <Form.Control ref={nameElement} />
                        </Form.Label>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column>
                            Set a range of values:
                            <Col><Form.Control ref={minElement} placeholder='Min' /></Col> - <Col><Form.Control ref={maxElement} placeholder='Max' /></Col>
                        </Form.Label>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSave}>Save</Button>
                <Button variant="secondary" onClick={onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};