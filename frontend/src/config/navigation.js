export function getNavigation(role) {
  const isAdmin = role === 'ADMIN';

  if (isAdmin) {
    return [
      {
        path: '/admin/dashboard',
        label: 'Admin Dashboard',
        icon: 'grid',
      },
      {
        path: '/profile',
        label: 'My profile',
        icon: 'user',
      },
    ];
  }

  return [
    {
      path: '/products',
      label: 'Products',
      icon: 'grid',
    },
    {
      path: '/cart',
      label: 'Cart',
      icon: 'plus',
    },
    {
      path: '/orders',
      label: 'Orders',
      icon: 'check',
    },
    {
      path: '/profile',
      label: 'My profile',
      icon: 'user',
    },
  ];
}