import { useState } from "react";
import { Card, Button } from "react-bootstrap";


export default function UsersCard({usersData}){

  const {_id, firstName, middleName, lastName, email, contactNumber, password, isAdmin} = usersData;
  const fullName = `${firstName} ${middleName} ${lastName}`;


    return(
      <Card className="w-100 card-height mx-2 my-2 p-2 shadow">
        <Card.Body>
        <Card.Title>User ID</Card.Title>
        <Card.Text>{_id}</Card.Text>
          <Card.Title>Name</Card.Title>
          <Card.Text>{fullName}</Card.Text>
          <Card.Title>Email</Card.Title>
          <Card.Text>{email}</Card.Text>
          <Card.Title>Contact Number</Card.Title>
          <Card.Text>{contactNumber}</Card.Text>
          <Card.Title>Password</Card.Title>
          <Card.Text>{password}</Card.Text>
          <Card.Title>Role</Card.Title>
          <Card.Text>{isAdmin ? "Admin" : "User"}</Card.Text>
          <Card.Footer>
          </Card.Footer>
        </Card.Body>
      </Card>
    )
}