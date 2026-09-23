# Add your own feature

Example: replace the removable sample records with **Products**.

## Frontend

1. Create `pages/products/ProductsPage.jsx`.
2. Add `<Route path="/products" element={<ProductsPage />} />` inside the `AppLayout` route group in `routes/AppRoutes.jsx`.
3. Add `{ path: '/products', label: 'Products', icon: 'layers' }` to `config/navigation.js`.
4. Create `services/productApi.js`. Use `api` from `../lib/api.js`, not a second fetch wrapper.

```js
import { api } from '../lib/api.js';
export const productApi = {
  list: signal => api('/products', { signal }),
  create: data => api('/products', { method: 'POST', data }),
};
```

The page manages form state and displays the result. The service file defines endpoint calls.
Keep cookies/secrets out of page code. A protected React page alone is not backend authorization.

## Backend

1. Copy the small example model/controller/service/route/validator files and rename them for Products.
2. Adjust schema fields and request validation together.
3. Keep `requireAuth` on private routes.
4. Filter queries by the verified user or by your project's actual permission model. Never trust an owner ID from the browser.
5. Import/mount the router in `app.js` **before** `app.use('/api', notFound)`.
6. Add model initialization in `config/db.js` if the new model requires indexes before requests are served.

```js
app.use('/api/products', productRoutes);
```

Use the existing response shape:

```js
sendData(res, { items });
sendData(res, { item }, 201, 'Created.');
```

## Remove the sample module

Remove its sidebar item and route/import, `pages/examples/`, `services/exampleApi.js`, and its backend route/controller/service/validator/model.
Remove the router mount in `app.js` and the Example import/init in `config/db.js`.
Update Overview links and tests that reference examples. Do not delete auth, layout or the shared API wrapper.

## Where helpers belong

`utils/`: small reusable functions. `config/`: settings/connections. Neither is a mandatory request step.
A repository layer, Redux, payment service or job queue can be added later when your actual project needs it.
