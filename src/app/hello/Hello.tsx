'use client';
import { useState, useMemo } from 'react';
import { helloWorld } from '@/lib/hello/hello';

// This client side component is factored out from the main page component primarily to test
// that client components are working correctly, but also to have a place to test the helloWorld
// function from the hello module.

export default function Hello() {
  const [subject, setSubject] = useState<string>('World');

  const display = useMemo(() => helloWorld(subject), [subject]);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  return (
    <>
      <div>
        <input
          data-testid="subject-input"
          type="text"
          value={subject}
          onChange={handleSubjectChange}
        />
        <p data-testid="display">{display}</p>
      </div>
    </>
  );
}
