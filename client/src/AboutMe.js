import './AboutMe.scss';
import me from './me.jpg';

function AboutMe() {
  return (
    <div id="about-me">
      <img className="img-fluid mb-3" src={me} alt="My Name" />
      <h1>César Castro</h1>
      <p style="text-align:center;">>Minerva Schools at KGI | Class of 2022</p>
    </div>
  );
}

export default AboutMe;
