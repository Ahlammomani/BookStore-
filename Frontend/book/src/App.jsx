import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookCatalog = () => {
  const [bookDetails, setBookDetails] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [description, setDescription] = useState('');
  const [editBook, setEditBook] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:7000/book_details')
      .then(response => {
        setBookDetails(response.data);
      })
      .catch(error => {
        console.error('Error fetching book details!', error);
      });
  }, []);

  const addBook = () => {
    axios.post('http://localhost:7000/book_details', { title, author, genre, publication_date: publicationDate, description })
      .then(response => {
        setBookDetails([...bookDetails, response.data]);
        setTitle('');
        setAuthor('');
        setGenre('');
        setPublicationDate('');
        setDescription('');
      })
      .catch(error => {
        console.error('Error adding book!', error);
      });
  };

  const editBookDetails = (book) => {
    setEditBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setPublicationDate(book.publication_date);
    setDescription(book.description);
  };

  const updateBook = () => {
    if (editBook) {
      axios.put(`http://localhost:7000/book_details/${editBook.id}`, { title, author, genre, publication_date: publicationDate, description })
        .then(response => {
          const updatedBookDetails = bookDetails.map(b => 
            b.id === editBook.id ? response.data : b
          );
          setBookDetails(updatedBookDetails);
          setEditBook(null);
          setTitle('');
          setAuthor('');
          setGenre('');
          setPublicationDate('');
          setDescription('');
        })
        .catch(error => {
          console.error('Error updating book!', error);
        });
    }
  };

  const deleteBook = (id) => {
    axios.delete(`http://localhost:7000/book_details/${id}`)
      .then(() => {
        setBookDetails(bookDetails.filter(b => b.id !== id));
      })
      .catch(error => {
        console.error('Error deleting book!', error);
      });
  };

  return (
    <div>
      <h1>Book Catalog</h1>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
      <input type="text" placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
      <input type="date" placeholder="Publication Date" value={publicationDate} onChange={(e) => setPublicationDate(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
      <button onClick={editBook ? updateBook : addBook}>
        {editBook ? 'Update Book' : 'Add Book'}
      </button>
      <h2>Book List</h2>
      <ul>
        {bookDetails.map(book => (
          <li key={book.id}>
            {book.title} - {book.author} - {book.genre} - {book.publication_date}
            <button onClick={() => editBookDetails(book)}>Edit</button>
            <button onClick={() => deleteBook(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookCatalog;
