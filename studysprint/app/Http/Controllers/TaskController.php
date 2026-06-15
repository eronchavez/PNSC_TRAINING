<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TaskController extends Controller
{
    /**
     * Display a listing of tasks.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $tasks = $user->tasks();

        // Filters
        if ($request->has('search')) {
            $tasks->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->has('subject')) {
            $tasks->where('subject', $request->subject);
        }

        if ($request->has('priority')) {
            $tasks->where('priority', $request->priority);
        }

        if ($request->has('completed')) {
            $completed = filter_var($request->completed, FILTER_VALIDATE_BOOLEAN);
            $tasks->where('completed', $completed);
        }

        // Sorting
        $allowedSorts = [
            'title',
            'subject',
            'due_date',
            'priority',
            'completed'
        ];

        $sort = $request->query('sort', 'due_date');
        $direction = strtolower($request->query('direction', 'asc'));

        if (!in_array($sort, $allowedSorts)) {
            $sort = 'due_date';
        }

        if (!in_array($direction, ['asc', 'desc'])) {
            $direction = 'asc';
        }

        $tasks->orderBy($sort, $direction);

        // Pagination
        $perPage = $request->query('per_page', 10);

        $paginatedTasks = $tasks
            ->paginate($perPage)
            ->appends($request->query());

        return response()->json([
            'data' => $paginatedTasks->getCollection()->map(function ($task) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'subject' => $task->subject,
                    'due_date' => $task->due_date,
                    'priority' => $task->priority,
                    'completed' => (bool) $task->completed,
                    'notes' => $task->notes,
                    'created_at' => $task->created_at,
                    'updated_at' => $task->updated_at,
                ];
            }),

            'meta' => [
                'total' => $paginatedTasks->total(),

                'filters' => [
                    'search' => $request->query('search'),
                    'subject' => $request->query('subject'),
                    'priority' => $request->query('priority'),
                    'completed' => $request->query('completed'),
                    'sort' => $sort,
                    'direction' => $direction,
                ],

                'pagination' => [
                    'current_page' => $paginatedTasks->currentPage(),
                    'per_page' => $paginatedTasks->perPage(),
                    'last_page' => $paginatedTasks->lastPage(),
                    'from' => $paginatedTasks->firstItem(),
                    'to' => $paginatedTasks->lastItem(),
                ],
            ],

            'links' => [
                'first' => $paginatedTasks->url(1),
                'last' => $paginatedTasks->url($paginatedTasks->lastPage()),
                'prev' => $paginatedTasks->previousPageUrl(),
                'next' => $paginatedTasks->nextPageUrl(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'due_date' => 'nullable|date',
            'priority' => 'nullable|in:Low,Medium,High',
            'notes' => 'nullable|string'
        ]);

        $task = $request->user()->tasks()->create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'subject' => $validated['subject'],
            'due_date' => $validated['due_date'] ?? null,
            'priority' => $validated['priority'] ?? null,
            'notes' => $validated['notes'] ?? null
        ]);

        return response()->json($task, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Task $task)
    {
        Gate::authorize('view', $task);
        
        return response()->json([
            'id' => $task->id,
            'title' => $task->title,
            'subject' => $task->subject,
            'due_date' => $task->due_date,
            'priority' => $task->priority,
            'completed' => $task->completed,
            'notes' => $task->notes,
            'created_at' => $task->created_at,
            'updated_at' => $task->updated_at
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'subject' => 'sometimes|required|string|max:255',
            'due_date' => 'sometimes|nullable|date',
            'priority' => 'sometimes|nullable|in:Low,Medium,High',
            'completed' => 'sometimes|boolean',
            'notes' => 'sometimes|nullable|string'
        ]);

        $task->update($validated);

        return response()->json($task);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }
}
