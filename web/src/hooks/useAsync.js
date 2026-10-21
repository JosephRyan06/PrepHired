import { useCallback, useEffect, useState } from "react";

// Runs an async function when the page loads (and when `deps` change)
// and returns { data, loading, error, reload }.
const useAsync = (fn, deps = []) => {
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setState((previous) => ({ ...previous, loading: true, error: "" }));

    fn()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: "" });
      })
      .catch((error) => {
        if (!cancelled) {
          setState((previous) => ({
            ...previous,
            loading: false,
            error: error.message || "Something went wrong",
          }));
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { ...state, reload };
};

export default useAsync;
