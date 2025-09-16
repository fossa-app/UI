import React from 'react';
import { useLocation } from 'react-router-dom';

interface RouteTitleProps {
  title: string;
}

const RouteTitle: React.FC<RouteTitleProps> = ({ title }) => {
  const location = useLocation();

  React.useEffect(() => {
    document.title = title;
  }, [location, title]);

  return null;
};

export default RouteTitle;
