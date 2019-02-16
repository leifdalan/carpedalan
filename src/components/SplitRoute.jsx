import React, { useEffect, useState } from 'react';
import { func } from 'prop-types';
import { Route } from 'react-router-dom';

export default function SplitRoute({ load, ...etc }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [Component, setComponent] = useState(null);

  async function loadComponent() {
    setLoading(true);
    try {
      const { default: comp } = await load();
      setComponent(comp);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComponent();
    return null;
  }, []);

  if (error) return 'Error loading';

  return loading ? (
    <div>Loading</div>
  ) : (
    <Route render={() => Component} {...etc} />
  );
}

SplitRoute.propTypes = {
  load: func.isRequired,
};
