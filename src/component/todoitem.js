import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const TodoItem = (props) => {
  const { name, isActive, id } = props.todo;
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  const handleEdit = () => {
    props.editTodo(id, editedName); 
    setIsEditing(false); 
  };

  return (
    <div className="list-group-item align-items-center d-flex justify-content-between border-bottom shadow my-1">
      <div className="d-flex align-items-center">
        {/* Checkbox for marking todo as done */}
        <input
          type="checkbox"
          checked={!isActive} 
          onChange={() => props.doneTodo(id)} 
          className="mr-2"
        />
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleEdit}
          />
        ) : (
          <span className={isActive ? '' : 'line-through'}>{name}</span>
        )}
      </div>
      <div className="buttons-group my-2">
        <button onClick={() => setIsEditing(!isEditing)} className="btn btn-sm btn-warning mr-2">
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button onClick={() => props.removeTodo(id)} className="btn btn-sm btn-danger">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;



