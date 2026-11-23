import React, { useState } from 'react';
import { Play, Pause, CheckCircle2, Trash2, Plus, Sparkles } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { AutomationTask } from '../types/platform';

interface BlueprintStep {
  stepName: string;
  action: string;
  owner: string;
}

interface GeneratedBlueprint {
  workflowTitle: string;
  triggerSummary: string;
  estimatedHoursSavedPerWeek: number;
  steps: BlueprintStep[];
  messageTemplate: string;
}

const STARTER_TEMPLATES: Omit<AutomationTask, 'userId'>[] = [
  {
    id: 'tpl_1',
    title: 'Tier-1 Support Ticket Auto-Triage & Escalation',
    category: 'support',
    status: 'active',
    trigger: 'Inbound support ticket tagged Billing or Order Status',
    runsCount: 142,
  },
  {
    id: 'tpl_2',
    title: 'Post-Purchase Welcome & UPI Receipt Confirmation Email',
    category: 'email',
    status: 'active',
    trigger: 'New order recorded in Online Shopping checkout',
    runsCount: 89,
  },
  {
    id: 'tpl_3',
    title: 'Weekly Executive Pipeline Digest & Task Assignment',
    category: 'workflow',
    status: 'paused',
    trigger: 'Every Monday at 09:00 IST',
    runsCount: 24,
  },
];

export function AiAutomationPage() {
  const {
    authUser,
    automations,
    createAutomation,
    toggleAutomationStatus,
    deleteAutomation,
    incrementAiCredits,
    navigate,
  } = usePlatform();

  const [goal, setGoal] = useState('');
  const [category, setCategory] = useState<AutomationTask['category']>('workflow');
  const [triggerType, setTriggerType] = useState('New customer inquiry received');
  const [generating, setGenerating] = useState(false);
  const [blueprint, setBlueprint] = useState<GeneratedBlueprint | null>(null);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'completed'>('all');

  const [manualTitle, setManualTitle] = useState('');
  const [manualTrigger, setManualTrigger] = useState('');
  const [savingTask, setSavingTask] = useState(false);

  const handleGenerateBlueprint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || generating) return;

    setError('');
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, category, triggerType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Workflow generation failed.');
      setBlueprint(data.blueprint);
      if (authUser) await incrementAiCredits(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate workflow.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveBlueprint = async () => {
    if (!blueprint) return;
    if (!authUser) {
      navigate('auth');
      return;
    }
    setSavingTask(true);
    try {
      await createAutomation({
        title: blueprint.workflowTitle || goal.slice(0, 80),
        category,
        trigger: blueprint.triggerSummary || triggerType,
      });
      setBlueprint(null);
      setGoal('');
    } finally {
      setSavingTask(false);
    }
  };

  const handleAddManualTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) {
      navigate('auth');
      return;
    }
    if (!manualTitle.trim() || !manualTrigger.trim()) return;
    setSavingTask(true);
    try {
      await createAutomation({
        title: manualTitle,
        category,
        trigger: manualTrigger,
      });
      setManualTitle('');
      setManualTrigger('');
    } finally {
      setSavingTask(false);
    }
  };

  const displayedTasks = authUser ? automations : STARTER_TEMPLATES;
  const filteredTasks = displayedTasks.filter((t) =>
    statusFilter === 'all' ? true : t.status === statusFilter
  );

  return (
    <div className="bg-[#060913] min-h-screen py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Header */}
        <div className="pb-10 border-b border-white/10 max-w-3xl space-y-3">
          <p className="text-xs font-medium text-blue-400">Division 02 · AI Automation</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Automated customer support, email pipelines, and task orchestration.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Design end-to-end business workflows with AI, generate ready-to-send customer email macros, and manage live automation queues from one operations dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: AI Workflow Blueprint Generator */}
          <div className="lg:col-span-5 space-y-6">
            <form
              onSubmit={handleGenerateBlueprint}
              className="bg-[#0C1324] border border-white/10 rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h2 className="text-base font-semibold text-white">AI Workflow Architect</h2>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Automation Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['support', 'email', 'workflow', 'task'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg capitalize transition-colors ${
                        category === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#060913] border border-white/10 text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {cat === 'support'
                        ? 'Customer Support'
                        : cat === 'email'
                        ? 'Email Sequence'
                        : cat === 'workflow'
                        ? 'Business Workflow'
                        : 'Task Routing'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="auto-trigger" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Trigger Condition
                </label>
                <input
                  id="auto-trigger"
                  type="text"
                  value={triggerType}
                  onChange={(e) => setTriggerType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#060913] border border-white/15 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="auto-goal" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Describe Automation Objective *
                </label>
                <textarea
                  id="auto-goal"
                  rows={3}
                  required
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Automatically acknowledge new retail orders, verify payment status, and notify warehouse dispatch."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#060913] border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {error && <p className="text-xs text-rose-400">{error}</p>}

              <button
                type="submit"
                disabled={generating || !goal.trim()}
                className="w-full px-4 py-2.5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
              >
                {generating ? 'Designing Blueprint...' : 'Generate Automation Blueprint'}
              </button>
            </form>

            {/* Quick Add Task Form */}
            <form
              onSubmit={handleAddManualTask}
              className="bg-[#0C1324] border border-white/10 rounded-xl p-6 space-y-3"
            >
              <h2 className="text-sm font-semibold text-white">Add Direct Task Rule</h2>
              <input
                type="text"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="Workflow title"
                className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#060913] border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={manualTrigger}
                onChange={(e) => setManualTrigger(e.target.value)}
                placeholder="Event trigger"
                className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#060913] border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={savingTask}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-white/15 text-white hover:bg-white/5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{authUser ? 'Save to Workflow Queue' : 'Sign In to Save Task'}</span>
              </button>
            </form>
          </div>

          {/* Right: Generated Blueprint + Task Management Dashboard */}
          <div className="lg:col-span-7 space-y-6">
            {blueprint && (
              <div className="bg-[#0E172E] border border-blue-500/40 rounded-xl p-6 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs text-blue-400 font-medium block mb-1">
                      Generated Blueprint · ~{blueprint.estimatedHoursSavedPerWeek || 6} hrs/week saved
                    </span>
                    <h3 className="text-lg font-semibold text-white">{blueprint.workflowTitle}</h3>
                    <p className="text-xs text-slate-300 mt-1">{blueprint.triggerSummary}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveBlueprint}
                    disabled={savingTask}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 whitespace-nowrap shrink-0"
                  >
                    {authUser ? 'Activate & Save Workflow' : 'Sign In to Save'}
                  </button>
                </div>

                <div className="space-y-2.5">
                  {blueprint.steps?.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg bg-[#060913] border border-white/10"
                    >
                      <span className="font-mono-tabular text-xs text-blue-400 mt-0.5">
                        0{idx + 1}.
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-white">{s.stepName}</div>
                        <div className="text-xs text-slate-300 mt-0.5">{s.action}</div>
                        <div className="text-[11px] text-slate-500 mt-1">Owner: {s.owner}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {blueprint.messageTemplate && (
                  <div className="p-4 rounded-lg bg-[#060913] border border-white/10">
                    <div className="text-xs font-medium text-slate-400 mb-1.5">
                      Automated Customer / Email Template
                    </div>
                    <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {blueprint.messageTemplate}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Task Management Table */}
            <div className="bg-[#0C1324] border border-white/10 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-white">Task Management Dashboard</h2>
                  <p className="text-xs text-slate-400">
                    {authUser
                      ? 'Live workflows synchronized with your customer workspace.'
                      : 'Previewing reference templates. Sign in to manage custom workflows.'}
                  </p>
                </div>

                <div className="flex items-center gap-1 p-1 rounded-lg bg-[#060913] border border-white/10">
                  {(['all', 'active', 'paused', 'completed'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                        statusFilter === st
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {filteredTasks.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-400">
                  No automation workflows match the selected filter. Generate a blueprint on the left to add one.
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02]"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2.5 text-xs text-slate-400 mb-1">
                          <span className="capitalize">{task.category}</span>
                          <span aria-hidden="true">·</span>
                          <span
                            className={`capitalize font-medium ${
                              task.status === 'active'
                                ? 'text-emerald-400'
                                : task.status === 'paused'
                                ? 'text-amber-400'
                                : 'text-blue-400'
                            }`}
                          >
                            {task.status}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-tabular">{task.runsCount} runs</span>
                        </div>
                        <div className="text-sm font-semibold text-white truncate">{task.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5 truncate">
                          Trigger: {task.trigger}
                        </div>
                      </div>

                      {authUser && (
                        <div className="flex items-center gap-2 shrink-0">
                          {task.status !== 'completed' && (
                            <button
                              type="button"
                              onClick={() =>
                                toggleAutomationStatus(
                                  task as AutomationTask,
                                  task.status === 'active' ? 'paused' : 'active'
                                )
                              }
                              title={task.status === 'active' ? 'Pause workflow' : 'Resume workflow'}
                              className="p-2 rounded-lg bg-[#060913] border border-white/10 text-slate-300 hover:text-white transition-colors"
                            >
                              {task.status === 'active' ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          {task.status !== 'completed' && (
                            <button
                              type="button"
                              onClick={() => toggleAutomationStatus(task as AutomationTask, 'completed')}
                              title="Mark completed"
                              className="p-2 rounded-lg bg-[#060913] border border-white/10 text-slate-300 hover:text-emerald-400 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => deleteAutomation(task.id)}
                            title="Delete workflow"
                            className="p-2 rounded-lg bg-[#060913] border border-white/10 text-slate-300 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
