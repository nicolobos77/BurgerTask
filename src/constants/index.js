import {t} from "../i18n";

const orderStatuses = [
		{ value: 'pending', label: t.pending },
		{ value: 'preparing', label: t.preparing },
		{ value: 'ready', label: t.ready },
		{ value: 'delivered', label: t.delivered },
		{ value: 'cancelled', label: t.cancelled },
	];

export default orderStatuses;