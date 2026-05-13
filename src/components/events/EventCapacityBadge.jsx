import React from 'react';
import { Tag } from '../ui/Tag';

export function EventCapacityBadge({ event }) {
  if (!event) return null;
  const { is_full, seats_left, few_seats_left, capacity } = event;
  if (is_full) {
    return <Tag tone="error">Completo</Tag>;
  }
  if (few_seats_left) {
    const left = typeof seats_left === 'number' ? seats_left : null;
    return (
      <Tag tone="warning">
        {left != null ? `Quedan ${left} plazas` : 'Quedan pocas plazas'}
      </Tag>
    );
  }
  if (typeof seats_left === 'number' && capacity) {
    return <Tag tone="default">{seats_left} plazas disponibles</Tag>;
  }
  return null;
}
