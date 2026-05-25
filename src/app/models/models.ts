export interface GitHubUser {
  image: string;
  name: string;
  username: string;
  bio: string;
  url: string;
}

export interface User {
    id: string;
    email: string;
    username: string;
    role?: string;
}

export interface Game {
    title: string;
    image: string;
    link: string;
}

export interface Message {
  id: number;
  user_id: number;
  username: string;
  content: string;
  created_at: string;
}

export interface PreguntadosQuestions {
  question: string;
  correctAnswer: string;
  answers: string[];
}