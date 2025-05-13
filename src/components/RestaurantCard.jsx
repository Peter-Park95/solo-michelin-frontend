function RestaurantCard({ data, rating }) {
  return (
    <div className="restaurant-card">
      <img src={data.imageUrl} alt={data.name} className="thumbnail" />
      <div className="info">
        <h3>{data.name}</h3>
        <p>{data.description}</p>
        <p>내 평점: ⭐ {rating}</p>
        <p>전체 평점: ⭐ {data.avgRating} ({data.reviewCount})</p>
      </div>
    </div>
  );
}
export default RestaurantCard;