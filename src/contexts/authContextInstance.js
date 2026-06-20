import { createContext } from 'react';

// The Auth context instance lives in its own module so that the provider file
// (AuthContext.jsx) and the hook (useAuth.js) can each export a single concern.
// React fast refresh requires component files to not also export a context.
export const AuthContext = createContext(null);
