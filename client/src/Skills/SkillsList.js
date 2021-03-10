import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Api from "../Api"

function SkillsList() {




    return (
        <main className="container">
            <h1>Skills List</h1>
            <Link className="btn btn-primary" to="/skills/new">
                New
            </Link>
        </main>
    )
}

export default SkillsList;