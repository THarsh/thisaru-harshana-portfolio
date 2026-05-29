import portfolioImg from "../img/thisaru.png";

function PortfolioImage() {
  return (
    <img
      src={portfolioImg}
      alt="Harshana Hewage"
      loading="lazy"
      className="profile-image"
    />
  );
}

export default PortfolioImage;
