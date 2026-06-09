'use client';
import { useState, useMemo } from 'react';
import { helloWorld } from '@/hello/hello';

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
