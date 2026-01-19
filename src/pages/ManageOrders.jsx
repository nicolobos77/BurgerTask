import { useState, useEffect } from "react";
import {t} from "../i18n";
import orderStatuses from "../constants";

function ManageOrders() {
	const today = new Date().toISOString().slice(0, 10);

	const [ordersToday, setOrdersToday] = useState(() => {
		const currentDate = localStorage.getItem("todayDate");
		const currentOrders = localStorage.getItem("ordersToday");

		if (currentDate === today && currentOrders) {
			return JSON.parse(currentOrders);
		} else {
			localStorage.setItem("todayDate", today);
			localStorage.setItem("ordersToday", JSON.stringify([]));
			return [];
		}
	});

	const [menu, setMenu] = useState([]);
	const [customer, setCustomer] = useState("");
	const [contact, setContact] = useState("");
	const [whatsapp, setWhatsapp] = useState(false);
	const [status, setStatus] = useState("");
	const [selectedDish, setSelectedDish] = useState(null);
	const [quantity, setQuantity] = useState(1);
	const [currentOrder, setCurrentOrder] = useState([]);
	const [editingOrder, setEditingOrder] = useState(null);
	const [ordersCounter, setOrdersCounter] = useState(() => {
		const saved = localStorage.getItem("orders_count");
		return saved ? Number(saved) : 1;
	});

	useEffect(() => {
		const savedOrders = localStorage.getItem("ordersToday");
		const savedDate = localStorage.getItem("todayDate");

		if (savedDate === today) {
			setOrdersToday(savedOrders ? JSON.parse(savedOrders) : []);
		} else {
			setOrdersToday([]);
			localStorage.setItem("ordersToday", JSON.stringify([]));
			localStorage.setItem("todayDate", today);
		}

		const savedMenu = localStorage.getItem("menu");
		if (savedMenu) setMenu(JSON.parse(savedMenu));
	}, [today]);

	useEffect(() => {
		localStorage.setItem("ordersToday", JSON.stringify(ordersToday));
	}, [ordersToday]);


	const addDish = () => {
		if (!selectedDish || quantity <= 0) return;

		const dish = menu.find((p) => p.id === selectedDish);
		if (!dish) return;

		const exists = currentOrder.find((p) => p.id === dish.id);
		if (exists) {
			setCurrentOrder(
				currentOrder.map((p) =>
					p.id === dish.id ? { ...p, quantity: p.quantity + quantity } : p
				)
			);
		} else {
			setCurrentOrder([...currentOrder, { ...dish, quantity }]);
		}

		setQuantity(1);
		setSelectedDish(null);
	};

	const removeDish = (id) => {
		setCurrentOrder(currentOrder.filter((p) => p.id !== id));
	};

	const editQuantity = (id, newQuantity) => {
		if (newQuantity <= 0) return;
		setCurrentOrder(
			currentOrder.map((p) =>
				p.id === id ? { ...p, quantity: newQuantity } : p
			)
		);
	};

	const confirmOrder = () => {
		if (!customer || currentOrder.length === 0) return;

		const total = currentOrder.reduce((acc, p) => acc + p.price * p.quantity, 0);
		const orderNumber = editingOrder
			? editingOrder.number
			: String(ordersCounter).padStart(3, "0");


		const orderId = editingOrder ? editingOrder.id : Date.now();

		const newOrder = {
			id: orderId,
			number: orderNumber,
			customer,
			contact,
			whatsapp,
			dishes: currentOrder,
			total,
			status: status || orderStatuses[0].value,
		};


		if (!editingOrder) {
			setOrdersCounter(ordersCounter + 1);
			localStorage.setItem("orders_count", ordersCounter + 1);
		}


		const updated = editingOrder
			? ordersToday.map((p) => (p.id === editingOrder.id ? newOrder : p))
			: [...ordersToday, newOrder];

		setOrdersToday(updated);
		localStorage.setItem("ordersToday", JSON.stringify(updated));
		setCustomer("");
		setStatus("");
		setContact("");
		setWhatsapp(false);
		setCurrentOrder([]);
		setEditingOrder(null);
	};


	const cancelOrder = (id) => {
		if (!window.confirm(t.cancelQuestion)) return;
		setOrdersToday(ordersToday.filter((p) => p.id !== id));
	};

	const editOrder = (id) => {
		const order = ordersToday.find((p) => p.id === id);
		if (!order) return;

		setCustomer(order.customer);
		setContact(order.contact);
		setWhatsapp(order.whatsapp);
		setStatus(order.status);
		setCurrentOrder(order.dishes);
		setEditingOrder(order);
	};

	return (
		<div>

			<h2>{t.takeOrder} 📝</h2>
			<div
				style={{
					marginBottom: "1rem",
					display: "flex",
					gap: "1rem",
					flexDirection: "column",
				}}
			>
				<input
					type="text"
					placeholder={t.customerName}
					value={customer}
					onChange={(e) => setCustomer(e.target.value)}
					style={{ fontSize: "20px" }}
				/>
				<div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
					<input
						type="text"
						placeholder={t.contact}
						value={contact}
						onChange={(e) => setContact(e.target.value)}
						style={{ fontSize: "20px", flexGrow: 1 }}
					/>
					<label style={{ marginLeft: "10px" }}>
						<input
							type="checkbox"
							onChange={(e) => setWhatsapp(e.target.checked)}
							disabled={contact.trim() === ""}
							checked={whatsapp}
						/>
						{t.whatsapp}
					</label>
				</div>
				{editingOrder && (
					<select
						value={status ?? ""}
						onChange={(e) => setStatus(e.target.value)}
						style={{ fontSize: "20px" }}
					>
						<option value="">-- {t.selectStatus} --</option>
						{
						orderStatuses.map((p) => (
							<option value={p.value}>
								{p.label}
							</option>
						))
						}
					</select>
				)}

				<select
					value={selectedDish ?? ""}
					onChange={(e) => setSelectedDish(Number(e.target.value))}
					style={{ fontSize: "20px" }}
				>
					<option value="">-- {t.selectDish} --</option>
					{menu.map((p) => (
						<option key={p.id} value={p.id}>
							{p.name} - ${p.price}
						</option>
					))}
				</select>
				<input
					type="number"
					min="1"
					value={quantity}
					onChange={(e) => setQuantity(Number(e.target.value))}
					style={{ fontSize: "20px" }}
				/>
				{ (
					<button onClick={addDish} disabled={!selectedDish || quantity <= 0 || quantity != Math.floor(quantity)}>{t.addDish}</button>
				)}
			</div>

			<h3>{t.currentOrder}</h3>
			<ul>
				{currentOrder.map((p) => (
					<li key={p.id}>
						{p.name} - ${p.price} x{" "}
						<input
							type="number"
							min="1"
							value={p.quantity}
							onChange={(e) => editQuantity(p.id, Number(e.target.value))}
							style={{ width: "50px" }}
						/>{" "}
						= ${p.price * p.quantity}
						<button onClick={() => removeDish(p.id)}>❌</button>
					</li>
				))}
			</ul>

			<button
				style={{ flexGrow: 1, width:"100%" }}
				onClick={confirmOrder}
				disabled={!customer || currentOrder.length === 0}
			>
				{editingOrder ? t.updateOrder : t.confirmOrder}
			</button>
			{editingOrder && (
				<button
					onClick={() => {
						setEditingOrder(null);
						setCustomer("");
						setContact("");
						setWhatsapp(false);
						setStatus("");
						setCurrentOrder([]);
					}}
					style={{ marginLeft: "1rem" }}
				>
					{t.cancel}
				</button>
			)}

			{ordersToday.length > 0 && (
				<div>
					<h3>({t.todayOrders})</h3>
					<table style={{ borderSpacing: "10px" }}>
						<thead>
							<tr>
							<th>{t.table.order}</th>
							<th>{t.table.customer}</th>
							<th>{t.contact}</th>
							<th>{t.whatsapp}</th>
							<th>{t.table.total}</th>
							<th>{t.table.status}</th>
							<th>{t.action}</th>
							</tr>
						</thead>
						<tbody>
						{ordersToday.map((ped) => (
							<tr key={ped.id}>
								<td>{ped.number}</td>
								<td>{ped.customer}</td>
								{ped.whatsapp && <td><a style={{ color: "green", textDecoration: "none" }} target="_blank" rel="noreferrer" href={"https://api.whatsapp.com/send?phone=" + ped.contact}>{ped.contact}</a></td>}
								{!ped.whatsapp && <td>{ped.contact}</td>}
								<td>{ped.whatsapp ? "✅" : "❌"}</td>
								<td>${ped.total}</td>
								<td>{orderStatuses.find((p) => p.value === ped.status)?.label || ped.status}</td>
								<td>
									<button onClick={() => editOrder(ped.id)}>✏️ {t.edit}</button>{" "}
									<button onClick={() => cancelOrder(ped.id)}>❌ {t.cancel}</button>
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

export default ManageOrders;
