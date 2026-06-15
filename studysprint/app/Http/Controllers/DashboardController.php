<?php

namespace App\Http\Controllers;

use App\Models\StudyTip;
use App\Models\Task;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $today = now()->toDateString();

        $nextDueTask = Task::where('user_id', $user->id)
            ->where('completed', false)
            ->whereDate('due_date', '>=', $today)
            ->orderBy('due_date')
            ->first();
        $recentTasks = Task::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
        $randomTip = StudyTip::inRandomOrder()->first();

        return response()->json([
            'user' => $user->name,

            'summary' => [
                'today_count' => Task::where('user_id', $user->id)
                    ->whereDate('due_date', $today)
                    ->where('completed', false)
                    ->count(),
                'overdue_count' => Task::where('user_id', $user->id)
                    ->whereDate('due_date', '<', $today)
                    ->where('completed', false)
                    ->count(),
                'completed_count' => Task::where('user_id', $user->id)
                    ->where('completed', true)
                    ->count(),
                'pending_count' => Task::where('user_id', $user->id)
                    ->where('completed', false)
                    ->count(),
            ],

            'next_due_task' => [
                'id' => $nextDueTask?->id,
                'title' => $nextDueTask?->title,
                'subject' => $nextDueTask?->subject,
                'due_date' => $nextDueTask?->due_date,
                'priority' => $nextDueTask?->priority,
                'completed' => $nextDueTask?->completed
            ],

            'recent_tasks' => $recentTasks->map(function ($task) {
                return [
                    'id' => $task?->id,
                    'title' => $task?->title,
                    'subject' => $task?->subject,
                    'due_date' => $task?->due_date,
                    'priority' => $task?->priority,
                    'completed' => $task?->completed
                ];
            }),
            'tip' => [
                'title' => $randomTip?->title,
                'content' => $randomTip?->content
            ],
        ]);
    }
}