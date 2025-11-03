'use client';

import { useState } from 'react';
import Link from 'next/link';

const MONTHS = [
  { num: '01', name: 'January' },
  { num: '02', name: 'February' },
  { num: '03', name: 'March' },
  { num: '04', name: 'April' },
  { num: '05', name: 'May' },
  { num: '06', name: 'June' },
  { num: '07', name: 'July' },
  { num: '08', name: 'August' },
  { num: '09', name: 'September' },
  { num: '10', name: 'October' },
  { num: '11', name: 'November' },
  { num: '12', name: 'December' },
];

export default function BirthdayPage() {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [name, setName] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1939 }, (_, i) => 1940 + i).reverse();

  const daysInMonth = (y, m) => new Date(y, m, 0).getDate();
  const maxDays = year && month ? daysInMonth(parseInt(year), parseInt(month)) : 31;
  const days = Array.from({ length: maxDays }, (_, i) => i + 1);

  const isValidDate = () => {
    if (!year || !month || !day) return false;
    const selected = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    return selected < today;
  };

  const dateString = year && month && day ? `${year}-${month}-${day}` : '';

  return (
    <div className="min-h-screen bg-yellow-50 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        {/* Newspaper Header */}
        <div className="mb-8 border-4 border-black bg-black text-white p-6 text-center">
          <div className="text-sm tracking-widest mb-2 font-black">
            POPHITS.ORG PRESENTS
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-3">
            HOT 100
          </h1>
          <div className="text-sm font-black">
            FOR THE WEEK YOU WERE BORN
          </div>
        </div>

        {/* Input Form */}
        <div className="border-4 border-black bg-white p-8 mb-6">
          {/* Year Picker */}
          <div className="mb-6">
            <label className="block text-sm font-black text-gray-900 mb-2">
              Select Year
            </label>
            <select
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setMonth('');
                setDay('');
              }}
              className="w-full px-4 py-3 border-2 border-black text-black font-black focus:outline-none focus:ring-2 focus:ring-black cursor-pointer text-lg"
            >
              <option value="">Choose a year...</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Month Picker */}
          {year && (
            <div className="mb-6 animate-in">
              <label className="block text-sm font-black text-gray-900 mb-2">
                Select Month
              </label>
              <div className="grid grid-cols-3 gap-2">
                {MONTHS.map((m) => (
                  <button
                    key={m.num}
                    onClick={() => {
                      setMonth(m.num);
                      setDay('');
                    }}
                    className={`py-2 px-3 border-2 font-black text-sm transition-all ${
                      month === m.num
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-black hover:bg-gray-100'
                    }`}
                  >
                    {m.name.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Day Picker */}
          {month && (
            <div className="mb-6 animate-in">
              <label className="block text-sm font-black text-gray-900 mb-2">
                Select Day
              </label>
              <div className="grid grid-cols-7 gap-1">
                {days.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDay(String(d).padStart(2, '0'))}
                    className={`py-2 px-1 border-2 font-black text-xs transition-all ${
                      day === String(d).padStart(2, '0')
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-black hover:bg-gray-100'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Name Input */}
          {day && (
            <div className="mb-6 animate-in">
              <label className="block text-sm font-black text-gray-900 mb-2">
                Your Name (optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g., John"
                className="w-full px-4 py-3 border-2 border-black text-black font-bold focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          )}

          {/* Button */}
          {isValidDate() ? (
            <Link
              href={`/birthday/${dateString}${name ? `?name=${encodeURIComponent(name)}` : ''}`}
              className="block w-full bg-black text-gray-200 hover:text-white font-black py-4 text-center hover:bg-gray-800 border-2 border-black transition-all text-lg"
            >
              See Your Chart
            </Link>
          ) : (
            <button
              disabled
              className="block w-full bg-gray-400 text-gray-600 font-black py-4 text-center cursor-not-allowed border-2 border-gray-400 text-lg"
            >
              See Your Chart
            </button>
          )}
        </div>

        <p className="font-cherry text-center text-gray-700 text-lg">
          Works with any date from 1958 onwards!
        </p>
      </div>
    </div>
  );
}
