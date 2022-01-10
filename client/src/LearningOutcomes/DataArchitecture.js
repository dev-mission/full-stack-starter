import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Api from "../Api";

import {useAuthContext} from '../AuthContext';

function DataArchitecture() {

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
            <h1>Data Architecture</h1>
            <p className="text-center" ></p>
            {/* <img src={logo} className="logo" alt="FairPlay Logo"></img> */}
          </div>
          <div className="col-md-6" id="leftRegister">
          <h1 className="text-center">Fundamentals</h1>

          <Link className="btn btn-primary" to="/databases">
                Go Back
            </Link>
            <p>Data architecture refers to the models, policies, and rules that govern what data is
they are going to collect; how they will be stored, classified and exploited through the
technological infrastructure available.
It is a skill required primarily by Data Architects. 

<br></br> <br></br>The main functions in data architecture are the following:
<br></br>
<br></br>
<ul>- Manage data structures including design, creation, supervision,
administration and implementation</ul>

<ul>- Define data logic models and standards as a single source of information</ul>

<ul>- Develop database architecture strategies</ul>

<br></br>
Data architecture requires defining the technology architecture that supports the collection of
data, information exploitation, output and presentation. Therefore, it is important
follow analysis and structuring processes based on the business processes and operations of
the company. It is necessary to know the business and the sector well to build a suitable plan.

<br></br>
<br></br>
The Data Architecture Development Cycle involves:
<br></br><br></br>
<ul>- Requirements: Capture, document and prioritize the type of data obtained by the
company and determine the quality of the data. Only keep and store the data that
contain information relevant to the company.</ul>

<ul>- Design: Use database design patterns and tactics. The types of
necessary data models and the technologies that will be used to manage, store and
process the data.</ul>

<ul>- Documentation: It is necessary to communicate with the relevant stakeholders the design of the
data architecture.</ul>

<ul>- Evaluation: It is important to evaluate the design to identify possible problems.
Continuously analyzing and evaluating the architecture is essential to improve possible
system failures.</ul>


<br></br>
</p>
  
          </div>
        </div>
      </main> 
    )
}

export default DataArchitecture;