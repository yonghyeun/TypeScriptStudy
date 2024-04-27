type BaseData = {
  userId: number;
  id: number;
  title: string;
};

type Todos = {
  completed: boolean;
};

type Posts = {
  body: string;
};

type Data<T> = T & BaseData;

// type BlogData = Data<Todos> | Data<Posts>;

type BlogData<T extends 'todos' | 'posts'> = T extends 'todos'
  ? Data<Todos>
  : Data<Posts>;

export type { BaseData, Todos, Posts, Data, BlogData };
