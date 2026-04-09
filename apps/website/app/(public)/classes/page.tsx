"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllClasses } from "../../../lib/firebase/db";
import { useAuthContext } from "../../../context/AuthContext";
import type { ClassWithId } from "../../../types/class";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface UIClass extends Omit<ClassWithId, 'name' | 'description' | 'date'> {
  title: string;
  desc: string;
  date: string;
  time: string;
  seats: number;
  isFull: boolean;
  dateRaw: number;
}

function formatTimestamp(timestamp: number): { date: string; time: string } {
  const date = new Date(timestamp);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayNum = date.getDate();
  
  const dateStr = `${dayName}, ${monthName} ${dayNum}`;
  const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  
  return { date: dateStr, time: timeStr };
}

function transformClassData(firebaseClass: ClassWithId): UIClass {
  const { date: dateStr, time: timeStr } = formatTimestamp(firebaseClass.date);
  const seatsRemaining = firebaseClass.seatLimit - firebaseClass.seatsBooked;
  const isFull = firebaseClass.seatsBooked >= firebaseClass.seatLimit;
  
  return {
    ...firebaseClass,
    title: firebaseClass.name,
    desc: firebaseClass.description,
    date: dateStr,
    time: timeStr,
    seats: Math.max(0, seatsRemaining),
    isFull,
    dateRaw: firebaseClass.date,
  };
}

export default function ClassesPage() {
  const { user } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [topic, setTopic] = useState("All Topics");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [classes, setClasses] = useState<UIClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError(null);
        const firebaseClasses = await getAllClasses();
        const transformedClasses = firebaseClasses
          .filter(cls => cls.status === 'upcoming')
          .map(transformClassData)
          .sort((a, b) => a.date.localeCompare(b.date));
        setClasses(transformedClasses);
      } catch (err) {
        console.error('Failed to fetch classes:', err);
        setError('Failed to load classes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDate(null);
    setTopic("All Topics");
  };

  const filteredClasses = classes.filter(c => {
    if (searchTerm && !c.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (topic !== 'All Topics' && c.category !== topic) return false;
    if (selectedDate) {
      const classDate = new Date(c.dateRaw);
      if (
        classDate.getFullYear() !== selectedDate.getFullYear() ||
        classDate.getMonth() !== selectedDate.getMonth() ||
        classDate.getDate() !== selectedDate.getDate()
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <main className="w-full min-h-screen bg-[var(--color-dark-bg)]">
      <style dangerouslySetInnerHTML={{__html: `
        .class-card { background-color: var(--color-dark-bg); }
        @media (max-width: 767px) {
          .class-card:nth-child(even) { background-color: var(--color-dark-surface); }
        }
        @media (min-width: 768px) {
          .class-card:nth-child(4n-1), .class-card:nth-child(4n) { background-color: var(--color-dark-surface); }
        }
      `}} />

      {/* Section 2: Page Header */}
      <section className="pt-[32px] md:pt-[40px] pb-[24px] px-[24px] md:px-[40px] bg-[var(--color-dark-bg)] max-w-7xl mx-auto w-full flex flex-col items-start">
        <h1 className="font-display font-bold text-[28px] md:text-[38px] text-[var(--color-cream)] mb-[8px]">
          Browse Our Classes
        </h1>
        <p className="font-sans text-[16px] md:text-[18px] text-[rgba(245,237,214,0.55)] max-w-2xl mb-[24px]">
          Find a class that's right for you.
        </p>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="font-sans text-[16px] text-[var(--color-gold)] border border-[var(--color-gold)] px-[20px] py-[12px] rounded-[8px] hover:bg-[rgba(201,168,76,0.1)] transition-colors"
        >
          {showFilters ? "Hide Search" : "Search For A Specific Class"}
        </button>
      </section>

      {/* Section 3: Filter Bar */}
      <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${showFilters ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="w-full bg-[var(--color-dark-surface)]">
            <section className="max-w-7xl mx-auto px-[24px] md:px-[40px] py-[24px] flex flex-col md:flex-row gap-[16px] md:items-end">
            
            <div className="flex-[2] flex flex-col gap-[8px]">
              <label className="font-sans text-[11px] uppercase tracking-[0.05em] text-[rgba(245,237,214,0.55)] font-semibold">Search by name</label>
            <input 
              type="text"
              placeholder="e.g. Smartphones"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-[60px] md:min-h-[56px] md:h-[56px] bg-[var(--color-dark-bg)] border-[1.5px] border-[rgba(201,168,76,0.3)] focus:border-[var(--color-gold)] focus:outline-[3px] focus:outline-none focus:ring-[3px] focus:ring-[rgba(201,168,76,0.3)] rounded-[8px] px-[16px] text-[16px] text-[var(--color-cream)] w-full placeholder:text-[rgba(245,237,214,0.3)] transition-all"
            />
          </div>

          <div className="flex-[1] flex flex-col gap-[8px]">
            <label className="font-sans text-[11px] uppercase tracking-[0.05em] text-[rgba(245,237,214,0.55)] font-semibold">Topic</label>
            <div className="relative">
              <select 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="appearance-none h-[60px] md:min-h-[56px] md:h-[56px] bg-[var(--color-dark-bg)] border-[1.5px] border-[rgba(201,168,76,0.3)] focus:border-[var(--color-gold)] focus:outline-none focus:ring-[3px] focus:ring-[rgba(201,168,76,0.3)] rounded-[8px] px-[16px] text-[16px] text-[var(--color-cream)] w-full pr-[40px] transition-all"
              >
                <option value="All Topics">All Topics</option>
                <option value="Smartphones">Smartphones</option>
                <option value="Computers">Computers</option>
                <option value="Internet">Internet</option>
              </select>
              {/* Optional: Add custom arrow inside relative wrapper if needed */}
            </div>
          </div>

          <div className="flex-[1] flex flex-col gap-[8px]">
            <label className="font-sans text-[11px] uppercase tracking-[0.05em] text-[rgba(245,237,214,0.55)] font-semibold">Date</label>
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              placeholderText="Select a date"
              className="h-[60px] md:min-h-[56px] md:h-[56px] bg-[var(--color-dark-bg)] border-[1.5px] border-[rgba(201,168,76,0.3)] focus:border-[var(--color-gold)] focus:outline-none focus:ring-[3px] focus:ring-[rgba(201,168,76,0.3)] rounded-[8px] px-[16px] text-[16px] text-[var(--color-cream)] w-full placeholder:text-[rgba(245,237,214,0.3)] transition-all"
              dateFormat="MMMM d, yyyy"
              isClearable
              popperPlacement="bottom"
            />
          </div>

          <div className="flex justify-center md:h-[56px] items-center mt-[12px] md:mt-0 md:ml-[8px] shrink-0">
            <button 
              onClick={clearFilters} 
              className="font-sans text-[13px] text-[var(--color-teal)] border-b border-[var(--color-teal)] pb-[1px] hover:text-[#93c7c6] hover:border-[#93c7c6] hover:font-bold transition-all"
            >
              Clear filters
            </button>
          </div>
        </section>
      </div>
        </div>
      </div>

      {/* Section 4: Class Cards Grid */}
      <section className="max-w-7xl mx-auto px-[24px] md:px-[40px] pt-[32px] pb-[80px]">
        {loading ? (
          <div className="bg-[var(--color-dark-bg)] border border-dashed border-[rgba(245,237,214,0.1)] rounded-[10px] p-[32px] md:p-[48px] text-center max-w-2xl mx-auto mt-[16px]">
            <div className="flex flex-col items-center gap-[16px]">
              <div className="w-[40px] h-[40px] border-4 border-[rgba(201,168,76,0.3)] border-t-[var(--color-gold)] rounded-full animate-spin"></div>
              <p className="font-sans text-[16px] text-[rgba(245,237,214,0.7)]">Loading classes...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-[var(--color-dark-bg)] border border-dashed border-[rgba(245,237,214,0.1)] rounded-[10px] p-[32px] md:p-[48px] text-center max-w-2xl mx-auto mt-[16px]">
            <h3 className="font-sans text-[18px] font-medium text-[rgba(245,237,214,0.5)] mb-[12px]">{error}</h3>
            <p className="font-sans text-[14px] text-[rgba(245,237,214,0.3)]">
              Please give us a call at{' '}
              <a href="tel:1-800-555-1234" className="text-[var(--color-teal)] hover:text-[#93c7c6] transition-colors underline">1-800-555-1234</a>.
            </p>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="bg-[var(--color-dark-bg)] border border-dashed border-[rgba(245,237,214,0.1)] rounded-[10px] p-[32px] md:p-[48px] text-center max-w-2xl mx-auto mt-[16px]">
            <h3 className="font-sans text-[18px] font-medium text-[rgba(245,237,214,0.5)] mb-[12px]">No classes match your search</h3>
            <p className="font-sans text-[14px] text-[rgba(245,237,214,0.3)]">
              Try <button onClick={clearFilters} className="text-[var(--color-teal)] hover:text-[#93c7c6] transition-colors underline">clearing your filters</button> or give us a call at{' '}
              <a href="tel:1-800-555-1234" className="text-[var(--color-teal)] hover:text-[#93c7c6] transition-colors underline">1-800-555-1234</a>.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-[16px]">
              <p className="font-sans text-[13px] text-[rgba(245,237,214,0.45)]">Showing {filteredClasses.length} of {classes.length} classes</p>
              <p className="font-sans text-[12px] text-[var(--color-teal)]">Sorted by: soonest first</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[4px] border-[10px] border-transparent rounded-[10px] bg-transparent">
              {filteredClasses.map((cls) => {
                const isBooked = !!user?.bookedClasses?.[cls.id];
                return (
                  <div
                    key={cls.id}
                    className={`class-card p-[18px] flex flex-col h-full border border-transparent transition-all duration-150 ${
                      isBooked
                        ? 'border-l-[5px] border-l-[var(--color-teal)] hover:border-l-[7px] hover:border-[1.5px] hover:border-[var(--color-teal)]'
                        : cls.isFull
                          ? 'opacity-[0.55] border-l-[5px] border-l-[rgba(136,135,128,0.3)]'
                          : 'border-l-[5px] border-l-[var(--color-gold)] hover:border-l-[7px] hover:border-[1.5px] hover:border-[var(--color-gold)]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-[12px]">
                      <span className={`uppercase font-sans text-[10px] font-bold px-[8px] py-[4px] rounded-[4px] tracking-wide ${
                        cls.isFull && !isBooked ? 'bg-[rgba(136,135,128,0.15)] text-[#888780]' : 'bg-[rgba(122,174,173,0.15)] text-[var(--color-teal)]'
                      }`}>
                        {cls.category}
                      </span>
                      <span className={`font-sans text-[11px] font-medium px-[8px] py-[4px] rounded-[4px] ${
                        isBooked
                          ? 'bg-[rgba(122,174,173,0.15)] text-[var(--color-teal)]'
                          : cls.isFull
                            ? 'bg-[rgba(136,135,128,0.15)] text-[#888780]'
                            : 'bg-[rgba(201,168,76,0.15)] text-[var(--color-gold)]'
                      }`}>
                        {isBooked ? "You're Signed Up" : cls.isFull ? 'Class full' : `${cls.seats} seats remaining`}
                      </span>
                    </div>

                    <h3 className={`font-sans text-[28px] font-medium leading-[1.2] mb-[6px] ${
                      cls.isFull && !isBooked ? 'text-[rgba(245,237,214,0.55)]' : 'text-[var(--color-cream)]'
                    }`}>
                      {cls.title}
                    </h3>
                    <p className="font-sans text-[20px] text-[rgba(245,237,214,0.85)] mb-[16px]">
                      {cls.date} &middot; {cls.time}
                    </p>

                    <p className="font-sans text-[13px] text-[rgba(245,237,214,0.7)] leading-[1.6] mb-[24px] flex-grow">
                      {cls.desc}
                    </p>

                    <Link
                      href={isBooked || cls.isFull ? "#" : `/book/${cls.id}`}
                      className={`w-full h-[48px] rounded-[8px] font-sans text-[16px] font-medium flex items-center justify-center transition-all ${
                        isBooked
                          ? 'bg-[rgba(122,174,173,0.12)] text-[var(--color-teal)] border border-[rgba(122,174,173,0.4)] cursor-default pointer-events-none'
                          : cls.isFull
                            ? 'bg-[rgba(136,135,128,0.2)] text-[#888780] cursor-default pointer-events-none'
                            : 'bg-[var(--color-gold)] text-[var(--color-dark-bg)] hover:bg-[#F2D680] active:scale-[0.98]'
                      }`}
                    >
                      {isBooked ? "You're Already Signed Up" : cls.isFull ? 'Class Full' : 'Book This Class'}
                    </Link>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

