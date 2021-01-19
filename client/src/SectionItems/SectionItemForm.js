import {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {StatusCodes} from 'http-status-codes';
import classNames from 'classnames';

import Api from '../Api';
import UnexpectedError from '../UnexpectedError';
import ValidationError from '../ValidationError';

function SectionItemForm() {
  const {id} = useParams();
  const history = useHistory();
  const [error, setError] = useState(null);
  const [sectionItem, setSectionItem] = useState(null);
  const [sections, setSections] = useState([]);

  useEffect(function() {
    if (id) {
      Api.sections.index().then(response => setSections(response.data));
      Api.sectionItems.get(id).then(response => setSectionItem(response.data));  
    } else {
      const search = new URLSearchParams(history.location.search);
      const sectionSlug = search.get('section') || 'education';
      Api.sections.index().then(response => {
        setSections(response.data);
        const section = response.data.find(s => s.slug === sectionSlug) || response.data[0];
        const newSectionItem = {
          SectionId: section.id,
          title: '',
          subtitle: '',
          place: '',
          about: '',
          startedAt: '',
          endedAt: ''
        }
        setSectionItem(newSectionItem);
      });  
    }
  }, [history.location.search, id]);

  const onChange = function(event) {
    const newSectionItem = {...sectionItem};
    newSectionItem[event.target.name] = event.target.value;
    setSectionItem(newSectionItem);
  };

  const onSubmit = async function(event) {
    event.preventDefault();
    setError(null);
    try {
      if (id) {
        await Api.sectionItems.update(id, sectionItem);
      } else {
        await Api.sectionItems.create(sectionItem);
      }
      history.push('/');
    } catch (error) {
      if (error.response?.status === StatusCodes.UNPROCESSABLE_ENTITY) {
        setError(new ValidationError(error.response.data));
      } else {
        setError(new UnexpectedError());
      }
    }
  }

  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-10 col-md-8 col-lg-6 col-xl-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">{id ? 'Edit' : 'New'} Section Item</h2>
              {sectionItem && (
                <form onSubmit={onSubmit}>
                  {error && error.message && (
                    <div className="alert alert-danger">{error.message}</div>
                  )}
                  <div className="mb-3">
                    <label className="form-label" htmlFor="SectionId">Section</label>
                    <select className="form-select" id="SectionId" name="SectionId" onChange={onChange} value={sectionItem.SectionId}>
                      {sections.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
                    </select>
                    {error?.errorMessagesHTMLFor?.('SectionId')}
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="title"><sup>*</sup>Title</label>
                    <input className={classNames('form-control', {'is-invalid': error?.errorsFor?.('title')})} id="title" name="title" onChange={onChange} type="text" value={sectionItem.title} />
                    {error?.errorMessagesHTMLFor?.('title')}
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="subtitle">Subtitle</label>
                    <input className={classNames('form-control', {'is-invalid': error?.errorsFor?.('subtitle')})} id="subtitle" name="subtitle" onChange={onChange} type="text" value={sectionItem.subtitle} />
                    {error?.errorMessagesHTMLFor?.('subtitle')}
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="place">Place</label>
                    <input className={classNames('form-control', {'is-invalid': error?.errorsFor?.('place')})} id="place" name="place" onChange={onChange} type="text" value={sectionItem.place} />
                    {error?.errorMessagesHTMLFor?.('place')}
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="about">About</label>
                    <textarea className={classNames('form-control', {'is-invalid': error?.errorsFor?.('about')})} id="about" name="about" onChange={onChange} value={sectionItem.about}></textarea>
                    {error?.errorMessagesHTMLFor?.('about')}
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="startedAt"><sup>*</sup>Started at</label>
                    <input className={classNames('form-control', {'is-invalid': error?.errorsFor?.('startedAt')})} id="startedAt" name="startedAt" onChange={onChange} pattern="[0-9]{4}-[0-9]{2}" placeholder="YYYY-MM" type="month" value={sectionItem.startedAt} />
                    {error?.errorMessagesHTMLFor?.('startedAt')}
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="endedAt">Ended at</label>
                    <input className={classNames('form-control', {'is-invalid': error?.errorsFor?.('endedAt')})} id="endedAt" name="endedAt" onChange={onChange} pattern="[0-9]{4}-[0-9]{2}" placeholder="YYYY-MM" type="month" value={sectionItem.endedAt} />
                    {error?.errorMessagesHTMLFor?.('endedAt')}
                  </div>
                  <div className="mb-3">
                    <button className="btn btn-primary" type="submit">{id ? 'Update' : 'Create'}</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SectionItemForm;
