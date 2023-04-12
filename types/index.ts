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
}

export interface Episode {
  id: string;
  audio: string;
  image: string;
  title_original: string;
  podcast: {
    id: string;
    image: string;
    title_original: string;
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
