export interface Page {
  id: string;
  title: string;
  content: string;
  parentId: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  author: string;
}

export interface Section {
  id: string;
  title: string;
  order: number;
}

export interface TreeNode {
  id: string;
  title: string;
  parentId: string | null;
  order: number;
  children: TreeNode[];
  isSection: boolean;
}

export interface CreatePageParams {
  title: string;
  parentId: string | null;
  content?: string;
}

export interface UpdatePageParams {
  id: string;
  title?: string;
  content?: string;
}

export interface ReorderPageParams {
  id: string;
  newOrder: number;
  newParentId: string | null;
}

export interface AutosaveStatus {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: string;
  error?: string;
}
