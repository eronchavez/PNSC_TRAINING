<?php
declare(strict_types=1);

final class CourseCatalogue
{
    private const LEVELS = ['beginner', 'intermediate', 'advanced'];
    private const SORTS = ['title', 'duration', '-duration'];

    public function search(array $query): array
    {
        $search = trim((string) ($query['search'] ?? ''));
        $level = trim((string) ($query['level'] ?? ''));
        $sort = (string) ($query['sort'] ?? 'title');
        $page = $this->positiveInteger($query['page'] ?? 1, 'page', 1, 10_000);
        $perPage = $this->positiveInteger($query['per_page'] ?? 6, 'per_page', 1, 20);

        if (strlen($search) > 80) {
            throw new InvalidArgumentException('search must not exceed 80 characters.');
        }
        if ($level !== '' && !in_array($level, self::LEVELS, true)) {
            throw new InvalidArgumentException('level must be beginner, intermediate, or advanced.');
        }
        if (!in_array($sort, self::SORTS, true)) {
            throw new InvalidArgumentException('sort must be title, duration, or -duration.');
        }

        $courses = array_values(array_filter($this->records(), static function (array $course) use ($search, $level): bool {
            if ($level !== '' && $course['level'] !== $level) {
                return false;
            }
            if ($search === '') {
                return true;
            }
            $haystack = $course['title'] . ' ' . $course['description'] . ' ' . implode(' ', $course['tags']);
            return stripos($haystack, $search) !== false;
        }));

        usort($courses, static function (array $a, array $b) use ($sort): int {
            $comparison = match ($sort) {
                'duration' => $a['duration_hours'] <=> $b['duration_hours'],
                '-duration' => $b['duration_hours'] <=> $a['duration_hours'],
                default => strcasecmp($a['title'], $b['title']),
            };
            return $comparison ?: $a['id'] <=> $b['id'];
        });

        $total = count($courses);
        $pages = max(1, (int) ceil($total / $perPage));
        $offset = ($page - 1) * $perPage;

        return [
            'data' => array_slice($courses, $offset, $perPage),
            'meta' => [
                'page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'total_pages' => $pages,
                'has_previous' => $page > 1,
                'has_next' => $page < $pages,
                'source' => 'simulated-memory-catalogue',
            ],
        ];
    }

    private function positiveInteger(mixed $value, string $field, int $min, int $max): int
    {
        $validated = filter_var($value, FILTER_VALIDATE_INT);
        if ($validated === false || $validated < $min || $validated > $max) {
            throw new InvalidArgumentException("{$field} must be an integer from {$min} to {$max}.");
        }
        return $validated;
    }

    private function records(): array
    {
        return [
            ['id' => 1, 'title' => 'HTML Foundations', 'level' => 'beginner', 'duration_hours' => 6, 'tags' => ['html', 'semantics'], 'description' => 'Build accessible document structures.'],
            ['id' => 2, 'title' => 'CSS Layout Systems', 'level' => 'beginner', 'duration_hours' => 8, 'tags' => ['css', 'grid', 'flexbox'], 'description' => 'Create resilient responsive layouts.'],
            ['id' => 3, 'title' => 'JavaScript DOM Patterns', 'level' => 'beginner', 'duration_hours' => 10, 'tags' => ['javascript', 'dom'], 'description' => 'Model interactive browser behavior.'],
            ['id' => 4, 'title' => 'PHP Request Handling', 'level' => 'beginner', 'duration_hours' => 7, 'tags' => ['php', 'http'], 'description' => 'Validate requests and construct responses.'],
            ['id' => 5, 'title' => 'Accessible Interface Testing', 'level' => 'beginner', 'duration_hours' => 5, 'tags' => ['a11y', 'testing'], 'description' => 'Test keyboard and screen-reader behavior.'],
            ['id' => 6, 'title' => 'Git Collaboration Basics', 'level' => 'beginner', 'duration_hours' => 4, 'tags' => ['git', 'workflow'], 'description' => 'Use branches and meaningful commits.'],
            ['id' => 7, 'title' => 'REST Response Design', 'level' => 'intermediate', 'duration_hours' => 9, 'tags' => ['http', 'json'], 'description' => 'Design consistent resource responses.'],
            ['id' => 8, 'title' => 'Secure File Uploads', 'level' => 'intermediate', 'duration_hours' => 11, 'tags' => ['php', 'security'], 'description' => 'Validate content, size, and filenames.'],
            ['id' => 9, 'title' => 'CSS Motion Systems', 'level' => 'intermediate', 'duration_hours' => 8, 'tags' => ['css', 'animation'], 'description' => 'Coordinate accessible interface motion.'],
            ['id' => 10, 'title' => 'Frontend Performance Lab', 'level' => 'intermediate', 'duration_hours' => 12, 'tags' => ['performance', 'browser'], 'description' => 'Profile rendering and asset delivery.'],
            ['id' => 11, 'title' => 'PHP Object Design', 'level' => 'intermediate', 'duration_hours' => 10, 'tags' => ['php', 'oop'], 'description' => 'Separate services and presentation logic.'],
            ['id' => 12, 'title' => 'Automated Web Testing', 'level' => 'intermediate', 'duration_hours' => 13, 'tags' => ['testing', 'automation'], 'description' => 'Test important browser and server flows.'],
            ['id' => 13, 'title' => 'Streaming Data Pipelines', 'level' => 'advanced', 'duration_hours' => 16, 'tags' => ['php', 'streams'], 'description' => 'Process large responses with bounded memory.'],
            ['id' => 14, 'title' => 'Web Security Threat Modeling', 'level' => 'advanced', 'duration_hours' => 14, 'tags' => ['security', 'architecture'], 'description' => 'Identify and reduce application risk.'],
            ['id' => 15, 'title' => 'Browser Rendering Internals', 'level' => 'advanced', 'duration_hours' => 15, 'tags' => ['browser', 'performance'], 'description' => 'Reason about layout, paint, and compositing.'],
            ['id' => 16, 'title' => 'Advanced Image Processing', 'level' => 'advanced', 'duration_hours' => 18, 'tags' => ['php', 'graphics'], 'description' => 'Compose and transform raster assets.'],
            ['id' => 17, 'title' => 'Concurrency Failure Patterns', 'level' => 'advanced', 'duration_hours' => 17, 'tags' => ['concurrency', 'reliability'], 'description' => 'Recognize races, retries, and conflicts.'],
            ['id' => 18, 'title' => 'Progressive Web App Architecture', 'level' => 'advanced', 'duration_hours' => 20, 'tags' => ['pwa', 'offline'], 'description' => 'Design robust offline-first applications.'],
        ];
    }
}
