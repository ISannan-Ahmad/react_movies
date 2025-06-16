import React, { useState, useEffect } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard';


const API_BASE_URL = 'https://api.themoviedb.org/3';
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_OPTIONS = {
    method : 'GET',
    headers : {
      accept : 'application/json',
      Authorization : `Bearer ${API_KEY}`
    }
  }

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isloading, setisLoading] = useState(false);


  const fetchMovies = async () => {
    setErrorMessage('');
    setisLoading(true);
    
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok){
        throw new Error("Failed to fetch movies.");
      }
      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || "Failed to fetch movies.");
        setMovieList([]);
        return;
      }

      setMovieList(data.results);

    } catch (error) {
      console.error(`Error Fetching Movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later. ");
    } finally {
      setisLoading( );
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [])

  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className='text-gradient'>Movies</span> You'll Enjoy without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className='all-movies'>
          <h1 className='mt-[40px]' >All Movies</h1>
          
          {
            isloading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className='text-red-500' >{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )
          }
        </section>

      </div>
    </main>
  )
}

export default App
