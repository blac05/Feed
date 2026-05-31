import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Fetch all available timeline events
export const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' }
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to balance downstream system event logs.' });
  }
};

// Create a new event context (Restricted to verified publishers/organizations)
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, ticketPrice, ticketsLeft } = req.body;

    if (!title || !date || !location || ticketPrice === undefined || !ticketsLeft) {
      return res.status(400).json({ error: 'Incomplete structural data arrays for event creation.' });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        ticketPrice: parseFloat(ticketPrice),
        ticketsLeft: parseInt(ticketsLeft)
      }
    });

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: `Event Injection Pipeline Error: ${error.message}` });
  }
};

// Handle Event Ticketing and Secure Checkouts
export const purchaseTicket = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    // 1. Locate specified event instance
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return res.status(404).json({ error: 'Target booking execution failed: Event index not found.' });
    }

    // 2. Enforce capacity limit boundaries
    if (event.ticketsLeft <= 0) {
      return res.status(400).json({ error: 'Transaction rejected. Target event capacity completely full.' });
    }

    // 3. Execute secure database updates across files simultaneously using an isolated sequence transaction
    const [updatedEvent, ticketReceipt] = await prisma.$transaction([
      prisma.event.update({
        where: { id: eventId },
        data: { ticketsLeft: { decrement: 1 } }
      }),
      prisma.ticket.create({
        data: {
          eventId,
          userId
        },
        include: {
          event: true
        }
      })
    ]);

    res.status(201).json({
      message: 'Ticket successfully processed.',
      receiptId: ticketReceipt.id,
      eventDetails: {
        title: updatedEvent.title,
        location: updatedEvent.location,
        remainingAllocation: updatedEvent.ticketsLeft
      }
    });

  } catch (error) {
    res.status(500).json({ error: `Ticketing Engine Processing Defect: ${error.message}` });
  }
};