import React from "react";
import "../styles/ConfirmDelete.css";

export default function ConfirmDelete({ setOpenModal, handleDelete, PostToDelete }) {
  const confirmDelete = async () => {
    console.log(PostToDelete)
    await handleDelete(PostToDelete);
    setOpenModal(false);
  };
  return (
    <div className="modalBackground" >
      <div className="modalContainer">
        <div className="titleCloseBtn">
          {/* <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button> */}
        </div>
        <div className="title" >
          <h1>Are You Sure You Want to Delete?</h1>
        </div>
        <div className="footer">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
            id="cancelBtn"
          >
            Cancel
          </button>
          <button onClick={confirmDelete}>Continue</button>
        </div>
      </div>
    </div>
  );
}
