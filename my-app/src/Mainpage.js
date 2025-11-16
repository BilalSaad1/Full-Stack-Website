import React, { useState, useEffect } from 'react'
import axios from 'axios'
import HeroListForm from './HeroListForm'
import HeroSearch from './HeroSearch'

const Mainpage = () => {
    const [heroLists, setHeroLists] = useState([])
    const [loading, setLoading] = useState(false)
    const [ratings, setRatings] = useState({})

    const fetchHeroesForList = async (heroIds) => {
        return Promise.all(heroIds.map(async (id) => {
            try {
                const response = await axios.get(`http://localhost:3000/api/superhero-info/search?id=${id}`)
                return response.data[0];
            } catch (error) {
                console.error('Error fetching hero:', error)
                return null;
            }
        })).then(heroes => heroes.filter(hero => hero !== null))
    };

    useEffect(() => {
        const fetchHeroLists = async () => {
            setLoading(true)
            try {
                const response = await axios.get('http://localhost:3000/api/hero-lists')
                const listsWithHeroes = await Promise.all(response.data.map(async (list) => {
                    const heroes = await fetchHeroesForList(list.heroes);
                    return { ...list, heroes, isVisible: false }
                }));
                setHeroLists(listsWithHeroes);
            } catch (error) {
                console.error('Error fetching hero lists:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchHeroLists();
    }, []);

    const toggleListVisibility = (listName) => {
        const updatedLists = heroLists.map(list => {
            if (list.name === listName) {
                return { ...list, isVisible: !list.isVisible }
            }
            return list
        });
        setHeroLists(updatedLists)
    };

    const handleListSave = (newList) => {
        setHeroLists([...heroLists, newList])
    };

    const handleRatingChange = (e, listName) => {
        setRatings({
            ...ratings,
            [listName]: e.target.value,
        });
    };
    const submitRating = async (listName) => {
        const rating = ratings[listName];
        if (rating) {
            try {
                await axios.post(`/api/hero-lists/${listName}`, { rating: parseInt(rating, 10) });
                alert('Rating submitted!');
            } catch (error) {
                console.error('Error submitting rating:', error);
                alert('Error submitting rating');
            }
        }
    };
    const renderPowers = (powers) => {
        if (!powers || Object.keys(powers).length === 0) {
            return <li>No powers listed</li>;
        }
        const powerList = Object.entries(powers).reduce((acc, [key, value]) => {
            if (value === 'True') {
                acc.push(<li key={key}>{key}</li>);
            }
            return acc;
        }, []);
        return powerList.length > 0 ? powerList : <li>No powers listed</li>;
    };
    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) return 'No ratings yet';
        const total = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (total / reviews.length).toFixed(1);
    };
    const handleDeleteList = async (listName) => {
        try {
            await axios.delete(`http://localhost:3000/api/hero-lists/${listName}`);
            setHeroLists(heroLists.filter(list => list.name !== listName));
        } catch (error) {
            console.error('Error deleting list:', error);
        }
    };
return (
<div>
<h2>Authenticated user</h2>
<HeroSearch/>
<HeroListForm onListSave={handleListSave} />
{loading ? <p>Loading hero lists...</p> : heroLists.map(list => (
<div key={list.name}>
    <h3>{list.name}</h3>
    <button onClick={() => toggleListVisibility(list.name)}>
        {list.isVisible ? 'Hide' : 'Show'} List Info
    </button>
    <button onClick={() => handleDeleteList(list.name)}>Delete List</button>
    {list.isVisible && (
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
)) : <p>No reviews yet.</p>}
    <h4>Heroes:</h4>
    <ul>
        {list.heroes.map(hero => (
            <li key={hero.id}>
                <strong>{hero.name}</strong>
                <p>Gender: {hero.gender}</p>
                <p>Race: {hero.race}</p>
                <p>Publisher: {hero.publisher}</p>
                <h5>Powers:</h5>
                <ul>{renderPowers(hero.powers)}</ul>
            </li>
        ))}
    </ul>
    <div>
        <input 
            type="number" 
            min="1" 
            max="10" 
            value={ratings[list.name] || ''} 
            onChange={e => handleRatingChange(e, list.name)}
        />
        <button onClick={() => submitRating(list.name)}>Rate</button>
    </div>
</div>
    )}
</div>
))}
</div>
);
};

export default Mainpage;