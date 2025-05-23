import React, { useState } from "react";
import { Button, Select, Spin, message } from "antd";
import { generateQuiz } from "../../services/api";

const { Option } = Select;

const QuizGenerator = () => {
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
  const [revealedAnswers, setRevealedAnswers] = useState([]); // State to track which answers are revealed

  const handleGenerateQuiz = async () => {
    if (selectedDecades.length === 0) {
      setErrorMessage("Please select at least one decade.");
      return;
    }

    setLoading(true);
    setErrorMessage(""); // Clear previous error message
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
        setRevealedAnswers(new Array(data.length).fill(false)); // Initialize revealedAnswers state
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
    <div className="p-4 min-h-screen">
      <h1 className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center">
      🤷‍♂️ Hit Song Quiz Generator
      </h1>

      <div className="mb-4">
        <p className="mb-6 text-center md:text-left text-sm md:text-lg">
          Generate your random hit song quiz questions and filter by decades and
          how big or obscure hits you want to include.
        </p>
      </div>

      <div className="w-full">
        <div className="mb-4 border border-gray-300 p-4 bg-gray-50 w-full">
          <span className="block mb-2 text-lg font-semibold">
            Select Decades:
          </span>
          <Select
            mode="multiple"
            value={selectedDecades}
            onChange={(values) => setSelectedDecades(values)}
            className="w-full"
          >
            {decadesOptions.map(({ label, value }) => (
              <Option key={value} value={value}>
                {label}
              </Option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <div className="flex flex-col border border-gray-300 p-4 bg-gray-50 w-full md:w-1/3">
            <span className="mb-2 text-lg font-semibold">
              Select Number of Questions:
            </span>
            <Select
              value={numSongs}
              onChange={(value) => setNumSongs(value)}
              className="w-full text-lg"
            >
              {[10, 20, 25, 50, 100].map((num) => (
                <Option key={num} value={num}>
                  {num}
                </Option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col border border-gray-300 p-4 bg-gray-50 w-full md:w-1/3">
            <span className="mb-2 text-lg font-semibold">
              Hit Level (1 = #1 hits, 10 = obscure):
            </span>
            <Select
              value={hitLevel}
              onChange={(value) => setHitLevel(value)}
              className="w-full text-lg"
            >
              {[...Array(10).keys()].map((level) => (
                <Option key={level + 1} value={level + 1}>
                  {level + 1}
                </Option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col justify-end gap-4 w-full md:w-1/3">
            <Button
              onClick={handleGenerateQuiz}
              className="w-full px-6 py-3 text-lg text-white border border-pink-300 flex items-center justify-center hover:bg-blue-600 bg-pink-400"
            >
              <svg
                className="w-5 h-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12l5 5L20 7"
                />
              </svg>
              Generate Quiz
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <Spin tip="Generating quiz..." />
        </div>
      ) : (
        <>
          {errorMessage ? (
            <div className="text-center text-red-500 mt-4">{errorMessage}</div>
          ) : (
            quizQuestions.length > 0 && (
              <div className="mt-4">
                <ul>
                  {quizQuestions.map((question, index) => (
                    <li key={index} className="mb-4">
                      <strong className="mr-2">
  {index + 1}:
</strong>
<span>{question.question}</span>
                      <br />
                      {!revealedAnswers[index] && (
                        <Button
                          type="primary"
                          onClick={() => toggleAnswerVisibility(index)}
                          className="bg-pink-400 text-white hover:bg-blue-600 hover:text-white px-2 py-1 text-sm"
                        >
                          Show Answer
                        </Button>
                      )}
                      {revealedAnswers[index] && (
                        <>
                          {/* Add a line between question and answer */}
                          <strong>Answer: </strong>
                          {question.answer}
                        </>
                      )}
                      <div className="border-t my-2" />{" "}
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default QuizGenerator;
