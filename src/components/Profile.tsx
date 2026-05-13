import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { UserProfile, Post, Project } from '../types';
import { Github, Link as LinkIcon, Calendar, Code2, Rocket, Briefcase, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import PostCard from './PostCard';
import { generatePortfolioSummary } from '../services/geminiService';

export default function Profile() {
  const { user, profile: currentProfile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [aiSummary, setAiSummary] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Fetch User Posts
      const postsQ = query(
        collection(db, 'posts'), 
        where('authorId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const postsSnap = await getDocs(postsQ);
      setPosts(postsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Post)));

      // Fetch User Projects
      const projectsQ = query(
        collection(db, 'projects'), 
        where('authorId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const projectsSnap = await getDocs(projectsQ);
      setProjects(projectsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
    };

    fetchData();
  }, [user]);

  const handleGenerateSummary = async () => {
    if (!currentProfile) return;
    setIsGeneratingSummary(true);
    const summary = await generatePortfolioSummary(currentProfile.techStack || [], currentProfile.bio || '');
    setAiSummary(summary);
    setIsGeneratingSummary(false);
  };

  if (!currentProfile) return null;

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      {/* Header Profile Section */}
      <div className="glass-card p-8 mb-8 border-neon-cyan/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Code2 size={200} className="text-neon-cyan rotate-12" />
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          <div className="relative">
            <img 
              src={currentProfile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentProfile.uid}`} 
              alt="Avatar" 
              className="w-32 h-32 rounded-3xl border-2 border-neon-cyan/30 shadow-[0_0_20px_rgba(0,245,255,0.2)]"
            />
            <div className="absolute -bottom-2 -right-2 bg-neon-cyan text-black p-1.5 rounded-lg shadow-lg">
              <Zap size={16} />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-mono font-black text-white">{currentProfile.displayName}</h1>
                <p className="text-neon-cyan font-mono text-sm tracking-widest">@{currentProfile.username}</p>
              </div>
              <div className="flex gap-3">
                <button className="neon-button text-xs py-2 px-4 border-neon-purple shadow-none text-neon-purple hover:bg-neon-purple hover:text-white">
                  EDIT PROFILE
                </button>
                <button className="neon-button text-xs py-2 px-6">FOLLOW</button>
              </div>
            </div>

            <p className="text-gray-400 mb-6 max-w-2xl leading-relaxed">
              {currentProfile.bio}
            </p>

            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center gap-2 text-gray-500 font-mono text-xs">
                <Github size={14} className="text-neon-cyan" />
                <span className="hover:text-white cursor-pointer transition-colors">github.com/{currentProfile.username}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-mono text-xs">
                <LinkIcon size={14} className="text-neon-cyan" />
                <span className="hover:text-white cursor-pointer transition-colors">portfolio.dev</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-mono text-xs">
                <Calendar size={14} className="text-neon-cyan" />
                <span>Joined May 2026</span>
              </div>
            </div>

            <div className="flex gap-8 border-t border-white/5 pt-6">
              <div className="text-center">
                <div className="text-white font-mono font-bold text-xl">{currentProfile.followersCount}</div>
                <div className="text-[10px] text-gray-600 font-mono uppercase">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-white font-mono font-bold text-xl">{currentProfile.followingCount}</div>
                <div className="text-[10px] text-gray-600 font-mono uppercase">Following</div>
              </div>
              <div className="text-center">
                <div className="text-neon-cyan font-mono font-bold text-xl">{currentProfile.rankingPoints}</div>
                <div className="text-[10px] text-gray-600 font-mono uppercase">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Tech Stack */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-card p-6 border-white/5">
            <h3 className="font-mono font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wide text-sm">
              <Cpu size={16} className="text-neon-purple" />
              Tech Matrix
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentProfile.techStack?.map(tech => (
                <span key={tech} className="px-3 py-1 rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20 text-[10px] font-mono">
                  {tech.toUpperCase()}
                </span>
              ))}
              {(!currentProfile.techStack || currentProfile.techStack.length === 0) && (
                <span className="text-gray-600 text-xs italic">No tech stack defined.</span>
              )}
            </div>
          </div>

          <div className="glass-card p-6 border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Rocket size={40} className="text-neon-pink" />
            </div>
            <h3 className="font-mono font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wide text-sm">
              <Briefcase size={16} className="text-neon-pink" />
              AI Portfolio Summary
            </h3>
            
            <div className="relative">
              {aiSummary ? (
                <p className="text-xs text-gray-400 leading-relaxed font-mono italic">
                  {aiSummary}
                </p>
              ) : (
                <button 
                  onClick={handleGenerateSummary}
                  disabled={isGeneratingSummary}
                  className="w-full py-3 rounded-lg bg-neon-pink/10 border border-neon-pink/30 text-neon-pink font-mono text-[10px] hover:bg-neon-pink/20 transition-all disabled:opacity-50"
                >
                  {isGeneratingSummary ? 'GENERATING...' : 'GENERATE AI INSIGHT'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Activity & Projects */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex gap-4 border-b border-white/10 mb-2">
            <button className="pb-4 px-2 border-b-2 border-neon-cyan text-white font-mono text-sm tracking-widest">FEED</button>
            <button className="pb-4 px-2 border-b-2 border-transparent text-gray-500 hover:text-white font-mono text-sm tracking-widest transition-colors">PROJECTS</button>
            <button className="pb-4 px-2 border-b-2 border-transparent text-gray-500 hover:text-white font-mono text-sm tracking-widest transition-colors">COLLECTIONS</button>
          </div>

          <div className="space-y-6">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
            {posts.length === 0 && (
              <div className="text-center py-20 glass-card">
                <Code2 className="mx-auto text-gray-800 mb-4" size={48} />
                <p className="text-gray-600 font-mono text-sm uppercase">No activity logs found in this sector</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
