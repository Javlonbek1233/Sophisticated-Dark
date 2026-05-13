import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Terminal, Code2, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CreatePost() {
  const { profile, user } = useAuth();
  const [content, setContent] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'posts'), {
        authorId: user.uid,
        authorName: profile?.username || 'Developer',
        authorAvatar: profile?.avatarUrl || '',
        content,
        codeSnippet: showCodeInput ? codeSnippet : null,
        language: showCodeInput ? language : null,
        likesCount: 0,
        commentsCount: 0,
        createdAt: serverTimestamp(),
      });
      setContent('');
      setCodeSnippet('');
      setShowCodeInput(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'posts');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-6 mb-8 border-neon-cyan/20">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <img 
            src={profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
            alt="Avatar" 
            className="w-10 h-10 rounded-full border border-white/10 shrink-0"
          />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Deploy a new thought to the network..."
              className="w-full bg-transparent border-none outline-none text-gray-200 placeholder:text-gray-600 resize-none min-h-[80px] font-sans"
            />
            
            <AnimatePresence>
              {showCodeInput && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 relative"
                >
                  <div className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden">
                    <div className="bg-white/5 px-4 py-2 flex items-center justify-between">
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-transparent text-[10px] font-mono text-neon-cyan outline-none border-none uppercase tracking-wider"
                      >
                        <option value="javascript">Javascript</option>
                        <option value="typescript">Typescript</option>
                        <option value="python">Python</option>
                        <option value="rust">Rust</option>
                        <option value="go">Go</option>
                        <option value="cpp">C++</option>
                      </select>
                      <button 
                        type="button"
                        onClick={() => setShowCodeInput(false)}
                        className="text-gray-500 hover:text-neon-pink"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <textarea
                      value={codeSnippet}
                      onChange={(e) => setCodeSnippet(e.target.value)}
                      placeholder="// Insert code here..."
                      className="w-full bg-transparent p-4 font-mono text-sm outline-none resize-none min-h-[150px] text-neon-blue"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCodeInput(!showCodeInput)}
                  className={`p-2 rounded-lg transition-all ${showCodeInput ? 'text-neon-cyan bg-neon-cyan/10' : 'text-gray-500 hover:text-neon-cyan hover:bg-white/5'}`}
                >
                  <Code2 size={20} />
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-neon-purple hover:bg-white/5 rounded-lg transition-all"
                >
                  <Terminal size={20} />
                </button>
              </div>

              <button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="neon-button flex items-center gap-2 py-2 px-6 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Send size={18} />
                <span className="font-mono">ENCRYPT & SEND</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
