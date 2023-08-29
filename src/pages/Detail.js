import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card'

import { ReviewForm } from '../Components/ReviewForm';

import { useParams } from 'react-router-dom';

import { useContext, useState, useEffect } from 'react';
import { FBDbContext } from '../contexts/FBDbContext';
import { FBStorageContext } from '../contexts/FBStorageContext';
import { AuthContext } from '../contexts/AuthContext';
import { FBAuthContext } from '../contexts/FBAuthContext';

import { doc, getDoc, addDoc, collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from 'firebase/auth';

export function Detail ( props ) {
    const [movieData, setMovieData] = useState()
    const [auth, setAuth] = useState()
    const [movieReviews, setMovieReviews] = useState ([])

    let { movieId } = useParams()

    const FBDb = useContext(FBDbContext)
    const FBStorage = useContext(FBStorageContext)
    const FBAuth = useContext(FBAuthContext)

    onAuthStateChanged( FBAuth, (user) => {
      if( user ) {
        // user is signed in
        setAuth(user)
      }
      else {
        // user is not signed in
        setAuth(null)
      }
    })

    const getReviews = async () => {
      const path = `movies/${movieId}/reviews`
      const querySnapshot = await getDocs( collection(FBDb, path) )
      let reviews = []
      querySnapshot.forEach( (item) => {
        let review = item.data()
        review.id = item.id
        reviews.push( review )
      })
      setMovieReviews( reviews )
    }

    // reviews collection
    const ReviewCollection = movieReviews.map((item) => {
      return (
        <Col md="3">
          <Card>
            <Card.Body>
              <Card.Title>
                <h5>{item.title}</h5>
              </Card.Title>
              <Card.Text>
                <p>{item.content}</p>
                <p>{item.stars}</p>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      )
    })
    
    const movieRef = doc(FBDb, "movies", movieId)

    const getMovie = async (id) => {
        let movie = await getDoc(movieRef)
        if (movie.exists()) {
            setMovieData(movie.data())
            getReviews ()
        }
        else {
        // no movie exists with the ID
        }
  }

    useEffect(() => {
        if (!movieData) {
        getMovie(movieId)
        }
    })

      // funciton to handle review submission
      const ReviewHandler = async ( reviewData ) => {
        //create a document inside firestore
        const path =`movies/${movieId}/reviews`
        const review = await addDoc ( collection(FBDb, path), reviewData )
        // when the user submits a new review, refresh the reviews
        getReviews()
      }

    const Image = (props) => {
        const [imgPath,setImgPath] = useState()
        const imgRef = ref( FBStorage, `movie_poster/${ props.path}`)
        getDownloadURL( imgRef).then ( (url ) => setImgPath (url))
    
        return (
            <img src={imgPath} alt= 'This the the iamge of the movie poster' className='img-fluid'/>
        )
    }

    if (movieData) {
        return (
            <Container>
                <Row className='my-3'>
                    <Col md="4">
                        <Image path={movieData.image} />                    
                    </Col>
                    <Col md="8">
                        <h2>{movieData.title}</h2>
                        <h4>Cast: {movieData.cast}</h4>
                        <p>Genre: {movieData.genre}</p>
                        <p>Director: {movieData.director}</p>
                        <p>Producer: {movieData.producer}</p>
                        <p>{movieData.synopsis}</p>
                        <p>IMDB: {movieData.imdb}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md = "4">
                    <ReviewForm user={auth} handler={ReviewHandler}/>
                    </Col>
                </Row>
                <Row>
                  {/* reviews to appear here */}
                  {ReviewCollection}
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