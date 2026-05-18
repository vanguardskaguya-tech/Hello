import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { dataService } from '../services/dataService';
import { GuideStep } from '../types';
import { GlassCard } from './GlassCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircle, faChevronRight, faChevronLeft, faRocket } from '@fortawesome/free-solid-svg-icons';
import { cn } from '../lib/utils';

export function StarterGuide() {
  const [steps, setSteps] = useState<GuideStep[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    dataService.getGuide().then(setSteps);
  }, []);

  const displaySteps = steps.length > 0 ? steps : [
    { id: '1', order: 1, title: 'Define Your Hook', content: 'The first 5 seconds are critical. Use a strong visual or verbal hook to stop the scroll.' },
    { id: '2', order: 2, title: 'Automation Workflow', content: 'Set up your editing templates and stock library early to save hours per video.' },
    { id: '3', order: 3, title: 'Thumbnail Strategy', content: 'High contrast, minimal text, and mystery drive clicks. Test 3 versions per video.' },
    { id: '4', order: 4, title: 'Consistent Uploads', content: 'Pick a schedule you can sustain. Quality over quantity, but frequency builds momentum.' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <span className="w-2 h-8 bg-red-500 rounded-full"></span>
        <h2 className="text-4xl font-display text-white italic">Starter Guide</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4 space-y-4">
          {displaySteps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(index)}
              className={cn(
                "w-full flex items-center gap-4 p-5 rounded-2xl transition-all relative overflow-hidden group",
                activeStep === index ? "bg-white/5 border border-white/10" : "hover:bg-white/5 border border-transparent"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all font-bold",
                activeStep === index ? "bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/20" : "border-white/10 text-slate-500"
              )}>
                {activeStep > index ? <FontAwesomeIcon icon={faCheckCircle} /> : <span>{step.order}</span>}
              </div>
              <div className="text-left">
                <div className={cn(
                  "font-bold transition-colors",
                  activeStep === index ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                )}>
                  {step.title}
                </div>
              </div>
              
              {activeStep === index && (
                <motion.div 
                  layoutId="guide-active-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" 
                />
              )}
            </button>
          ))}
        </div>

        <div className="md:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="min-h-[400px] flex flex-col justify-center p-12 border-white/5 relative overflow-hidden bg-gradient-to-br from-slate-900 to-black rounded-[3rem]">
                 <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none select-none italic font-display text-8xl">
                    0{displaySteps[activeStep]?.order}
                 </div>
                 
                <span className="text-red-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-6 block">
                  Module 0{displaySteps[activeStep]?.order}
                </span>
                <h3 className="text-5xl font-display text-white italic mb-8">
                  {displaySteps[activeStep]?.title}
                </h3>
                <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
                  {displaySteps[activeStep]?.content}
                </p>
                
                <div className="mt-12 flex gap-4">
                   <button 
                    onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                    disabled={activeStep === 0}
                    className="glass-button px-8 py-3 disabled:opacity-20 uppercase text-[10px] font-bold tracking-widest"
                   >
                     <FontAwesomeIcon icon={faChevronLeft} className="mr-2" /> Previous
                   </button>
                   <button 
                    onClick={() => setActiveStep(Math.min(displaySteps.length - 1, activeStep + 1))}
                    disabled={activeStep === displaySteps.length - 1}
                    className="glass-button px-8 py-3 bg-red-500 text-white border-red-400 shadow-xl shadow-red-500/20 disabled:opacity-20 uppercase text-[10px] font-bold tracking-widest"
                   >
                     Continue <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
                   </button>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
