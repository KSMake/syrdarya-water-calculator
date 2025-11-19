import type { RiverPost, FlowCalculationResult } from '../types/river';

export function formatTime(hours: number): string {
  const days = Math.floor(hours / 24);
  const remainingHours = Math.floor(hours % 24);
  const minutes = Math.round((hours % 1) * 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}д`);
  if (remainingHours > 0) parts.push(`${remainingHours}ч`);
  if (minutes > 0) parts.push(`${minutes}м`);

  return parts.length > 0 ? parts.join(' ') : '0м';
}

export function calculateFlowRateCoefficient(flowRate: number): number {
  const baseFlowRate = 300;
  return Math.sqrt(baseFlowRate / flowRate);
}

export function calculateFlowTime(
  fromPost: RiverPost,
  toPost: RiverPost,
  allPosts: RiverPost[],
  flowRate: number = 300
): FlowCalculationResult | null {
  if (fromPost.order_index >= toPost.order_index) {
    return null;
  }

  const postsInRange = allPosts
    .filter(p => p.order_index > fromPost.order_index && p.order_index <= toPost.order_index)
    .sort((a, b) => a.order_index - b.order_index);

  const resetPoint = postsInRange.find(p => p.is_reset_point);

  let minTime = 0;
  let maxTime = 0;
  let distance = 0;

  const coefficient = calculateFlowRateCoefficient(flowRate);

  if (resetPoint) {
    const postsAfterReset = postsInRange.filter(p => p.order_index >= resetPoint.order_index);

    for (let i = 0; i < postsAfterReset.length; i++) {
      const post = postsAfterReset[i];

      if (i === 0) {
        distance += post.segment_distance_km;
        continue;
      }

      distance += post.segment_distance_km;

      if (post.segment_min_time_hours !== null && post.segment_max_time_hours !== null) {
        minTime += post.segment_min_time_hours * coefficient;
        maxTime += post.segment_max_time_hours * coefficient;
      }
    }

    if (toPost.order_index === resetPoint.order_index) {
      const distanceToReset = resetPoint.accumulated_distance_km - fromPost.accumulated_distance_km;
      return {
        distance_km: distanceToReset,
        min_time_hours: 0,
        max_time_hours: 0,
        avg_time_hours: 0,
        min_time_formatted: 'Зависит от выпуска',
        max_time_formatted: 'Зависит от выпуска',
        avg_time_formatted: 'Зависит от выпуска',
        hasResetPoint: true,
        resetPointName: resetPoint.post_name
      };
    }
  } else {
    for (const post of postsInRange) {
      distance += post.segment_distance_km;

      if (post.segment_min_time_hours !== null && post.segment_max_time_hours !== null) {
        minTime += post.segment_min_time_hours * coefficient;
        maxTime += post.segment_max_time_hours * coefficient;
      }
    }
  }

  const avgTime = (minTime + maxTime) / 2;

  return {
    distance_km: distance,
    min_time_hours: minTime,
    max_time_hours: maxTime,
    avg_time_hours: avgTime,
    min_time_formatted: formatTime(minTime),
    max_time_formatted: formatTime(maxTime),
    avg_time_formatted: formatTime(avgTime),
    hasResetPoint: !!resetPoint,
    resetPointName: resetPoint?.post_name
  };
}
