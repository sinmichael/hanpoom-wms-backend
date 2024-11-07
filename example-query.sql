select
	ps.id,
	ps.created_at,
	ps.order_fulfillment_order_id,
	COUNT(psi.id) as count_of_pre_order_items,
	psd.printed_username,
	psd.inspected_username,
	psd.packed_username,
	psd.shipped_username,
	psd.held_username,
	psd.cancelled_username,
	psd.refunded_username,
	psd.confirmed_username,
	psd.printed_at,
	psd.inspected_at,
	psd.packed_at,
	psd.shipped_at,
	psd.delivered_at,
	psd.returned_at,
	psd.cancelled_at,
	psd.refunded_at,
	psd.held_at,
	psd.confirmed_at,
	psd.held_reason
from
	picking_slips ps
join picking_slip_dates psd on ps.id = psd.picking_slip_id 
left join picking_slip_items psi on ps.id = psi.picking_slip_id 
where
	psd.printed_at is not null
	and psd.inspected_at is null
	and psd.shipped_at is null
	and psd.held_at is null
	and DATE(psi.pre_order_shipping_at) = '2023-08-10'
group by psi.id