interface BookCardProps {
  book: string;
}
interface BookGridProps {
  books: string[];
}
const BookCard = ({ book }: BookCardProps) => {
  return <div className="">{book}</div>;
};

export const BookGrid = ({ books }: BookGridProps) => {
  const todoItems = books.map((book, index) => (
    <BookCard key={index} book={book}></BookCard>
  ));
  return <div className="">{todoItems}</div>;
};
