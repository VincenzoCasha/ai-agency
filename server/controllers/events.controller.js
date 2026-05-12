'use strict';

const eventService = require('../services/event.service');
const notification = require('../services/notification.service');
const { createProblem } = require('../utils/problem');

async function list(req, res) {
  const items = await eventService.listUpcoming(50);
  res.json({ items });
}

async function getBySlug(req, res) {
  const event = await eventService.getActiveBySlug(req.params.slug);
  if (!event) {
    return res.status(404).type('application/problem+json').json(
      createProblem({
        status: 404,
        title: 'Not Found',
        detail: 'Evento no encontrado o no disponible.',
        instance: req.path,
      }),
    );
  }
  res.json(event);
}

async function createReservation(req, res) {
  const result = await eventService.createReservation(req.params.slug, req.body);
  await notification.notifyNewEventReservation({
    id: result.id,
    eventSlug: req.params.slug,
    name: req.body.name,
    email: req.body.email,
    party_size: req.body.party_size,
  });
  res.status(201).json({ id: result.id, status: 'NEW', event: { slug: result.event.slug, seats_left: result.event.seats_left - req.body.party_size } });
}

module.exports = { list, getBySlug, createReservation };
