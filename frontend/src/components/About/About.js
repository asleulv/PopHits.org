import { Link } from "react-router-dom";
import rickyNelson from "./ricky_nelson.jpg";
import { useAuth } from "../../services/auth";
import {
  Music,
  Info,
  Mail,
  ArrowRight,
  ShieldQuestion,
} from "lucide-react";

const About = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl px-1 py-1 font-cherry font-bold mb-6 text-center text-pink-500 flex items-center justify-center gap-3">
          <Info className="w-8 h-8" />
          <span>About PopHits.org</span>
        </h1>

        <div className="text-center text-lg text-gray-700 mb-6 flex items-center justify-center gap-2">
          <Music className="w-5 h-5 text-pink-500" />
          <span>From Ricky Nelson to Olivia Rodrigo...</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <p className="text-gray-700 mb-6 leading-relaxed">
            <span className="font-semibold text-gray-800">PopHits.org</span> is
            a website dedicated to exploring every hit single from 1958 to
            today. Our mission is to uncover hidden gems, curate unforgettable
            playlists, and provide user ratings for a growing database of over
            30,000 songs. Dive in—you might end up listening to them all!
          </p>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl mb-6">
            <div className="flex items-start gap-3 mb-2">
              <ShieldQuestion className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Why was this website created?
                </h3>
                <p className="text-gray-700">
                  This site was created to celebrate the songs that once ruled
                  the charts — not just as musical moments, but as cultural
                  snapshots. A hit song often tells us something about the time
                  it came from: how a jingly, psychedelic anthem could top the
                  charts in 1967, or how a polished, larger-than-life pop ballad
                  could dominate in 2011. Trends change, tastes evolve, and yet
                  music remains one of the most meaningful unimportant things in
                  life — soundtracking our highs, heartbreaks, and everything in
                  between.
                </p>
                <p className="text-gray-700 mt-3">
                  Whether you're here to dig up forgotten gems, relive musical
                  milestones, or simply build a killer playlist, this site
                  invites you to explore how pop music reflects who we were, and
                  who we are.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 rounded-xl shadow-lg mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="md:w-1/3 flex justify-center">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-pink-500 shadow-lg transform transition-transform hover:scale-105">
              <img
                src={rickyNelson}
                alt="Ricky Nelson"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="md:w-2/3">
            <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-pink-400 to-pink-300 bg-clip-text text-transparent">
              The First #1 Hit on the Hot 100
            </h3>
            <p className="text-gray-300 mb-4">
              Ricky Nelson (1940-1985) had the first-ever Hot 100 #1 in 1958
              with his song "Poor Little Fool". This marked the beginning of the
              chart era that PopHits.org celebrates.
            </p>
            <Link
              to="/songs/ricky-nelson-poor-little-fool"
              className="inline-flex items-center gap-2 hover:text-pink-200 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-lg shadow-sm hover:from-pink-600 hover:to-pink-700 transition-all duration-300"
            >
              Listen and rate this historic song{" "}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {isAuthenticated && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-sm text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Mail className="w-5 h-5 text-pink-500" />
            <h3 className="text-lg font-semibold text-gray-700">Contact Us</h3>
          </div>
          <a
            href="mailto:contact@pophits.org"
            className="text-pink-600 hover:text-pink-700 transition-colors font-medium"
          >
            contact@pophits.org
          </a>
        </div>
      )}
    </div>
  );
};

export default About;
