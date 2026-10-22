import { useEffect } from "react";

const SITE = "CS526 Study Hub";

export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : SITE;
  }, [title]);
}
