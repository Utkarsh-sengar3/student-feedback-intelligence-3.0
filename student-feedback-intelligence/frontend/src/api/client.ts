import type {
  FeedbackRequest,
  FeedbackResponse,
  SearchResponse,
  InsightRecord,
  InsightSummary,
  ReviewsListResponse,
  ModelMetrics,
  AssistantRequest,
  AssistantResponse,
  HealthResponse,
  StatusResponse,
} from './types';

const ENV_API_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

function getApiBase(): string {
  if (ENV_API_URL && ENV_API_URL.trim()) {
    return ENV_API_URL.trim().replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    // In Vite dev server, relative URLs trigger the Vite proxy to :8000
    return import.meta.env.DEV ? '' : 'http://127.0.0.1:8000';
  }
  return '';
}

const API_BASE = getApiBase();

// In-memory cache for static read endpoints to make page switching instant
const requestCache = new Map<string, { timestamp: number; data: unknown }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface ExtendedRequestOptions extends RequestInit {
  timeoutMs?: number;
  skipCache?: boolean;
  retries?: number;
}

async function request<T>(path: string, options?: ExtendedRequestOptions): Promise<T> {
  const isGet = !options?.method || options.method === 'GET';
  const cacheKey = `${path}`;

  // Check client cache for static GET requests
  if (isGet && !options?.skipCache && requestCache.has(cacheKey)) {
    const cached = requestCache.get(cacheKey)!;
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data as T;
    }
    requestCache.delete(cacheKey);
  }

  const url = `${API_BASE}${path}`;
  // Longer timeout for assistant queries (90s) and 60s for standard requests to accommodate Render cold starts
  const timeoutMs = options?.timeoutMs ?? (path.includes('/assistant') ? 90000 : 60000);
  const maxRetries = options?.retries ?? (isGet ? 1 : 0);

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        // If 503 (Render waking up) and we have retries left, wait and retry
        if (response.status === 503 && attempt < maxRetries) {
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }
        const error = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error((error as { detail?: string }).detail || `HTTP ${response.status}`);
      }

      const data = (await response.json()) as T;

      // Cache successful GET results for static datasets
      if (isGet && (path.includes('/insights') || path.includes('/model-metrics') || path === '/health')) {
        requestCache.set(cacheKey, { timestamp: Date.now(), data });
      }

      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err instanceof Error ? err : new Error(String(err));

      // Retry on network errors or timeout if attempts remain
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 2500));
        continue;
      }
    }
  }

  if (lastError && lastError.name === 'AbortError') {
    throw new Error('Request timed out. The cloud server may be waking up from sleep (Render free tier) — please try again in a few seconds.');
  }

  throw lastError || new Error('Network request failed.');
}

export const api = {
  health: () => request<HealthResponse>('/health'),

  status: () => request<StatusResponse>('/api/v1/status'),

  analyze: (payload: FeedbackRequest) =>
    request<FeedbackResponse>('/api/v1/analyze', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  search: (query: string, top_k = 10, domain?: string, sentiment?: string) => {
    const params = new URLSearchParams({ query, top_k: String(top_k) });
    if (domain) params.set('domain', domain);
    if (sentiment) params.set('sentiment', sentiment);
    return request<SearchResponse>(`/api/v1/search/?${params}`);
  },

  insights: {
    all: () =>
      request<{ success: boolean; count: number; data: InsightRecord[] }>(
        '/api/v1/insights/'
      ),
    top: (limit = 10) =>
      request<{ success: boolean; data: InsightRecord[] }>(
        `/api/v1/insights/top?limit=${limit}`
      ),
    summary: () =>
      request<{ success: boolean; data: InsightSummary }>(
        '/api/v1/insights/summary'
      ),
  },

  reviews: (
    page = 1,
    page_size = 20,
    domain?: string,
    sentiment?: string,
    search?: string
  ) => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(page_size),
    });
    if (domain) params.set('domain', domain);
    if (sentiment) params.set('sentiment', sentiment);
    if (search) params.set('search', search);
    return request<ReviewsListResponse>(`/api/v1/reviews/?${params}`);
  },

  metrics: () => request<ModelMetrics>('/api/v1/model-metrics/'),

  assistant: (payload: AssistantRequest) =>
    request<AssistantResponse>('/api/v1/assistant/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
