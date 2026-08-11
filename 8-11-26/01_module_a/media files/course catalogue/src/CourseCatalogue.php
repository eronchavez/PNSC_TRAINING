<?php
final class CourseCatalogue
{
    // place your solution here

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
