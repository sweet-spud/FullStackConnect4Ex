import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home({ player }) {
  const navigate = useNavigate();

  return (
    <>
      <h1>Connect-4</h1>
      <div>
        <button
          className="btn"
          onClick={() => {
            navigate(`/game/${player.id}`);
          }}
        >
          Local-Play
        </button>
        <button
          className="btn"
          onClick={() => {
            console.log("onclick");
            navigate("/play-online");
          }}
        >
          Online-Play
        </button>
      </div>
    </>
  );
}

export default Home;
