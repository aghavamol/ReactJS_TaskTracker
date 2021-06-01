import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Tasks from './components/Tasks';
import AddTaskItem from './components/AddTaskItem';
import About from './components/About';

function App() {
	const [showAddTask, setShowAddTask] = useState(false);

	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		console.log('inside useEffect');

		const getTasks = async () => {
			const tasksFromServer = await fetchTasks();
			setTasks(tasksFromServer);
		};

		getTasks();
	}, []);

	const fetchTasks = async () => {
		const res = await fetch('http://localhost:5000/tasks');
		const data = await res.json();
		return data;
	};

	const fetchTask = async (id) => {
		const res = await fetch(`http://localhost:5000/tasks/${id}`);
		const data = await res.json();
		return data;
	};

	const deleteTask = async (id) => {
		await fetch(`http://localhost:5000/tasks/${id}`, {
			method: 'DELETE',
		});

		setTasks(
			tasks.filter((task) => {
				return task.id !== id;
			})
		);
	};

	const toggleReminder = async (id) => {
		const taskToToggle = await fetchTask(id);
		const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder };

		const res = await fetch(`http://localhost:5000/tasks/${id}`, {
			method: 'PUT',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify(updatedTask),
		});
		const data = await res.json();

		setTasks(
			tasks.map((task) => {
				return task.id === id ? { ...task, reminder: data.reminder } : task;
			})
		);
	};

	const addTask = async (task) => {
		console.log('inside addTask');

		const res = await fetch('http://localhost:5000/tasks', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify(task),
		});

		const data = await res.json();
		setTasks([...tasks, data]);
		setShowAddTask(!showAddTask);
	};

	const toggleAddTaskForm = () => {
		console.log('inside toggleATF');
		setShowAddTask(!showAddTask);
	};

	return (
		<Router>
			<div className="container">
				<Header onClick={toggleAddTaskForm} showAddTask={showAddTask} />

				<Route
					path="/"
					exact
					render={(props) => (
						<>
							{showAddTask && <AddTaskItem onAdd={addTask} />}
							{tasks.length > 0 ? (
								<Tasks
									tasks={tasks}
									onDelete={deleteTask}
									onToggle={toggleReminder}
								/>
							) : (
								<h3 align="center">No tasks found</h3>
							)}
						</>
					)}
				/>

				<Route path="/about" component={About} />

				<Footer />
			</div>
		</Router>
	);
}

export default App;
