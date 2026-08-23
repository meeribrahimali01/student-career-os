const supabase = require("../config/supabase");

/**
 * Curriculum Service - 4-Year Academic & Placement Roadmap Engine
 */
class CurriculumService {
  /**
   * Fetch 4-Year Curriculum Hierarchy
   */
  async getCurriculum() {
    // 1. Try querying Supabase
    try {
      const { data: years, error } = await supabase
        .from("roadmap_years")
        .select(`
          id,
          year_number,
          title,
          focus_theme,
          topics:roadmap_curriculum_topics(
            id,
            topic_key,
            title,
            category,
            description,
            difficulty,
            estimated_hours,
            career_relevance,
            skill_tags,
            sequence_order,
            subtopics:roadmap_subtopics(id, name, difficulty, key_concepts, sequence_order)
          )
        `)
        .order("year_number", { ascending: true });

      if (!error && years && years.length > 0) {
        return years;
      }
    } catch (err) {
      console.warn("[CurriculumService] Database query fallback, returning formatted curriculum:", err.message);
    }

    // Default Fallback Curriculum (Ensures 100% resilience)
    return [
      {
        year_number: 1,
        title: "1st Year — Engineering Foundations & Computational Logic",
        focus_theme: "Programming Fundamentals, Discrete Math, Logic & Development Tooling",
        topics: [
          {
            id: "y1_prog_fund",
            topic_key: "y1_prog_fund",
            title: "Programming Fundamentals (C / C++ / Python)",
            category: "Programming",
            difficulty: "Beginner",
            estimated_hours: 45,
            career_relevance: "Essential syntactic & pointer memory foundation for all computing systems.",
            skill_tags: ["C++", "Pointers", "Recursion", "Memory"],
            subtopics: [
              { name: "Pointers & Dynamic Memory", difficulty: "Easy", key_concepts: ["Stack vs Heap", "Pointer Arithmetic"] },
              { name: "Recursion & Backtracking Basics", difficulty: "Medium", key_concepts: ["Base Cases", "Call Stack"] },
            ],
          },
          {
            id: "y1_dsa_basics",
            topic_key: "y1_dsa_basics",
            title: "Data Structures Foundations",
            category: "Data Structures",
            difficulty: "Beginner",
            estimated_hours: 50,
            career_relevance: "Core building blocks used across all standard coding screenings.",
            skill_tags: ["Arrays", "Linked Lists", "Stacks", "Queues"],
            subtopics: [
              { name: "Array Manipulations & Two Pointers", difficulty: "Easy", key_concepts: ["Sliding Window", "Prefix Sums"] },
              { name: "Stack & Queue Applications", difficulty: "Medium", key_concepts: ["Monotonic Stack", "Deque"] },
            ],
          },
        ],
      },
      {
        year_number: 2,
        title: "2nd Year — Core Computer Science & Algorithmic Foundations",
        focus_theme: "Data Structures, Computer Architecture, OS, DBMS & Algorithm Design",
        topics: [
          {
            id: "graphs",
            topic_key: "graphs",
            title: "Graph Algorithms & Shortest Paths",
            category: "Data Structures",
            difficulty: "Intermediate",
            estimated_hours: 40,
            career_relevance: "Applied in network routing, geospatial mapping, and graph databases.",
            skill_tags: ["Graphs", "Dijkstra", "BFS", "DFS"],
            subtopics: [
              { name: "Graph Representations & Traversals", difficulty: "Easy", key_concepts: ["Adjacency List", "Connected Components"] },
              { name: "Single Source Shortest Paths (Dijkstra)", difficulty: "Medium", key_concepts: ["Min-Heap", "Relaxation"] },
              { name: "Negative Weight Cycles & Bellman-Ford", difficulty: "Hard", key_concepts: ["Edge Relaxation", "Negative Cycles"] },
            ],
          },
          {
            id: "os",
            topic_key: "os",
            title: "Operating Systems & Concurrency",
            category: "Core CS",
            difficulty: "Intermediate",
            estimated_hours: 35,
            career_relevance: "Process scheduling, thread safety, and memory management in production systems.",
            skill_tags: ["OS", "Processes", "Threads", "Memory"],
            subtopics: [
              { name: "CPU Scheduling & Context Switching", difficulty: "Easy", key_concepts: ["Round Robin", "SJF"] },
              { name: "Synchronization & Deadlocks", difficulty: "Medium", key_concepts: ["Mutex", "Semaphores", "Banker's Algorithm"] },
            ],
          },
        ],
      },
      {
        year_number: 3,
        title: "3rd Year — Advanced CS, Systems & Production Engineering",
        focus_theme: "System Design, Microservices, Cloud Native Infrastructure & Dynamic Programming",
        topics: [
          {
            id: "dp",
            topic_key: "dp",
            title: "Advanced Dynamic Programming",
            category: "Algorithms",
            difficulty: "Advanced",
            estimated_hours: 50,
            career_relevance: "Essential for optimization problems and algorithmic screening rounds.",
            skill_tags: ["DP", "Memoization", "Tabulation"],
            subtopics: [
              { name: "1D & 2D Grid DP", difficulty: "Medium", key_concepts: ["House Robber", "Grid Paths"] },
              { name: "Knapsack & Subsequence Problems", difficulty: "Hard", key_concepts: ["0/1 Knapsack", "LIS"] },
            ],
          },
        ],
      },
      {
        year_number: 4,
        title: "4th Year — Placement Mastery & High-Scale Industry Engineering",
        focus_theme: "FAANG Placement Sprints, System Design Interview Defense & Distributed Storage",
        topics: [
          {
            id: "system_design",
            topic_key: "system_design",
            title: "Distributed Systems & Scalability",
            category: "Architecture",
            difficulty: "Advanced",
            estimated_hours: 45,
            career_relevance: "Required for senior software engineer and tier-1 product company placements.",
            skill_tags: ["System Design", "Microservices", "Kafka", "Redis"],
            subtopics: [
              { name: "Load Balancing & Caching Strategies", difficulty: "Medium", key_concepts: ["Consistent Hashing", "Redis"] },
              { name: "Message Queues & Database Sharding", difficulty: "Hard", key_concepts: ["Kafka", "Horizontal Partitioning"] },
            ],
          },
        ],
      },
    ];
  }

  /**
   * Fetch Assessment Questions for a Topic
   */
  async getQuestionsByTopic(topicId) {
    try {
      const { data: questions, error } = await supabase
        .from("assessment_questions")
        .select("*")
        .eq("topic_id", topicId);

      if (!error && questions && questions.length > 0) {
        return questions;
      }
    } catch (err) {
      console.warn("[CurriculumService] Database query fallback, returning default questions:", err.message);
    }

    // Default question sets
    const defaultQuestions = {
      graphs: [
        {
          id: "q_graph_1",
          topic_id: "graphs",
          question_text: "What is the time complexity of Dijkstra's algorithm implemented using a Min-Heap / Priority Queue for a graph with V vertices and E edges?",
          options: [
            "O(V^2)",
            "O((V + E) log V)",
            "O(V * E)",
            "O(E log E + V)"
          ],
          correct_option_index: 1,
          explanation: "Using a binary min-heap with adjacency lists, extracting min takes O(V log V) and decreasing keys / pushing edges takes O(E log V), yielding total complexity O((V + E) log V).",
          difficulty: "Medium",
          points: 100,
        },
      ],
      dp: [
        {
          id: "q_dp_1",
          topic_id: "dp",
          question_text: "Which of the following problems can be solved in O(N log N) time using Patience Sorting / Binary Search?",
          options: [
            "0/1 Knapsack Problem",
            "Longest Increasing Subsequence (LIS)",
            "Matrix Chain Multiplication",
            "Traveling Salesperson Problem"
          ],
          correct_option_index: 1,
          explanation: "Longest Increasing Subsequence can be optimized from O(N^2) dynamic programming to O(N log N) using a tails array updated via binary search (std::lower_bound).",
          difficulty: "Medium",
          points: 100,
        },
      ],
      os: [
        {
          id: "q_os_1",
          topic_id: "os",
          question_text: "Which condition is NOT one of Coffman's four conditions required for a Deadlock to occur in an operating system?",
          options: [
            "Mutual Exclusion",
            "Hold and Wait",
            "Preemptive Resource Scheduling",
            "Circular Wait"
          ],
          correct_option_index: 2,
          explanation: "Deadlock requires NO PREEMPTION (resources cannot be forcibly taken from a process). Preemptive scheduling breaks deadlocks.",
          difficulty: "Easy",
          points: 100,
        },
      ],
    };

    return defaultQuestions[topicId] || [];
  }

  /**
   * Fetch Curated Study Resources
   */
  async getStudyResources(topicId = null) {
    try {
      let query = supabase.from("study_resources").select("*");
      if (topicId && topicId !== "All") {
        query = query.eq("topic_id", topicId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn("[CurriculumService] Study resources fallback activated");
    }

    // Return rich verified resources
    const allResources = [
      {
        id: "res_graph_abdul_bari",
        title: "Dijkstra's Algorithm — Single Source Shortest Path",
        category: "Data Structures",
        topic_id: "graphs",
        type: "Video Series",
        platform: "YouTube",
        difficulty: "Intermediate",
        description: "Definitive theoretical breakdown of Dijkstra's greedy invariant and priority queue optimizations by Abdul Bari.",
        url: "https://www.youtube.com/watch?v=XB4MIexjvY0",
        author: "Abdul Bari",
        tags: ["Graphs", "Dijkstra", "Shortest Path"],
      },
      {
        id: "res_graph_striver_playlist",
        title: "Striver Graph Series — BFS, DFS, Topological Sort & Disjoint Set",
        category: "Data Structures",
        topic_id: "graphs",
        type: "Video Series",
        platform: "YouTube",
        difficulty: "Intermediate",
        description: "Complete 54-video curated curriculum covering every graph pattern asked in FAANG/Tier-1 interviews.",
        url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn",
        author: "takeUforward / Striver",
        tags: ["Graphs", "BFS", "DFS", "Topological Sort", "DSU"],
      },
      {
        id: "res_dp_striver_playlist",
        title: "Striver Dynamic Programming Masterclass Playlist",
        category: "Algorithms",
        topic_id: "dp",
        type: "Video Series",
        platform: "YouTube",
        difficulty: "Advanced",
        description: "From 1D DP, 2D Grid DP, Subsequences, Knapsack, LIS O(N log N) to Matrix Chain Multiplication.",
        url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0qUlt5H_kiKGl20_cU8h9UL",
        author: "takeUforward / Striver",
        tags: ["DP", "1D DP", "2D DP", "Knapsack"],
      },
      {
        id: "res_os_ostep_book",
        title: "Operating Systems: Three Easy Pieces (OSTEP)",
        category: "Core CS",
        topic_id: "os",
        type: "Reference Book",
        platform: "Official Docs",
        difficulty: "Intermediate",
        description: "The gold-standard OS textbook by Remzi & Andrea Arpaci-Dusseau covering Virtualization, Concurrency, and Persistence.",
        url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
        author: "Univ of Wisconsin-Madison",
        tags: ["OSTEP", "Virtual Memory", "Concurrency", "Semaphores"],
      },
      {
        id: "res_dbms_postgres_docs",
        title: "PostgreSQL Official Documentation & SQL Reference",
        category: "Databases",
        topic_id: "dbms",
        type: "Documentation",
        platform: "Official Docs",
        difficulty: "Intermediate",
        description: "Official PostgreSQL documentation covering MVCC, B-tree indexing, and transaction isolation levels.",
        url: "https://www.postgresql.org/docs/current/",
        author: "PostgreSQL Global Development Group",
        tags: ["PostgreSQL", "SQL", "Indexing", "ACID"],
      },
      {
        id: "res_sd_primer",
        title: "The System Design Primer (GitHub)",
        category: "Architecture",
        topic_id: "system_design",
        type: "Reference Book",
        platform: "GitHub",
        difficulty: "Advanced",
        description: "The most starred system design resource covering scalability, load balancers, caching, and sharding.",
        url: "https://github.com/donnemartin/system-design-primer",
        author: "Donne Martin",
        tags: ["System Design", "Scalability", "Redis", "Kafka"],
      },
    ];

    if (topicId && topicId !== "All") {
      return allResources.filter((r) => r.topic_id === topicId);
    }
    return allResources;
  }
}

module.exports = new CurriculumService();
