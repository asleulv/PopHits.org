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
  
  // Charts started in 1958. 
  // This creates a list from currentYear down to 1958.
  const years = Array.from(
    { length: currentYear - 1957 }, 
    (_, i) => 1958 + i
  ).reverse();

  const daysInMonth = (y, m) => new Date(y, m, 0).getDate();
  const maxDays = year && month ? daysInMonth(parseInt(year), parseInt(month)) : 31;
  const days = Array.from({ length: maxDays }, (_, i) => i + 1);

  const isValidDate = () => {
    if (!year || !month || !day) return false;
    
    const selected = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    
    // Hard limit: Billboard Hot 100 started August 4, 1958
    const chartStartDate = new Date(1958, 7, 4); 

    return selected >= chartStartDate && selected < today;
  };

  const dateString = year && month && day ? `${year}-${month}-${day}` : '';

  return (
    <div className="min-h-screen bg-yellow-50 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        {/* Newspaper Header */}
        <div className="mb-8 border-4 border-black bg-black text-white p-6 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-sm tracking-widest mb-2 font-black">
            POPHITS.ORG PRESENTS
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-3 italic">
            THE BIG ONES
          </h1>
          <div className="text-sm font-black uppercase">
            For the week you were born
          </div>
        </div>

        {/* Input Form */}
        <div className="border-4 border-black bg-white p-8 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {/* Year Picker */}
          <div className="mb-6">
            <label className="block text-sm font-black text-gray-900 mb-2 uppercase italic">
              1. Select Year
            </label>
            <select
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setMonth('');
                setDay('');
              }}
              className="w-full px-4 py-3 border-4 border-black text-black font-black focus:outline-none bg-yellow-50 cursor-pointer text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
            <div className="mb-6 animate-fadeIn">
              <label className="block text-sm font-black text-gray-900 mb-2 uppercase italic">
                2. Select Month
              </label>
              <div className="grid grid-cols-3 gap-2">
                {MONTHS.map((m) => {
                  // Basic check to disable months before August if 1958 is selected
                  const isDisabled1958 = year === '1958' && parseInt(m.num) < 8;
                  
                  return (
                    <button
                      key={m.num}
                      disabled={isDisabled1958}
                      onClick={() => {
                        setMonth(m.num);
                        setDay('');
                      }}
                      className={`py-2 px-3 border-2 font-black text-sm transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                        isDisabled1958 ? 'opacity-20 cursor-not-allowed bg-gray-100' :
                        month === m.num
                          ? 'bg-blue-950 text-white border-black translate-x-0.5 translate-y-0.5 shadow-none'
                          : 'bg-white text-black border-black hover:bg-yellow-400'
                      }`}
                    >
                      {m.name.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Day Picker */}
          {month && (
            <div className="mb-6 animate-fadeIn">
              <label className="block text-sm font-black text-gray-900 mb-2 uppercase italic">
                3. Select Day
              </label>
              <div className="grid grid-cols-7 gap-1">
                {days.map((d) => {
                  const dayStr = String(d).padStart(2, '0');
                  // Extra safety for 1958 start date
                  const isPreChart1958 = year === '1958' && month === '08' && d < 4;

                  return (
                    <button
                      key={d}
                      disabled={isPreChart1958}
                      onClick={() => setDay(dayStr)}
                      className={`py-2 px-1 border-2 font-black text-xs transition-all ${
                        isPreChart1958 ? 'opacity-20 cursor-not-allowed' :
                        day === dayStr
                          ? 'bg-blue-950 text-white border-black'
                          : 'bg-white text-black border-black hover:bg-yellow-400'
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Name Input */}
          {day && (
            <div className="mb-6 animate-fadeIn">
              <label className="block text-sm font-black text-gray-900 mb-2 uppercase italic">
                4. Your Name (optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g., John"
                className="w-full px-4 py-3 border-4 border-black text-black font-black focus:outline-none bg-yellow-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8">
            {isValidDate() ? (
              <Link
                href={`/birthday/${dateString}${name ? `?name=${encodeURIComponent(name)}` : ''}`}
                className="block w-full bg-white text-black font-black py-4 text-center hover:bg-yellow-400 border-4 border-black transition-all text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 uppercase tracking-widest"
              >
                See Your Chart →
              </Link>
            ) : (
              <div className="block w-full bg-gray-200 text-gray-400 font-black py-4 text-center border-4 border-gray-300 text-xl cursor-not-allowed uppercase tracking-widest">
                {year === '1958' && (parseInt(month) < 8 || (month === '08' && parseInt(day) < 4)) 
                  ? "Archive starts Aug 4" 
                  : "See Your Chart"}
              </div>
            )}
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="font-black uppercase italic text-blue-950 text-lg">
            Archive active from 1958 onwards
          </p>
          <p className="text-xs font-mono text-slate-500 uppercase">
            Note: Billboard Hot 100 data began August 4, 1958.
          </p>
        </div>
      </div>
    </div>
  );
}