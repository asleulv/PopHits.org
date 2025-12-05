// src/app/charts/page.js
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getChartDates } from "@/lib/api";

const YEARS = Array.from({ length: 68 }, (_, i) => 1958 + i);

export default function ChartsPage() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedDate, setSelectedDate] = useState(null);
  const [allAvailableDates, setAllAvailableDates] = useState([]); // All dates once
  const [availableDates, setAvailableDates] = useState([]); // Filtered by month
  const [availableMonths, setAvailableMonths] = useState([]); // Year-specific months
  const [loading, setLoading] = useState(false);

  // Fetch ALL dates once on mount
  useEffect(() => {
    const fetchAllDates = async () => {
      setLoading(true);
      try {
        const { dates } = await getChartDates();
        setAllAvailableDates(dates);
      } catch (error) {
        console.error("Error fetching dates:", error);
      }
      setLoading(false);
    };
    fetchAllDates();
  }, []);

  // Filter by year/month when they change
  useEffect(() => {
    if (allAvailableDates.length === 0) return;

    // Filter dates for current year/month
    const yearDates = allAvailableDates.filter(date => 
      date.startsWith(selectedYear.toString())
    );
    const filtered = yearDates.filter(date => {
      const [year, month] = date.split("-");
      return year === selectedYear.toString() && month === selectedMonth;
    });
    
    setAvailableDates(filtered);

    // Filter available months for this year
    const yearMonthsSet = new Set(
      yearDates.map(date => date.split("-")[1])
    );
    const filteredMonths = months.filter(month => 
      yearMonthsSet.has(month.value)
    );
    setAvailableMonths(filteredMonths);

    // Auto-select first available date or reset
    if (filtered.length > 0) {
      setSelectedDate(filtered[0]);
    } else {
      setSelectedDate(null);
    }

    // Reset month to first available if current month has no charts
    if (filteredMonths.length > 0 && !filteredMonths.some(m => m.value === selectedMonth)) {
      setSelectedMonth(filteredMonths[0].value);
    }
  }, [selectedYear, selectedMonth, allAvailableDates]);

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

  const currentMonth = months.find((m) => m.value === selectedMonth)?.label;

  // Generate all days in the month
  const getDaysInMonth = (year, month) => {
    return new Date(year, parseInt(month), 0).getDate();
  };

  const totalDays = getDaysInMonth(selectedYear, selectedMonth);
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const availableDateSet = new Set(availableDates);

  // Build calendar with chart release separators
  const renderCalendarDays = () => {
    const elements = [];
    const weekStartDates = new Set();

    // Find all weeks that contain chart dates
    availableDates.forEach((date) => {
      const [year, month, day] = date.split("-").map(Number);
      const dateObj = new Date(year, month - 1, day);
      const weekStart = new Date(dateObj);
      weekStart.setDate(dateObj.getDate() - dateObj.getDay()); // Sunday start
      const weekKey = weekStart.toISOString().split("T")[0];
      weekStartDates.add(weekKey);
    });

    daysArray.forEach((day) => {
      const dateString = `${selectedYear}-${selectedMonth}-${String(day).padStart(2, "0")}`;
      const dateObj = new Date(selectedYear, parseInt(selectedMonth) - 1, day);
      const weekStart = new Date(dateObj);
      weekStart.setDate(dateObj.getDate() - dateObj.getDay());
      const weekKey = weekStart.toISOString().split("T")[0];

      const isChartWeek = weekStartDates.has(weekKey);
      const isExactChartDate = availableDateSet.has(dateString);
      const isSelected = dateString === selectedDate;

      elements.push(
        <button
          key={dateString}
          onClick={() => setSelectedDate(dateString)}
          disabled={!isChartWeek}
          className={`py-2 px-3 border-2 font-semibold text-sm transition-colors ${
            isSelected
              ? "bg-black text-white border-black cursor-pointer"
              : isExactChartDate
              ? "bg-green-500 text-white border-green-600 cursor-pointer"
              : isChartWeek
              ? "bg-green-50 border-green-300 hover:bg-green-100 cursor-pointer"
              : "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
          }`}
          title={
            !isChartWeek
              ? "No charts this week"
              : isExactChartDate
              ? "Exact chart date"
              : "Chart week"
          }
        >
          {day}
        </button>
      );
    });

    return elements;
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl text-center font-cherry mb-6">
          Hot 100 Chart Archives
        </h1>

        <div className="mb-8 space-y-4">
          {/* Year Selector */}
          <div>
            <label className="block font-bold mb-2">Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-4 py-2 border-2 border-black"
              disabled={loading}
            >
              {YEARS.reverse().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Month Selector - ONLY months with charts for selected year */}
          <div>
            <label className="block font-bold mb-2">Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border-2 border-black"
              disabled={loading || availableMonths.length === 0}
            >
              {availableMonths.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          {/* Calendar Grid */}
          <div>
            <label className="block font-bold mb-4">
              {currentMonth} {selectedYear}: Click any date to view chart
            </label>
            {loading ? (
              <div className="w-full px-4 py-2 border-2 border-black bg-gray-100">
                Loading dates...
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-2 border-2 border-black p-4 bg-white">
                {/* Day headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center font-bold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
                {/* Empty cells for days before month starts */}
                {Array.from({
                  length: new Date(selectedYear, parseInt(selectedMonth) - 1, 1).getDay(),
                }).map((_, i) => (
                  <div key={`empty-${i}`} className="py-2" />
                ))}
                {/* Calendar days */}
                {renderCalendarDays()}
              </div>
            )}
          </div>

          {/* View Chart Button - Only if valid chart date */}
          {selectedDate && (
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
