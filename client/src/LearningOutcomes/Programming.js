import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Api from "../Api";

import {useAuthContext} from '../AuthContext';

function Programming() {

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
            <h1>Programming</h1>
            <p className="text-center" ></p>
            {/* <img src={logo} className="logo" alt="FairPlay Logo"></img> */}
          </div>
          <div className="col-md-6" id="leftRegister">
          <h1 className="text-center">Fundamentals</h1>

          <Link className="btn btn-primary" to="/">
                Go Back
            </Link>
            <p className="text-center" >Programming fundamentals cover object-oriented programming languages, systems,
algorithms, data structures, and will aim to tackle conceptual understanding as well as hands-on experiences.</p>
  
            <div className="list-group">
              <table className="table table-hover table-dark">
                  <thead>
                      <tr className="bg-primary text-center">
                          <th scope="col">Topic</th>
                          {user && (<th scope="col">Update</th>)}
                          <th scope="col">Learn More</th>
                      </tr>
                  </thead>
                  <tbody>
                      {/* {topics.map(topic => {
                          return (
                              <tr key={topic.id}>
                              <td>{topic.name}</td>
                              <td>{topic.difficulty}</td>
                              <td><button className="btn btn-warning">Update</button></td>
                              <td><button className="btn btn-primary">Learn More</button></td>
                          </tr>
                          )
                          
                      })} */}
                      <tr className="bg-primary text-center">
                          <td>Object-oriented Programming</td>
                          {user && <td><Link className="nav-link" href="/web_technologies/update" to="/web_technologies/update"><button className="btn btn-warning">Update</button></Link></td>}
                          <td><Link className="nav-link" href="/programming" to="/programming"><button className="btn btn-primary">Learn</button></Link></td>
                      </tr>
                      <tr className="bg-primary text-center">
                          <td>Systems and Algorithms</td>
                          {user && <td><button className="btn btn-warning">Update</button></td>}
                          <td><Link className="nav-link" href="/programming" to="/programming"><button className="btn btn-primary">Learn</button></Link></td>
                      </tr>
                      <tr className="bg-primary text-center">
                          <td>Data Structures</td>
                          {user && <td><button className="btn btn-warning">Update</button></td>}
                          <td><Link className="nav-link" href="/programming" to="/programming"><button className="btn btn-primary">Learn</button></Link></td>
                      </tr>
                      <tr className="bg-primary text-center">
                          <td>Integrated Development Environment</td>
                          {user && <td><button className="btn btn-warning">Update</button></td>}
                          <td><Link className="nav-link" href="/programming" to="/programming"><button className="btn btn-primary">Learn</button></Link></td>
                      </tr>
                  </tbody>
              </table>
          </div>
          </div>
        </div>
      </main> 
    )
}

export default Programming;