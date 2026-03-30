"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getClass, createBooking, createUser } from "../../../../lib/firebase/db";
import { createAccount, signInWithEmail } from "../../../../lib/firebase/auth";
import { auth } from "../../../../lib/firebase/client";
import type { ClassWithId } from "../../../../types/class";
import { useAuthContext } from "../../../../context/AuthContext";

function formatTimestamp(timestamp: number): { date: string; time: string } {
  const d = new Date(timestamp);
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return {
    date: `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`,
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
  };
}

interface UIClass {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  seats: number;
  price: number;
}

function toUIClass(c: ClassWithId): UIClass {
  const { date, time } = formatTimestamp(c.date);
  return {
    id: c.id,
    title: c.name,
    date,
    time,
    duration: c.duration >= 60
      ? `${Math.floor(c.duration / 60)}${c.duration % 60 > 0 ? ` hr ${c.duration % 60} min` : " hour"}`
      : `${c.duration} min`,
    location: c.location,
    seats: Math.max(0, c.seatLimit - c.seatsBooked),
    price: c.price,
  };
}

const STEPS = [
  "Confirm",
  "Your details",
  "Account",
  "Payment",
  "Card details",
  "Done"
];

export default function BookingFlow({ params }: { params: Promise<{ classId: string }> }) {
  const router = useRouter();
  const { user: authUser } = useAuthContext();
  const isSignedIn = authUser !== null;
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [step2Error, setStep2Error] = useState('');

  // Step 3 State
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step3Error, setStep3Error] = useState('');
  const [step3Loading, setStep3Loading] = useState(false);
  const [returningPasswordFocused, setReturningPasswordFocused] = useState(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  // Step 4 State
  const [paymentMethod, setPaymentMethod] = useState<'pay_now' | 'reserve'>('pay_now');
  const [bookingError, setBookingError] = useState('');

  // Step 5 State
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Class data from Firebase

  const [selectedClass, setSelectedClass] = useState<UIClass | null>(null);
  const [classLoading, setClassLoading] = useState(true);
  const [classError, setClassError] = useState<string | null>(null);

  // Scroll to top after every step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const resolvedParams = use(params);

  useEffect(() => {
    if (authUser) {
      setName(authUser.name ?? '');
      setEmail(authUser.email ?? '');
      setPhone(authUser.phone ?? '');
    }
  }, [authUser]);

  useEffect(() => {
    getClass(resolvedParams.classId)
      .then((cls) => {
        if (!cls) { setClassError("Class not found."); return; }
        setSelectedClass(toUIClass(cls));
      })
      .catch(() => setClassError("Failed to load class details."))
      .finally(() => setClassLoading(false));
  }, [resolvedParams.classId]);

  const handleStep2Submit = () => {
    setStep2Error('');
    if (!name.trim()) {
      setStep2Error('Please provide your full name.');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setStep2Error('Please provide either an email or phone number so we can reach you.');
      return;
    }
    
    // Simulate DB check for returning user (mock logic: if email starts with 'user' or phone has '555')
    if (email.toLowerCase().startsWith('user') || phone.includes('555')) {
      setIsReturningUser(true);
    } else {
      setIsReturningUser(false);
    }
    
    // Proceed to Step 3
    setStep3Error('');
    setPassword('');
    setConfirmPassword('');
    setCurrentStep(3);
  };

  const handleStep3Submit = async () => {
    setStep3Error('');
    if (isReturningUser) {
      if (!password) {
        setStep3Error('Please enter your password.');
        return;
      }
      setStep3Loading(true);
      try {
        await signInWithEmail(email, password);
        setCurrentStep(4);
      } catch (err: any) {
        const code: string = err?.code ?? '';
        if (code === 'auth/user-not-found') {
          setIsReturningUser(false);
          setPassword('');
          setConfirmPassword('');
          setStep3Error("We couldn't find an account with those details. Please create a new password below.");
        } else if (code === 'auth/too-many-requests') {
          setStep3Error('Too many failed attempts. Please wait a moment and try again.');
        } else {
          setStep3Error('That password is not correct. Please try again.');
        }
      } finally {
        setStep3Loading(false);
      }
    } else {
      if (!password || password.length < 8) {
        setStep3Error('Password must be at least 8 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setStep3Error('Those passwords do not match.');
        return;
      }
      if (!email) {
        setStep3Error('An email address is required to create an account. Please go back and add your email.');
        return;
      }
      setStep3Loading(true);
      try {
        // Build the full profile before creating the Auth account so it is
        // written to RTDB immediately after sign-up, before onAuthStateChanged
        // can fire and read a missing profile.
        const newProfile = {
          name,
          email: email || null,
          phone: phone || null,
          address: null,
          role: 'customer' as const,
          notes: null,
          contact: [],
          discounts: [],
          bookedClasses: {},
          starRating: null,
          profilePicture: null,
          totalRedemptions: 0,
          squareCustomerId: null,
          squareCardId: null,
          createdAt: Date.now(),
          lastLoginAt: Date.now(),
        };
        const credential = await createAccount(email, password);
        await createUser(credential.user.uid, newProfile);
        setCurrentStep(4);
      } catch (err: any) {
        const code: string = err?.code ?? '';
        if (code === 'auth/email-already-in-use') {
          setIsReturningUser(true);
          setPassword('');
          setStep3Error('An account with this email already exists. Please sign in with your password.');
        } else if (code === 'auth/invalid-email') {
          setStep3Error('That email address is not valid.');
        } else if (code === 'auth/weak-password') {
          setStep3Error('Your password is too weak. Please choose a stronger one.');
        } else {
          setStep3Error('Could not create your account. Please try again.');
        }
      } finally {
        setStep3Loading(false);
      }
    }
  };

  const handleStep4Submit = async () => {
    // Use auth.currentUser directly — React context state may lag a render
    // cycle after sign-in in step 3.
    const currentUser = auth.currentUser ?? authUser;
    if (!currentUser) {
      setBookingError('You must be signed in to complete your booking.');
      return;
    }
    setBookingError('');
    if (paymentMethod === 'pay_now') {
      setCurrentStep(5);
    } else {
      setIsProcessing(true);
      try {
        await createBooking({
          customerId: currentUser.uid,
          classId: selectedClass!.id,
          status: 'reserved',
          amount: 0,
          transferredFrom: null,
          transferredTo: null,
          transferType: null,
          createdAt: Date.now(),
          createdBy: currentUser.uid,
        });
        setCurrentStep(6);
      } catch {
        setBookingError('Something went wrong saving your booking. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleStep5Submit = async () => {
    const currentUser = auth.currentUser ?? authUser;
    if (!currentUser) {
      setPaymentError('You must be signed in to complete your booking.');
      return;
    }
    setPaymentError('');
    setIsProcessing(true);
    // Simulate payment delay (TODO: replace with real Square integration)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      await createBooking({
        customerId: currentUser.uid,
        classId: selectedClass!.id,
        status: 'paid',
        amount: (selectedClass?.price ?? 0) * 100,
        transferredFrom: null,
        transferredTo: null,
        transferType: null,
        createdAt: Date.now(),
        createdBy: currentUser.uid,
      });
      setCurrentStep(6);
    } catch {
      setPaymentError('Something went wrong saving your booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetToStep2 = () => {
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setStep3Error('');
    setCurrentStep(2);
  };

  if (classLoading) {
    return (
      <main className="w-full min-h-screen bg-[var(--color-dark-bg)] flex items-center justify-center">
        <p className="font-sans text-[18px] text-[rgba(245,237,214,0.5)]">Loading class details…</p>
      </main>
    );
  }

  if (classError || !selectedClass) {
    return (
      <main className="w-full min-h-screen bg-[var(--color-dark-bg)] flex flex-col items-center justify-center gap-[20px] px-[24px]">
        <p className="font-sans text-[18px] text-[rgba(245,237,214,0.7)] text-center">{classError ?? "Class not found."}</p>
        <Link href="/classes" className="text-[var(--color-gold)] underline text-[16px]">Browse all classes</Link>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-[var(--color-dark-bg)] flex flex-col">
      {/* 01: Progress Bar */}
      <div className="fixed top-[80px] left-0 right-0 w-full bg-[#111820] pt-[16px] pb-[24px] px-[24px] z-50 border-b border-[rgba(245,237,214,0.05)]">
        <div className="max-w-3xl mx-auto flex items-start justify-between relative">
          {/* Connecting Lines Container (Behind circles) */}
          <div className="absolute top-[14px] left-[20px] right-[20px] h-[2px] bg-[rgba(245,237,214,0.1)] -z-10">
            {/* Active filled line based on current step */}
            <div 
              className="h-full bg-[var(--color-gold)] transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
            />
          </div>

          {/* Step Circles */}
          {STEPS.map((stepLabel, idx) => {
            const stepNum = idx + 1;
            const isSkipped = currentStep >= 6 && paymentMethod === 'reserve' && stepNum === 5;
            const isActive = stepNum === currentStep;
            const isPast = stepNum < currentStep && !isSkipped;
            
            return (
              <div key={idx} className="flex flex-col items-center gap-[8px] z-10 w-[60px]">
                <div className={`w-[28px] h-[28px] rounded-full flex items-center justify-center text-[12px] font-bold transition-colors ${
                  isPast || isActive 
                    ? 'bg-[var(--color-gold)] text-[var(--color-dark-bg)]' 
                    : 'bg-[#111820] border border-[rgba(245,237,214,0.2)] text-[rgba(245,237,214,0.4)]'
                }`}>
                  {isPast || (currentStep === 6 && stepNum === 6) ? '✓' : isSkipped ? '-' : stepNum}
                </div>
                <span className={`text-[9px] text-center uppercase tracking-wider font-semibold ${
                  isActive || (currentStep === 6 && stepNum === 6) ? 'text-[var(--color-gold)]' : 
                  isPast ? 'text-[rgba(245,237,214,0.6)]' : 
                  'text-[rgba(245,237,214,0.3)]'
                }`}>
                  {isSkipped ? 'Skipped' : stepLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow max-w-2xl mx-auto w-full px-[24px] pt-[120px] pb-[32px] md:pt-[140px] md:pb-[48px]">
        
        {/* Step 1: Confirmation */}
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="font-display font-bold text-[32px] text-[var(--color-cream)] mb-[24px]">
              Is this the right class?
            </h1>
            
            {/* Why Panel */}
            <div className="bg-[rgba(122,174,173,0.08)] border-l-[3px] border-[#7AAEAD] text-[rgba(245,237,214,0.7)] font-sans text-[14px] leading-[1.6] rounded-r-[6px] px-[14px] py-[10px] mb-[24px]">
              Take a moment to check the class details below. Make sure the date and time work for you.
            </div>

            {/* Class Details Card */}
            <div className="bg-[var(--color-dark-surface)] border-l-[5px] border-[var(--color-gold)] p-[24px] rounded-[8px] mb-[32px]">
              <div className="inline-block bg-[rgba(201,168,76,0.15)] text-[var(--color-gold)] font-sans text-[11px] font-bold px-[10px] py-[4px] rounded-full mb-[16px]">
                {selectedClass.seats} seats remaining
              </div>
              
              <h2 className="font-sans text-[26px] md:text-[30px] font-medium text-center text-[var(--color-cream)] mb-[24px]">
                {selectedClass.title}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] font-sans text-[16px] md:text-[18px] text-[rgba(245,237,214,0.8)]">
                <p><strong className="text-[var(--color-cream)] font-semibold">Date:</strong> {selectedClass.date}</p>
                <p><strong className="text-[var(--color-cream)] font-semibold">Time:</strong> {selectedClass.time}</p>
                <p><strong className="text-[var(--color-cream)] font-semibold">Duration:</strong> {selectedClass.duration}</p>
                <p><strong className="text-[var(--color-cream)] font-semibold">Location:</strong> {selectedClass.location}</p>
              </div>
            </div>

            {/* Booking As Panel */}
            {isSignedIn && (
              <div className="bg-[rgba(122,174,173,0.08)] border-l-[3px] border-[#7AAEAD] text-[rgba(245,237,214,0.7)] font-sans text-[14px] leading-[1.6] rounded-r-[6px] px-[14px] py-[10px] mb-[24px]">
                Booking as <strong className="text-[var(--color-cream)]">{authUser!.name}</strong> · {authUser!.email ?? authUser!.phone}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-[16px]">
              <button 
                onClick={() => isSignedIn ? setCurrentStep(4) : setCurrentStep(2)}
                className="w-full h-[56px] rounded-[8px] bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-sans text-[18px] font-medium hover:bg-[#F2D680] active:scale-[0.98] transition-all"
              >
                Yes, this is the right class
              </button>
              
              <Link
                href="/classes"
                className="w-full h-[56px] rounded-[8px] border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[rgba(201,168,76,0.1)] font-sans text-[16px] font-medium flex items-center justify-center transition-all"
              >
                Go back and choose a different class
              </Link>
            </div>
          </div>
        )}

        {/* Step 2: Your Details */}
        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="font-display font-bold text-[32px] text-[var(--color-cream)] mb-[24px]">
              Tell us a little about yourself
            </h1>
            
            {/* Why Panel */}
            <div className="bg-[rgba(122,174,173,0.08)] border-l-[3px] border-[#7AAEAD] text-[rgba(245,237,214,0.7)] font-sans text-[16px] leading-[1.6] rounded-r-[6px] px-[16px] py-[16px] mb-[32px]">
              We need a way to send your booking confirmation and a reminder before your class begins.
            </div>

            <div className="space-y-[32px] mb-[48px]">
              {/* Full Name */}
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="fullName" className="font-sans text-[18px] font-semibold text-[var(--color-cream)]">
                  Full name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="e.g. Margaret Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#111820] border border-[rgba(245,237,214,0.15)] focus:border-[var(--color-gold)] rounded-[8px] h-[64px] px-[20px] text-[var(--color-cream)] font-sans text-[18px] placeholder:text-[rgba(245,237,214,0.3)] transition-colors outline-none w-full"
                />
                <p className="font-sans text-[14px] text-[rgba(245,237,214,0.6)]">
                  Required so we know who is coming.
                </p>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="email" className="font-sans text-[18px] font-semibold text-[var(--color-cream)]">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="e.g. margaret@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#111820] border border-[rgba(245,237,214,0.15)] focus:border-[var(--color-gold)] rounded-[8px] h-[64px] px-[20px] text-[var(--color-cream)] font-sans text-[18px] placeholder:text-[rgba(245,237,214,0.3)] transition-colors outline-none w-full"
                />
                <p className="font-sans text-[14px] text-[rgba(245,237,214,0.6)]">
                  We will send your booking confirmation here.
                </p>
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-[24px] my-[16px]">
                <div className="flex-1 h-[1px] bg-[rgba(245,237,214,0.1)]"></div>
                <span className="font-sans text-[16px] text-[rgba(245,237,214,0.5)] uppercase tracking-wider font-semibold">Or</span>
                <div className="flex-1 h-[1px] bg-[rgba(245,237,214,0.1)]"></div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="phone" className="font-sans text-[18px] font-semibold text-[var(--color-cream)]">
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="e.g. (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-[#111820] border border-[rgba(245,237,214,0.15)] focus:border-[var(--color-gold)] rounded-[8px] h-[64px] px-[20px] text-[var(--color-cream)] font-sans text-[18px] placeholder:text-[rgba(245,237,214,0.3)] transition-colors outline-none w-full"
                />
                <p className="font-sans text-[14px] text-[rgba(245,237,214,0.6)]">
                  We will text you a reminder before your class.
                </p>
              </div>

              {/* Validation Error */}
              {step2Error && (
                <div className="p-[16px] rounded-[8px] bg-[rgba(235,87,87,0.1)] border border-[rgba(235,87,87,0.3)] text-[#EB5757] font-sans text-[16px] flex items-center gap-[12px]">
                  <span className="font-bold flex-shrink-0">!</span>
                  {step2Error}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-[16px]">
              <button 
                onClick={handleStep2Submit}
                className="w-full h-[64px] rounded-[8px] bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-sans text-[20px] font-medium hover:bg-[#F2D680] active:scale-[0.98] transition-all"
              >
                Continue
              </button>
              
              <button
                onClick={() => setCurrentStep(1)}
                className="w-full h-[64px] rounded-[8px] border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[rgba(201,168,76,0.1)] font-sans text-[18px] font-medium flex items-center justify-center transition-all"
              >
                Go back
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Account */}
        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {isReturningUser ? (
              /* State B: Returning User */
              <>
                <h1 className="font-display font-bold text-[32px] text-[var(--color-cream)] mb-[24px]">
                  Welcome back!
                </h1>

                {/* Why Panel - Returning */}
                <div className="bg-[rgba(201,168,76,0.08)] border-l-[3px] border-[var(--color-gold)] text-[rgba(245,237,214,0.7)] font-sans text-[16px] leading-[1.6] rounded-r-[6px] px-[16px] py-[16px] mb-[32px]">
                  We found an account with those details. Please sign in to securely book your class.
                </div>

                {/* Account Card */}
                <div className="bg-[var(--color-dark-surface)] p-[20px] rounded-[8px] flex items-center gap-[16px] mb-[32px]">
                  <div className="w-[40px] h-[40px] rounded-full bg-[rgba(201,168,76,0.15)] text-[var(--color-gold)] flex items-center justify-center font-bold font-sans text-[16px]">
                    {name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans font-medium text-[16px] text-[var(--color-cream)]">{name || 'User'}</span>
                    <span className="font-sans text-[14px] text-[rgba(245,237,214,0.5)]">{email || phone}</span>
                  </div>
                </div>

                <div className="space-y-[32px] mb-[48px]">
                  {/* Password */}
                  <div className="flex flex-col gap-[8px]">
                    <label htmlFor="returningPassword" className="font-sans text-[18px] font-semibold text-[var(--color-cream)]">
                      Your password
                    </label>
                    <input
                      id="returningPassword"
                      type={returningPasswordFocused ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setReturningPasswordFocused(true)}
                      onBlur={() => setReturningPasswordFocused(false)}
                      onKeyDown={(e) => e.key === 'Enter' && handleStep3Submit()}
                      className="bg-[#111820] border border-[rgba(245,237,214,0.15)] focus:border-[var(--color-gold)] rounded-[8px] h-[64px] px-[20px] text-[var(--color-cream)] font-sans text-[18px] transition-colors outline-none w-full"
                    />
                  </div>
                  
                  {/* Validation Error */}
                  {step3Error && (
                    <div className="p-[16px] rounded-[8px] bg-[rgba(235,87,87,0.1)] border border-[rgba(235,87,87,0.3)] text-[#EB5757] font-sans text-[16px] flex items-center gap-[12px]">
                      <span className="font-bold flex-shrink-0">!</span>
                      {step3Error}
                    </div>
                  )}
                </div>

                {/* Secondary Actions */}
                <button 
                  onClick={() => alert('Forgot password flow to be implemented')}
                  className="w-full text-left font-sans text-[16px] text-[#7AAEAD] hover:underline mb-[32px]"
                >
                  Forgotten your password? We'll help you reset it
                </button>

                {/* Action Buttons */}
                <div className="flex flex-col gap-[16px]">
                  <button 
                    onClick={handleStep3Submit}
                    disabled={step3Loading}
                    className={`w-full h-[64px] rounded-[8px] font-sans text-[20px] font-medium transition-all flex items-center justify-center ${
                      step3Loading
                        ? 'bg-[rgba(201,168,76,0.5)] text-[rgba(20,27,31,0.5)] cursor-not-allowed'
                        : 'bg-[var(--color-gold)] text-[var(--color-dark-bg)] hover:bg-[#F2D680] active:scale-[0.98]'
                    }`}
                  >
                    {step3Loading ? (
                      <span className="flex items-center gap-[8px]">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in…
                      </span>
                    ) : 'Sign in and continue'}
                  </button>
                  
                  <button
                    onClick={resetToStep2}
                    disabled={step3Loading}
                    className="w-full h-[64px] rounded-[8px] border border-[rgba(245,237,214,0.2)] text-[rgba(245,237,214,0.7)] hover:bg-[rgba(245,237,214,0.05)] disabled:opacity-50 font-sans text-[18px] font-medium flex items-center justify-center transition-all"
                  >
                    This is not me — use different details
                  </button>
                </div>
              </>
            ) : (
              /* State A: New User */
              <>
                <h1 className="font-display font-bold text-[32px] text-[var(--color-cream)] mb-[24px]">
                  Create your password
                </h1>

                {/* Why Panel - New User */}
                <div className="bg-[rgba(122,174,173,0.08)] border-l-[3px] border-[#7AAEAD] text-[rgba(245,237,214,0.7)] font-sans text-[16px] leading-[1.6] rounded-r-[6px] px-[16px] py-[16px] mb-[32px]">
                  Creating an account makes booking future classes easier and lets you manage your upcoming classes in one place.
                </div>

                <div className="space-y-[32px] mb-[48px]">
                  {/* Password */}
                  <div className="flex flex-col gap-[8px]">
                    <label htmlFor="newPassword" className="font-sans text-[18px] font-semibold text-[var(--color-cream)]">
                      Password
                    </label>
                    <input
                      id="newPassword"
                      type={newPasswordFocused ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setNewPasswordFocused(true)}
                      onBlur={() => setNewPasswordFocused(false)}
                      className="bg-[#111820] border border-[rgba(245,237,214,0.15)] focus:border-[var(--color-gold)] rounded-[8px] h-[64px] px-[20px] text-[var(--color-cream)] font-sans text-[18px] transition-colors outline-none w-full"
                    />
                    <p className="font-sans text-[14px] text-[rgba(245,237,214,0.6)]">
                      Use something you will remember — a short phrase works perfectly. Minimum 8 characters.
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col gap-[8px]">
                    <label htmlFor="confirmPassword" className="font-sans text-[18px] font-semibold text-[var(--color-cream)]">
                      Confirm password
                    </label>
                    <input
                      id="confirmPassword"
                      type={confirmPasswordFocused ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setConfirmPasswordFocused(true)}
                      onBlur={() => setConfirmPasswordFocused(false)}
                      onKeyDown={(e) => e.key === 'Enter' && handleStep3Submit()}
                      className="bg-[#111820] border border-[rgba(245,237,214,0.15)] focus:border-[var(--color-gold)] rounded-[8px] h-[64px] px-[20px] text-[var(--color-cream)] font-sans text-[18px] transition-colors outline-none w-full"
                    />
                    <p className="font-sans text-[14px] text-[rgba(245,237,214,0.6)]">
                      This makes sure there are no typing mistakes.
                    </p>
                  </div>

                  {/* Validation Error */}
                  {step3Error && (
                    <div className="p-[16px] rounded-[8px] bg-[rgba(235,87,87,0.1)] border border-[rgba(235,87,87,0.3)] text-[#EB5757] font-sans text-[16px] flex items-center gap-[12px]">
                      <span className="font-bold flex-shrink-0">!</span>
                      {step3Error}
                    </div>
                  )}
                </div>

                {/* Secondary Actions */}
                <button 
                  onClick={() => setIsReturningUser(true)}
                  className="w-full text-left font-sans text-[16px] text-[#7AAEAD] hover:underline mb-[32px]"
                >
                  Already have an account? Sign in
                </button>

                {/* Action Buttons */}
                <div className="flex flex-col gap-[16px]">
                  <button 
                    onClick={handleStep3Submit}
                    disabled={step3Loading}
                    className={`w-full h-[64px] rounded-[8px] font-sans text-[20px] font-medium transition-all flex items-center justify-center ${
                      step3Loading
                        ? 'bg-[rgba(201,168,76,0.5)] text-[rgba(20,27,31,0.5)] cursor-not-allowed'
                        : 'bg-[var(--color-gold)] text-[var(--color-dark-bg)] hover:bg-[#F2D680] active:scale-[0.98]'
                    }`}
                  >
                    {step3Loading ? (
                      <span className="flex items-center gap-[8px]">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating your account…
                      </span>
                    ) : 'Continue'}
                  </button>
                  
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={step3Loading}
                    className="w-full h-[64px] rounded-[8px] border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[rgba(201,168,76,0.1)] disabled:opacity-50 font-sans text-[18px] font-medium flex items-center justify-center transition-all"
                  >
                    Go back
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 4: Payment Choice */}
        {currentStep === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="font-display font-bold text-[32px] text-[var(--color-cream)] mb-[24px]">
              How would you like to pay?
            </h1>

            {/* Why Panel - Payment */}
            <div className="bg-[rgba(122,174,173,0.08)] border-l-[3px] border-[#7AAEAD] text-[rgba(245,237,214,0.7)] font-sans text-[16px] leading-[1.6] rounded-r-[6px] px-[16px] py-[16px] mb-[32px]">
              Paying today will GUARANTEE your seat in class. Reserving a seat for free puts you in front of all walk-ins.
            </div>

            <div className="flex flex-col gap-[16px] mb-[48px]">
              {/* Option 1: Pay now */}
              <button
                onClick={() => setPaymentMethod('pay_now')}
                className={`w-full text-left p-[24px] rounded-[8px] border-[2px] transition-all bg-[#222E36] flex gap-[16px] items-start ${
                  paymentMethod === 'pay_now' 
                    ? 'border-[#C9A84C]' 
                    : 'border-[rgba(201,168,76,0.3)] hover:border-[rgba(201,168,76,0.5)]'
                }`}
              >
                <div className="mt-[4px] relative w-[24px] h-[24px] rounded-full border-[2px] border-[var(--color-gold)] flex items-center justify-center flex-shrink-0">
                  {paymentMethod === 'pay_now' && (
                    <div className="w-[12px] h-[12px] rounded-full bg-[var(--color-gold)]" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className={`font-sans font-medium text-[20px] mb-[8px] ${
                    paymentMethod === 'pay_now' ? 'text-[var(--color-gold)]' : 'text-[var(--color-cream)]'
                  }`}>
                    Pay now by card
                  </span>
                  <span className="font-sans text-[16px] text-[rgba(245,237,214,0.7)] leading-[1.5]">
                    Guarantee your seat today using a credit or debit card. Quick and easy.
                  </span>
                </div>
              </button>

              {/* Option 2: Reserve for free */}
              <button
                onClick={() => setPaymentMethod('reserve')}
                className={`w-full text-left p-[24px] rounded-[8px] border-[2px] transition-all bg-[#222E36] flex gap-[16px] items-start ${
                  paymentMethod === 'reserve' 
                    ? 'border-[#C9A84C]' 
                    : 'border-[rgba(201,168,76,0.3)] hover:border-[rgba(201,168,76,0.5)]'
                }`}
              >
                <div className="mt-[4px] relative w-[24px] h-[24px] rounded-full border-[2px] border-[var(--color-gold)] flex items-center justify-center flex-shrink-0">
                  {paymentMethod === 'reserve' && (
                    <div className="w-[12px] h-[12px] rounded-full bg-[var(--color-gold)]" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className={`font-sans font-medium text-[20px] mb-[8px] ${
                    paymentMethod === 'reserve' ? 'text-[var(--color-gold)]' : 'text-[var(--color-cream)]'
                  }`}>
                    Reserve for free — pay when I arrive
                  </span>
                  <span className="font-sans text-[16px] text-[rgba(245,237,214,0.7)] leading-[1.5]">
                    Request a seat at no cost today. Bring payment on the day of the class. Seats are not guaranteed until then.
                  </span>
                </div>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-[16px]">
              {bookingError && (
                <div className="p-[16px] rounded-[8px] bg-[rgba(235,87,87,0.1)] border border-[rgba(235,87,87,0.3)] text-[#EB5757] font-sans text-[16px] flex items-center gap-[12px]">
                  <span className="font-bold flex-shrink-0">!</span>
                  {bookingError}
                </div>
              )}
              <button 
                onClick={handleStep4Submit}
                disabled={isProcessing}
                className={`w-full h-[64px] rounded-[8px] font-sans text-[20px] font-medium transition-all flex items-center justify-center ${
                  isProcessing
                    ? 'bg-[rgba(201,168,76,0.5)] text-[rgba(20,27,31,0.5)] cursor-not-allowed'
                    : 'bg-[var(--color-gold)] text-[var(--color-dark-bg)] hover:bg-[#F2D680] active:scale-[0.98]'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-[8px]">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving your booking…
                  </span>
                ) : 'Continue'}
              </button>
              
              <button
                onClick={() => setCurrentStep(isSignedIn ? 1 : 3)}
                disabled={isProcessing}
                className="w-full h-[64px] rounded-[8px] border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[rgba(201,168,76,0.1)] disabled:opacity-50 font-sans text-[18px] font-medium flex items-center justify-center transition-all"
              >
                Go back
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Card Details (Square) */}
        {currentStep === 5 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="font-display font-bold text-[32px] text-[var(--color-cream)] mb-[24px]">
              Enter your card details
            </h1>

            {/* Why Panel - Payment Security */}
            <div className="bg-[rgba(122,174,173,0.08)] border-l-[3px] border-[#7AAEAD] text-[rgba(245,237,214,0.7)] font-sans text-[16px] leading-[1.6] rounded-r-[6px] px-[16px] py-[16px] mb-[32px]">
              We use Square to securely process your payment. Your card details are never stored on our servers, and you are only charged when you click the button below.
            </div>

            {/* Mock Square Form Wrapper */}
            <div className="bg-[#222E36] rounded-[8px] p-[18px] border border-[rgba(245,237,214,0.05)] mb-[24px]">
              <div className="flex flex-col gap-[16px]">
                {/* Visual placeholder for Square Web Payments SDK */}
                <div className="h-[48px] bg-[#111820] border border-[rgba(245,237,214,0.15)] rounded-[6px] px-[16px] flex items-center justify-between">
                  <span className="text-[rgba(245,237,214,0.5)] font-sans text-[16px]">Card number</span>
                  <div className="flex gap-[4px]">
                    <div className="w-[32px] h-[20px] bg-[rgba(245,237,214,0.1)] rounded-[4px]"></div>
                    <div className="w-[32px] h-[20px] bg-[rgba(245,237,214,0.1)] rounded-[4px]"></div>
                    <div className="w-[32px] h-[20px] bg-[rgba(245,237,214,0.1)] rounded-[4px]"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-[16px]">
                  <div className="h-[48px] bg-[#111820] border border-[rgba(245,237,214,0.15)] rounded-[6px] px-[16px] flex items-center">
                    <span className="text-[rgba(245,237,214,0.5)] font-sans text-[16px]">MM/YY</span>
                  </div>
                  <div className="h-[48px] bg-[#111820] border border-[rgba(245,237,214,0.15)] rounded-[6px] px-[16px] flex items-center">
                    <span className="text-[rgba(245,237,214,0.5)] font-sans text-[16px]">CVC</span>
                  </div>
                </div>
                <div className="h-[48px] bg-[#111820] border border-[rgba(245,237,214,0.15)] rounded-[6px] px-[16px] flex items-center">
                  <span className="text-[rgba(245,237,214,0.5)] font-sans text-[16px]">ZIP</span>
                </div>
              </div>
            </div>

            {/* Security Line */}
            <div className="flex items-center justify-center gap-[8px] text-[rgba(245,237,214,0.35)] font-sans text-[12px] mb-[48px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Your card details are encrypted and secure
            </div>

            {/* Validation Error */}
            {paymentError && (
              <div className="p-[16px] rounded-[8px] bg-[rgba(235,87,87,0.1)] border border-[rgba(235,87,87,0.3)] text-[#EB5757] font-sans text-[16px] flex items-center gap-[12px] mb-[32px]">
                <span className="font-bold flex-shrink-0">!</span>
                {paymentError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-[16px]">
              <button 
                onClick={handleStep5Submit}
                disabled={isProcessing}
                className={`w-full h-[64px] rounded-[8px] flex items-center justify-center font-sans text-[20px] font-medium transition-all ${
                  isProcessing 
                    ? 'bg-[rgba(201,168,76,0.5)] text-[rgba(20,27,31,0.5)] cursor-not-allowed'
                    : 'bg-[var(--color-gold)] text-[var(--color-dark-bg)] hover:bg-[#F2D680] active:scale-[0.98]'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-[8px]">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Pay and confirm my booking'
                )}
              </button>
              
              <button
                onClick={() => setCurrentStep(4)}
                disabled={isProcessing}
                className="w-full h-[64px] rounded-[8px] border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[rgba(201,168,76,0.1)] disabled:opacity-50 font-sans text-[18px] font-medium flex items-center justify-center transition-all"
              >
                Go back
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Confirmation (Done) */}
        {currentStep === 6 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
            
            {/* Confirmation Icon */}
            <div className="w-[56px] h-[56px] rounded-full bg-[rgba(201,168,76,0.15)] flex items-center justify-center text-[var(--color-gold)] mb-[24px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            <h1 className="font-display font-bold text-[32px] text-[var(--color-cream)] mb-[12px] text-center">
              You're all booked!
            </h1>

            <p className="font-sans text-[16px] text-[rgba(245,237,214,0.55)] text-center mb-[40px]">
              We've sent a confirmation to {email || phone || 'your contact details'}.
            </p>

            {/* Booking Summary Card */}
            <div className="w-full bg-[#222E36] rounded-[8px] p-[24px] mb-[48px] flex flex-col">
              
              <div className="flex justify-between items-start py-[16px] border-b-[0.5px] border-[rgba(245,237,214,0.07)]">
                <span className="font-sans text-[16px] text-[rgba(245,237,214,0.45)]">Class</span>
                <span className="font-sans text-[16px] font-bold text-[var(--color-cream)] text-right max-w-[60%]">{selectedClass.title}</span>
              </div>
              
              <div className="flex justify-between items-start py-[16px] border-b-[0.5px] border-[rgba(245,237,214,0.07)]">
                <span className="font-sans text-[16px] text-[rgba(245,237,214,0.45)]">Date</span>
                <span className="font-sans text-[16px] font-bold text-[var(--color-cream)] text-right">{selectedClass.date}</span>
              </div>

              <div className="flex justify-between items-start py-[16px] border-b-[0.5px] border-[rgba(245,237,214,0.07)]">
                <span className="font-sans text-[16px] text-[rgba(245,237,214,0.45)]">Time</span>
                <span className="font-sans text-[16px] font-bold text-[var(--color-cream)] text-right">{selectedClass.time}</span>
              </div>

              <div className="flex justify-between items-start py-[16px] border-b-[0.5px] border-[rgba(245,237,214,0.07)]">
                <span className="font-sans text-[16px] text-[rgba(245,237,214,0.45)]">Location</span>
                <span className="font-sans text-[16px] font-bold text-[var(--color-cream)] text-right">{selectedClass.location}</span>
              </div>

              <div className="flex justify-between items-start pt-[16px]">
                <span className="font-sans text-[16px] text-[rgba(245,237,214,0.45)]">Payment</span>
                {paymentMethod === 'pay_now' ? (
                  <span className="font-sans text-[16px] font-bold text-[#C9A84C] text-right">
                    Paid online
                  </span>
                ) : (
                  <span className="font-sans text-[16px] font-bold text-[var(--color-cream)] text-right">
                    Reserved — pay on arrival
                  </span>
                )}
              </div>

            </div>

            {/* Final Action Button */}
            <Link 
              href="/"
              className="w-full h-[64px] rounded-[8px] bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-sans text-[20px] font-medium hover:bg-[#F2D680] active:scale-[0.98] transition-all flex items-center justify-center"
            >
              Go back to Home
            </Link>

          </div>
        )}
      </div>
    </main>
  );
}
