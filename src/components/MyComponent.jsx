import React from 'react';
import { useUser } from '@civic/auth/react';

export function MyComponent() {
  const { user } = useUser();
  
  if (!user) return <div>User not logged in</div>
  
  return <div>Hello {user.name}!</div>;
}

export default MyComponent;
