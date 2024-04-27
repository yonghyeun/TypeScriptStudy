import { useEffect, useState } from 'react';
import type { BlogData } from './types';

const useFetching = <T extends 'todos' | 'posts'>(type: T): BlogData<T>[] => {
  const [data, setData] = useState<BlogData<T>[]>([]);

  const fetchData = async (type: 'posts' | 'todos') => {
    const url = `https://jsonplaceholder.typicode.com/${type}`;
    const response = await fetch(url);
    const body: BlogData<T>[] = await response.json();
    setData(body);
  };

  useEffect(() => {
    fetchData(type);
  }, [type]);

  return data;
};

export default useFetching;
