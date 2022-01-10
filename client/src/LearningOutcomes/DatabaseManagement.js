import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Api from "../Api";

import {useAuthContext} from '../AuthContext';

function DatabaseManagement() {

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
            <h1>Database Management</h1>
            <p className="text-center" ></p>
            {/* <img src={logo} className="logo" alt="FairPlay Logo"></img> */}
          </div>
          <div className="col-md-6" id="leftRegister">
          <h1 className="text-center">Fundamentals</h1>

          <Link className="btn btn-primary" to="/databases">
                Go Back
            </Link>
            <p>Database management refers to maintaining databases in companies that collect a lot of data.
                Databases must be secure and updated with the most relevant information from
the company. It is also necessary to reorganize the databases to make them faster and
easy.
<br></br><br></br>
It is a skill required mainly for Database Administrators. Within the
responsibilities of a Database Administrator you find: establishing of
policies and procedures for the security, maintenance and use of the database management system. 
There are different database management systems, for example: Oracle
MySQL, Microsoft SQL Server, and IBM DB2.


<br></br><br></br>
A DBMS provides 5 main functions:
<br></br>
<br></br>
<ul>1. Grant multiple users simultaneous access to a single database.</ul>
<ul>2. Establish and maintain security standards and user access rights.</ul>
<ul>3. Back up data on a regular basis and quickly recover it in
in the event of a security breach.</ul>
<ul>
4. Establish database rules and standards to protect data integrity.</ul>
<ul>
5. Provide definitions and “dictionary” descriptions of available data.</ul>

<br>
</br>
A Database Management System is not a substitute for a database manager or a database administrator. These specialists are to
ensure that the database structure works properly and can create user permissions to control who has access to the data.

<br></br>
<br></br>
There are two main types of database systems
<br></br>
<br></br>
<ul>centralized database system: the DBMS and database are stored at a single site that is used by
several other systems too</ul>
<ul>distributed database system: the actual database and the DBMS software are distributed from
various sites that are connected by a computer network</ul>


<br></br>
</p>
  
          </div>
        </div>
      </main> 
    )
}

export default DatabaseManagement;