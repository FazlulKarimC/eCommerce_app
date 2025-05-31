import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const useNavigationLoading = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const navigateWithLoading = (path: string, key: string = path) => {
    // Set loading state for the specific button
    setLoadingStates(prev => ({ ...prev, [key]: true }));

    router.push(path);

    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }, 1000);
  };

  return { loadingStates, navigateWithLoading };
};