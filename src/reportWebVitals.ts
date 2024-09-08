/* eslint-disable no-unused-vars */

const reportWebVitals = (
  onPerfEntry?: (metric: {
    name: string;
    value: number;
    delta: number;
    id: string;
    entries: PerformanceEntry[];
  }) => void
) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onFID(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
