import Alert from 'react-bootstrap/Alert';
const MessageBox = ({ variant, children }) => {
  return (
    <div>
      <Alert variant={variant || 'info'}>{children}</Alert>
    </div>
  );
};

export default MessageBox;
