import { useEffect } from 'react';

export function usePageTitle(title) {
  useEffect(() => {
    const previous = document.title;
    if (title) {
      document.title = `${title} | BorrowBox`;
    } else {
      document.title = 'BorrowBox - Campus Peer Lending Platform';
    }
    return () => {
      document.title = previous;
    };
  }, [title]);
}

export default usePageTitle;
