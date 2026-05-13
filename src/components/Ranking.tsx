import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { UserProfile } from '../types';
import { Trophy, Award, TrendingUp, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

export default function Ranking() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('rankingPoints', 'desc'), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      setUsers(usersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex flex-col items-center mb-12 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-neon-cyan/20 rounded-3xl flex items-center justify-center border border-neon-cyan/50 mb-6 shadow-[0_0_30px_rgba(0,245,255,0.2)]"
        >
          <Trophy className="text-neon-cyan w-10 h-10" />
        </motion.div>
        <h1 className="text-4xl font-mono font-black text-white uppercase tracking-tighter mb-2">
          Hacker <span className="neon-text-glow">Leaderboard</span>
        </h1>
        <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">Global Ranking System active</p>
      </div>

      <div className="grid gap-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass-card h-20 animate-pulse" />
          ))
        ) : (
          users.map((user, index) => (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              key={user.uid}
              className={`glass-card p-4 flex items-center gap-6 border-white/5 hover:border-neon-cyan/20 transition-all ${
                index === 0 ? 'border-neon-cyan/40 bg-neon-cyan/5' : ''
              }`}
            >
              <div className="w-12 text-center font-mono font-bold text-2xl text-gray-700">
                {String(index + 1).padStart(2, '0')}
              </div>
              
              <img 
                src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                alt={user.username} 
                className="w-12 h-12 rounded-full border border-white/10"
              />
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">@{user.username}</span>
                  {index < 3 && <Award size={14} className={index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-400" : "text-amber-600"} />}
                </div>
                <div className="flex gap-2 mt-1">
                  {user.techStack?.slice(0, 3).map(tech => (
                    <span key={tech} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-500 border border-white/5">
                      {tech.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <div className="text-neon-cyan font-mono font-bold">{user.rankingPoints}</div>
                <div className="text-[10px] text-gray-600 font-mono">NODES REACHED</div>
              </div>

              <div className="w-16 h-8 flex items-end gap-0.5 pb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-sm ${index === 0 ? 'bg-neon-cyan' : 'bg-gray-800'}`}
                    style={{ height: `${Math.random() * 100}%`, opacity: (i + 1) / 5 }}
                  />
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
