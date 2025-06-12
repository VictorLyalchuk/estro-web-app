interface IUserProductRating {
    averageRating: number;
    totalCount: number;
    userProductCounts: UserProductCounts[];
}
interface UserProductCounts{
    rating: number;
    count: number;
}