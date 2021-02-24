import { useState, useEffect } from "react";
import Api from "../Api";
import { useHistory, useParams } from "react-router-dom";

function SectionForm() {
  const { id } = useParams();
  const history = useHistory();
  const [section, setSection] = useState({
    name: "",
    slug: "",
    postion: 0
  });

  useEffect(function(){
    if (id) {
      Api.sections.get(id).then((response) => setSection(response.data));
    }
  }, []);

  function onChange(event) {
    const newSection = { ...section };
    newSection[event.target.name] = event.target.value;
    setSection(newSection);
  }

  async function onSubmit(event) {
    event.preventDefault();
    try {
      if (id) {
        await Api.sections.update(id, section);
      } else {
        await Api.sections.create(section);
      }
      history.push('/sections');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main className="container">
      <h1>Section Form</h1>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            type="text"
            name="name"
            value={section.name}
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Slug</label>
          <input
            className="form-control"
            type="text"
            name="slug"
            value={section.slug}
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Position</label>
          <input
            className="form-control"
            type="text"
            name="position"
            value={section.position}
            onChange={onChange}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
      <p>{JSON.stringify(section)}</p>
    </main>
  );
}
export default SectionForm;
