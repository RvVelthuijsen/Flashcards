export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Topic = {
  id: string;
  title: string;
  useremail: string;
};

export type Flashcard = {
  id: string;
  answer: string;
  question: string;
  useremail: string;
  topic: string;
};
