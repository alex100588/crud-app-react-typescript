import axios, { CanceledError } from "axios";
import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  // username:string
  // email: string
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // controllers allowed as to abort or cancell assincronous operations
    const controller = new AbortController();

    setLoading(true);

    axios
      .get<User[]>("https://jsonplaceholder.typicode.com/users", {
        signal: controller.signal,
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  // delete users
  const deleteUser = (user: User) => {
    const originalUsers = [...users];

    setUsers(users.filter((u) => u.id !== user.id));
    axios
      .delete("https://jsonplaceholder.typicode.com/users/" + user.id)
      .catch((error) => {
        setError(error.message);
        setUsers(originalUsers);
      });
  };

  const addUser = () => {
    const originalUsers = [...users];
    const newUser = { id: 0, name: "Alex" };
    setUsers([newUser, ...users]);

    axios
      .post("https://jsonplaceholder.typicode.com/users", newUser)
      .then((res) => setUsers([res.data, ...users]))
      .catch((err) => {
        setError(err.message);
        setUsers(originalUsers);
      });
  };

  const updateUser = (user: User) =>{
    const originalUsers = [...users];
    const updatedUser = {...user, name: user.name + '!'}
    setUsers(users.map(u => u.id === user.id ? updatedUser : u))

    axios.patch("https://jsonplaceholder.typicode.com/users/" + user.id, updatedUser)
    .catch((err) => {
      setError(err.message);
      setUsers(originalUsers);
    });
  }

  return (
    <>
      <h1 className="text-center pt-3">Users CRUD app</h1>
      {error && <p className="text-danger">{error}</p>}
      {loading && <div className="spinner-border">{loading}</div>}
      <button className="btn btn-primary mb-3 ms-5" onClick={() => addUser()}>
        Add
      </button>
      <ul className="list-group p-5">
        {users.map((user) => (
          <li
            key={user.id}
            className="list-group-item d-flex justify-content-between"
          >
            {user.name}{" "}
            <div>
              <button className="btn btn-outline-secondary mx-2" onClick={()=>updateUser(user)}>Update</button>
              <button
                className="btn btn-outline-danger"
                onClick={() => deleteUser(user)}
              >
                Delete
              </button>{" "}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
