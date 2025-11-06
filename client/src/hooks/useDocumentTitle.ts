import { useEffect, useRef } from 'react';

interface UseDocumentTitleOptions {
  preserveTitleOnUnmount?: boolean;
  suffix?: string;
  prefix?: string;
}

/**
 * Custom hook to dynamically update the document title
 * @param title - The title to set for the document
 * @param options - Optional configuration
 * @param options.preserveTitleOnUnmount - If true, keeps the title when component unmounts
 * @param options.suffix - Text to append to the title (e.g., " - My App")
 * @param options.prefix - Text to prepend to the title
 */

export const useDocumentTitle = (
  title: string,
  options: UseDocumentTitleOptions = {}
): void => {
  const { preserveTitleOnUnmount = false, suffix = '', prefix = '' } = options;
  const previousTitle = useRef<string>(document.title);

  useEffect(() => {
    // Store the current title on first render
    previousTitle.current = document.title;

    // Set the new title with prefix and suffix
    const newTitle = `${prefix}${title}${suffix}`;
    document.title = newTitle;

    // Cleanup function to restore previous title if needed
    return () => {
      if (!preserveTitleOnUnmount) {
        document.title = previousTitle.current;
      }
    };
  }, [title, suffix, prefix, preserveTitleOnUnmount]);
};

// Alternative simpler version without options
export const useTitle = (title: string): void => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};