/**
 * JobProof Agent Audit Time Formatting Utility
 * Provides reactive relative time formatting for verified job openings.
 */

export function formatTimeAgo(timestamp, now = Date.now()) {
  if (!timestamp) return 'recently';
  
  const time = new Date(timestamp).getTime();
  if (isNaN(time)) return 'recently';

  const diffSec = Math.max(0, Math.floor((now - time) / 1000));

  if (diffSec < 45) {
    return 'just now';
  }
  if (diffSec < 90) {
    return '1m ago';
  }

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin}m ago`;
  }

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) {
    return `${diffHr}h ago`;
  }

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) {
    return 'yesterday';
  }
  if (diffDay < 7) {
    return `${diffDay}d ago`;
  }

  const diffWeeks = Math.floor(diffDay / 7);
  return `${diffWeeks}w ago`;
}

export function formatFullAuditTimestamp(timestamp) {
  if (!timestamp) return 'Live checked by JobProof AI Sentinel';
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return String(timestamp);

  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}
