export interface Project {
  id: string;
  ref: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  link?: string;
}

export interface Skill {
  name: string;
  category: 'web' | 'media' | 'ai';
  level: number;
  label: string;
}

export interface TerminalLog {
  text: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'input';
  timestamp?: string;
}
