// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";


function MyApp() {
  const [characters, setCharacters] = useState([]);

  function deleteUser(_id) {
    return fetch(`http://localhost:8000/users/${_id}`, {
      method: "DELETE",
    });
  }

  function removeOneCharacter(index) {
    const _id = characters[index]._id;
    deleteUser(_id)
    .then((res) => {
      if (res.status !== 204){
        throw new Error("Delete failed");
      }
      setCharacters(characters.filter((c) => c._id !== _id));
    })
    .catch((error) => console.log(error));
}



  function updateList(person) {
    postUser(person)
    .then((res) => {
      if (res.status !== 201) {
        throw new Error("User not created");
      }
      return res.json();
    })
    .then((newUser) => {
      setCharacters([...characters, newUser]);
    })
    .catch((error) => {
      console.log(error);
    });

  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);


  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form 
        handleSubmit={updateList} 
      />
    </div>
  );

}

export default MyApp;