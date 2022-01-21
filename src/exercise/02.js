// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import { useEffect } from 'react';

function useLocalStorageState(initialName) {
  const getNameFromLocalStorage = () => window.localStorage.getItem('name');
  const [name, setName] = React.useState(getNameFromLocalStorage ?? initialName);

  useEffect(() => {
    window.localStorage.setItem('name', name);
  }, [name]);

  return [name, setName];
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState(initialName);

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
