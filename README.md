# Energy Dashboard

A modern, responsive dashboard for monitoring and analyzing data built with **React, TypeScript, and Vite.**

If you havent already please check it out, login details provided in login tooltip
https://vite-dashboard-weld.vercel.app

- Powered by express backend

## Features

- **🔒 Secure Authentication** - Complete login and registration system with token management
- **📊 Interactive Charts** - Real-time energy consumption visualization using Chart.js
- **📱 Responsive Design** - Optimized experience across all devices
- **🚀 Performance Optimized** - Implements data prefetching for seamless user experience
- **📄 PDF Report Generation** - Export detailed reports with charts and metrics
- **🎨 Modern UI** - Clean, intuitive interface built with Material UI and custom components
- **⚡ Fast Development** - Powered by Vite for lightning-fast development experience
- **📋 Report Management** - Create, review, and manage energy reports with different status workflows
- **🔤 Custom Typography** - Implements DM Sans Variable font

## Tech Stack

- React 19
- TypeScript
- Vite 6
- Material UI 7
- React Router 7
- Axios
- React Query
- Chart.js
- CSS Modules

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/matthewcespon/vite-dashboard.git
cd vite-dashboard
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to http://localhost:3000

## Performance Features

### Data Prefetching
The application implements intelligent data prefetching strategies to ensure smooth user experience:

```typescript
const prefetchReport = async (id: string) => {
  if (prefetchedReports[id] || prefetchingReportIds.includes(id)) {
    return;
  }

  setPrefetchingReportIds((prev) => [...prev, id]);
  
  try {
    const { data } = await api.get<DetailedReport>(`/api/reports/${id}`);
    setPrefetchedReports((prev) => ({
      ...prev,
      [id]: data
    }));
  } catch (err) {
  } finally {
    setPrefetchingReportIds((prev) => 
      prev.filter((reportId) => reportId !== id));
  }
};

...

<button
  className={styles.eyeButton}
  onClick={() => handleView(report.id)}
  onMouseEnter={() => prefetchReport(report.id)}
>

```

### Data Caching
Implements strategic caching to minimize API calls:

```typescript
const CACHE_EXPIRATION = 5 * 60 * 1000;
if (cachedData && now - cachedData.timestamp < CACHE_EXPIRATION) {
  setReports(cachedData.reports);
  setPagination(cachedData.pagination);
  return;
}
```

## Authentication

The application includes a complete authentication system with:
- User registration
- Secure login
- Token-based authentication
- Protected routes
- Persistent sessions

### CSS Modules
The application uses CSS modules for styling

```css
import styles from ".../<Component>.module.css"
```

## Links

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Material UI](https://mui.com/)
- [Chart.js](https://www.chartjs.org/)
- [html2canvas](https://html2canvas.hertzen.com/)
- [jsPDF](https://parall.ax/products/jspdf)
