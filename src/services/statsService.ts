let requestCount = 0;
let successCount = 0;
let failureCount = 0;
const latencies: number[] = [];

export const logRequest = (latency: number, success: boolean) => {
  requestCount++;
  success ? successCount++ : failureCount++;
  latencies.push(latency);
};

export const getSystemStats = () => {
  const sorted = [...latencies].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(0.95 * sorted.length)] || 0;
  const median = sorted[Math.floor(0.5 * sorted.length)] || 0;

  return {
    totalRequests: requestCount,
    successCount,
    failureCount,
    p95Latency: p95,
    medianLatency: median
  };
};
