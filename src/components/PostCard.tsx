import React, { useState } from 'react';
import { Post } from '../types';
import { Heart, MessageCircle, Share2, Terminal, Code2, ShieldAlert, Zap, X } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { reviewCode } from '../services/geminiService';
import { executeCode } from '../services/compilerService';
import { Play } from 'lucide-react';

export default function PostCard({ post }: { post: Post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [aiReview, setAiReview] = useState<any>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [executionOutput, setExecutionOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleAIReview = async () => {
    if (!post.codeSnippet) return;
    setIsReviewing(true);
    const review = await reviewCode(post.codeSnippet, post.language || 'javascript');
    setAiReview(review);
    setIsReviewing(false);
  };

  const handleExecute = async () => {
    if (!post.codeSnippet) return;
    setIsExecuting(true);
    const output = await executeCode(post.codeSnippet, post.language || 'javascript');
    setExecutionOutput(output);
    setIsExecuting(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card mb-6 overflow-hidden border-white/5 hover:border-neon-cyan/30 transition-colors"
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <img 
            src={post.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorId}`} 
            alt="Avatar" 
            className="w-12 h-12 rounded-full border border-white/10"
          />
          <div className="flex flex-col">
            <span className="font-bold text-gray-100 hover:text-neon-cyan cursor-pointer transition-colors">
              @{post.authorName}
            </span>
            <span className="text-xs text-gray-500 font-mono">
              {formatDistanceToNow(post.createdAt?.toDate?.() || new Date())} ago
            </span>
          </div>
          <div className="ml-auto flex gap-2">
            {post.language && (
              <span className="px-2 py-1 bg-white/5 rounded text-[10px] text-neon-cyan font-mono border border-neon-cyan/20">
                {post.language.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-300 mb-6 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>

        {post.codeSnippet && (
          <div className="relative group mb-6">
            <div className="absolute inset-0 bg-neon-cyan/5 rounded-xl -m-1 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative rounded-xl overflow-hidden border border-white/10">
              <div className="bg-[#1e1e1e] px-4 py-2 flex items-center justify-between border-bottom border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <span className="text-[10px] text-gray-500 font-mono">devconnect_v1.sh</span>
              </div>
              <SyntaxHighlighter
                language={post.language || 'javascript'}
                style={atomDark}
                customStyle={{
                  margin: 0,
                  padding: '1.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: '#0a0a0a',
                }}
              >
                {post.codeSnippet}
              </SyntaxHighlighter>
            </div>

            {/* Actions Trigger */}
            <div className="absolute right-4 bottom-4 flex gap-2">
              <button 
                onClick={handleExecute}
                disabled={isExecuting}
                className="flex items-center gap-2 px-3 py-1.5 bg-neon-cyan/20 border border-neon-cyan/50 rounded-full text-xs font-mono text-neon-cyan hover:bg-neon-cyan/30 transition-all active:scale-95 disabled:opacity-50"
              >
                <Play size={14} className={isExecuting ? 'animate-spin' : ''} />
                {isExecuting ? 'RUNNING...' : 'RUN'}
              </button>
              <button 
                onClick={handleAIReview}
                disabled={isReviewing}
                className="flex items-center gap-2 px-3 py-1.5 bg-neon-purple/20 border border-neon-purple/50 rounded-full text-xs font-mono text-neon-purple hover:bg-neon-purple/30 transition-all active:scale-95 disabled:opacity-50"
              >
                <Zap size={14} className={isReviewing ? 'animate-pulse' : ''} />
                {isReviewing ? 'REVIEWING...' : 'AI REVIEW'}
              </button>
            </div>
          </div>
        )}

        <AnimatePresence>
          {executionOutput && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 rounded-xl bg-black border border-white/10 overflow-hidden"
            >
              <div className="bg-white/5 px-4 py-2 flex items-center justify-between border-b border-white/5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Output Terminal</span>
                <button onClick={() => setExecutionOutput('')} className="text-gray-500 hover:text-white"><X size={12} /></button>
              </div>
              <pre className="p-4 text-xs font-mono text-green-400 whitespace-pre-wrap max-h-40 overflow-y-auto">
                {executionOutput}
              </pre>
            </motion.div>
          )}
          {aiReview && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 p-4 rounded-xl bg-neon-purple/5 border border-neon-purple/20 overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-3 text-neon-purple">
                <ShieldAlert size={18} />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">AI Security Insight</span>
              </div>
              
              {aiReview.bugs?.length > 0 && (
                <div className="mb-3">
                  <span className="text-[10px] text-red-400 font-mono block mb-1">DETECTION:</span>
                  <ul className="list-disc pl-4 text-xs text-red-300/80 space-y-1">
                    {aiReview.bugs.map((b: string, i: number) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              )}
              
              <div className="text-xs text-gray-400 leading-relaxed italic">
                "{aiReview.summary}"
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex gap-6">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-neon-pink' : 'text-gray-400 hover:text-neon-pink'}`}
            >
              <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              <span className="text-sm font-mono">{post.likesCount + (isLiked ? 1 : 0)}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors">
              <MessageCircle size={20} />
              <span className="text-sm font-mono">{post.commentsCount}</span>
            </button>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
