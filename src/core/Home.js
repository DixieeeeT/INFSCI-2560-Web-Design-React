import React from "react";
import Posts from "../post/Posts";
import BackgroundImage from "../images/bkimg.png";

const Home = () => (
  <div>
        <img
            src={`${BackgroundImage}`}
            alt="Front Title"
            className="img-thunbnail mb-3"
            style={{ height: "auto", width: "100%" }}
        />
    <div className="container">
      <Posts />
    </div>
  </div>
);

export default Home;
