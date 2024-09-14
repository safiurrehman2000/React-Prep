import React, { useEffect, useState } from "react";
import axios from "axios";

const useDebounce = (value = "", delay = 500) => {
  const [debounce, setDebounce] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounce(value);
    }, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);
  return debounce;
};

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/posts"
        );
        console.log(response);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFormChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    console.log(search);
  }, [search]);

  const searchedItems = data.filter((item) => {
    return (
      item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.body.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  });

  if (loading) return <div>...loading</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <>
      <form>
        <input
          onChange={handleFormChange}
          type="text"
          name="search"
          value={search}
          placeholder="Search for a title"
        />
      </form>
      <h1>Data</h1>
      {searchedItems.length > 0 ? (
        searchedItems.map((item, index) => (
          <li style={{ listStyle: "none" }} key={index}>
            <h3>Title: </h3>
            {item.title}
            <br />
            <p>{item.body}</p>
          </li>
        ))
      ) : (
        <p>no items found</p>
      )}
    </>
  );
}
