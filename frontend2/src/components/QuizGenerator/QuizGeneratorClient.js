"use client";

import { useState } from "react";
import { HelpCircle, RefreshCw, Calendar, BarChart2, Eye, EyeOff, Loader2, AlertOctagon } from "lucide-react";
import { generateQuiz } from "@/lib/api";

export default function QuizGeneratorClient() {
  const [numSongs, setNumSongs] = useState(10);
  const [hitLevel, setHitLevel] = useState(1);
  const [loading, setLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedDecades, setSelectedDecades] = useState([
    "1950", "1960", "1970", "1980", "1990", "2000", "2010", "2020",
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
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      
      {/* 1. Decade Selection Selection */}
      <div className="bg-white border-2 border-black p-6">
        <div className="flex items-center gap-3 mb-6 border-b-2 border-black pb-2">
          <Calendar size={20} />
          <span className="text-lg font-black italic uppercase tracking-tighter">Temporal Selection</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
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
              className={`py-2 font-black italic uppercase text-xs border-2 border-black transition-colors ${
                selectedDecades.includes(value)
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-yellow-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quantity Card */}
        <div className="bg-white border-2 border-black p-5">
          <div className="flex items-center gap-2 mb-4 opacity-40">
            <HelpCircle size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Question Count</span>
          </div>
          <select
            value={numSongs}
            onChange={(e) => setNumSongs(Number(e.target.value))}
            className="w-full bg-transparent border-b-2 border-black py-1 font-black italic text-xl outline-none appearance-none"
          >
            {[10, 20, 25, 50, 100].map((num) => (
              <option key={num} value={num}>{num} Questions</option>
            ))}
          </select>
        </div>

        {/* Intensity Card */}
        <div className="bg-white border-2 border-black p-5">
          <div className="flex items-center gap-2 mb-4 opacity-40">
            <BarChart2 size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Saturation</span>
          </div>
          <select
            value={hitLevel}
            onChange={(e) => setHitLevel(Number(e.target.value))}
            className="w-full bg-transparent border-b-2 border-black py-1 font-black italic text-xl outline-none appearance-none"
          >
            {[...Array(10).keys()].map((level) => (
              <option key={level + 1} value={level + 1}>Hit Level {level + 1}</option>
            ))}
          </select>
        </div>

        {/* Generate Button */}
        <div className="flex flex-col justify-end">
          <button
            onClick={handleGenerateQuiz}
            disabled={loading}
            className="w-full bg-black text-white py-4 font-black uppercase italic text-xl border-2 border-black hover:bg-amber-500 hover:text-black transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Initialize Quiz"}
          </button>
        </div>
      </div>

      {/* Results Area */}
      <div className="pt-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-black/20">
             <Loader2 size={40} className="animate-spin text-black mb-4" />
             <p className="font-black uppercase italic tracking-widest text-xs">Formulating Challenges...</p>
          </div>
        ) : (
          <>
            {errorMessage ? (
              <div className="bg-red-600 text-white border-2 border-black p-4 text-center font-black uppercase italic">
                <AlertOctagon className="inline-block mr-2" /> {errorMessage}
              </div>
            ) : (
              quizQuestions.length > 0 && (
                <div className="border-2 border-black bg-white overflow-hidden">
                  <div className="bg-black text-white p-3">
                    <h2 className="font-black italic uppercase tracking-tighter text-lg">
                      Quiz Archive Retrieval // {quizQuestions.length} Questions
                    </h2>
                  </div>
                  
                  <ul className="divide-y-2 divide-black/5">
                    {quizQuestions.map((question, index) => (
                      <li key={index} className="p-6 hover:bg-yellow-50/50 transition-colors">
                        <div className="flex items-start">
                          <div className="bg-black text-white font-black italic text-sm w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 space-y-4">
                            <p className="text-xl font-black uppercase italic tracking-tighter leading-tight">
                              {question.question}
                            </p>
                            
                            {!revealedAnswers[index] ? (
                              <button
                                onClick={() => toggleAnswerVisibility(index)}
                                className="flex items-center gap-2 bg-white border-2 border-black px-4 py-2 font-black uppercase italic text-xs hover:bg-black hover:text-white transition-all"
                              >
                                <Eye size={14} />
                                Show Answer
                              </button>
                            ) : (
                              <div className="border-2 border-amber-500 bg-amber-50 p-4 animate-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center gap-2 mb-2 text-amber-700">
                                  <EyeOff size={16} />
                                  <span className="font-black uppercase italic text-xs tracking-widest">Answer:</span>
                                </div>
                                <p className="text-lg font-black uppercase tracking-tight text-black">
                                  {question.answer}
                                </p>
                                <button
                                  onClick={() => toggleAnswerVisibility(index)}
                                  className="mt-4 text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black"
                                >
                                  [ Hide Answer ]
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}