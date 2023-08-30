import React, { useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';

export default function Item({ id, name, children }) {
    const [isActive, setIsActive] = useState(false)
    return <Dropdown.Item
        key={id}
        eventKey={`${id}#${name}`}
        active={isActive}
        onClick={() => setIsActive(!isActive)}>
        {children}
    </Dropdown.Item>
}