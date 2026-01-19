import { useState, useEffect } from "react";
import {t} from "../i18n";
import orderStatuses from "../constants";

function History() {
  const [ordersToday, setOrdersToday] = useState([]);

  useEffect(() => {
    const currentOrders = localStorage.getItem("ordersToday");
    if (currentOrders) {
      setOrdersToday(JSON.parse(currentOrders));
    }
  }, []);

  return (
    <div>
      <h3>{t.ordersHistory}</h3>
      {
        ordersToday.length === 0 && <h2>{t.noOrders}</h2>
      }
      {
        ordersToday.length > 0 && (
        <table style={{ borderSpacing: "10px" }}>
          <thead>
            <tr>
              <th>{t.table.order}</th>
              <th>{t.table.customer}</th>
              <th>{t.table.total}</th>
              <th>{t.table.status}</th>
            </tr>
          </thead>

          <tbody>
            {ordersToday.map((order) => (
              <tr key={order.id}>
                <td>{order.number}</td>
                <td>{order.customer}</td>
                <td>${order.total}</td>
                <td>{orderStatuses.find((p) => p.value === order.status)?.label || order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>)
      }
    </div>
  );
}

export default History;
