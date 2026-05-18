import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { dataService } from '../services/dataService';
import { Asset } from '../types';
import { GlassCard } from './GlassCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faImage, faExternalLink, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';

interface AssetsSectionProps {
  searchQuery: string;
}

export function AssetsSection({ searchQuery }: AssetsSectionProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filter, setFilter] = useState<'all' | 'sound' | 'picture'>('all');
  const isAdmin = auth.currentUser?.email === 'vanguardskaguya@gmail.com';

  useEffect(() => {
    return dataService.subscribeAssets(setAssets);
  }, []);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filter === 'all' || asset.type === filter;
    return matchesSearch && matchesType;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this asset?')) {
      await dataService.deleteAsset(id);
    }
  };

  const handleAdd = async () => {
    const title = window.prompt('Asset Title:');
    const url = window.prompt('Drive URL:');
    const type = window.prompt('Type (sound/picture):', 'sound') as 'sound' | 'picture';
    const category = window.prompt('Category:', 'General');
    if (title && url && (type === 'sound' || type === 'picture')) {
      await dataService.addAsset({ title, url, type, category: category || 'General' });
    }
  };

  const handleEdit = async (asset: Asset) => {
    const title = window.prompt('Asset Title:', asset.title);
    const url = window.prompt('Drive URL:', asset.url);
    const category = window.prompt('Category:', asset.category);
    if (title && url) {
      await dataService.updateAsset(asset.id, { title, url, category: category || asset.category });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-display text-white italic mb-2 flex items-center gap-3">
            <span className="w-2 h-8 bg-red-500 rounded-full"></span>
            Sound Drive
          </h2>
          <p className="text-slate-400">High-quality assets for your content workflow.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 self-start">
          <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
            {(['all', 'sound', 'picture'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  "px-6 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all",
                  filter === t ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "text-slate-500 hover:text-white"
                )}
              >
                {t}s
              </button>
            ))}
          </div>
          {isAdmin && (
            <button onClick={handleAdd} className="glass-button bg-red-500/20 border-red-500/30 text-white text-[10px] uppercase font-bold tracking-[0.2em] px-4 py-2">
              <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Asset
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredAssets.map((asset, index) => (
            <GlassCard key={asset.id} delay={index * 0.05} className="group aspect-[4/5] flex flex-col items-center justify-center text-center p-6 border-white/5 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
               {isAdmin && (
                 <div className="absolute top-4 right-4 flex gap-2 z-20">
                    <button onClick={() => handleEdit(asset)} className="text-slate-500 hover:text-white transition-colors">
                      <FontAwesomeIcon icon={faEdit} size="xs" />
                    </button>
                    <button onClick={() => handleDelete(asset.id)} className="text-slate-500 hover:text-red-500 transition-colors">
                      <FontAwesomeIcon icon={faTrash} size="xs" />
                    </button>
                 </div>
               )}
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-xl",
                asset.type === 'sound' ? "bg-indigo-500/20 text-indigo-400" : "bg-red-500/20 text-red-400"
              )}>
                <FontAwesomeIcon icon={asset.type === 'sound' ? faMusic : faImage} size="xl" />
              </div>
              <h4 className="font-bold text-white mb-2 line-clamp-2">{asset.title}</h4>
              <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">{asset.category}</span>
              
              <a 
                href={asset.url} 
                target="_blank" 
                rel="no-referrer"
                className="mt-6 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 glass-button text-[10px] py-1.5 px-4 font-bold uppercase tracking-widest bg-white/5"
              >
                Retrieve <FontAwesomeIcon icon={faExternalLink} className="ml-1" />
              </a>
            </GlassCard>
          ))}
        </AnimatePresence>

        {filteredAssets.length === 0 && (
          <div className="col-span-full py-20 text-center text-white/20">
            No assets found in your drive.
          </div>
        )}
      </div>
    </div>
  );
}
