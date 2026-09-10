import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';

export default function NotFound() {
  return (
    <div className="page">
      <EmptyState
        icon="🎞️"
        title="Page not found"
        message="That reel doesn't exist. Let's get you back to discovering movies."
        action={
          <Link to="/" className="btn btn--primary">
            Back to Discover
          </Link>
        }
      />
    </div>
  );
}
