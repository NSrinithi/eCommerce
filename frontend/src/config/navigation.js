export function getNavigation(role) {
  const isAdmin = role === 'ADMIN';

  if (isAdmin) {
    return [
      {
        path: '/admin/dashboard',
        label: 'Dashboard',
        icon: 'layers',
      },
      {
        path: '/admin/products',
        label: 'Products',
        icon: 'grid',
      },
      {
        path: '/admin/orders',
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

export const pageTitles = {
  '/products': 'Products',
  '/cart': 'Cart',
  '/orders': 'Orders',
  '/profile': 'My profile',
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/products':'Admin Products',
  '/admin/orders':'Admin Orders'
};