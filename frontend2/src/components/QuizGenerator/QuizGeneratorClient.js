"use client";

import { useState } from "react";
import { HelpCircle, RefreshCw, Calendar, BarChart2, Eye, EyeOff } from "lucide-react";
import { generateQuiz } from "@/lib/api";

export default function QuizGeneratorClient() {
  const [numSongs, setNumSongs] = useState(10);
  const [hitLevel, setHitLevel] = useState(1);
  const [loading, setLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedDecades, setSelectedDecades] = useState([
    "1950",
    "1960",
    "1970",
    "1980",
    "1990",
    "2000",
    "2010",
    "2020",
  ]);
  const [errorMessage, setErrorMessage] = useState("");
  const [revealedAnswers, setRevealedAnswers] = useState([]);

  const handleGenerateQuiz = async () => {
    if (selectedDecades.length === 0) {
      setErrorMessage("Please select at least one decade.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    try {
      console.log("Generating quiz with params:", {
        numSongs,
        hitLevel,
        selectedDecades,
      });
      const data = await generateQuiz(numSongs, hitLevel, selectedDecades);
      if (data.length === 0) {
        setErrorMessage("No songs match the criteria.");
      } else {
        setQuizQuestions(data);
        setRevealedAnswers(new Array(data.length).fill(false));
      }
    } catch (error) {
      console.error("Failed to generate quiz:", error);
      setErrorMessage("No songs available for the given criteria.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAnswerVisibility = (index) => {
    setRevealedAnswers((prev) =>
      prev.map((revealed, i) => (i === index ? !revealed : revealed))
    );
  };

  const decadesOptions = [
    { label: "1950s", value: "1950" },
    { label: "1960s", value: "1960" },
    { label: "1970s", value: "1970" },
    { label: "1980s", value: "1980" },
    { label: "1990s", value: "1990" },
    { label: "2000s", value: "2000" },
    { label: "2010s", value: "2010" },
    { label: "2020s", value: "2020" },
  ];

  return (
    <div className="w-full">
      <div className="mb-6 bg-yellow-50 p-5 rounded-xl shadow-sm border border-slate-300">
        <div className="flex items-center gap-3 mb-3">
          <Calendar className="w-6 h-6 text-amber-600" />
          <span className="text-lg font-semibold text-slate-900">
            Select Decades:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {decadesOptions.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => {
                if (selectedDecades.includes(value)) {
                  setSelectedDecades(selectedDecades.filter(decade => decade !== value));
                } else {
                  setSelectedDecades([...selectedDecades, value]);
                }
              }}
              className={`px-4 py-2 rounded-lg transition-colors border ${
                selectedDecades.includes(value)
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
        <div className="bg-yellow-50 p-5 rounded-xl shadow-sm w-full md:w-1/3 transition-all duration-300 hover:shadow-md border border-slate-300">
          <div className="flex items-center gap-3 mb-3">
            <HelpCircle className="w-6 h-6 text-amber-600" />
            <span className="text-lg font-semibold text-slate-900">
              Number of Questions:
            </span>
          </div>
          <select
            value={numSongs}
            onChange={(e) => setNumSongs(Number(e.target.value))}
            className="w-full p-2 border border-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-900"
          >
            {[10, 20, 25, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num} questions
              </option>
            ))}
          </select>
        </div>

        <div className="bg-yellow-50 p-5 rounded-xl shadow-sm w-full md:w-1/3 transition-all duration-300 hover:shadow-md border border-slate-300">
          <div className="flex items-center gap-3 mb-3">
            <BarChart2 className="w-6 h-6 text-amber-600" />
            <span className="text-lg font-semibold text-slate-900">
              Hit Level:
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-2">1 = #1 hits, 10 = obscure hits</p>
          <select
            value={hitLevel}
            onChange={(e) => setHitLevel(Number(e.target.value))}
            className="w-full p-2 border border-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-900"
          >
            {[...Array(10).keys()].map((level) => (
              <option key={level + 1} value={level + 1}>
                Level {level + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col justify-end gap-4 w-full md:w-1/3">
          <button
            onClick={handleGenerateQuiz}
            disabled={loading}
            className="w-full px-6 py-3 text-lg bg-slate-900 text-white rounded-xl shadow-md hover:bg-slate-700 flex items-center justify-center transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                Generate Quiz
              </>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-slate-700">Creating your quiz questions...</p>
          </div>
        </div>
      ) : (
        <>
          {errorMessage ? (
            <div className="bg-red-50 border border-red-300 text-red-700 px-6 py-4 rounded-xl mt-6 text-center">
              <p className="font-medium">{errorMessage}</p>
              <p className="text-sm mt-2">Try adjusting your filters to find more songs.</p>
            </div>
          ) : (
            quizQuestions.length > 0 && (
              <div className="mt-6">
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-400">
                  <div className="bg-slate-50 p-4 border-b border-slate-300">
                    <h2 className="text-xl font-semibold text-center text-slate-900">
                      Your Custom Quiz ({quizQuestions.length} Questions)
                    </h2>
                  </div>
                  
                  <ul className="divide-y divide-slate-300">
                    {quizQuestions.map((question, index) => (
                      <li key={index} className="p-5 hover:bg-yellow-50 transition-colors">
                        <div className="flex items-start">
                          <div className="bg-amber-100 text-amber-900 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-lg font-medium text-slate-900 mb-3">{question.question}</p>
                            
                            {!revealedAnswers[index] ? (
                              <button
                                onClick={() => toggleAnswerVisibility(index)}
                                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-slate-700 transition-all duration-300"
                              >
                                <Eye className="w-4 h-4" />
                                Show Answer
                              </button>
                            ) : (
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 animate-fadeIn">
                                <div className="flex gap-2 mb-1">
                                  <EyeOff className="w-4 h-4 text-amber-700" />
                                  <span className="font-semibold text-amber-900">Answer:</span>
                                </div>
                                <p className="text-amber-900">{question.answer}</p>
                                <button
                                  onClick={() => toggleAnswerVisibility(index)}
                                  className="mt-2 text-xs text-amber-700 hover:text-amber-900 bg-amber-100 border-none shadow-none px-2 py-1 rounded"
                                >
                                  Hide Answer
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}
