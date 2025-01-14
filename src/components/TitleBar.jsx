import React from 'react';
import { UserButton } from '@civic/auth/react';

export function TitleBar() {
  return (
    <div className="flex justify-between items-center">
      <h1>My App</h1>
      <UserButton />
    </div>
  );
}

export default TitleBar;
