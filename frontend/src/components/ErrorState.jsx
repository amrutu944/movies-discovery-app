export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="empty-state empty-state--error">
      <div className="empty-state__icon">⚠️</div>
      <h3 className="empty-state__title">We hit a snag</h3>
      <p className="empty-state__message">{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--primary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
