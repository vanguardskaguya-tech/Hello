import { useState } from 'react';
import { dataService } from '../services/dataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faPlus, faMagic } from '@fortawesome/free-solid-svg-icons';

export function AdminPanel() {
  const [loading, setLoading] = useState(false);

  const seedData = async () => {
    setLoading(true);
    try {
      // Add Tips
      await dataService.addTip({
        title: "The 3-Second Retention Rule",
        content: "Ensure your video has a visual pattern interrupt every 3 seconds to keep viewers from scrolling away. This could be a zoom-in, a text overlay, or a scene change.",
        category: "Automation"
      });
      await dataService.addTip({
        title: "Voiceover Optimization",
        content: "Use AI voiceovers but always apply a 'Humanize' EQ in your editing software. Boost frequencies around 100-200Hz for warmth and 3kHz for clarity.",
        category: "Editing"
      });

      // Add Assets
      await dataService.addAsset({
        title: "Lo-Fi Background Pack",
        url: "https://drive.google.com/drive/folders/sample-lofi",
        type: "sound",
        category: "Music"
      });
      await dataService.addAsset({
        title: "Gradient Overlay Pack",
        url: "https://drive.google.com/drive/folders/sample-gradients",
        type: "picture",
        category: "Overlays"
      });

      // Add Niches
      await dataService.addNiche({
        name: "Historical Mystery",
        description: "Exploring unsolved mysteries from history. High search volume and evergreen content.",
        potential: "High",
        difficulty: "Medium"
      });

      // Add Guide
      await dataService.addGuideStep({
        order: 1,
        title: "Identify Your Niche",
        content: "Choose a topic with high demand and low competition. Use tools like Google Trends to verify interest."
      });

      alert('Data seeded successfully!');
    } catch (e) {
      console.error(e);
      alert('Seeding failed. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <button 
        onClick={seedData}
        disabled={loading}
        className="glass-button bg-red-500/20 border-red-500/50 hover:bg-red-500/40 px-6 py-3 shadow-[0_0_30px_rgba(239,68,68,0.3)] group"
      >
        <FontAwesomeIcon 
            icon={faDatabase} 
            className={loading ? "animate-spin mr-2" : "group-hover:rotate-12 transition-transform mr-2"} 
        />
        {loading ? 'Seeding...' : 'Seed Initial Data'}
      </button>
    </div>
  );
}
