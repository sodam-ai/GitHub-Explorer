import type { Repository } from '@/types';

export interface HealthScore {
  total: number;
  breakdown: {
    popularity: number;
    activity: number;
    community: number;
    documentation: number;
  };
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export function calculateHealthScore(repo: Repository, extraData?: {
  open_issues?: number;
  forks?: number;
  updated_at?: string;
  has_wiki?: boolean;
  license?: string;
}): HealthScore {
  let popularity = 0;
  let activity = 0;
  let community = 0;
  let documentation = 0;

  // Popularity (0-25): stars
  if (repo.stars >= 10000) popularity = 25;
  else if (repo.stars >= 5000) popularity = 22;
  else if (repo.stars >= 1000) popularity = 18;
  else if (repo.stars >= 500) popularity = 14;
  else if (repo.stars >= 100) popularity = 10;
  else if (repo.stars >= 10) popularity = 5;

  // Activity (0-25): recent updates
  if (extraData?.updated_at) {
    const daysSinceUpdate = Math.floor(
      (Date.now() - new Date(extraData.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceUpdate <= 7) activity = 25;
    else if (daysSinceUpdate <= 30) activity = 20;
    else if (daysSinceUpdate <= 90) activity = 15;
    else if (daysSinceUpdate <= 365) activity = 8;
    else activity = 2;
  } else {
    activity = 12; // unknown
  }

  // Community (0-25): forks + issues
  if (extraData?.forks) {
    if (extraData.forks >= 1000) community += 12;
    else if (extraData.forks >= 100) community += 8;
    else if (extraData.forks >= 10) community += 4;
  }
  if (repo.topics.length >= 5) community += 8;
  else if (repo.topics.length >= 2) community += 5;
  community = Math.min(community + 5, 25);

  // Documentation (0-25): description, readme, license
  if (repo.description && repo.description.length > 20) documentation += 8;
  if (repo.readme_snippet) documentation += 7;
  if (extraData?.license) documentation += 5;
  if (extraData?.has_wiki) documentation += 5;
  documentation = Math.min(documentation, 25);

  const total = popularity + activity + community + documentation;

  let grade: HealthScore['grade'];
  if (total >= 80) grade = 'A';
  else if (total >= 60) grade = 'B';
  else if (total >= 40) grade = 'C';
  else if (total >= 20) grade = 'D';
  else grade = 'F';

  return {
    total,
    breakdown: { popularity, activity, community, documentation },
    grade,
  };
}

export function getHealthColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#3b82f6';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}
