import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import UsersCard from "../components/UsersCard";

export default function AllUsers() {
    const [users, setUsers] = useState([]);

    const fetchUsers = () => {
        fetch("http://localhost:4000/users/all", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(result => result.json())
            .then(data => {
                console.log(data);
                // Safeguard against undefined or invalid data
                if (data.code === "ALL-USERS-RESULT" && Array.isArray(data.result)) {
                    setUsers(data.result.map(user => (
                        <Col lg={3} sm={12} key={user._id}>
                            <UsersCard usersData={user} />
                        </Col>
                    )));
                } else {
                    setUsers([]); 
                }
            })
            .catch(error => {
                console.error("Error fetching users:", error);
                setUsers([]); 
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <Container fluid className="p-5 d-flex flex-column justify-content-center align-items-center">
            <h1 className="mb-3 display-3 fw-bold">Welcome To The USERS Page</h1>
            <p className="mb-5">Here you can see the list of Users.</p>

            <Container fluid className="bg-secondary p-3">
                <Row>
                    {users}
                </Row>
            </Container>
        </Container>
    );
}
