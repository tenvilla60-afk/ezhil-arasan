import React, { useState } from 'react';
import { Clapperboard, Copy, Check, Download } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { PLATFORM_IMAGES } from '../types/platform';
import { ResilientImage } from '../components/ResilientImage';

interface VideoScene {
  timecode: string;
  visualDirection: string;
  voiceover: string;
  onScreenText: string;
}

interface VideoProduction {
  title: string;
  hookLine: string;
  durationEstimate: string;
  scenes: VideoScene[];
  socialCaption: string;
  ctaLine: string;
}

const FORMATS = [
  'Instagram Reel / YouTube Shorts',
  'YouTube Long-Form Breakdown',
  'Performance Ad Campaign',
  'Product Launch Film',
] as const;

export function AiVideoPage() {
  const { authUser, incrementAiCredits } = usePlatform();
  const [format, setFormat] = useState<string>(FORMATS[0]);
  const [productOrTopic, setProductOrTopic] = useState('');
  const [audience, setAudience] = useState('Founders, creators, and online shoppers');
  const [tone, setTone] = useState('Crisp, authoritative, modern technology');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [production, setProduction] = useState<VideoProduction | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productOrTopic.trim() || loading) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/ai/video-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productOrTopic, format, audience, tone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate video storyboard.');
      setProduction(data.production);
      if (authUser) await incrementAiCredits(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate video script.');
    } finally {
      setLoading(false);
    }
  };

  const buildMarkdown = () => {
    if (!production) return '';
    const scenesText = (production.scenes || [])
      .map(
        (s, idx) =>
          `### Scene ${idx + 1} (${s.timecode})\n- **Visual**: ${s.visualDirection}\n- **Voiceover**: ${s.voiceover}\n- **On-Screen Text**: ${s.onScreenText}`
      )
      .join('\n\n');
    return `# ${production.title}\n\n**Duration**: ${production.durationEstimate}\n**Opening Hook**: ${production.hookLine}\n\n${scenesText}\n\n**CTA**: ${production.ctaLine}\n\n**Social Caption**:\n${production.socialCaption}`;
  };

  const handleCopy = async () => {
    const md = buildMarkdown();
    if (!md) return;
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const md = buildMarkdown();
    if (!md) return;
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ez-ai-video-script-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#060913] min-h-screen py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-10 border-b border-white/10">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs font-medium text-blue-400">
              Division 05 · AI Video Creator
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Promotional video, YouTube, Instagram Reels, and ad production studio.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Generate conversion-focused opening hooks, scene-by-scene camera directions, voiceover scripts, and on-screen typography cues tailored to YouTube, Instagram, and paid ad channels.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0C1324]">
              <ResilientImage
                src={PLATFORM_IMAGES.videoStudio}
                alt="AI Video Creator Studio"
                className="w-full h-52 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Studio Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={handleGenerate}
            className="lg:col-span-5 bg-[#0C1324] border border-white/10 rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <Clapperboard className="w-4 h-4 text-blue-400" />
              <h2 className="text-base font-semibold text-white">Creative Brief</h2>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Channel &amp; Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FORMATS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFormat(f)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors ${
                      format === f
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#060913] border border-white/10 text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="video-topic" className="block text-xs font-medium text-slate-300 mb-1.5">
                Product, Brand, or Campaign Topic *
              </label>
              <textarea
                id="video-topic"
                rows={3}
                required
                value={productOrTopic}
                onChange={(e) => setProductOrTopic(e.target.value)}
                placeholder="e.g. Launch campaign for our Meridian Technical Trench Shell highlighting weatherproofing and minimalist tailoring."
                className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#060913] border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="video-audience" className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Audience
              </label>
              <input
                id="video-audience"
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#060913] border border-white/15 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="video-tone" className="block text-xs font-medium text-slate-300 mb-1.5">
                Creative Tone
              </label>
              <input
                id="video-tone"
                type="text"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#060913] border border-white/15 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {error && <p className="text-xs text-rose-400">{error}</p>}

            <button
              type="submit"
              disabled={loading || !productOrTopic.trim()}
              className="w-full py-2.5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Generating Storyboard...' : 'Generate Video Production Script'}
            </button>
          </form>

          <div className="lg:col-span-7 bg-[#0C1324] border border-white/10 rounded-xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-white/10">
              <div>
                <h2 className="text-base font-semibold text-white">Production Storyboard</h2>
                <p className="text-xs text-slate-400">{format}</p>
              </div>
              {production && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#060913] border border-white/10 text-slate-200 hover:text-white"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Script'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export .MD</span>
                  </button>
                </div>
              )}
            </div>

            {production ? (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-[#060913] border border-white/10">
                  <div className="flex items-center justify-between gap-4 text-xs text-blue-400 mb-1">
                    <span>Opening Hook</span>
                    <span className="font-mono-tabular">{production.durationEstimate}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{production.title}</h3>
                  <p className="text-sm text-slate-200">&ldquo;{production.hookLine}&rdquo;</p>
                </div>

                <div className="space-y-3">
                  {production.scenes?.map((scene, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#060913] border border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-3"
                    >
                      <div className="sm:col-span-3">
                        <span className="text-xs font-mono-tabular text-blue-400 block">
                          {scene.timecode}
                        </span>
                        <span className="text-[11px] text-slate-400">Scene 0{idx + 1}</span>
                      </div>
                      <div className="sm:col-span-9 space-y-1.5 text-xs">
                        <div>
                          <span className="text-slate-400">Visual: </span>
                          <span className="text-slate-200">{scene.visualDirection}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Voiceover: </span>
                          <span className="text-white">{scene.voiceover}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">On-Screen Text: </span>
                          <span className="text-violet-300 font-medium">{scene.onScreenText}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-[#060913] border border-white/10 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400">CTA: </span>
                    <span className="text-white font-medium">{production.ctaLine}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Recommended Social Caption:</span>
                    <p className="text-slate-300 whitespace-pre-wrap">{production.socialCaption}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-sm text-slate-400">
                Enter your campaign brief on the left to generate a complete scene-by-scene storyboard, voiceover script, and social caption package.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
