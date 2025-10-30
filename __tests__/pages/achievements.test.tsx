import { render, fireEvent, waitFor } from '@testing-library/react';
import AchievementsPage from '@/app/achievements/page';
import { useTranslation } from '@/lib/i18n';
import { getUserFromStorage } from '@/lib/user-sync';

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/',
}));

jest.mock('@/lib/i18n', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('@/lib/user-sync', () => ({
  getUserFromStorage: jest.fn(),
}));

const mockT = jest.fn((key) => key);
const mockGetUserFromStorage = getUserFromStorage as jest.Mock;
const mockUseTranslation = useTranslation as jest.Mock;

describe('AchievementsPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockUseTranslation.mockReturnValue({ t: mockT });
  });

  it('updates the language when the storage event is fired', async () => {
    // 1. Initial setup with 'en'
    mockGetUserFromStorage.mockReturnValue({
      id: '1',
      language: 'en',
    });

    render(<AchievementsPage />);

    // 2. Verify initial language is 'en'
    await waitFor(() => {
        expect(mockUseTranslation).toHaveBeenLastCalledWith('en');
    });


    // 3. Simulate language change in storage
    mockGetUserFromStorage.mockReturnValue({
      id: '1',
      language: 'ru',
    });

    // 4. Fire the storage event to trigger the update
    fireEvent(window, new Event('storage'));

    // 5. Wait for the component to re-render and check if the language has updated to 'ru'
    await waitFor(() => {
      expect(mockUseTranslation).toHaveBeenLastCalledWith('ru');
    });
  });
});
