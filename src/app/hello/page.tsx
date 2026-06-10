import { z } from 'zod';
import Hello from './Hello';
import { headers } from 'next/headers';

/* This is primarily a test route designed to make sure that tooling is working correctly,
   so in this case I am not worried about seperation of concerns. */
const TestApiResponseSchema = z.object({
  message: z.string()
});

async function getMessageFromApi() {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const fetchUrl = `${protocol}://${host}/api/hello`;
  console.log('Fetching menu from API at:', fetchUrl);
  const res = await fetch(fetchUrl, {
    cache: 'no-store'
  });

  const json: unknown = await res.json();
  return TestApiResponseSchema.parse(json);
}

export default async function HelloPage() {
  const { message } = await getMessageFromApi();

  return (
    <>
      <div>
        <h1>Hello, World!</h1>
      </div>
      <Hello />
      <div>This test page exists to test tooling software.</div>
      <div>Normally, this would be removed for a real application</div>
      <div data-testid="test-server-side-rendering">{message}</div>
    </>
  );
}
