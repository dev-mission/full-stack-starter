import './Home.scss';
import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import AboutMe from './AboutMe';
import Api from './Api';

import {useAuthContext} from './AuthContext';

function Home() {
  const {user} = useAuthContext();
  const [sections, setSections] = useState([]);
  const [sectionItems, setSectionItems] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(function() {
    Api.sections.index().then(response => setSections(response.data));
    Api.sectionItems.index().then(response => setSectionItems(response.data));
    Api.skills.index().then(response => setSkills(response.data));
  }, []);

  const onDelete = function(sectionItem) {
    if (window.confirm(`Are you sure you wish to delete "${sectionItem.title}"?`)) {
      Api.sectionItems.delete(sectionItem.id)
        .then(() => {
          const newSectionItems = sectionItems.filter(si => si.id !== sectionItem.id);
          setSectionItems(newSectionItems);
        });
    }
  };

  return (
    <main className="myContainer">
      <div className="row">
        <div className="col-md-6" id="leftRegister" style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
          <h1 className="text-center">Welcome to InConnect!</h1>
          <p className="text-center" ></p>
          {/* <img src={logo} className="logo" alt="FairPlay Logo"></img> */}
        </div>
        <div className="col-md-6" id="rightRegister">
        <h1 className="text-center">Learning Outcomes</h1>
          <p className="text-center" >Contribute, share, and shape your understanding on how
to use technical communication and organization skills to
optimize technical systems in the world of computing. The main areas of focus
include web technologies, databases fundamentals, infrastructure and systems, and
programming.</p>

          <div className="list-group">
            <table className="table table-hover table-dark">
                <thead>
                    <tr className="bg-primary text-center">
                        <th scope="col">Topic</th>
                        <th scope="col">Difficulty</th>
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
                      <td>Web Technologies</td>
                      <td>Fundamentals/Basic</td>
                      {user && <td><Link className="nav-link" href="/web_technologies/update" to="/web_technologies/update"><button className="btn btn-warning">Update</button></Link></td>}
                      <td><Link className="nav-link" href="/web_technologies" to="/web_technologies"><button className="btn btn-primary">Learn</button></Link></td>
                  </tr>
                    
                    <tr className="bg-primary text-center">
                        <td>Databases</td>
                        <td>Fundamentals/Basic</td>
                        {user && <td><button className="btn btn-warning">Update</button></td>}
                        <td><Link className="nav-link" href="/databases" to="/databases"><button className="btn btn-primary">Learn</button></Link></td>
                    </tr>
                    {user && (
                      <tr className="bg-primary text-center">
                      <td>Infrastructure and Systems</td>
                      <td>Fundamentals/Basic</td>
                      {user && <td><button className="btn btn-warning">Update</button></td>}
                      <td><Link className="nav-link" href="/infra_and_systems" to="/infra_and_systems"><button className="btn btn-primary">Learn</button></Link></td>
                  </tr>
                    )}
                    {user && (
                      <tr className="bg-primary text-center">
                      <td>Programming</td>
                      <td>Fundamentals/Basic</td>
                      {user && <td><button className="btn btn-warning">Update</button></td>}
                      <td><Link className="nav-link" href="/programming" to="/programming"><button className="btn btn-primary">Learn</button></Link></td>
                  </tr>
                    )}
                    
                    
                </tbody>
            </table>
        </div>
        </div>
      </div>
    </main>   
  );
}

export default Home;
