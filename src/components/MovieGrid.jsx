import MovieCard from './MovieCard.jsx'

export default function MovieGrid({ items, onOpen, loading, emptyTitle, emptySub }) {
  if (loading) {
    return <div className="spinner" role="status" aria-label="loading" />
  }

  if (!items.length) {
    return (
      <div className="empty-state">
        <h3>{emptyTitle}</h3>
        <p>{emptySub}</p>
      </div>
    )
  }

  return (
    <div className="grid">
      {items.map((item) => (
        <MovieCard key={item.id} item={item} onOpen={onOpen} />
      ))}
    </div>
  )
}
