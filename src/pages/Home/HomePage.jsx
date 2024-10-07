function HomePage() {
  return (
    <div className="text-center">
      <h1 className="display-4">Welcome to Magnificent Restaurant</h1>
      <p className="lead">
        Explore our menu and reserve your table for a delightful dining experience.
      </p>
      <hr className="my-4" />
      <p>Discover a variety of starters, main courses, and desserts and pray that a table is available.</p>
      <a className="btn btn-primary btn-lg" href="/menu" role="button">
        View Menu
      </a>
      <hr className="my-4" />
      <a className="btn btn-primary btn-lg" href="/reserve" role="button">
        Reserve a Table
      </a>
    </div>
  );
}

export default HomePage;