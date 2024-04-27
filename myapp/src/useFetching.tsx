import { useEffect, useState } from 'react';
import type { BlogData } from './types';

const useFetching = <T extends 'todos' | 'posts'>(path: T): BlogData<T>[] => {
  const [data, setData] = useState<BlogData<T>[]>([]);

  const fetchData = async () => {
    const url = `https://jsonplaceholder.typicode.com/${path}`;
    const response = await fetch(url);
    const body: BlogData<T>[] = await response.json();
    setData(body);
  };

  useEffect(() => {
    fetchData();
  }, [path]);

  return data;
};

export default useFetching;
