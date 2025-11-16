import React, { useState } from 'react';

const PublicHeroList = ({ list }) => {
    const [isVisible, setIsVisible] = useState(false);

    const renderPowers = (powers) => {
        if (!powers || Object.keys(powers).length === 0) {
            return <li>No powers listed</li>;
        }
        return Object.entries(powers)
            .filter(([_, value]) => value === 'True')
            .map(([key, _]) => <li key={key}>{key}</li>);
    };

    const toggleListVisibility = () => {
        setIsVisible(prevState => !prevState);
    };

    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) return 'No ratings yet';
        const total = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (total / reviews.length).toFixed(1);
    };

return (
<div key={list.name}>
    <h3>{list.name}</h3>
    <button onClick={toggleListVisibility}>
        {isVisible ? 'Hide Info' : 'Show Info'}
    </button>
    {isVisible && (
        <div>
            <p>Description: {list.description || "No description provided."}</p>
            <p>Visibility: {list.visibility}</p>
            <p>Average Rating: {calculateAverageRating(list.reviews)}</p>
            <h4>Reviews:</h4>
            {list.reviews.length > 0 ? list.reviews.map((review, index) => (
            !review.flagged && (
            <div key={index}>
            <p>Review: {review.review || 'No review text'}</p>
            </div>
            )
            )) : <p>No reviews yet</p>}
            <h4>Heroes:</h4>
            <ul>
            {list.heroes.map(hero => (
                <li key={hero.id}>
                <strong>{hero.name}</strong>
                <div>
                    <p>Gender: {hero.gender}</p>
                    <p>Race: {hero.race}</p>
                    <p>Publisher: {hero.publisher}</p>
                    <h5>Powers:</h5>
                    <ul>{renderPowers(hero.powers)}</ul>
                </div>
                </li>
            ))}
            </ul>
        </div>
    )}
</div>
);
};

export default PublicHeroList;