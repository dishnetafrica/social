import axios, { AxiosRequestConfig } from 'axios';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  initialBackoffMs = 500
): Promise<T> {
  let attempt = 0;
  let backoff = initialBackoffMs;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt += 1;
      if (attempt > retries) {
        throw error;
      }
      await sleep(backoff);
      backoff *= 2;
    }
  }
}

export async function requestWithRetry<T = unknown>(config: AxiosRequestConfig, retries = 3): Promise<T> {
  return withRetry(async () => {
    const response = await axios.request<T>(config);
    return response.data;
  }, retries);
}
