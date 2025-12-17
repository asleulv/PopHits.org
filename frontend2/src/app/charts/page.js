// src/app/charts/page.js
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getChartDates } from "@/lib/api";

const YEARS = Array.from({ length: 68 }, (_, i) => 1958 + i);
const FIRST_CHART_DATE = "1958-08-04"; // Hot 100 debut

 const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

export default function ChartsPage() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedDate, setSelectedDate] = useState(null);
  const [allAvailableDates, setAllAvailableDates] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper: check if date is before Hot 100 existed
  const isBeforeFirstChart = (dateString) => {
    return dateString < FIRST_CHART_DATE;
  };

  // Fetch all chart dates once
  useEffect(() => {
    const fetchAllDates = async () => {
      setLoading(true);
      try {
        const { dates } = await getChartDates();
        setAllAvailableDates(dates);
      } catch (err) {
        console.error("Error fetching chart dates:", err);
      }
      setLoading(false);
    };
    fetchAllDates();
  }, []);

 
  const currentMonth = months.find((m) => m.value === selectedMonth)?.label;

  // Handle year/month filters
  useEffect(() => {
    if (!allAvailableDates.length) return;

    const yearDates = allAvailableDates.filter((d) =>
      d.startsWith(selectedYear.toString())
    );

    const filtered = yearDates.filter((date) => {
      const [, month] = date.split("-");
      return month === selectedMonth;
    });

    setAvailableDates(filtered);

    // Set available months
    const yearMonthsSet = new Set(yearDates.map((d) => d.split("-")[1]));
    const filteredMonths = months.filter((m) => yearMonthsSet.has(m.value));
    setAvailableMonths(filteredMonths);

    // Auto-select first valid date
    if (filtered.length > 0) {
      setSelectedDate(filtered[0]);
    } else {
      setSelectedDate(null);
    }

    // Fix month if invalid
    if (
      filteredMonths.length > 0 &&
      !filteredMonths.some((m) => m.value === selectedMonth)
    ) {
      setSelectedMonth(filteredMonths[0].value);
    }
  }, [selectedYear, selectedMonth, allAvailableDates]);

  // Get number of days in a month
  const getDaysInMonth = (year, month) =>
    new Date(year, parseInt(month), 0).getDate();

  const totalDays = getDaysInMonth(selectedYear, selectedMonth);
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

  const availableSet = new Set(availableDates);

  // Build full week ranges around each chart date
  const chartWeekDays = new Set();
  allAvailableDates.forEach((date) => {
    // ✅ Changed from availableDates
    const [y, m, d] = date.split("-").map(Number);
    const chartDate = new Date(y, m - 1, d);

    // Week range: Mon–Sun
    const day = chartDate.getDay() === 0 ? 7 : chartDate.getDay();
    const monday = new Date(chartDate);
    monday.setDate(chartDate.getDate() - (day - 1));

    for (let i = 0; i < 7; i++) {
      const candidate = new Date(monday);
      candidate.setDate(monday.getDate() + i);

      const ds = candidate.toISOString().split("T")[0];
      chartWeekDays.add(ds);
    }
  });

  const renderCalendarDays = () =>
    daysArray.map((day) => {
      const dateString = `${selectedYear}-${selectedMonth}-${String(
        day
      ).padStart(2, "0")}`;
      const isBeforeStart = isBeforeFirstChart(dateString);
      const isExactChart = availableSet.has(dateString);
      const isChartWeek = chartWeekDays.has(dateString) && !isBeforeStart;
      const isSelected = selectedDate === dateString;

      return (
        <button
          key={dateString}
          onClick={() => isChartWeek && setSelectedDate(dateString)}
          disabled={!isChartWeek}
          className={`py-2 px-3 border-2 text-sm font-semibold transition-colors ${
            isBeforeStart
              ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
              : isSelected
              ? "bg-black text-white border-black cursor-pointer"
              : isExactChart
              ? "bg-green-500 text-white border-green-600 cursor-pointer"
              : isChartWeek
              ? "bg-green-50 border-green-300 hover:bg-green-100 cursor-pointer"
              : "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
          }`}
          title={
            isBeforeStart
              ? "Hot 100 did not exist yet"
              : !isChartWeek
              ? "No charts this week"
              : isExactChart
              ? "Exact chart date"
              : "Chart week"
          }
        >
          {day}
        </button>
      );
    });

  // Only show button for valid, post-debut dates
  const isValidSelected =
    selectedDate && !isBeforeFirstChart(selectedDate) && availableSet.size > 0;

  return (
    <div className="min-h-screen bg-yellow-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl text-center font-cherry mb-6">
          Hot 100 Chart Archives
        </h1>

        <div className="mb-8 space-y-4">
          {/* YEAR SELECT */}
          <div>
            <label className="block font-bold mb-2">Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-4 py-2 border-2 border-black"
              disabled={loading}
            >
              {[...YEARS].reverse().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* MONTH SELECT */}
          <div>
            <label className="block font-bold mb-2">Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border-2 border-black"
              disabled={loading || availableMonths.length === 0}
            >
              {availableMonths.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* CALENDAR */}
          <div>
            <label className="block font-bold mb-4">
              {currentMonth} {selectedYear}: Click any date to view chart
            </label>

            {loading ? (
              <div className="px-4 py-2 border-2 border-black bg-gray-100">
                Loading dates...
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-2 border-2 border-black p-4 bg-white">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => (
                  <div
                    key={w}
                    className="text-center font-bold text-gray-600 py-2"
                  >
                    {w}
                  </div>
                ))}

                {/* Empty cells before month start */}
                {Array.from({
                  length: new Date(
                    selectedYear,
                    parseInt(selectedMonth) - 1,
                    1
                  ).getDay(),
                }).map((_, i) => (
                  <div key={"empty-" + i} className="py-2" />
                ))}

                {renderCalendarDays()}
              </div>
            )}
          </div>

          {/* VIEW BUTTON - Only for valid post-1958-08-04 dates */}
          {isValidSelected && (
            <Link
              href={`/charts/hot-100/${selectedDate}/`}
              className="w-full block bg-white text-black font-black py-3 text-center hover:bg-yellow-500 border-2 border-black"
            >
              View Chart for {selectedDate}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
