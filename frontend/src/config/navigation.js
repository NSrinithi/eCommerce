// Add a sidebar item here, then add the matching route in routes/AppRoutes.jsx.
export const navigation = [
  {
    path: '/products',
    label: 'Products',
    icon: 'grid'
  },
  {
    path: '/cart',
    label: 'Cart',
    icon: 'plus'
  },
  {
    path: '/orders',
    label: 'Orders',
    icon: 'check'
  },
  {
    path: '/profile',
    label: 'My profile',
    icon: 'user'
  }
];
export const pageTitles = Object.fromEntries(navigation.map(item => [item.path, item.label]));
