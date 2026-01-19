import { useState, useEffect, useRef } from "react";
import {t} from "../i18n";
import orderStatuses from "../constants";

function OrdersBoard() {
  const [todayOrders, setTodayOrders] = useState([]);
  const [animated, setAnimated] = useState([]);
  const todayOrdersRef = useRef([]);
  const soundRef = useRef(null);
  const [enableSound, setEnableSound] = useState(false);


  useEffect(() => {
    soundRef.current = new Audio("/ding.mp3");
  }, []);

  useEffect(() => {
    const loadOrders = () => {
      const currentOrders = localStorage.getItem("ordersToday");
      if (!currentOrders) return;

      const newOrders = JSON.parse(currentOrders);

      const newReadyOrders = newOrders.filter(p => {
        if (p.status !== "ready") return false;

        const previous = todayOrdersRef.current.find(old => old.id === p.id);
        return previous?.status !== "ready";
      });


      if (newReadyOrders.length > 0) {

        soundRef.current?.play();

        requestAnimationFrame(() => {
          setAnimated(prev => [
            ...prev,
            ...newReadyOrders.map(p => p.id),
          ]);
        });

        setTimeout(() => {
          setAnimated(prev =>
            prev.filter(id =>
              !newReadyOrders.some(p => p.id === id)
            )
          );
        }, 2000);
      }

      setTodayOrders(newOrders);
      todayOrdersRef.current = newOrders;
    };

    loadOrders();

    const onStorageChange = (e) => {
      if (e.key === "ordersToday") {
        loadOrders();
      }
    };

    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);



  const preparing = todayOrders.filter(p => p.status === "preparing");
  const ready = todayOrders.filter(p => p.status === "ready");

  return (

    <div style={{ height: "100vh", background: "#111", color: "white" }}>

      <header
        style={{
          padding: "1rem",
          textAlign: "center",
          fontSize: "32px",
          fontWeight: "bold",
          borderBottom: "2px solid #333",
        }}
      >
        BurgerTask 🍔
      </header>

      <main
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          height: "calc(100vh - 80px)",
        }}
      >
        <section style={{ padding: "1rem" }}>
          <h2 style={{ textAlign: "center" }}>{t.preparing}</h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", paddingLeft: "1rem", paddingRight: "1rem" }}>
            {preparing.map(p => (
              <div key={p.id} style={{
                width: "100px",
                height: "100px",
                background: "#ffc107",
                color: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: "bold",
                borderRadius: "12px",
              }}>
                {p.number}
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: "1rem" }}>
          <h2 style={{ textAlign: "center" }}>{t.ready}</h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", paddingLeft: "1rem", paddingRight: "1rem" }}>
            {ready.map((p) => (
              <div
                key={p.id}
                className={animated.includes(p.id) ? "order-animation" : ""}
                style={{
                  width: "100px",
                  height: "100px",
                  background: "#4caf50",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  fontWeight: "bold",
                  borderRadius: "12px",
                }}
              >
                {p.number}
              </div>
            ))}

          </div>
        </section>

        {!enableSound && (
          <button
            onClick={() => {
              soundRef.current?.play();
              setEnableSound(true);
            }}
            style={{
              position: "fixed",
              bottom: 10,
              right: 10,
              zIndex: 9999,
            }}
          >
            {t.enableSound}
          </button>
        )}



      </main>

    </div>
  );
}

export default OrdersBoard;