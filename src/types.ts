export interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  githubUrl?: string;
  techStack?: string[];
  followersCount: number;
  followingCount: number;
  rankingPoints: number;
  portfolioSummary?: string;
  createdAt: any;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  codeSnippet?: string;
  language?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: any;
}

export interface Project {
  id: string;
  authorId: string;
  title: string;
  description: string;
  imageUrl?: string;
  githubRepo?: string;
  demoUrl?: string;
  techStack?: string[];
  createdAt: any;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: any;
}
