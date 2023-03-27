const db = require('../models');
const { user: User, column: Column, card: Card } = db;

const updateCardPositions = async (columnId, startPosition, source, id) => {
	try {
		// Get all the cards in the column and sort them by position
		const cards = await Card.findAll({ where: { columnId } });
		const sortedCards = cards.sort((a, b) => a.position - b.position);

		// Update the positions of the remaining cards in the column
		for (let i = startPosition; i < sortedCards.length; i++) {
			const card = sortedCards[i];
			if (card.position > startPosition && source === 'source' && card.id !== +id) {
				await card.update({ position: card.position - 1 });
			}
			if (card.position >= startPosition && source === 'destination' && card.id !== +id) {
				await card.update({ position: card.position + 1 });
			}
		}
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
};

const moveCard = async (req, res) => {
	try {
		// Get the card ID, source column ID, destination column ID, and new position from the request body
		const { id: cardId, source, destination, newPosition } = req.body;

		// Find the card in the database and update its position and column ID
		const card = await Card.findByPk(cardId);
		await card.update({
			position: newPosition,
			columnId: destination.droppableId,
		});

		// Update the positions of the remaining cards in the source column
		await updateCardPositions(source.droppableId, source.index, 'source', cardId);

		// Update the positions of the remaining cards in the destination column
		await updateCardPositions(destination.droppableId, destination.index, 'destination', cardId);

		res.status(200).json({ success: true });
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
};

module.exports = {
	moveCard,
	updateCardPositions,
};
