import React from "react";
import { Link } from "react-router-dom";
import rickyNelson from "./ricky_nelson.jpg";
import { useAuth } from "../../services/auth";

const About = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="about-header">
        <h1 className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center">About PopHits.org</h1>
        <div className="about-header-text">
          🧙🏽‍♂️ From Ricky Nelson to Taylor Swift...
        </div>
      </div>
      <div className="about-main-text">
        <p>
          <b>PopHits.org</b> is a website dedicated to exploring 50 years of hit
          singles. Our mission is to uncover unheard gems, curate the best
          playlists, and provide ratings from a database of over 20,000 songs.
          You might want to listen to them all!
        </p>
        <br />
        <p>
          <b>Why start in 1958?</b> It makes sense to begin with the
          introduction of the Hot 100 chart in 1958, as it marked a significant
          improvement in the reliability and consistency of music statistics.
          Additionally, data availability increased, eliminating the need to
          rely on jukebox plays and old ticket stubs.
        </p>
        <p>
          <br />
          <b>Why stop in 2008?</b> By 2008, physical music media had become
          increasingly rare as streaming services gained popularity. While we
          could have considered using streaming numbers, there is or at least{" "}
          <strong>was</strong> something special about visiting a record store
          and picking up the latest single from your favorite band or artist.
        </p>
      </div>
      <div className="flex justify-center items-center mt-4">
        <div className="circular-image-container">
          <img src={rickyNelson} alt="Example" />
        </div>
      </div>
      <div className="text-center mt-2 info-text-ricky-box">
        <p>
          🎉 Ricky Nelson (1940-1985) had the first-ever Hot 100 #1 in 1958.{" "}
          <Link to="/songs/ricky-nelson-poor-little-fool">
            Now, go listen to and rate that song!
          </Link>
        </p>
      </div>
      <p>
        {isAuthenticated && (
          <div className="text-center ">
            <br />
            <p>
              <a href="mailto:contact@pophits.org">✉️ Contact PopHits.org</a>
            </p>
          </div>
        )}
      </p>
    </div>
  );
};

export default About;
