import { useCallback, useEffect, useState } from 'react';
// Pass a stable service function, e.g. systemApi.ready. Aborts on unmount/reload.
export function useAsyncData(fetcher) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: ''
  });
  const [version, setVersion] = useState(0);
  const reload = useCallback(() => setVersion(v => v + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    Promise.resolve().then(() => {
      if (!controller.signal.aborted) setState(old => ({
        ...old,
        loading: true,
        error: ''
      }));
      return fetcher(controller.signal);
    }).then(data => {
      if (!controller.signal.aborted) setState({
        data,
        loading: false,
        error: ''
      });
    }).catch(error => {
      if (!controller.signal.aborted) setState({
        data: null,
        loading: false,
        error: error.message
      });
    });
    return () => controller.abort();
  }, [fetcher, version]);
  return { ...state, reload };
}
