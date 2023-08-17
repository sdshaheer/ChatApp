import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./CustomModal.css";

const Profile = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton style={{ border: "none" }}>
        <Modal.Title id="contained-modal-title-vcenter">
          <span className="text-center">Syed Shaheer</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <img
            className="image"
            src="https://image.winudf.com/v2/image1/bmV0LndsbHBwci5ib3lzX3Byb2ZpbGVfcGljdHVyZXNfc2NyZWVuXzBfMTY2NzUzNzYxN18wOTk/screen-0.webp?fakeurl=1&type=.webp"
          />
        </div>
        <span className="fs-4 mt-4">Email : sdshafin5421@gmail.com</span>
      </Modal.Body>
      <Modal.Footer style={{ border: "none" }}>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Profile;
