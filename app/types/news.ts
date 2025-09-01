export interface NewsItem {
  _id: string;
  title: string;
  description: string;
  image_url: string;
  datetime: string;
}

export interface OthersNewsItem {
  _id: string;
  title: string;
  image_url: string;
  datetime: string;
}

export interface SocialItem {
  label: string;
  to: string;
  icon: string;
}

export interface PopularItem {
  _id: string;
  counter: string;
  title: string;
}
