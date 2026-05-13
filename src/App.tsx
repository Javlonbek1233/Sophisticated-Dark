import React from 'react';
import { useAuth } from './contexts/AuthContext';
import AppLayout from './components/AppLayout';
import CreatePost from './components/CreatePost';
import PostCard from './components/PostCard';
import Profile from './components/Profile';
import Ranking from './components/Ranking';
import Chat from './components/Chat';
import { db } from './lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Post } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, Github, Cpu, Radio, TrendingUp, Zap } from 'lucide-react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function LandingPage() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-bg">
      <div className="neon-gradient-bg" />
      <div className="neon-orb w-[800px] h-[800px] bg-neon-cyan/20 -top-1/4 -left-1/4" />
      <div className="neon-orb w-[600px] h-[600px] bg-neon-purple/20 -bottom-1/4 -right-1/4" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl text-center z-10 px-4"
      >
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan font-mono text-xs mb-8">
          <Radio size={14} className="animate-pulse" />
          <span>V1.0.4 CORE OVERRIDE ENGAGED</span>
        </div>
        
        <h1 className="text-7xl md:text-8xl font-mono font-black tracking-tighter text-white mb-6 uppercase">
          DevConnect <span className="neon-text-glow">AI</span>
        </h1>
        
        <p className="text-xl text-gray-400 mb-12 font-mono max-w-2xl mx-auto leading-relaxed">
          The autonomous social layer for developers. <br /> 
          <span className="text-gray-600">Connect. Review. Accelerate.</span>
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <button 
            onClick={login}
            className="w-full md:w-auto neon-button text-lg px-12 py-4 flex items-center justify-center gap-3 group"
          >
            <Github size={24} />
            <span>INITIALIZE LOGIN</span>
          </button>
          
          <div className="flex items-center gap-8 text-gray-500 font-mono text-sm">
            <div className="flex flex-col">
              <span className="text-white">10K+</span>
              <span>Devs</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-white">50K+</span>
              <span>Deployments</span>
            </div>
          </div>
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <FeatureCard 
            icon={<Cpu className="text-neon-cyan" />} 
            title="AI Code Review" 
            desc="Gemini-powered insights for every snippet you share."
          />
          <FeatureCard 
            icon={<TrendingUp className="text-neon-purple" />} 
            title="Dev Ranking" 
            desc="Climb the global hacker leaderboard with quality PRs."
          />
          <FeatureCard 
            icon={<Zap className="text-neon-pink" />} 
            title="Live Collab" 
            desc="Synchronized coding rooms for elite pair-programming."
          />
        </div>
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass-card p-6 border-white/5 hover:border-white/20 transition-all group">
      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-mono font-bold text-white mb-2 uppercase tracking-wide">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function Feed() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <CreatePost />
      
      <div className="flex flex-col gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card h-64 animate-pulse p-6">
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/5" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-2 bg-white/5 rounded w-1/4" />
                  <div className="h-2 bg-white/5 rounded w-1/2" />
                </div>
              </div>
              <div className="h-32 bg-white/5 rounded" />
            </div>
          ))
        ) : (
          posts.map(post => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-12 h-12 border-2 border-neon-cyan border-t-transparent rounded-full"
      />
    </div>
  );

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <Routes>
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </motion.div>
        ) : (
          <motion.div 
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <AppLayout>
              <Routes>
                <Route path="/" element={<Feed />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/ranking" element={<Ranking />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/projects" element={<div className="p-20 text-center text-gray-500 font-mono italic underline decoration-neon-cyan underline-offset-8">COMMUNITY SHOWCASE MODULE OFFLINE</div>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          </motion.div>
        )}
      </AnimatePresence>
    </BrowserRouter>
  );
}
