import { ensureOrdersFile } from './ensureOrdersFile';

const fsMocks = vi.hoisted(() => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdir: vi.fn(),
  access: vi.fn()
}));

vi.mock('fs/promises', () => fsMocks);

describe('ensureOrdersFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates an empty orders file if missing', async () => {
    fsMocks.access.mockRejectedValue(new Error('ENOENT'));

    await ensureOrdersFile();

    expect(fsMocks.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      JSON.stringify([], null, 2),
      'utf8'
    );
  });
});
