import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ReviewForm } from '../components/ReviewForm';

import { useParams } from 'react-router-dom';

import { useContext, useState, useEffect } from 'react';
import { FBDbContext } from '../contexts/FBDbContext';
import { FBStorageContext } from '../contexts/FBStorageContext';
import { AuthContext } from '../contexts/AuthContext';
import { FBAuthContext } from '../contexts/FBAuthContext';

import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from 'firebase/auth';

import '../styles/Detail.css'

export function Detail ( props ) {
    const [movieData, setMovieData] = useState()
    const [auth, setAuth] = useState()

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

    const movieRef = doc(FBDb, "movies", movieId)

    const getMovie = async (id) => {
        let movie = await getDoc(movieRef)
        if (movie.exists()) {
            setMovieData(movie.data())
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

    const Image = (props) => {
        const [imgPath,setImgPath] = useState()
        const imgRef = ref( FBStorage, `movie_poster/${ props.path}`)
        getDownloadURL( imgRef).then ( (url ) => setImgPath (url))
    
        return (
            <img src={imgPath} alt= 'This the the iamge of the movie poster' className='image'/>
        )
    }

    if (movieData) {
        return (
            <Container>
                <Row>
                    <Col md="2">
                        <Image path={movieData.image} />                    
                    </Col>
                    <Col>
                        <h2 className='title'>{movieData.title}</h2>
                        <h3 className='synopsis'>{movieData.synopsis}</h3>
                    </Col>
                </Row>
                <Row>
                    <Col md = "2">
                    <ReviewForm user={auth}/>
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