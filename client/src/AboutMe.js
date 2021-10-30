import './AboutMe.scss';
import me from './me.jpg';

function AboutMe() {
  return (
    <div id="about-me">
      <img className="img-fluid mb-3" src={me} alt="My Name" />
      <h1>César Castro</h1>
      <p>Minerva Schools at KGI</p>
    </div>
  );
}

export default AboutMe;
