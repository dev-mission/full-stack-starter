import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Api from "../Api";

import {useAuthContext} from '../AuthContext';

function DataModeling() {

  const {user} = useAuthContext();
    const [skills, setSkills] = useState([]);

    // UseEffect calls the API when it loads
    useEffect(function() {
      Api.skills.index().then(response => setSkills(response.data));
    }, []);

    function onDelete(skill) {
        if (window.confirm(`Are you sure you wish to delete ${skill.name}?`)) {
          // we'll execute code to delete the section
          Api.skills.delete(skill.id).then(function() {
            // we're filtering the sections list, keeping every section that does not
            // match the one we're deleting
            const newSkills = skills.filter(s => s.id !== skill.id);
            setSkills(newSkills);
          });
        }
      }


    return (

        <main className="myContainer">
        <div className="row">
          <div className="col-md-6" id="rightRegister" style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
            <h1>Data Modeling</h1>
            <p className="text-center" ></p>
            {/* <img src={logo} className="logo" alt="FairPlay Logo"></img> */}
          </div>
          <div className="col-md-6" id="leftRegister">
          <h1 className="text-center">Fundamentals</h1>

          <Link className="btn btn-primary" to="/databases">
                Go Back
            </Link>
            <p>Data modeling is a way of structuring and organizing data so that it can be
easily used by databases. <br></br> <br></br>We can think of data modeling as the instructions for building a
database, understanding that the word model means that to make a good database of
data, a model must be followed to achieve the desired end.
In other words, when modeling a database, it is necessary to know how to design and make
the data understandable.
Most data models can be represented by means of a diagram of
accompanying data.
<br></br><br></br>
It is a skill required mainly for Data Modelers and Data Model Designers. Data
modelers are computer systems engineers who design and implement data modeling solutions
using different types of databases.

<br></br>
<br></br>
There are many types of models, here are some of the more common ones:
<br></br><br></br>
<ul>o Relational Model: it is the most common model since it orders the data in tables
also known as relationships, each of which is made up of
Columns and rows. Each column lists an attribute of the entity in question by
example, price, zip code or date of birth. The model also
represents the types of relationships between tables, for example one-to-one relationships
one, one to many and many to many.</ul>
<br></br>

<ul>o Hierarchical Model: organizes the data in a tree structure, in which each
record has a single element or root. Records of the same level are classified
in a specific order. The model is good at describing many relationships of the
real world.</ul>

<br></br>
Most websites depend on a certain type of database to organize and
present data to users. Generally, there are intermediate programs that connect the server
web with the database.
The wide presence of databases allows them to be used in almost any field, from
online shopping up to a system of voters in a political campaign. Various industries have
developed their own standards for database design.
</p>
  
          </div>
        </div>
      </main> 
    )
}

export default DataModeling;