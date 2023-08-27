import Form from 'react-bootstrap/Form'

export function ReviewForm( props ) {
  if( props.user ) {
    return(
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Review Title</Form.Label>
          <Form.Control type="email" placeholder="name@example.com" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Review Body</Form.Label>
          <Form.Control as="textarea" rows={3} />
        </Form.Group>
      </Form>
    )
  }
  else {
    return null
  }
}