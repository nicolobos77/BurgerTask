import { useState, useEffect } from "react";
import {t} from "../i18n";

function ManageMenu() {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [menu, setMenu] = useState(() => {
		const currentMenu = localStorage.getItem("menu");
		return currentMenu ? JSON.parse(currentMenu) : [];
	});

	const [currentDish, setCurrentDish] = useState(null);

	useEffect(() => {
		localStorage.setItem("menu", JSON.stringify(menu));
	}, [menu]);

	const saveDish = () => {
		if (!name || !price) return;

		if (currentDish) {
			const update = menu.map((p) =>
				p.id === currentDish
					? { ...p, name, price: parseFloat(price) }
					: p
			);
			setMenu(update);
			setCurrentDish(null);
		}
		else {
			const newDish =
			{
				id: Date.now(),
				name,
				price: parseFloat(price)
			}

			setMenu([...menu, newDish]);
		}
		setName("");
		setPrice("");
	}

	const deleteDish = (id) => {
		if (!window.confirm(t.deleteDishQuestion)) return;
		setMenu(menu.filter((p) => p.id !== id));
	};

	/*const deleteDish = (id) => {
		setMenu(menu.filter((p) => p.id !== id));
	}*/

	const editDish = (dish) => {
		setName(dish.name);
		setPrice(dish.price);
		setCurrentDish(dish.id);
	}

	return (
		<div>
			<h2>{t.manageMenu}</h2>

			<div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", flexDirection: "column" }}>
				<input
					type="text"
					placeholder={t.dishName}
					value={name}
					onChange={(e) => setName(e.target.value)}
					style={{ fontSize: "20px" }}
				/>
				<input
					type="number"
					placeholder={t.price}
					value={price}
					onChange={(e) => setPrice(e.target.value)}
					style={{ fontSize: "20px" }}
				/>
				<div style={{ display: "flex", width: "100%" }}>
					<button 
					onClick={saveDish}
					 disabled={!name || !price}
					 style={{ flexGrow: 1 }}
					 >
						{currentDish ? t.saveChanges : t.addDish}
					</button>
					{currentDish && (
						<button
							style={{ marginLeft: "1rem", flexGrow: 1 }}
							onClick={() => {
								setName("");
								setPrice("");
								setCurrentDish(null);
							}}
						>
							{t.cancel}
						</button>
					)}
				</div>
			</div>

			{menu.length > 0 && (<table style={{ borderSpacing: "10px" }}>
				<tr>
					<td>{t.dish}</td>
					<td>{t.price}</td>
					<td>{t.action}</td>
				</tr>
				{menu.map((p) => (
					<tr key={p.id}>
						<td>{p.name}</td>
						<td>${p.price}</td>
						<td style={{ display: "flex", gap: "10px" }}>
							<button onClick={() => editDish(p)}>{t.edit}</button>
							<button onClick={() => deleteDish(p.id)}>{t.delete}</button>
						</td>
					</tr>
				))}
			</table>)}
		</div>
	)
}

export default ManageMenu