import "./App.scss";
import portfolioImg from "./img/thisaru.png";

function App() {
  return (
    <section className="home">
      <div className="container">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2 center-col">
            <div className="info-box-wrapper">
              <div className="image-box-wrapper">
                <img src={portfolioImg} alt="harshana hewage" />
              </div>
              <div className="content">
                <h1>Harshana Hewage</h1>
                <div className="tags">
                  <p className="tag-text">Frontend Developer</p>
                  <p className="tag-text">UI designer </p>
                  <p className="tag-text">Photographer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
