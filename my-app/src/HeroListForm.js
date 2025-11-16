import React, { useState } from 'react';
import axios from 'axios';

const HeroListForm = () => {
    const [listName, setListName] = useState('');
    const [heroIds, setHeroIds] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState('private');
    const [rating, setRating] = useState('');
    const [reviewText, setReviewText] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const heroIdArray = heroIds.split(',').map(id => parseInt(id.trim(), 10));
        const validHeroIds = heroIdArray.filter(id => !isNaN(id));

        try {
            const listData = {
                id: validHeroIds,
                description,
                visibility,
                rating: parseInt(rating, 10),
                reviewText
            }
            const response = await axios.post(`http://localhost:3000/api/hero-lists/${listName}`,  listData );
            console.log(response.data); 
        } catch (error) {
            console.error(error);
        }
    };

return (
    <form onSubmit={handleSubmit}>
        <input
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="List Name"
            required
        />
        <input
            type="text"
            value={heroIds}
            onChange={(e) => setHeroIds(e.target.value)}
            placeholder="Enter hero IDs separated by commas"
            required
        />
        <input
            type = "text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
        />
        <label>
            Public:
            <input
                type="checkbox"
                checked={visibility === 'public'}
                onChange={(e) => setVisibility(e.target.checked ? 'public' : 'private')}
            />
        </label>
        <input
                type="number"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="Rating (1-10)"
                min="1"
                max="10"
                required
            />
        <input
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Add a review (optional)"
        />
        <button type="submit">Create/Update List</button>
    </form>
);
};

export default HeroListForm;