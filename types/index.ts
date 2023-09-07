export interface Meta {
  description?: string;
  logo?: string;
  ogImage?: string;
  ogUrl?: string;
  title?: string;
  twitter?: string;
}

export interface AudioInput {
  title: string;
  input: File | string;
  duration: number; // in seconds
  prompt?: string;
  transcript?: string;
  type?: "audio" | "youtube" | "podcast";
  image?: string
}

export interface Episode {
  id: string;
  audioUrl: string;
  imageUrl: string;
  title: string;
  description: string;
  length: number;
  podcast: {
    title: string;
    imageUrl: string;
  };
}

export interface Article {
  url: string;
  title: string;
  description: string;
  image: string;
  author: string;
  content: string;
  published: string;
  source: string; // original publisher
  links: string[]; // list of alternative links
  ttr: number; // time to read in second, 0 = unknown
}

export type TranscriptOption = {
  prompt: string;
  translate: boolean;
  srt: boolean;
};

export type CreditHistory = {
  audio_length: number;
  create_at: string;
  audio_url: string;
  audio_image: string;
  status: 'pending' | 'completed' | 'failed';
  id: string;
  name: string;
  title: string;
  credit: number;
  type: 'audio' | 'youtube' | 'podcast';
};
