import React, { useState } from 'react';
import { Send, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
import { getProfile } from '../services/storage';

export const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const profile = getProfile();
  const destinationEmail = profile.social.email || 'your-email@example.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    setTimeout(() => {
      const subject = `Portfolio Contact from ${formState.name}`;
      const body = `Name: ${formState.name}%0D%0AEmail: ${formState.email}%0D%0A%0D%0AMessage:%0D%0A${formState.message}`;
      window.location.href = `mailto:${destinationEmail}?subject=${encodeURIComponent(subject)}&body=${body}`;
      setStatus('success');
      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <section className="py-24 relative overflow-hidden transition-colors duration-300" id="contact">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 dark:bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/50 dark:bg-slate-900/30 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Info Side */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-indigo-200/30 dark:bg-indigo-500/30 rounded-full blur-3xl"></div>
              
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 mb-6">
                  <MessageSquare size={24} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 font-heading">Let's work together</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                  Have a project in mind or just want to say hi? Fill out the form and it will open your default email client to send me a message directly.
                </p>
              </div>
              
              <div className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                <p>Email to: <span className="text-indigo-600 dark:text-indigo-300 font-medium">{destinationEmail}</span></p>
                <p>Available for Freelance & Full-time</p>
              </div>
            </div>

            {/* Form Side */}
            <div className="p-10 bg-white dark:bg-slate-950/50 relative">
              {status === 'success' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-950/50 backdrop-blur-sm z-20 animate-fade-in">
                   <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
                   <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Email Client Opened!</h3>
                   <p className="text-slate-600 dark:text-slate-400 text-center px-8">Please check your mail app to hit send.</p>
                   <button 
                     onClick={() => setStatus('idle')}
                     className="mt-6 text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:text-indigo-800 dark:hover:text-white underline"
                   >
                     Send another
                   </button>
                </div>
              ) : null}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Message</label>
                  <textarea 
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none placeholder-slate-400 dark:placeholder-slate-600"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-white dark:text-slate-950 dark:hover:bg-indigo-50 text-white font-bold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Preparing...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};