import { useState } from "react";
import { Button, Select, Spin } from "antd";
import { generateQuiz } from "../../services/api";
import { HelpCircle, RefreshCw, Calendar, BarChart2, Eye, EyeOff } from "lucide-react";

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
      <h1 className="text-2xl md:text-4xl px-1 py-1 font-cherry font-bold mb-6 text-center text-pink-500 flex items-center justify-center gap-3">
  <HelpCircle className="w-8 h-8" />
  <span>Hit Song Quiz Generator</span>
</h1>


      <div className="mb-8">
        <p className="text-center text-gray-700 text-lg max-w-3xl mx-auto">
          Test your music knowledge with custom quizzes about hit songs from your favorite decades.
          Choose how many questions and adjust the difficulty level from famous #1 hits to obscure gems.
        </p>
      </div>

      <div className="w-full">
        <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-6 h-6 text-pink-500" />
            <span className="text-lg font-semibold text-gray-700">
              Select Decades:
            </span>
          </div>
          <Select
            mode="multiple"
            value={selectedDecades}
            onChange={(values) => setSelectedDecades(values)}
            className="w-full"
            placeholder="Select one or more decades"
            maxTagCount={6}
          >
            {decadesOptions.map(({ label, value }) => (
              <Option key={value} value={value}>
                {label}
              </Option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-sm w-full md:w-1/3 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <HelpCircle className="w-6 h-6 text-pink-500" />
              <span className="text-lg font-semibold text-gray-700">
                Number of Questions:
              </span>
            </div>
            <Select
              value={numSongs}
              onChange={(value) => setNumSongs(value)}
              className="w-full"
              size="large"
            >
              {[10, 20, 25, 50, 100].map((num) => (
                <Option key={num} value={num}>
                  {num} questions
                </Option>
              ))}
            </Select>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-sm w-full md:w-1/3 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <BarChart2 className="w-6 h-6 text-pink-500" />
              <span className="text-lg font-semibold text-gray-700">
                Hit Level:
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2">1 = #1 hits, 10 = obscure hits</p>
            <Select
              value={hitLevel}
              onChange={(value) => setHitLevel(value)}
              className="w-full"
              size="large"
            >
              {[...Array(10).keys()].map((level) => (
                <Option key={level + 1} value={level + 1}>
                  Level {level + 1}
                </Option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col justify-end gap-4 w-full md:w-1/3">
            <Button
              onClick={handleGenerateQuiz}
              className="w-full px-6 py-3 text-lg text-pink-400 hover:text-pink-500 rounded-xl shadow-md flex items-center justify-center transition-all duration-200 ease-in-out"
              size="large"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Generate Quiz
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Spin size="large" tip={<span className="mt-3 text-gray-600">Creating your quiz questions...</span>} />
          </div>
        </div>
      ) : (
        <>
          {errorMessage ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mt-6 text-center">
              <p className="font-medium">{errorMessage}</p>
              <p className="text-sm mt-2">Try adjusting your filters to find more songs.</p>
            </div>
          ) : (
            quizQuestions.length > 0 && (
              <div className="mt-6">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-center text-gray-700">
                      Your Custom Quiz ({quizQuestions.length} Questions)
                    </h2>
                  </div>
                  
                  <ul className="divide-y divide-gray-200">
                    {quizQuestions.map((question, index) => (
                      <li key={index} className="p-5 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start">
                          <div className="bg-pink-100 text-pink-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-lg font-medium text-gray-800 mb-3">{question.question}</p>
                            
                            {!revealedAnswers[index] ? (
                              <Button
                                onClick={() => toggleAnswerVisibility(index)}
                                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-lg shadow-sm hover:from-pink-600 hover:to-pink-700 transition-all duration-300"
                              >
                                <Eye className="w-4 h-4" />
                                Show Answer
                              </Button>
                            ) : (
                              <div className="bg-green-50 border border-green-100 rounded-lg p-4 animate-fadeIn">
                                <div className="flex  gap-2 mb-1">
                                  <EyeOff className="w-4 h-4 text-green-600" />
                                  <span className="font-semibold text-green-800">Answer:</span>
                                </div>
                                <p className="text-green-900">{question.answer}</p>
                                <Button
                                  onClick={() => toggleAnswerVisibility(index)}
                                  className="mt-2 text-xs text-green-700 hover:text-green-900 bg-green-100 border-none shadow-none"
                                >
                                  Hide Answer
                                </Button>
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
};

export default QuizGenerator;
