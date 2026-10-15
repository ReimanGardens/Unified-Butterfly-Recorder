import { useBooleanState, usePrevious } from "webrix/hooks";
import { useEffect } from "react";

function Offline({ children }) {
  const {
    value: online,
    setFalse: setOffline,
    setTrue: setOnline,
  } = useBooleanState(navigator.onLine);

  const previousOnline = usePrevious(online);

  useEffect(() => {
    window.addEventListener("online", setOnline);
    window.addEventListener("offline", setOffline);

    return () => {
      window.removeEventListener("online", setOnline);
      window.removeEventListener("offline", setOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        style={
          previousOnline === online && online ? { display: "none" } : void 0
        }
      >
        {!online && <meta name="theme-color" content="#000000" />}
        <div style={{ textAlign: "center", padding: "5px" }}>
          <p>Offline</p>
        </div>
      </div>
      <div />
      {children}
    </>
  );
}

export default Offline;
