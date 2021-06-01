import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import Button from './Button';

const Header = ({ title, onClick, showAddTask }) => {
	const userLocation = useLocation();
	return (
		<header className="header">
			<h1>{title}</h1>
			{userLocation.pathname === '/' && (
				<Button
					color={!showAddTask ? 'green' : 'red'}
					text={!showAddTask ? 'Add' : 'Close'}
					onClick={onClick}
					showAddTask={showAddTask}
				/>
			)}
		</header>
	);
};

Header.defaultProps = {
	title: 'Task Tracker',
};

Header.propTypes = {
	title: PropTypes.string.isRequired,
};

export default Header;
