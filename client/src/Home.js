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
    
    <main className="container">
      <div className="row">
        <div className="col-md-4">
          
          <ul>
            {skills.map(s => <li>{s.name}</li>)}
          </ul>

        </div>
        {/* <div className="col-md-7 offset-md-1">
          {sections.map(s => {
            return (
              <section id={s.slug} key={s.slug}>
                <h2>{s.name}</h2>
                {user && (<Link className="btn btn-sm btn-outline-primary mb-2" to={`/sectionItems/new?section=${s.slug}`}>New</Link>)}
                <ul>
                  {sectionItems.filter(si => si.Section.slug === s.slug).map(si => (
                    <li key={si.id}>
                      <h3>{si.title}</h3>
                      <h4>{si.subtitle}</h4>
                      <h5>{si.place}</h5>
                      <h6>{si.startedAt} to {si.endedAt ? si.endedAt : 'Present'}</h6>
                      <p>{si.about}</p>
                      {user && (
                        <p>
                          <Link className="btn btn-sm btn-outline-primary" to={`/sectionItems/${si.id}/edit`}>Edit</Link>&nbsp;
                          <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(si)} type="button">Delete</button>
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div> */}
      </div>
    </main>    
  );
}

export default Home;
