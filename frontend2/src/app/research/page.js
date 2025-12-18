"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getChartDates } from "@/lib/api";

const YEARS = Array.from({ length: 68 }, (_, i) => 1958 + i);
const FIRST_CHART_DATE = "1958-08-04";

export default function ChartsPage() {
  const [password, setPassword] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [allAvailableDates, setAllAvailableDates] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Safe Mount & Session Check
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("research_auth") === "true") {
        setHasAccess(true);
      }
    }
  }, []);

  const handleUnlock = (e) => {
    if (e) e.preventDefault();
    
    // Grab the key inside the function to avoid SSR issues
    const envKey = process.env.NEXT_PUBLIC_RESEARCH_PW;
    const input = password.toLowerCase().trim();
    const target = (envKey || "garthbrooks").toLowerCase().trim();

    if (input === target && target !== "") {
      sessionStorage.setItem("research_auth", "true");
      setHasAccess(true);
    } else {
      alert("Invalid Key.");
    }
  };

  // --- CHART LOGIC ---
  const isBeforeFirstChart = (dateString) => dateString < FIRST_CHART_DATE;

  useEffect(() => {
    if (!isMounted) return;
    const fetchAllDates = async () => {
      setLoading(true);
      try {
        const { dates } = await getChartDates();
        setAllAvailableDates(dates);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchAllDates();
  }, [isMounted]);

  useEffect(() => {
    if (!allAvailableDates.length) return;
    const yearDates = allAvailableDates.filter((d) => d.startsWith(selectedYear.toString()));
    const filtered = yearDates.filter((date) => date.split("-")[1] === selectedMonth);
    setAvailableDates(filtered);
    const monthsRef = [
        { value: "01", label: "January" }, { value: "02", label: "February" },
        { value: "03", label: "March" }, { value: "04", label: "April" },
        { value: "05", label: "May" }, { value: "06", label: "June" },
        { value: "07", label: "July" }, { value: "08", label: "August" },
        { value: "09", label: "September" }, { value: "10", label: "October" },
        { value: "11", label: "November" }, { value: "12", label: "December" },
    ];
    const yearMonthsSet = new Set(yearDates.map((d) => d.split("-")[1]));
    setAvailableMonths(monthsRef.filter((m) => yearMonthsSet.has(m.value)));
    if (filtered.length > 0) setSelectedDate(filtered[0]);
    else setSelectedDate(null);
  }, [selectedYear, selectedMonth, allAvailableDates]);

  // Calendar render math
  const availableSet = new Set(availableDates);
  const chartWeekDays = new Set();
  allAvailableDates.forEach((date) => {
    const [y, m, d] = date.split("-").map(Number);
    const chartDate = new Date(y, m - 1, d);
    const day = chartDate.getDay() === 0 ? 7 : chartDate.getDay();
    const monday = new Date(chartDate);
    monday.setDate(chartDate.getDate() - (day - 1));
    for (let i = 0; i < 7; i++) {
      const candidate = new Date(monday);
      candidate.setDate(monday.getDate() + i);
      chartWeekDays.add(candidate.toISOString().split("T")[0]);
    }
  });

  const renderCalendarDays = () => {
    const totalDays = new Date(selectedYear, parseInt(selectedMonth), 0).getDate();
    return Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
      const dateString = `${selectedYear}-${selectedMonth}-${String(day).padStart(2, "0")}`;
      const isBeforeStart = isBeforeFirstChart(dateString);
      const isExactChart = availableSet.has(dateString);
      const isChartWeek = chartWeekDays.has(dateString) && !isBeforeStart;
      const isSelected = selectedDate === dateString;

      return (
        <button
          key={dateString}
          type="button"
          onClick={() => isChartWeek && setSelectedDate(dateString)}
          disabled={!isChartWeek}
          className={`py-2 px-3 border-2 text-sm font-semibold ${
            isBeforeStart ? "bg-gray-100 border-gray-300 text-gray-400 opacity-50" :
            isSelected ? "bg-black text-white border-black" :
            isExactChart ? "bg-green-500 text-white border-green-600" :
            isChartWeek ? "bg-green-50 border-green-300 hover:bg-green-100" :
            "bg-gray-100 border-gray-300 text-gray-400 opacity-50"
          }`}
        >
          {day}
        </button>
      );
    });
  };

  // STOP RENDERING IF NOT MOUNTED (Fixes the kState error)
  if (!isMounted) return null;

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-white">
        <div className="max-w-md w-full border-4 border-yellow-500 p-8 bg-zinc-900 shadow-2xl">
          <h1 className="text-3xl font-black uppercase mb-6 italic">Research Portal</h1>
          <form onSubmit={handleUnlock}>
            <input
              type="password"
              className="w-full bg-zinc-800 border-2 border-zinc-700 p-3 mb-4 outline-none focus:border-yellow-500 text-white font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ENTER ACCESS KEY"
            />
            <button type="submit" className="w-full bg-yellow-500 text-black font-black py-3 uppercase hover:bg-yellow-400">
              Unlock Dataset
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 p-8 text-black">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-black mb-2 uppercase italic">Internal Hit Archive</h1>
        <div className="mb-8 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-black">
            <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="w-full p-2 border-2 border-black font-bold bg-white">
              {[...YEARS].reverse().map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-full p-2 border-2 border-black font-bold bg-white">
              {availableMonths.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-7 gap-2 border-2 border-black p-4 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => <div key={w} className="text-center font-black text-gray-400 py-2 uppercase text-xs">{w}</div>)}
            {Array.from({ length: new Date(selectedYear, parseInt(selectedMonth) - 1, 1).getDay() }).map((_, i) => <div key={i} />)}
            {renderCalendarDays()}
          </div>
          {selectedDate && !isBeforeFirstChart(selectedDate) && availableSet.size > 0 && (
            <Link href={`/research/hot-100/${selectedDate}/`} className="w-full block bg-black text-white font-black py-4 text-center hover:bg-yellow-500 hover:text-black border-2 border-black shadow-[8px_8px_0px_0px_rgba(234,179,8,1)] transition-colors">
              LOAD DATASET FOR {selectedDate}
            </Link>
          )}
          <button onClick={() => { sessionStorage.removeItem("research_auth"); window.location.reload(); }} className="mt-8 text-xs text-gray-400 underline italic">Logout</button>
        </div>
      </div>
    </div>
  );
}