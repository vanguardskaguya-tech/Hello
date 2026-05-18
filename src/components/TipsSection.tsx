import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { Tip } from '../types';
import { GlassCard } from './GlassCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { auth } from '../lib/firebase';

interface TipsSectionProps {
  searchQuery: string;
}

export function TipsSection({ searchQuery }: TipsSectionProps) {
  const [tips, setTips] = useState<Tip[]>([]);
  const isAdmin = auth.currentUser?.email === 'vanguardskaguya@gmail.com';

  useEffect(() => {
    return dataService.subscribeTips(setTips);
  }, []);

  const filteredTips = tips.filter(tip => 
    tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tip.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tip.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tip?')) {
      await dataService.deleteTip(id);
    }
  };

  const handleAdd = async () => {
    const title = window.prompt('Tip Title:');
    const content = window.prompt('Tip Content:');
    const category = window.prompt('Category:', 'Automation');
    if (title && content) {
      await dataService.addTip({ title, content, category: category || 'Automation' });
    }
  };

  const handleEdit = async (tip: Tip) => {
    const title = window.prompt('Tip Title:', tip.title);
    const content = window.prompt('Tip Content:', tip.content);
    const category = window.prompt('Category:', tip.category);
    if (title && content) {
      await dataService.updateTip(tip.id, { title, content, category: category || 'Automation' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-display text-white italic mb-2 flex items-center gap-3">
            <span className="w-2 h-8 bg-red-500 rounded-full"></span>
            Tips & Strategy
          </h2>
          <p className="text-slate-400">Advanced workflows for authentic content growth.</p>
        </div>
        {isAdmin && (
          <button onClick={handleAdd} className="glass-button bg-red-500/20 border-red-500/30 text-white px-6 py-2">
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add New Tip
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTips.map((tip, index) => (
            <GlassCard key={tip.id} delay={index * 0.05} className="group relative overflow-hidden border-white/5 hover:border-red-500/30 transition-all">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-red-500 font-bold">
                  {tip.category}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-500">
                    {tip.createdAt.toDate().toLocaleDateString()}
                  </span>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(tip)} className="text-slate-500 hover:text-white transition-colors">
                        <FontAwesomeIcon icon={faEdit} size="xs" />
                      </button>
                      <button onClick={() => handleDelete(tip.id)} className="text-slate-500 hover:text-red-500 transition-colors">
                        <FontAwesomeIcon icon={faTrash} size="xs" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-red-400 transition-colors">
                {tip.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-4">
                {tip.content}
              </p>
            </GlassCard>
          ))}
        </AnimatePresence>
        
        {filteredTips.length === 0 && (
          <div className="col-span-full py-20 text-center text-white/20">
            No tips found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
