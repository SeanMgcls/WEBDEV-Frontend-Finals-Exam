import { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button, Form, Modal, Card } from "react-bootstrap";
import UserContext from "../UserContext";
import Swal from "sweetalert2";

export default function UserProfile() {
  const { user } = useContext(UserContext);

  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user details
  const showUserDetails = () => {
    fetch("http://localhost:4000/users/search", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === "USER-FOUND") {
          setUserDetails(data.result);
          setFirstName(data.result.firstName || "");
          setMiddleName(data.result.middleName || "");
          setLastName(data.result.lastName || "");
          setEmail(data.result.email || "");
          setContactNumber(data.result.contactNumber || "");
          setIsAdmin(data.result.isAdmin || false);
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("An unexpected error occurred.");
      });
  };

  // Update user details
  const handleUpdate = () => {
    setIsSubmitting(true);
    fetch("http://localhost:4000/users/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        firstName,
        middleName,
        lastName,
        email,
        contactNumber,
        password: password || undefined, // Only send password if it is changed
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === "USER-UPDATE-SUCCESS") {
          Swal.fire("Success", "Profile updated successfully", "success");
          showUserDetails(); // Refresh user details
          setShowModal(false);
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("An unexpected error occurred.");
      })
      .finally(() => setIsSubmitting(false));
  };

  useEffect(() => {
    showUserDetails();
  }, []);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={6}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {userDetails ? (
            <Card className="my-3">
              <Card.Body>
                <Card.Title>User Profile</Card.Title>
                <Card.Text>
                  <strong>ID:</strong> {userDetails._id}
                </Card.Text>
                <Card.Text>
                  <strong>Name:</strong> {`${firstName} ${middleName} ${lastName}`}
                </Card.Text>
                <Card.Text>
                  <strong>Email:</strong> {email}
                </Card.Text>
                <Card.Text>
                  <strong>Contact Number:</strong> {contactNumber}
                </Card.Text>
                <Card.Text>
                  <strong>Role:</strong> {isAdmin ? "Admin" : "User"}
                </Card.Text>
              </Card.Body>
            </Card>
          ) : (
            <p>Loading user details...</p>
          )}
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Edit Profile
          </Button>
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <Container fluid>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formMiddleName">
              <Form.Label>Middle Name</Form.Label>
              <Form.Control
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formContactNumber">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </Container>
  );
}
