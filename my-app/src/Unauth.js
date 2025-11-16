import React, { useState, useEffect  } from 'react';
import PublicHeroList from './PublicHeroList';
import axios from 'axios';

const Unauth = () => {
const [nameQuery, setNameQuery] = useState('');
const [raceQuery, setRaceQuery] = useState('');
const [powerQuery, setPowerQuery] = useState('');
const [publisherQuery, setPublisherQuery] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [showResult, setshowResult] = useState(true);
const [publicHeroLists, setPublicHeroLists] = useState([]);
const [loadingPublicLists, setLoadingPublicLists] = useState(false);

const fetchHeroesForList = async (heroIds) => {
    return Promise.all(heroIds.map(async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/superhero-info/search?id=${id}`)
            return response.data[0];
        } catch (error) {
            console.error('Error fetching hero:', error);
            return null;
        }
    })).then(heroes => heroes.filter(hero => hero !== null));
};

useEffect(() => {
    const fetchPublicHeroLists = async () => {
        setLoadingPublicLists(true);
        try {
            const response = await axios.get('http://localhost:3000/api/hero-lists/public');
            const listsWithHeroes = await Promise.all(response.data.map(async (list) => {
                const heroes = await fetchHeroesForList(list.heroes);
                return { ...list, heroes };
            }));
            setPublicHeroLists(listsWithHeroes);
        } catch (error) {
            console.error('Error fetching public hero lists:', error);
        } finally {
            setLoadingPublicLists(false);
        }
    };

    fetchPublicHeroLists();
}, []);

const handleSearch = async () => {
const queryString = `name=${encodeURIComponent(nameQuery)}&race=${encodeURIComponent(raceQuery)}&power=${encodeURIComponent(powerQuery)}&publisher=${encodeURIComponent(publisherQuery)}`;

try {
    const response = await fetch(`http://localhost:3000/api/superhero-info/search?${queryString}`);
    const data = await response.json();
    if (data) {
        setSearchResults(data);
    } else {
        setSearchResults([]);
    }
} catch (error) {
    console.error('Fetch error:', error);
    alert('Error fetching search results: ' + error.message);
}
};

const toggleInfo = (index) => {
const updatedResults = [...searchResults];
updatedResults[index].expanded = !updatedResults[index].expanded;
setSearchResults(updatedResults);
};

const searchOnDDG = (heroName) => {
const ddgSearchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(heroName)}`;
window.open(ddgSearchUrl, '_blank');
};

const toggleResultsVisibility = () => {
    setshowResult(!showResult);
};

return (
<div>
    <h2>Unauthenticated user</h2>
    <div>
    <input type="text" placeholder="Name..." value={nameQuery} onChange={(e) => setNameQuery(e.target.value)} />
    <input type="text" placeholder="Race..." value={raceQuery} onChange={(e) => setRaceQuery(e.target.value)} />
    <input type="text" placeholder="Power..." value={powerQuery} onChange={(e) => setPowerQuery(e.target.value)} />
    <input type="text" placeholder="Publisher..." value={publisherQuery} onChange={(e) => setPublisherQuery(e.target.value)} />
    <button onClick={handleSearch}>Search</button>
    </div>
    <button onClick={toggleResultsVisibility}>
    {showResult ? 'Hide Results' : 'Show Results'}
    </button>
    {showResult && (
    searchResults.length > 0 ? (
    <div>
    <h3>Search Results:</h3>
    {searchResults.map((result, index) => (
        <div key={index}>
        <h4>Name: {result.name}</h4>
        <h4>Publisher: {result.publisher}</h4>
        <button onClick={() => toggleInfo(index)}>
            {result.expanded ? 'Hide Info' : 'Show Info'}
        </button>
        <button onClick={() => searchOnDDG(result.name)}>Search on DDG</button>
        {result.expanded && (
            <div>
            <p>Gender: {result.gender}</p>
            <p>Race: {result.race}</p>
            <p>Alignment: {result.alignment}</p>
            <p>Height: {result.height}</p>
            <p>Weight: {result.weight}</p>
            <h5>Powers:</h5>
            <ul>
                {Object.entries(result.powers).map(([key, value]) => value === 'True' && <li key={key}>{key}</li>)}
            </ul>
            </div>
        )}
            </div>
        ))}
        </div>
    ) : (
        <div>No results found</div>
    )
    )}
    <h2>Public Hero Lists</h2>
            {loadingPublicLists ? <p>Loading public hero lists...</p> : publicHeroLists.map(list => (
                <PublicHeroList key={list.name} list={list} />
            ))}
</div>
);}

export default Unauth;