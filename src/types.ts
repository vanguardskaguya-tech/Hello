import { Timestamp } from 'firebase/firestore';

export interface Tip {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Timestamp;
  authorId?: string;
}

export interface Asset {
  id: string;
  title: string;
  url: string;
  type: 'sound' | 'picture';
  category: string;
  createdAt: Timestamp;
}

export interface Niche {
  id: string;
  name: string;
  description: string;
  potential?: string;
  difficulty?: string;
}

export interface GuideStep {
  id: string;
  order: number;
  title: string;
  content: string;
}

export type OperationType = 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
