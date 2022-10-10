import React, { useEffect, useState } from 'react';

import Tasks from './components/Tasks/Tasks';
import NewTask from './components/NewTask/NewTask';
import useHttp from './hooks/use-http';

function App() {
  const [tasks, setTasks] = useState([]);

  const { isLoading, error, sendRequest: fetchTasks } = useHttp();

  useEffect(() => {
    const transformTasks = ((tasksObj) => {
      const loadedTasks = [];
  
        for (const taskKey in tasksObj) {     //for in loop we loop the tasksObj
          loadedTasks.push({ id: taskKey, text: tasksObj[taskKey].text });
        }
        //with this we transform all the task from object (which we get back from firebase) into object state have those structure which we need for our frontend
        setTasks(loadedTasks);
      });

    fetchTasks(
      { url: 'https://react-http-example-95446-default-rtdb.firebaseio.com/tasks.json' },
      transformTasks
    );
  }, [fetchTasks]);

  const taskAddHandler = (task) => {
    setTasks((prevTasks) => prevTasks.concat(task));
  };

  return (
    <React.Fragment>
      <NewTask onAddTask={taskAddHandler} />
      <Tasks
        items={tasks}
        loading={isLoading}
        error={error}
        onFetch={fetchTasks}
      />
    </React.Fragment>
  );
}

export default App;

//useHttp hook line-9 should have 1st argument so we pass an standerd javascript object and in this property url
//we also expect the method,headers & body
//but for Get/fetch data we have GET request and for that we dont need method,headers,body
//we need it for POST request (send data to database)
//transformTasks function is 2nd argument that we need to useHttp (line 23)
//then this function will be called for us by the custom hook whenever we got a response
//useEffect in line 27 will create infinite loop if we pass the dependency
//to avoid this we use useCallback in useHttp