import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Api from "../Api"

function SkillsList() {
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
        <main className="container">
            <h1>Skills List</h1>
            <Link className="btn btn-primary" to="/skills/new">
                New
            </Link>
            <ul>
            {skills.map(s => (
          <li key={s.id}>
            <p><Link to={`/skills/${s.id}/edit`}>{s.name}, {s.position}</Link></p>
            <p><button onClick={() => onDelete(s)} type="button" className="btn btn-sm btn-danger">Delete</button></p>
          </li>
        ))}
            </ul>
        </main>
    )
}

export default SkillsList;