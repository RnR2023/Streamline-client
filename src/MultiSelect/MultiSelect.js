import React, { useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import Item from './Item';

export default function MultiSelect({ items, handleSelect }) {
    const [selectedItems, setSelectedItems] = useState([])

    return <Dropdown autoClose={false} onSelect={(e) => { handleSelect(e); }}>
        <Dropdown.Toggle split variant="success" id="dropdown-custom-2" />
        <Dropdown.Menu className="super-colors">
            {items.map(item => {
                return <Item id={item.id} name={item.name}>{item.name}</Item>
            })}
        </Dropdown.Menu>
    </Dropdown>
}