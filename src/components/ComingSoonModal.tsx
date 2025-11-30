import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Tour } from '../types/tour';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: Tour;
  museumName: string;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  isOpen,
  onClose,
  tour,
  museumName,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Auto-close after success
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        onClose();
        // Reset state for next open
        setIsSubmitted(false);
        setEmail('');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    // Log to console (backend wiring later)
    console.log('Email signup:', {
      email,
      tourId: tour.id,
      tourName: tour.name,
      museumName,
      timestamp: new Date().toISOString(),
    });

    // Store in localStorage for persistence
    try {
      const existingSignups = JSON.parse(
        localStorage.getItem('museum-tour-notifications') || '[]'
      );
      existingSignups.push({
        email,
        tourId: tour.id,
        tourName: tour.name,
        museumName,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(
        'museum-tour-notifications',
        JSON.stringify(existingSignups)
      );
    } catch (err) {
      console.error('Failed to save notification signup:', err);
    }

    setIsSubmitted(true);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="coming-soon-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {!isSubmitted ? (
          <div className="p-6">
            {/* Close button */}
            <div className="flex justify-end mb-2">
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-museum-terracotta-500"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-museum-terracotta-50 rounded-full flex items-center justify-center">
                <Bell className="w-7 h-7 text-museum-terracotta-500" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h2
                id="coming-soon-title"
                className="text-2xl font-serif text-museum-primary-900 mb-2"
              >
                Be First to Explore
              </h2>
              <p className="text-lg text-museum-terracotta-600 font-medium mb-3">
                "{tour.name}"
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                We're crafting this journey. Be among the first to experience it
                when it launches.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className={`w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-museum-terracotta-500 focus:border-transparent transition-colors ${
                    error ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1.5 ml-1">{error}</p>
                )}
              </div>

              <Button type="submit" className="w-full rounded-xl py-3">
                Notify Me
              </Button>
            </form>

            {/* Privacy note */}
            <p className="text-center text-xs text-gray-400 mt-4">
              No spam. Only tour launch updates.
            </p>
          </div>
        ) : (
          /* Success state */
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center animate-[scale_0.3s_ease-out]">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <h2 className="text-2xl font-serif text-museum-primary-900 mb-2">
              You're on the list!
            </h2>
            <p className="text-gray-600 text-sm">
              We'll email you when "{tour.name}" goes live.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComingSoonModal;
