import Form from "react-bootstrap/Form"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import { doc, getDoc, setDoc } from "firebase/firestore";

import { useState, useEffect, useContext } from "react"
import { FBAuthContext } from "../contexts/FBAuthContext"
import { FBDbContext } from "../contexts/FBDbContext"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useNavigate } from "react-router-dom"

export function Signup(props) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [validEmail, setValidEmail] = useState(false)
    const [validPassword, setValidPassword] = useState(false)
    const [username, setUserName] = useState("")
    const [validUserName, setValidUserName] = useState(false)
    const [userNameFeedback, setUserNameFeedback] = useState()
    const [errorMessage, setErrorMessage] = useState("")
    const [isSubmitClicked, setIsSubmitClicked] = useState(false)

    const FBAuth = useContext(FBAuthContext)
    const FBDb = useContext(FBDbContext)
    const navigate = useNavigate ()

    const allowedChars = "abcdefghijklmnopqrstuvwxyz1234567890_-"
    // timer variable
    let timer
    // function to check Firebase if user already exists
    const checkUser = async (user) => {
        const ref = doc(FBDb, "usernames", user)
        const docSnap = await getDoc(ref)
        if (docSnap.exists()) {
            //user already exists
            // console.log("exists")
            setValidUserName(false)
            setUserNameFeedback("username is already taken")
        }
        else {
            // user doesn't exist
            // console.log("doesn't exist")
            setUserNameFeedback(null)
            setValidUserName(true)
        }
    }

    useEffect(() => {
        let userLength = false
        let illegalChars = []
        // check if the username is of a certain length
        if (username.length < 5) {
            userLength = false
        }
        else {
            userLength = true
        }
      // check if username is made of allowedChars
      const chars = Array.from(username)
      chars.forEach((chr) => {
        if (allowedChars.includes(chr) === false) {
          illegalChars.push (chr)
        }
      })
      // check if username does not exist in Firebase if the other two checks are true
      if (userLength === true && illegalChars.length === 0) {
        clearTimeout(timer)
        timer = setTimeout(() => { checkUser(username) }, 1500)
      }
      else {
        // User is not valid
        setValidUserName(false)
        setUserNameFeedback("Invalid username")
        }     
    }, [username])
    
    useEffect(() => {
        if(email.indexOf('@') > 0){
            setValidEmail(true)
        }
        else {
            setValidEmail (false)
        }
    }, [email] ) 

    useEffect(() => {
        if(password.length >= 8) {
            setValidPassword(true)
        }
        else {
            setValidPassword (false)
        }
    }, [password])

    const AddUserName = async () => {
        await setDoc(doc(FBDb, "usernames", username), {
          name: username
        })
      }

    const SignUpHandler = () => {
        setIsSubmitClicked(true)
        createUserWithEmailAndPassword(FBAuth, email, password)
        .then ((user) => {
            // user is created in Firebase
            // console.log (user)
            // alert user that account has been created
            AddUserName()
            navigate ("/")
        })
        .catch((error) => {
            if (error.code === "auth/email-already-in-use") {
                setErrorMessage ("Email address is already in use.")
                
            }
            else {
            console.log(error.code, error.message)}
        })
    }

    return (
        <Container fluid className="mt-4">
            <Row>
                <Col md = {{span: 4, offset:4}}>
                    <Form onSubmit={ (evt) => {
                        evt.preventDefault ()
                        SignUpHandler()
                        } }>
                        <h3>Sign up for an account</h3>
                        {/* Add the error message rendering here */}
                    {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div>
                    )}
                        {/* input for username */}
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="unique username"
                                onChange={(evt) => setUserName(evt.target.value)}
                                value={username}
                                isValid={validUserName}
                                isInvalid={(isSubmitClicked && !validUserName) && userNameFeedback !==null}
                            />
                            <Form.Control.Feedback type="invalid">{userNameFeedback}</Form.Control.Feedback>
                            <Form.Control.Feedback>Looks good</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email address</Form.Label>
                            <Form.Control 
                            type="email" 
                            placeholder="you@domain.com"
                            onChange={(evt) => setEmail(evt.target.value) }
                            value= {email}
                            isValid={validEmail}
                            isInvalid={(isSubmitClicked && !validEmail)}
                            /> 
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                            type="password"
                            placeholder="Choose a secure password"
                            onChange={(evt) => setPassword(evt.target.value)}
                            value= {password}
                            isValid={validPassword}
                            isInvalid={(isSubmitClicked && !validPassword)}
                            /> 
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="my-2 w-100" 
                            size="lg" 
                            //disabled = {(validEmail && validPassword && validUserName) ? false: true}
                        >
                            Sign up
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}