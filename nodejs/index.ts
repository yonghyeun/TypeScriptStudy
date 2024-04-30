type MenuKeys = 'name' | 'price' | 'recommend';
type Menu = Partial<Record<MenuKeys, string | number>>;

const menuList: Menu[] = [
  { name: '된장찌개', price: 12000, recommend: '졸마탱' },
  { name: '김치찌개', price: 9000 },
];
