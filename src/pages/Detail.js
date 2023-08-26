import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { useParams } from 'react-router-dom';

import { useContext, useState, useEffect } from 'react';
import { FBDbContext } from '../contexts/FBDbContext';
import { FBStorageContext } from '../contexts/FBStorageContext';
import { AuthContext } from '../contexts/AuthContext';

import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import '../styles/Detail.css'

export function Detail ( props ) {
    const [bookData, setBookData] = useState()

    let { bookId } = useParams()

    const FBDb = useContext(FBDbContext)
    const FBStorage = useContext(FBStorageContext)

    const bookRef = doc(FBDb, "books", bookId)

    const getBook = async (id) => {
        let book = await getDoc(bookRef)
        if (book.exists()) {
            setBookData(book.data())
        }
        else {
        // no book exists with the ID
        }
  }

    useEffect(() => {
        if (!bookData) {
        getBook(bookId)
        }
    })

    const Image = (props) => {
        const [imgPath,setImgPath] = useState()
        const imgRef = ref( FBStorage, `book_cover/${ props.path}`)
        getDownloadURL( imgRef).then ( (url ) => setImgPath (url))
    
        return (
            <img src={imgPath} alt= 'This the the iamge of the book cover' className='image'/>
        )
    }

    if (bookData) {
        return (
            <Container>
                <Row>
                    <Col md="2">
                        <Image path={bookData.image} />                    
                    </Col>
                    <Col>
                        <h2 className='title'>{bookData.title}</h2>
                        <h3 className='summary'>{bookData.summary}</h3>
                    </Col>
                </Row>
                <Row>
                    <Col md = "2">
                    <h3>Write a review</h3>
                    </Col>
                </Row>
            </Container>
        )
    }
    else {
        return (
          <Container>
            <Row>
              <Col>
                <h2>Loading...</h2>
              </Col>
            </Row>
          </Container>
        )
      }
    } 