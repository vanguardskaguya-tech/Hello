import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { dataService } from '../services/dataService';
import { Niche } from '../types';
import { GlassCard } from './GlassCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faChartLine, faUsers, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';

export function NichePicker() {
  const [niches, setNiches] = useState<Niche[]>([]);
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null);
  const isAdmin = auth.currentUser?.email === 'vanguardskaguya@gmail.com';

  useEffect(() => {
    fetchNiches();
  }, []);

  const fetchNiches = async () => {
    const data = await dataService.getNiches();
    setNiches(data);
    if (data.length > 0 && !selectedNiche) setSelectedNiche(data[0]);
    else if (data.length === 0) {
        // Fallback for initial view if DB is empty
        setSelectedNiche({ id: '1', name: 'Ranking Commentary', description: 'Analyze and rank trends, creators, or content.', potential: 'Viral', difficulty: 'Medium' });
    }
  };

  const handleAdd = async () => {
    const name = window.prompt('Niche Name:');
    const description = window.prompt('Description:');
    const potential = window.prompt('Potential (Viral/High/Medium):', 'High');
    const difficulty = window.prompt('Difficulty (Easy/Medium/Hard):', 'Medium');
    if (name && description) {
      await dataService.addNiche({ name, description, potential: potential || 'High', difficulty: difficulty || 'Medium' });
      fetchNiches();
    }
  };

  const handleEdit = async (niche: Niche) => {
    const name = window.prompt('Niche Name:', niche.name);
    const description = window.prompt('Description:', niche.description);
    const potential = window.prompt('Potential:', niche.potential);
    const difficulty = window.prompt('Difficulty:', niche.difficulty);
    if (name && description) {
      await dataService.updateNiche(niche.id, { name, description, potential: potential || niche.potential, difficulty: difficulty || niche.difficulty });
      fetchNiches();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this niche?')) {
      await dataService.deleteNiche(id);
      fetchNiches();
      if (selectedNiche?.id === id) setSelectedNiche(null);
    }
  };

  const displayNiches = niches.length > 0 ? niches : [
    { id: '1', name: 'Ranking Commentary', description: 'Analyze and rank trends, creators, or content. High retention and high click-through potential.', potential: 'Viral', difficulty: 'Medium' },
    { id: '2', name: 'Commentary', description: 'Storytelling through the lens of recent events or internet culture. Focuses on personality and take.', potential: 'High', difficulty: 'Hard' },
    { id: '3', name: 'Lifestyle', description: 'Daily vlogs, aesthetic routines, and community-focused content. High audience loyalty.', potential: 'Medium', difficulty: 'Easy' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="w-2 h-8 bg-red-500 rounded-full"></span>
          <h2 className="text-4xl font-display text-white italic">Niche Explorer</h2>
        </div>
        {isAdmin && (
          <button onClick={handleAdd} className="glass-button bg-red-500/20 border-red-500/30 text-white text-[10px] uppercase font-bold tracking-[0.2em] px-4 py-2">
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Niche
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {displayNiches.map((niche) => (
            <div key={niche.id} className="relative group">
              <button
                onClick={() => setSelectedNiche(niche)}
                className={cn(
                  "w-full text-left p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden",
                  selectedNiche?.id === niche.id 
                    ? "bg-red-500/10 border-red-500/50 text-white shadow-[0_0_20px_rgba(239,68,68,0.1)]" 
                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20"
                )}
              >
                <div className="font-bold text-xl mb-1">{niche.name}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] opacity-60 font-bold">
                  Explorer
                </div>
              </button>
              {isAdmin && niche.id.length > 1 && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(niche)} className="text-slate-500 hover:text-white transition-colors">
                    <FontAwesomeIcon icon={faEdit} size="xs" />
                  </button>
                  <button onClick={() => handleDelete(niche.id)} className="text-slate-500 hover:text-red-500 transition-colors">
                    <FontAwesomeIcon icon={faTrash} size="xs" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedNiche ? (
              <motion.div
                key={selectedNiche.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <GlassCard className="h-full border-white/5 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-red-500">
                      <FontAwesomeIcon icon={faBullseye} size="10x" />
                   </div>
                   
                  <h3 className="text-3xl font-display italic text-white mb-6">
                    {selectedNiche.name}
                  </h3>
                  <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-xl">
                    {selectedNiche.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                      <div className="text-red-400 mb-2 flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em]">
                        <FontAwesomeIcon icon={faChartLine} /> Potential
                      </div>
                      <div className="text-2xl font-bold">{selectedNiche.potential || 'TBD'}</div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                      <div className="text-indigo-400 mb-2 flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em]">
                        <FontAwesomeIcon icon={faUsers} /> Difficulty
                      </div>
                      <div className="text-2xl font-bold">{selectedNiche.difficulty || 'TBD'}</div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] p-12 text-center text-slate-600">
                <div>
                  <FontAwesomeIcon icon={faBullseye} size="3x" className="mx-auto mb-4 opacity-20" />
                  <p className="text-xl font-display italic">Select a niche to explore strategies</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
