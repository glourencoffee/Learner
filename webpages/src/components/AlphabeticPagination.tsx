import { Pagination, PaginationItem, PaginationRenderItemParams } from '@mui/material';
import React, { useState } from 'react';

interface AlphabeticPaginationProps {
  /**
   * Defines the pages to show in the pagination bar. Each page becomes
   * a pagination item. For example, if this prop is `Set(['A', 'B', 'C'])`,
   * then 3 pagination items are shown.
   *
   * Pages are arranged alphabetically in the pagination bar. So `Set(['B', 'A'])`
   * results in the pages `'A'` and `'B'` being displayed, in that order,
   * from left to right.
   * 
   * Note that pages are treated case-sensitively. So `Set(['A', 'a'])`
   * will result in two separate pagination items, one for `'A'` and
   * another for `'A'`.
   */
  pages: Set<string>;

  /**
   * Defines whether an extra page for all elements, called an "All Page",
   * should be enabled.
   */
  allPageEnabled?: boolean;

  /**
   * If `allPageEnabled` is `true`, defines the label of the "All Page".
   */
  allPageLabel?: string;

  variant?: 'text' | 'outlined';
  shape?: 'circular' | 'rounded';

  /**
   * Defines the selected page, for controlled components.
   */
  selectedPage?: string;

  /**
   * Defines a callback function to be called when the selected page changes.
   * 
   * @param page The selected page. This parameter is of type `undefined` if
   * the "All Page" is enabled and has been selected. Otherwise, it is of type
   * `string`.
   */
  onChange?: (page?: string) => void;
}

export default function AlphabeticPagination(props: AlphabeticPaginationProps): JSX.Element {
  const [selectedPage, setSelectedPage] = useState<string | undefined>();
  
  const pages = [...props.pages].sort();
  const items = [];
  const allPageLabel = props.allPageLabel ?? 'All';

  if (props.allPageEnabled) {
    items.push(
      <PaginationItem selected={selectedPage === undefined}>
        {allPageLabel}
      </PaginationItem>
    );
  }

  for (const page of pages) {
    items.push(
      <PaginationItem selected={selectedPage == page}>
        {page}
      </PaginationItem>
    );
  }

  function pageFromNumber(pageNumber: number): string | undefined {
    if (!props.allPageEnabled) {
      return pages[pageNumber - 1];
    }
    else if (pageNumber == 1) {
      return undefined;
    }
    else {
      return pages[pageNumber - 2];
    }
  }

  function pageNumberFromPage(page?: string): number {
    if (page === undefined) {
      return 1;
    }
    else if (props.allPageEnabled) {
      return pages.indexOf(page) + 2;
    }
    else {
      return pages.indexOf(page) + 1;
    }
  }

  function handlePaginationChange(_: React.ChangeEvent<unknown>, pageNumber: number): void {
    const newSelectedPage = pageFromNumber(pageNumber);

    if (newSelectedPage !== selectedPage) {
      setSelectedPage(newSelectedPage);
      props.onChange?.(newSelectedPage);
    }
  }

  function renderItem(item: PaginationRenderItemParams): React.ReactNode {
    const pageNumber = item.page;

    let pageLabel;

    if (pageNumber == null) {
      pageLabel = null;
    }
    else {
      pageLabel = pageFromNumber(pageNumber);

      if (pageLabel === undefined) {
        pageLabel = allPageLabel;
      }
    }

    return <PaginationItem {...item} page={pageLabel} />;
  }

  const pageCount = pages.length + (props.allPageEnabled ? 1 : 0);
  const selectedPageNumber = pageNumberFromPage(props.selectedPage);

  return (
    <Pagination
      color='primary'
      count={pageCount}
      variant={props.variant}
      shape={props.shape}
      renderItem={renderItem}
      page={selectedPageNumber}
      onChange={handlePaginationChange}
    />
  );
}