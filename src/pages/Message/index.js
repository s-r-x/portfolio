import React, { PureComponent } from 'react';
import './index.less';
import { connect } from 'react-redux';
import dict from '../../translations';
import { MAIL_URL }  from '../../constants';


const Spinner = () => (
  <div className="spinner">
    <div className="bounce1"></div>
    <div className="bounce2"></div>
    <div className="bounce3"></div>
  </div>
);
class MessagePage extends PureComponent {
  constructor() {
    super();
    this.state = {
      email: '',
      message: '',
      isSubmitting: false,
    };
    this.emailChange = this.emailChange.bind(this);
    this.messageChange = this.messageChange.bind(this);
    this.submit = this.submit.bind(this);
  }
  emailChange({ target }) {
    this.setState({ email: target.value });
  }
  messageChange({ target }) {
    this.setState({ message: target.value });
  }
  submit(e) {
    e.preventDefault();
    const { email, message, isSubmitting } = this.state;
    if(isSubmitting) {
      return;
    }
    this.setState({ isSubmitting: true });
    const { lang } = this.props;
    const th = this;

    const xhr = new XMLHttpRequest();
    const payload = JSON.stringify({
      email, 
      msg: message,
    });
    xhr.open('POST', MAIL_URL, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(payload);

    xhr.onload = function() {
      if(this.responseText === 'hop hop la la lei') {
        alert(dict.message_success[lang]);
        th.setState({ 
          email: '',
          message: '',
        });
      }
      else {
        alert(dict.message_fail[lang]);
      }
    }
    xhr.onerror = e => {
      alert(dict.message_fail[lang]);
    }
    xhr.onloadend = () => th.setState({ isSubmitting: false });
  }
  render() {
    const { lang } = this.props;
    const { email, message, isSubmitting } = this.state;
    return (
      <section className="message">
        <form onSubmit={this.submit} method="POST">
          <div className="message--form-sect">
            <label htmlFor="message_email">
              {dict.message_email[lang]}
            </label>
            <input 
              onChange={this.emailChange}
              type="email" 
              id="message_email" 
              value={email}
              required
              placeholder={dict.message_email[lang]}/>
          </div>
          <div className="message--form-sect">
            <label htmlFor="message_text">
              {dict.message_payload[lang]}
            </label>
            <textarea 
              required
              onChange={this.messageChange}
              id="message_text" 
              value={message}
              placeholder={dict.message_payload[lang]}/>
          </div>
          {isSubmitting ? <Spinner/> : <button type="submit">{dict.message_send[lang]}</button>}
        </form>
      </section>
    )
  }
}

const mapStateToProps = ({ lang }) => ({
  lang
});
export default connect(mapStateToProps, null)(MessagePage);
