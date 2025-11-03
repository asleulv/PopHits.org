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
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDates = async () => {
      setLoading(true);
      try {
        const { dates } = await getChartDates();
        const filtered = dates.filter((date) => {
          const [year, month] = date.split("-");
          return year === selectedYear.toString() && month === selectedMonth;
        });
        setAvailableDates(filtered);
        if (filtered.length > 0) {
          setSelectedDate(filtered[0]);
        } else {
          setSelectedDate(null);
        }
      } catch (error) {
        console.error("Error fetching dates:", error);
      }
      setLoading(false);
    };

    fetchDates();
  }, [selectedYear, selectedMonth]);

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
  // Build calendar without separators
  const renderCalendarDays = () => {
    const elements = [];

    daysArray.forEach((day) => {
      const dateString = `${selectedYear}-${selectedMonth}-${String(
        day
      ).padStart(2, "0")}`;
      const isChartDate = availableDateSet.has(dateString);
      const isSelected = dateString === selectedDate;

      elements.push(
        <button
          key={dateString}
          onClick={() => setSelectedDate(dateString)}
          className={`py-2 px-3 border-2 font-semibold text-sm transition-colors ${
            isSelected
              ? "bg-black text-white border-black cursor-pointer"
              : isChartDate
              ? "bg-green-50 border-green-600 hover:bg-green-100 cursor-pointer"
              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50 cursor-pointer"
          }`}
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
            >
              {YEARS.reverse().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Month Selector */}
          <div>
            <label className="block font-bold mb-2">Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border-2 border-black"
            >
              {months.map((month) => (
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
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center font-bold text-gray-600 py-2"
                    >
                      {day}
                    </div>
                  )
                )}
                {/* Empty cells for days before month starts */}
                {Array.from({
                  length: new Date(
                    selectedYear,
                    parseInt(selectedMonth) - 1,
                    1
                  ).getDay(),
                }).map((_, i) => (
                  <div key={`empty-${i}`} className="py-2" />
                ))}
                {/* Calendar days with separators at new chart releases */}
                {renderCalendarDays()}
              </div>
            )}
          </div>

          {/* View Chart Button */}
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
