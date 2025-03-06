import axios, { CanceledError } from "axios";
import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // controllers allowed as to abort or cancell assincronous operations
    const controller = new AbortController()

    setLoading(true)

    axios
      .get<User[]>("https://jsonplaceholder.typicode.com/users", {signal: controller.signal})
      .then((res) =>{
        setUsers(res.data)
        setLoading(false)
      })
      .catch((err) => {
        if(err instanceof CanceledError) return
        setError(err.message)
        setLoading(false)
      })
      
      return () => controller.abort()
  }, []);

  return (
    <>
      {error && <p className="text-danger">{error}</p>}
      {loading && <div className="spinner-border">{loading}</div>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
