import React from "react";
import styles from "./App.module.scss";
import Header from "./components/Header/Header";
import TaskForm from "./features/task/taskForm/TaskForm";
import TaskList from "./features/task/taskList/TaskList";


import {auth} from './firebase'

const App: React.FC = () => {
  console.log(auth);
  
  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <Header />
        <TaskForm />
        <TaskList />
      </div>
    </div>
  );
};

export default App;
