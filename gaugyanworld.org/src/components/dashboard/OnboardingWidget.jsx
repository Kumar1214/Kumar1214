import React from 'react';
import { CheckCircle2, Circle, ChevronRight, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const OnboardingWidget = ({ title = "Getting Started", tasks = [], completedCount = 0 }) => {
    const progress = Math.round((completedCount / tasks.length) * 100);

    return (
        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-xl p-6 text-white overflow-hidden relative shadow-xl">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Trophy className="text-yellow-400" size={20} />
                            {title}
                        </h3>
                        <p className="text-indigo-200 text-sm mt-1">Complete these steps to unlock full potential!</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold">{progress}%</div>
                        <div className="text-xs text-indigo-300">Completed</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-indigo-950/50 rounded-full mb-6 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                    />
                </div>

                {/* Tasks List */}
                <div className="space-y-3">
                    {tasks.map((task, index) => (
                        <div
                            key={task.label}
                            onClick={() => !task.completed && task.onClick && task.onClick()}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${task.completed
                                ? 'bg-indigo-800/50 border border-indigo-700/50'
                                : 'bg-white/10 border border-white/10 hover:bg-white/15 cursor-pointer'
                                }`}
                        >
                            <div className={`flex-shrink-0 ${task.completed ? 'text-green-400' : 'text-indigo-300'}`}>
                                {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${task.completed ? 'text-indigo-200 line-through' : 'text-white'}`}>
                                    {task.label}
                                </p>
                                <p className="text-xs text-indigo-300 truncate">{task.description}</p>
                            </div>
                            {!task.completed && (
                                <ChevronRight size={16} className="text-indigo-400" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OnboardingWidget;
