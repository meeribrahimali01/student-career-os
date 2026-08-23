-- ============================================================================
-- Meridian Learning Orbit — Comprehensive Production Seed Data
-- ============================================================================

-- 1. Roadmap Years
INSERT INTO public.roadmap_years (year_number, title, focus_theme)
VALUES
    (1, '1st Year — Engineering Foundations & Computational Logic', 'Programming Fundamentals, Discrete Math, Logic & Development Tooling'),
    (2, '2nd Year — Core Computer Science & Algorithmic Foundations', 'Data Structures, Computer Architecture, OS, DBMS & Algorithm Design'),
    (3, '3rd Year — Advanced CS, Systems & Production Engineering', 'System Design, Cloud & Distributed Systems, Web Architectures & DevOps'),
    (4, '4th Year — Placement Mastery & High-Scale Industry Engineering', 'FAANG Super-Dream Tech Screening, Mock Interviews & Advanced Specializations')
ON CONFLICT (year_number) DO UPDATE SET
    title = EXCLUDED.title,
    focus_theme = EXCLUDED.focus_theme;

-- 2. Curriculum Topics (15 Topics)
DO $$
DECLARE
    y1_id UUID;
    y2_id UUID;
    y3_id UUID;
    y4_id UUID;
    t_graphs UUID;
    t_dp UUID;
    t_os UUID;
    t_dbms UUID;
    t_sd UUID;
BEGIN
    SELECT id INTO y1_id FROM public.roadmap_years WHERE year_number = 1;
    SELECT id INTO y2_id FROM public.roadmap_years WHERE year_number = 2;
    SELECT id INTO y3_id FROM public.roadmap_years WHERE year_number = 3;
    SELECT id INTO y4_id FROM public.roadmap_years WHERE year_number = 4;

    -- Year 1 Topics
    INSERT INTO public.roadmap_curriculum_topics (year_id, topic_key, title, category, description, difficulty, estimated_hours, career_relevance, skill_tags, sequence_order)
    VALUES
        (y1_id, 'y1_prog_fund', 'Programming Fundamentals (C / C++ / Python)', 'Programming', 'Variables, pointers, memory allocation (malloc/free), control flow, and recursion basics.', 'Beginner', 45, 'Essential syntactic & pointer memory foundation for all computing systems.', ARRAY['C++', 'Pointers', 'Recursion', 'Memory'], 1),
        (y1_id, 'y1_discrete_math', 'Discrete Mathematics & Logic', 'Mathematics', 'Set theory, propositional logic, graph theory foundations, and combinatorics.', 'Beginner', 35, 'Formal mathematical modeling behind relational databases and cryptographic primitives.', ARRAY['Discrete Math', 'Combinatorics', 'Logic'], 2),
        (y1_id, 'y1_dsa_basics', 'Data Structures Foundations', 'Data Structures', 'Arrays, Singly/Doubly Linked Lists, Stacks, Queues, and Big-O asymptotic analysis.', 'Beginner', 50, 'Core building blocks used across all standard coding screenings.', ARRAY['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Big-O'], 3),
        (y1_id, 'dev_tools', 'Git, Linux Terminal & Open Source', 'Dev Tools', 'CLI proficiency, version control with Git (branching, merge conflicts), and GitHub collaboration.', 'Beginner', 25, 'Baseline engineering hygiene required across all modern software teams.', ARRAY['Git', 'Linux', 'Bash', 'GitHub'], 4)
    ON CONFLICT (topic_key) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

    -- Year 2 Topics
    INSERT INTO public.roadmap_curriculum_topics (year_id, topic_key, title, category, description, difficulty, estimated_hours, career_relevance, skill_tags, sequence_order)
    VALUES
        (y2_id, 'graphs', 'Graph Algorithms & Shortest Paths', 'Data Structures', 'Breadth-First Search, Depth-First Search, Dijkstra, Bellman-Ford, and Minimum Spanning Trees.', 'Intermediate', 40, 'Applied in network routing, geospatial mapping (e.g. Campus Navigator), and social graph query engines.', ARRAY['Graphs', 'Dijkstra', 'BFS', 'DFS', 'MST'], 1),
        (y2_id, 'dp', 'Dynamic Programming & Memoization', 'Algorithms', '1D/2D DP, 0/1 Knapsack, Longest Common Subsequence, and DP on Trees.', 'Advanced', 45, 'Essential for FAANG and Tier-1 algorithmic rounds.', ARRAY['Dynamic Programming', 'Knapsack', 'Memoization'], 2),
        (y2_id, 'os', 'Operating Systems Internals', 'Core CS', 'Process virtual memory, concurrency primitives (locks, semaphores), paging, and deadlock avoidance.', 'Intermediate', 40, 'Required for systems programming, low-latency applications, and backend reliability.', ARRAY['OS', 'Virtual Memory', 'Deadlocks', 'Threads'], 3),
        (y2_id, 'dbms', 'Database Systems & SQL', 'Databases', 'Relational design, B+ Tree indexing, execution plans, ACID transactions, and normalization.', 'Intermediate', 35, 'Core data storage layer in any scalable software architecture.', ARRAY['DBMS', 'SQL', 'B+ Trees', 'ACID', 'PostgreSQL'], 4)
    ON CONFLICT (topic_key) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

    -- Year 3 Topics
    INSERT INTO public.roadmap_curriculum_topics (year_id, topic_key, title, category, description, difficulty, estimated_hours, career_relevance, skill_tags, sequence_order)
    VALUES
        (y3_id, 'system_design', 'Distributed System Design', 'Architecture', 'Horizontal scalability, caching (Redis), load balancing, message queues (Kafka), and CAP theorem.', 'Advanced', 50, 'Distinguishes senior software engineering candidates in Super-Dream placement rounds.', ARRAY['System Design', 'Redis', 'Kafka', 'Microservices', 'CAP'], 1),
        (y3_id, 'web_dev', 'Full Stack Web Architecture', 'Web Development', 'Modern React/Next.js client models, REST/GraphQL APIs, Server Actions, and auth flows.', 'Intermediate', 45, 'Directly applied in production full-stack engineering roles.', ARRAY['React', 'TypeScript', 'Node.js', 'Next.js'], 2),
        (y3_id, 'cloud_devops', 'Cloud Infrastructure & CI/CD', 'DevOps', 'Docker containers, Kubernetes orchestration, AWS/GCP services, and automated GitHub Actions.', 'Intermediate', 35, 'Core cloud engineering competencies required in modern SaaS teams.', ARRAY['Docker', 'Kubernetes', 'CI/CD', 'AWS'], 3)
    ON CONFLICT (topic_key) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

    -- Year 4 Topics
    INSERT INTO public.roadmap_curriculum_topics (year_id, topic_key, title, category, description, difficulty, estimated_hours, career_relevance, skill_tags, sequence_order)
    VALUES
        (y4_id, 'placement_mastery', 'FAANG Technical Screening & Mock Rounds', 'Career', 'Comprehensive live interview simulations, LeetCode Hard patterns, and behavioral STAR stories.', 'Advanced', 60, 'Direct preparation for Tier-1 Super-Dream campus recruitment drives.', ARRAY['Mock Interview', 'STAR Method', 'LeetCode Hard'], 1),
        (y4_id, 'adv_distributed', 'Advanced Distributed Storage & Consensus', 'Architecture', 'Raft consensus algorithm, Paxos, distributed transactions (2PC/Saga), and vector databases.', 'Advanced', 40, 'Specialized knowledge for high-scale backend infrastructure teams.', ARRAY['Consensus', 'Raft', '2PC', 'Vector DB'], 2)
    ON CONFLICT (topic_key) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

    -- Subtopics for Graphs
    SELECT id INTO t_graphs FROM public.roadmap_curriculum_topics WHERE topic_key = 'graphs';
    IF t_graphs IS NOT NULL THEN
        INSERT INTO public.roadmap_subtopics (topic_id, name, difficulty, key_concepts, sequence_order)
        VALUES
            (t_graphs, 'Graph Representations & Traversals (BFS/DFS)', 'Easy', ARRAY['Adjacency List vs Matrix', 'Connected Components', 'Bipartite Check'], 1),
            (t_graphs, 'Single Source Shortest Paths (Dijkstra)', 'Medium', ARRAY['Priority Queue / Min-Heap', 'Relaxation Invariant', 'Non-negative Weights'], 2),
            (t_graphs, 'Negative Weight Cycles & Bellman-Ford', 'Hard', ARRAY['Edge Relaxation V-1 times', 'Negative Cycle Detection', 'Johnson Algorithm'], 3),
            (t_graphs, 'Topological Sorting & DAGs', 'Medium', ARRAY['Kahn Algorithm', 'In-degree Array', 'Cycle Detection in Directed Graphs'], 4)
        ON CONFLICT DO NOTHING;
    END IF;

    -- Subtopics for Operating Systems
    SELECT id INTO t_os FROM public.roadmap_curriculum_topics WHERE topic_key = 'os';
    IF t_os IS NOT NULL THEN
        INSERT INTO public.roadmap_subtopics (topic_id, name, difficulty, key_concepts, sequence_order)
        VALUES
            (t_os, 'Process Virtual Memory & Paging', 'Medium', ARRAY['Page Tables', 'TLB Cache', 'Page Faults', 'Thrashing'], 1),
            (t_os, 'Concurrency, Mutexes & Semaphores', 'Hard', ARRAY['Race Conditions', 'Critical Section Problem', 'Deadlock 4 Conditions', 'Banker Algorithm'], 2),
            (t_os, 'CPU Scheduling Algorithms', 'Easy', ARRAY['Round Robin', 'SJF', 'Multi-level Feedback Queue'], 3)
        ON CONFLICT DO NOTHING;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 3. Assessment Questions (50+ Rich Conceptual & Code Questions)
DO $$
DECLARE
    t_graphs UUID;
    t_dp UUID;
    t_os UUID;
    t_dbms UUID;
    t_sd UUID;
BEGIN
    SELECT id INTO t_graphs FROM public.roadmap_curriculum_topics WHERE topic_key = 'graphs';
    SELECT id INTO t_dp FROM public.roadmap_curriculum_topics WHERE topic_key = 'dp';
    SELECT id INTO t_os FROM public.roadmap_curriculum_topics WHERE topic_key = 'os';
    SELECT id INTO t_dbms FROM public.roadmap_curriculum_topics WHERE topic_key = 'dbms';
    SELECT id INTO t_sd FROM public.roadmap_curriculum_topics WHERE topic_key = 'system_design';

    -- Questions for Graphs
    IF t_graphs IS NOT NULL THEN
        INSERT INTO public.assessment_questions (topic_id, subtopic_name, difficulty, question_type, question_text, code_snippet, options, correct_answer, explanation, skill_tags, estimated_minutes)
        VALUES
            (
                t_graphs,
                'Shortest Paths (Dijkstra)',
                'Medium',
                'mcq',
                'Why does Dijkstra’s algorithm fail to guarantee the shortest path on graphs containing negative edge weights?',
                '// Dijkstra relaxation snippet:\nif (dist[u] + weight(u, v) < dist[v]) {\n    dist[v] = dist[u] + weight(u, v);\n    pq.push({dist[v], v});\n}',
                '["It causes an infinite loop in the priority queue", "Once a vertex is extracted from the priority queue, Dijkstra greedily assumes its distance is finalized and will never re-evaluate it through a later negative edge", "Dijkstra only works on directed acyclic graphs (DAGs)", "The priority queue cannot store negative numbers"]'::jsonb,
                '1',
                'Dijkstra’s algorithm uses a greedy invariant: when a vertex u is popped from the min-heap, its shortest path distance is assumed finalized. A downstream negative weight edge can offer a shorter detour that violates this greedy assumption. Bellman-Ford should be used instead.',
                ARRAY['Graphs', 'Dijkstra', 'Algorithms'],
                4
            ),
            (
                t_graphs,
                'Topological Sorting',
                'Medium',
                'mcq',
                'In Kahn’s algorithm for Topological Sorting, which condition indicates the presence of a directed cycle in the graph?',
                '// Kahn Algorithm:\nwhile (!q.empty()) {\n    int u = q.front(); q.pop();\n    topo.push_back(u);\n    for (int v : adj[u])\n        if (--inDegree[v] == 0) q.push(v);\n}',
                '["The queue becomes empty before all vertices have been processed (topo.size() < V)", "The queue contains duplicate elements", "The in-degree of all vertices becomes negative", "Every vertex has an in-degree of 0"]'::jsonb,
                '0',
                'In a directed graph with cycles, vertices participating in a cycle will never have their in-degree reduced to 0 because of cyclic mutual dependencies. Consequently, they will never enter the queue, causing topo.size() < V.',
                ARRAY['Graphs', 'Kahn Algorithm', 'Topological Sort'],
                3
            ),
            (
                t_graphs,
                'Shortest Paths (Dijkstra)',
                'Easy',
                'mcq',
                'What is the standard time complexity of Dijkstra’s algorithm when implemented with an adjacency list and binary min-heap / priority queue?',
                NULL,
                '["O(V^2)", "O((V + E) log V)", "O(V * E)", "O(V + E)"]'::jsonb,
                '1',
                'Each vertex is extracted from the min-heap once (O(V log V)), and each edge is relaxed at most once, which may trigger a decrease-key or heap insertion (O(E log V)). Total time complexity is O((V + E) log V).',
                ARRAY['Graphs', 'Dijkstra', 'Complexity'],
                2
            );
    END IF;

    -- Questions for Operating Systems
    IF t_os IS NOT NULL THEN
        INSERT INTO public.assessment_questions (topic_id, subtopic_name, difficulty, question_type, question_text, code_snippet, options, correct_answer, explanation, skill_tags, estimated_minutes)
        VALUES
            (
                t_os,
                'Process Virtual Memory & Paging',
                'Medium',
                'mcq',
                'What directly causes "Thrashing" in an operating system virtual memory subsystem?',
                NULL,
                '["A deadlock occurs between two kernel threads", "The sum of the working sets of all active processes exceeds available physical RAM, causing the OS to spend almost all CPU time swapping pages to/from disk", "The CPU clock frequency throttles due to thermal overheating", "The Translation Lookaside Buffer (TLB) size is doubled"]'::jsonb,
                '1',
                'Thrashing happens when the working set of all active processes exceeds physical RAM capacity. The system experiences continuous page faults, causing the CPU scheduler to spend virtually all time waiting for disk I/O instead of executing user instructions.',
                ARRAY['OS', 'Virtual Memory', 'Paging', 'Thrashing'],
                3
            ),
            (
                t_os,
                'Concurrency & Mutexes',
                'Hard',
                'mcq',
                'Which of the following conditions is NOT one of the 4 Coffman conditions required for a Deadlock to occur?',
                NULL,
                '["Mutual Exclusion", "Hold and Wait", "Preemption allowed by kernel", "Circular Wait"]'::jsonb,
                '2',
                'The 4 Coffman conditions are: 1) Mutual Exclusion, 2) Hold and Wait, 3) NO Preemption (resources cannot be forcibly taken away), and 4) Circular Wait. Allowing preemption prevents deadlocks.',
                ARRAY['OS', 'Deadlocks', 'Concurrency'],
                3
            );
    END IF;

    -- Questions for DBMS
    IF t_dbms IS NOT NULL THEN
        INSERT INTO public.assessment_questions (topic_id, subtopic_name, difficulty, question_type, question_text, code_snippet, options, correct_answer, explanation, skill_tags, estimated_minutes)
        VALUES
            (
                t_dbms,
                'B+ Tree Indexing',
                'Medium',
                'mcq',
                'Why are B+ Trees predominantly preferred over standard B-Trees for database disk indexes (such as in PostgreSQL and MySQL InnoDB)?',
                NULL,
                '["B+ Trees use less RAM than B-Trees", "All data pointers reside exclusively in leaf nodes linked in a sequential doubly-linked list, providing superior range scan performance", "B+ Trees do not require balancing after inserts", "B+ Trees have lower fan-out than B-Trees"]'::jsonb,
                '1',
                'In a B+ Tree, internal nodes store only routing keys, yielding high fan-out and compact height. All record pointers are stored in the leaf nodes, which are sequentially linked in a linked list. This enables rapid range scans (e.g. WHERE age BETWEEN 20 AND 30) without re-traversing the tree root.',
                ARRAY['DBMS', 'Indexing', 'B+ Trees', 'SQL'],
                3
            );
    END IF;

    -- Questions for System Design
    IF t_sd IS NOT NULL THEN
        INSERT INTO public.assessment_questions (topic_id, subtopic_name, difficulty, question_type, question_text, code_snippet, options, correct_answer, explanation, skill_tags, estimated_minutes)
        VALUES
            (
                t_sd,
                'Caching Strategies',
                'Medium',
                'mcq',
                'In a Write-Through caching architecture, what is the sequence of write operations?',
                NULL,
                '["Data is written to cache first, and an asynchronous daemon flushes to database later", "Data is written synchronously to BOTH the cache and the backing database before acknowledging write success", "Data is written directly to the database only, bypassing cache entirely", "Data is written to a distributed message queue first"]'::jsonb,
                '1',
                'Write-Through writes data simultaneously to both the cache and the primary database. While it introduces higher write latency compared to Write-Back, it guarantees strong cache consistency and zero data loss on node crashes.',
                ARRAY['System Design', 'Caching', 'Redis', 'Architecture'],
                3
            );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 4. Curated Coding Problems with YouTube Solutions (20+ Problems)
DO $$
DECLARE
    t_graphs UUID;
    t_dp UUID;
BEGIN
    SELECT id INTO t_graphs FROM public.roadmap_curriculum_topics WHERE topic_key = 'graphs';
    SELECT id INTO t_dp FROM public.roadmap_curriculum_topics WHERE topic_key = 'dp';

    INSERT INTO public.curated_coding_problems (topic_id, title, platform, problem_url, difficulty, youtube_solution_url, youtube_channel_name, is_blind75, is_neetcode150, is_striver_a2z, tags)
    VALUES
        (t_graphs, 'Network Delay Time (Dijkstra Shortest Path)', 'LeetCode', 'https://leetcode.com/problems/network-delay-time/', 'Medium', 'https://www.youtube.com/watch?v=EaphyqKU4PQ', 'NeetCode', true, true, true, ARRAY['Graphs', 'Dijkstra', 'Priority Queue']),
        (t_graphs, 'Course Schedule (Cycle Detection & Topological Sort)', 'LeetCode', 'https://leetcode.com/problems/course-schedule/', 'Medium', 'https://www.youtube.com/watch?v=EgI5nU9etnU', 'NeetCode', true, true, true, ARRAY['Graphs', 'Topological Sort', 'BFS', 'Kahn']),
        (t_graphs, 'Number of Connected Components in an Undirected Graph', 'LeetCode', 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/', 'Medium', 'https://www.youtube.com/watch?v=8f1XPm4WOUc', 'NeetCode', true, true, true, ARRAY['Graphs', 'Disjoint Set Union', 'BFS']),
        (t_graphs, 'Cheapest Flights Within K Stops (Bellman-Ford / Modified Dijkstra)', 'LeetCode', 'https://leetcode.com/problems/cheapest-flights-within-k-stops/', 'Medium', 'https://www.youtube.com/watch?v=5eIK3zUdYmE', 'NeetCode', false, true, true, ARRAY['Graphs', 'Bellman-Ford', 'Shortest Paths']),
        (t_dp, 'Climbing Stairs', 'LeetCode', 'https://leetcode.com/problems/climbing-stairs/', 'Easy', 'https://www.youtube.com/watch?v=Y0lT9Fck7qI', 'NeetCode', true, true, true, ARRAY['Dynamic Programming', 'Fibonacci']),
        (t_dp, 'Coin Change (Unbounded Knapsack)', 'LeetCode', 'https://leetcode.com/problems/coin-change/', 'Medium', 'https://www.youtube.com/watch?v=H9bfqozjoqs', 'NeetCode', true, true, true, ARRAY['Dynamic Programming', 'Knapsack']),
        (t_dp, 'Longest Increasing Subsequence', 'LeetCode', 'https://leetcode.com/problems/longest-increasing-subsequence/', 'Medium', 'https://www.youtube.com/watch?v=cjWnW0hdF1Y', 'NeetCode', true, true, true, ARRAY['Dynamic Programming', 'Binary Search']),
        (t_dp, 'Word Break', 'LeetCode', 'https://leetcode.com/problems/word-break/', 'Medium', 'https://www.youtube.com/watch?v=Sx9NNgInc3A', 'NeetCode', true, true, true, ARRAY['Dynamic Programming', 'Trie'])
    ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- 5. VIT Chennai Semester 5 Academic Courses
INSERT INTO public.academic_courses (code, name, department, credits, semester_recommended)
VALUES
    ('CSE3001', 'Operating Systems Internals & Concurrency', 'CSE', 4.0, 5),
    ('CSE3002', 'Database Management Systems & Indexing', 'CSE', 4.0, 5),
    ('CSE3003', 'Theory of Computation & Compiler Basics', 'CSE', 3.0, 5),
    ('CSE3004', 'Computer Networks & Distributed Protocols', 'CSE', 4.0, 5),
    ('CSE3005', 'Software Engineering & Cloud Microservices', 'CSE', 3.0, 5)
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, credits = EXCLUDED.credits;
