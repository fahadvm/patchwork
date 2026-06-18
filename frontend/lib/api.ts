export interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  commentCount?: number;
  comments?: Comment[];
  latestAnalysis?: AiAnalysis | null;
}

export interface Comment {
  id: string;
  issueId: string;
  body: string;
  authorName: string;
  createdAt: string;
}

export interface AiAnalysis {
  id: string;
  issueId: string;
  summary: string; // Stored JSON string
  generatedAt: string;
}

export interface ParsedAiAnalysis {
  summary: string;
  keyThemes: string[];
  nextSteps: string[];
  sentiment: string;
}

export interface ApiResponseEnvelope<T> {
  data: T;
  error?: {
    statusCode: number;
    message: string;
  };
}

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
).replace(/\/$/, '');

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  const envelope: ApiResponseEnvelope<T> = await response.json();
  if (envelope.error) {
    throw new Error(envelope.error.message);
  }
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return envelope.data;
}

export const api = {
  getIssues: async (filters?: {
    status?: string;
    priority?: string;
  }): Promise<Issue[]> => {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters?.priority && filters.priority !== 'all') {
      params.append('priority', filters.priority);
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return request<Issue[]>(`/issues${query}`, {
      next: { revalidate: 0 }, // Fetch fresh data
    });
  },

  getIssue: async (id: string): Promise<Issue> => {
    return request<Issue>(`/issues/${id}`, {
      next: { revalidate: 0 },
    });
  },

  createIssue: async (data: {
    title: string;
    description: string;
    status: string;
    priority: string;
  }): Promise<Issue> => {
    return request<Issue>('/issues', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateIssue: async (
    id: string,
    data: { status?: string; priority?: string },
  ): Promise<Issue> => {
    return request<Issue>(`/issues/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  addComment: async (
    issueId: string,
    data: { body: string; authorName: string },
  ): Promise<Comment> => {
    return request<Comment>(`/issues/${issueId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  triggerAiAnalysis: async (issueId: string): Promise<AiAnalysis> => {
    return request<AiAnalysis>(`/issues/${issueId}/analyze`, {
      method: 'POST',
    });
  },
};

export function parseAiAnalysis(summary: string): ParsedAiAnalysis {
  try {
    return JSON.parse(summary);
  } catch (e) {
    // Fallback if parsing fails or if it's unstructured text
    return {
      summary: summary,
      keyThemes: ['N/A'],
      nextSteps: ['N/A'],
      sentiment: 'N/A',
    };
  }
}
