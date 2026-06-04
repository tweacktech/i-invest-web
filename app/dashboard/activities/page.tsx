'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api-client';
import { useMoney } from '@/lib/currency';

type TaskStatus = {
  id: string;
  title: string;
  youtubeUrl: string;
  watchSeconds: number;
  rewardAmount: string;
  sortOrder: number;
  startedAt: string | null;
  claimedToday: boolean;
};


function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
  } catch {
    return url;
  }
  return url;
}

function TaskListView({ tasks }: { tasks: TaskStatus[] }) {
  const router = useRouter();
  const { format } = useMoney();

  if (!tasks?.length) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Activity center</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          No tasks yet. An admin can add YouTube watch tasks from Admin → Daily tasks.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4 lg:p-10">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Activity center</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Watch videos and earn rewards (once per day per task)</p>

      <div className="mt-8 space-y-3">
        {tasks.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => router.push(`?task=${task.id}`)}
            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-600 dark:hover:bg-slate-800"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{task.title}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Reward: {format(task.rewardAmount)}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">Watch: {task.watchSeconds}s</p>
              </div>
              {task.claimedToday && (
                <div className="ml-4 rounded-lg bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  Claimed ✓
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function TaskDetailView({ task, onBack }: { task: TaskStatus; onBack: () => void }) {
  const [watchTime, setWatchTime] = useState(0);
  const [isWatching, setIsWatching] = useState(false);
  const watchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const qc = useQueryClient();

  const claim = useMutation({
    mutationFn: async (taskId: string) => {
      const { data } = await api.post(`/daily-tasks/${taskId}/claim`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['daily-tasks-status'] });
      qc.invalidateQueries({ queryKey: ['settings-profile'] });
      setWatchTime(0);
      setIsWatching(false);
    },
  });

  const handleStartWatching = () => {
    setIsWatching(true);
    setWatchTime(0);
  };

  const handleStopWatching = () => {
    setIsWatching(false);
    if (watchTimerRef.current) {
      clearInterval(watchTimerRef.current);
    }
  };


  // Timer that increments while watching
  useEffect(() => {
    if (!isWatching) {
      if (watchTimerRef.current) {
        clearInterval(watchTimerRef.current);
      }
      return;
    }

    watchTimerRef.current = setInterval(() => {
      setWatchTime((prev) => {
        const newTime = prev + 1;
        if (newTime >= task.watchSeconds) {
          setIsWatching(false);
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (watchTimerRef.current) {
        clearInterval(watchTimerRef.current);
      }
    };
  }, [isWatching, task.watchSeconds]);

  const hasWatchedEnough = watchTime >= task.watchSeconds;
  const progressPercent = (watchTime / task.watchSeconds) * 100;
  const timeRemaining = Math.max(0, task.watchSeconds - watchTime);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
        {/* Close button */}
        <button
          onClick={onBack}
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 lg:p-10">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{task.title}</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Required watch time: {task.watchSeconds} seconds</p>

          <div className="mt-6 aspect-video w-full overflow-hidden rounded-xl bg-black">
            <iframe
              title={task.title}
              className="h-full w-full"
              src={toEmbedUrl(task.youtubeUrl)}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Watch Timer */}
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Watch time</p>
              <p className="text-lg font-mono font-bold text-slate-900 dark:text-slate-100">
                {Math.floor(watchTime / 60)}:{String(watchTime % 60).padStart(2, '0')} / {Math.floor(task.watchSeconds / 60)}:{String(task.watchSeconds % 60).padStart(2, '0')}
              </p>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-300 dark:bg-slate-600">
              <div
                className="h-full rounded-full bg-blue-600 transition-all dark:bg-blue-500"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
            {!hasWatchedEnough && (
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                {isWatching ? `${timeRemaining}s remaining` : 'Click "Start watching" to begin'}
              </p>
            )}
          </div>

          {/* Control Buttons */}
          <div className="mt-4 flex gap-2">
            {!hasWatchedEnough ? (
              <>
                <button
                  type="button"
                  onClick={handleStartWatching}
                  disabled={isWatching}
                  className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {isWatching ? 'Watching...' : 'Start watching'}
                </button>
                {isWatching && (
                  <button
                    type="button"
                    onClick={handleStopWatching}
                    className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Pause
                  </button>
                )}
              </>
            ) : (
              <div className="w-full rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-900/20">
                <p className="text-sm font-medium text-green-900 dark:text-green-300">✓ Video watched! Ready to claim.</p>
              </div>
            )}
          </div>

          {/* Claim Button */}
          <button
            type="button"
            disabled={!hasWatchedEnough || task.claimedToday || claim.isPending}
            onClick={() => claim.mutate(task.id)}
            className="mt-4 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {task.claimedToday
              ? 'Already claimed today'
              : hasWatchedEnough
                ? `Claim ${task.rewardAmount} NGN reward`
                : 'Watch video to claim reward'}
          </button>

          {task.claimedToday && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-900/20">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Already claimed today. Come back tomorrow!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ActivitiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { format } = useMoney();
  const selectedTaskId = searchParams.get('task');
  const qc = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['daily-tasks-status'],
    queryFn: async () => (await api.get<TaskStatus[]>('/daily-tasks/status')).data,
  });

  const currentTask = tasks?.find((t) => t.id === selectedTaskId) || null;

  const handleBack = () => {
    router.push('?');
  };

  if (isLoading) return <div className="p-10 text-slate-500 dark:text-slate-400">Loading activities…</div>;

  if (currentTask) {
    return <TaskDetailView task={currentTask} onBack={handleBack} />;
  }

  return <TaskListView tasks={tasks || []} />;
}