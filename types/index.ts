export interface Meta {
    description?: string;
    logo?: string;
    ogImage?: string;
    ogUrl?: string;
    title?: string;
    twitter?: string;
  }
 
export interface Episode {
  id: string,
  audio: string,
  image: string,
  title_original: string
  podcast: {
    id: string,
    image: string,
    title_original: string
  }
}