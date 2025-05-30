import React, { useState, useEffect, useCallback, useRef } from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { api } from "../../utils/api";
import { EnergyRecord, EnergyResponse } from "../../types/energy";
import { formatDate } from "../../utils/date-util";
import styles from "./EnergyTable.module.css";
import { Loader, ChevronDown, ChevronUp, Columns3, Map } from "lucide-react";

interface EnergyTableProps {
  height?: number;
}

interface ColumnConfig {
  key: keyof EnergyRecord | "id" | "createdAt";
  label: string;
  width: string;
  visible: boolean;
  required?: boolean;
}

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { key: "id", label: "ID", width: "250px", visible: true, required: true },
  { key: "date", label: "Date", width: "120px", visible: true },
  { key: "sector", label: "Sector", width: "100px", visible: true },
  { key: "location", label: "Location", width: "150px", visible: true },
  { key: "energyConsumed", label: "Consumed", width: "140px", visible: true },
  { key: "cost", label: "Cost", width: "100px", visible: true },
  { key: "createdBy", label: "Created By", width: "250px", visible: true },
  { key: "createdAt", label: "Created At", width: "140px", visible: true },
];

const LOCATIONS = [
  "New York",
  "California",
  "Texas",
  "Florida",
  "Pennsylvania",
];

const ITEM_HEIGHT = 60;
const ITEMS_PER_PAGE = 20;

const EnergyTable: React.FC<EnergyTableProps> = ({ height = 600 }) => {
  const [items, setItems] = useState<(EnergyRecord | undefined)[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastLoadedPage, setLastLoadedPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [showLocationFilter, setShowLocationFilter] = useState(false);

  const listRef = useRef<List>(null);
  const loadMoreItems = useCallback(
    async (startIndex: number) => {
      if (isNextPageLoading) return Promise.resolve();

      const pageToLoad = Math.floor(startIndex / ITEMS_PER_PAGE) + 1;

      if (
        pageToLoad <= lastLoadedPage ||
        (totalPages > 0 && pageToLoad > totalPages)
      ) {
        return Promise.resolve();
      }

      setIsNextPageLoading(true);
      setError(null);
      try {
        console.log(`Loading page ${pageToLoad} for startIndex ${startIndex}`);

        const locationParams = selectedLocation
          ? `&location=${selectedLocation}`
          : "";
        const { data } = await api.get<EnergyResponse>(
          `/api/energy?page=${pageToLoad}&limit=${ITEMS_PER_PAGE}${locationParams}`
        );

        console.log("API Response:", data);

        const pageStartIndex = (pageToLoad - 1) * ITEMS_PER_PAGE;

        setItems((prevItems) => {
          const newItems = [...prevItems];
          while (newItems.length < pageStartIndex + data.data.length) {
            newItems.push(undefined);
          }

          data.data.forEach((item, index) => {
            newItems[pageStartIndex + index] = item;
          });

          return newItems;
        });
        setLastLoadedPage(pageToLoad);
        setTotalPages(data.pagination.pages);
        setTotalItems(data.pagination.total);
        setHasNextPage(pageToLoad < data.pagination.pages);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load energy data"
        );
        console.error("Error loading energy data:", err);
      } finally {
        setIsNextPageLoading(false);
      }
      return Promise.resolve();
    },
    [isNextPageLoading, lastLoadedPage, selectedLocation]
  );

  const visibleColumns = columns.filter((col) => col.visible);
  const gridTemplateColumns = visibleColumns.map((col) => col.width).join(" ");
  const toggleColumn = (columnKey: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === columnKey && !col.required
          ? { ...col, visible: !col.visible }
          : col
      )
    );
  };
  const resetColumns = () => {
    setColumns(DEFAULT_COLUMNS);
  };
  const toggleLocation = (location: string) => {
    setSelectedLocation((prev) => (prev === location ? "" : location));
    setItems([]);
    setLastLoadedPage(0);
    setTotalPages(0);
    setTotalItems(0);
    setHasNextPage(true);
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollToItem(0, "start");
      }
    }, 0);
  };

  const resetLocationFilter = () => {
    setSelectedLocation("");
    setItems([]);
    setLastLoadedPage(0);
    setTotalPages(0);
    setTotalItems(0);
    setHasNextPage(true);
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollToItem(0, "start");
      }
    }, 0);
  };

  const getCellValue = (item: EnergyRecord, columnKey: string) => {
    switch (columnKey) {
      case "id":
        return item._id;
      case "date":
        return formatDate(item.date);
      case "sector":
        return item.sector;
      case "location":
        return item.location;
      case "energyConsumed":
        return `${item.energyConsumed.toLocaleString()} kWh`;
      case "cost":
        return `$${item.cost.toFixed(2)}`;
      case "createdBy":
        return item.createdBy;
      case "createdAt":
        return formatDate(item.createdAt);
      default:
        return "";
    }
  }; // Calculate loaded records count
  const loadedRecordsCount = React.useMemo(() => {
    return items.filter((item) => item !== undefined).length;
  }, [items]);

  useEffect(() => {
    loadMoreItems(0);
  }, [loadMoreItems]);
  useEffect(() => {
    if (selectedLocation) {
      loadMoreItems(0);
    }
  }, [selectedLocation, loadMoreItems]);
  const isItemLoaded = useCallback(
    (index: number) => {
      const isLoaded = !!items[index];
      const hasReachedEnd = totalItems > 0 && index >= totalItems;

      return isLoaded || hasReachedEnd;
    },
    [items, totalItems]
  );
  const itemCount =
    totalItems > 0
      ? totalItems
      : hasNextPage
      ? items.length + ITEMS_PER_PAGE
      : items.length;
  const Row = React.memo(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const item = items[index];

      if (!item) {
        if (totalItems > 0 && index >= totalItems) {
          return <div style={style}></div>;
        }

        return (
          <div
            style={{ ...style, display: "grid", gridTemplateColumns }}
            className={styles.loadingRow}
          >
            <div
              className={styles.loadingContent}
              style={{ gridColumn: `1 / ${visibleColumns.length + 1}` }}
            >
              <Loader className={styles.loadingIcon} />
              <span>Loading...</span>
            </div>
          </div>
        );
      }

      return (
        <div
          style={{ ...style, display: "grid", gridTemplateColumns }}
          className={styles.row}
        >
          {visibleColumns.map((column) => (
            <div
              key={column.key}
              className={styles.cell}
              title={
                column.key === "id" || column.key === "createdBy"
                  ? getCellValue(item, column.key)
                  : undefined
              }
            >
              {getCellValue(item, column.key)}
            </div>
          ))}
        </div>
      );
    }
  );

  Row.displayName = "EnergyTableRow";

  if (error && items.length === 0) {
    return (
      <div className={styles.error}>
        <p>Error loading energy data: {error}</p>
      </div>
    );
  }
  return (
    <div className={styles.container}>
      {" "}
      {/* Live counter display */}
      <div className={styles.recordsCounter}>
        <span className={styles.loadedRecords}>
          Loaded: {loadedRecordsCount}
        </span>
        {totalItems > 0 && (
          <>
            <span className={styles.counterSeparator}>of</span>
            <span className={styles.totalRecords}>
              {totalItems.toLocaleString()} total records
              {selectedLocation && (
                <span className={styles.filterNote}>
                  {" "}
                  (filtered by {selectedLocation})
                </span>
              )}
            </span>
            <span className={styles.progressPercentage}>
              ({Math.round((loadedRecordsCount / totalItems) * 100)}%)
            </span>
          </>
        )}
        {isNextPageLoading && (
          <span className={styles.loadingIndicator}>
            <Loader size={14} className={styles.miniLoader} />
            Loading more...
          </span>
        )}
      </div>
      <div className={styles.tableControls}>
        <div className={styles.columnSelector}>
          <button
            className={styles.columnSelectorButton}
            onClick={() => setShowColumnSelector(!showColumnSelector)}
          >
            <Columns3 size={16} />
            Columns
            {showColumnSelector ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          {showColumnSelector && (
            <div className={styles.columnSelectorDropdown}>
              <div className={styles.columnSelectorHeader}>
                <span>Show/Hide Columns</span>
                <button
                  className={styles.resetButton}
                  onClick={resetColumns}
                  title="Reset to default columns"
                >
                  Reset
                </button>
              </div>
              {columns.map((column) => (
                <label key={column.key} className={styles.columnOption}>
                  <input
                    type="checkbox"
                    checked={column.visible}
                    onChange={() => toggleColumn(column.key)}
                    disabled={column.required}
                  />
                  <span
                    className={column.required ? styles.requiredColumn : ""}
                  >
                    {column.label}
                    {column.required && " (Required)"}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className={styles.locationFilter}>
          {" "}
          <button
            className={styles.columnSelectorButton}
            onClick={() => setShowLocationFilter(!showLocationFilter)}
          >
            <Map size={16} />
            Location ({selectedLocation ? 1 : 0})
            {showLocationFilter ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          {showLocationFilter && (
            <div className={styles.columnSelectorDropdown}>
              <div className={styles.columnSelectorHeader}>
                <span>Filter by Location</span>
                <button
                  className={styles.resetButton}
                  onClick={resetLocationFilter}
                  title="Clear location filters"
                >
                  Clear
                </button>
              </div>{" "}
              {LOCATIONS.map((location) => (
                <label key={location} className={styles.columnOption}>
                  <input
                    type="radio"
                    name="location-filter"
                    checked={selectedLocation === location}
                    onChange={() => toggleLocation(location)}
                  />
                  <span>{location}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={styles.tableHeader} style={{ gridTemplateColumns }}>
        {visibleColumns.map((column) => (
          <div key={column.key} className={styles.headerCell}>
            {column.label}
          </div>
        ))}
      </div>
      <div className={styles.tableBody}>
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => (
            <List
              ref={(list) => {
                ref(list);
                listRef.current = list;
              }}
              height={height}
              width="100%"
              itemCount={itemCount}
              itemSize={ITEM_HEIGHT}
              onItemsRendered={onItemsRendered}
              overscanCount={5}
            >
              {Row}
            </List>
          )}
        </InfiniteLoader>
      </div>
      {error && items.length > 0 && (
        <div className={styles.errorBanner}>
          Error loading more data: {error}
        </div>
      )}
    </div>
  );
};

export default EnergyTable;
